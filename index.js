const express = require("express");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).send("<h1>Hello world from Part 3, with Phonebook!<h1>");
});

app.get("/api/persons", (request, response) => {
  response.status(200).send(persons);
});

const date = new Date();

app.get("/info", (request, response) => {
  response.status(200).send(
    `<p>The phonebook has info for ${persons.length} people</p>
    <p>${date}</>
    `
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);
  response.status(204).end();
});

const generateId = () => {
  const randomId = Math.floor(Math.random() * 10000);
  return randomId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const valid = body.name && body.number;

  if (!valid) {
    return response.status(400).json({
      error: "Must have a name AND number to add to phonebook",
    });
  }

  const person = {
    number: body.number,
    name: body.name,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
