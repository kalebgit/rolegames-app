import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useItems () {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/items');
      setItems(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los objetos');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/api/items/${itemId}`);
      setItems(prev => prev.filter(item => item.itemId !== itemId));
      return true;
    } catch (err) {
      setError('Error al eliminar el objeto');
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    deleteItem,
    setError
  };
};
