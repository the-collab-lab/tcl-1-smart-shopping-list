/* eslint react/prop-types: 0 */

import React, { useState } from 'react';
import { withFirestore } from 'react-firestore';
import Header from '../../components/header';
import Footer from '../../components/footer';

const AddItem = ({ firestore }) => {
  const [name, setName] = useState('');
  // Get the list token from localStorage the first time the component renders to avoid making the call to localStorage every time an item is added
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Send the new item to Firebase
  const addItem = name => {
    firestore.collection('items').add({
      name: name,
      listToken: token,
    });
  };

  // The state every time an event happens
  const handleChange = event => {
    setName(event.target.value);
  };

  // Handle the click of the Add Item botton on the form
  const handleSubmit = event => {
    event.preventDefault();
    addItem(name);
  };

  return (
    <main className="pageTwo">
      <Header />

      <form onSubmit={handleSubmit}>
        <label>
          Add Item:
          <input value={name} type="text" id="name" onChange={handleChange} />
        </label>
        <button onClick={handleSubmit}>Add item</button>
      </form>

      <Footer />
    </main>
  );
};

// Wrap this component in the higher order componenet withFirestore to directly access the database
export default withFirestore(AddItem);
