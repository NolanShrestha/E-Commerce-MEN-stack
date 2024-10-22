const app = require('./app');
const connectDB = require('./config/database'); 

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to MongoDB:', error);
  });
