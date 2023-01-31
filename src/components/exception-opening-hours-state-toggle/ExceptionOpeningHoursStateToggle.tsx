import React, { ReactNode, useState } from 'react';
import { RadioButton, SelectionGroup } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import { DatePeriod } from '../../common/lib/types';
import './ExceptionOpeningHoursStateToggle.scss';
import { getDifferenceInDays } from '../../common/utils/date-time/date-time';

const ExceptionOpeningHoursStateToggle = ({
  id,
  children,
  initiallyOpen,
  onClose,
  onOpen,
}: {
  id: string;
  children?: ReactNode;
  initiallyOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}): JSX.Element => {
  const [isOpen, setOpen] = useState<boolean>(initiallyOpen);
  const { watch } = useFormContext<DatePeriod>();
  const [startDate, endDate] = watch(['startDate', 'endDate']);
  const differenceInDays = getDifferenceInDays(startDate, endDate);

  return (
    <>
      <SelectionGroup
        className="exception-opening-hours-resource-state-toggle"
        label="">
        <RadioButton
          data-test="closed-state-checkbox"
          id={`${id}-closed-state-checkbox`}
          name={`${id}-closed-state-checkbox`}
          checked={!isOpen}
          label={differenceInDays > 0 ? 'Suljettu' : 'Suljettu koko päivän'}
          onChange={(): void => {
            setOpen(false);
            onClose();
          }}
        />
        <RadioButton
          data-test="open-state-checkbox"
          id={`${id}-open-state-checkbox`}
          name={`${id}-open-state-checkbox`}
          checked={isOpen}
          label="Poikkeava aukioloaika"
          onChange={(): void => {
            setOpen(true);
            onOpen();
          }}
        />
      </SelectionGroup>
      {isOpen && children}
    </>
  );
};

export default ExceptionOpeningHoursStateToggle;
