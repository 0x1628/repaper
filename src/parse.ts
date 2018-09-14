import selector from './selector'
import {Middleware} from '../types'

export default function(html: string, middlewares: Middleware[]) {
  html = `<div class="repaper">${html}</div>`
  const $ = selector.load(html, {decodeEntities: false})

  function traverse(nodes: any) {
    nodes.each((idx: number, parent: any) => {
      const childNodes = $(parent).contents()
      const tagNodes = childNodes.filter((i: number, node: any) => node.type === 'tag')
      const textNodes = childNodes.filter((i: number, node: any) => node.type === 'text')

      traverse(tagNodes)

      textNodes.each((i: number, node: any) => {
        let text = $(node).text()

        middlewares.forEach((parser: any) => {
          text = parser(text, $, node)
        })
        $(node).replaceWith(text)
      })
    })
  }

  traverse($.root())

  return $('body').html()
}