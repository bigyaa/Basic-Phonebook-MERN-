const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI;
console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: String
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
