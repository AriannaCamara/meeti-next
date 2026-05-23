import { UAParser } from 'ua-parser-js'

export const formatUserAgent = (userAgent: string) => {
    const parse = new UAParser(userAgent)
    const result = parse.getResult()
    return `${result.browser.name} ${result.browser.version} en ${result.os.name} ${result.os.version}`
}