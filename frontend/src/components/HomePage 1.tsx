import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './UserForm';
import UserTable from './UserTable';
import '../css/UserComponents.css';
import { User, CreateUserData, UpdateUserData } from '../types/user';

const API_URL = 'http://localhost:3001/api/users';

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<User[]>(API_URL);
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Hiba az adatok lekérésekor:", err);
      setError(err.response?.data?.error || "Nem sikerült betölteni az adatokat. Ellenőrizze, hogy a backend szerver fut-e.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async (userData: CreateUserData) => {
    setIsSubmitting(true);
    try {
      await axios.post(API_URL, userData);
      await fetchData();
    } catch (err: any) {
      console.error('Hiba az adatok küldésekor:', err);
      setError(err.response?.data?.error || "Hiba történt a felhasználó hozzáadása közben.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Biztosan törölni szeretnéd a(z) ${id} ID-jú felhasználót?`)) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchData();
    } catch (err: any) {
      console.error("Hiba a törléskor:", err);
      setError(err.response?.data?.error || "Nem sikerült törölni a felhasználót.");
    }
  };

  const handleEditStart = (user: User) => {
    setEditingId(user.id);
  };

  const handleUpdate = async (id: number, updatedData: UpdateUserData) => {
    try {
      await axios.patch(`${API_URL}/${id}`, updatedData);
      setEditingId(null);
      await fetchData();
    } catch (err: any) {
      console.error("Hiba a módosításkor:", err);
      setError(err.response?.data?.error || "Nem sikerült módosítani a felhasználót.");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  if (loading) {
    return <div className="App"><p>Adatok betöltése...</p></div>;
  }

  if (error) {
    return <div className="App"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="App">
      <h1>Felhasználókezelő (Full-Stack CRUD)</h1>
      <UserForm onAddUser={handleAddUser} isSubmitting={isSubmitting} />
      <hr />
      <UserTable
        users={users}
        editingId={editingId}
        onEditStart={handleEditStart}
        onEditCancel={handleEditCancel}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HomePage;