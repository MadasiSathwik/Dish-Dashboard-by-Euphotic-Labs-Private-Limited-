import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css';

const API_URL = 'http://localhost:5000/api/dishes';
const SOCKET_URL = 'http://localhost:5000';

function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  const fetchDishes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setDishes(response.data?.data || []);
      setError('');
    } catch (err) {
      setError('Unable to fetch dishes right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    }

    const socket = socketRef.current;
    const handleDishUpdated = () => {
      void fetchDishes();
    };

    socket.on('dishUpdated', handleDishUpdated);

    return () => {
      socket.off('dishUpdated', handleDishUpdated);
    };
  }, [fetchDishes]);

  const handleToggle = async (dishId) => {
    try {
      const response = await axios.patch(`${API_URL}/${dishId}`);
      const updatedDish = response.data?.data;

      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
      );
    } catch (err) {
      setError('Unable to update dish status.');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Full Stack Assignment</p>
          <h1>Dish Dashboard</h1>
          <p className="subtitle">Browse dishes and toggle their publishing status.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">Loading dishes...</div>
      ) : (
        <div className="cards-grid">
          {dishes.map((dish) => (
            <article key={dish._id || dish.dishId} className="dish-card">
              <img
                src={dish.imageUrl || 'https://via.placeholder.com/300x180?text=Dish+Image'}
                alt={dish.dishName}
                className="dish-image"
              />

              <div className="dish-content">
                <div className="dish-title-row">
                  <h2>{dish.dishName}</h2>
                  <span className={`status-badge ${dish.isPublished ? 'published' : 'unpublished'}`}>
                    {dish.isPublished ? 'Published' : 'Unpublished'}
                  </span>
                </div>

                <button
                  type="button"
                  className={`toggle-btn ${dish.isPublished ? 'active' : ''}`}
                  onClick={() => handleToggle(dish.dishId)}
                >
                  {dish.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
