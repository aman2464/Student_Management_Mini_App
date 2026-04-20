const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json()); 
app.use(cors());
const localURI = 'mongodb://127.0.0.1:27017/studentDB';
const atlasURI = "mongodb+srv://exypnose:Mongodb_Aman9625@cluster0.vl2jeju.mongodb.net/?appName=Cluster0";
mongoose.set('strictQuery', true);
mongoose.connect(atlasURI, {
  family: 4 
})
    .then(() => console.log('✅ SUCCESS: Connected to MongoDB Atlas!'))
    .catch(err => {
        console.log('❌ CONNECTION FAILED');
        console.log('Error Name:', err.name);
        console.log('Error Message:', err.message);
        
        if (err.message.includes('Authentication failed')) {
            console.log('👉 FIX: Your password "Mongodb_Aman9625" might be incorrect in Atlas.');
        } else if (err.message.includes('querySrv ETIMEOUT')) {
            console.log('👉 FIX: Your hotspot is still blocking the connection. Try restarting your phone.');
        }
    });
const studentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true 
    },
    age: { 
        type: Number, 
        required: [true, "Age is required"],
        min: [5, "Age must be at least 5"]
    },
    course: { 
        type: String, 
        required: [true, "Course is required"] 
    }
});

const Student = mongoose.model('Student', studentSchema);


app.get('/students', async (req, res) => {
    try {
        const data = await Student.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.delete('/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.put('/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


module.exports = app;
