import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
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
  frequencyOptions,
  sortOnFrequencyAndActivity,
  identifyInactiveItems,
} from '../../lib/frequency';

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

  // TODO 5 use .map to run through the list of newly-stored items, for each frequencyId option create an
  // array and push items into the correct array based on their own frequencyId value (end result: 'soon'
  // array, 'kinda soon' array, 'not soon' array, BUT also the rest as 'uncategorized' array or similar?).
  // using .map isntead of .filter means we only have to run through the list once to split into arrays
  // instead of running .filter for each potential frequencyId values in order to find items that fit within
  // each. going past that, each array could have .sort run on it in order of how many days are left in their
  // timeline (min and max date range are stored in frequencyOptions) since their dateAdded value.

  // TODO 6 once you have your arrays for each frequency option (and a bucket for items without frequency
  // values), display/differentiate the groups however you'd like

  // TODO 7 for backwards compatibility - if `frequencyId` doesn't exist on the list item, look for `value`,
  // if neither value exists, sort as `uncategorized`

  // TODO 7.5 (bonus) for even better compatibility we can EDIT the items that don't have `frequencyId` based on
  // the `value` string we used previously (ie. remove `value` key/value pair, add `frequencyId` key/value pair),
  // and if neither of those values exist add a `frequencyId` key with value of `null` (this step could be
  // considered part of issue #16 )

  // TODO 8 make each frequency option's list distinct to a screen reader. This article talks about accessibility
  // in webpage structure: https://www.w3.org/WAI/tutorials/page-structure/content/ and this chrome extension that
  // andrew mentioned at the start of the project can probably help verify whether or not they're distinct enough:
  // https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni?hl=en-US

  //TODO 5 .filter() to find items that match the urgency index and order the groups accordingly DONE BOOM
  //TODO 6 assign color values to each level of urgency
  //TODO 7 backwords compatibility - if urgency doesn't exist, look for value
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

  return (
    <PageWrapper>
      <Header />

      <ContentWrapper>
        {loading && <Loading />}
        <div>
          <ul>
            {list.map((item, index) => (
              <li
                key={'item-' + index}
                className={
                  identifyInactiveItems(item)
                    ? ''
                    : item.frequencyId === 0
                    ? 'green'
                    : item.frequencyId === 1
                    ? 'yellow'
                    : item.frequencyId === 2
                    ? 'red'
                    : null
                }
              >
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
                <SmartLink className="item-detail-link" routeTo="/item-detail">
                  {item.name +
                    (item.frequencyId > -1
                      ? ' (' + frequencyOptions[item.frequencyId].display + ') '
                      : null)}
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
