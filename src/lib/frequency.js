import moment from 'moment';

// NOTE: we are doing this on a 0 index basis so the urgency is ordered in terms of soonest to buy
const frequencyOptions = [
  {
    display: 'Soon',
    id: 0, // matches the item's index within this array, at least for now
    daysUntilDueMin: 1, // days until item is past due (0-7 days)
    daysUntilDueMax: 7, // days until item is past due (0-7 days)
  },
  {
    display: 'Kind of soon',
    id: 1, // matches the item's index within this array, at least for now
    daysUntilDueMin: 8, // days until item is past due (8-30 days)
    daysUntilDueMax: 30,
  },
  {
    display: 'Not Soon',
    id: 2, // matches the item's index within this array, at least for now
    daysUntilDueMin: 31, // days until item is past due (31+ days)
    daysUntilDueMax: null, // no upper end -- until it turns inactive
  },
];

const getStartOfDay = date => moment(date || undefined).startOf('day');

// NOTE: item considered inactive once it reaches 2n days past due where n
// equals it's previous frequency value's maximum end of the range
const sortOnFrequencyAndActivity = list => {
  return list.sort((a, b) => {
    // NOTE: first we'll look for in active items, those FOR SURE should appear
    // at the bottom of the list
    if (identifyInactiveItems(a) < identifyInactiveItems(b)) return -1;
    if (identifyInactiveItems(a) > identifyInactiveItems(b)) return 1;
    // NOTE: then, if neither item is identified as inactive, sort on frequencyId
    if (a.frequencyId < b.frequencyId) return -1;
    if (a.frequencyId > b.frequencyId) return 1;
    return 0;
  });
};

const identifyInactiveItems = item => {
  const { frequencyId, dateAdded } = item;

  const startOfAddDay = getStartOfDay(dateAdded);
  const startOfToday = getStartOfDay();
  const max = frequencyOptions[frequencyId].daysUntilDueMax || null;
  const doubleMaxDate = max ? moment(startOfAddDay).add(max * 2, 'days') : null;

  // NOTE: do not return item, we want it excluded from this filter's results, but we
  // do want to push it into the inactive items list.
  if (doubleMaxDate && doubleMaxDate < startOfToday) return true;
  return false;
};

export { frequencyOptions, sortOnFrequencyAndActivity, identifyInactiveItems };
