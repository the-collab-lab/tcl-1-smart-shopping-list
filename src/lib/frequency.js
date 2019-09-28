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

// NOTE: this could be updated once we add item editing. The same edit logic
// could be used here to update the DB data structures so that in the future
// each list item passes in the first if check below instead of having to run
// through the full matchedOption function.
const backwardCompatibleFreqId = list => {
  return list.map(item => {
    // if item has the frequencyId property, check to make sure it matches
    // one of our options, if so, that item is up to date and doesn't need
    // to be converted from an earlier format
    const fid = item.frequencyId;
    if (fid > -1 && !!frequencyOptions[fid]) return item;

    // else if item doesn't have the frequencyId property, we'll look to the
    // old frequency property and "shim" the item to use the matching frequency
    // option if found, otherwise show the default of frequencyOptions[0]
    // const modernizeFreqInfo = item => {
    const matchedOption = frequencyOptions.find(option => {
      const allDashes = new RegExp('-', 'g');
      const lcOption = option.display.toLowerCase();
      // NOTE: replacing instances of '-' with ' ' via global (see 'g') RegExp.
      // simply using .replace('-', ' ') only replaces the first instance of '-'
      const lcNormFreq = item.frequency.replace(allDashes, ' ').toLowerCase();
      return lcOption === lcNormFreq;
    });

    if (matchedOption) return { ...item, ...{ frequencyId: matchedOption.id } };
    return false;
  });
};

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

const displayFrequency = item => {
  if (frequencyOptions[item.frequencyId])
    return ' (' + frequencyOptions[item.frequencyId].display + ')';
  // else if frequencyId is not one of the expected frequencyOptions, don't
  // assign it a display frequency
  return '';
};

export {
  frequencyOptions,
  displayFrequency,
  backwardCompatibleFreqId,
  sortOnFrequencyAndActivity,
  identifyInactiveItems,
};
