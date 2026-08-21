import { render, screen, waitFor } from '@testing-library/react';
import useResource from './useResource';
import useDatePeriod from './useDatePeriod';
import api from '../common/utils/api/api';
import { Resource, ResourceType } from '../common/lib/types';

const testResource = {
  id: 1186,
  name: { fi: 'Nimi', sv: 'Namn', en: 'Name' },
  resource_type: ResourceType.UNIT,
} as Resource;

const ResourceName = ({ resourceId }: { resourceId?: string }) => {
  const resource = useResource(resourceId);

  return <div data-testid="resource">{resource?.name.fi ?? 'none'}</div>;
};

const DatePeriodName = ({ datePeriodId }: { datePeriodId?: string }) => {
  const datePeriod = useDatePeriod(datePeriodId);

  return <div data-testid="date-period">{datePeriod?.name.fi ?? 'none'}</div>;
};

describe('useResource', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the resource by id', async () => {
    const getResource = vi
      .spyOn(api, 'getResource')
      .mockResolvedValue(testResource);

    render(<ResourceName resourceId="tprek:8100" />);

    await waitFor(() =>
      expect(screen.getByTestId('resource')).toHaveTextContent('Nimi')
    );
    expect(getResource).toHaveBeenCalledWith('tprek:8100');
  });

  it('does not fetch without a resource id', () => {
    const getResource = vi.spyOn(api, 'getResource');

    render(<ResourceName />);

    expect(screen.getByTestId('resource')).toHaveTextContent('none');
    expect(getResource).not.toHaveBeenCalled();
  });
});

describe('useDatePeriod', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the date period by numeric id', async () => {
    const getDatePeriod = vi.spyOn(api, 'getDatePeriod').mockResolvedValue({
      name: { fi: 'Jakso', sv: null, en: null },
    } as never);

    render(<DatePeriodName datePeriodId="42" />);

    await waitFor(() =>
      expect(screen.getByTestId('date-period')).toHaveTextContent('Jakso')
    );
    expect(getDatePeriod).toHaveBeenCalledWith(42);
  });

  it('does not fetch without a date period id', () => {
    const getDatePeriod = vi.spyOn(api, 'getDatePeriod');

    render(<DatePeriodName />);

    expect(screen.getByTestId('date-period')).toHaveTextContent('none');
    expect(getDatePeriod).not.toHaveBeenCalled();
  });
});
