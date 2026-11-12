import { useTranslation } from 'react-i18next';
import { TextInput } from 'hds-react';
import { Controller } from 'react-hook-form';
import './OpeningHoursTitles.scss';
import { LanguageStrings } from '../../common/lib/types';
import { toCharCount } from '../../common/utils/form/form';

const titlesHelperTextId = 'opening-hours-titles-helper-text';

// HDS TextInput replaces its own aria-describedby (helper and error text ids) with a passed one
// and does not set aria-invalid, so both are set here to keep errors announced (WCAG 3.3.1).
const titleA11yProps = (id: string, invalid: boolean) => ({
  'aria-describedby': [
    `${id}-helper`,
    invalid && `${id}-error`,
    titlesHelperTextId,
  ]
    .filter(Boolean)
    .join(' '),
  'aria-invalid': invalid,
});

type Props = {
  placeholders: LanguageStrings;
};

const OpeningHoursTitles = ({ placeholders }: Props) => {
  const { t } = useTranslation();

  const nameMaxLength = 100;

  const titleRules = {
    maxLength: { value: nameMaxLength, message: t('OpeningHours.Validate') },
  };

  return (
    <div className="card opening-hours-titles">
      <div className="opening-hours-titles-inputs">
        <Controller
          name="name.fi"
          rules={titleRules}
          render={({
            field: { ref, name, onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              {...titleA11yProps('title-fi', !!error)}
              data-testid="opening-period-title-fi"
              errorText={error?.message}
              helperText={toCharCount(nameMaxLength, value)}
              id="title-fi"
              invalid={!!error}
              label={t('OpeningHours.TitleInFinnish')}
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
          }) => (
            <TextInput
              {...titleA11yProps('title-sv', !!error)}
              data-testid="opening-period-title-sv"
              errorText={error?.message}
              helperText={toCharCount(nameMaxLength, value)}
              id="title-sv"
              invalid={!!error}
              label={t('OpeningHours.TitleInSwedish')}
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
          }) => (
            <TextInput
              {...titleA11yProps('title-en', !!error)}
              data-testid="opening-period-title-en"
              errorText={error?.message}
              helperText={toCharCount(nameMaxLength, value)}
              id="title-en"
              invalid={!!error}
              label={t('OpeningHours.TitleInEnglish')}
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
      <p className="titles-helper-text" id={titlesHelperTextId}>
        {t('OpeningHours.TitlesHelperText')}
      </p>
    </div>
  );
};

export default OpeningHoursTitles;
