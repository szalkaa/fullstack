import React, { useState, useEffect } from 'react';
import { User, UpdateUserData } from '../types/user';

interface UserTableRowProps {
  user: User;
  isEditing: boolean;
  onEditStart: (user: User) => void;
  onEditCancel: () => void;
  onUpdate: (id: number, updatedData: UpdateUserData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isEditing,
  onEditStart,
  onEditCancel,
  onUpdate,
  onDelete,
}) => {
  const [editedName, setEditedName] = useState<string>(user.name);
  const [editedEmail, setEditedEmail] = useState<string>(user.email);

  useEffect(() => {
    setEditedName(user.name);
    setEditedEmail(user.email);
  }, [user.name, user.email]);

  const handleUpdate = () => {
    if (!editedName || !editedEmail) {
      alert("A név és az email mező kitöltése kötelező!");
      return;
    }
    onUpdate(user.id, { name: editedName, email: editedEmail });
  };

  return (
    <tr>
      <td className="table-cell">{user.id}</td>
      {isEditing ? (
        <>
          <td className="table-cell">
            <input
              type="text"
              value={editedName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value)}
            />
          </td>
          <td className="table-cell">
            <input
              type="email"
              value={editedEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedEmail(e.target.value)}
            />
          </td>
        </>
      ) : (
        <>
          <td className="table-cell">{user.name}</td>
          <td className="table-cell">{user.email}</td>
        </>
      )}
      <td className="table-cell">{new Date(user.created_at).toLocaleDateString()}</td>
      <td className="table-cell">
        {isEditing ? (
          <>
            <button onClick={handleUpdate} className="btn btn-save">Mentés</button>
            <button onClick={onEditCancel} className="btn btn-cancel">Mégse</button>
          </>
        ) : (
          <>
            <button onClick={() => onEditStart(user)} className="btn btn-edit">Szerkesztés</button>
            <button onClick={() => onDelete(user.id)} className="btn btn-delete">Törlés</button>
          </>
        )}
      </td>
    </tr>
  );
};

export default UserTableRow;