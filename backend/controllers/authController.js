const authController = require('express').Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

authController.post('/register', async(req, res) => {
    try {
        const isExisting = await User.findOne({email: req.body.email})
        if(isExisting){
            throw new Error("This email is already been used.")
        }  

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await User.create({...req.body, password: hashedPassword})

        const {password, ...others} = newUser._doc 
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '5h'})

        return res.status(201).json({others, token})

    } catch (error) {
        return res.status(500).json(error.message)
    }
})

authController.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user){
            throw new Error("Invalid credentials")
        }

     
        const comparePass = await bcrypt.compare(req.body.password, user.password)
        if(!comparePass){
            throw new Error("Invalid credentials")
        }

       
        const {password, ...others} = user._doc
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '5h'})
        
        if (user.email === 'admin@gmail.com' && req.body.password === 'admin') {
            return res.status(200).json({others, token, isAdmin: true})
        }
        return res.status(200).json({others, token})
       
    } catch (error) {
        return res.status(500).json(error.message)
    }
})



module.exports = authController