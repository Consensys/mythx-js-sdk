import assert from 'assert';
import sinon, { SinonStub } from 'sinon';
import proxyquire from 'proxyquire';
import { start } from 'repl';

/*
describe('trufstuf', function() {
  let trufstuf: any;
  let readdir: Function;

  beforeEach(function () {
    readdir = sinon.stub();
    trufstuf = proxyquire('../../src/analyze/trufstuf', {
      fs: {
        readdir: (directory: string, cb: Function) => cb(undefined, [
          'Contract.json',
          'Migrations.json',
          'OtherContract.json',
        ]),
      },
    });
  });

  it('should return paths of filtered JSON files', async () => {
    const files: string[] = await trufstuf.getJsonFilesToAnalyze('/test/build/contracts');
    assert.deepEqual(files, [
      '/test/build/contracts/Contract.json',
      '/test/build/contracts/OtherContract.json',
    ]);
  });
});
*/

describe('trufstuf', function() {
  let trufstuf: any;
  let readdir: SinonStub;
  let readFile: SinonStub;
  let stat: SinonStub;

  beforeEach(function () {
    readdir = sinon.stub();
    readFile = sinon.stub();
    stat = sinon.stub();
    trufstuf = proxyquire('../../src/analyze/trufstuf', {
      fs: {
        readdir,
        readFile,
        stat,
      },
    });
  });

  afterEach(() => {
    readdir.reset();
    readFile.reset();
    stat.reset();
  });

  describe('getJsonFilesToAnalyze', () => {
    it('should remove Migrations.json ad return full paths', async () => {
      readdir.yields(undefined, [ 'Contract.json', 'Migrations.json', 'OtherContract.json' ]);
      const files: string[] = await trufstuf.getJsonFilesToAnalyze('/test/build/contracts');

      assert.deepEqual(files, [
        '/test/build/contracts/Contract.json',
        '/test/build/contracts/OtherContract.json',
      ]);
    });
  });

  describe('parseBuildJson', () => {
    it('should parse json file to object', async () => {
      readFile.yields(undefined, '{"contractName": "Test", "bytecode": "0x", "deployedBytecode": "0x"}');
      const expected = {
        contractName: 'Test',
        bytecode: '0x',
        deployedBytecode: '0x',
      };

      const result = await trufstuf.parseBuildJson('contract.json');
      assert.deepEqual(result, expected);
    });

    it('should drop __from bytecode and deployedBytecode', async () => {
      readFile.yields(undefined, '{"contractName": "Test", "bytecode": "0x__", "deployedBytecode": "0x__"}');
      const expected = {
        contractName: 'Test',
        bytecode: '0x',
        deployedBytecode: '0x',
      };

      const result = await trufstuf.parseBuildJson('contract.json');
      assert.deepEqual(result, expected);
    });
  });

  describe('isStaleFile', () => {
    let parseBuildJson: SinonStub;

    beforeEach(() => {
      parseBuildJson = sinon.stub(trufstuf, 'parseBuildJson');
    });

    afterEach(() => {
      parseBuildJson.restore();
    });

    it('should identify json as non-stale when mtime of json and source file are the same', async () => {
      stat.yields(undefined, { mtime: 1000000 });
      parseBuildJson.resolves({ sourcePath: 'test/contract.sol' });
      const result = await trufstuf.isStaleFile('test/build/contracts', 'Contract.json');
      assert.deepEqual(result, false);
    });

    it('should identify json as stale when source file does not exist', async () => {
      stat
        .onFirstCall().yields(undefined, { mtime: 1000000 });
      stat
        .onSecondCall().yields('error');
      parseBuildJson.resolves({ sourcePath: 'test/contract.sol' });

      const result = await trufstuf.isStaleFile('test/build/contracts', 'Contract.json');
      assert.ok(result);
    });

    it('should identify json as stale when json file is older than source', async () => {
      stat
        .onFirstCall().yields(undefined, { mtime: 1000000 });
      stat
        .onSecondCall().yields(undefined, { mtime: 1000001 });
      parseBuildJson.resolves({ sourcePath: 'test/contract.sol' });

      const result = await trufstuf.isStaleFile('test/build/contracts', 'Contract.json');
      assert.ok(result);
    });
  });

  describe('filterStaleJsonFiles', () => {
    let isStaleFile: SinonStub;
    beforeEach(() => {
      isStaleFile = sinon.stub(trufstuf, 'isStaleFile');
    });

    afterEach(() => {
      isStaleFile.restore();
    });

    it('should remove old contract from result', async () => {
      const inputFiles = ['OldContract.json', 'NewContract.json'];
      isStaleFile.onFirstCall().resolves(true);

      const result = await trufstuf.filterStaleJsonFiles(inputFiles);
      assert.deepEqual(result, ['NewContract.json']);
    });
  });
});