const express = require('express');
const mongoose = require('mongoose');
const customerPath=require('./routes/customers') 
const menuPath=require('./routes/menu') 
const orderPath=require('./routes/orders') 



// Create Express app
const app = express();

app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/culaccinoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



app.use("/api/customer",customerPath)
app.use("/api/menu",menuPath)
app.use("/api/order",orderPath)

// Start the Express server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});