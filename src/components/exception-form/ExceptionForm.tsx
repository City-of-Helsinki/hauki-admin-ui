import React from 'react';
import { RadioButton, SelectionGroup } from 'hds-react';
import { TranslatedApiChoice } from '../../common/lib/types';
import TimeSpans from '../time-span/TimeSpans';
import './ExceptionForm.scss';

const ExceptionForm = ({
  id,
  isOpen,
  onClose,
  onOpen,
  resourceStates,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  resourceStates: TranslatedApiChoice[];
}): JSX.Element => (
  <>
    <SelectionGroup className="exception-form-resource-state-toggle" label="">
      <RadioButton
        id={`${id}-closed-state-checkbox`}
        name={`${id}-closed-state-checkbox`}
        checked={!isOpen}
        label="Suljettu koko päivän"
        onChange={(): void => onClose()}
      />
      <RadioButton
        id={`${id}-open-state-checkbox`}
        name={`${id}-open-state-checkbox`}
        checked={isOpen}
        label="Voimassa tietyn ajan"
        onChange={(): void => onOpen()}
      />
    </SelectionGroup>
    {isOpen && (
      <div className="holiday-form-fields">
        <TimeSpans
          resourceStates={resourceStates}
          namePrefix="openingHours[0].timeSpanGroups[0].timeSpans"
        />
      </div>
    )}
  </>
);

export default ExceptionForm;
