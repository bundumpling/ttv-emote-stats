const randomizeEmoteCounts = seedData =>
  seedData.map(e => {
    e.count = Math.floor(Math.random() * 10000)
  return e;
  })

export default randomizeEmoteCounts;