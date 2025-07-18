import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddQuestion = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isSolved, setSolved] = useState(false);
  const [description, setDescription] = useState('');

  const topicOptions = [
    "Arrays", "Linked List", "Stacks", "Queues", "Trees", "Graphs",
    "Heaps", "Hashing", "Sliding Window", "Greedy", "Backtracking",
    "Recursion", "Dynamic Programming", "Trie", "Binary Search",
    "Two Pointers", "Bit Manipulation", "Mathematics"
  ];

  const difficultyOptions = ["Easy", "Medium", "Hard"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation to ensure values are from allowed sets
    if (!topicOptions.includes(topic)) {
      alert("❌ Invalid topic. Please choose from the suggestions.");
      return;
    }

    if (!difficultyOptions.includes(difficulty)) {
      alert("❌ Invalid difficulty. Please select from dropdown.");
      return;
    }

    const newQuestion = { title, topic, difficulty, description, isSolved };

    try {
      await api.post('/questions/add', newQuestion, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
            list="topicList"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
          <datalist id="topicList">
            {topicOptions.map((opt, i) => (
              <option key={i} value={opt} />
            ))}
          </datalist>
        </div>

        <div>
          <label>Description:</label><br />
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label>Difficulty:</label><br />
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
            <option value="">Select Difficulty</option>
            {difficultyOptions.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
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
