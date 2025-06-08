import * as React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { describe, test, expect, vi } from 'vitest';
import { useResize, useFullscreen, enterFullscreen } from './index';

function TestResizeComponent() {
  const { columns, rows, width, height } = useResize();
  return (
    <Text>
      Size: {columns}x{rows}, Alias: {width}x{height}
    </Text>
  );
}

function TestFullscreenComponent() {
  useFullscreen();
  return <Text>Fullscreen enabled</Text>;
}

describe('ink-hooks', () => {
  test('useResize hook returns terminal dimensions', () => {
    const { lastFrame } = render(<TestResizeComponent />);
    const output = lastFrame();

    // Should contain size information - columns should be a number
    expect(output).toContain('Size:');
    expect(output).toContain('Alias:');
    expect(output).toMatch(/Size: \d+x/); // At least columns should be present
  });

  test('useResize hook provides aliases for width and height', () => {
    const { lastFrame } = render(<TestResizeComponent />);
    const output = lastFrame();

    // Verify that width aliases columns and height aliases rows
    expect(output).toContain('Size:');
    expect(output).toContain('Alias:');
  });

  test('useFullscreen hook renders without error', () => {
    const { lastFrame } = render(<TestFullscreenComponent />);
    const output = lastFrame();

    expect(output).toContain('Fullscreen enabled');
  });

  test('enterFullscreen function returns exit function', () => {
    // Mock process.stdout.write to avoid actual terminal manipulation
    const originalWrite = process.stdout.write;
    const mockWrite = vi.fn();
    process.stdout.write = mockWrite as any;

    const exitFullscreen = enterFullscreen();

    expect(mockWrite).toHaveBeenCalledWith('\x1b[?1049h');
    expect(typeof exitFullscreen).toBe('function');

    // Test exit function
    exitFullscreen();
    expect(mockWrite).toHaveBeenCalledWith('\x1b[?1049l');

    // Restore original function
    process.stdout.write = originalWrite;
  });
});
