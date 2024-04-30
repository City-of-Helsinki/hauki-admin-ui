// eslint-disable-next-line import/no-extraneous-dependencies
import { getResource, getDatePeriodIds, deleteDatePeriods } from '../utils';

export default async () => {
  console.log('Deleting date periods from test resource');

  const resource = await getResource();
  const datePeriodIds = await getDatePeriodIds(resource.id);
  await deleteDatePeriods(datePeriodIds);
};
