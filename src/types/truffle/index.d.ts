export declare module Truffle {

  export interface Abi {
    constant: boolean;
    inputs: any[];
    name: string;
    outputs: any[];
    payable: boolean;
    stateMutability: string;
    type: string;
  }

  export interface Ast {
      absolutePath: string;
      exportedSymbols: any;
      id: number;
      nodeType: string;
      nodes: any[];
      src: string;
  }

  export interface LegacyAST {
    absolutePath: string;
    exportedSymbols: any;
    id: number;
    nodeType: string;
    nodes: any[];
    src: string;
  }

  export interface Compiler {
    name: string;
    version: string;
  }

  export interface ContractJson {
    contractName: string;
    abi: Abi[];
    bytecode: string;
    deployedBytecode: string;
    sourceMap: string;
    deployedSourceMap: string;
    source: string;
    sourcePath: string;
    ast: Ast;
    legacyAST: LegacyAST;
    compiler: Compiler;
    networks?: any;
    schemaVersion: string;
    updatedAt: Date;
    devdoc?: any;
    userdoc?: any;
  }
}
