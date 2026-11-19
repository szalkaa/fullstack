import React, { useState } from 'react';
import { CreateUserData } from '../types/user';

interface UserFormProps {
  onAddUser: (userData: CreateUserData) => Promise<void>;
  isSubmitting: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onAddUser, isSubmitting }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email) {
      alert("A név és az email megadása kötelező!");
      return;
    }
    onAddUser({ name, email });
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>Új felhasználó hozzáadása</h2>
      <input
        type="text"
        placeholder="Név"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        disabled={isSubmitting}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Hozzáadás...' : 'Hozzáadás'}
      </button>
    </form>
  );
};

export default UserForm;