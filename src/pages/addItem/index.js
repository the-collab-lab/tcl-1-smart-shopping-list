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
    {
      display: 'Soon',
      value: 'soon',
    },
    {
      display: 'Kind of soon',
      value: 'kind-of-soon',
    },
    {
      display: 'Not Soon',
      value: 'not-soon',
    },
  ];

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
  const [name, setName] = useState('');

  // NOTE: local state gives the value a place to live before we officially add them to the
  // app "state" (in the ListContext)
  const [frequency, setFrequency] = useState(frequencyOptions[0].value);
  const [matchState, setMatchState] = useState(null);

  // SEVEN: no matter if a match is found in ListContext or in the db, we handle it the same...
  useEffect(() => {
    if (matchState === false) {
      // EIGHT: if no match found and not a "null" matchState (aka not ready to be compared because
      // we're still typing),
      // NINE: let's build the correct format to send this item to the db!

      const newItem = {
        name,
        frequency,
        listToken: token,
      };
      // TEN: once we have the nicely formatted objet, SEND ALL THE THINGS TO FIREBASE! :allthethings:
      sendNewItemToFirebase(newItem);
    }
  }, [matchState]);

  // NOTE: users won't have a list to view or add items to if they don't have a token, so
  // "push" them to where they can get started
  if (!token) history.push('/create-list');

  const checkForDupes = dbList => {
    return dbList.find(item => item.name.toLowerCase() === name.toLowerCase());
  };

  const checkItems = () => {
    if (Array.isArray(list) && list.length > 0) {
      // ONE A: check list context for an array of items
      console.log('in the if ', list);
      const dupeIfFound = checkForDupes(list);
      dupeIfFound ? setMatchState(true) : setMatchState(false);
    } else {
      // ONE B: if no list context stored, check the db
      console.log('in the else');
      firestore
        .collection('items')
        .where('listToken', '==', token)
        .get()
        // TWO: TADA! this is how we handle async code! This request to get items with matching listToken
        // from the db returns a promise, which has three callbacks: then (which is basically "if success", catch
        // (if an error occured in request), and finally (which will run after EITHER then or catch, can be a way
        // to wrap things up if the same cleanup steps are required for both success and error results)
        .then(response => {
          // THREE: normalize this "list", the info coming back from the db comes back with response.doc as a list,
          // BUT each of the items in the list needs to be "unpacked" by running .data() on it (hence where the
          // item.data().name stuff came from earlier in our debugging)
          const normalizedList = response.docs.map(doc => doc.data());
          // FOUR: once normalized, update the context with the list we just fetched! it'll save us from
          // having to call it again in a couple steps!
          setListValue(normalizedList);
          // FIVE: same as line 63 now that we've tidied up the format of the list coming back from the db to be the same
          // as the format of our list stored in ListContext
          const dupeIfFound = checkForDupes(normalizedList);
          // SIX: same as line 64, which we'll now handle for both the if and else blocks in this function inside of the
          // useEffect for matchState (above)
          dupeIfFound ? setMatchState(true) : setMatchState(false);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
    }
  };

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

  const handleTextChange = event => {
    setName(event.target.value);
    setMatchState(null);
  };

  const handleRadioButtonChange = event => setFrequency(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    checkItems();
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
            <p className="itemFeedback">Item already exists!</p>
          ) : matchState === false ? (
            <p className="itemFeedback">Adding item!</p>
          ) : null}
          <button type="submit">Add item</button>
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
