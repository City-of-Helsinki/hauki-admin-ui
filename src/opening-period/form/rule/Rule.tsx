import React, { useEffect, useState } from 'react';
import { Select } from 'hds-react';
import { ArrayField, Control, Controller } from 'react-hook-form';
import { InputOption, GroupRule, Frequency } from '../../../common/lib/types';

import './Rule.scss';

type FrequencyOption = {
  label: string;
  value: Frequency;
};

const hardCodedFrequencyOptions: FrequencyOption[] = [
  {
    label: '--',
    value: { frequency_ordinal: null, frequency_modifier: null },
  },
  {
    label: 'Jokainen',
    value: { frequency_ordinal: 1, frequency_modifier: null },
  },
  {
    label: 'Joka toinen',
    value: { frequency_ordinal: 2, frequency_modifier: null },
  },
  {
    label: 'Joka kolmas',
    value: { frequency_ordinal: 3, frequency_modifier: null },
  },
  {
    label: 'Joka neljäs',
    value: { frequency_ordinal: 4, frequency_modifier: null },
  },
  {
    label: 'Joka viides',
    value: { frequency_ordinal: 4, frequency_modifier: null },
  },
];

const frequencyToString = (frequency: Frequency): string =>
  `${frequency.frequency_ordinal} ${frequency.frequency_modifier} `;

const unknownFrequencyToString = (
  ordinal: number | null,
  modifierLabel?: string
): string => {
  const optionalOrdinalLabel: string | undefined =
    ordinal && ordinal > 1 ? `${ordinal}.` : undefined;

  return [optionalOrdinalLabel, modifierLabel].join(' ');
};

const convertFrequencyToOption = ({
  value,
  label,
}: {
  value: Frequency;
  label: string;
}): InputOption => ({
  label,
  value: frequencyToString(value),
});

const startAtOptions: InputOption[] = Array.from({ length: 10 }).map(
  (num, index) => ({
    label: `${index + 1}.`,
    value: (index + 1).toString(),
  })
);

