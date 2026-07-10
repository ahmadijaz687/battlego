import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

it('renders text correctly', () => {
  const { getByText } = render(<Text>Hello Jest</Text>);
  expect(getByText('Hello Jest')).toBeTruthy();
});

it('runs a basic math test', () => {
  expect(1 + 1).toBe(2);
});
