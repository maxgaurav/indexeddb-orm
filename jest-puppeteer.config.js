// jest-puppeteer.config.js
require('dotenv').config()

const port = process.env.PUPPETEER_PORT
module.exports = {
  server: {
    command: `http-server -a 127.0.0.1 --port ${port} ./`,
    port: port,
    launchTimeout: 5000
  },
  launch: {
    dumpio: true,
    headless: false,
    product: 'chrome',
    args: [`--window-size=1200,1080`],
    defaultViewport: {
      width:1200,
      height:1080
    },
    // executablePath: chromPath
  },
  browserContext: 'default',
  
}