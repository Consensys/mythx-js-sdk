import assert from 'assert';
import { getClient } from '../../src/analyze';
import { Client } from 'armlet';

describe('index.ts', () => {
  describe('getClient', () => {
    it('should throw error if authentication parameters are missing.', () => {
      assert.throws(
        () => getClient({}, ['test-platform']),
        /^Error: You need to set either apiKey or password to use MythX.$/
      );
    });

    it('should throw error when authenticatiing with password but email and ethAdress are missing.', () => {
      assert.throws(
        () => getClient({ password: 'test' }, ['test-platform']),
        /^Error: You need to set either ethAddress or email to use MythX.$/
      );
    });

    it('should create client instance with api key', () => {
      const client = getClient({ apiKey: 'test' }, ['test-platform']);
      assert(client instanceof Client);
    });

    it('should create client instance with password and email', () => {
      const client = getClient({ password: 'test', email: 'test@test.com' }, ['test-platform']);
      assert(client instanceof Client);
    });

    it('should create client instance with password and ethAddress', () => {
      const client = getClient({ password: 'test', ethAddress: '0x000000000' }, ['test-platform']);
      assert(client instanceof Client);
    });
  });
});