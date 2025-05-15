export function isEmpty<T>(arr: T[]): boolean {
    return (!arr || arr.length === 0);
}

export function getKeys(record: Record<any, any>) {
    if(!record) {
        return []
    }
    const keys = Object.keys(record)
    return (keys) ? keys : []
}

export function getValues(record: Record<any, any>) {
    if(!record) {
        return []
    }
    const values = Object.values(record)
    return (values) ? values : []
}