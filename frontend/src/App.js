import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', course: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(""); 

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5000/students').then(res => setStudents(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    
    if (form.name.length < 3) return setError("Name must be at least 3 characters");
    if (form.age <= 0) return setError("Please enter a valid age");

    if (editingId) {
      axios.put(`http://localhost:5000/students/${editingId}`, form)
        .then(() => { setEditingId(null); setForm({ name: '', age: '', course: '' }); fetchStudents(); })
        .catch(err => setError("Update failed"));
    } else {
      axios.post('http://localhost:5000/students', form)
        .then(() => { setForm({ name: '', age: '', course: '' }); fetchStudents(); })
        .catch(err => setError("Failed to save student"));
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Student Management System</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-4 shadow-sm mb-5">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <input className="form-control" name="name" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <input className="form-control" type="number" name="age" placeholder="Age" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} required />
          </div>
          <div className="col-md-4">
            <input className="form-control" name="course" placeholder="Course" value={form.course} onChange={(e) => setForm({...form, course: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <button className={`btn w-100 ${editingId ? 'btn-warning' : 'btn-primary'}`} type="submit">
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.course}</td>
              <td>
                <button className="btn btn-sm btn-outline-info me-2" onClick={() => { setEditingId(s._id); setForm(s); }}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => axios.delete(`http://localhost:5000/students/${s._id}`).then(fetchStudents)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;