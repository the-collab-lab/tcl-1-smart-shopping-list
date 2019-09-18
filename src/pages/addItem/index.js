import React, { useContext, useState } from 'react';
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
import { frequencyOptions } from '../../lib/frequency';

const AddItem = ({ history, firestore }) => {
  // NOTE: the line below is a destructuring declaration, which gives us a more concise way of
  // grabbing the properties off our context providers, the example here has the same result as
  // the destructuring syntax:
  //   const setTokenValue = useContext(TokenContext).setTokenValue;
  // the value is made more obvious when, in order to grab more than one property, you'd stack
  // up declarations, like this:
  //   const token = useContext(TokenContext).token;
  //   const setTokenValue = useContext(TokenContext).setTokenValue;
  //   const confirmToken = use Context(TokenContext).confirmToken;
  const { token } = useContext(TokenContext);
  const { list, setListValue } = useContext(ListContext);

  // NOTE: setting this particular component's private loading state
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  // NOTE: local state gives the value a place to live before we officially add them to the
  // app "state" (in the ListContext)
  const [frequency, setFrequency] = useState(frequencyOptions[0].value);
  const [matchState, setMatchState] = useState(null);

  // NOTE: users won't have a list to view or add items to if they don't have a token, so
  // "push" them to where they can get started
  if (!token) history.push('/create-list');

  // SEVEN: instead of use useEffect to trigger the same action for the same false state, we'll
  // just can just call triggerSendToFirebase instead. So even now, no matter if a match is found
  //in ListContext or in the db, we handle it the same.
  const triggerSendToFirebase = () => {
    setMatchState(false);
    sendNewItemToFirebase({
      name,
      frequency,
      listToken: token,
    });
  };

  const checkForDupes = dbList => {
    const dupeIfFound = dbList.find(
      item => item.name.toLowerCase() === name.toLowerCase()
    );
    dupeIfFound ? setMatchState(true) : triggerSendToFirebase();
  };

  const checkItems = () => {
    if (Array.isArray(list) && list.length > 0) {
      // ONE A: check list context for an array of items
      checkForDupes(list);
    } else {
      // ONE B: if no list context stored, check the db
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
          checkForDupes(normalizedList);
          // SIX: same as line 64, which we'll now handle for both the if and else blocks in this function inside of the
          // useEffect for matchState (above)
        })
        .catch(function(error) {
          console.error('Error getting documents: ', error);
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
//TODO 4 (kate: doing #1 instead) add export for frequency options array

AddItem.propTypes = {
  history: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
};
AddItem.defaultProps = {};
