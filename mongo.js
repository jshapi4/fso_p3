const mongoose = require("mongoose");

if (process.argv.length < 3 || process.argv.length === 4) {
  console.log("Invalid args length");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://joelshapirodev:${password}@fso-learning.gjlosjs.mongodb.net/notesApp?retryWrites=true&w=majority&appName=FSO-Learning`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const nameInput = process.argv[3];
  const phoneInput = process.argv[4];

  const person = new Person({
    name: nameInput,
    phone: phoneInput,
  });

  person.save().then((result) => {
    console.log("person saved in phonebook:", result);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.phone);
    });
    mongoose.connection.close();
  });
}
