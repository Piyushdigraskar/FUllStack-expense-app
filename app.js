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

const signupRoutes = require('./routes/signup');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/expense',expenseRoutes);

app.use('/signup', signupRoutes)

app.use(errorController.get404);

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