import parse from './parse'
import MixedSpaceMiddleware from './middlewares/mixed-space'
import AlignMiddleware from './middlewares/align'
import EmojiMiddleware from './middlewares/emoji'
import {Middleware} from '../types'

class RePaper {
  middlewares: Middleware[] = [MixedSpaceMiddleware, AlignMiddleware,
    EmojiMiddleware]

  constructor(protected html: string) {
  }

  use(middlwares: Middleware | Middleware[]) {
    if (!Array.isArray(middlwares)) {
      middlwares = [middlwares]
    }
    this.middlewares = this.middlewares
  }

  parse() {
    return parse(this.html, this.middlewares)
  }
}

export {RePaper}