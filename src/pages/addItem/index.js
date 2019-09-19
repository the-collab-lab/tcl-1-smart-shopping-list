import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withFirestore } from 'react-firestore';
import { fb } from '../../lib/firebase';
import {
  ContentWrapper,
  Footer,
  Header,
  Loading,
  PageWrapper,
} from '../../components';
import { TokenContext, ListContext } from '../../contexts';

const AddItem = ({ history, firestore }) => {
  const frequencyOptions = [
    { display: 'Soon', value: 'soon' },
    { display: 'Kind of soon', value: 'kind-of-soon' },
    { display: 'Not Soon', value: 'not-soon' },
  ];

  const { token } = useContext(TokenContext);
  const { list, setListValue } = useContext(ListContext);

  // NOTE: setting this particular component's private loading state
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  // NOTE: the line below is a destructuring declaration, which gives us a more concise way of
  // grabbing the properties off our context providers, the example here has the same result as
  // the destructuring syntax:
  //   const setTokenValue = useContext(TokenContext).setTokenValue;
  // the value is made more obvious when, in order to grab more than one property, you'd stack
  // up declarations, like this:
  //   const token = useContext(TokenContext).token;
  //   const setTokenValue = useContext(TokenContext).setTokenValue;
  //   const confirmToken = useContext(TokenContext).confirmToken;

  // NOTE: local state gives the value a place to live before we officially add them to the
  // app "state" (in the ListContext)
  const [frequency, setFrequency] = useState(frequencyOptions[0].value);

  if (!token) history.push('/create-list');

  const [matchState, setMatchState] = useState(false);

  //load the collection into a variable when the component loads then compare against that
  //make name lowercase when it's added to the database (this is pretty much done)

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

  // NOTE: users won't have a list to view or add items to if they don't have a token, so
  // "push" them to where they can get started

  const sendNewItemToFirebase = item => {
    setLoading(true);

    firestore
      .collection('items')
      .add(item)
      .then(response => {
        const merged = [...list, ...[item]];
        setListValue(merged);
        setName('');
        setFrequency(frequencyOptions[0].value);
      })
      .catch(error => console.error('Error getting documents: ', error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (name.toLowerCase() !== '') checkItems(name.toLowerCase());
  }, [name.toLowerCase()]);

  // The state every time an event happens

  const handleTextChange = event => {
    setName(event.target.value);
    setMatchState(false);
  };

  const handleRadioButtonChange = event => setFrequency(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    sendNewItemToFirebase({ name, frequency, listToken: token });
    addItem(name.toLowerCase());
  };

  return (
    <PageWrapper>
      <Header />

      <ContentWrapper>
        {loading && <Loading />}
        <form className="form-example" onSubmit={handleSubmit}>
          <label>
            Add Item:
            <input
              value={name}
              type="text"
              id="name"
              className="name-text-input"
              onChange={handleTextChange}
            />
          </label>
          {frequencyOptions.map((option, index) => (
            <label key={'option-' + index}>
              <input
                type="radio"
                name="frequency"
                value={option.value}
                className="frequency-radio-button"
                onChange={handleRadioButtonChange}
                checked={frequency === option.value}
              />
              {option.display}
            </label>
          ))}
          <p>matchState boolean: {matchState.toString()}</p>
          <p>string checked for match: {name}</p>
          {matchState ? (
            <p className="errorMessage">Item already exists!</p>
          ) : null}
          <button type="submit" onClick={handleSubmit}>
            Add item
          </button>
        </form>
      </ContentWrapper>

      <Footer />
    </PageWrapper>
  );
};

export default withFirestore(AddItem);

AddItem.propTypes = {
  history: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
};
AddItem.defaultProps = {};
