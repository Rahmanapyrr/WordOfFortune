const http = require('http')
const { resolve } = require('path')
const puppeteer = require('puppeteer')
const handler = require('serve-handler')

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: resolve(__dirname, '..', '..', '..', 'build')
  });
})

server.listen(3000)