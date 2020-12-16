import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

//test when we resive an empty object from fetch

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
