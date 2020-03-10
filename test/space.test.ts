import {needText} from './helpers'

test('space will add for for numbers between chinese', () => {
  const str = '好的233天天'

  expect(needText(str)).toBe('好的 233 天天')
})

test('space will not add before chinese punctuation', () => {
  const str = '好的233。'

  expect(needText(str)).toBe('好的 233。')
})

test('space will not add between english', () => {
  const str = 'fine233.'

  expect(needText(str)).toBe('fine233.')
})

test('more space test', () => {
  const str = '好的23——切吧22，「23我们77」eng。666'

  expect(needText(str)).toBe('好的 23——切吧 22，「23 我们 77」eng。666')
})