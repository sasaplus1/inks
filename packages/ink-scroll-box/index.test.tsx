import * as React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { describe, test, expect } from 'vitest';
import { ScrollBox } from './index';

describe('ScrollBox', () => {
  const createTestChildren = (count: number): React.ReactNode[] => {
    return Array.from({ length: count }, (_, i) => (
      <Text key={i}>Item {i}</Text>
    ));
  };

  test('renders children without offset', () => {
    const children = createTestChildren(5);
    const { lastFrame } = render(
      <ScrollBox offset={0} height={3}>
        {children}
      </ScrollBox>
    );

    const output = lastFrame();
    expect(output).toContain('Item 0');
    expect(output).toContain('Item 1');
    expect(output).toContain('Item 2');
    expect(output).not.toContain('Item 3');
    expect(output).not.toContain('Item 4');
  });

  test('renders children with offset', () => {
    const children = createTestChildren(10);
    const { lastFrame } = render(
      <ScrollBox offset={2} height={3}>
        {children}
      </ScrollBox>
    );

    const output = lastFrame();
    expect(output).not.toContain('Item 0');
    expect(output).not.toContain('Item 1');
    expect(output).toContain('Item 2');
    expect(output).toContain('Item 3');
    expect(output).toContain('Item 4');
    expect(output).not.toContain('Item 5');
  });

  test('handles empty children array', () => {
    const { lastFrame } = render(
      <ScrollBox offset={0} height={3}>
        {[]}
      </ScrollBox>
    );

    const output = lastFrame();
    // Empty ScrollBox still renders with some whitespace/newlines
    expect(output.trim()).toBe('');
  });

  test('handles offset beyond children length', () => {
    const children = createTestChildren(3);
    const { lastFrame } = render(
      <ScrollBox offset={5} height={3}>
        {children}
      </ScrollBox>
    );

    const output = lastFrame();
    // ScrollBox with offset beyond children still renders with some whitespace/newlines
    expect(output.trim()).toBe('');
  });

  test('re-renders when offset changes', () => {
    const children = createTestChildren(10);
    const { lastFrame, rerender } = render(
      <ScrollBox offset={0} height={3}>
        {children}
      </ScrollBox>
    );

    // Initial render
    let output = lastFrame();
    expect(output).toContain('Item 0');
    expect(output).not.toContain('Item 5');

    // Re-render with different offset
    rerender(
      <ScrollBox offset={5} height={3}>
        {children}
      </ScrollBox>
    );

    output = lastFrame();
    expect(output).not.toContain('Item 0');
    expect(output).toContain('Item 5');
  });

  test('passes through Box props', () => {
    const children = createTestChildren(3);
    const { lastFrame } = render(
      <ScrollBox offset={0} height={2} borderStyle="single">
        {children}
      </ScrollBox>
    );

    const output = lastFrame();
    // Box with borderStyle should render border characters
    expect(output).toMatch(/[┌┐└┘│─]/);
  });

  test('handles initialHeight prop', () => {
    const children = createTestChildren(10);
    const { lastFrame } = render(
      <ScrollBox offset={0} initialHeight={2}>
        {children}
      </ScrollBox>
    );

    const output = lastFrame();
    expect(output).toContain('Item 0');
    expect(output).toContain('Item 1');
    // Since initialHeight is 2, should only show first 2 items initially
    // Note: This test might need adjustment based on actual behavior
  });
}); 