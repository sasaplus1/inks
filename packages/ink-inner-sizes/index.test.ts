import { describe, test, expect } from 'vitest';
import { innerSizes, innerWidth, innerHeight } from './index';

describe('ink-inner-sizes', () => {
  describe('innerSizes', () => {
    test('calculates both inner width and height', () => {
      const sizes = { width: 100, height: 50 };
      const props = { borderStyle: 'single' as const };

      const result = innerSizes(sizes, props);

      expect(result).toEqual({
        innerWidth: 98, // 100 - 2 (left and right borders)
        innerHeight: 48 // 50 - 2 (top and bottom borders)
      });
    });
  });

  describe('innerWidth', () => {
    test('subtracts 2 for borderStyle without specific border props', () => {
      const result = innerWidth(100, { borderStyle: 'single' });
      expect(result).toBe(98);
    });

    test('subtracts only left border when borderLeft is true', () => {
      const result = innerWidth(100, { borderLeft: true });
      expect(result).toBe(99);
    });

    test('subtracts only right border when borderRight is true', () => {
      const result = innerWidth(100, { borderRight: true });
      expect(result).toBe(99);
    });

    test('subtracts both borders when both borderLeft and borderRight are true', () => {
      const result = innerWidth(100, { borderLeft: true, borderRight: true });
      expect(result).toBe(98);
    });

    test('does not subtract when borderStyle is set but specific borders override', () => {
      const result = innerWidth(100, {
        borderStyle: 'single',
        borderLeft: true,
        borderRight: false
      });
      expect(result).toBe(99); // Only left border
    });

    test('returns original width when no borders', () => {
      const result = innerWidth(100, {});
      expect(result).toBe(100);
    });
  });

  describe('innerHeight', () => {
    test('subtracts 2 for borderStyle without specific border props', () => {
      const result = innerHeight(50, { borderStyle: 'single' });
      expect(result).toBe(48);
    });

    test('subtracts only top border when borderTop is true', () => {
      const result = innerHeight(50, { borderTop: true });
      expect(result).toBe(49);
    });

    test('subtracts only bottom border when borderBottom is true', () => {
      const result = innerHeight(50, { borderBottom: true });
      expect(result).toBe(49);
    });

    test('subtracts both borders when both borderTop and borderBottom are true', () => {
      const result = innerHeight(50, { borderTop: true, borderBottom: true });
      expect(result).toBe(48);
    });

    test('does not subtract when borderStyle is set but specific borders override', () => {
      const result = innerHeight(50, {
        borderStyle: 'single',
        borderTop: true,
        borderBottom: false
      });
      expect(result).toBe(49); // Only top border
    });

    test('returns original height when no borders', () => {
      const result = innerHeight(50, {});
      expect(result).toBe(50);
    });
  });

  describe('edge cases', () => {
    test('handles zero dimensions', () => {
      const result = innerSizes(
        { width: 0, height: 0 },
        { borderStyle: 'single' }
      );
      expect(result).toEqual({
        innerWidth: -2,
        innerHeight: -2
      });
    });

    test('handles small dimensions', () => {
      const result = innerSizes(
        { width: 1, height: 1 },
        { borderStyle: 'single' }
      );
      expect(result).toEqual({
        innerWidth: -1,
        innerHeight: -1
      });
    });

    test('handles various border styles', () => {
      const testCases = [
        'single',
        'double',
        'round',
        'bold',
        'singleDouble',
        'doubleSingle',
        'classic'
      ] as const;

      testCases.forEach((borderStyle) => {
        const result = innerSizes({ width: 10, height: 10 }, { borderStyle });
        expect(result).toEqual({
          innerWidth: 8,
          innerHeight: 8
        });
      });
    });
  });
});
