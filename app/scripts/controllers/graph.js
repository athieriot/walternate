'use strict';

walternateApp.controller('GraphController', ['$scope', '$resource', '$routeParams', function($scope, $resource, $routeParams) {
   $scope.configuration = $resource("/api/configuration", {format:'json'} ).get();

   var graphdb = $resource("/query/:id", {id:'@id', format:'json'} );

   var relations = graphdb.query({id: $routeParams.movieId}, function() {

     var sigRoot = document.getElementById('sig');
     var sigInst = sigma.init(sigRoot).drawingProperties({
       defaultLabelColor: '#fff',
       defaultLabelSize: 14,
       defaultLabelBGColor: '#fff',
       defaultLabelHoverColor: '#000',
       labelThreshold: 1,
       defaultEdgeType: 'curve'
     }).graphProperties({
       minNodeSize: 0.5,
       maxNodeSize: 5,
       minEdgeSize: 1,
       maxEdgeSize: 1
     });

     sigInst.addNode($routeParams.movieId, {
       label: $routeParams.movieId,
       color: '#00ff00',
       x: 1
     });

     for (var key in relations) {
       var relation = relations[key];
       var angle = Math.random()*Math.PI*2;
       try{sigInst.addNode(relation.person.name,{
         label: relation.person.name,
         color: '#ff0000',
         x: Math.cos(angle)*20,
         y: Math.sin(angle)*20
       });} catch(e){}

       try{sigInst.addNode(relation.movie.title,{
         label: relation.movie.title,
         color: '#00ff00',
         x: (Math.cos(angle)*30),
         y: (Math.sin(angle)*30)
       });} catch(e){}

       try{sigInst.addEdge($routeParams.movieId + "_" + relation.person.name, $routeParams.movieId, relation.person.name);}catch(e){}

       sigInst.addEdge(relation.person.name + "_" + relation.movie.title, relation.person.name, relation.movie.title);
     }

     sigInst.bind('overnodes',function(event){
       var nodes = event.content;
       var neighbors = {};
       sigInst.iterEdges(function(e){
         if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){
           neighbors[e.source] = 1;
           neighbors[e.target] = 1;
         }
       }).iterNodes(function(n){
         if(!neighbors[n.id]){
           n.hidden = 1;
         }else{
           n.hidden = 0;
         }
       }).draw(2,2,2);
     }).bind('outnodes',function(){
       sigInst.iterEdges(function(e){
         e.hidden = 0;
       }).iterNodes(function(n){
         n.hidden = 0;
       }).draw(2,2,2);
     });

     sigInst.draw();
   });
}]);

