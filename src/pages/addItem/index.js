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

  // NOTE: local state gives the value a place to live before we officially add them to the
  // app "state" (in the ListContext)
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState(frequencyOptions[0].value);

  // NOTE: users won't have a list to view or add items to if they don't have a token, so
  // "push" them to where they can get started
  if (!token) history.push('/create-list');

  //TODO 3 pass urgency number instead of value to firebase

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

  const checkUrgency = urgency => {
    console.log(frequencyOptions.urgency);
    sendNewItemToFirebase({ name, frequency, listToken: token });
  };

  const handleTextChange = event => setName(event.target.value);

  const handleRadioButtonChange = event => setFrequency(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    checkUrgency();
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
                checked={frequency === option.id}
              />
              {option.display}
            </label>
          ))}
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
