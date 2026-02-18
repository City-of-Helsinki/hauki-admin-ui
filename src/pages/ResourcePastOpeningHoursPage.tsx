import React, { useEffect, useMemo, useState } from 'react';
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

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

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
  const currentYear = new Date().getFullYear();
  const holidays = useMemo(
    () => getHolidays(new Date(currentYear - 1, 0, 1)),
    [currentYear]
  );

  // Set date period select state to INACTIVE to hide checkboxes and add buttons
  useEffect(() => {
    setDatePeriodSelectState(DatePeriodSelectState.INACTIVE);
  }, [setDatePeriodSelectState]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!resourceId) return;

      const fetchYear = new Date().getFullYear();
      const startOfPreviousYear = `${fetchYear - 1}-01-01`;
      const today = formatLocalDate(new Date());

      setLoading(true);
      try {
        // First fetch the resource to get the numeric ID
        const resourceData = await api.getResource(resourceId);

        if (!isMounted) return;
        setResource(resourceData);

        // Then fetch past date periods and config using the numeric ID
        const [apiDatePeriods, uiDatePeriodOptions] = await Promise.all([
          api.getPastDatePeriods(resourceData.id, startOfPreviousYear),
          getDatePeriodFormConfig(),
        ]);

        setDatePeriodConfig(uiDatePeriodOptions);

        const filteredApiDatePeriods = apiDatePeriods.filter((datePeriod) => {
          const endDate = datePeriod.end_date;

          return !!endDate && endDate >= startOfPreviousYear && endDate < today;
        });

        const datePeriods = filteredApiDatePeriods.map(
          apiDatePeriodToDatePeriod
        );
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

  const exceptionDatePeriods = exceptions.filter(
    (datePeriod) => !isHolidayOrEve(datePeriod, holidays)
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

      {normalDatePeriods.length === 0 && exceptionDatePeriods.length === 0 ? (
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
        </>
      )}
    </div>
  );
};

export default ResourcePastOpeningHoursPage;
