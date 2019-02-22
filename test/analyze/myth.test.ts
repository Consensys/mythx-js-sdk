import assert from 'assert';
import path from 'path';
import { readFile } from 'fs';
import { truffle2MythrilJSON } from '../../src/analyze/myth';
import { Truffle } from '../../src/types/truffle';
import { AnalysisRequestData } from '../../src/types/mythx';


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
      const result: AnalysisRequestData = truffle2MythrilJSON(truffleJSON, 'test-client');

      assert.deepEqual(Object.keys(result).sort(), [
        'bytecode',
        'contractName',
        'deployedBytecode',
        'deployedSourceMap',
        'sourceList',
        'sourceMap',
        'sources',
        'toolId',
        'version',
      ]);

      assert.equal(result.toolId, 'test-client');
    });
  });
});