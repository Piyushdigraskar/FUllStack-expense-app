
const Expense = require('../models/expense');


const addUser =  async (req,res,next)=>{
    try{
        const name= req.body.name;
        const selling = req.body.selling;
        const Category = req.body.Category;

        const data = await Expense.create({name:name, selling:selling, Category:Category});
        res.status(201).json({data:data});
    }catch(err){
        res.status(500).json({
            error:err
        })
    }

}

const getUser =  async (req,res,next)=>{
    try{
        const users =await Expense.findAll();
        res.status(201).json({allUsers:users});
    }catch(err){
        console.log('get-user is failing', JSON.stringify(err));
        res.status(500).json({
            error:err
        })
    }
    
}

const deleteUser =  async (req,res)=>{
    try{
        if(!req.params.id){
            console.log('Id is missing');
            return res.status(400).json({err: 'Id is misssing'});
        }
        const uid = req.params.id;
        console.log("user id ==",uid);
        await Expense.destroy({where: {id:uid}});
        res.sendStatus(200);
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }  
    
}
module.exports ={
    addUser,
    getUser,
    deleteUser
}
