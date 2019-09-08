import React from 'react';
import { withFirestore } from 'react-firestore';
import {
  ContentWrapper,
  Header,
  PageWrapper,
  SmartLink,
} from '../../components';
import getToken from '../../lib/token';

const CreateList = ({ firestore }) => {
  const storeTokenInFirebase = token => {
    firestore
      .collection('lists')
      .doc(token)
      .set({ date: Date.now() });
  };

  const storeTokenInLocalStorage = token => {
    localStorage.setItem('token', token);
  };

  const handleSubmit = event => {
    const token = getToken();
    storeTokenInFirebase(token);
    storeTokenInLocalStorage(token);
  };

  return (
    <PageWrapper>
      <Header />
      <ContentWrapper>
        <h2 className="welcomeTitle">Welcome to your smart shopping list!</h2>
        <h3 className="tagline">Click 'Create Shopping Lists' to start.</h3>
        <SmartLink
          className="create-list-link"
          routeTo="/"
          onClick={handleSubmit}
        >
          Create Shopping List
        </SmartLink>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default withFirestore(CreateList);
