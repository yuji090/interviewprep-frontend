import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddQuestion = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [isSolved, setSolved] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = { title, topic, difficulty, description, isSolved };

    try {
      await api.post('/questions/add', newQuestion, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirect after success
      navigate('/home');
    } catch (err) {
      console.error('Error adding question:', err);
      alert('Failed to add question');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Add New Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Topic:</label><br />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>

        <div>
            <label>Description:</label><br />
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        <div>
          <label>Difficulty:</label><br />
          <input
            type="text"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isSolved}
              onChange={(e) => setSolved(e.target.checked)}
            />
            Solved?
          </label>
        </div>

        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default AddQuestion;
