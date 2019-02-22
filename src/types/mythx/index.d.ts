export declare type AnalysisRequestSourcesField = {
    [contractName: string]: {
        source: string,
        ast: any,
    },
}

export declare type AnalysisRequestData = {
  contractName: string,
  bytecode: string,
  deployedBytecode: string,
  sourceMap: string,
  deployedSourceMap: string,
  sourceList: Array<string>,
  sources: AnalysisRequestSourcesField,
  toolId: string,
  version: string,
}
