import { useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const useReturnToResourcePage = (): (() => void) => {
  const navigate = useNavigate();
  const location = useLocation();
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

    // Check if user came from past opening hours view
    const returnToPastView = location.state?.returnToPastView;

    if (returnToPastView) {
      navigate(`/resource/${resourcePath}/past`);
    } else {
      navigate(`/resource/${resourcePath}`);
    }
  }, [navigate, parentId, resourceId, location.state]);
};

export default useReturnToResourcePage;
