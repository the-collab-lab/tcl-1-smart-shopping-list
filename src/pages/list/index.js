import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withFirestore } from 'react-firestore';
import moment from 'moment';
import { TokenContext, ListContext } from '../../contexts';
import { Link } from 'react-router-dom';
import {
  ContentWrapper,
  Footer,
  Header,
  Loading,
  PageWrapper,
} from '../../components';
import {
  displayFrequency,
  sortOnPurchaseStateAndFrequencyAndActivity,
  identifyInactiveItems,
} from '../../lib/frequency';
import Welcome from '../../components/welcome';
import calculateHistory from '../../lib/puchaseHistory';

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
  const { list, setListValue, saveUpdatedListItem } = useContext(ListContext);

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
          const items = response.docs.map(doc => {
            return { ...doc.data(), ...{ id: doc.id } };
          });
          sortAndSaveList(items);
        })
        .catch(error => {
          console.error('Error getting documents: ', error);
          setLoading(false);
        });
    }
  };

  const handleItemPurchase = item => {
    const uid = item.id;
    const calculatedItem = calculateHistory(item);
    updateListItem(uid, calculatedItem);
  };

  const updateListItem = (uid, item) => {
    setLoading(true);
    firestore
      .collection('items')
      .doc(uid)
      .update({
        lastInterval: item.newInterval,
        lastPurchaseDate: item.newPurchasedDate,
        lastEstimate: item.newEstimate,
        numberOfPurchases: item.newNumberOfPurchases,
        nextEstimatedPurchaseDate: item.nextEstimatedPurchaseDate,
      })
      .then(function() {
        // NOTE: from what i can tell the functions inside ListContext don't have
        // access to the current "state" of the list value, so it does have to be
        // passed in...for now, until i figure out something else.
        const updatedList = saveUpdatedListItem(uid, item, list);
        sortAndSaveList(updatedList);
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
      });
  };

  // NOTE: retrieves the sorted list back based on (1) if it's inactive it automatically goes
  // to the bottom of the list and gets no background color, and (2) if it's active, sort by
  // frequency category -- soonest at the top
  const sortAndSaveList = list => {
    const sortedList = sortOnPurchaseStateAndFrequencyAndActivity(list);
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
    const now = moment(Date.now());
    // NOTE: check to make sure item.lastPurchaseDate is "truthy" (aka not null or undefined)
    // before we pass it to moment, passing null gets flagged as an invalid date BUT passing
    // undefined into moment returns the same as Date.now() because moment sees it as the same
    // as calling moment() to get current date/time.
    const lpd = item.lastPurchaseDate ? moment(item.lastPurchaseDate) : null;
    const purchasedWithin24Hours = lpd ? lpd.diff(now, 'hours') < 24 : null;

    if (identifyInactiveItems(item)) return {};
    if (purchasedWithin24Hours) return { textDecoration: 'line-through' };

    if (Date.now() - item.purchaseDate < 86400000) {
      return {
        textDecoration: 'line-through',
      };
    }

    if (Date.now() - item.purchaseDate < 86400000) {
      return {
        textDecoration: 'line-through',
      };
    }

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

  const displayNextEstimatedPurchaseDate = item => {
    if (item.nextEstimatedPurchaseDate)
      return (
        <span>
          next estimated purchase date:{' '}
          {moment(item.nextEstimatedPurchaseDate).format('MMM DD YYYY')}
        </span>
      );
    else return null;
  };

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
                  <button
                    className="itemPurchased"
                    onClick={() => handleItemPurchase(item)}
                  >
                    Purchase
                  </button>
                  <Link to={`/item-detail/${item.id}`}>
                    {`${item.name} ${displayFrequency(item)}`}
                  </Link>
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
