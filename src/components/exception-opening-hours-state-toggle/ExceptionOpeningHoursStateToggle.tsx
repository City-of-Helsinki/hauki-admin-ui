import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          data-testid="closed-state-checkbox"
          id={`${id}-closed-state-checkbox`}
          name={`${id}-closed-state-checkbox`}
          checked={!isOpen}
          label={
            differenceInDays > 0
              ? t('OpeningHours.ExceptionStateClosed')
              : t('OpeningHours.ExceptionStateClosedWholeDay')
          }
          onChange={(): void => {
            setOpen(false);
            onClose();
          }}
        />
        <RadioButton
          data-testid="open-state-checkbox"
          id={`${id}-open-state-checkbox`}
          name={`${id}-open-state-checkbox`}
          checked={isOpen}
          label={t('OpeningHours.ExceptionStateOpen')}
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
