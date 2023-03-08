import { useEffect, useState } from 'react';
import { Resource } from '../common/lib/types';
import api from '../common/utils/api/api';

const useResource = (resourceId: string): Resource | undefined => {
  const [resource, setResource] = useState<Resource>();

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      const apiResource = await api.getResource(resourceId);
      setResource(apiResource);
    };

    fetchData();
  }, [resourceId]);

  return resource;
};

export default useResource;
