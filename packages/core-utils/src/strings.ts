/** Fetches characters whin the given input string.
 * @example
 * ```tsx
 * ['H','o'] = peek('Hello', 0, 4)
 * ```
 * @remarks
 * if input string is undefined or empty, function will return [] 
 * @param str: input string
 * @param pos: array of index positions 
 */
export function peek(str: string, ...pos: number[]):string[] {
    if(!str || str.length == 0) {
        return [];
    }
    return pos.map(x => {
        if(x >= 0 && x < str.length) {
            return str.charAt(x);
        }
    })
}