const mongoose = require('mongoose')
require('dotenv').config()
var ObjectId = mongoose.Types.ObjectId;
mongoose.set('runValidators', true)



const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

const manyValidators = [
    { validator: function(number) {
        const numberLength = number.length
        return ((numberLength >= 9 && number.includes('-') === true) || (numberLength >= 8 && number.includes('-') === false ))
    },
    message: "You must have at least 8 characters if you do not have a hyphen but 9 characters if you do."
    }, 
    { validator: function(number) {
        return (number.indexOf('-') !== -1 && ((number.indexOf('-') === 2 || number.indexOf('-') === 3)))
    },
    message: "There should be at least 2 or 3 characters before the hyphen"
    }
]

const personSchema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        minlength: [3, "Names must be of 3 characters minimum."],
        required: true
    },
    number: {
        type: String,
        validate: manyValidators,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject._id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)
