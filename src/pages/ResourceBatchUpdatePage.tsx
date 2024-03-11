import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Notification,
  Table,
  Pagination,
  RadioButton,
  SelectionGroup,
  IconTrash,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import {
  PrimaryButton,
  SecondaryButton,
  SupplementaryButton,
} from '../components/button/Button';
import { useAppContext } from '../App-context';
import { AuthContextProps, useAuth } from '../auth/auth-context';
import api from '../common/utils/api/api';
import toast from '../components/notification/Toast';
import {
  NotificationModal,
  useModal,
} from '../components/modal/NotificationModal';
import { DatePeriodType, Language, Resource } from '../common/lib/types';
import sessionStorage from '../common/utils/storage/sessionStorage';
import './ResourceBatchUpdatePage.scss';
import { TargetResourcesProps } from '../components/resource-opening-hours/ResourcePeriodsCopyFieldset';
import useReturnToResourcePage from '../hooks/useReturnToResourcePage';
import {
  DatePeriodSelectState,
  useSelectedDatePeriodsContext,
} from '../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';
import OpeningPeriod from '../components/opening-period/OpeningPeriod';
import OpeningPeriodsSection from '../components/opening-periods-section/OpeningPeriodsSection';

export type ResourceBatchUpdatePageProps = {
  mainResourceId: string;
  targetResourcesString?: string;
};

// for some reason origins are not part of Resource type, this need to be fixed in API
export type ResourceWithOrigins = Resource & {
  origins: {
    origin_id: string;
    data_source: {
      id: string;
      name: {
        fi: string;
        sv: string;
        en: string;
      };
    };
  }[];
};

