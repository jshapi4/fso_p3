const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    phone: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    phone: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    phone: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    phone: "39-23-6423122",
  },
];

app.use(express.json());

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : "";
});

app.use(
  morgan("tiny", {
    skip: (request, response) => request.method === "POST",
  })
);

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body ",
    {
      skip: (request, response) => request.method !== "POST",
    }
  )
);

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
  const initialLength = persons.length;
  persons = persons.filter((person) => person.id !== id);

  if (persons.length === initialLength) {
    return response.status(404).json({
      error: `No person with ID ${id} was found. No deletions were made.`,
    });
  }
  console.log(persons);

  response.status(200).json({
    message: `Person with ID: ${id} was successfully deleted`,
  });
});

const generateId = () => {
  const randomId = Math.floor(Math.random() * 10000);
  return randomId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const valid = body.name && body.phone;
  console.log(body.name, body.phone);

  if (!valid) {
    return response.status(400).json({
      error: "Must have a name AND number to add to phonebook",
    });
  }

  const duplicate = persons.find((person) => person.name == body.name);

  if (duplicate) {
    return response.status(400).json({
      error: "That name is already in the phone book",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    phone: body.phone,
  };

  persons = persons.concat(person);
  response.status(201).json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
