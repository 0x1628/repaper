import parse from './parse'
import mixedSpaceMiddleware from './middlewares/mixed-space'
import alignMiddleware from './middlewares/align'
import emojiMiddleware from './middlewares/emoji'
import {Middleware} from '../types'

class RePaper {
  middlewares: Middleware[] = [mixedSpaceMiddleware, alignMiddleware,
    emojiMiddleware]

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