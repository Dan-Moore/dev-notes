export function isEmpty<T>(arr: T[]): boolean {
    return (!arr || arr.length == 0);
}

export function recordKeys(record: Record<any, any>) {
    return (record) ? Object.keys(record) : []
}

export function recordValues(record: Record<any, any>) {
    return (record) ? Object.values(record) : []
}