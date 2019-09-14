import React, { useState, useEffect } from 'react';
import { withFirestore } from 'react-firestore';
import PropTypes from 'prop-types';
import { ContentWrapper, Footer, Header, PageWrapper } from '../../components';
// import firebase from 'firebase/app';

const AddItem = ({ firestore }) => {
  const checkForDupes = dbList => {
    return dbList.find(
      item => item.data().name.toLowerCase() === name.toLowerCase()
    );
  };

  const checkItems = () => {
    firestore
      .collection('items')
      .where('listToken', '==', token)
      .get()
      .then(response => {
        const dupeIfFound = checkForDupes(response.docs);
        dupeIfFound
          ? console.log('found a dupe!: ', dupeIfFound)
          : console.log('no dupe found. this is safe to add to the db');
      });
  };

  const addItem = name => {
    firestore.collection('items').add({
      name: name,
      listToken: token,
    });
  };

  const [matchState, setMatchState] = useState(null); // null is neutral "nothing to check state", otherwise pass boolean
  const [name, setName] = useState('');
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    console.log({ name });
  }, [name]);

  // The state every time an event happens
  const handleChange = event => {
    setName(event.target.value);
    setMatchState(null);
  };

  // Handle the click of the Add Item botton on the form
  const handleSubmit = event => {
    event.preventDefault();
    checkItems();
  };

  return (
    <PageWrapper>
      <Header />

      <ContentWrapper>
        <form onSubmit={handleSubmit}>
          <label>
            Add Item:
            <input
              value={name}
              type="text"
              id="name"
              className="name"
              onChange={handleChange}
            />
          </label>
          {matchState ? (
            <p className="errorMessage">Item already exists!</p>
          ) : null}
          <button onClick={handleSubmit}>Add item</button>
        </form>
      </ContentWrapper>

      <Footer />
    </PageWrapper>
  );
};

// Wrap this component in the higher order componenet withFirestore to directly access the database
export default withFirestore(AddItem);

AddItem.propTypes = {
  firestore: PropTypes.any.isRequired,
};
AddItem.defaultProps = {};
