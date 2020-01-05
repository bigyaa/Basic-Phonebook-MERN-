const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const persons = [
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

app.get("/", (request, response) => {
	response.send("works!");
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/info", (request, response) => {
	const date = new Date();
	const text = `Phonebook has info for ${persons.length} people as of:
  ${date}`;

	response.send(text);
});

app.get(`/api/person/:id`, (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(person => person.id === id);

	person ? response.json(person) : response.status(404).end();
});

const PORT = 3002;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
