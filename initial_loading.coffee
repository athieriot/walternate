#!/usr/bin/env coffee

program = require 'commander'
async = require 'async'
moviedb = require './common/moviedb'
graphdb = require './common/graphdb'
moment = require 'moment'
winston = require 'winston'
ProgressBar = require 'progress'
_ = require('underscore')._

movieCount = 0
genreCount = 0
personCount = 0
startDate = moment()
bars = {}

mixCrewPeople = (cast, crew) ->
   _.map(_.union(cast, crew), (element) ->
      _.defaults element, {department: "Actor"}
   )

dumpPerson = (movie, movieNode, person, hop) =>
   async.waterfall [
      (callback) =>
         @logger.verbose "Indexing person: #{person.name} - Department: #{person.department}"
         personCount = parseInt(personCount) + 1
         moviedb.call 'personInfo', person.id, {}, callback
      ,
      (personInfo, callback) =>
         @logger.verbose "Place of birth: #{personInfo.place_of_birth}"
         graphdb.addPerson personInfo, callback
      ,
      (personNode, callback) ->
         graphdb.addRelation person, movie, personNode, movieNode, callback
   ], hop

dumpMovie = (movie, hop) =>
   movieNodeGlobal = {}
   async.waterfall [
      (callback) =>
         @logger.verbose "Indexing movie: #{movie.title}"
         movieCount = parseInt(movieCount) + 1
         moviedb.call 'movieInfo', movie.id, {}, callback
      ,
      (movieInfo, callback) =>
         @logger.verbose "Budget: #{movieInfo.budget}"
         graphdb.addMovie movieInfo, callback
      ,
      (movieNode, callback) ->   
         movieNodeGlobal = movieNode
         moviedb.call 'movieCasts', movie.id, {}, callback
      , 
      (casts, callback) ->
         casts.cast = mixCrewPeople(casts.cast, casts.crew)

         async.forEach casts.cast, async.apply(dumpPerson, movie, movieNodeGlobal), callback
   ], hop

dumpGenre = (genre, hop, page = 1) =>
   async.waterfall [
      (callback) =>
         @logger.verbose "Indexing genre: #{genre.name} - page: #{page}"
         moviedb.call 'genreMovies', genre.id, {page: page, include_all_movies: @include_all_movies}, callback
      ,
      (movies, callback) ->
         async.forEach movies.results, dumpMovie, async.apply(callback, null, {
            total_pages: movies.total_pages
         })
   ], (err, details) =>
      if(err)
         hop err


      if (page == 1)
         genreCount = parseInt(genreCount) + 1
         bars[genre.name] = new ProgressBar("Importing genre #{genre.name} :current/:total [:bar] :percent :elapsed :etas", { total: details.total_pages });

      @logger.verbose "Page: #{page} on a total of #{details.total_pages}"
      bars[genre.name].tick()

      if (details.total_pages > page)
         dumpGenre genre, hop, parseInt(page) + 1
      else
         hop null

program
  .version('0.0.1')
  .option('-v, --verbose', 'Verbose mode')
  .option('-a, --all', 'Include all movies')
  .parse(process.argv);

@logger = new winston.Logger({
   transports: [
      new (winston.transports.Console) { level: if program.verbose then 'verbose' else 'info' }
   ]
}).cli()

@include_all_movies = program.all

async.waterfall [
   (callback) ->
      moviedb.call 'genreList', {}, {}, callback
   ,
   (genres, callback) ->
      async.forEachSeries genres.genres, dumpGenre, callback
      #dumpGenre genres.genres[0], callback
], (err, result) =>
   time = startDate.fromNow()
   if (err)
      @logger.info "\n"
      @logger.info "Something bad happening:  #{err}"
   else
      @logger.info "\n"
      @logger.info "Process time: #{time}"
      @logger.info "#{genreCount} indexed genres"
      @logger.info "#{movieCount} indexed movies"
      @logger.info "#{personCount} indexed persons"
