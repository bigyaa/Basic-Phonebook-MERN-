const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument", process.argv);
	process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = Number(process.argv[4]);
const newId = Number(Math.floor(Math.random() * 99999));

const url = `mongodb+srv://main:${password}@cluster0-tzkyf.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
	name: String,
	number: Number,
	id: Number
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
	name: newName,
	number: newNumber,
	id: newId
});

process.argv.length === 3
	? Person.find({}).then(persons => {
			persons.map(person => console.log(`${person.name} ${person.number}`));
			mongoose.connection.close();
	  })
	: person
			.save()
			.then(response => {
				console.log(
					`added ${response.name} number ${response.number} to phonebook`
				);
				mongoose.connection.close();
			})
			.catch(error => console.log(error));
