const port = process.env.PUPPETEER_PORT

describe('page Load', () => {
  beforeAll(async () => {
    await page.goto(`http://127.0.0.1:${port}/example/index.html`)
  })
 
  it('Check dom variables', async () => {

    await page.waitForFunction(() => 'conn' in window);

    expect('time not exceeded').toBe('time not exceeded')
  }, 10000)
})
