export type MuteTypes = 'mute' | 'tempmute'

export const ERROR_MESSAGES = {
    INVALID_TYPE: (expected: string | string[], got: any, name?: string) =>
        `Expected ${
            Array.isArray(expected)
                ? expected
                      .map((e) => (typeof e === 'number' ? e : `'${e}'`))
                      .join(' or ')
                : `'${expected}'`
        }${name ? ` for ${name}` : ''}, but got ${
            typeof got === 'string'
                ? `'${got}'`
                : typeof got === 'number'
                ? got
                : Array.isArray(got)
                ? `Array<${got.length}>`
                : got?.constructor?.name || typeof got
        }`,
    UNDEFINED_VALUE: (expected: string, got: any, name: string) =>
        `Expected '${expected}' for '${name}', but got '${got}'`,
}
