import { Truffle } from '../types/truffle';


/**
 * Creates MythX compatible object
 *
 * @param truffleJSON {Truffle.ContractJson} - Truffle contract build json file
 * @returns new JSON file compatible with MythX API
 */
export const truffle2MythrilJSON = (truffleJSON: Truffle.ContractJson): any => {

  // Add/remap some fields because the Mythril Platform API doesn't
  // align with truffle's JSON
  const mythrilJSON: any = JSON.parse(JSON.stringify(truffleJSON));

  mythrilJSON.sourceList = [truffleJSON.ast.absolutePath];
  mythrilJSON.sources = {};
  mythrilJSON.sources[truffleJSON.contractName] = truffleJSON.source;

  return mythrilJSON;
};
