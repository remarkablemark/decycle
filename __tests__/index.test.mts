import { decycle } from '../dist/index.mjs';

describe('index', () => {
  it('exports decycle', () => {
    assert.strictEqual(typeof decycle, 'function');
  });
});
