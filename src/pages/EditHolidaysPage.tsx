import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, IconPenLine, LoadingSpinner } from 'hds-react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ApiDatePeriod,
  Language,
  DatePeriod,
  Resource,
  ResourceState,
  UiDatePeriodConfig,
  LanguageStrings,
} from '../common/lib/types';
import {
  apiDatePeriodToDatePeriod,
  datePeriodToApiDatePeriod,
  isHolidayOrEve,
} from '../common/helpers/opening-hours-helpers';
import api from '../common/utils/api/api';
import { getDatePeriodFormConfig } from '../services/datePeriodFormConfig';
import { getHolidays, Holiday } from '../services/holidays';
import {
  formatDate,
  getNumberOfTheWeekday,
} from '../common/utils/date-time/format';
import { PrimaryButton, SecondaryButton } from '../components/button/Button';
import { UpcomingHolidayNotification } from '../components/holidays-table/HolidaysTable';
import {
  ConfirmationModal,
  useModal,
} from '../components/modal/ConfirmationModal';
import ResourceTitle from '../components/resource-title/ResourceTitle';
import toast from '../components/notification/Toast';

import { useAppContext } from '../App-context';
import './EditHolidaysPage.scss';
import useReturnToResourcePage from '../hooks/useReturnToResourcePage';
import useMobile from '../hooks/useMobile';
import ExceptionOpeningHoursStateToggle from '../components/exception-opening-hours-state-toggle/ExceptionOpeningHoursStateToggle';
import HolidayOpeningHours from '../components/holiday-opening-hours/HolidayOpeningHours';
import { defaultTimeSpanGroup } from '../constants';
import TimeSpans from '../components/time-span/TimeSpans';

type FormActions = {
  create: (values: DatePeriod) => Promise<void>;
  update: (values: DatePeriod) => Promise<void>;
  delete: (values: DatePeriod) => Promise<void>;
};

const getDefaultFormValues = ({
  name,
  holidayDate,
}: {
  name: LanguageStrings;
  holidayDate: string;
}): DatePeriod => ({
  startDate: formatDate(holidayDate),
  endDate: formatDate(holidayDate),
  fixed: true,
  name,
  override: true,
  resourceState: ResourceState.CLOSED,
  openingHours: [],
});

