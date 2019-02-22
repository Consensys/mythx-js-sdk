import fs from 'fs';
import path from 'path';
import util from 'util';


const readdir: Function = util.promisify(fs.readdir);
const readFile: Function = util.promisify(fs.readFile);
const stat: Function = util.promisify(fs.stat);


/**
 * Scans Truffle smart contracts build directory and returns
 * array of paths to smart contract build JSON files.
 *
 * @param {string} directory - path to truffle smart contracts build directory. {
 * @resolves {Promise<string[]>} - resolves list of JSON files.
 */
export const getJsonFilesToAnalyze = async (directory: string): Promise<string[]> => {
    const files: string[] = await readdir(directory);
    const filteredFiles: string[] = files.filter(f => f !== 'Migrations.json');
    const filePaths: string[] = filteredFiles.map((f: string) => path.join(directory, f));
    return filePaths;
};


export const parseBuildJson = async (file: string): Promise<object> => {
    const buildJson: string = await readFile(file, 'utf8');
    const buildObj: any = JSON.parse(buildJson);

    // Recent versions of truffle seem to add __ to the end of the bytecode
    for (const field of ['bytecode', 'deployedBytecode']) {
        if (buildObj[field]) {
            buildObj[field] = buildObj[field].replace(/_.+$/, '');
        }
    }
    return buildObj;
};

/**
 * Detects whether file is too old and needs to drop out
 * @param {string} filePath - file path
 */
export const isStaleFile = async (filePath: string): Promise<boolean> => {
    const buildObj: any = await parseBuildJson(filePath);
    const fullPathStat = await stat(filePath);
    const buildMtime = fullPathStat.mtime;
    const sourcePath = buildObj.sourcePath;
    let sourcePathStat;

    try {
        sourcePathStat = await stat(sourcePath);
    } catch (err) {
        return true;
    }

    const sourceMtime = sourcePathStat.mtime;
    return sourceMtime > buildMtime;
};

/**
 * Filters old json files from input array
 * @param files - array of json files
 */
export const filterStaleJsonFiles = async (files: string[]): Promise<Array<string>> => {
    const result: Array<string> = [];
    await Promise.all(files.map(async f => {
        const isStale = await isStaleFile(f);
        if (isStale) {
            return ;
        }
        result.push(f);
        return f;
    }));
    return result;
};
