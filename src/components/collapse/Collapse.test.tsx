import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Collapse from './Collapse';

describe('<Collapse />', () => {
  it('should hide content', () => {
    const { getByText } = render(
      <Collapse
        isOpen={false}
        collapseContentId="test-content"
        title="Test Title">
        <p>Test content</p>
      </Collapse>
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test content')).not.toBeVisible();
  });

  it('should show content when clicked', async () => {
    const { getByText } = render(
      <Collapse
        isOpen={false}
        collapseContentId="test-content"
        title="Test Title">
        <p>Test content</p>
      </Collapse>
    );

    fireEvent.click(getByText('Test Title'));

    expect(getByText('Test content')).toBeVisible();
  });
});
