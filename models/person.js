const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var uniqueValidator = require('mongoose-unique-validator');

const {MONGODB_URL} = require('../utils/config');

console.log('connecting to', MONGODB_URL);

mongoose.connect(MONGODB_URL, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
    name: { type: String, minLength: 3, required: true },
    number: { type: String, minLength: 8, required: true, unique: true },
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
