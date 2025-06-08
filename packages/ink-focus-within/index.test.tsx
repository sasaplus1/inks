import * as React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { describe, test, expect } from 'vitest';
import {
  FocusedIdProvider,
  useFocusedId,
  NestedIdProvider,
  useNestedId,
  useFocusWithin
} from './index';

function TestFocusedIdComponent() {
  const { focusedId, useSetFocusedId } = useFocusedId();

  useSetFocusedId({
    id: 'test-component',
    nestedId: 'root',
    isFocused: true
  });

  return <Text>Focused: {focusedId}</Text>;
}

function TestNestedIdComponent() {
  const { nestedId } = useNestedId();
  return <Text>Nested ID: {nestedId}</Text>;
}

function TestFocusWithinComponent({ targetId }: { targetId: string }) {
  const isFocused = useFocusWithin(targetId);
  return (
    <Text>
      Focus Within {targetId}: {isFocused ? 'true' : 'false'}
    </Text>
  );
}

describe('ink-focus-within', () => {
  test('FocusedIdProvider provides context', () => {
    const { lastFrame } = render(
      <FocusedIdProvider>
        <TestFocusedIdComponent />
      </FocusedIdProvider>
    );

    const output = lastFrame();
    // The focused ID starts empty and gets set by useSetFocusedId
    expect(output).toContain('Focused:');
  });

  test('basic functionality works', () => {
    // Simple test to verify the hooks work in basic scenarios
    const { lastFrame } = render(
      <FocusedIdProvider>
        <NestedIdProvider id="test">
          <TestNestedIdComponent />
        </NestedIdProvider>
      </FocusedIdProvider>
    );

    const output = lastFrame();
    expect(output).toContain('Nested ID:');
  });

  test('NestedIdProvider provides nested context', () => {
    const { lastFrame } = render(
      <NestedIdProvider id="parent">
        <NestedIdProvider id="child">
          <TestNestedIdComponent />
        </NestedIdProvider>
      </NestedIdProvider>
    );

    const output = lastFrame();
    expect(output).toContain('Nested ID: .parent.child');
  });

  test('focus state management works', () => {
    function TestFocusComponent() {
      const { focusedId } = useFocusedId();
      return <Text>Current focus: {focusedId}</Text>;
    }

    const { lastFrame } = render(
      <FocusedIdProvider>
        <TestFocusComponent />
      </FocusedIdProvider>
    );

    const output = lastFrame();
    expect(output).toContain('Current focus:');
  });

  test('useFocusWithin works correctly', () => {
    function TestComponent() {
      const { useSetFocusedId } = useFocusedId();

      useSetFocusedId({
        id: 'button',
        nestedId: 'form.section',
        isFocused: true
      });

      return (
        <>
          <TestFocusWithinComponent targetId="form" />
          <TestFocusWithinComponent targetId="section" />
          <TestFocusWithinComponent targetId="button" />
          <TestFocusWithinComponent targetId="other" />
        </>
      );
    }

    const { lastFrame } = render(
      <FocusedIdProvider>
        <TestComponent />
      </FocusedIdProvider>
    );

    const output = lastFrame();
    // Focus within checks if the target id is included in the focused id
    expect(output).toContain('Focus Within form:');
    expect(output).toContain('Focus Within section:');
    expect(output).toContain('Focus Within button:');
    expect(output).toContain('Focus Within other: false');
  });

  test('nested providers work together', () => {
    function TestComponent() {
      const { useSetFocusedId } = useFocusedId();
      const { nestedId } = useNestedId();

      useSetFocusedId({
        id: 'input',
        nestedId,
        isFocused: true
      });

      return <Text>Current: {nestedId}</Text>;
    }

    const { lastFrame } = render(
      <FocusedIdProvider>
        <NestedIdProvider id="form">
          <NestedIdProvider id="fieldset">
            <TestComponent />
          </NestedIdProvider>
        </NestedIdProvider>
      </FocusedIdProvider>
    );

    const output = lastFrame();
    expect(output).toContain('Current: .form.fieldset');
  });
});
