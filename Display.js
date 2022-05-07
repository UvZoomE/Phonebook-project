import { useEffect, useState } from 'react'
import phoneService from '../services/information'

const handleDelete = (i, persons, setPersons, name2, setFilterChecker, setErrorMessage, setCounter, counter) => {
    if (window.confirm(`delete ${name2} ?`)) {
        const newArrayOfPeople = persons.filter(person => person.number !== persons[i].number)
        const newArrayOfNames = newArrayOfPeople.map(person => person.name)
        setFilterChecker(newArrayOfNames)
        setPersons(newArrayOfPeople)
        console.log(persons[i].id)
        phoneService.remove(persons[i].id)
        setErrorMessage(`You have successfully deleted ${name2} from the list.`)
        setCounter(counter + 1)
    }
}

const Display = ({filterChecker, persons, setPersons, setFilterChecker, setErrorMessage}) => {
    const [counter, setCounter] = useState(0)
    const findNames = []
    const findNumbers = []
    const copy = [...persons]
    let destroyer = ''
    for (let j = 0; j < copy.length; j++) {
        if (copy[j]?.name) {
            findNames.push(copy[j].name)
        }
    }

    for (let i = 0; i < copy.length; i++) {
        if (copy[i].number) {
            findNumbers.push(copy[i].number)
        }
    }

  if (filterChecker) {
    return (
      findNames.map((name, i) => <div id='parentContainer'><nobr key={name}>{name} {findNumbers[i]}</nobr> <button onClick={() => handleDelete(i, persons, setPersons, name, setFilterChecker, setErrorMessage, setCounter, counter)}>delete</button></div>)
      )
  } else {
    return ''
  }

}

export default Display
