import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';

const SolvedQuestions = () => {
  const { token } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolved = async () => {
      if (!token) return;

      try {
        const response = await api.get('/questions/filter/solved?solved=false', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(response.data);
      } catch (err) {
        console.error('❌ Error fetching solved questions:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolved();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>✅ Solved DSA Questions</h2>
      {questions.length === 0 ? (
        <p>No solved questions found.</p>
      ) : (
        questions.map((q) => <QuestionCard key={q.id} question={q} />)
      )}
    </div>
  );
};

export default SolvedQuestions;
