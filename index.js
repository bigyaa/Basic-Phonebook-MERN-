require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const Person = require('./models/person');

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('build'));

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

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else {
        return response.status(404).send({ error: error.message });
    }
};

app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
