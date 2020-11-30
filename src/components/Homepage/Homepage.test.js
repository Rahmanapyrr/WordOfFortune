import http from 'http'
import { resolve } from 'path'
import puppeteer from 'puppeteer'
import handler from 'serve-handler'

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: resolve(__dirname, '..', '..', '..', 'build')
  });
})

server.listen(3000)

describe('Homepage', () => {
  let browser = null
  let page = null

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true
    })
    page = await browser.newPage()
    await page.goto('http://localhost:3000')
  })

  afterAll(() => {
    browser.close()
    server.close()
  })

  test('renders title image', async () => {
    await page.waitForSelector('body')

    const titleImage = await page.$('#title-image')
    // Assert that the DOM object is not null or undefined
    expect(!!titleImage).toBe(true)
  })

  test('renders title text', async () => {
    await page.waitForSelector('body')

    const titleText = await page.$('#title-text')
    // Assert that the DOM object is not null or undefined
    expect(!!titleText).toBe(true)
  })

  test('renders single player button', async () => {
    await page.waitForSelector('body')

    const singlePlayerBtn = await page.$('.singleplayer')
    // Assert that the button is not null or undefined
    expect(!!singlePlayerBtn).toBe(true)
  })

  test('renders multiplayer button', async () => {
    await page.waitForSelector('body')

    const multiPlayerBtn = await page.$('.multiplayer')
    // Assert that the button is not null or undefined
    expect(!!multiPlayerBtn).toBe(true)
  })

  test('renders options button', async () => {
    await page.waitForSelector('body')

    const optionsPlayerBtn = await page.$('.options')
    // Assert that the button is not null or undefined
    expect(!!optionsPlayerBtn).toBe(true)
  })
})