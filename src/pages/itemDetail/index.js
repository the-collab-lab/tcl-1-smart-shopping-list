import React from 'react';
import { ContentWrapper, Footer, Header, PageWrapper } from '../../components';
import { FirestoreDocument } from 'react-firestore';
import Loading from '../../components/loading';
import moment from 'moment';

const ItemDetail = ({ match }) => {
  // When a route matching /item-detail/:itemId is hit,
  // that :itemId becomes available in props.match.params.itemId
  const { itemId } = match.params;

  // TODO: Handle when there is no date data. Moment returns "Invalid Date".
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

      </ContentWrapper>
      <Footer />
    </PageWrapper>
  );
};

export default ItemDetail;