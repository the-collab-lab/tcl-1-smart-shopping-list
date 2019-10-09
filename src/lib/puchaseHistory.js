import calculateEstimate from './estimates';
import moment from 'moment';

const calculateNewNumberOfPurchases = item => item.numberOfPurchases + 1;

const calculateNewInterval = item => {
  const today = moment(Date.now()); // same as if we passed Date.now() into moment;
  const dateAdded = item.dateAdded ? moment(item.dateAdded) : null;
  const lastPurchaseDate = item.lastPurchaseDate
    ? moment(item.lastPurchaseDate)
    : null;

  if (lastPurchaseDate) return today.diff(lastPurchaseDate, 'days');
  else return today.diff(dateAdded, 'days');
};

const calculateNextEstimatedPurchaseDate = (newPurchasedDate, newEstimate) => {
  return moment(newPurchasedDate).startOf('day') + moment.duration(newEstimate, "days").asMilliseconds();
};

const calculateHistory = item => {
  const newPurchasedDate = Date.now();
  const newNumberOfPurchases = calculateNewNumberOfPurchases(item);
  const newInterval = calculateNewInterval(item, newNumberOfPurchases);
  const newEstimate = calculateEstimate(
    item.lastEstimate,
    newInterval,
    newNumberOfPurchases
  );
  const nextEstimatedPurchaseDate = calculateNextEstimatedPurchaseDate(newPurchasedDate, newEstimate);

  return {
    newPurchasedDate,
    newNumberOfPurchases,
    newInterval,
    newEstimate,
    nextEstimatedPurchaseDate,
  };
};

export default calculateHistory;
