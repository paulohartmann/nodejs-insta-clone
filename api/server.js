var express = require('express'),
	bodyParser = require('body-parser'),
	mongodb = require('mongodb'),
	objectId = require('mongodb').ObjectId;

var app = express();

//body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 3000;
app.listen(port);

var db = new mongodb.Db(
	'insta',
	new mongodb.Server('localhost', 27017, {}),
	{}
);


console.log('-> Servidor HTTP escutando em 3000');

app.get('/', function(req, res){
	res.send({msg: 'Olá'});
});

app.post('/api', function(req, res){
	var dados = req.body;

	db.open(function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.insert(dados, function(err, records){
				if(err){
					res.json(err);
				}else{
					res.json(records);
				}
			});
			mongoclient.close();
		});
	});
});

app.get('/api', function(req, res){
	db.open(function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.find().toArray(function(err, results){
				if(err){
					res.json(err);
				}else{
					res.json(results);
				}
				mongoclient.close();
			});			
		});
	});
});

app.get('/api/:id', function(req, res){
	db.open(function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.find(objectId(req.params.id)).toArray(function(err, results){ //req.params.id o mongo já sabe que é o ID do objeto que eu quero
				if(err){
					res.json(err);
				}else{
					res.status(200).json(results); //	COM MUDANÇA DE STATUS!! !
				}
				mongoclient.close();
			});			
		});
	});

});

app.put('/api/:id', function(req, res){

	var dados = req.body;

	db.open(function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.update(
				{_id : objectId(req.params.id)},
				{$set : {titulo : dados.titulo}},
				{},
				function(erro, records){
					if(erro){
						res.json(erro);
					}else{
						res.json(records);
					}
				}
			);				
			mongoclient.close();
		});			
	});
});

app.delete('/api/:id', function(req, res){

	var dados = req.body;
	//express validator - fundamentar que se valide os dados antes de executar!!! 
	db.open(function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.remove({_id : objectId(req.params.id)}, function(erro, records){
				if(erro){
					res.json(erro);
				}else{
					res.json(records);
				}
			});				
			mongoclient.close();
		});			
	});
});

