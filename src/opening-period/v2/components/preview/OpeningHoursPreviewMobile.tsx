import { IconAngleDown, IconAngleUp, useAccordion } from 'hds-react';
import React, { useRef } from 'react';
import { Language, TranslatedApiChoice } from '../../../../common/lib/types';
import { SupplementaryButton } from '../../../../components/button/Button';
import useMobile from '../../../../hooks/useMobile';
import useOnClickOutside from '../../../../hooks/useOnClickOutside';
import { OpeningHours } from '../../types';
import OpeningHoursPreview from './OpeningHoursPreview';
import './OpeningHoursPreviewMobile.scss';

type Props = {
  language: Language;
  openingHours: OpeningHours[];
  resourceStates: TranslatedApiChoice[];
};

const OpeningHoursPreviewMobile = ({
  openingHours,
  resourceStates,
}: Props): JSX.Element => {
  const { isOpen, buttonProps, closeAccordion } = useAccordion({
    initiallyOpen: false,
  });
  const mobilePreview = useRef<HTMLDivElement>(null);
  useOnClickOutside(mobilePreview, closeAccordion);
  const isMobile = useMobile();

  return (
    <div ref={mobilePreview}>
      <SupplementaryButton
        className="opening-hours-preview-mobile-toggle"
        iconRight={
          isOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />
        }
        size={isMobile ? 'small' : 'default'}
        {...buttonProps}>
        Esikatselu
      </SupplementaryButton>
      <div
        className={`opening-hours-preview-mobile ${
          isOpen
            ? 'opening-hours-preview-mobile--open'
            : 'opening-hours-preview-mobile--closed'
        }`}>
        <OpeningHoursPreview
          className="opening-hours-preview-mobile-preview"
          openingHours={openingHours}
          resourceStates={resourceStates}
        />
      </div>
    </div>
  );
};

export default OpeningHoursPreviewMobile;
