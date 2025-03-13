import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const useReturnToResourcePage = (): (() => void) => {
  const navigate = useNavigate();
  const { parentId, id: resourceId } = useParams<{
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

    navigate(`/resource/${resourcePath}`);
  }, [navigate, parentId, resourceId]);
};

export default useReturnToResourcePage;
