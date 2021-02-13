const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')
const multer=require('multer')
const sharp = require('sharp')
const { sendWelcomeMail, sendCancelationMail } = require('../email/account')

const router= new express.Router()

router.post('/users', async (req, res) => {
    
    const user = new User(req.body)
    //console.log(user)
    //user.generateToken()
    try {
        await user.save()
        //console.log(user)
        const token=await user.generateToken()
        sendWelcomeMail(user.email, user.name)
        res.status(201).send({user, token})
    } catch (e) {
        console.log(e._message)
        res.status(200).send({error : e.message})
    }
})

router.post('/users/login', async (req, res) => {
    
    try {
        console.log(req.body)
        const user = await User.findByCredential(req.body.email, req.body.password)

        const token=await user.generateToken()

        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.get('/users/me', auth, (req, res)=>{
    res.send(req.user)      // implicitly toJson
})

router.get('/users/logout', auth, async (req, res)=>{
    try {
        
        req.user.tokens = req.user.tokens.filter(tempToken => {

                return req.token !== tempToken.token
            })
        //console.log(req.user)
        //console.log(req.token)
        await req.user.save()
        res.send()
    }
    catch (e) {
            res.status(500).send()
        }
    //res.send(req.user)
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
   

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, 
        //     req.body, { new: true, runValidators: true })

        //const user = await User.findById(req.params.id)
        console.log(req.user)
        const updates = Object.keys(req.body)
        updates.forEach(element => {
            req.user[element] = req.body[element]    
        });
        console.log(req.user)
        await req.user.save()

        // if (!req.user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.params.id)

        // if (!user) {
        //     return res.status(404).send()
        // }
        
        await req.user.remove()
        sendCancelationMail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


const upload=multer({
    //dest:'avatar',
    limits:{
        fileSize:1024*1024
    },
    fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatars', auth, upload.single('avatar'), async (req, res)=>{
    
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250})
                            .png()
                            .toBuffer()
    //req.user.avatar=req.file.buffer
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error, req, res, next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatars', auth, async (req, res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})


// serving up files 
router.get('/users/:id/avatars', async (req, res)=>{
    const user = await User.findById({_id : req.params.id})

    if(!user || !user.avatar){
        throw new Error()
    }

    //res.set('Content-Type','image/jpg')
    res.set('Content-Type','image/png')

    res.send(user.avatar)

})

module.exports = router