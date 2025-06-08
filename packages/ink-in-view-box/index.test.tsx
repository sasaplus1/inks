import * as React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { describe, test, expect } from 'vitest';
import { InViewBox } from './index';

describe('InViewBox', () => {
  const createTestChildren = (count: number): React.ReactNode[] => {
    return Array.from({ length: count }, (_, i) => (
      <Text key={i}>Item {i}</Text>
    ));
  };

  test('renders children with cursor in view', () => {
    const children = createTestChildren(5);
    const { lastFrame } = render(
      <InViewBox cursor={2} initialHeight={3}>
        {children}
      </InViewBox>
    );

    const output = lastFrame();
    expect(output).toContain('Item 0');
    expect(output).toContain('Item 1');
    expect(output).toContain('Item 2');
  });

  test('scrolls to show cursor when cursor is below view', () => {
    const children = createTestChildren(10);
    const { lastFrame } = render(
      <InViewBox cursor={7} initialHeight={3}>
        {children}
      </InViewBox>
    );

    const output = lastFrame();
    // When cursor is at index 7 with height 3, should show items 5, 6, 7
    expect(output).toContain('Item 5');
    expect(output).toContain('Item 6');
    expect(output).toContain('Item 7');
    expect(output).not.toContain('Item 4');
    expect(output).not.toContain('Item 8');
  });

  test('scrolls to show cursor when cursor is above view', () => {
    const children = createTestChildren(10);
    const { lastFrame } = render(
      <InViewBox cursor={1} initialHeight={3} initialOffset={5}>
        {children}
      </InViewBox>
    );

    const output = lastFrame();
    // When cursor is at index 1, should scroll to show cursor
    expect(output).toContain('Item 1');
    expect(output).toContain('Item 2');
    expect(output).toContain('Item 3');
  });

  test('handles cursor at boundaries', () => {
    const children = createTestChildren(5);
    const { lastFrame } = render(
      <InViewBox cursor={0} initialHeight={3}>
        {children}
      </InViewBox>
    );

    const output = lastFrame();
    expect(output).toContain('Item 0');
    expect(output).toContain('Item 1');
    expect(output).toContain('Item 2');
  });

  test('handles empty children array', () => {
    const { lastFrame } = render(
      <InViewBox cursor={0} initialHeight={3}>
        {[]}
      </InViewBox>
    );

    const output = lastFrame();
    expect(output.trim()).toBe('');
  });

  test('passes through Box props', () => {
    const children = createTestChildren(3);
    const { lastFrame } = render(
      <InViewBox cursor={0} initialHeight={2} borderStyle="single">
        {children}
      </InViewBox>
    );

    const output = lastFrame();
    // Should render with border characters
    expect(output).toMatch(/[┌┐└┘│─]/);
  });

  test('handles cursor out of range gracefully', () => {
    const children = createTestChildren(3);

    // Test with cursor beyond children length - should not crash
    const { lastFrame: lastFrame1 } = render(
      <InViewBox cursor={10} initialHeight={3}>
        {children}
      </InViewBox>
    );
    expect(lastFrame1()).toBeDefined();

    // Test with negative cursor - should not crash
    const { lastFrame: lastFrame2 } = render(
      <InViewBox cursor={-1} initialHeight={3}>
        {children}
      </InViewBox>
    );
    expect(lastFrame2()).toBeDefined();
  });
});
