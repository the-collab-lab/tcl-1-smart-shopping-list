import React, { useState } from 'react';
import { FirestoreCollection } from 'react-firestore';

import {
  ContentWrapper,
  Footer,
  Header,
  Loading,
  PageWrapper,
  SmartLink,
} from '../../components';

const List = () => {
  // Get the list token from localStorage the first time the component renders to avoid making the call to localStorage every time an item is added
  const [token] = useState(localStorage.getItem('token'));

  return (
    <PageWrapper>
      <Header />

      <ContentWrapper>
        <FirestoreCollection
          // Specify the path to the collection you're pulling data from
          path="items"
          // Filter the data to only show items where the listToken matches the token stored in localStorage
          filter={['listToken', '==', token]}
          // isLoading = is a Boolean that represents the loading status for the firebase query. true until an initial payload from Firestore is received.
          // data = an Array containing all of the documents in the collection. Each item will contain an id along with the other data contained in the document.
          render={({ isLoading, data }) => {
            return isLoading ? (
              <Loading />
            ) : (
              <div>
                <ul>
                  {data.map(item => (
                    <li key={item.id}>
                      <SmartLink className="detail-link" routeTo="/item-detail">
                        {item.name}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }}
        />
      </ContentWrapper>

      <Footer />
    </PageWrapper>
  );
};

export default List;

List.propTypes = {};
List.defaultProps = {};
