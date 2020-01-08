const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('build'));

const Person = require('../models/person');

let peopleArray = [];

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(people => {
            peopleArray = people;
            return response.json(people.map(person => person.toJSON()));
        })
        .catch(error => next(error));
});

app.get('/info', (request, response) => {
    const date = new Date();
    const text = `Phonebook has info for ${peopleArray.length} people as of:
  ${date}`;

    response.send(text);
});

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findById(id)
        .then(person => response.json(person.toJSON()))
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndRemove(id)
        .then(() => response.status(204).end())
        .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    const updatedPerson = {
        name: request.body.name,
        number: request.body.number
    };

    Person.findByIdAndUpdate(id, updatedPerson, { new: true })
        .then(result => response.json(result.toJSON()))
        .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    const newPerson = new Person({...request.body});

    const dataMissing = !(newPerson.name && newPerson.number);

    dataMissing
        ? response.status(404).send({ error: 'The name or number is missing' })
        : newPerson
            .save()
            .then(savedPerson => response.json(savedPerson.toJSON()))
            .catch(error => next(error));
});

module.exports = app;