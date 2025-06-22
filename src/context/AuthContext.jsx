import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');

    if (userEmail) localStorage.setItem('userEmail', userEmail);
    else localStorage.removeItem('userEmail');
  }, [token, userEmail]);

  const login = (newToken, email) => {
    setToken(newToken);
    setUserEmail(email);
    navigate('/home');
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Optional helper hook (if you want)
export const useAuth = () => useContext(AuthContext);
