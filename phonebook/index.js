const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('body', (req) => {
    if (req.method === 'POST' && req.body) {
        return JSON.stringify(req.body)
    }

    return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
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

    const sameName = persons.find(person => person.name === body.name)

    if (sameName) {
        return response.status(400).json({
            error: "can't add new number with same name"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    console.log(`Deleted person with id ${id}`)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})