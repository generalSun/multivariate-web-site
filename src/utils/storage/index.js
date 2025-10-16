import localforage from 'localforage'

const storage = localforage.createInstance({
  name: 'Storage',
  storeName: 'storage',
  version: 1.0,
  description: 'Storage version',
})

export default storage
