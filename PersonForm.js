import axios from 'axios';
import phoneService from '../services/information'

const PersonForm = ({newName, newNumber, setNewName, setNewNumber}) => {

  return (
    <div>
      name: <input value={newName} onChange={(e) => setNewName(e.target.value)}/>
      number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)}/>
    </div>
  )
}

export default PersonForm
