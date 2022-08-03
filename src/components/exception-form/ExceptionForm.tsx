import { DateInput } from 'hds-react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppContext } from '../../App-context';
import { formValuesToApiDatePeriod } from '../../common/helpers/opening-hours-helpers';
import {
  DatePeriod,
  Language,
  OpeningHoursFormValues,
  Resource,
  ResourceState,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import { formatDate } from '../../common/utils/date-time/format';
import { defaultTimeSpan } from '../../constants';
import useMobile from '../../hooks/useMobile';
import useReturnToResourcePage from '../../hooks/useReturnToResourcePage';
import { PrimaryButton, SecondaryButton } from '../button/Button';
import ExceptionOpeningHours from '../exception-opening-hours/ExceptionOpeningHours';
import toast from '../notification/Toast';
import OpeningHoursTitles from '../opening-hours-form/OpeningHoursTitles';
import ResourceTitle from '../resource-title/ResourceTitle';
import './ExceptionForm.scss';

const formValuesToException = (
  resourceIdToSave: number,
  values: OpeningHoursFormValues
): DatePeriod => {
  const data = formValuesToApiDatePeriod(resourceIdToSave, values, values.id);
  return {
    ...data,
    end_date: data.start_date,
    override: true,
  };
};

const getDefaultFormValues = ({
  date,
  name,
}: {
  date?: string;
  name?: string;
}): OpeningHoursFormValues => ({
  startDate: date ?? formatDate(new Date().toISOString()),
  endDate: date ?? formatDate(new Date().toISOString()),
  fixed: true,
  name: { fi: name ?? '', sv: '', en: '' },
  override: true,
  resourceState: ResourceState.CLOSED,
  openingHours: [],
});

const ExceptionForm = ({
  datePeriodConfig,
  resource,
  submitFn,
}: {
  datePeriodConfig: UiDatePeriodConfig;
  resource: Resource;
  submitFn: (datePeriod: DatePeriod) => Promise<DatePeriod>;
}): JSX.Element => {
  const { language = Language.FI } = useAppContext();
  const form = useForm<OpeningHoursFormValues>({
    defaultValues: getDefaultFormValues({}),
    shouldUnregister: false,
  });
  const { register, reset, watch } = form;
  const startDate = watch('startDate');
  const isMobile = useMobile();
  const returnToResourcePage = useReturnToResourcePage();
  const [isSaving, setSaving] = useState<boolean>(false);

  const onSubmit = (data: OpeningHoursFormValues): void => {
    setSaving(true);
    submitFn(formValuesToException(resource.id, data))
      .then(() => {
        setSaving(false);
        returnToResourcePage();
        toast.success({
          dataTestId: 'exception-form-success',
          label: 'Aukiolon lisääminen onnistui',
          text: `Poikkeavan päivän aukiolon lisääminen onnistui`,
        });
      })
      .catch(() => {
        setSaving(false);
        toast.error({
          dataTestId: 'exception-form-error',
          label: 'Aukiolon lisääminen epäonnistui',
          text: `Poikkeavan päivän lisääminen epäonnistui`,
        });
      });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <ResourceTitle language={language} resource={resource} />
          <div className="exception-form">
            <OpeningHoursTitles />
            <div className="card">
              <DateInput
                id="exception-date"
                className="exception-date"
                data-test="exception-date"
                ref={register()}
                disableConfirmation
                initialMonth={new Date()}
                label="Poikkeavan päivän päivämäärä"
                language={language}
                name="startDate"
                openButtonAriaLabel="Valitse päivämäärä"
                value={startDate ?? ''}
              />
              <ExceptionOpeningHours
                onClose={(): void =>
                  reset({
                    openingHours: [],
                  })
                }
                onOpen={(): void =>
                  reset({
                    openingHours: [
                      {
                        timeSpanGroups: [
                          {
                            timeSpans: [defaultTimeSpan],
                          },
                        ],
                      },
                    ],
                  })
                }
                resourceStates={datePeriodConfig.resourceState.options}
                isOpen={false}
                id="exception-form"
              />
            </div>
          </div>
          <div className="opening-hours-form__actions-container">
            <div className="card opening-hours-form__actions">
              <PrimaryButton
                dataTest="submit-opening-hours-button"
                isLoading={isSaving}
                loadingText="Tallentaa aukioloaikoja"
                type="submit"
                size={isMobile ? 'small' : 'default'}>
                Tallenna
              </PrimaryButton>
              <SecondaryButton
                onClick={returnToResourcePage}
                size={isMobile ? 'small' : 'default'}>
                Peruuta
              </SecondaryButton>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ExceptionForm;
