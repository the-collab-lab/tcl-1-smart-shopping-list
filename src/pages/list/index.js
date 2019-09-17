import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withFirestore } from 'react-firestore';
import { TokenContext, ListContext } from '../../contexts';
import {
  ContentWrapper,
  Footer,
  Header,
  Loading,
  PageWrapper,
  SmartLink,
} from '../../components';

const List = ({ history, firestore }) => {
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
  const [loading, setLoading] = useState(true);

  // NOTE: users won't have a list to view or add items to if they don't have a token, so
  // "push" them to where they can get started
  if (!token) history.push('/create-list');

  // NOTE: when we are retrieving items, we want to make sure we're only
  // getting the items that have the same token attached that we have saved
  // in our localStorage / context provider.
  //
  // Additionally, the format that the lists come back in isn't a simple array, so
  // we map through and return the .data() on each of the docs it returns.
  //TODO 5 .filter() to find items that match the urgency index and order the groups accordingly
  //TODO 6 assign color values to each level of urgency
  //TODO 7 backwords compatibility - if urgency doesn't exist, look for value
  const retriveItemsFromFirebase = () => {
    firestore
      .collection('items')
      .where('listToken', '==', token)
      .get()
      .then(response => {
        const items = response.docs.map(doc => doc.data());
        setListValue(items);
      })
      .catch(error => console.error('Error getting documents: ', error))
      .finally(() => setLoading(false));
  };

  // NOTE: if we DO have a token (so we can find matching list items) and loading
  // is set to true, then retrieve this user's list.
  //
  // CRITICAL: if we don't look for ALL these conditions, we risk the request being
  // (at best) run twice, or at worst, over and over and over and that's tough on the
  // wallet. Checking `!list` or `list == []` or `list === []` all result in forever-load.
  if (!!token && loading && list.length === 0) retriveItemsFromFirebase();
  if (!!token && loading && list.length > 0) setLoading(false);

  return (
    <PageWrapper>
      <Header />

      <ContentWrapper>
        {loading && <Loading />}
        <div>
          <ul>
            {list.map((item, index) => (
              <li key={'item-' + index}>
                <SmartLink className="item-detail-link" routeTo="/item-detail">
                  {item.name +
                    (item.frequency ? ' (' + item.frequency + ') ' : '')}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </ContentWrapper>

      <Footer />
    </PageWrapper>
  );
};

export default withFirestore(List);

List.propTypes = {
  history: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
};
List.defaultProps = {};
