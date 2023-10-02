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

const onConfirm = () => {
  console.log('onConfirm()');
};
const onClose = () => {
  console.log('onClose()');
};
const onRemove = (id: string) => {
  console.log('onRemove()', id);
};

const ResourceBatchUpdatePage = ({
  id,
  targetResourcesString,
}: {
  id: string;
  targetResourcesString?: string;
}): JSX.Element => {
  const { language: contextLanguage } = useAppContext();
  const language = contextLanguage || Language.FI;
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [targetResourceInfos, setTargetResourceInfos] = useState<Resource[]>(
    []
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedRadioItem, setSelectedRadioItem] = useState('copy');
  const onChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioItem(event.target.value);
  };
  const [targetResourceData, setTargetResourceData] = useState<
    TargetResourcesProps | undefined
  >(undefined);
  const targetResourcesStorageKey = 'targetResources';

  const cols = [
    {
      key: 'id',
      headerName: 'ID',
      isSortable: true,
      transform: (item: { id: string }) => {
        return <div style={{ textAlign: 'right' }}>{item.id}</div>;
      },
    },
    { key: 'resource', headerName: 'Toimipiste', isSortable: true },
    {
      key: 'remove',
      headerName: '',
      transform: (item: { id: string }) => {
        return (
          <div style={{ textAlign: 'right', color: 'red' }}>
            <SupplementaryButton size="small" onClick={() => onRemove(item.id)}>
              <IconTrash size="xs" />
            </SupplementaryButton>
          </div>
        );
      },
    },
  ];
  const rows = targetResourceInfos?.map((res) => ({
    id: res.id,
    resource: res?.name[language],
    remove: 'x',
  }));

  useEffect(() => {
    const fetchTargetResourceInfos = async (ids: string[]): Promise<void> => {
      setLoading(true);
      try {
        const [resources] = await Promise.all([api.getResources(ids)]);
        setTargetResourceInfos(resources);
      } catch (e) {
        setError(e as Error);
      }
      setLoading(false);
    };
    if (resource) {
      if (targetResourcesString) {
        const mainResourceId = resource.id;
        const mainResourceName = resource?.name[language];
        const targetResources = targetResourcesString.split(',');
        const newData = { mainResourceId, mainResourceName, targetResources };
        setTargetResourceData(newData);
        sessionStorage.storeItem<TargetResourcesProps>({
          key: targetResourcesStorageKey,
          value: newData,
        });
        fetchTargetResourceInfos(targetResources);
      } else {
        const oldData = sessionStorage.getItem<TargetResourcesProps>(
          targetResourcesStorageKey
        );
        if (oldData) {
          if (oldData.mainResourceId === resource?.id) {
            setTargetResourceData(oldData);
          } else {
            sessionStorage.removeItem(targetResourcesStorageKey);
          }
        }
      }
    }
  }, [language, resource, targetResourcesString]);

  useEffect((): void => {
    api
      .getResource(id)
      .then(async (r: Resource) => {
        setResource(r);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e);
        setLoading(false);
      });
  }, [id]);

  if (error) {
    return (
      <>
        <h1 className="resource-info-title">Virhe</h1>
        <Notification label="Toimipistettä ei saatu ladattua." type="error">
          Tarkista toimipiste-id.
        </Notification>
      </>
    );
  }

  if (isLoading || !resource) {
    return (
      <>
        <h1 className="resource-info-title">Toimipisteen tietojen haku</h1>
      </>
    );
  }

  const resourceCount = targetResourceInfos?.length || 0;
  const pageSize = 10;
  const pageCount = Math.ceil(resourceCount / pageSize);
  const mainResourceName = targetResourceData?.mainResourceName;

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
      </section>

      <div className="section-resource-update">
        <section className="section-resources">
          <h2>Valitut toimipisteet</h2>
          <p>
            Olet valinnut {resourceCount} toimipistettä joukkopäivitykseen. Alta
            näet valitsemasi toimipisteet ja voit tarvittaessa poistaa
            yksittäisiä toimipisteitä listalta.
          </p>
          {rows && (
            <Table
              cols={cols}
              rows={rows.slice(
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
              console.log('Pagination setPageIndex', index);
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
