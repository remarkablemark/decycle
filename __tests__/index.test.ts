import { decycle } from '..';

describe('index', () => {
  it('exports decycle', () => {
    assert.strictEqual(typeof decycle, 'function');
  });

  it('matches snapshot for complex circular structure', () => {
    const obj: Record<string, unknown> = {
      name: 'root',
      children: [{ id: 1 }, { id: 2 }],
    };
    obj.self = obj;
    obj.children = [obj.children, obj.children];
    expect(decycle(obj)).toMatchSnapshot();
  });
});
