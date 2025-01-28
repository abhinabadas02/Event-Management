
const mongoose = require("mongoose");
// const Mongo_URI="mongodb://127.0.0.1:27017/event"
// const Mongo_URI="mongodb+srv://abhinabadas02:iam@f00L@one.dxq5y.mongodb.net/"
  mongoose.connect("mongodb+srv://abhinabadas02:iamf00L@one.dxq5y.mongodb.net/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
 
const db=mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));
module.exports=db