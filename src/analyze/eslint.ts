export const isFatal = (fatal: boolean, severity: number): boolean => fatal || severity === 2;

export const calculateErrors = (messages: any[]): number =>
    messages.reduce((acc,  { fatal, severity }) => isFatal(fatal , severity) ? acc + 1 : acc, 0);

export const calculateWarnings = (messages: any[]): number =>
    messages.reduce((acc,  { fatal, severity }) => !isFatal(fatal , severity) ? acc + 1 : acc, 0);
