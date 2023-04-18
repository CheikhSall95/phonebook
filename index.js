const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const url =
  `mongodb+srv://pro3000:gorgui12@cluster0.kgqlzfr.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number : String,
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model('Person', personSchema)


let requestBody; // Define requestBody variable


morgan.token('req', function getReq (request) {
requestBody = JSON.stringify(request.body)
  return requestBody
})


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


  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
        
        response.status(204).end()
      } else {
        response.status(404).end()
      }
  })


  
  function generateId() {
    return Math.floor(Math.random() * 10000);
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
      if (!body.name  || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
    
    const names = []
    {persons.map(person => names.push(person.name))}    
    if (names.includes(body.name)){
        return response.status(400).json({ 
        error: 'Name already there' 
          })
    }
    
    const person = {
      "name": body.name,
      "number": body.number,
      "id": generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})