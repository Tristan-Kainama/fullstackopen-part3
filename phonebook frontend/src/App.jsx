import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons.js'


const Filter = (props) => {
  return (
    <>
      <form>
        <div>
          filter shown with <input value={props.search} onChange={props.handleSearch}/>
        </div>
      </form>
    </>
  )
}

const PersonForm = (props) => {
  return (
    <>
      <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
    </>
  )
} 

const Persons = (props) => {
  return (
    <>
      {props.filteredPersons.map((person) => (
        <div key={person.id}>
          <p>
            {person.name} {person.number}
            <button onClick={() => props.deletePerson(person.id)}>delete</button>
          </p>
        </div>
      ))}
    </>
  )
}

const Notification = ({ message, clearMessage, isError }) => { 
  if (message === null) {
    return null
  }
  
  useEffect(() => {

    const timeoutId = setTimeout(() => {
      clearMessage()
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [message, clearMessage])

  let color = 'green';

  if (isError) {
    color = 'red'
  }


  return (
    <div style={{color: color}} className="message">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFilteredPersons] = useState([]) 

  useEffect(() => {
    personService
    .getAll()
    .then((initialPersons) => {
      setPersons(initialPersons)
      setFilteredPersons(initialPersons)
    })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(true)

  const handleSearch = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
    setFilteredPersons(persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase())))
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          const updatedPersons = persons.filter(person => person.id !== id)
          setPersons(updatedPersons)
          setFilteredPersons(updatedPersons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())))
          setMessage(`Deleted ${personToDelete.name}`)
          setIsError(false)
        })
        .catch(() => {
          const newPersons = persons.filter(person => person.name !== personToDelete.name)

          setPersons(newPersons)
          setFilteredPersons(newPersons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())))
          setMessage(`Information of ${personToDelete.name} has already been removed from the server`)
          setIsError(true)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name.toLowerCase() === personObject.name.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: personObject.number }

        personService
          .change(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            const updatedPersons = persons.map(person => person.id === existingPerson.id ? returnedPerson : person)
            setPersons(updatedPersons)
            setFilteredPersons(updatedPersons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())))
            setNewName('')
            setNewNumber('')
            setMessage(`Changed number of ${personObject.name}`)
            setIsError(false)
          })
          .catch(() => {
            const newPersons = persons.filter(person => person.name !== personObject.name)

            setPersons(newPersons)
            setFilteredPersons(newPersons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())))
            setMessage(`Information of ${personToDelete.name} has already been removed from the server`)
            setIsError(true)
          })
      }
    } else {
      setSearch('')

      personService
        .create(personObject)
        .then(returnedPerson => {
          const updatedPersons = persons.concat(returnedPerson)
          setPersons(updatedPersons)
          setFilteredPersons(updatedPersons)
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${personObject.name}`)
          setIsError(false)
        })
        .catch(() => {
          const newPersons = persons.filter(person => person.name !== personObject.name)

          setPersons(newPersons)
          setFilteredPersons(newPersons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())))
          setMessage(`Information of ${personToDelete.name} has already been removed from the server`)
          setIsError(true)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} clearMessage={() => setMessage(null)} isError={isError} />
      <Filter search={search} handleSearch={handleSearch}/>

      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App