export const isFatal = (fatal: boolean, severity: number): boolean => fatal || severity === 2;

export const calculateErrors = (messages: any[]): number =>
    messages.reduce((acc,  { fatal, severity }) => isFatal(fatal , severity) ? acc + 1 : acc, 0);

export const calculateWarnings = (messages: any[]): number =>
    messages.reduce((acc,  { fatal, severity }) => !isFatal(fatal , severity) ? acc + 1 : acc, 0);

/**
 * Removes duplicate messages
 * @param {any[]} messages - ESLint report messages
 * @returns {any[]} filtered ESLint messages array
 */
export const getUniqueMessages = (messages: any[]): any[] => {
    const jsonValues = messages.map(m => JSON.stringify(m));
    const uniuqeValues = jsonValues.reduce((accum, curr) => {
        if (accum.indexOf(curr) === -1) {
            accum.push(curr);
        }
        return accum;
    }, []);

    return uniuqeValues.map(v => JSON.parse(v));
};


export const getUniqueIssues = (issues: any[]): any[] => issues.map(({ messages, ...restProps }) => {
    const uniqueMessages = getUniqueMessages(messages);
    const warningCount = calculateWarnings(uniqueMessages);
    const errorCount = calculateErrors(uniqueMessages);

    return {
        ...restProps,
        messages: uniqueMessages,
        errorCount,
        warningCount,
    };
});
