const mongoose = require('mongoose');
const dotenv = require('dotenv');

// handle synchronous programming errors: uncaught exeptions
process.on('uncaughtExeption', err => {
  console.log('Uncaught exeption! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// we tell node where's the config file
dotenv.config({ path: './config.env' });
//console.log(process.env);
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    // we have access to connection variable -> con
    //console.log(con.connections);
    console.log('DB connection is successful!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// if an unhandled promise rejection event happens we subscribe to it and handle it
process.on('unhandledRejection', err => {
  console.log('Unhandled rejection! Shutting down...');
  console.log(err.name, err.message);
  // closing the server
  server.close(() => {
    // shutting down the application: 0 stands for success, 1 stands for uncalled exeption
    process.exit(1);
  });
});
