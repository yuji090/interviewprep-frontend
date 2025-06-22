import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ onFilterChange, onAddQuestion }) => {
  const { logout } = useContext(AuthContext);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f0f0f0',
      borderBottom: '1px solid #ccc'
    }}>
      {/* FILTER SECTION */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <select onChange={(e) => onFilterChange('topic', e.target.value)}>
          <option value="">All Topics</option>
          <option value="Arrays">Arrays</option>
          <option value="Linked List">Linked List</option>
          <option value="Binary Search">Binary Search</option>
        </select>

        <select onChange={(e) => onFilterChange('difficulty', e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select onChange={(e) => onFilterChange('solved', e.target.value)}>
          <option value="">All</option>
          <option value="true">Solved</option>
          <option value="false">Unsolved</option>
        </select>
      </div>

      {/* BUTTON SECTION */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={onAddQuestion}>+ Add Question</button>
        <button onClick={logout} style={{ backgroundColor: 'crimson', color: 'white' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
