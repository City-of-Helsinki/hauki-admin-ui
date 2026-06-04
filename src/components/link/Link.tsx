import './Link.scss';


export function Link({
  href,
  text,
  dataTest,
}: {
  href: string;
  text: string;
  dataTest?: string;
}) {
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
}) {
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
