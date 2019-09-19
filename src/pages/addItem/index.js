import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withFirestore } from 'react-firestore';
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
    if (name.toLowerCase() !== '') {
      checkItems(name.toLowerCase());
    }
  }, [name.toLowerCase()]);
  // const [matchState, setMatchState] = useState(null); // null is neutral "nothing to check state", otherwise pass boolean
  // const [name, setName] = useState('');
  // const [token] = useState(localStorage.getItem('token'));
  const handleTextChange = event => {
    setName(event.target.value);
    setMatchState(null);
  };

  const handleRadioButtonChange = event => setFrequency(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    sendNewItemToFirebase({ name, frequency, listToken: token });
    addItem(name.toLowerCase());
    checkItems();
    setTimeout(() => {
      addItem(name);
    }, 1000);
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
          {matchState === true ? (
            <p className="errorMessage">Item already exists!</p>
          ) : matchState === false ? (
            <p className="errorMessage">Adding item!</p>
          ) : null}
          <button type="submit" onClick={handleSubmit}>
            Add item
          </button>
          {/* the null state is for when matchState === null */}
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
