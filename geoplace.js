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
      const responseJson = JSON.parse(response)
      const hasResults = responseJson.hasOwnProperty('results') && responseJson.results.length > 0
      if(hasResults){
        const firstResult = responseJson.results[0]
        console.log(firstResult)
        resolve(firstResult.place_id)
      } else {
        throw Error('no results')
      }
    })
    .catch(err => {
      console.error(err)
      reject(err)
    })
})

module.exports = geoplace