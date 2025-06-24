/* eslint-disable @typescript-eslint/no-explicit-any */

export function convertFromPascalCase<T>(input: any): T {
    if (Array.isArray(input)) {
        return input.map(item => convertFromPascalCase(item)) as any;
    }

    if (input !== null && typeof input === 'object') {
        const result: any = {};
        for (const key in input) {
            if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
            result[camelKey] = convertFromPascalCase(input[key]);
        }
        return result as T;
    }

    return input;
}
export function convertToPascalCase<T = any>(input: any): T {
    if (Array.isArray(input)) {
        return input.map(item => convertToPascalCase(item)) as any;
    }

    if (input !== null && typeof input === 'object') {
        const result: any = {};
        for (const key in input) {
            if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

            const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
            result[pascalKey] = convertToPascalCase(input[key]);
        }
        return result as T;
    }

    return input;
}
