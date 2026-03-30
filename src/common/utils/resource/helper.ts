import { Resource, ResourceType } from '../../lib/types';

 
export const isUnitResource = (resource: Resource): boolean =>
  resource.resource_type === ResourceType.UNIT;
