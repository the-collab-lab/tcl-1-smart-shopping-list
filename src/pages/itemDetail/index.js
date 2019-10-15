import React, { useState } from 'react';
import { ContentWrapper, Footer, Header, PageWrapper, Loading } from '../../components';
import { withFirestore, FirestoreDocument } from 'react-firestore';
import moment from 'moment';

const ItemDetail = ({ firestore, match, history }) => {
  // When a route matching /item-detail/:itemId is hit,
  // that :itemId becomes available in props.match.params.itemId
  const { itemId } = match.params;

  const deleteItemFromFirestore = itemId => {
    firestore
      .collection('items')
      .doc(itemId)
      .delete()
      .then(function() {
        console.log('Document successfully deleted!');
      })
      .catch(function(error) {
        console.error('Error removing document: ', error);
      });
  };

  const handleDeleteClick = () => {
    const confirmDeleteClick = window.confirm(
      'Are you sure you want to delete?'
    );
    return confirmDeleteClick
      ? (deleteItemFromFirestore(itemId), history.push('/'))
      : null;
  };

  return (
    <PageWrapper>
      <Header showBackLink={true} />
      <ContentWrapper>
        <FirestoreDocument
          path={`items/${itemId}`}
          render={({ isLoading, data }) => {
            return isLoading ? (
              <Loading />
            ) : (
              <>
                <h1>{data.name}</h1>
                <ul>
                  <li>Number of purchases: {data.numberOfPurchases}</li>
                  <li>Last purchase: {moment(data.lastPurchaseDate).format('MMM DD YYYY')}</li>
                  <li>Next purchase: {moment(data.nextEstimatedPurchaseDate).format('MMM DD YYYY')}</li>
                </ul>
              </>
            );
          }}
        />
        <button onClick={handleDeleteClick}>Delete</button>
      </ContentWrapper>
      <Footer />
    </PageWrapper>
  );
};

export default withFirestore(ItemDetail);
