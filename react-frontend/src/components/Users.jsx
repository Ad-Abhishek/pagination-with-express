import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(3);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = async (page) => {
      setLoading(true);
      setErrors('');
      try {
        const response = await axios.get(
          `http://localhost:3000/users?page=${page}&limit=${limit}`
        );
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setErrors(error.message);
      } finally {
        setLoading(false);
      }
    };
    userData(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <h1>User List</h1>
      {loading && <p>Loading...</p>}
      {errors && <p style={{ color: 'red' }}>{errors}</p>}
      <div className="users-container">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <div className="user-card-header">
              <h2>{user.name}</h2>
            </div>
            <div className="user-card-body">
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Website:</strong> {user.website}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          {' '}
          Page {page} of {totalPages}{' '}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
