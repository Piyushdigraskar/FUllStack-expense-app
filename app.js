const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

var cors = require('cors')

const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', 'views');

const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase')
const userRoutes = require('./routes/user');
const premiumFeatureRoutes = require('./routes/premiumFeature')

const Users = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/expense',expenseRoutes);
const dotenv = require('dotenv');

dotenv.config();

app.use('/user', userRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)


app.use(errorController.get404);

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

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