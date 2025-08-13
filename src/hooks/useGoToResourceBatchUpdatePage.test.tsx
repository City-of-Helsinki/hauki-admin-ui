import React from 'react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as routerMock from 'react-router-dom';
import useGoToResourceBatchUpdatePage from './useGoToResourceBatchUpdatePage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');

  return {
    ...mod,
    useParams: vi.fn(),
    useNavigate: () => mockNavigate,
  };
});

describe('useGoToResourceBatchUpdatePage', () => {
  it('should navigate to the correct batch update page when parentId and resourceId are provided', () => {
    vi.spyOn(routerMock, 'useParams').mockReturnValueOnce({
      parentId: 'parent1',
      id: 'resource1',
    });

    const { result } = renderHook(() => useGoToResourceBatchUpdatePage(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter initialEntries={['/somepath']}>
          <Routes>
            <Route path="*" element={children} />
          </Routes>
        </MemoryRouter>
      ),
    });

    result.current();

    expect(mockNavigate).toHaveBeenCalledWith(
      '/resource/parent1/child/resource1/batch'
    );
  });

  it('should navigate to the correct batch update page when only resourceId is provided', () => {
    vi.spyOn(routerMock, 'useParams').mockReturnValueOnce({ id: 'resource1' });

    const { result } = renderHook(() => useGoToResourceBatchUpdatePage(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter initialEntries={['/somepath']}>
          <Routes>
            <Route path="*" element={children} />
          </Routes>
        </MemoryRouter>
      ),
    });

    result.current();

    expect(mockNavigate).toHaveBeenCalledWith('/resource/resource1/batch');
  });

  it('should throw an error when neither parentId nor resourceId is provided', () => {
    vi.spyOn(routerMock, 'useParams').mockReturnValueOnce({});

    const { result } = renderHook(() => useGoToResourceBatchUpdatePage(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter initialEntries={['/somepath']}>
          <Routes>
            <Route path="*" element={children} />
          </Routes>
        </MemoryRouter>
      ),
    });

    expect(result.current).toThrowError(
      'Invalid route. No resource id found from the path.'
    );
  });
});
