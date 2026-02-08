import { decycle } from '../src/decycle';

describe('decycle', () => {
  describe('primitives', () => {
    it('returns undefined', () => {
      expect(decycle(undefined)).toBeUndefined();
    });

    it('returns null', () => {
      expect(decycle(null)).toBeNull();
    });

    it('returns number', () => {
      expect(decycle(42)).toBe(42);
    });

    it('returns string', () => {
      expect(decycle('hello')).toBe('hello');
    });

    it('returns boolean', () => {
      expect(decycle(true)).toBe(true);
    });
  });

  describe('built-in wrappers', () => {
    it('returns Boolean wrapper as-is', () => {
      const value = new Boolean(true);
      expect(decycle(value)).toBe(value);
    });

    it('returns Date as-is', () => {
      const value = new Date();
      expect(decycle(value)).toBe(value);
    });

    it('returns Number wrapper as-is', () => {
      const value = new Number(42);
      expect(decycle(value)).toBe(value);
    });

    it('returns RegExp as-is', () => {
      const value = /test/;
      expect(decycle(value)).toBe(value);
    });

    it('returns String wrapper as-is', () => {
      const value = new String('hello');
      expect(decycle(value)).toBe(value);
    });
  });

  describe('arrays', () => {
    it('copies a simple array', () => {
      const input = [1, 2, 3];
      const result = decycle(input);
      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(input);
    });

    it('copies a nested array', () => {
      const input = [[1], [2, [3]]];
      const result = decycle(input);
      expect(result).toEqual([[1], [2, [3]]]);
    });

    it('replaces circular reference in array', () => {
      const a: unknown[] = [];
      a[0] = a;
      expect(decycle(a)).toEqual([{ $ref: '$' }]);
    });
  });

  describe('objects', () => {
    it('copies a simple object', () => {
      const input = { a: 1, b: 'two' };
      const result = decycle(input);
      expect(result).toEqual({ a: 1, b: 'two' });
      expect(result).not.toBe(input);
    });

    it('copies a nested object', () => {
      const input = { a: { b: { c: 1 } } };
      expect(decycle(input)).toEqual({ a: { b: { c: 1 } } });
    });

    it('replaces circular reference in object', () => {
      const obj: Record<string, unknown> = {};
      obj.self = obj;
      expect(decycle(obj)).toEqual({ self: { $ref: '$' } });
    });

    it('replaces duplicate references with $ref', () => {
      const shared = { x: 1 };
      const input = { a: shared, b: shared };
      expect(decycle(input)).toEqual({
        a: { x: 1 },
        b: { $ref: '$["a"]' },
      });
    });

    it('handles deeply nested circular reference', () => {
      const obj: Record<string, unknown> = { a: { b: {} } };
      (obj.a as Record<string, unknown>).b = obj;
      expect(decycle(obj)).toEqual({
        a: { b: { $ref: '$' } },
      });
    });
  });

  describe('replacer', () => {
    it('applies replacer to each value', () => {
      const input = { a: 1, b: 2 };
      const replacer = (value: unknown) => {
        if (typeof value === 'number') {
          return value * 10;
        }
        return value;
      };
      expect(decycle(input, replacer)).toEqual({ a: 10, b: 20 });
    });

    it('applies replacer to the root value', () => {
      const replacer = (value: unknown) => {
        if (typeof value === 'string') {
          return value.toUpperCase();
        }
        return value;
      };
      expect(decycle('hello', replacer)).toBe('HELLO');
    });

    it('applies replacer that transforms object to primitive', () => {
      const input = { a: new Date('2024-01-01') };
      const replacer = (value: unknown) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      };
      expect(decycle(input, replacer)).toEqual({
        a: '2024-01-01T00:00:00.000Z',
      });
    });
  });
});
