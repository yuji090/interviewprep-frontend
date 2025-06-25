import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // ✅ Don't forget to import this

const Navbar = ({ onFilterChange, onAddQuestion, onClearFilters }) => {
  const { logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#1f1f1f',
        padding: '1rem 2rem',
        borderBottom: '1px solid #444',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
        <select onChange={(e) => onFilterChange('topic', e.target.value)}>
          <option value="">All Topics</option>
          {[
            "Arrays", "Linked List", "Stacks", "Queues", "Trees", "Graphs", "Heaps",
            "Hashing", "Sliding Window", "Greedy", "Backtracking", "Recursion",
            "Dynamic Programming", "Trie", "Binary Search", "Two Pointers",
            "Bit Manipulation", "Mathematics"
          ].map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>

        <select onChange={(e) => onFilterChange('difficulty', e.target.value)}>
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select onChange={(e) => onFilterChange('isSolved', e.target.value)}>
          <option value="">All</option>
          <option value="true">Solved</option>
          <option value="false">Unsolved</option>
        </select>

        <button onClick={onClearFilters}>Show All</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={onAddQuestion}
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          + Add Question
        </button>

        <Link to="/chat">
          <button
            style={{
              backgroundColor: '#2a9d8f',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            🌐 Global Chat
          </button>
        </Link>

        <button
          onClick={logout}
          style={{
            backgroundColor: 'crimson',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
