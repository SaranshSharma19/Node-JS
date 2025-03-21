function delayFn(time){
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

console.log('Promise Start Now')
delayFn(2000).then(() => {
    console.log('After 2s promise resolved')
})
console.log('end')


function divideFn(num1, num2){
    return new Promise((resolve, reject) => {
        if(num2 === 0){
            reject('Cannot perform division by zero')
        }else{
            resolve(num1/num2)
        }
    })
}

console.log('Promise Start Now')
divideFn(2000, 10).then((result) => {
    console.log('promise resolved', result)
}).catch((err)=>{
    console.log(err)
})
console.log('end')