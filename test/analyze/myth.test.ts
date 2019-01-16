import assert from 'assert';
import path from 'path';
import { readFile } from 'fs';
import { truffle2MythrilJSON } from '../../src/analyze/myth';
import { Truffle } from '../../src/types/truffle';


describe('myth.ts', () => {
  describe('truffle2MythrilJSON', () => {
    let truffleJSON: Truffle.ContractJson;

    beforeEach(done => {
      const jsonFile: string = path.join(__dirname, 'data/build/contracts/SimpleDao.json');
      readFile(jsonFile, 'utf8', (err, data) => {
        if (err) return done(err);
        truffleJSON = JSON.parse(data);
        done();
      });
    });

    it('should create Mythril JSON from truffle JSON file', () => {
      const result = truffle2MythrilJSON(truffleJSON);
      const { sourceList, sources, ast } = result;
      const { contractName, source: truffleSource } = truffleJSON;
      assert.deepEqual(sourceList, [ast.absolutePath]);
      assert.deepEqual(sources, { [contractName]: truffleSource });
    });
  });
});