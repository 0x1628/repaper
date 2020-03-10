import {needNode} from './helpers'

test('emoji character will wrapped with span', () => {
  const str = 'Hello 😂.'

  const html = needNode(str).html()
  expect(html).toMatch(/<span.+?repaper-emoji\".+?1f602/)
})
