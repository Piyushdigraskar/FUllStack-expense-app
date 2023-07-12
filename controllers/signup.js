const Signup = require('../models/signup');
const bcrypt = require('bcrypt')

function isStringInvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

const addUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log('email',email);
      if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)){
        return res.status(400).json({err: "bad parameters something is wrong"})
      }
      const saltrounds = 10;
      bcrypt.hash(password, saltrounds, async(err, hash) =>{
        console.log(err);
        await Signup.create({ name, email, password: hash });
        res.status(201).json({ message: 'Successfully created new user' });
      })
      
    } catch (err) {
      console.log('User already exists', JSON.stringify(err));
      res.status(500).json(err);
    }
  };
  



  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if(isStringInvalid(email) || isStringInvalid(password)){
        return res.status(400).json({message: 'email or password is wrong', success:false})
      }
      console.log(password);
      const user = await Signup.findAll({ where: { email } });
  
      if (user.length > 0) {
        if (user[0].password === password) {
          res.status(200).json({ success: true, message: 'User logged in successfully' });
        } else {
          return res.status(400).json({ success: false, message: 'Password is incorrect' });
        }
      } else {
        return res.status(404).json({ success: false, message: 'User does not exist' });
      }
    } catch (err) {
      res.status(500).json({ message: err, success: false });
    }
  };
  
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
    addUser,
    login
    // getUser
}