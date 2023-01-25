import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IconSort } from 'hds-react';
import {
  ApiDatePeriod,
  Language,
  Resource,
  UiDatePeriodConfig,
  DatePeriod,
  ResourceState,
} from '../../common/lib/types';
import './OpeningHoursForm.scss';
import {
  apiDatePeriodToDatePeriod,
  byWeekdays,
  datePeriodToApiDatePeriod,
  datePeriodToRules,
} from '../../common/helpers/opening-hours-helpers';
import toast from '../notification/Toast';
import NormalOpeningHoursValidity from '../normal-opening-hours-validity/NormalOpeningHoursValidity';
import OpeningHoursTitles from './OpeningHoursTitles';
import OpeningHoursFormPreviewMobile from '../opening-hours-form-preview/OpeningHoursFormPreviewMobile';
import ResourceTitle from '../resource-title/ResourceTitle';
import { useAppContext } from '../../App-context';
import useReturnToResourcePage from '../../hooks/useReturnToResourcePage';
import OpeningHoursFormActions from './OpeningHoursFormActions';
import ExceptionOpeningHoursValidity from '../exception-opening-hours-validity/ExceptionOpeningHoursValidity';
import OpeningHours from './OpeningHours';
import OpeningHoursFormPreview from '../opening-hours-form-preview/OpeningHoursFormPreview';
import { SupplementaryButton } from '../button/Button';
import useMobile from '../../hooks/useMobile';

export type FormConfig = {
  exception: boolean;
  defaultValues: DatePeriod;
  texts: {
    submit: {
      notifications: {
        success: string;
        error: string;
      };
    };
    title: {
      placeholders: {
        fi: string;
        sv: string;
        en: string;
      };
    };
  };
};

export type OpeningHoursFormProps = {
  config: FormConfig;
  datePeriod?: ApiDatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  submitFn: (values: ApiDatePeriod) => Promise<ApiDatePeriod>;
  resource: Resource;
};

const OpeningHoursForm = ({
  config,
  datePeriod,
  datePeriodConfig,
  submitFn,
  resource,
}: {
  config: FormConfig;
  datePeriod?: ApiDatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  submitFn: (values: ApiDatePeriod) => Promise<ApiDatePeriod>;
  resource: Resource;
}): JSX.Element => {
  const { language = Language.FI } = useAppContext();
  const defaultValues: DatePeriod = datePeriod
    ? apiDatePeriodToDatePeriod(datePeriod)
    : config.defaultValues;

  const [isSaving, setSaving] = useState(false);
  const form = useForm<DatePeriod>({
    defaultValues,
  });
  const { clearErrors, getFieldState, setValue, trigger, watch } = form;
  const isMobile = useMobile();
  const {
    resourceState: { options: resourceStates = [] },
  } = datePeriodConfig;
  const formValues = watch();
  const { fixed, startDate, endDate } = formValues;
  const { isDirty: endDateDirty } = getFieldState('endDate', form.formState);
  const returnToResourcePage = useReturnToResourcePage();
  const rules = datePeriodToRules(defaultValues);

  const onSubmit = (values: DatePeriod): void => {
    if (!resource) {
      throw new Error('Resource not found');
    }
    setSaving(true);
    submitFn(datePeriodToApiDatePeriod(resource?.id, values))
      .then(() => {
        toast.success({
          dataTestId: 'opening-period-form-success',
          label: config.texts.submit.notifications.success,
        });
        returnToResourcePage();
      })
      .catch(() => {
        toast.error({
          dataTestId: 'opening-period-form-error',
          label: config.texts.submit.notifications.error,
        });
      })
      .finally(() => setSaving(false));
  };

  const sortOpeningHours = () => {
    setValue('openingHours', [...formValues.openingHours].sort(byWeekdays));
    toast.info({
      label: 'Päiväryhmät järjestetty viikonpäivien mukaan',
      position: 'bottom-right',
    });
  };

  useEffect(() => {
    // Validate only when end date has been changed so no annoying validation before the field is actually touched.
    // This would otherwise happen when the user initially changes the start date to be after the end date.
    if (endDate && endDateDirty) {
      trigger('endDate');
    }
  }, [endDateDirty, startDate, endDate, trigger]);

  useEffect(() => {
    if (!fixed) {
      setValue('endDate', null);
      clearErrors('endDate');
    }
  }, [fixed, clearErrors, setValue]);

  return (
    (resource && datePeriodConfig && (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="opening-hours-form">
            <ResourceTitle
              language={language}
              resource={resource}
              titleAddon={formValues.name[language] || undefined}>
              <OpeningHoursFormPreviewMobile
                datePeriod={formValues}
                language={language}
                resourceStates={resourceStates}
              />
            </ResourceTitle>
            <section className="opening-hours-form__content">
              <div className="card">
                <p className="required-fields-text">
                  Tähdellä (*) merkityt kohdat ovat pakollisia.
                </p>
              </div>
              <OpeningHoursTitles
                placeholders={{
                  fi: config.texts.title.placeholders.fi,
                  sv: config.texts.title.placeholders.sv,
                  en: config.texts.title.placeholders.en,
                }}
              />
              {config.exception ? (
                <ExceptionOpeningHoursValidity />
              ) : (
                <NormalOpeningHoursValidity />
              )}
              {formValues.resourceState !== ResourceState.CLOSED && (
                <div className="opening-hours-form__fields">
                  <section className="opening-hours-section">
                    <OpeningHours
                      rules={rules}
                      resourceStates={resourceStates}
                    />
                  </section>
                  <aside className="opening-hours-form__aside">
                    <OpeningHoursFormPreview
                      datePeriod={formValues}
                      resourceStates={resourceStates}
                      tabIndex={isMobile ? -1 : 0}
                    />
                    <div className="sort-weekdays-container">
                      <SupplementaryButton
                        iconLeft={<IconSort />}
                        onClick={sortOpeningHours}>
                        Järjestä päiväryhmät viikonpäivien mukaan
                      </SupplementaryButton>
                    </div>
                  </aside>
                </div>
              )}
            </section>
          </div>
          <OpeningHoursFormActions isSaving={isSaving} />
        </form>
      </FormProvider>
    )) || <h1>Ladataan...</h1>
  );
};

export default OpeningHoursForm;
