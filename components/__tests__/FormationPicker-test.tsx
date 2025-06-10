import React from 'react';
import renderer from 'react-test-renderer';
import FormationPicker from '../FormationPicker';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('FormationPicker', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<FormationPicker />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
