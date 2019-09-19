import React, { useContext, useState } from 'react';
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
  const { token } = useContext(TokenContext);
  const { list, setListValue } = useContext(ListContext);

  // NOTE: setting this particular component's private loading state
  const [loading, setLoading] = useState(false);

  // NOTE: local state gives the value a place to live before we officially add them to the
  // app "state" (in the ListContext)
  const [frequency, setFrequency] = useState(frequencyOptions[0].value);

  //  TODO not sure about this token?
  const [token] = useState(localStorage.getItem('token'));

  const addItem = name => {
    firestore.collection('items').add({
      name: name,
      listToken: token,
    });
  };

  const handleChange = event => {
    setName(event.target.value);
  };

  // NOTE: users won't have a list to view or add items to if they don't have a token, so
  // "push" them to where they can get started
  if (!token) history.push('/create-list');

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
=======
// import firebase from 'firebase/app';

  // Get the list token from localStorage the first time the component renders to avoid making the call to localStorage every time an item is added

  // var ref = fb.database().ref('items');\
  // Send the new item to Firebase


  // async function getMarker() {
  //   const snapshot = await firebase
  //     .firestore()
  //     .collection('items')
  //     .get();
  //   console.log(snapshot.docs.map(doc => doc.data()));
  // }

  // The state every time an event happens


  const handleTextChange = event => setName(event.target.value);

  const handleRadioButtonChange = event => setFrequency(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    sendNewItemToFirebase({ name, frequency, listToken: token });
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
<<<<<<< HEAD
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
          <button type="submit">Add item</button>
=======
              className="name"
              onChange={handleChange}
            />
          </label>
          {name === 'apple' ? (
            <p className="errorMessage">Item already exists!</p>
          ) : null}
          <button onClick={handleSubmit}>Add item</button>
>>>>>>> 54b7d95... compare item entered to firebase store and notify of duplicates
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
