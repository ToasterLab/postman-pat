const request = require('request-promise-native')
const dotenv = require('dotenv')

dotenv.config()

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_GEOPLACE_API = `https://maps.googleapis.com/maps/api/place/textsearch/json`

if(!GOOGLE_MAPS_API_KEY){
  throw Error(`GOOGLE_MAPS_API_KEY not specified`)
}

const geoplace = query => new Promise((resolve, reject) => {
  const qs = { query, region: 'sg', key: GOOGLE_MAPS_API_KEY }
  const options = { url: GOOGLE_MAPS_GEOPLACE_API, qs }
  request.get(options)
    .then(response => {
      resolve(response)
    })
    .catch(err => {
      console.error(err)
      reject(err)
    })
})

geoplace('Istana')
  .then(r => console.log(r))