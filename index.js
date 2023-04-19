require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(cors())
app.use(express.static('build'))
app.use(express.json())



let requestBody // Define requestBody variable


morgan.token('req', function getReq (request) {
requestBody = JSON.stringify(request.body)
  return requestBody
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req'))



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  const info = persons.length
  const date = new Date().toString();
  response.send(
        `<div>
          <p>Phonebook has info for ${info} people</p>
        </div>
        <div>
          <p>${date}</p>
        </div>`
      )
  })


  app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


  
  function generateId() {
    return Math.floor(Math.random() * 10000);
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body

      if (body.name.length === 0 || body.number.length === 0) {
        return response.status(400).json({
          error: 'content missing'
        })
    }


    const person = new Person({
      "name": body.name,
      "number": body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      "name": body.name,
      "number": body.number,
    }
  
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  

  app.use(errorHandler)