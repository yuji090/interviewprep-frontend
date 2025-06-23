import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import NoteModal from './NoteModal';

const QuestionCard = ({ question }) => {
  const { token } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({ ...question });

  const [noteContent, setNoteContent] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteFetched, setNoteFetched] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedQuestion((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${question.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        window.location.reload();
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/questions/update/${question.id}`, editedQuestion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/question/${question.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.content) {
        setNoteContent(res.data.content);
      } else {
        setNoteContent('');
      }

      setNoteFetched(true);
    } catch (err) {
      console.error('❌ Error fetching note:', err);
    }
  };

  const handleNoteSave = async () => {
    if (!noteContent.trim()) return;

    try {
      const res = await api.post(`/notes/add`, {
        content: noteContent,
        questionId: question.id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNoteContent(res.data.content);
      alert('✅ Note saved!');
      setShowNoteModal(false);
    } catch (err) {
      console.error('❌ Error saving note:', err);
    }
  };

  const handleOpenNoteModal = async () => {
    if (!noteFetched) {
      await fetchNote();
    }
    setShowNoteModal(true);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0', position: 'relative' }}>
      {isEditing ? (
        <>
          <input name="title" value={editedQuestion.title} onChange={handleChange} placeholder="Title" />
          <input name="topic" value={editedQuestion.topic} onChange={handleChange} placeholder="Topic" />
          <input name="difficulty" value={editedQuestion.difficulty} onChange={handleChange} placeholder="Difficulty" />
          <textarea name="description" value={editedQuestion.description} onChange={handleChange} placeholder="Description" />
          <label>
            <input type="checkbox" name="isSolved" checked={editedQuestion.isSolved} onChange={handleChange} />
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
          <button onClick={handleOpenNoteModal}>📝 Add/Edit Note</button>
        </>
      )}

      {showNoteModal && (
        <NoteModal
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          onSave={handleNoteSave}
          onClose={() => setShowNoteModal(false)}
        />
      )}
    </div>
  );
};

export default QuestionCard;
