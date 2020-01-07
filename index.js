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

let peopleArray=[];

app.get("/api/persons", (request, response) => {
  Person.find({}).then(people =>
    {
      peopleArray=people;
      response.json(people.map(person =>    
       person.toJSON()))
       } );
});

app.get("/info", (request, response) => {
  const date = new Date();
con
  const text = `Phonebook has info for ${peopleArray.length} people as of:
  ${date}`;

  response.send(text);
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then(person => response.json(person.toJSON()))
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(result => response.status(204).end())
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const updatedPerson={
    name: request.body.name,
    number: request.body.number
  };

  Person.findByIdAndUpdate(id, updatedPerson, {new:true})
    .then(result => response.json(result.toJSON()))
    .catch(error => next(error));
});

app.post("/api/persons", (request, response) => {
  const newPerson = new Person(request.body);

  const dataMissing = !(newPerson.name && newPerson.number);

  dataMissing
    ? response.status(404).send({ error: "The name or number is missing" })
    : newPerson.save().then(savedPerson => response.json(savedPerson.toJSON()));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else {
    return response.status(404).send({ error: 'id doesnt exist.' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
