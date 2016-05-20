angular.module('starter.controllers', [])

.controller('notesController', function($scope) {
	var nNotes = 0;
	$scope.notes = [];
	var db = new PouchDB('notes',{adapter: 'websql'});

	db.info().then(function (info) {
	console.log(info);
	})
	
	getAllNotes();
	
	function getAllNotes(){
		console.log("Getting all notes...");
		db.allDocs({
		  include_docs: true,
		}).then(function (result) {
		  // handle result
		   nNotes = result.total_rows;
		   console.log("total: "+nNotes);
		   result.rows.forEach(function(element){
                        $scope.notes.push({id: parseInt(element.doc._id),
										title: element.doc.title,
										text: element.doc.text,
										date: element.doc.date.substring(0,10)
										});
										
						//console.log( parseInt(element.doc._id));
						//console.log( element.doc.title);
						//console.log( element.doc.text);
						//console.log( element.doc.date.substring(0,10));
                    });
					
			$scope.$apply();
		}).catch(function (err) {
		  console.log(err);
		});
	}

	$scope.deleteNote = function(note) {

		$scope.notes.splice($scope.notes.indexOf(note), 1);
	
		db.get(note.id.toString()).then(function(doc) {
		  console.log("deleting note: "+note.id);
		  return db.remove(doc);
		}).then(function (result) {
		  // handle result
		}).catch(function (err) {
		  console.log(err);
		});
		
		$scope.$apply();
	}
})

.controller('singleNoteController', function($scope, $stateParams, $state) {
	console.log("being loaded!", $stateParams.id);
	
	var id = $stateParams.id.toString();
	
	var db = new PouchDB('notes',{adapter: 'websql'});

	db.info().then(function (info) {
	console.log(info);
	})
	
	db.get(id).then(function(doc){
		$scope.titleText = doc.title;
		$scope.noteText = doc.text;
		$scope.$apply();
	}).catch(function (err) {
		console.log(err);
	});
	
	
	$scope.closeNote = function(){
	
		db.get(id).then(function(doc){
			console.log("Updating and closing note!");
			var note = {
					_id: id.toString(),
					_rev: doc._rev,
					title: $scope.titleText,
					text: $scope.noteText,
					date: new Date().toISOString()
				};
				
			db.put(note, function callback(err, result) {
				if (err) {
				  console.log("error updating! :"+err);
				} else {
					console.log("Updated! "+note);
				}
			});
		}).catch(function (err) {
			console.log(err);
		});
	
		$state.go('notes').then(function(){$state.reload();});
	};
})

.controller('newNoteController', function($scope,$state) {
	var nNotes = 0;
	var note, id;
	var db = new PouchDB('notes',{adapter: 'websql'});

	db.info().then(function (info) {
	console.log(info);
	})
	
	$scope.addNote = function(){
		db.allDocs({
		}).then(function (result) {
		   nNotes = result.total_rows;
		   console.log("addNote: "+nNotes);
		   id = nNotes + 1;
		    note = {
					_id: id.toString(),
					title: $scope.titleText,
					text: $scope.noteText,
					date: new Date().toISOString()
				};
			console.log(note);
			db.put(note, function callback(err, result) {
				if (err) {
				  console.log(err);
				} else {
					console.log("Added! "+note);
				}
			});
		});		   
	};
	
	$scope.closeNote = function(){
		$state.go('notes').then(function(){$state.reload();});
	};
});


