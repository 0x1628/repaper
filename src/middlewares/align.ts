import { Middleware } from '../../types'

const simpleChinesePunctuationRe = /(。|，|、|？)|(「|《|（)|(」|》|）)/
const chinesePunctuationRe = new RegExp(`(^|\\s|\\S)(${simpleChinesePunctuationRe.toString().slice(1, -1)})(\\s|\\S|$)`, 'g')

const alignMiddleware: Middleware = function(text: string, $: any, node: any): string {
  let result = chinesePunctuationRe.exec(text)
  const modifier = []

  while (result) {
    const [target, begin, , targetNormal, targetOpen, targetClose, end] = result
    const beginIndex = result.index + begin.length
    const endIndex = chinesePunctuationRe.lastIndex - end.length

    chinesePunctuationRe.lastIndex -= end.length

    const isPuncturationAfter = simpleChinesePunctuationRe.test(end)

    if (isPuncturationAfter && target.length > 2) {
      chinesePunctuationRe.lastIndex -= 1
    }

    modifier.push({
      target: targetNormal || targetOpen || targetClose,
      begin: beginIndex,
      end: endIndex,
      type: (() => {
        if (targetNormal) {
          return 'normal'
        } else if (targetOpen) {
          return 'open'
        } else if (targetClose) {
          return 'close'
        }
      })(),
      isPuncturationBefore: simpleChinesePunctuationRe.test(begin),
      isPuncturationAfter,
    })

    result = chinesePunctuationRe.exec(text)
  }

  while (modifier.length) {
    const {target, begin, end, type, isPuncturationBefore,
      isPuncturationAfter} = modifier.pop()!
    text = `${text.slice(0, begin)}\
<span class="repaper-puncture repaper-puncture-${type}\
${isPuncturationAfter ? ' repaper-puncture-after' : ''}\
${isPuncturationBefore ? ' repaper-puncture-before' : ''}\
"><span>${target}</span></span>${text.slice(end)}`
  }

  return text
}

export default alignMiddleware