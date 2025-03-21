// Objects -> handle binary data
// file system opertions, cryptography, image processing

const buffOne = Buffer.alloc(10) // allocate a buffer of 10 bytes - initialize all with 0
console.log(buffOne)

const buffFromString =  Buffer.from("Hello");
console.log(buffFromString)

const buffFromArrayOfIntegers = Buffer.from([1,2,3,4,5])
console.log(buffFromArrayOfIntegers)

buffOne.write('Node js');
console.log(buffOne)
console.log('After writting NOde js to buffOne ', buffOne.toString());