const HolidayForm = ({
  id,
  holiday,
  value,
  datePeriodConfig,
  actions,
  onClose,
}: {
  id: string;
  holiday: Holiday;
  value?: DatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  actions: FormActions;
  onClose: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { name, date: holidayDate } = holiday;
  const [isSaving, setIsSaving] = useState(false);
  const valueToUse = value || getDefaultFormValues({ name, holidayDate });

  const form = useForm<DatePeriod>({
    defaultValues: valueToUse,
  });

  const { setValue } = form;

  const onClosedSelect = (): void => {
    setValue('resourceState', ResourceState.CLOSED);
    setValue('openingHours', []);
  };

  const onOpenSelect = (): void => {
    setValue('resourceState', ResourceState.UNDEFINED);
    setValue('openingHours', [
      {
        timeSpanGroups: [defaultTimeSpanGroup],
        weekdays: [getNumberOfTheWeekday(holidayDate)],
      },
    ]);
  };

  const {
    resourceState: { options: resourceStates = [] },
  } = datePeriodConfig;

  const createNew = (values: DatePeriod): void => {
    setIsSaving(true);
    actions.create(values);
  };

  const saveExisting = (values: DatePeriod): void => {
    setIsSaving(true);
    actions.update(values).then(() => {
      setIsSaving(false);
      onClose();
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={
          value?.id
            ? form.handleSubmit(saveExisting)
            : form.handleSubmit(createNew)
        }>
        <ExceptionOpeningHoursStateToggle
          id={id}
          initiallyOpen={
            valueToUse && valueToUse.resourceState
              ? valueToUse.resourceState !== ResourceState.CLOSED
              : false
          }
          onClose={onClosedSelect}
          onOpen={onOpenSelect}>
          <div className="holiday-opening-hours-time-spans">
            <TimeSpans
              openingHoursIdx={0}
              resourceStates={resourceStates}
              timeSpanGroupIdx={0}
            />
          </div>
        </ExceptionOpeningHoursStateToggle>
        <div className="holiday-form-actions">
          <PrimaryButton
            dataTest="submit-opening-hours-button"
            isLoading={isSaving}
            loadingText={t('OpeningHours.IsSubmittingExceptional')}
            type="submit">
            {t('Common.Submit')}
          </PrimaryButton>
          <SecondaryButton
            dataTest="cancel-opening-hours-button"
            onClick={onClose}
            type="button">
            {t('Common.Cancel')}
          </SecondaryButton>
        </div>
      </form>
    </FormProvider>
  );
};

const HolidayListItem = ({
  id,
  holiday,
  value,
  datePeriodConfig,
  actions,
}: {
  id: string;
  holiday: Holiday;
  value?: DatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  actions: FormActions;
}): JSX.Element => {
  const { t } = useTranslation();
  const { language = Language.FI } = useAppContext();
  const [checked, setChecked] = useState<boolean>(!!value);
  const [willBeRemoved, setWillBeRemoved] = useState<boolean>(false);
  const { name, date } = holiday;
  const checkboxId = `${id}-checkbox`;
  const commonCheckBoxProps = {
    id: checkboxId,
    'data-testid': checkboxId,
    label: `${name[language]}   ${formatDate(date)}`,
    checked,
    style: {
      '--background-selected': 'var(--color-coat-of-arms)',
      '--background-hover': 'var(--color-coat-of-arms-dark)',
      '--border-color-selected': 'var(--color-coat-of-arms)',
      '--border-color-selected-hover': 'var(--color-coat-of-arms-dark)',
      '--border-color-selected-focus': 'var(--color-coat-of-arms)',
    } as CSSProperties,
  };
  const { isModalOpen, openModal, closeModal } = useModal();
  const [isEditing, setIsEditing] = useState(!value);

  return (
    <li className="holidays-list-item" key={date}>
      <div className="holiday-column holidays-list-item-column">
        {value && value.id ? (
          <>
            <Checkbox
              {...commonCheckBoxProps}
              disabled={willBeRemoved}
              onChange={(): void => {
                openModal();
              }}
            />
            <ConfirmationModal
              onConfirm={async (): Promise<void> => {
                setWillBeRemoved(true);
                await actions.delete(value);
              }}
              title={t('OpeningHours.RemoveHolidaySpanConfirmTitle')}
              text={
                <>
                  <p>{t('OpeningHours.RemoveHolidaySpanConfirmText')}</p>
                  <p>
                    <b>
                      {value.name[language]}
                      <br />
                      {value.startDate}
                    </b>
                  </p>
                </>
              }
              isLoading={willBeRemoved}
              loadingText={t('OpeningHours.RemoveHolidaySpanLoading')}
              isOpen={isModalOpen}
              onClose={closeModal}
              confirmText={t('OpeningHours.RemoveHolidaySpanConfirm')}
            />
          </>
        ) : (
          <Checkbox
            {...commonCheckBoxProps}
            onChange={(): void => {
              setChecked(!checked);
              setIsEditing(!checked);
            }}
          />
        )}
      </div>
      {willBeRemoved ? (
        <div className="holidays-list-item-column">
          <LoadingSpinner small />
          {t('OpeningHours.RemoveHolidaySpanSpinner')}
        </div>
      ) : (
        <React.Fragment key={holiday.date}>
          {checked &&
            (isEditing ? (
              <div className="holidays-list-item-column holiday-form-container">
                <HolidayForm
                  id={id}
                  holiday={holiday}
                  value={value}
                  datePeriodConfig={datePeriodConfig}
                  actions={actions}
                  onClose={() => {
                    setIsEditing(false);
                    if (!value) {
                      setChecked(false);
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <div className="holidays-list-item-column">
                  <HolidayOpeningHours
                    datePeriod={value}
                    datePeriodConfig={datePeriodConfig}
                  />
                </div>
                {value && (
                  <button
                    className="edit-holiday-button button-icon"
                    onClick={() => setIsEditing(true)}
                    type="button">
                    <IconPenLine aria-hidden="true" />
                    <span className="visually-hidden">
                      {t('OpeningHours.EditHolidaySpan', { holiday })}
                    </span>
                  </button>
                )}
              </>
            ))}
        </React.Fragment>
      )}
    </li>
  );
};

const EditHolidaysPage = ({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element => {
  const { t } = useTranslation();
  const [resource, setResource] = useState<Resource>();
  const [holidayValues, setHolidayValues] = useState<
    DatePeriod[] | undefined
  >();
  const [datePeriodConfig, setDatePeriodConfig] =
    useState<UiDatePeriodConfig>();
  const { language = Language.FI } = useAppContext();
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      try {
        const [apiResource, uiDatePeriodOptions] = await Promise.all([
          api.getResource(resourceId),
          getDatePeriodFormConfig(),
        ]);
        setHolidays(getHolidays());
        setResource(apiResource);
        setDatePeriodConfig(uiDatePeriodOptions);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Fetching data failed in holidays page:', e);
      }
    };

    fetchData();
  }, [resourceId]);

  const fetchValues = useCallback(
    async (resourceIdentifier: number): Promise<void> => {
      const apiDatePeriods: ApiDatePeriod[] = await api.getDatePeriods(
        resourceIdentifier
      );
      const holidayPeriodsResult: DatePeriod[] = apiDatePeriods
        .map(apiDatePeriodToDatePeriod)
        .filter((apiDatePeriod) => isHolidayOrEve(apiDatePeriod, holidays));

      setHolidayValues(holidayPeriodsResult);
    },
    [holidays]
  );

  const create = async (values: DatePeriod): Promise<void> => {
    if (!resource) {
      throw new Error('Resource not found');
    }

    return api
      .postDatePeriod(datePeriodToApiDatePeriod(resource.id, values))
      .then(() => {
        toast.success({
          dataTestId: 'holiday-form-success',
          label: t('OpeningHours.HolidayCreateSuccess', {
            holidayName: values.name[language],
          }),
        });

        return fetchValues(resource.id);
      })
      .catch(() => {
        toast.error({
          dataTestId: 'holiday-form-error',
          label: t('OpeningHours.HolidayCreateError', {
            holidayName: values.name[language],
          }),
        });
      });
  };

  const update = async (values: DatePeriod): Promise<void> => {
    if (!resource || !values || !values.id) {
      throw new Error('Resource or period not found');
    }

    return api
      .putDatePeriod(datePeriodToApiDatePeriod(resource.id, values))
      .then(() => {
        toast.success({
          dataTestId: 'holiday-form-success',
          label: t('OpeningHours.HolidayUpdateSuccess', {
            holidayName: values.name[language],
          }),
        });

        return fetchValues(resource.id);
      })
      .catch(() => {
        toast.error({
          dataTestId: 'holiday-form-success-error',
          label: t('OpeningHours.HolidayUpdateError', {
            holidayName: values.name[language],
          }),
        });
      });
  };

  const deletePeriod = async (values: DatePeriod): Promise<void> => {
    if (!resource) {
      throw new Error('Resource not found');
    }

    if (!values.id) {
      throw new Error('Period not found');
    }

    return api
      .deleteDatePeriod(Number(values.id))
      .then(() => {
        toast.success({
          dataTestId: 'holiday-form-success',
          label: t('OpeningHours.HolidayDeleteSuccess', {
            holidayName: values.name[language],
          }),
        });

        return fetchValues(resource.id);
      })
      .catch(() => {
        toast.error({
          dataTestId: 'holiday-form-success-error',
          label: t('OpeningHours.HolidayDeleteError', {
            holidayName: values.name[language],
          }),
        });
      });
  };

  const isMobile = useMobile();
  const returnToResourcePage = useReturnToResourcePage();

  useEffect((): void => {
    const fetchHolidayValues = async (): Promise<void> => {
      try {
        if (resource) {
          await fetchValues(resource.id);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(
          'Fetching data failed in holidays page - apiDatePeriods:',
          e
        );
      }
    };

    fetchHolidayValues();
  }, [fetchValues, holidays, resource]);

  if (!resource || !datePeriodConfig || !holidayValues) {
    return <h1>{t('Common.IsLoading')}</h1>;
  }

  return (
    <>
      <ResourceTitle language={language} resource={resource}>
        <SecondaryButton
          onClick={returnToResourcePage}
          size={isMobile ? 'small' : 'default'}>
          {t('ResourcePage.Main.ReturnToMainPageButton')}
        </SecondaryButton>
      </ResourceTitle>
      <div className="holidays-page card">
        <div className="holidays-page-title">
          <h3>{t('OpeningHours.HolidaysTitle')}</h3>
          {holidays.length > 0 && (
            <UpcomingHolidayNotification
              datePeriodConfig={datePeriodConfig}
              datePeriods={holidayValues}
              holidays={holidays}
            />
          )}
        </div>
        <p>{t('OpeningHours.HolidaysHelperText')}</p>
        <div className="holiday-list-header">
          <h3 className="holiday-column">
            {t('OpeningHours.HolidaysListHeader')}
          </h3>
        </div>
        <ul className="holidays-list">
          {holidays.map((holiday, idx) => {
            const value: DatePeriod | undefined = holidayValues
              ? holidayValues.find(
                  (holidayValue) =>
                    holidayValue.name[language] === holiday.name[language]
                )
              : undefined;

            return (
              <HolidayListItem
                key={`${holiday.date}-${value ? value.id : 'new'}`}
                id={`holiday-${idx}`}
                holiday={holiday}
                datePeriodConfig={datePeriodConfig}
                value={value}
                actions={{
                  create,
                  update,
                  delete: deletePeriod,
                }}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default EditHolidaysPage;
