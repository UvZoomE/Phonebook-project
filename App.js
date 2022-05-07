import { useEffect, useState} from 'react'
import PersonForm from './components/PersonForm'
import Display from './components/Display'
import Filter from './components/Filter'
import phoneService from './services/information'

const App = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [persons, setPersons] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filterChecker, setFilterChecker] = useState('')
  
  useEffect(() => {
    phoneService.getAll()
    .then(people => setPersons(people))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const copy = persons
    const foundNameOrNot = persons.some(el => el.name === newName)
    const foundNumberOrNot = persons.some(el => el.number === newNumber)
    const eachPersonsID = persons.map(person => person.id)
    const newObj = {
      name: newName,
      number: newNumber,
      id: Math.max(eachPersonsID) + 1
    }

    if (foundNameOrNot) {
      if(window.confirm(`${newName} is added to phonebook, replace the old number with a new one?`)) {
        const indexFinder = copy.findIndex(person => person.name === newName)
        newObj.id = persons[indexFinder].id
        copy[indexFinder] = newObj
        phoneService.update(persons[indexFinder].id, newObj)
        .then(res => {
          setErrorMessage(`Successfully updated ${newName}s number`)
          setPersons([...persons])})
        .catch(err => {
          console.log(err)
          setErrorMessage(`Information on ${newName} has already been removed`)
          setFilterChecker(filterChecker.filter(filter => filter !== newName))})
      }
    } else if (foundNumberOrNot) {
      alert(`${newNumber} belongs to someone else`)
    } else {
      phoneService.create(newObj).then(res => setPersons([...persons, newObj])).catch(err => {
        console.log(err.response.data)
        setErrorMessage(err.response.data.message)
    })}
  }

  const handleFilter = (e) => {
    setFilter(e.target.value)
    const allNames = persons.map(person => person.name)
    setFilterChecker(allNames.filter(name => name.toLowerCase().indexOf(filter.toLowerCase()) !== -1))
  }

  return (
    <div>
      <h1 className='error'>{errorMessage ? errorMessage : ''}</h1>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilter}/>
      <h2>add a new</h2>
      <form onSubmit={handleSubmit}>
        <PersonForm newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber}/>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Display filterChecker={filterChecker} persons={persons} setPersons={setPersons} setFilterChecker={setFilterChecker} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  )
}

export default App
