const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

const app = express();
app.use(bodyParser.json());

// All data is stored in Supabase tables

// Home route
app.get('/', (req, res) => {
  res.send('BrightPair API');
});

// Student management
app.post('/students', async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.get('/students', async (req, res) => {
  const { data, error } = await supabase.from('students').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Tutor management
app.post('/tutors', async (req, res) => {
  const { data, error } = await supabase
    .from('tutors')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.get('/tutors', async (req, res) => {
  const { data, error } = await supabase.from('tutors').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Parent management
app.post('/parents', async (req, res) => {
  const { data, error } = await supabase
    .from('parents')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.get('/parents', async (req, res) => {
  const { data, error } = await supabase.from('parents').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// AI tutoring endpoint powered by OpenAI
app.post('/tutor/:studentId/ai', async (req, res) => {
  const { studentId } = req.params;
  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single();
  if (error || !student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const prompt = req.body.prompt || 'Provide a helpful tutoring response';

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are tutoring ${student.name}.` },
        { role: 'user', content: prompt }
      ]
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BrightPair API running on port ${PORT}`);
});
