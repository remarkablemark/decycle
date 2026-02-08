import { decycle } from '..';

describe('index', () => {
  it('exports decycle', () => {
    assert.strictEqual(typeof decycle, 'function');
  });
});
