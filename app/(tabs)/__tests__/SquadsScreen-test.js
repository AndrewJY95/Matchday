import * as React from 'react';
import renderer from 'react-test-renderer';

import SquadsScreen from '../index';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

test('renders correctly', () => {
  const tree = renderer.create(<SquadsScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
