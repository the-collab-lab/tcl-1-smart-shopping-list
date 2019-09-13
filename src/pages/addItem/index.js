import React, { useState } from 'react';
import { withFirestore } from 'react-firestore';
import PropTypes from 'prop-types';
import { ContentWrapper, Footer, Header, PageWrapper } from '../../components';
import { fb } from '../../lib/firebase';
// import firebase from 'firebase/app';

const AddItem = ({ firestore }) => {
  const checkItems = itemNameToCheck => {
    firestore
      .collection('items')
      .where('name', '==', itemNameToCheck)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log('a match was found: ', doc.id, ' => ', doc.data());
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
    checkItems(name);
  }, [name]);

  console.log(firestore.collection('items').doc().data);

  // async function getMarker() {
  //   const snapshot = await firebase
  //     .firestore()
  //     .collection('items')
  //     .get();
  //   console.log(snapshot.docs.map(doc => doc.data()));
  // }

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
          <p>matchState boolean: {matchState.toString()}</p>
          <p>string checked for match: {name}</p>
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
