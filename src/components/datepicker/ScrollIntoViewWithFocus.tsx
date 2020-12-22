// Based on: https://github.com/City-of-Helsinki/palvelutarjotin-admin/blob/release-0.1.0/src/common/components/scrollIntoViewWithFocus/ScrollIntoViewWithFocus.tsx
import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

interface Props {
  children: React.ReactNode;
  isFocused: boolean;
  scrollIntoViewOptions?: ScrollIntoViewOptions;
}

const ScrollIntoViewWithFocus: React.FC<Props> = ({
  children,
  isFocused,
  scrollIntoViewOptions = { block: 'nearest', inline: 'nearest' },
}) => {
  const selfRef = React.useRef<HTMLDivElement | null>(null);

  useDeepCompareEffect(() => {
    if (isFocused) {
      // jsdom doesn't support scrollIntoView
      if (selfRef.current && selfRef.current.scrollIntoView) {
        selfRef.current.scrollIntoView(scrollIntoViewOptions);
      }
    }
  }, [isFocused, scrollIntoViewOptions]);

  return <div ref={selfRef}>{children}</div>;
};

export default ScrollIntoViewWithFocus;
