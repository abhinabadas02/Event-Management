
const { default: mongoose } = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: String,
  time: String,
  attendee:String,
  createdBy: mongoose.Schema.Types.ObjectId,
});
const event=mongoose.model("event",EventSchema);
module.exports=event;