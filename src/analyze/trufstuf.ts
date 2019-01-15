import fs from 'fs';
import path from 'path';
import util from 'util';


const readdir: Function = util.promisify(fs.readdir);


/**
 * Scans Truffle smart contracts build directory and returns
 * array of paths to smart contract build JSON files.
 *
 * @param {string} directory - path to truffle smart contracts build directory. {
 * @resolves {Promise<string[]>} - resolves list of JSON files.
 */
export const getJsonFilesToAnalyze = async function(directory: string): Promise<string[]> {
    const files: string[] = await readdir(directory);
    const filteredFiles: string[] = files.filter(f => f !== 'Migrations.json');
    const filePaths: string[] = filteredFiles.map((f: string) => path.join(directory, f));
    return filePaths;
};
