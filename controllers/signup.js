const Signup = require('../models/signup');

const addUser = async(req,res,next)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await Signup.create({name:name, email:email, password:password})
        res.status(201).json({data:data});
    }catch(err){
        console.log('User already exists', JSON.stringify(err));
        res.status(500).json({
            error:err
        })
    }
}

const getUser = async(req,res,next)=>{
    try{
        const users = await Signup.findAll();
        res.status(201).json({allUsers:users});
    }catch(err){
        console.log('get-user is failing', JSON.stringify(err));
        res.status(500).json({
            error:err
        })
    }
}

module.exports ={
    addUser,
    getUser,
}