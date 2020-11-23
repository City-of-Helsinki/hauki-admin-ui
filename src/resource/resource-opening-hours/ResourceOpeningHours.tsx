import React, { useState } from 'react';
import { IconInfoCircle, Navigation, Button } from 'hds-react';
import { useHistory } from 'react-router-dom';
import OpeningPeriod from './opening-period/OpeningPeriod';
import Collapse from '../../components/collapse/Collapse';
import './ResourceOpeningHours.scss';
import { DatePeriod } from '../../common/lib/types';

enum PeriodsListTheme {
  DEFAULT = 'DEFAULT',
  LIGHT = 'LIGHT',
}

const OpeningPeriodsList = ({
  id,
  addNewOpeningPeriodButtonDataTest,
  resourceId,
  title,
  datePeriods,
  theme,
  notFoundLabel,
}: {
  id: string;
  addNewOpeningPeriodButtonDataTest?: string;
  resourceId: string;
  title: string;
  datePeriods: DatePeriod[];
  theme: PeriodsListTheme;
  notFoundLabel: string;
}): JSX.Element => {
  const openingPeriodsHeaderClassName =
    theme === PeriodsListTheme.LIGHT
      ? 'opening-periods-header-light'
      : 'opening-periods-header';

  interface LanguageOption {
    label: string;
    value: string;
  }

  const languageOptions: LanguageOption[] = [
    { label: 'Suomeksi', value: 'fi' },
    { label: 'Svenska', value: 'sv' },
    { label: 'English', value: 'en' },
  ];
  const history = useHistory();
  const [language, setLanguage] = useState(languageOptions[0]);
  const formatSelectedValue = ({ value }: LanguageOption): string =>
    value.toUpperCase();

  return (
    <section className="opening-periods-section">
      <header className={openingPeriodsHeaderClassName}>
        <div className="opening-periods-header-container">
          <h3 className="opening-periods-header-title">{title}</h3>
          <IconInfoCircle
            aria-label="Lisätietoja aukiolojaksoista nappi"
            className="opening-periods-header-info"
          />
        </div>
        <div className="opening-periods-header-container">
          <p className="period-count">{datePeriods.length} jaksoa</p>
          <Navigation.LanguageSelector label={formatSelectedValue(language)}>
            {languageOptions.map((languageOption) => (
              <Navigation.Item
                key={languageOption.value}
                label={languageOption.label}
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
                ): void => {
                  e.preventDefault();
                  setLanguage(languageOption);
                }}
              />
            ))}
          </Navigation.LanguageSelector>
          <Button
            data-test={addNewOpeningPeriodButtonDataTest}
            size="small"
            className="opening-period-header-button"
            onClick={(): void =>
              history.push(`/resource/${resourceId}/period/new`)
            }
            variant="secondary">
            Lisää uusi +
          </Button>
        </div>
      </header>
      {datePeriods.length > 0 ? (
        <ul className="opening-periods-list" data-test={id}>
          {datePeriods.map((datePeriod: DatePeriod) => (
            <li key={datePeriod.id}>
              <OpeningPeriod datePeriod={datePeriod} />
            </li>
          ))}
        </ul>
      ) : (
        <OpeningPeriodsNotFound text={notFoundLabel} />
      )}
    </section>
  );
};

const OpeningPeriodsNotFound = ({ text }: { text: string }): JSX.Element => (
  <p className="opening-periods-not-found">{text}</p>
);

export default function ResourceOpeningHours({
  id,
  datePeriods,
}: {
  id: string;
  datePeriods: DatePeriod[];
}): JSX.Element {
  const [
    defaultPeriods = [],
    exceptionPeriods = [],
  ]: DatePeriod[][] = datePeriods.reduce(
    ([defaults = [], exceptions = []]: DatePeriod[][], current: DatePeriod) => {
      return current.override
        ? [defaults, [...exceptions, current]]
        : [[...defaults, current], exceptions];
    },
    []
  );

  return (
    <Collapse
      isOpen
      collapseContentId={`${id}-opening-hours-section`}
      title="Toimipisteen aukiolotiedot">
      <p>
        Toimipisteen aukiolotietoja muokataan jaksokohtaisesti. Aukiolojaksot
        voivat olla julkaistuja tai julkaisemattomia. Alla voit selata myös
        tulevia ja menneitä aukiolojaksoja. Näet alla myös eri kieliversiot
        valitsemalla kielen valikosta. Huomioithan, että palvelu voi itse valita
        aukiolojaksojen esitystavan, se ei välttämättä ole alla näkyvän
        kaltainen.
      </p>
      <OpeningPeriodsList
        id="resource-opening-periods-list"
        addNewOpeningPeriodButtonDataTest="add-new-opening-period-button"
        resourceId={id}
        title="Aukiolojaksot"
        datePeriods={defaultPeriods}
        theme={PeriodsListTheme.DEFAULT}
        notFoundLabel="Ei aukiolojaksoja."
      />
      <OpeningPeriodsList
        id="resource-exception-opening-periods-list"
        resourceId={id}
        title="Poikkeusaukiolojaksot"
        datePeriods={exceptionPeriods}
        theme={PeriodsListTheme.LIGHT}
        notFoundLabel="Ei poikkeusaukiolojaksoja."
      />
    </Collapse>
  );
}
