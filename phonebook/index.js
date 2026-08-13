require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())

morgan.token('body', (req) => {
    if (req.method === 'POST' && req.body) {
        return JSON.stringify(req.body)
    }

    return ''
})

const Person = require('./models/person.js')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } 

  next(error)
}


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
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

app.get('/info', (request, response, next) => {
    Person.estimatedDocumentCount()
        .then(count => {
            const info = `
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `

            response.send(info)
        })
        .catch(error => next(error))
})

// const generateId = () => {
//     let randomId = Math.floor(Math.random() * 10000);
//     const same = persons.find(person => person.id === randomId)
//     while (same) {
//         randomId = Math.floor(Math.random() * 10000);
//     }
//     return randomId
// }

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                return Person.findByIdAndUpdate(
                    existingPerson._id,
                    { name: body.name, number: body.number },
                    { new: true, runValidators: true, context: 'query' }
                )
            }

            const person = new Person({
                name: body.name,
                number: body.number
            })

            return person.save()
        })
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
            response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
    
    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
        if (!updatedPerson) {
            return response.status(404).end()
        }
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})