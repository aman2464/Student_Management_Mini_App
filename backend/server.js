const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors()); 

mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true 
  },
  age: { 
    type: Number, 
    required: [true, "Age is required"],
    min: [5, "Age must be at least 5"],
    max: [100, "Age must be realistic"] 
  },
  course: { 
    type: String, 
    required: [true, "Course is required"] 
  }
});
const Student = mongoose.model('Student', studentSchema);


app.get('/students', async (req, res) => {
  const data = await Student.find();
  res.json(data);
});

app.post('/students', async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json(newStudent);
});

app.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student Deleted" });
});


app.put('/students/:id', async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedStudent);
});

app.listen(5000, () => console.log('Server running on port 5000'));