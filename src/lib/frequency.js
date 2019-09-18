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
    daysUntilDue: 8, // days until item is past due (8-30 days)
    daysUntilDueMax: 30,
  },
  {
    display: 'Not Soon',
    id: 2, // matches the item's index within this array, at least for now
    daysUntilDue: 31, // days until item is past due (31+ days)
    daysUntilDueMax: null, // no upper end -- until it turns inactive
  },
];

// NOTE: item considered inactive once it reaches 2n days past due where n equals it's previous frequency value
const checkIfInactive = daysUntilDue => daysUntilDue * 2;

export { frequencyOptions, checkIfInactive };
