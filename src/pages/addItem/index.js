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
  //   const confirmToken = useContext(TokenContext).confirmToken;
  const { token } = useContext(TokenContext);
  const { list, setListValue } = useContext(ListContext);

  // NOTE: setting this particular component's private loadingState and matchState, which
  // are not values that will be passed to firebase, they only control the visual appearance
  // of this component
  const [loading, setLoading] = useState(false);
  const [matchState, setMatchState] = useState(null);

  // NOTE: local state gives the value a place to live before we officially add them to the
  // app "state" (in the ListContext)
  const [name, setName] = useState('');
  const [frequencyId, setFrequencyId] = useState(frequencyOptions[0].id);

  // NOTE: users won't have a list to view or add items to if they don't have a token, so
  // "push" them to where they can get started
  if (!token) history.push('/create-list');

  const handleTextChange = event => {
    setName(event.target.value);
    setMatchState(null);
  };

  const handleRadioButtonChange = event => {
    // NOTE: the id gets turned into a string, this ensures we're checking a number vs a number otherwise deep equal fails
    const valueFromsStringToNumber = Number(event.target.value);
    setFrequencyId(valueFromsStringToNumber);
  };

  const handleSubmit = event => {
    event.preventDefault();
    checkItems();
  };

  const checkItems = () => {
    if (Array.isArray(list) && list.length > 0) {
      checkForDupes(list);
    } else {
      firestore
        .collection('items')
        .where('listToken', '==', token)
        .get()
        // NOTE: TADA! this is how we handle async code! This request to get items with matching listToken
        // from the db returns a promise, which has three callbacks: then (which is basically "if success", catch
        // (if an error occured in request), and finally (which will run after EITHER then or catch, can be a way
        // to wrap things up if the same cleanup steps are required for both success and error results)
        .then(response => {
          // NOTE: we need to normalize this "list", the info coming back from the db comes back with response.doc
          // as a list, BUT each of the items in the list needs to be "unpacked" by running .data() on it (hence
          // where the item.data().name stuff came from earlier in our debugging)
          const normalizedList = response.docs.map(doc => doc.data());
          setListValue(normalizedList);
          checkForDupes(normalizedList);
        })
        .catch(function(error) {
          console.error('Error getting documents: ', error);
        });
    }
  };

  const checkForDupes = dbList => {
    const dupeIfFound = dbList.find(
      item => item.name.toLowerCase() === name.toLowerCase()
    );
    dupeIfFound ? setMatchState(true) : triggerSendToFirebase();
  };

  // NOTE: instead of using the useEffect to trigger the same action for the same false matchState, we'll
  // just can just call triggerSendToFirebase instead. So even now, no matter if a match is found
  // in ListContext or in the db, we handle it the same.
  const triggerSendToFirebase = () => {
    setMatchState(false);
    sendNewItemToFirebase({
      name,
      frequencyId,
      listToken: token,
      dateAdded: Date.now(),
    });
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
        setFrequencyId(frequencyOptions[0].id);
      })
      .catch(error => console.error('Error getting documents: ', error))
      .finally(() => setLoading(false));
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
                value={option.id}
                className="frequency-radio-button"
                onChange={handleRadioButtonChange}
                checked={frequencyId === option.id}
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
//DONE 4 (skip: doing #1 instead) add export for frequency options array, instead we'll import it at the top of the file

AddItem.propTypes = {
  history: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
};
AddItem.defaultProps = {};
