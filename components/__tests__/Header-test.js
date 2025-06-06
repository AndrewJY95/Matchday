import * as React from 'react';
import renderer from 'react-test-renderer';
import { Platform, TouchableOpacity } from 'react-native';

import Header from '../Header';

const backMock = jest.fn();
const canGoBackMock = jest.fn();
const pathnameMock = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: backMock }),
  usePathname: pathnameMock,
  useNavigation: () => ({ canGoBack: canGoBackMock }),
}));

it('renders correctly', () => {
  pathnameMock.mockReturnValue('/');
  canGoBackMock.mockReturnValue(false);
  const tree = renderer.create(<Header />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('does not crash on non-web platforms', () => {
  pathnameMock.mockReturnValue('/other');
  canGoBackMock.mockReturnValue(true);
  const originalPlatform = Platform.OS;
  Platform.OS = 'android';
  const originalWindow = global.window;
  // Simulate absence of window like in native environments
  // @ts-ignore
  delete global.window;

  const tree = renderer.create(<Header />);
  const button = tree.root.findByType(TouchableOpacity);
  expect(() => button.props.onPress()).not.toThrow();

  // Restore mocks
  Platform.OS = originalPlatform;
  global.window = originalWindow;
});
