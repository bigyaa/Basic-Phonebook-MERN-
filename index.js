require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const Person = require("./models/person");

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("build"));

let persons = [
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 4
	}
];

app.get("/api/persons", (request, response) => {
	Person.find({}).then(personss => response.json(personss));
});

app.get("/info", (request, response) => {
	const date = new Date();
	const text = `Phonebook has info for ${persons.length} people as of:
  ${date}`;

	response.send(text);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(person => person.id === id);

	person
		? response.json(person)
		: response.status(404).end({ error: "olllll" });
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(person => person.id !== id);

	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const MAX = 99999;

	const newPerson = request.body;
	const dataMissing = !(newPerson.name && newPerson.number);
	const nameExists = persons.find(person => person.name === newPerson.name);

	newPerson.id = Math.floor(Math.random() * MAX);

	dataMissing
		? response.status(404).send({ error: "The name or number is missing" })
		: nameExists
		? response
				.status(404)
				.send({ error: "The name already exists in the phonebook" })
		: response.json(newPerson);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
