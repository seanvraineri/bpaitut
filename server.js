const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory data stores for prototype purposes
const students = [];
const tutors = [];
const parents = [];

// Home route
app.get('/', (req, res) => {
  res.send('BrightPair API');
});

// Student management
app.post('/students', (req, res) => {
  const student = { id: students.length + 1, ...req.body };
  students.push(student);
  res.status(201).json(student);
});

app.get('/students', (req, res) => {
  res.json(students);
});

// Tutor management
app.post('/tutors', (req, res) => {
  const tutor = { id: tutors.length + 1, ...req.body };
  tutors.push(tutor);
  res.status(201).json(tutor);
});

app.get('/tutors', (req, res) => {
  res.json(tutors);
});

// Parent management
app.post('/parents', (req, res) => {
  const parent = { id: parents.length + 1, ...req.body };
  parents.push(parent);
  res.status(201).json(parent);
});

app.get('/parents', (req, res) => {
  res.json(parents);
});

// Placeholder endpoint for AI tutoring action
app.post('/tutor/:studentId/ai', (req, res) => {
  const { studentId } = req.params;
  const student = students.find(s => s.id === parseInt(studentId));
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  // TODO: integrate personalized AI response logic
  res.json({ message: `AI tutoring session for ${student.name}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BrightPair API running on port ${PORT}`);
});
