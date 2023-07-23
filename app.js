const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const errorController = require('./controllers/error');

const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./util/database');

var cors = require('cors')
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const app = express();
app.use(cors()); 
app.set('view engine', 'ejs');
app.set('views', 'views');
 
app.use(compression());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase')
const userRoutes = require('./routes/user');
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')

const Users = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/user', userRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)
app.use('/expense', expenseRoutes);

app.use('/password', resetPasswordRoutes);

app.use((req,res)=>{
  res.sendFile(path.join(__dirname, `public/${req.url}`))
})


app.use(errorController.get404);

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

Users.hasMany(Forgotpassword);
Forgotpassword.belongsTo(Users);


sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
  //{force:true}