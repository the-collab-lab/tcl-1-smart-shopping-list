import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withFirestore } from 'react-firestore';
import {
  ContentWrapper,
  Header,
  Footer,
  Loading,
  PageWrapper,
} from '../../components';
import { TokenContext } from '../../contexts';
import getToken from '../../lib/token';

const CreateList = ({ history, firestore }) => {
  // NOTE: the line below is a destructuring declaration, which gives us a more concise way of
  // grabbing the properties off our context providers, the example here has the same result as
  // the destructuring syntax:
  //   const setTokenValue = useContext(TokenContext).setTokenValue;
  // the value is made more obvious when, in order to grab more than one property, you'd stack
  // up declarations, like this:
  //   const token = useContext(TokenContext).token;
  //   const setTokenValue = useContext(TokenContext).setTokenValue;
  //   const confirmToken = useContext(TokenContext).confirmToken;
  const { setTokenValue } = useContext(TokenContext);

  // NOTE: setting this particular component's private loading state
  const [loading, setLoading] = useState(false);

  // NOTE: the only functionality in this component currently is the ability to get AND set
  // a new token if a user doesn't have one stashed away in localStorage.
  const handleClick = () => {
    setLoading(true);

    const newToken = getToken();
    setTokenValue(newToken);

    firestore
      .collection('lists')
      .doc(newToken)
      .set({ date: Date.now() })
      .then(() => {
        // NOTE: if this setting of the new token succeeds, we should save the user clicks and
        // "push" them to the list view
        setLoading(false);
        history.push('/');
      })
      .catch(error => {
        setLoading(false);
        console.error('Error getting documents: ', error);
      });
    // NOTE: we can't update loading state in the .finally() after the .catch() in this case,
    // otherwise React throws an error if we try to set it after history.push'
  };

  return (
    <PageWrapper>
      <Header />
      <ContentWrapper>
        {loading && <Loading />}

        <h2 className="welcomeTitle">Welcome to your smart shopping list!</h2>
        <h3 className="tagline">
          Click &quot;Create Shopping Lists&quot; to start.
        </h3>
        <button className="create-list-link" onClick={handleClick}>
          Create Shopping List
        </button>
        <p>You can also <a href="/join-list">join an existing shopping list</a>.</p>

      </ContentWrapper>

      <Footer />
    </PageWrapper>
  );
};

export default withFirestore(CreateList);

CreateList.propTypes = {
  history: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
};
CreateList.defaultTypes = {};
