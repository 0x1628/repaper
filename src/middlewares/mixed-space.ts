import {Middleware} from '../../types.d'

const alphaNumberRe = /(^|[\W^.^ ^-])((\w|\.| |-)+)(\s|\S|$)/g
const cjkRe = /[\u4e00-\u9fff]/ // CJK Unified Ideographs

function getBeforeNodeLastWord($: any, node: any) {
  if (!node.parent) return ''
  return $(node.parent.prev).text().slice(-1)
}

function getAfterNodeFirstWord($: any, node: any) {
  if (!node.parent) return ''
  return $(node.parent.next).text().slice(0, 1)
}

const addWhiteSpace: Middleware = (text: string, $: any, node: any) => {
  let result = alphaNumberRe.exec(text)
  const modifier = []

  while (result) {
    let [, begin, target, , end] = result
    const beginIndex = result.index + begin.length
    const endIndex = alphaNumberRe.lastIndex - end.length

    alphaNumberRe.lastIndex -= end.length

    if (!begin) {
      begin = getBeforeNodeLastWord($, node)
    }
    if (!end) {
      end = getAfterNodeFirstWord($, node)
    }

    const spaceStart = cjkRe.test(begin)
    const spaecEnd = cjkRe.test(end)

    if (spaceStart || spaecEnd) {
      modifier.push({target, beginIndex, endIndex, spaceStart, spaecEnd})
    }

    result = alphaNumberRe.exec(text)
  }

  while (modifier.length) {
    const {target, beginIndex, endIndex, spaceStart, spaecEnd} = modifier.pop()!
    text = `${text.slice(0, beginIndex)}${spaceStart ? ' ' : ''}${target}${spaecEnd ? ' ' : ''}${text.slice(endIndex)}`
  }

  return text
}

export default addWhiteSpace