import { fireEvent, render, screen } from '@testing-library/react';
import ResourceTitle from './ResourceTitle';
import { Language, Resource, ResourceType } from '../../common/lib/types';

const testResource: Resource = {
  id: 1186,
  name: {
    fi: 'Nimi suomeksi',
    sv: 'Namn på svenska',
    en: '',
  },
  description: { fi: 'Kuvaus', sv: 'Beskrivning', en: 'Description' },
  address: { fi: 'Osoite', sv: 'Adress', en: 'Address' },
  extra_data: { citizen_url: '', admin_url: '' },
  children: [],
  parents: [],
  resource_type: ResourceType.UNIT,
};

describe('ResourceTitle', () => {
  it('shows the resource name in the given language', () => {
    render(<ResourceTitle language={Language.SV} resource={testResource} />);

    expect(screen.getByTestId('resource-info')).toHaveTextContent(
      'Namn på svenska'
    );
  });

  it('falls back to the finnish name when the language version is missing', () => {
    render(<ResourceTitle language={Language.EN} resource={testResource} />);

    expect(screen.getByTestId('resource-info')).toHaveTextContent(
      'Nimi suomeksi'
    );
  });

  it('shows a unit placeholder when no name is found', () => {
    const nameless = {
      ...testResource,
      name: { fi: '', sv: '', en: '' },
    };

    render(<ResourceTitle language={Language.FI} resource={nameless} />);

    expect(screen.getByTestId('resource-info')).toHaveTextContent(
      'Suomenkielinen toimipisteen nimi puuttuu.'
    );
  });

  it('shows a child resource placeholder for non-unit resources', () => {
    const namelessChild = {
      ...testResource,
      name: { fi: '', sv: '', en: '' },
      resource_type: ResourceType.SECTION,
    };

    render(<ResourceTitle language={Language.FI} resource={namelessChild} />);

    expect(screen.getByTestId('resource-info')).toHaveTextContent(
      'Suomenkielinen alakohteen nimi puuttuu.'
    );
  });

  it('shows a placeholder when there is no resource at all', () => {
    render(<ResourceTitle language={Language.FI} />);

    expect(screen.getByTestId('resource-info')).toHaveTextContent(
      'Suomenkielinen alakohteen nimi puuttuu.'
    );
  });

  it('appends the title addon and renders children', () => {
    render(
      <ResourceTitle
        language={Language.FI}
        resource={testResource}
        titleAddon="Menneet ajat">
        <p>Lisätiedot</p>
      </ResourceTitle>
    );

    expect(screen.getByTestId('resource-info')).toHaveTextContent(
      'Nimi suomeksi - Menneet ajat'
    );
    expect(screen.getByText('Lisätiedot')).toBeInTheDocument();
  });

  it('marks the title as pinned when scrolled to the top', () => {
    render(<ResourceTitle language={Language.FI} resource={testResource} />);

    const title = screen.getByTestId('resource-info');
    expect(title).not.toHaveClass('resource-info-title--on-top');

    fireEvent.scroll(window);

    expect(title).toHaveClass('resource-info-title--on-top');
  });

  it('ignores scrolling while the title is transitioning', () => {
    render(<ResourceTitle language={Language.FI} resource={testResource} />);

    const title = screen.getByTestId('resource-info');
    fireEvent(title, new Event('transitionstart'));
    fireEvent.scroll(window);

    expect(title).not.toHaveClass('resource-info-title--on-top');

    fireEvent(title, new Event('transitionend'));
    fireEvent.scroll(window);

    expect(title).toHaveClass('resource-info-title--on-top');
  });
});
