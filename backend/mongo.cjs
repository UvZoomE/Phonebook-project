const mongoose = require('mongoose')

const password = process.argv[2]

const url = 
    `mongodb+srv://UvZoomE:${password}@cluster0.iiymy.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length <= 3) {
    Person.find({}).then(result => {
        console.log('phonebook: ')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit(0)
    })
}

if (process.argv.length > 3) {

const person = new Person({
    id: Math.floor(Math.random() * 100 + 1),
    name: process.argv[3],
    number: process.argv[4]
})

person.save().then(res => {
    console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
    process.exit(0)
})

}
