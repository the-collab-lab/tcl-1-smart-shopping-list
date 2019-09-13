import React, { useState, useEffect } from 'react';
import { withFirestore } from 'react-firestore';
import PropTypes from 'prop-types';
import { ContentWrapper, Footer, Header, PageWrapper } from '../../components';
// import firebase from 'firebase/app';

const AddItem = ({ firestore }) => {
  //load the collection into a variable when the component loads then compare against that
  const checkItems = itemNameToCheck => {
    firestore
      .collection('items')
      .where('name', '==', itemNameToCheck)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          console.log('a match was found: ', doc.data());
          setMatchState(true);
        });
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  };

  const addItem = name => {
    firestore.collection('items').add({
      name: name,
      listToken: token,
    });
  };

  const [matchState, setMatchState] = useState(false);
  const [name, setName] = useState('');
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (name.toLowerCase() !== '') {
      checkItems(name.toLowerCase());
    }
  }, [name.toLowerCase()]);

  console.log('this: ', firestore.collection('items').doc().data);

  // The state every time an event happens
  const handleChange = event => {
    setName(event.target.value);
    setMatchState(false);
  };

  // Handle the click of the Add Item botton on the form
  const handleSubmit = event => {
    event.preventDefault();
    addItem(name.toLowerCase());
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
