const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('build'))
const cors = require('cors')
const Person = require('./models/persons.cjs')
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


app.use(cors())

app.use(express.json())

const counter = Person.countDocuments()

morgan.token("code", function getCode(req) {
  return JSON.stringify(req.body);
 });

app.use(morgan(':method :url :status :response-time :code'))

let date = new Date('April 18, 2022 07:06:00');

app.get("/", (req, res) => {
  res.send("Landing page")
})

app.get("/api/numbers", (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.get("/info", async (req, res) => {
  res.status(200).send(`Phonebook has info for ${await counter} people ${date}`)
})

app.get('/api/numbers/:id', async (request, response, next) => {
  Person.findOne({id: request.params.id})
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)})
})

app.put('/api/numbers/:id', async (request, response, next) => {
  const body = request.body
  const user = await Person.findOne({id: request.params.id})

  const person = {
    name: body.name,
    number: body.number
  }

  await Person.updateMany({name: body.name}, person, {runValidators: true})
    .then(updatedPerson => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/numbers/:id', async (request, response, next) => {
  const user = await Person.findOne({id: request.params.id})
  await Person.findOneAndRemove({_id: ObjectId(user._id)})
  .then(res => {
    response.status(204).end()
  })
  .catch(err => {
    next(err)
  })
})

app.post('/api/numbers', async (request, response, next) => {
  const keys = Object.keys(request.body)
  if (!(keys.includes("name"))) return response.status(400).send({error: "A name must be given"})
  const person = new Person({
    id: (new ObjectId()).toString(),
    name: request.body.name,
    number: request.body.number
  })

  person.save({ validateBeforeSave: true })
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(err => next(err))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  const errorMessage = error

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json(errorMessage)
  } else {
    return response.status(400).json(errorMessage)
  }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Listening to port at ${PORT}`)
})
