import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchQuestions = async (appliedFilters = {}) => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      let url = '/questions/user';
      const query = new URLSearchParams();

      if (appliedFilters.topic) query.append('topic', appliedFilters.topic);
      if (appliedFilters.difficulty) query.append('difficulty', appliedFilters.difficulty);
      if (appliedFilters.solved !== undefined) query.append('solved', appliedFilters.solved);

      if ([...query].length > 0) {
        url = `/questions/filter?${query.toString()}`;
      }

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestions(response.data);
    } catch (err) {
      console.error('❌ Failed to fetch questions:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(filters);
  }, [token]);

  const handleFilterChange = (type, value) => {
    const updatedFilters = {
      ...filters,
      [type]: value || undefined,
    };

    if (type === 'solved') {
      if (value === 'true') updatedFilters.solved = true;
      else if (value === 'false') updatedFilters.solved = false;
      else delete updatedFilters.solved;
    }

    setFilters(updatedFilters);
    fetchQuestions(updatedFilters);
  };

  const handleAddQuestion = () => navigate('/add-question');

  if (loading) return <p>Loading questions...</p>;

  return (
    <div>
      <Navbar onFilterChange={handleFilterChange} onAddQuestion={handleAddQuestion} />

      <div style={{ padding: '1rem' }}>
        <h2>All DSA Questions</h2>
        {questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          questions.map((q) => <QuestionCard key={q.id} question={q} />)
        )}
      </div>
    </div>
  );
};

export default Home;
