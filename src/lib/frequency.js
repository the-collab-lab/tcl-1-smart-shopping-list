//NOTE: we are doing this on a 0 index basis so the urgency is ordered in terms of soonest to buy
//TODO 1 (kate - done) put frequencyOptions in a global variable called staticValues or something like thaaaaat
//TODO 2 (kate) cleanup the frequencyOptions array to remove value
const frequencyOptions = [
  {
    display: 'Soon',
    urgency: 0, // matches the item's index within this array, at least for now
    daysUntilDueMin: 1, // days until item is past due (0-7 days)
    daysUntilDueMax: 7, // days until item is past due (0-7 days)
  },
  {
    display: 'Kind of soon',
    urgency: 1, // matches the item's index within this array, at least for now
    daysUntilDue: 8, // days until item is past due (8-30 days)
    daysUntilDueMax: 30,
  },
  {
    display: 'Not Soon',
    urgency: 2, // matches the item's index within this array, at least for now
    daysUntilDue: 31, // days until item is past due (31+ days)
    daysUntilDueMax: null, // no upper end -- until it turns inactive
  },
];

// NOTE: item considered inactive once it reaches 2n days past due where n equals it's previous frequency value
// TODO 1.5 (kate - done) create a fn to calculate if item is considered due
const checkIfInactive = daysUntilDue => daysUntilDue * 2;

export { frequencyOptions, checkIfInactive };
