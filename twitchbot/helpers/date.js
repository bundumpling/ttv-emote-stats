const dateToDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateKey = `${year}${month}${day}`;
  return dateKey;
};

const dateKeyToDateString = (dateKey) => {
  const year = Number(dateKey.slice(0, 4));
  const month = Number(dateKey.slice(4, 6)) - 1;
  const day = Number(dateKey.slice(6));
  const date = new Date(year, month, day);
  const dateString = date.toDateString();
  return dateString;
};

module.exports = {
  dateToDateKey,
  dateKeyToDateString,
};
