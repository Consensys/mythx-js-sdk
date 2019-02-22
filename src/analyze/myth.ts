import path from 'path';
import { Truffle } from '../types/truffle';
import { AnalysisRequestData } from '../types/mythx';


/**
 * Creates MythX compatible object
 *
 * @param {Truffle.ContractJson} truffleJSON - Truffle contract build json file
 * @param {string} toolId - tool name
 * @returns new JSON file compatible with MythX API
 */
export const truffle2MythrilJSON = (truffleJSON: Truffle.ContractJson, toolId: string): AnalysisRequestData => {
  const {
    contractName,
    bytecode,
    deployedBytecode,
    sourceMap,
    deployedSourceMap,
    sourcePath,
    source,
    ast,
    compiler: { version },
} = truffleJSON;

  const sourcesKey: string = path.basename(sourcePath);

  return {
    contractName,
    bytecode,
    deployedBytecode,
    sourceMap,
    deployedSourceMap,
    sourceList: [ sourcePath ],
    sources: {
        [sourcesKey]: {
            source,
            ast,
        },
    },
    toolId,
    version,
  };
};
