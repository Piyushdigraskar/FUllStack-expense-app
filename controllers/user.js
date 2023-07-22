
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Users = require('../models/user');

function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  }
  else {
    return false;
  }
}

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('email', email);
    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ err: "bad parameters something is wrong" })
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      console.log(err);
      await Users.create({ name, email, password: hash });
      res.status(201).json({ message: 'Successfully created new user' });
    })

  } catch (err) {
    console.log('User already exists', JSON.stringify(err));
    res.status(500).json(err);
  }
};


const generateAccessToken = (id,name,ispremiumuser) =>{
  return jwt.sign({userId:id, name:name,ispremiumuser}, 'secretkey');
}

const login = async (req, res) => {
  try {
    const {email, password } = req.body;
    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ message: 'email or password is wrong', success: false })
    }
    console.log(password);

    const user = await Users.findAll({ where: { email } });

    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          throw new Error('Something went wrong')
        }
        if (result === true) {
          return res.status(200).json({ success: true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser) })
        }
        else {
          return res.status(400).json({ success: false, message: 'Password is incorrect' })
        }
      })
    } else {
      return res.status(404).json({ success: false, message: 'User Doesnot exitst' })
    }
  } catch (err) {
    res.status(500).json({ message: err, success: false })
  }
}
//   const login = async (req, res) => {
//     try{
//     const { email, password } = req.body;
//     if(isstringinvalid(email) || isstringinvalid(password)){
//         return res.status(400).json({message: 'EMail idor password is missing ', success: false})
//     }
//     console.log(password);
//     const user  = await User.findAll({ where : { email }})
//         if(user.length > 0){
//            bcrypt.compare(password, user[0].password, (err, result) => {
//            if(err){
//             throw new Error('Something went wrong')
//            }
//             if(result === true){
//                 return res.status(200).json({success: true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser)})
//             }
//             else{
//             return res.status(400).json({success: false, message: 'Password is incorrect'})
//            }
//         })
//         } else {
//             return res.status(404).json({success: false, message: 'User Doesnot exitst'})
//         }
//     }catch(err){
//         res.status(500).json({message: err, success: false})
//     }
// }
// const getUser = async(req,res,next)=>{
//     try{
//         const users = await Signup.findAll();
//         res.status(201).json({allUsers:users});
//     }catch(err){
//         console.log('get-user is failing', JSON.stringify(err));
//         res.status(500).json({
//             error:err
//         })
//     }
// }

module.exports = {
  signUp,
  login,
  generateAccessToken
  // getUser
}