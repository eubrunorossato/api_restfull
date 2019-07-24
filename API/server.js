var  express = require('express')
var bodyParser = require('body-parser')
var mongoDB = require('mongodb')
var objectId = require('mongodb').ObjectId;

var app = express()

app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

var port = 8080;

var db = new mongoDB.Db(
    'instagram',
    new mongoDB.Server('localhost', 27017, {}),
    {}
)

app.listen(port, function(){
    console.log('Server listening on port ' + port)
});

app.get('/',function(req, res){
    res.send({ msg:'Ola' })
})

app.post('/api', function(req, res){
    var dados = req.body;
    console.log(dados)
    
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens2', function(err, collection){
            collection.insertOne(dados, function(erro, resp){
                if(erro){
                    throw erro;
                }else{
                    res.json({
                        status: true,
                    });
                }
                mongoClient.close()
            });
        });    
    });
});

app.get('/apiAllDocuments', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.find().toArray(function(err, result){
                if(err){
                    res.json(err)
                }else{
                    res.json(result)
                }
                mongoClient.close()
            })
        })
    })
})

app.get('/api/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.find(objectId(req.params.id)).toArray(function(err, result){
                if(err){
                    res.json(err)
                }else{
                    res.json(result)
                }
                mongoClient.close()
            })
        })
    })
})

app.put('/api/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.update(
                { _id: objectId(req.params.id) },
                { $set : { Titulo : req.body.Titulo } },
                {},
                function(err, records){
                    if(err){
                        res.json(err)
                    }else{
                        res.json(records)
                    }
                    mongoClient.close()
                }
            )
                mongoClient.close()
            })
        })
    })
