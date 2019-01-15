// Type definitions for armlet 0.3
// Project: https://github.com/consensys/armlet#readme
// Definitions by: My Self <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export declare type ArmletAuthParams = {
    apiKey?: string;
    password?: string;
    ethAddress?: string;
    email?: string;
}

export declare type ArmletData = {
    apiKey?: string;
    password?: string;
    ethAddress?: string;
    email?: string;
    platforms: Array<string>;
}

export declare class Client {
    constructor(auth: ArmletData, apiUrl?: string);

    analyses(...args: any[]): void;

    analyze(...args: any[]): void;
}