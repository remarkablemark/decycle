import { decycle } from '../dist/index.mjs';

describe('index', () => {
  it('exports decycle', () => {
    assert.strictEqual(typeof decycle, 'function');
  });

  it('matches snapshot for circular reference', () => {
    const array: unknown[] = [];
    array[0] = array;
    expect(decycle(array)).toEqual([{ $ref: '$' }]);
  });
});
