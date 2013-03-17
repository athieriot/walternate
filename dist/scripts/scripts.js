"use strict";var walternateApp=angular.module("walternateApp",["ngResource"]).config(["$routeProvider",function(o){o.when("/Relations/:movieId",{templateUrl:"views/relations.html",controller:"RelationsController"}).otherwise({redirectTo:"/"})}]);walternateApp.controller("SearchController",["$scope","$resource",function(o,t){o.configuration=t("/api/configuration",{format:"json"}).get(),o.moviedb=t("/api/searchMovie/:title",{title:"@title",format:"json"}),o.search=function(t){o.movies=o.moviedb.get({title:t})},o.popular=function(o){return o.vote_count>10},o.clear=function(){o.movies={}}}]),walternateApp.controller("RelationsController",["$scope","$resource","$routeParams","localNavigationStorage",function(o,t,e,r){o.configuration=t("/api/configuration",{format:"json"}).get(),o.graphdb=t("/query/:id",{id:"@id",format:"json"}),o.relations=o.graphdb.query({id:e.movieId}),r.add(e.movieId)}]),walternateApp.controller("LocalNavigationController",["$scope","$rootScope","$resource","localNavigationStorage",function(o,t,e,r){o.configuration=e("/api/configuration",{format:"json"}).get(),t.$watch("localNavigation",function(t){o.history=t}),o.clearNavigation=function(){r.clear()}}]),walternateApp.factory("localNavigationStorage",["$rootScope","$resource",function(o,t){var e="walternate-history",r=t("/api/movieInfo/:id",{id:"@id",format:"json"}),a=function(){return JSON.parse(localStorage.getItem(e)||"[]")};return{get:a,add:function(t){r.get({id:t},function(t){var r=a();(_.isEmpty(r)||t.id!=r[0].id)&&r.unshift(t),localStorage.setItem(e,JSON.stringify(r)),o.localNavigation=a()})},clear:function(){localStorage.removeItem(e),o.localNavigation=[]}}}]);