const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sequelize = require('./database/db');

// Importing routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoues = require('./routes/purchaseRoues');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const forgetPasswordRoutes = require('./routes/forgetRoutes');
const downloadRoutes = require('./routes/dowanloadRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/purchase', purchaseRoues);
app.use('/premiumFeatures', leaderboardRoutes);
app.use('/password', forgetPasswordRoutes);
app.use('/download', downloadRoutes);

// Define a POST route for /
app.post('/', (req, res) => {
  // Handle POST request to root
  res.status(200).send('Received POST request at root');
});

// Default route for GET request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views', 'login.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send({ message: 'Internal Server Error' });
});

// Define associations if necessary
// ...

// Start server
sequelize.sync()
  .then(() => {
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch((err) => {
    console.error('Error syncing with the database', err);
  });


// const express = require('express');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv').config();
// const path = require('path');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const helmet = require('helmet');
// const morgan = require('morgan');
// // const compression = require('compression');

// // Routes Require
// const sequelize = require('./database/db');

// const userRoutes = require('./routes/userRoutes');
// const expenseRoutes = require('./routes/expenseRoutes');
// const purchaseRoues = require('./routes/purchaseRoues');
// const leaderboardRoutes = require('./routes/leaderboardRoutes');
// const forgetpasswordRoutes = require('./routes/forgetRoutes');
// const downloadRoutes = require('./routes/dowanloadRoutes');

// // DataBase Tables
// const User = require('./util/user');
// const Expense = require('./models/expense');
// const Orders = require('./models/orders');
// const Forgetpassword = require('./models/forget');
// const Downloads = require('./models/download');

// // Using Package to read Request
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json({ extended: true }));
// const axios = require('axios');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use('/user', userRoutes);
// app.use('/expenses', expenseRoutes);
// app.use('/purchase', purchaseRoues);
// app.use('/premiumFeatures', leaderboardRoutes);
// app.use('/password', forgetpasswordRoutes);
// app.use('/download', downloadRoutes);
// app.use(express.static(path.join(__dirname, 'views')));

// app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use(helmet());

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/views', 'login.html'));
// });

// // app.post('/', (req, res) => {
// //   res.send('POST request to root endpoint received');
// // });

// // Error in middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).send({ message: 'Internal Server Error' });
//   next();
// });

// // Associations
// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Orders);
// Orders.belongsTo(User);

// User.hasMany(Forgetpassword);
// Forgetpassword.belongsTo(User);

// User.hasMany(Downloads);
// Downloads.belongsTo(User);

// // Server & Database Start
// sequelize.sync()
//   .then(() => {
//     app.listen(4000, () => {
//       console.log('Server is running on port 4000');
//     });
//   })
//   .catch((err) => {
//     console.error('Error syncing with the database', err);
//   });
