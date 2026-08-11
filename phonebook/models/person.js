const mongoose = require('mongoose')

const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connection to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String  
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)