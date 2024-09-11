import React from 'react';
import './Link.scss';

export function Link({
  href,
  text,
  dataTest,
}: {
  href: string;
  text: string;
  dataTest?: string;
}): JSX.Element {
  return (
    <a data-testid={dataTest} href={href} className="custom-link">
      {text}
    </a>
  );
}

export function ExternalLink({
  href,
  text,
}: {
  href: string;
  text: string;
}): JSX.Element {
  return (
    <a
      href={href}
      className="custom-link"
      rel="noopener noreferrer"
      target="_blank">
      {text}
    </a>
  );
}
