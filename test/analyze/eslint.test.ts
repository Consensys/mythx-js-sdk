import assert  from 'assert';
import { isFatal, calculateErrors, calculateWarnings, getUniqueMessages, getUniqueIssues } from '../../src/analyze/eslint';

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

  describe('getUniqueMessages', () => {
    it('should filter out duplicate messages', () => {
      const inputMessages = [
        { id: 1, title: 'test', severity: 2 },
        { id: 2, title: 'test', severity: 2 },
        { id: 1, title: 'test1', severity: 2 },
        { id: 1, title: 'test', severity: 3 },
        { id: 1, title: 'test', severity: 3 },
        { id: 2, title: 'test', severity: 2 },
        { id: 3, title: 'test', severity: 2 },
      ];

      const uniqueMessages = getUniqueMessages(inputMessages);
      const resultMessages: any[] = [
        { id: 1, title: 'test', severity: 2 },
        { id: 2, title: 'test', severity: 2 },
        { id: 1, title: 'test1', severity: 2 },
        { id: 1, title: 'test', severity: 3 },
        { id: 3, title: 'test', severity: 2 },
      ];
      assert.deepEqual(uniqueMessages, resultMessages);
    });
  });

  describe('getUniqueIssues', () => {
    it('should filter out duplicate issues and recalculate errors and warnings', () => {
      const inputs = [{
        errorCount: 5,
        warningCount: 5,
        messages: [
          { id: 1, title: 'test', severity: 2 },
          { id: 2, title: 'test', severity: 2 },
          { id: 1, title: 'test1', severity: 2 },
          { id: 1, title: 'test', severity: 3 },
          { id: 1, title: 'test', severity: 3 },
          { id: 2, title: 'test', severity: 2 },
          { id: 3, title: 'test', severity: 2 },
        ],
      }];

      const uniqueIssues = getUniqueIssues(inputs);
      const expectedRsults = [{
        errorCount: 4,
        warningCount: 1,
        messages: [
          { id: 1, title: 'test', severity: 2 },
          { id: 2, title: 'test', severity: 2 },
          { id: 1, title: 'test1', severity: 2 },
          { id: 1, title: 'test', severity: 3 },
          { id: 3, title: 'test', severity: 2 },
        ],
      }];
      assert.deepEqual(uniqueIssues, expectedRsults);
    });
  });
});
