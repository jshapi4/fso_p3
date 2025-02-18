require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(
  morgan('tiny', {
    skip: (request) => request.method === 'POST',
  }),
)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body ', {
    skip: (request) => request.method !== 'POST',
  }),
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

const date = new Date()

app.get('/info', (request, response) => {
  Person.find({}).then((people) => {
    response.status(200).send(
      `<p>The phonebook has info for ${people.length} people</p>
      <p>${date}</>
      `,
    )
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id);
  // const initialLength = persons.length;

  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))

  // if (persons.length === initialLength) {
  //   return response.status(404).json({
  //     error: `No person with ID ${id} was found. No deletions were made.`,
  //   });
  // // }
  // console.log(persons);

  // response.status(200).json({
  //   message: `Person with ID: ${id} was successfully deleted`,
  // });
})

// const generateId = () => {
//   const randomId = Math.floor(Math.random() * 10000);
//   return randomId;
// };

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined || body.phone === undefined) {
    return response.status(400).json({
      error: 'name or phone missing',
    })
  }

  const person = new Person({
    name: body.name,
    phone: body.phone,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, phone } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, phone },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
