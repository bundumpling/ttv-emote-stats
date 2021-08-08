const zeroCounts = seedData => seedData.map(e => {
  e.count = 0;
  return e
})

export default zeroCounts;