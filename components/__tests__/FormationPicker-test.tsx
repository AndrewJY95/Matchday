import React from 'react';
import renderer from 'react-test-renderer';
import FormationPicker from '../FormationPicker';
import type { Player } from '../FormationPicker/types';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('FormationPicker', () => {
  it('renders correctly', () => {
    const players: Player[] = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
      { id: '3', name: 'C' },
      { id: '4', name: 'D' },
      { id: '5', name: 'E' },
    ];
    const tree = renderer.create(<FormationPicker players={players} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
