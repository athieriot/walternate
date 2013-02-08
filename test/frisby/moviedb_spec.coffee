frisby = require 'frisby'
server = require('fs').readFileSync('.server')

frisby.create('Search for a movie')
   .get('http://' + server + '/api/searchMovie/stargate')
   .expectStatus(200)
   .expectJSON("results.?", {
      id: 2164,
      title: "Stargate"
   })
   .expectJSONTypes({
      page: Number,
      total_pages: Number,
      total_results: Number
   })
.toss()
