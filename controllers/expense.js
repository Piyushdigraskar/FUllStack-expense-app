const Expense = require('../models/expense');
const User = require('../models/user');
const sequalize = require('../util/database');


const addexpense = async (req, res) => {
    let t;
    try {
        t = await sequalize.transaction();
        const { selling, name, Category } = req.body;

        if (selling == undefined || selling.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: 'Parameters missing' });
        }

        const expense = await Expense.create(
            { selling, name, Category, userId: req.user.id },
            { transaction: t }
        );

        const totalExpense = Number(req.user.totalExpenses) + Number(selling);

        await User.update(
            { totalExpenses: totalExpense },
            { where: { id: req.user.id }, transaction: t }
        );

        await t.commit();
        return res.status(200).json({ expense });
    } catch (err) {
        if (t) await t.rollback();
        console.log(err);
        return res.status(501).json({ success: false, error: err });
    }
};






const getexpenses = (req, res) => {

    Expense.findAll({ where: { userId: req.user.id } }).then(expenses => {
        return res.status(200).json({ expenses, success: true })
    })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err, success: false })
        })
}

// const deleteexpense = (req, res) => {
//     const expenseid = req.params.expenseid;
//     const t = await sequalize.transaction();
//     if (expenseid == undefined || expenseid.length === 0) {
//         return res.status(400).json({ success: false, })
//     }
//     Expense.destroy({ where: { id: expenseid, userId: req.user.id }}, {transaction:t} ).then((noofrows) => {
//         if (noofrows === 0) {
//             return res.status(404).json({ success: false, message: 'Expense doenst belong to the user' })
//         }
//         await t.commit();
//         return res.status(200).json({ success: true, message: "Deleted Successfuly" })
//     }).catch(async (err) => {
//         await t.rollback();
//         console.log(err);
//         return res.status(500).json({ success: true, message: "Failed" })
//     })
// }
const deleteexpense = async (req, res) => {
    try {
      const expenseid = req.params.expenseid;
      const t = await sequalize.transaction();
  
      if (expenseid == undefined || expenseid.length === 0) {
        return res.status(400).json({ success: false });
      }
  
      const noofrows = await Expense.destroy(
        { where: { id: expenseid, userId: req.user.id }, transaction: t }
      );
  
      if (noofrows === 0) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, message: 'Expense doesn\'t belong to the user' });
      }
  
      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: 'Deleted Successfully' });
    } catch (err) {
      if (t) await t.rollback();
      console.log(err);
      return res.status(500).json({ success: false, message: 'Failed' });
    }
  };
  

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}