import assert from 'assert';
import { test_sum } from '../src/index';


describe('Index.ts', () => {
  it('should return 5 when passed 2 and 3', () => {
    const result: number = test_sum(2, 3);
    assert.equal(result, 5);
  });
});