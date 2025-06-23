import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import Navbar from '../components/Navbar';
import AddQuestionPopup from '../components/AddQuestionPopup'; // this must be created separately
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const [filters, setFilters] = useState({
    topic: '',
    difficulty: '',
    isSolved: '',
  });

  const fetchQuestions = async () => {
    if (!token) return;
    setLoading(true);

    try {
      let url = '/questions/filter';
      const params = new URLSearchParams();

      if (filters.topic) params.append('topic', filters.topic);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.isSolved === 'true' || filters.isSolved === 'false') {
        params.append('solved', filters.isSolved);
      }

      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuestions(response.data);
    } catch (err) {
      console.error('❌ Failed to fetch questions:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters, token]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value || '',
    }));
  };

  const handleClearFilters = () => {
    setFilters({ topic: '', difficulty: '', isSolved: '' });
  };

  const handleAddQuestion = () => {
    setShowAddPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddPopup(false);
    fetchQuestions(); // refresh list after adding
  };

  return (
    <div style={{ paddingTop: '90px', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <Navbar
        onFilterChange={handleFilterChange}
        onAddQuestion={handleAddQuestion}
        onClearFilters={handleClearFilters}
      />

      {showAddPopup && <AddQuestionPopup onClose={handleClosePopup} />}

      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>DSA Questions</h2>

        {loading ? (
          <p style={{ color: '#ccc' }}>Loading questions...</p>
        ) : questions.length === 0 ? (
          <p style={{ color: '#ccc' }}>No questions found.</p>
        ) : (
          questions.map((q) => <QuestionCard key={q.id} question={q} />)
        )}
      </div>
    </div>
  );
};

export default Home;
