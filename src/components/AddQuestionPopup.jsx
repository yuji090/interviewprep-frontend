import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AddQuestionPopup = ({ onClose, onQuestionAdded }) => {
  const { token } = useContext(AuthContext);

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

      alert('✅ Question added');
      onQuestionAdded?.(); // refresh if callback passed
      onClose();
    } catch (err) {
      console.error('❌ Error adding question:', err.response?.data || err.message);
      alert('Failed to add question');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#1b5992', padding: '2rem', borderRadius: '12px',
        width: '90%', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>➕ Add New Question</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />

          <input
            list="topicList"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <datalist id="topicList">
            {topicOptions.map((opt, i) => <option key={i} value={opt} />)}
          </datalist>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', marginBottom: '1rem' }}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            <option value="">Select Difficulty</option>
            {difficultyOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>

          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={isSolved}
              onChange={(e) => setSolved(e.target.checked)}
            />
            {' '}Solved?
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit">✅ Add</button>
            <button type="button" onClick={onClose} style={{ backgroundColor: 'gray', color: 'white' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionPopup;
