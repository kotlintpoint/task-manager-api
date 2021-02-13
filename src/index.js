const express = require('express')

const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const Task = require('./models/Task')
const User = require('./models/User')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const port=process.env.PORT 

app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})



