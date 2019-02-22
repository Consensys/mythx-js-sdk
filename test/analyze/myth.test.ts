import assert from 'assert';
import path from 'path';
import { readFile } from 'fs';
import { truffle2MythrilJSON, remapMythXOutput } from '../../src/analyze/myth';
import { Truffle } from '../../src/types/truffle';
import { AnalysisRequestData, AnalysisResponseData } from '../../src/types/mythx';


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

  describe('remapMythXOutput', () => {
    it('groups MythX result by sourceList', () => {
      const analysisResult: AnalysisResponseData = {
        'sourceType': 'solidity-file',
        'sourceFormat': 'text',
        'sourceList': [
          '/tmp/contracts/sol1.sol',
        ],
        'issues': [
          {
            'locations': [ { 'sourceMap': '0:23:0' } ],
            'swcID': 'SWC-103',
            'swcTitle': 'Floating Pragma',
            'description': {
              'head': 'A floating pragma is set.',
              'tail': 'It is recommended to make a conscious choice on what version of Solidity is used for compilation. Currently any version equal or grater than "0.5.0" is allowed.'
            },
            'severity': 'Low',
            'extra': {}
          },
          {
            'locations': [
              { 'sourceMap': '400:19:0' },
            ],
            'swcID': 'SWC-109',
            'swcTitle': 'Uninitialized Storage Pointer',
            'description': {
                'head': 'Dangerous use of uninitialized storage variables.',
                'tail': 'Uninitialized storage variables of user-defined type can point to unexpected storage locations. Initialize variable "upgraded" or set the storage attribute "memory".'
            },
            'severity': 'Low',
            'extra': {}
          }
      ],
        'meta': {
          'selected_compiler': '0.5.0',
          'error': [],
          'warning': []
        },
      };

      const expectedResult: any = [{
        issues: [{
          description: {
            head: 'A floating pragma is set.',
            tail: 'It is recommended to make a conscious choice on what version of Solidity is used for compilation. Currently any version equal or grater than "0.5.0" is allowed.',
          },
          extra: {},
          severity: 'Low',
          sourceMap: '0:23:0',
          swcID: 'SWC-103',
          swcTitle: 'Floating Pragma',
        }, {
          description: {
            head: 'Dangerous use of uninitialized storage variables.',
            tail: 'Uninitialized storage variables of user-defined type can point to unexpected storage locations. Initialize variable "upgraded" or set the storage attribute "memory".',
          },
          extra: {},
          severity: 'Low',
          sourceMap: '400:19:0',
          swcID: 'SWC-109',
          swcTitle: 'Uninitialized Storage Pointer',
        }],
        source: '/tmp/contracts/sol1.sol',
        sourceFormat: 'text',
        sourceType: 'solidity-file',
      }];

      const res = remapMythXOutput(analysisResult);
      assert.deepEqual(res, expectedResult);
    });
  });
});