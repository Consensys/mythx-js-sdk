import assert from 'assert';
import proxyquire from 'proxyquire';


describe('trufstuf', function() {
  let trufstuf: any;

  beforeEach(function () {
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
