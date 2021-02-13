
const Task = require('../models/Task')

Task.findByIdAndUpdate('5fc7360de256b4357c9a0810',{completed:true})
    .then(task => {
        console.log(task)
        return Task.countDocuments({completed:true})
    }).then(count=>{
        console.log('Count : '+count)
    }).catch(error => {
        console.log(error)
    })