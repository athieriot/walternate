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

frisby.create('Search for a person')
   .get('http://' + server + '/api/searchPerson/Nathan Fillion')
   .expectStatus(200)
   .expectJSON("results.?", {
      id: 51797,
      name: "Nathan Fillion"
   })
   .expectJSONTypes({
      page: Number,
      total_pages: Number,
      total_results: Number
   })
.toss()

frisby.create('Search for the cast of a movie')
   .get('http://' + server + '/api/movieCasts/2164')
   .expectStatus(200)
   .expectJSON("cast.?", {
      id: 6856,
      name: "Kurt Russell"
   })
   .expectJSONTypes({
      id: Number
   })
.toss()
