const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const geocode = require('./geocode')

const app = express()

app.use(bodyParser.json())

app.post('/', (req, res) => {
  if(!req.body.hasOwnProperty('addresses') || !req.body.addresses){
    return res.status(400).json({ error: 'addresses not specified' })
  }
  const addresses = req.body.addresses
  const queries = addresses.map(address => geocode(address))
  const results = []
  Promise.all(queries.map(p => p.catch(e => 'no postal code found')))
    .then(result => {
      const resultBody = result.map((p, i) => ({postal_code: p, address: addresses[i]}))
      res.json({ result: resultBody })
    })
    .catch(error => res.status(500).send(error))
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

app.listen(3000, () => console.log('postman-pat started on port 3000'))