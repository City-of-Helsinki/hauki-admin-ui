import React, { useEffect, useState } from 'react';
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
import api from '../common/utils/api/api';
import { Language, Resource } from '../common/lib/types';
import sessionStorage from '../common/utils/storage/sessionStorage';
import './ResourceBatchUpdatePage.scss';
import { TargetResourcesProps } from '../components/resource-opening-hours/ResourcePeriodsCopyFieldset';

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
  const { language: contextLanguage } = useAppContext();
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedRadioItem, setSelectedRadioItem] = useState('copy');
  const [targetResourceData, setTargetResourceData] = useState<
    TargetResourcesProps | undefined
  >(undefined);

  // page constants
  const pageSize = 10;
  const resourceCount = targetResourceData?.targetResources?.length || 0;
  const pageCount = Math.ceil(resourceCount / pageSize);
  const mainResourceName = targetResourceData?.mainResourceName;
  const language = contextLanguage || Language.FI;
  const targetResourcesStorageKey = 'targetResources';

  // event functions
  const onChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioItem(event.target.value);
  };
  const onConfirm = () => {
    // TODO: will be implemented later
    console.log('onConfirm()');
  };
  const onClose = () => {
    // TODO: will be implemented later
    console.log('onClose()');
  };
  const onRemove = (id: string) => {
    if (targetResourceData?.targetResources) {
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

  // get data of target resources
  useEffect(() => {
    if (resource) {
      if (targetResourcesString) {
        const targetResourceIDs = targetResourcesString.split(',');

        const handleApiResponse = async (resources: Resource[]) => {
          // for some reason origins are not part of Resource type, this need to be fixed in API
          const resourcesWithOrigins = [
            resource,
            ...resources,
          ] as ResourceWithOrigins[];
          const targetResources = [mainResourceId, ...targetResourceIDs]
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

          setTargetResourceData(newData);
          sessionStorage.storeItem<TargetResourcesProps>({
            key: targetResourcesStorageKey,
            value: newData,
          });
          setLoading(false);
        };

        setLoading(true);
        api
          .getResources(targetResourceIDs)
          .then(handleApiResponse)
          .catch((e: Error) => {
            setError(e);
            setLoading(false);
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
  }, [language, resource, targetResourcesString, mainResourceId]);

  // get main resource
  useEffect((): void => {
    setLoading(true);
    api
      .getResource(mainResourceId)
      .then(async (r: Resource) => {
        setResource(r);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e);
        setLoading(false);
      });
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

  if (isLoading || !resource || !targetResourceData) {
    return (
      <>
        <h1 className="resource-info-title">Toimipisteiden tietojen haku</h1>
      </>
    );
  }

  return (
    <div className="resource-batch-update-page">
      <section className="section-title">
        <h1>Joukkopäivitys</h1>
        <div className="button-close">
          <SecondaryButton size="small" onClick={onClose}>
            Palaa etusivulle
          </SecondaryButton>
        </div>
      </section>

      <section className="section-spans">
        <h2>Valitut aukiolot</h2>
        <p>Olet valinnut joukkopäivitykseen alla olevat aukioloajat.</p>
        {/* this block will be implemented later */}
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
            <PrimaryButton onClick={onConfirm}>Vahvista</PrimaryButton>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResourceBatchUpdatePage;
