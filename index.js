const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const geocode = require('./geocode')
const geoplace = require('./geoplace')

const app = express()

app.use(bodyParser.json())

app.post('/', (req, res) => {
  if(!req.body.hasOwnProperty('addresses') || !req.body.addresses){
    return res.status(400).json({ error: 'addresses not specified' })
  }
  const addresses = req.body.addresses
  const queries = addresses.map(address => geoplace(address))
  Promise.all(queries.map(p => p.catch(e => null)))
    .then(ids => {
      const geocodes = ids.map(id => {
        if(id === null){
          return new Promise((resolve, reject) => reject(null))
        }
        return geocode(id)
      })
      Promise.all(geocodes.map(q => q.catch(e => 'no postal code found')))
        .then(result => {
          console.log(result)
          const resultBody = result.map((p, i) => ({postal_code: p, address: addresses[i]}))
          res.json({ result: resultBody })
        })
        .catch(err => res.status(500).send(error))
    })
    .catch(error => res.status(500).send(error))
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

app.listen(8090, () => console.log('postman-pat started on port 8090'))