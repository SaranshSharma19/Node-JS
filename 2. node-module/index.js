// module.exports -> export - it is required to export functionality
// require -> import -  it is required to import functionality from another module

const firstModule = require('./first-module.js');

console.log(firstModule.add(10,20))
console.log(firstModule.sub(10,20))
console.log(firstModule.divide(10,20))

try{
    console.log('Trying to divide by zero');
    let result = firstModule.divide(10,0)
    console.log(result) 

}catch(error){
    console.log('Caught an eror', error.message)
}
