const lodash = require('lodash');

const names = ['saransh', 'dinkar', 'ankit']
const capitalize = lodash.map(names, lodash.upperCase)
console.log('capitalize', capitalize)