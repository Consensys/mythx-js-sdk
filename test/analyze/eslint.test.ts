import assert  from 'assert';
import { isFatal, calculateErrors, calculateWarnings } from '../../src/analyze/eslint';

describe('eslint', () => {
  describe('isFatal', () => {
    it('should return true  when severity is 2', () => {
      assert.ok(isFatal(false, 2));
    });

    it('should return true when fatal is true', () => {
      assert.ok(isFatal(true, undefined));
    });

    it('should return false when neither fatal is true nor severity is 2', () => {
      assert.ok(isFatal(true, 1));
    });
  });

  describe('calculate errors and warnings', () => {
    const messages = [
      { fatal: true, severity: 1 },
      { severity: 1 },
      { severity: 2 },
      { severity: 3 },
      { fatal: false },
      { fatal: false, severity: 1 },
    ];

    it('should calculate total number of errors', () => {
      const res = calculateErrors(messages);
      assert.equal(res, 2);
    });

    it('should calculate total number of warnings', () => {
      const res = calculateWarnings(messages);
      assert.equal(res, 4);
    });
  });
});
