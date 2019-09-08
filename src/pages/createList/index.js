import React from 'react';
import { Link } from 'react-router-dom';
import { withFirestore } from 'react-firestore';
import Header from '../../components/header';
import getToken from '../../lib/token';

const CreateList = ({ firestore }) => {
  const storeTokenInFirebase = token => {
    firestore
      .collection('lists')
      .doc(token)
      .set({ date: Date.now() });
  };

  const storeTokenInLocalStorage = token => {
    localStorage.setItem('token', token);
  };

  const handleSubmit = event => {
    const token = getToken();
    storeTokenInFirebase(token);
    storeTokenInLocalStorage(token);
  };

  return (
    <main className="createList">
      <Header />
      <h2 className="welcomeTitle">Welcome to your smart shopping list!</h2>
      <h3 className="tagline">Click 'Create Shopping Lists' to start.</h3>
      <Link to="/" onClick={handleSubmit}>
        <button type="submit">Create Shopping List</button>
      </Link>
    </main>
  );
};

export default withFirestore(CreateList);
