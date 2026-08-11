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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `

    response.send(info)
})

const generateId = () => {
    let randomId = Math.floor(Math.random() * 10000);
    const same = persons.find(person => person.id === randomId)
    while (same) {
        randomId = Math.floor(Math.random() * 10000);
    }
    return randomId
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    console.log(`Deleted person with id ${id}`)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})