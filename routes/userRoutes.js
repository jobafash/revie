import express from 'express'
import admin from '../config.js'
import bcrypt from 'bcrypt'

const router = express.Router()

const saltRounds = 10

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/signup', async(req,res) => {
  await bcrypt.hash(req.body.password, saltRounds, (err,hash) => {
  try {
    admin.auth().createUser({
      email: req.body.email,
      emailVerified: false,
      password:hash,
      displayName:req.body.name,
      disabled: false
    })
    res.status(201).json({message:'User created successfully'})
   }
   catch(e){
    console.log(e)
    res.status(400).json({error:'Error creating user'})
   }
  })
  })

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async(req,res) => {
  let email = req.body.email
  const user = await admin.auth().getUserByEmail(email)
  if (!user){
    res.status(404).json({error: 'User not found.'})
  }
  let uid = user.uid
  try {
    const token = await admin.auth().createCustomToken(uid)
    if(token){
      res.status(200).json(token)
    }
    else{
      res.status(400).json({error:'Error generating token. Please try again'})
    }
    } 
  catch(e){
    console.log(e)
    } 
  })

export default router