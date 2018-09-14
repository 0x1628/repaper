import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'
import * as Handlebars from 'handlebars'

const moduleName = require('../package.json').name

const ignoreModules = ['parse']

function setHeader(res: http.ServerResponse, options: any = {}) {
  res.writeHead(200, {
    'content-type': 'text/html',
    ...options.head,
  })
}

function sendStatic(res: http.ServerResponse, fileName: string) {
  fileName = path.resolve(__dirname, '..', fileName)
  try {
    fs.stat(fileName, (err, stats) => {
      if (err) {
        throw err
      }
      if (!stats.isFile()) {
        throw new Error('not found')
      }
      setHeader(res)
      const stream = fs.createReadStream(fileName)
      stream.pipe(res)
    })
  } catch (e) {
    res.writeHead(404)
    res.end()
  }
}

function renderTemplate(tplName: string, data: any): string {
  if (!tplName.endsWith('.hbs')) {
    tplName = `${tplName}.hbs`
  }
  const tpl = fs.readFileSync(path.resolve(__dirname, 'templates', tplName)).toString()
  const body = Handlebars.compile(tpl)(data)
  let templateTplName = null
  tpl.split('\n').some(item => {
    const result = /\{\{\!\< *([\w\W-_]+) *\}\}/.exec(item)
    if (result) {
      templateTplName = result[1]
      return true
    }
    return false
  })
  if (templateTplName) {
    return renderTemplate(templateTplName, {body})
  }
  return body
}

function renderWelcome(): string {
  const {RePaper} = require('../src/index')
  const test = new RePaper('<div>好的哈232哈哈。附近的开始放假的开始</div><div>cccc 😇 hahahaha</div>')
  return renderTemplate('index', {body: test.parse()})
}

function renderExample(target: string): string {
  return renderTemplate('example', {target})
}

const server = http.createServer((req, res) => {
  if (req.url) {
    const target = req.url.slice(1)
    if (!target) {
      setHeader(res)
      res.end(renderWelcome())
    } else if (/\.css$/.test(target)) {
      return sendStatic(res, target)
    }

    res.writeHead(404)
    res.end()
  }
})

const port = process.env.PORT || 7300
server.listen(port)
console.log(`${moduleName} example server listening on ${port}`)