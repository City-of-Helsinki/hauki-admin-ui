import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const useReturnToResourcePage = (): (() => void) => {
  const history = useHistory();
  const {
    params: { parentId, id: resourceId },
  } = useRouteMatch<{
    parentId?: string;
    id?: string;
  }>();

  return useCallback(() => {
    if (!parentId && !resourceId) {
      throw new Error('Invalid route. No resource id found from the path.');
    }

    const resourcePath = parentId
      ? `${parentId}/child/${resourceId}`
      : resourceId;

    history.push(`/resource/${resourcePath}`);
  }, [history, parentId, resourceId]);
};

export default useReturnToResourcePage;
