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

export declare type AnalysisLocation = {
    sourceMap: string, 
}

export declare type AnalysisIssue = {
    swcID: string,
    swcTitle: string,
    description: {
        head: string,
        tail: string,
    },
    severity: string,
    locations: Array<AnalysisLocation>,
    extra?: any, 
}


export declare type AnalysisResponseData = {
    issues: Array<AnalysisIssue>,
    sourceType: string,
    sourceFormat: string,
    sourceList: Array<string>,
    meta?: any,
}
