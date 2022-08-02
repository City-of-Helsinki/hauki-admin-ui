import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const useReturnToResourcePage = () => {
  const history = useHistory();
  const {
    params: { parentId, id: resourceId },
  } = useRouteMatch<{
    parentId?: string;
    id?: string;
  }>();

  return useCallback(() => {
    if (!parentId && !resourceId) {
      throw new Error(
        'Invalid route. No parentId or resourceId found in the path'
      );
    }

    history.push(
      `/resource/${parentId ? `${parentId}/child/${resourceId}` : resourceId}`
    );
  }, [history, parentId, resourceId]);
};

export default useReturnToResourcePage;
