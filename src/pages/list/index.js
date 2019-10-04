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
import {
  displayFrequency,
  sortOnFrequencyAndActivity,
  identifyInactiveItems,
} from '../../lib/frequency';
import Welcome from '../../components/welcome';

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

  // NOTE: setting this particular component's private loading, userInput, and matches states
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [matches, setMatches] = useState([]);

  // NOTE: users won't have a list to view or add items to if they don't have a token, so
  // "push" them to where they can get started
  if (!token) history.push('/create-list');

  // NOTE: when we are retrieving items we wnt to check ListContext before we make another
  // call to firestore, we want to make sure we're only getting the items that have the
  // same token attached that we have saved in our localStorage / context provider.
  //
  // Additionally, the format that the lists come back in isn't a simple array, so we map
  // through and return the .data() on each of the docs it returns.
  const retrieveItemList = () => {
    if (Array.isArray(list) && list.length > 0) {
      sortAndSaveList(list);
    } else {
      firestore
        .collection('items')
        .where('listToken', '==', token)
        .get()
        .then(response => {
          const items = response.docs.map(doc => doc.data());
          sortAndSaveList(items);
        })
        .catch(error => {
          console.error('Error getting documents: ', error);
          setLoading(false);
        });
    }
  };

  // NOTE: retrieves the sorted list back based on (1) if it's inactive it automatically goes
  // to the bottom of the list and gets no background color, and (2) if it's active, sort by
  // frequency category -- soonest at the top
  const sortAndSaveList = list => {
    const sortedList = sortOnFrequencyAndActivity(list);
    setListValue(sortedList);
    setLoading(false);
  };

  // NOTE: if we DO have a token (so we can find matching list items) and loading
  // is set to true, then retrieve this user's list.
  //
  // CRITICAL: if we don't look for ALL these conditions, we risk the request being
  // (at best) run twice, or at worst, over and over and over and that's tough on the
  // wallet. Checking `!list` or `list == []` or `list === []` all result in forever-load.
  if (!!token && loading && list.length === 0) retrieveItemList();
  if (!!token && loading && list.length > 0) sortAndSaveList(list);

  // NOTE: each time the text input's value changes, we use setUserInput to update our local
  // hook state, then we check the list for item names that contain the string entered in
  // the text input
  const filterItems = event => {
    event.preventDefault();
    const inputString = event.target.value;
    setUserInput(inputString);

    const matchArray = list.filter(item => {
      const lcInputString = inputString.toLowerCase();
      const lcItemName = item.name.toLowerCase();

      if (lcItemName.indexOf(lcInputString) !== -1) return item;
      return false;
    });
    setMatches(matchArray);
  };

  const resetListAndMatches = () => {
    setUserInput('');
    setMatches([]);
  };

  const whichList = () => {
    const hasMatches = Array.isArray(matches) && matches.length;

    if (hasMatches) return matches;
    if (!hasMatches && userInput === '') return list;
    return [];
  };

  const colorCodeByFrequency = item => {
    if (identifyInactiveItems(item)) return {};

    switch (item.frequencyId) {
      case 0:
        return { backgroundColor: 'rgb(151, 245, 151, .8)' };
      case 1:
        return { backgroundColor: 'rgb(252, 252, 116, .8)' };
      case 2:
        return { backgroundColor: 'rgb(249, 120, 120, .8)' };
      default:
        return {};
    }
  };

  // const purchaseHistory = [];

  return (
    <PageWrapper>
      <Header />

      <ContentWrapper>
        {loading && <Loading />}

        {list.length === 0 ? (
          <Welcome />
        ) : (
          <div>
            <label>
              Type to filter by item name:
              <input
                type="text"
                placeholder="apples"
                onChange={e => filterItems(e)}
                value={userInput}
              />
            </label>
            <button onClick={e => resetListAndMatches()}>Clear</button>
            <ul id="mylist">
              {whichList().map((item, index) => (
                <li key={'item-' + index} style={colorCodeByFrequency(item)}>
                  <style>
                    {`
                  .green {
                    background-color: rgb(151, 245, 151, .8);
                  }
                  .yellow {
                    background-color: rgb(252, 252, 116, .8);
                  }
                  .red {
                    background-color: rgb(249, 120, 120, .8);
                  }
                `}
                  </style>
                  <SmartLink
                    className="item-detail-link"
                    routeTo="/item-detail"
                  >
                    {item.name + displayFrequency(item)}
                  </SmartLink>
                  <button
                    className="itemPurchased"
                    onClick={() => {
                      const purchaseDate = Date.now();
                      console.log('item: ', item);
                      item.purchaseHistory.push(purchaseDate);
                      console.log('item:', item.purchaseDate);
                      // console.log('purchaseHistory:', purchaseHistory);
                    }}
                  >
                    Purchased
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
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
