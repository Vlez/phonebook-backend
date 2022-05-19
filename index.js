const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 3001;

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :response-time ms - :body", {
    skip: (req, res) => {
      return req.method !== "POST";
    },
  })
);

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

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const count = persons.length;
  const date = new Date();

  res.send(`
  <p>phonebook has info for ${count} people</p>
  <p>${date}</p>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((person) => person.id !== id);

  res.status(204).end;
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const names = persons.map((person) => person.name);

  const newPerson = {
    id: Math.ceil(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  };

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({
      error: "missing data!",
    });
  } else if (names.includes(newPerson.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
