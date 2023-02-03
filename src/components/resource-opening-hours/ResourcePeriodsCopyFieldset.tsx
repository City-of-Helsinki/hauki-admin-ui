import React, { useEffect, useState } from 'react';
import { Notification, IconCopy } from 'hds-react';
import api from '../../common/utils/api/api';
import {
  formatDate,
  datetimeFormFormat,
} from '../../common/utils/date-time/format';
import { useAppContext } from '../../App-context';
import { PrimaryButton } from '../button/Button';
import toast from '../notification/Toast';

export type TargetResourcesProps = {
  mainResourceName?: string;
  mainResourceId?: number;
  targetResources?: string[];
  modified?: string;
};

const ResourcePeriodsCopyFieldset = ({
  mainResourceName,
  mainResourceId,
  targetResources = [],
  onChange,
  modified,
  datePeriodIds,
}: TargetResourcesProps & {
  datePeriodIds: number[];
  onChange: (
    value: (TargetResourcesProps & { datePeriodIds: number[] }) | undefined
  ) => void;
}): JSX.Element => {
  const { hasOpenerWindow, closeAppWindow } = useAppContext();
  const [isCopyLoading, setIsCopyLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const copyDatePeriods = async (): Promise<void> => {
    if (datePeriodIds.length === 0) {
      setError('Valitse vähintää yksi aukiolojakso');
      return;
    }
    setIsCopyLoading(true);

    if (!mainResourceId || targetResources.length === 0) {
      return;
    }

    try {
      await api.copyDatePeriods(mainResourceId, targetResources, datePeriodIds);
      toast.success({
        dataTestId: 'period-copy-success',
        label:
          'Aukiolotietojen kopiointi onnistui. Voit tarvittaessa kopioida aukiolotiedot uudelleen.',
      });
      onChange({
        mainResourceName,
        mainResourceId,
        targetResources,
        modified: new Date().toJSON(),
        datePeriodIds,
      });
      setIsCopyLoading(false);
      if (closeAppWindow) {
        closeAppWindow();
      }
    } catch (err) {
      toast.error({
        dataTestId: 'period-copy-error',
        label:
          'Aukiolotietojen kopointi epäonnistui. Yritä myöhemmin uudelleen.',
      });
      setIsCopyLoading(false);

      // eslint-disable-next-line no-console
      console.error(err); // For debug purposes
    }
  };

  useEffect(() => {
    setError(undefined);
  }, [datePeriodIds, setError]);

  return (
    <div className="resource-copy-date-periods">
      <Notification
        className="resource-copy-date-periods__notification"
        style={{
          fontSize: '1rem',
        }}
        type="alert"
        label={`Olet valinnut joukkopäivityksessä ${
          (targetResources?.length || 0) + 1
        } pistettä. Klikkasit "${mainResourceName}"n aukiolotietoa. Sinulle on auennut ”${mainResourceName}”n aukiolotieto muokattavaksi.`}>
        <div className="resource-copy-date-periods__notification-content">
          <ul>
            <li>
              Aukioloajat kopioidaan joukkopäivityksessä valitsemiisi
              toimipisteisiin
            </li>
            <li>
              Valitse kopioitavat aukiolotiedot (rasti ruutuun aukiolojan
              edessä)
            </li>
            <li>
              {`Vie kopiointi loppuun painamalla "Kopioi aukiolotiedot x muuhun
            toimipisteeseen"`}
            </li>
          </ul>
          <PrimaryButton
            iconLeft={<IconCopy aria-hidden />}
            isLoading={isCopyLoading}
            loadingText="Aukiolotietoja kopioidaan"
            onClick={(): void => {
              copyDatePeriods();
            }}>{`Kopioi aukiolotiedot ${
            targetResources?.length
          } muuhun toimipisteeseen${
            hasOpenerWindow ? '. Ikkuna sulkeutuu.' : ''
          }`}</PrimaryButton>
          {modified && (
            <span className="resource-copy-modified-text">{`Tiedot päivitetty ${formatDate(
              modified,
              datetimeFormFormat
            )}`}</span>
          )}
        </div>
      </Notification>
      {error && (
        <Notification type="error" label="Aukiolojaksoja ei valittu">
          Valitse vähintään yksi aukiolojakso jatkaaksesi.
        </Notification>
      )}
    </div>
  );
};

export default ResourcePeriodsCopyFieldset;
