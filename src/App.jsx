import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddQuestion from './pages/AddQuestion'; 
import PrivateRoute from './components/PrivateRoute';
import SolvedQuestions from './pages/SolvedQuestions'; 
import GlobalChat from './pages/GlobalChat';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/solved" element={<SolvedQuestions />} />
          <Route path="/chat" element={<GlobalChat />} />


          
          {/* 🔐 Protected Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-question"
            element={
              <PrivateRoute>
                <AddQuestion />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
