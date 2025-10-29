import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

type Props = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/metrics/');
        if (res.status === 401) {
          navigate('/');
        } else {
          setAuthChecked(true);
        }
      } catch (err) {
        console.error('Auth check failed', err);
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  if (!authChecked) return <div>Loading...</div>; // optional spinner

  return <>{children}</>;
}