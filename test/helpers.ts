import {RePaper} from '../src/index'
import * as cheerio from 'cheerio'

export const needNode = (str: string) => {
  const parsedStr = new RePaper(str).parse()
  const $ = cheerio.load(parsedStr, {decodeEntities: false})
  return $('.repaper')
}

export const needText = (str: string) => {
  return needNode(str).text()
}
