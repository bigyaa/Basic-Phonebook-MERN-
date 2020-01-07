require("dotenv").config();

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

app.get("/api/persons", (request, response) => {
  Person.find({}).then(people =>
    response.json(people.map(person => person.toJSON()))
  );
});

// app.get("/info", (request, response) => {
//   const date = new Date();
//   let numOfEntries;

//   Person.find({}).then(people => {
//     console.log("iiiiiiiiiiiiiii", people);
//     numOfEntries = people.length;
//   });

//   const text = `Phonebook has info for ${numOfEntries} people as of:
//   ${date}`;

//   response.send(text);
// });

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findById(id).then(person => response.json(person.toJSON()));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(result => response.status(204).end())
    .catch(error => next(error));
});

app.post("/api/persons", (request, response) => {
  const newPerson = new Person(request.body);

  const dataMissing = !(newPerson.name && newPerson.number);

  dataMissing
    ? response.status(404).send({ error: "The name or number is missing" })
    : newPerson.save().then(savedPerson => response.json(savedPerson.toJSON()));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
