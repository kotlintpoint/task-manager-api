// async keyword makes function to wrap with Promise whatever it returns 
// await we can use inside only async function
// const doWork = async ()=>{
//     //return 'Do Work'
//     return 'data'
// }

// //console.log(doWork())
// doWork().then(result=>{
//     console.log(result)
// }).catch(error=>{
//     console.log('error')
// })

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject('Numbers must be non-negative')
            }
            resolve(a + b)
        }, 2000)
    })
}

// add(100,200).then(result1=>{
//     console.log('Result1 : '+result1)
//     return add(result1, 300)
// }).then(result2=>{
//     console.log('Result2 : '+result2)
//     return add(result2, 400)
// }).then(result3=>{
//     console.log('Result3 : '+result3)
// }).catch(error=>{
//     console.log(error)
// })

const doWork=async ()=>{
    const result1=await add(100,200)
    const result2=await add(result1, -300)
    const result3=await add(result2, 400)
    return {r1 : result1, r2 : result2, r3 : result3}
}

doWork().then(result =>{
    console.log(result)
}).catch(error=>{
    console.log(error)
})