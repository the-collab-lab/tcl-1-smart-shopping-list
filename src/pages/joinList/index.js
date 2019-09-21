import React, { useState, useContext } from 'react';
import { ContentWrapper, Header, Footer, PageWrapper } from '../../components';
import { withFirestore } from 'react-firestore';
import { TokenContext } from '../../contexts';

const JoinList = ({ history, firestore }) => {
  const [token, setToken] = useState('');
  const { setTokenValue } = useContext(TokenContext);

  const verifyList = () => {
    // search through firebase for the list with the token that mathces the form input
    const docRef = firestore.collection('lists').doc(token);

    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          // send the token to localstorage via TokenContext
          setTokenValue(token);
          // redirect to list view so user can see all the items on the list they joined
          history.push('/');
        } else {
          // doc.data() will be undefined in this case
          // alert the user that the token doesn't exist and link them to the join-list or create-list pages
          alert(
            "Oops! That list can't be found. Please try again or create a new list."
          );
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      });
  };

  const handleChange = event => setToken(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    console.log(token);
    verifyList(token);
  };

  return (
    <PageWrapper>
      <Header />
      <ContentWrapper>
        <form onSubmit={handleSubmit}>
          <label>
            List Token:
            <input type="text" value={token} onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <p>
          You can also <a href="/create-list">create a new shopping list</a>.
        </p>
      </ContentWrapper>

      <Footer />
    </PageWrapper>
  );
};

export default withFirestore(JoinList);
