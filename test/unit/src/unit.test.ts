import { mergeDeep } from './../../../src/utils'

describe('utils.js', () => {

 
  it('test function mergeDeep', async () => {

    let Person = {
        age: 18
    }

    let Car = {
        Name: 'porsche' 
    }
    
    expect(JSON.stringify(mergeDeep(Person, Car))).toBe(JSON.stringify({age: 18,Name:'porsche'}))
  })
})
