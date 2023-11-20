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

  // page constants
  const pageSize = 10;
  const resourceCount = targetResourceData?.targetResources?.length || 0;
  const pageCount = Math.ceil(resourceCount / pageSize);
  const mainResourceName = targetResourceData?.mainResourceName;
  const language = contextLanguage || Language.FI;
  const targetResourcesStorageKey = 'targetResources';

  const showErrorNotification = (text: string): void =>
    toast.error({
      label: text,
    });
  const showSuccessNotification = (text: string): void =>
    toast.success({
      label: text,
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
        showErrorNotification('Uloskirjautuminen hylättiin.');
      }
    } catch (e) {
      showErrorNotification(
        `Uloskirjautuminen epäonnistui. Yritä myöhemmin uudestaan. Virhe: ${e}`
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
        resource?.id || 0,
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
        setError(e);
        showErrorNotification(
          `Aukioloaikojen ${
            selectedRadioItem === 'update' ? 'kopioiminen' : 'korvaaminen'
          } epäonnistui. Virhe: ${e}`
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
      showSuccessNotification(`Toimipiste ${resourceName} on poistettu.`);
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
      { key: 'resource', headerName: 'Toimipiste', isSortable: true },
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
                  aria-label="Poista"
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
              name: r?.resource?.name[language],
            }));

          const newData = {
            mainResourceId: resource.id,
            mainResourceName: resource?.name[language],
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
              `Toimipisteiden tietoja ei saatu ladattua. Virhe: ${e}`
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
  }, [language, resource, targetResourcesString]);

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
          `Toimipisteen tietoja ei saatu ladattua. Virhe: ${e}`
        );
      });

    return () => {
      isMounted = false;
    };
  }, [mainResourceId]);

  if (error) {
    return (
      <>
        <h1 className="resource-info-title">Virhe</h1>
        <Notification label="Toimipisteitä ei saatu ladattua." type="error">
          Tarkista toimipisteiden id:t.
        </Notification>
      </>
    );
  }

  if (isLoading && (!resource || !targetResourceData || !mainResourceId)) {
    return (
      <>
        <h1 className="resource-info-title">Toimipisteiden tietojen haku</h1>
      </>
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
            Palaa etusivulle
          </SecondaryButton>
        </div>
      </section>

      <section className="section-spans">
        <h2>Joukkopäivitykseen valitut aukiolot</h2>
        <p>Olet valinnut joukkopäivitykseen alla olevat aukioloajat.</p>

        {normalSelectedDatePeriods.length > 0 && (
          <OpeningPeriodsSection
            datePeriods={normalSelectedDatePeriods}
            isLoading={false}
            newUrl=""
            theme="DEFAULT"
            title="Aukioloajat"
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
            title="Poikkeavat päivät"
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
            title="Juhlapyhät"
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
          <h2>Valitut toimipisteet</h2>
          <p>
            Olet valinnut {resourceCount} toimipistettä joukkopäivitykseen. Alta
            näet valitsemasi toimipisteet ja voit tarvittaessa poistaa
            yksittäisiä toimipisteitä listalta.
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
            language="en"
            onChange={(event, index) => {
              event.preventDefault();
              setPageIndex(index);
            }}
            pageCount={pageCount}
            pageHref={() => '#'}
            pageIndex={pageIndex}
            paginationAriaLabel="Pagination"
            siblingCount={2}
          />
        </section>

        <section className="section-update">
          <h2>Päivitä aukioloajat</h2>
          <div>
            Voit valita seuraavat toimet:
            <ul className="list-options">
              <li>
                Korvaa valittujen toimipisteiden aukiolotiedot. Tämä päivittää
                tiedot vastaamaan toimipisteen {`${mainResourceName} `}
                aukiolotietoja.
              </li>
              <li>
                Kopioi ja lisää aukiolotiedot valittuihin toimipisteisiin. Tämä
                lisää uudet tiedot ilman, että olemassaolevia aukiolotietoja
                muutetaan.
              </li>
            </ul>
          </div>
          <SelectionGroup label="Valitse toiminto">
            <RadioButton
              id="radio-update"
              name="radio-update"
              value="update"
              label="Korvaa aukioloajat"
              checked={selectedRadioItem === 'update'}
              onChange={onChangeRadio}
            />
            <RadioButton
              id="radio-copy"
              name="radio-copy"
              value="copy"
              label="Kopioi ja lisää aukioloajat"
              checked={selectedRadioItem === 'copy'}
              onChange={onChangeRadio}
            />
          </SelectionGroup>
          <div className="button-confirm">
            <PrimaryButton
              onClick={onConfirm}
              loadingText="Päivitetään aukiolotietoja"
              isLoading={isLoading}>
              Vahvista
            </PrimaryButton>
          </div>
        </section>
      </div>

      <NotificationModal
        title="Aukiolotiedot päivitetty"
        text={
          <span>
            Toimipisteiden aukiolotiedot on päivitetty onnistuneesti
            <br />
            Aukiolosovellus sulkeutuu painikkeesta.
          </span>
        }
        buttonText="Sulje aukiolosovellus"
        isOpen={isModalOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default ResourceBatchUpdatePage;
