import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AvailabilityToggle from '../AvailabilityToggle';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('AvailabilityToggle', () => {
  it('renders correctly when available', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <AvailabilityToggle available={true} onToggle={mockOnToggle} />
    );

    // Verify both buttons are rendered
    expect(getByTestId('available-button')).toBeTruthy();
    expect(getByTestId('unavailable-button')).toBeTruthy();
  });

  it('calls onToggle with correct value when available button is pressed', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <AvailabilityToggle available={false} onToggle={mockOnToggle} />
    );

    fireEvent.press(getByTestId('available-button'));
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with correct value when unavailable button is pressed', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <AvailabilityToggle available={true} onToggle={mockOnToggle} />
    );

    fireEvent.press(getByTestId('unavailable-button'));
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  it('applies correct styles based on availability', () => {
    const { getByTestId, rerender } = render(
      <AvailabilityToggle available={true} onToggle={() => {}} />
    );

    // When available
    const availableButton = getByTestId('available-button');
    const unavailableButton = getByTestId('unavailable-button');

    expect(availableButton).toHaveStyle({ backgroundColor: '#4CAF50' });
    expect(unavailableButton).toHaveStyle({ backgroundColor: '#333' }); // unselected state

    // When unavailable
    rerender(<AvailabilityToggle available={false} onToggle={() => {}} />);
    expect(availableButton).toHaveStyle({ backgroundColor: '#333' }); // unselected state
    expect(unavailableButton).toHaveStyle({ backgroundColor: '#F44336' });
  });

  it('displays correct icon colors based on availability state', () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <AvailabilityToggle available={true} onToggle={() => {}} />
    );

    // Get Ionicons components
    const checkIcon = getByTestId('available-button').children[0];
    const closeIcon = getByTestId('unavailable-button').children[0];

    // Check icon colors when available
    expect(checkIcon.props.color).toBe('#fff');
    expect(closeIcon.props.color).toBe('#F44336');

    // Rerender with unavailable state
    const { getByTestId: getByTestIdUnavailable } = render(
      <AvailabilityToggle available={false} onToggle={() => {}} />
    );

    const checkIconUnavailable = getByTestIdUnavailable('available-button').children[0];
    const closeIconUnavailable = getByTestIdUnavailable('unavailable-button').children[0];

    expect(checkIconUnavailable.props.color).toBe('#4CAF50');
    expect(closeIconUnavailable.props.color).toBe('#fff');
  });

  it('triggers onToggle when pressing already active button', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <AvailabilityToggle available={true} onToggle={mockOnToggle} />
    );

    // Press available button when already available
    fireEvent.press(getByTestId('available-button'));
    expect(mockOnToggle).toHaveBeenCalledWith(true);

    // Reset mock and test unavailable button
    mockOnToggle.mockClear();
    const { getByTestId: getByTestIdUnavailable } = render(
      <AvailabilityToggle available={false} onToggle={mockOnToggle} />
    );

    fireEvent.press(getByTestIdUnavailable('unavailable-button'));
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });
});
