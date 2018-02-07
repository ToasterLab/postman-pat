const request = require('request-promise-native')
const dotenv = require('dotenv')

dotenv.config()

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_GEOCODE_API = `https://maps.googleapis.com/maps/api/geocode/json`
const STATUS_CODES = {
  OK: "OK",
  ZERO_RESULTS: "ZERO_RESULTS",
  OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
  REQUEST_DENIED: "REQUEST_DENIED",
  INVALID_REQUEST: "INVALID_REQUEST",
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
}

if(!GOOGLE_MAPS_API_KEY){
  throw Error(`GOOGLE_MAPS_API_KEY not specified`)
}

const geocode = (place_id, address) => new Promise((resolve, reject) => {
  const qs = { key: GOOGLE_MAPS_API_KEY }
  if(place_id){
    qs.place_id = place_id
  }
  if(address){
    qs.address = address
  }
  const options = { url: GOOGLE_MAPS_GEOCODE_API, qs }
  request.get(options)
    .then(response => {
      const responseJson = JSON.parse(response)
      if(responseJson.status === STATUS_CODES.OK){
        if( !responseJson.hasOwnProperty('results') || 
            !responseJson.results.length > 0 ||
            !responseJson.results[0].hasOwnProperty('address_components')){
          throw Error(`Invalid response: ${response}`)
        }
        const postalCodeComponent = responseJson.results[0].address_components.filter(component => {
          const types = component.types
          const isPostalCode = types.filter(type => type === "postal_code").length > 0
          return isPostalCode
        })
        if(postalCodeComponent.length === 1){
          const postalCode = postalCodeComponent[0].long_name
          resolve(postalCode)
        } else {
          throw Error(`No postal code found: ${response}`)
        }
      } else if (responseJson.status === STATUS_CODES.ZERO_RESULTS){
        resolve(null)
      } else {
        throw Error(response)
      }
    })
    .catch(err => {
      console.error(err)
      reject(err)
    })
})

module.exports = geocode