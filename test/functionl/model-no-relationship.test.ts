
import {Model as ModelType} from '../../src/index'
import {Connector as ConnectorType} from '../../src/index'
import {RelationTypes as _RelationTypes} from '../../src/index'
import { ModelKeysInterface } from '../../src/models/model.interface'
const port = process.env.PUPPETEER_PORT


describe('simple model', () => {
    beforeAll(async () => {
      await page.goto(`http://127.0.0.1:${port}/example/index.html`)
    })
   
    it('Create model with one attribute that is unique', async () => {
    
        // wait for variables to be present in the dom
        await page.waitForFunction(() => 'Connector' in window);
        await page.waitForFunction(() => 'Model' in window);
        await page.waitForFunction(() => 'RelationTypes' in window);
            
        await page.evaluate(() => {
            const Connector: typeof ConnectorType = window['Connector']
            const Model: typeof ModelType = window['Model']
            const RelationTypes: typeof _RelationTypes = window['RelationTypes'] 
            
            const a = new Connector({
                tables: [{
                    name: 'admin',
                    columns: [{
                        name: 'email',
                        attributes: {
                            unique: true
                        }
                    }]
                }],
                name: 'sample-test',
                version: 1
              });
            
              a.connect().then(async (models:ModelKeysInterface) => {
                console.log(a, models);

                // list the tables in th page
                document.body.innerHTML = 'tables :'+JSON.stringify(Object.keys(models)) 
              });
    
        })
        
        // await until the page has a visitable text 'admin'
        await page.waitForFunction(() => 'admin');

        expect('time not exceeded').toBe('time not exceeded')
    }, 20000)
})





describe('complex model', () => {
    beforeAll(async () => {
      await page.goto(`http://127.0.0.1:${port}/example/index.html`)
    })
   
    it('Check dom variables', async () => {
  
      await page.waitForFunction(() => 'conn' in window);
  
      expect('time not exceeded').toBe('time not exceeded')
    }, 20000)
})