export default function Rule({
  rule,
  control,
  setValue,
  register,
  index,
  ruleContextOptions,
  ruleFrequencyModifierOptions,
  ruleSubjectOptions,
}: {
  rule: Partial<ArrayField<Record<string, GroupRule>>>;
  control: Control;
  setValue: Function;
  register: Function;
  index: number;
  ruleContextOptions: InputOption[];
  ruleFrequencyModifierOptions: InputOption[];
  ruleSubjectOptions: InputOption[];
}): JSX.Element {
  const {
    id,
    context,
    subject,
    start: startAt,
    frequency_modifier: frequencyModifier,
    frequency_ordinal: frequencyOrdinal,
  } = rule;

  const selectedSubject = ruleSubjectOptions.find(
    ({ value }) => value === `${subject}`
  );
  const [subjectLabel, setSubjectLabel] = useState<string>(
    selectedSubject?.label ?? ''
  );

  const frequencyModifierField = `rules[${index}].frequency_modifier`;
  const frequencyOrdinalField = `rules[${index}].frequency_ordinal`;

  const currentFrequency: Frequency = {
    frequency_ordinal: frequencyOrdinal || null,
    frequency_modifier: frequencyModifier || null,
  } as Frequency;

  const knownFrequencyValues: FrequencyOption[] = [
    ...hardCodedFrequencyOptions,
    ...ruleFrequencyModifierOptions.map(
      (modifierOption: InputOption): FrequencyOption => ({
        label: modifierOption.label,
        value: {
          frequency_ordinal: null,
          frequency_modifier: modifierOption.value,
        },
      })
    ),
  ];

  const isKnownFrequencySelected = !!knownFrequencyValues.find(
    ({ value }) =>
      value.frequency_modifier === currentFrequency.frequency_modifier &&
      value.frequency_ordinal === currentFrequency.frequency_ordinal
  );

  const selectedModifier = ruleFrequencyModifierOptions.find(
    (modifierOption) =>
      modifierOption.value === currentFrequency.frequency_modifier
  );

  const allFrequencyValues: FrequencyOption[] = isKnownFrequencySelected
    ? knownFrequencyValues
    : [
        ...knownFrequencyValues,
        {
          label: unknownFrequencyToString(
            currentFrequency.frequency_ordinal,
            selectedModifier?.label
          ),
          value: currentFrequency,
        },
      ];

  const frequencyOptions: InputOption[] = allFrequencyValues.map(
    convertFrequencyToOption
  );

  const onFrequencyChange = (selected: InputOption): void => {
    const selectedFrequency = allFrequencyValues.find(
      ({ label }) => label === selected.label
    );

    if (selectedFrequency) {
      setValue(
        frequencyModifierField,
        selectedFrequency.value.frequency_modifier
      );

      setValue(
        frequencyOrdinalField,
        selectedFrequency.value.frequency_ordinal
      );
    }
  };

  useEffect(() => {
    register(frequencyModifierField);
    register(frequencyOrdinalField);
  }, [frequencyModifierField, frequencyOrdinalField, register]);

  return (
    <div className="opening-group-rule form-control" key={`rules-${index}`}>
      <input
        type="hidden"
        name={`rules[${index}].id`}
        defaultValue={id}
        ref={register()}
      />
      <Controller
        key={`rules-${index}-context`}
        name={`rules[${index}].context`}
        control={control}
        defaultValue={`${context || ''}`}
        render={({ onChange, value }): JSX.Element => (
          <Select
            id={`rules-${index}-context`}
            className="opening-group-rule-column opening-group-rule-select"
            onChange={(selected: InputOption): void => onChange(selected.value)}
            options={ruleContextOptions}
            defaultValue={ruleContextOptions.find(
              (option: InputOption): boolean => option.value === value
            )}
            label="Valitse aika"
            placeholder="Aikaväli"
          />
        )}
      />
      <Select
        key={`rules-${index}-frequency`}
        id={`rules-${index}-frequency`}
        className="opening-group-rule-column opening-group-rule-select"
        defaultValue={frequencyOptions.find(
          ({ value }) => value === frequencyToString(currentFrequency)
        )}
        onChange={(selected: InputOption): void => onFrequencyChange(selected)}
        options={frequencyOptions}
        label="Valitse monesko"
        placeholder="Tapahtumatiheys"
      />
      <Controller
        key={`rules-${index}-subject`}
        name={`rules[${index}].subject`}
        control={control}
        defaultValue={`${subject || ''}`}
        render={({ onChange, value }): JSX.Element => (
          <Select
            className="opening-group-rule-column opening-group-rule-select"
            defaultValue={ruleSubjectOptions.find(
              (selected: InputOption): boolean => selected.value === value
            )}
            onChange={(selected: InputOption): void => {
              onChange(selected.value);
              setSubjectLabel(selected.label);
            }}
            options={ruleSubjectOptions}
            label="Valitse ajan yksikkö"
            placeholder="päivä tai aikaväli"
          />
        )}
      />
      <div className="opening-group-rule-column opening-group-rule-column-large">
        <p
          className="opening-period-rule-divider"
          key={`rules-${index}-subject-divider`}>
          Alkaen
        </p>
        <Controller
          key={`rules-${index}-start`}
          name={`rules[${index}].start`}
          control={control}
          defaultValue={`${startAt || ''}`}
          render={({ onChange, value }): JSX.Element => (
            <Select
              className="opening-group-rule-select"
              defaultValue={startAtOptions.find(
                (selected: InputOption): boolean => selected.value === value
              )}
              onChange={(selected: InputOption): void =>
                onChange(selected.value)
              }
              options={startAtOptions}
              label={`Valitse monesko ${subjectLabel.toLowerCase() || ''}`}
              placeholder="Alkaen voimassa"
            />
          )}
        />
        <p
          className="opening-period-rule-divider"
          key={`rules-${index}-start-postfix`}>
          {subjectLabel || ''}
        </p>
      </div>
    </div>
  );
}
