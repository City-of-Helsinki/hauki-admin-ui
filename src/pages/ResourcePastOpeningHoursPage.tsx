import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from 'hds-react';
import { useParams } from 'react-router-dom';
import { partition } from 'lodash';
import { SecondaryButton } from '../components/button/Button';
import useReturnToResourcePage from '../hooks/useReturnToResourcePage';
import ResourceTitle from '../components/resource-title/ResourceTitle';
import { useAppContext } from '../App-context';
import api from '../common/utils/api/api';
import {
  Language,
  Resource,
  UiDatePeriodConfig,
  DatePeriod,
} from '../common/lib/types';
import {
  apiDatePeriodToDatePeriod,
  isHolidayOrEve,
} from '../common/helpers/opening-hours-helpers';
import { getDatePeriodFormConfig } from '../services/datePeriodFormConfig';
import { getHolidays } from '../services/holidays';
import OpeningPeriodsList from '../components/opening-periods-list/OpeningPeriodsList';
import {
  DatePeriodSelectState,
  useSelectedDatePeriodsContext,
} from '../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';
import './ResourcePastOpeningHoursPage.scss';

const ResourcePastOpeningHoursPage = (): JSX.Element => {
  const { language: contextLanguage } = useAppContext();
  const language = contextLanguage || Language.FI;
  const { t } = useTranslation();
  const { setDatePeriodSelectState } = useSelectedDatePeriodsContext();
  const returnToResourcePage = useReturnToResourcePage();
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [datePeriodConfig, setDatePeriodConfig] =
    useState<UiDatePeriodConfig>();
  const [[normalDatePeriods, exceptions], setDividedDatePeriods] = useState<
    [DatePeriod[], DatePeriod[]]
  >([[], []]);

  const { id } = useParams<{
    id: string;
    parentId?: string;
  }>();

  const resourceId = id;

  // Set date period select state to INACTIVE to hide checkboxes and add buttons
  useEffect(() => {
    setDatePeriodSelectState(DatePeriodSelectState.INACTIVE);
  }, [setDatePeriodSelectState]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!resourceId) return;

      setLoading(true);
      try {
        // First fetch the resource to get the numeric ID
        const resourceData = await api.getResource(resourceId);

        if (!isMounted) return;
        setResource(resourceData);

        // Then fetch past date periods and config using the numeric ID
        const [apiDatePeriods, uiDatePeriodOptions] = await Promise.all([
          api.getPastDatePeriods(resourceData.id),
          getDatePeriodFormConfig(),
        ]);

        if (!isMounted) return;

        setDatePeriodConfig(uiDatePeriodOptions);

        const datePeriods = apiDatePeriods.map(apiDatePeriodToDatePeriod);
        const datePeriodLists = partition(
          datePeriods,
          (datePeriod) => !datePeriod.override
        );
        setDividedDatePeriods(datePeriodLists);
      } catch (e) {
        if (!isMounted) return;
        setError(e as Error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [resourceId]);

  if (error) {
    return (
      <>
        <h1 className="past-opening-hours-title">
          {t('ResourcePastOpeningHoursPage.Notifications.Error')}
        </h1>
        <Notification
          label={t(
            'ResourcePastOpeningHoursPage.Notifications.ErrorLoadingResource'
          )}
          type="error">
          {t('ResourcePastOpeningHoursPage.Notifications.CheckResourceId')}
        </Notification>
      </>
    );
  }

  if (isLoading || !resource) {
    return (
      <>
        <h1 className="past-opening-hours-title">
          {t('ResourcePastOpeningHoursPage.Notifications.IsLoading')}
        </h1>
      </>
    );
  }

  const holidays = getHolidays();
  const [holidayDatePeriods, exceptionDatePeriods] = partition(
    exceptions,
    (datePeriod) => isHolidayOrEve(datePeriod, holidays)
  );

  const noop = async () => {
    // No-op function for past periods (read-only)
  };

  return (
    <div className="resource-past-opening-hours-page">
      <ResourceTitle
        resource={resource}
        language={language}
        titleAddon={t('ResourcePastOpeningHoursPage.Main.Title')}>
        <div className="button-close">
          <SecondaryButton size="small" onClick={returnToResourcePage}>
            {t('ResourcePage.Main.ReturnToMainPageButton')}
          </SecondaryButton>
        </div>
      </ResourceTitle>

      {normalDatePeriods.length === 0 &&
      exceptionDatePeriods.length === 0 &&
      holidayDatePeriods.length === 0 &&
      !isLoading ? (
        <p className="past-opening-hours-empty">
          {t('ResourcePastOpeningHoursPage.Main.EmptyState')}
        </p>
      ) : (
        <>
          <OpeningPeriodsList
            id="past-normal-opening-periods-list"
            addDatePeriodButtonText=""
            addNewOpeningPeriodButtonDataTest="past-normal-periods"
            title={t('ResourcePastOpeningHoursPage.Main.NormalPeriodsTitle')}
            datePeriods={normalDatePeriods}
            datePeriodConfig={datePeriodConfig}
            theme="DEFAULT"
            emptyState={t(
              'ResourcePastOpeningHoursPage.Main.NormalPeriodsEmpty'
            )}
            deletePeriod={noop}
            language={language}
            isLoading={isLoading}
            newUrl="#"
            showCopyOption
          />
          <OpeningPeriodsList
            id="past-exception-opening-periods-list"
            addDatePeriodButtonText=""
            addNewOpeningPeriodButtonDataTest="past-exception-periods"
            datePeriodConfig={datePeriodConfig}
            datePeriods={exceptionDatePeriods}
            deletePeriod={noop}
            isLoading={isLoading}
            language={language}
            emptyState={t(
              'ResourcePastOpeningHoursPage.Main.ExceptionPeriodsEmpty'
            )}
            theme="LIGHT"
            title={t('ResourcePastOpeningHoursPage.Main.ExceptionPeriodsTitle')}
            newUrl="#"
            showCopyOption
          />
          <OpeningPeriodsList
            id="past-holiday-opening-periods-list"
            addDatePeriodButtonText=""
            addNewOpeningPeriodButtonDataTest="past-holiday-periods"
            datePeriodConfig={datePeriodConfig}
            datePeriods={holidayDatePeriods}
            deletePeriod={noop}
            isLoading={isLoading}
            language={language}
            emptyState={t(
              'ResourcePastOpeningHoursPage.Main.HolidayPeriodsEmpty'
            )}
            theme="LIGHT"
            title={t('ResourcePastOpeningHoursPage.Main.HolidayPeriodsTitle')}
            newUrl="#"
            showCopyOption
          />
        </>
      )}
    </div>
  );
};

export default ResourcePastOpeningHoursPage;
