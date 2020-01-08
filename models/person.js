const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
    name: { type: String, minLength: 3, required: true },
    number: { type: Number, minLength: 8, required: true, unique: true },
    id: String
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
