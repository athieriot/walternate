var frisby = require('frisby');

frisby.create('Search for a movie')
  .get('http://localhost:3501/api/searchMovie/stargate')
  .expectStatus(200)
.toss();
