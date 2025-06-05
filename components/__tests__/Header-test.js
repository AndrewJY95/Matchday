import * as React from 'react';
import renderer from 'react-test-renderer';

import Header from '../Header';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
  usePathname: () => '/',
  useNavigation: () => ({ canGoBack: () => false }),
}));

it('renders correctly', () => {
  const tree = renderer.create(<Header />).toJSON();
  expect(tree).toMatchSnapshot();
});