const ResourceBatchUpdatePage = ({
  mainResourceId,
  targetResourcesString,
}: ResourceBatchUpdatePageProps): JSX.Element => {
  const {
    hasOpenerWindow,
    closeAppWindow,
    language: contextLanguage,
  } = useAppContext();
  const authProps: Partial<AuthContextProps> = useAuth();
  const { authTokens, clearAuth } = authProps;
  const history = useHistory();
  const isAuthenticated = !!authTokens;
  const { isModalOpen, openModal } = useModal();
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedRadioItem, setSelectedRadioItem] = useState('copy');
  const [targetResourceData, setTargetResourceData] = useState<
    TargetResourcesProps | undefined
  >(undefined);
  const ReturnToResourcePage = useReturnToResourcePage();
  const {
    selectedDatePeriods,
    setDatePeriodSelectState,
    datePeriodSelectState,
  } = useSelectedDatePeriodsContext();
  const { t, i18n } = useTranslation();

  // page constants
  const pageSize = 10;
  const resourceCount = targetResourceData?.targetResources?.length ?? 0;
  const pageCount = Math.ceil(resourceCount / pageSize);
  const mainResourceName = targetResourceData?.mainResourceName;
  const language = contextLanguage ?? Language.FI;
  const targetResourcesStorageKey = 'targetResources';
  // forms a nice string from feedback emails env variable
  const feedbackEmailsString = window?.ENV?.FEEDBACK_EMAILS?.replace(/\s/g, '')
    .replace(/,(?=[^,]*$)/, ' ja ')
    .replace(/,/g, ', ');

  const showErrorNotification = (label: string, text?: string): void =>
    toast.error({
      label,
      text,
      dismissible: true,
    });
  const showSuccessNotification = (label: string, text?: string): void =>
    toast.success({
      label,
      text,
    });
  const signOut = async (): Promise<void> => {
    try {
      const isAuthInvalidated = await api.invalidateAuth();
      if (isAuthInvalidated) {
        if (clearAuth) {
          clearAuth();
        }
        history.push('/');
      } else {
        showErrorNotification(t('ResourcePage.Notifications.SignOutFailed'));
      }
    } catch (e) {
      showErrorNotification(
        t('ResourcePage.Notifications.SignOutError'),
        t('ResourcePage.Notifications.Error') + e
      );
    }
  };

  // event functions
  const onChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioItem(event.target.value);
  };
  const onClose = () => {
    setLoading(false);
    if (isAuthenticated) signOut();
    if (hasOpenerWindow && closeAppWindow) closeAppWindow();
  };
  const onConfirm = () => {
    const datePeriodIds = selectedDatePeriods.map(
      (dp) => dp.id?.toString() || ''
    );
    if (
      !mainResourceId ||
      !targetResourceData ||
      !targetResourceData?.targetResources ||
      targetResourceData?.targetResources.length === 0 ||
      datePeriodIds.length === 0
    ) {
      return;
    }

    setLoading(true);
    api
      .copyDatePeriods(
        resource?.id ?? 0,
        targetResourceData?.targetResources
          .filter((item) => item.id !== mainResourceId)
          .map((item) => item.id),
        selectedRadioItem === 'update',
        datePeriodIds
      )
      .then(async () => {
        setLoading(false);
        openModal();
      })
      .catch((e: Error) => {
        setLoading(false);
        showErrorNotification(
          t('ResourcePage.Notifications.UpdateFailed'),
          `${t('ResourcePage.Notifications.Error')} ${e}. ${
            feedbackEmailsString.length > 0
              ? t('ResourcePage.Notifications.SendErrorScreenshot', {
                  feedbackEmailsString,
                })
              : ''
          }`
        );
      });
  };
  const onRemove = (id: string) => {
    if (targetResourceData?.targetResources) {
      const resourceName = targetResourceData.targetResources.find(
        (r) => r.id === id
      )?.name as string;
      const newData = {
        ...targetResourceData,
        targetResources: targetResourceData.targetResources.filter(
          (r) => r.id !== id
        ),
      };
      setTargetResourceData(newData);
      sessionStorage.storeItem<TargetResourcesProps>({
        key: targetResourcesStorageKey,
        value: newData,
      });
      showSuccessNotification(
        t('ResourcePage.Notifications.RemoveSuccess', {
          resourceName,
        })
      );
    }
  };

  // table definition
  const tableDef = {
    cols: [
      {
        key: 'id',
        headerName: 'ID',
        isSortable: true,
      },
      {
        key: 'resource',
        headerName: t('ResourcePage.ResourcesSection.ResourceColumn'),
        isSortable: true,
      },
      {
        key: 'remove',
        headerName: '',
        transform: (item: { remove: string }) => {
          return (
            <div style={{ textAlign: 'right', color: 'red' }}>
              <SupplementaryButton
                size="small"
                onClick={() => onRemove(item.remove)}>
                <IconTrash
                  size="xs"
                  aria-label={t(
                    'ResourcePage.ResourcesSection.RemoveAriaLabel'
                  )}
                  color="var(--color-error)"
                />
              </SupplementaryButton>
            </div>
          );
        },
      },
    ],
    rows: targetResourceData?.targetResources?.map((res) => ({
      id: res.id,
      resource: res.name,
      remove: res.id,
    })),
  };

  useEffect(() => {
    if (datePeriodSelectState !== DatePeriodSelectState.INACTIVE) {
      setDatePeriodSelectState(DatePeriodSelectState.INACTIVE);
    }
  }, [datePeriodSelectState, setDatePeriodSelectState]);

  // get data of target resources
  useEffect(() => {
    let isMounted = true;

    if (resource) {
      if (targetResourcesString) {
        const targetResourceIDs = targetResourcesString.split(',');

        const handleApiResponse = async (resources: Resource[]) => {
          // for some reason origins are not part of Resource type, this need to be fixed in API
          const resourcesWithOrigins = resources as ResourceWithOrigins[];
          const targetResources = targetResourceIDs
            .map((id) => ({
              id,
              resource: resourcesWithOrigins.find((res) =>
                res.origins.some(
                  (origin) =>
                    origin.data_source.id === id.split(':')[0] &&
                    origin.origin_id === id.split(':')[1]
                )
              ),
            }))
            .filter((r) => r.resource)
            .map((r) => ({
              id: r.id,
              name: r?.resource?.name[language] || r?.resource?.name?.fi,
            }));

          const newData = {
            mainResourceId: resource.id,
            mainResourceName: resource?.name[language] || resource?.name.fi,
            targetResources,
          };

          sessionStorage.storeItem<TargetResourcesProps>({
            key: targetResourcesStorageKey,
            value: newData,
          });
          if (isMounted) {
            setTargetResourceData(newData);
            setLoading(false);
          }
        };

        // fetch target resource data from api
        setLoading(true);
        api
          .getResources(targetResourceIDs)
          .then(handleApiResponse)
          .catch((e: Error) => {
            setLoading(false);
            setError(e);
            showErrorNotification(
              t('ResourcePage.Notifications.ErrorLoadingResources'),
              t('ResourcePage.Notifications.Error2') + e
            );
          });
      } else {
        const oldData = sessionStorage.getItem<TargetResourcesProps>(
          targetResourcesStorageKey
        );
        if (oldData && oldData.mainResourceId === resource?.id) {
          setTargetResourceData(oldData);
        } else {
          sessionStorage.removeItem(targetResourcesStorageKey);
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, [language, resource, targetResourcesString]); // eslint-disable-line react-hooks/exhaustive-deps

  // get main resource
  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    api
      .getResource(mainResourceId)
      .then(async (r: Resource) => {
        if (isMounted) {
          setResource(r);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        setLoading(false);
        setError(e);
        showErrorNotification(
          t('ResourcePage.Notifications.ErrorLoadingResource'),
          t('ResourcePage.Notifications.Error2') + e
        );
      });

    return () => {
      isMounted = false;
    };
  }, [mainResourceId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <>
        <h1 className="resource-info-title">
          {t('ResourcePage.Notifications.Error')}
        </h1>
        <Notification
          label={t('ResourcePage.Notifications.ErrorLoadingResource')}
          type="error">
          {t('ResourcePage.Notifications.CheckResourceIds')}
        </Notification>
      </>
    );
  }

  if (isLoading && (!resource || !targetResourceData || !mainResourceId)) {
    return (
      <h1 className="resource-info-title">
        {t('ResourcePage.Notifications.IsLoadingResources')}
      </h1>
    );
  }

  // we need to separate date periods by type to display them in different sections
  const normalSelectedDatePeriods = selectedDatePeriods.filter(
    (dp) => dp.type === DatePeriodType.NORMAL
  );

  const exceptionSelectedDatePeriods = selectedDatePeriods.filter(
    (dp) => dp.type === DatePeriodType.EXCEPTION
  );

  const holidaySelectedDatePeriods = selectedDatePeriods.filter(
    (dp) => dp.type === DatePeriodType.HOLIDAY
  );

  return (
    <div className="resource-batch-update-page">
      <section className="section-title">
        <h1>{mainResourceName}</h1>
        <div className="button-close">
          <SecondaryButton size="small" onClick={ReturnToResourcePage}>
            {t('ResourcePage.Main.ReturnToMainPageButton')}
          </SecondaryButton>
        </div>
      </section>

      <section className="section-spans">
        <h2>{t('ResourcePage.OpeningPeriodsSection.BatchTitle')}</h2>
        <p>{t('ResourcePage.OpeningPeriodsSection.Description')}</p>

        {normalSelectedDatePeriods.length > 0 && (
          <OpeningPeriodsSection
            datePeriods={normalSelectedDatePeriods}
            isLoading={false}
            newUrl=""
            theme="DEFAULT"
            title={t('ResourcePage.OpeningPeriodsSection.NormalTitle')}
            addDatePeriodButtonText=""
            addNewOpeningPeriodButtonDataTest="">
            {normalSelectedDatePeriods.map((dp) => (
              <OpeningPeriod
                key={dp.id}
                datePeriod={dp}
                language={language}
                initiallyOpen={false}
                editUrl=""
              />
            ))}
          </OpeningPeriodsSection>
        )}
        {exceptionSelectedDatePeriods.length > 0 && (
          <OpeningPeriodsSection
            datePeriods={exceptionSelectedDatePeriods}
            isLoading={false}
            newUrl=""
            theme="LIGHT"
            title={t('ResourcePage.OpeningPeriodsSection.ExceptionPeriods')}
            addDatePeriodButtonText=""
            addNewOpeningPeriodButtonDataTest="">
            {exceptionSelectedDatePeriods.map((dp) => (
              <OpeningPeriod
                key={dp.id}
                datePeriod={dp}
                language={language}
                initiallyOpen={false}
                editUrl=""
              />
            ))}
          </OpeningPeriodsSection>
        )}
        {holidaySelectedDatePeriods.length > 0 && (
          <OpeningPeriodsSection
            datePeriods={holidaySelectedDatePeriods}
            isLoading={false}
            newUrl=""
            theme="LIGHT"
            title={t('ResourcePage.OpeningPeriodsSection.HolidayPeriods')}
            addDatePeriodButtonText=""
            addNewOpeningPeriodButtonDataTest="">
            {holidaySelectedDatePeriods.map((dp) => (
              <OpeningPeriod
                key={dp.id}
                datePeriod={dp}
                language={language}
                initiallyOpen={false}
                editUrl=""
              />
            ))}
          </OpeningPeriodsSection>
        )}
      </section>

      <div className="section-resource-update">
        <section className="section-resources">
          <h2>{t('ResourcePage.ResourcesSection.Title')}</h2>
          <p>
            {t('ResourcePage.ResourcesSection.Description', {
              resourceCount,
            })}
          </p>
          {tableDef.rows && (
            <Table
              cols={tableDef.cols}
              rows={tableDef.rows.slice(
                pageIndex * pageSize,
                (pageIndex + 1) * pageSize
              )}
              variant="light"
              indexKey="id"
              renderIndexCol
            />
          )}
          <Pagination
            language={i18n.language as Language}
            onChange={(event, index) => {
              event.preventDefault();
              setPageIndex(index);
            }}
            pageCount={pageCount}
            pageHref={() => '#'}
            pageIndex={pageIndex}
            paginationAriaLabel={t(
              'ResourcePage.ResourcesSection.PaginationAriaLabel'
            )}
            siblingCount={2}
          />
        </section>

        <section className="section-update">
          <h2>{t('ResourcePage.UpdateSection.Title')}</h2>
          <div>
            {t('ResourcePage.UpdateSection.Description')}
            <ul className="list-options">
              <li>
                {t('ResourcePage.UpdateSection.Bullet1', {
                  mainResourceName,
                })}
              </li>
              <li>{t('ResourcePage.UpdateSection.Bullet2')}</li>
            </ul>
          </div>
          <SelectionGroup label={t('ResourcePage.UpdateSection.Select')}>
            <RadioButton
              id="radio-update"
              name="radio-update"
              value="update"
              label={t('ResourcePage.UpdateSection.Option1')}
              checked={selectedRadioItem === 'update'}
              onChange={onChangeRadio}
            />
            <RadioButton
              id="radio-copy"
              name="radio-copy"
              value="copy"
              label={t('ResourcePage.UpdateSection.Option2')}
              checked={selectedRadioItem === 'copy'}
              onChange={onChangeRadio}
            />
          </SelectionGroup>
          <div className="button-confirm">
            <PrimaryButton
              onClick={onConfirm}
              loadingText={t('ResourcePage.UpdateSection.LoadingText')}
              isLoading={isLoading}>
              {t('ResourcePage.UpdateSection.ConfirmButton')}
            </PrimaryButton>
          </div>
        </section>
      </div>

      <NotificationModal
        title={t('ResourcePage.Notifications.Title')}
        text={
          <span>
            {t('ResourcePage.Notifications.Success')}
            <br />
            {t('ResourcePage.Notifications.CloseText')}
          </span>
        }
        buttonText={t('ResourcePage.Notifications.CloseButton')}
        isOpen={isModalOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default ResourceBatchUpdatePage;
