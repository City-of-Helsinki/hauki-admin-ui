// Based on: https://github.com/City-of-Helsinki/palvelutarjotin-admin/blob/release-0.1.0/src/common/components/datepicker/TimesList.tsx
import React from 'react';
import useDropdownKeyboardNavigation from './useDropdownKeyboardNavigation';
import ScrollIntoViewWithFocus from './ScrollIntoViewWithFocus';
import './Datepicker.scss';

type TimeObject = { hours: number; minutes: number };

type TimesListProps = {
  times: TimeObject[];
  onTimeClick: (time: TimeObject) => void;
  datetime: Date | null;
};

function formatTime({ hours, minutes }: TimeObject): string {
  const hour = hours.toString().padStart(2, '0');
  const minute = minutes.toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

const TimesList = React.memo(
  React.forwardRef<HTMLDivElement, TimesListProps>(
    ({ times, onTimeClick, datetime }, forwardedRef) => {
      const findSelectedIndex = React.useCallback(() => {
        if (datetime) {
          const index = times.findIndex(
            (time) =>
              datetime.getHours() === time.hours &&
              datetime.getMinutes() === time.minutes
          );
          return index < 0 ? 0 : index;
        }
        return 0;
      }, [datetime, times]);

      const [selectedIndex, setSelectedIndex] = React.useState<number>(() => {
        return findSelectedIndex();
      });

      const {
        focusedIndex,
        setFocusedIndex,
        setup: setupKeyboardNav,
        teardown: teardownKeyoboardNav,
      } = useDropdownKeyboardNavigation({
        container: forwardedRef as React.MutableRefObject<HTMLDivElement | null>,
        listLength: times.length,
        initialFocusedIndex: findSelectedIndex(),
      });

      React.useEffect(() => {
        setupKeyboardNav();
        return (): void => {
          teardownKeyoboardNav();
        };
      }, [setupKeyboardNav, teardownKeyoboardNav]);

      React.useEffect(() => {
        setSelectedIndex(findSelectedIndex());
      }, [datetime, findSelectedIndex, setFocusedIndex]);

      return (
        <>
          <div className="timesDivider" />
          <div
            aria-label="Valitse kellonaika nuolinäppäimillä"
            className="timesListContainer"
            tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
            ref={forwardedRef}>
            <div className="timesList">
              {times.map((time, index) => (
                <TimeItem
                  key={`${time.hours}:${time.minutes}`}
                  label={`Valitse kellonajaksi ${formatTime(time)}`}
                  time={time}
                  index={index}
                  selected={selectedIndex === index}
                  focused={focusedIndex === index}
                  setFocusedIndex={setFocusedIndex}
                  onTimeClick={onTimeClick}
                />
              ))}
            </div>
          </div>
        </>
      );
    }
  )
);

type TimeItemProps = {
  time: TimeObject;
  focused: boolean;
  index: number;
  setFocusedIndex: (index: number) => void;
  onTimeClick: (time: TimeObject) => void;
  selected: boolean;
  label: string;
};

const TimeItem: React.FC<TimeItemProps> = ({
  time,
  focused,
  index,
  selected,
  label,
  setFocusedIndex,
  onTimeClick,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // scroll focused element into view
  React.useEffect(() => {
    if (focused && buttonRef.current) {
      buttonRef.current.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [focused]);

  React.useEffect(() => {
    if (focused && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [focused]);

  const handleMouseEnter = (): void => {
    setFocusedIndex(index);
  };

  return (
    <ScrollIntoViewWithFocus
      isFocused={selected}
      scrollIntoViewOptions={{ block: 'center', inline: 'center' }}>
      <button
        className={selected ? 'timeItem selectedTimeItem' : 'timeItem'}
        aria-label={label}
        ref={buttonRef}
        type="button"
        onMouseEnter={(): void => {
          handleMouseEnter();
        }}
        tabIndex={focused ? 0 : -1}
        onClick={(): void => onTimeClick(time)}>
        {formatTime(time)}
      </button>
    </ScrollIntoViewWithFocus>
  );
};

export default TimesList;
