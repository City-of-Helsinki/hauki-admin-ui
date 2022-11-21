import React from 'react';
import { TextInput } from 'hds-react';
import { Controller } from 'react-hook-form';
import './OpeningHoursTitles.scss';
import { LanguageStrings } from '../../common/lib/types';
import { toCharCount } from '../../common/utils/form/form';

type Props = {
  placeholders: LanguageStrings;
};

const nameMaxLength = 100;

const titleRules = { maxLength: { value: nameMaxLength, message: 'Tarkista' } };

const OpeningHoursTitles = ({ placeholders }: Props): JSX.Element => (
  <div className="card opening-hours-titles">
    <div className="opening-hours-titles-inputs">
      <Controller
        name="name.fi"
        rules={titleRules}
        render={({
          field: { ref, name, onChange, onBlur, value },
          fieldState: { error },
        }): JSX.Element => (
          <TextInput
            ref={ref}
            aria-describedby="title-fi-helper-text"
            data-test="opening-period-title-fi"
            invalid={!!error}
            errorText={error?.message}
            helperText={toCharCount(nameMaxLength, value)}
            id="title-fi"
            label="Aukioloajan otsikko suomeksi"
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholders.fi ?? ''}
            value={value ?? ''}
          />
        )}
      />
      <Controller
        name="name.sv"
        rules={titleRules}
        render={({
          field: { ref, name, onChange, onBlur, value },
          fieldState: { error },
        }): JSX.Element => (
          <TextInput
            ref={ref}
            data-test="opening-period-title-sv"
            invalid={!!error}
            errorText={error?.message}
            helperText={toCharCount(nameMaxLength, value)}
            id="title-sv"
            label="Aukioloajan otsikko ruotsiksi"
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholders.sv ?? ''}
            value={value ?? ''}
          />
        )}
      />
      <Controller
        name="name.en"
        rules={titleRules}
        render={({
          field: { ref, name, onChange, onBlur, value },
          fieldState: { error },
        }): JSX.Element => (
          <TextInput
            ref={ref}
            data-test="opening-period-title-en"
            invalid={!!error}
            errorText={error?.message}
            helperText={toCharCount(nameMaxLength, value)}
            id="title-en"
            label="Aukioloajan otsikko englanniksi"
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholders.en ?? ''}
            value={value ?? ''}
          />
        )}
      />
    </div>
    <p className="titles-helper-text" id="title-fi-helper-text">
      Otsikko ei ole pakollinen. Tähän kohtaan voit kirjoittaa esim talviaika,
      kevätkausi ym. Älä kirjoita aukiolokohdetta esim sauna, uima-allas, kerros
      tms.
    </p>
  </div>
);

export default OpeningHoursTitles;
