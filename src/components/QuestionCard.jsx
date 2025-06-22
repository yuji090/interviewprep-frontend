import { useState } from 'react';
import api from '../services/api';

const QuestionCard = ({ question }) => {
    const token = localStorage.getItem('token');
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({ ...question });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedQuestion({
      ...editedQuestion,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${question.id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Send token for auth
            },
          });
          
        window.location.reload(); // optional: you can refactor later to avoid reload
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  const handleSave = async () => {
    try {
        await api.put(`/questions/update/${question.id}`, editedQuestion, {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ important
            },
          });
          
      setIsEditing(false);
      window.location.reload(); // or update UI directly
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      {isEditing ? (
        <>
          <input
            name="title"
            value={editedQuestion.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <input
            name="topic"
            value={editedQuestion.topic}
            onChange={handleChange}
            placeholder="Topic"
          />
          <input
            name="difficulty"
            value={editedQuestion.difficulty}
            onChange={handleChange}
            placeholder="Difficulty"
          />
          <textarea
            name="description"
            value={editedQuestion.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <label>
            <input
              type="checkbox"
              name="isSolved"
              checked={editedQuestion.isSolved}
              onChange={handleChange}
            />
            Solved
          </label>
          <br />
          <button onClick={handleSave}>💾 Save</button>
          <button onClick={() => setIsEditing(false)}>❌ Cancel</button>
        </>
      ) : (
        <>
          <h4>{question.title}</h4>
          <p><strong>Topic:</strong> {question.topic}</p>
          <p><strong>Solved:</strong> {question.isSolved ? 'Yes' : 'No'}</p>
          <p><strong>Difficulty:</strong> {question.difficulty}</p>
          <p><strong>Description:</strong> {question.description}</p>
          <p><strong>Created At:</strong> {question.createdAt}</p>
          <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
          <button onClick={handleDelete} style={{ color: 'red' }}>🗑 Delete</button>
        </>
      )}
    </div>
  );
};

export default QuestionCard;
