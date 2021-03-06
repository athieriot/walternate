frisby = require 'frisby'
address = require('fs').readFileSync('.server').toString().split(':');
host = "localhost"
port = "3501"
server = host + ":" + port;

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

frisby.create('Search for a genre list')
   .get('http://' + server + '/api/genreList')
   .expectStatus(200)
   .expectJSON("genres.?", {
      id: 28,
      name: "Action"
   })
.toss()

frisby.create('Search for the movies of a genre')
   .get('http://' + server + '/api/genreMovies/28')
   .expectStatus(200)
   .expectJSON({
      total_results: (number) -> number > 700 && number < 10000
   })
   .expectJSONTypes("results.*", {
      id: Number,
      title: String 
   })
   .expectJSONTypes({
      results: Array,
      page: Number,
      total_pages: Number,
      total_results: Number
   })
.toss()

frisby.create('Search for ALL the movies of a genre')
   .get('http://' + server + '/api/genreMovies/28?include_all_movies=true')
   .expectStatus(200)
   .expectJSON({
      total_results: (number) -> number > 10000
   })
   .expectJSONTypes('results.*', {
      id: Number,
      title: String
   })
   .expectJSONTypes({
      results: Array,
      page: Number,
      total_pages: Number,
      total_results: Number
   })
.toss()

frisby.create('Get the second page of the movies of a genre')
   .get('http://' + server + '/api/genreMovies/28?page=2')
   .expectStatus(200)
   .expectJSON({
      page: 2
   })
   .expectJSONTypes({
      page: Number,
      total_pages: Number,
      total_results: Number
   })
.toss()
