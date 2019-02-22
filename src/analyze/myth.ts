import path from 'path';
import { Truffle } from '../types/truffle';
import { AnalysisRequestData, AnalysisResponseData } from '../types/mythx';


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

/**
 * Groups analysis results by sourceList for easier manipulation.
 *
 * @param {AnalysisResponseData} result - Analysis response object
 */
export const remapMythXOutput = (result: AnalysisResponseData): any => {
  const mapped = result.sourceList.map(source => ({
      source,
      sourceType: result.sourceType,
      sourceFormat: result.sourceFormat,
      issues: [],
  }));

  if (result.issues) {
      result.issues.forEach(issue => {
          issue.locations.forEach(({ sourceMap }) => {
              // const sourceListIndex = sourceMap.split(':')[2];
              // FIXME: Only one sourceList is supported. set to 0
              mapped[0].issues.push({
                  swcID: issue.swcID,
                  swcTitle: issue.swcTitle,
                  description: issue.description,
                  extra: issue.extra,
                  severity: issue.severity,
                  sourceMap,
              });
          });
      });
  }

  return mapped;
};
