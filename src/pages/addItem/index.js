import React, { useState, useEffect } from 'react';
import { withFirestore } from 'react-firestore';
import PropTypes from 'prop-types';
import { ContentWrapper, Footer, Header, PageWrapper } from '../../components';

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
        dupeIfFound ? setMatchState(true) : setMatchState(false);
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
    setTimeout(() => {
      addItem(name);
    }, 1000);
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
          {matchState === true ? (
            <p className="itemFeedback">Item already exists!</p>
          ) : matchState === false ? (
            <p className="itemFeedback">Adding item!</p>
          ) : null}
          {/* the null state is for when matchState === null */}
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
