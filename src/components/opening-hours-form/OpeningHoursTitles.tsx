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
            aria-describedby="title-fi-helper-text"
            data-test="opening-period-title-fi"
            errorText={error?.message}
            helperText={toCharCount(nameMaxLength, value)}
            id="title-fi"
            invalid={!!error}
            label="Aukioloajan otsikko suomeksi"
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholders.fi ?? ''}
            ref={ref}
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
            data-test="opening-period-title-sv"
            errorText={error?.message}
            helperText={toCharCount(nameMaxLength, value)}
            id="title-sv"
            invalid={!!error}
            label="Aukioloajan otsikko ruotsiksi"
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholders.sv ?? ''}
            ref={ref}
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
            data-test="opening-period-title-en"
            errorText={error?.message}
            helperText={toCharCount(nameMaxLength, value)}
            id="title-en"
            invalid={!!error}
            label="Aukioloajan otsikko englanniksi"
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholders.en ?? ''}
            ref={ref}
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
