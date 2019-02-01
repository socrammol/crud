const express = require('express')
const bodyParser = require('body-parser')
const app = express()

//porta em uma constante
var port = process.env.PORT || 8000;

//banco de dados
const MongoClient = require ('mongodb').MongoClient;
const uri ='mongodb://dbuser:m123456@ds111455.mlab.com:11455/teste_crud'
var ObjectId = require ('mongodb').ObjectID;


MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('teste_crud')

    app.listen(port, function(){
        console.log(`server running on port ${port}`)
    })
        
})


app.use(express.static('src'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/',(req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/api/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.status(200).json({ data: results })

    })
})

app.post('/api/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/api/show')
    })
})

app.route ('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.status(200).json({data: result})
    })
})

.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
  
    db.collection('data').updateOne({_id: ObjectId(id)}, {
      $set: {
        name: name,
        surname: surname
      }
    }, (err, result) => {
      if (err) return res.send(err)
      res.redirect('/show')
      console.log('Atualizado no Banco de Dados')
    })
  })

app.route ('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({_id:ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('deletado do banco')
        res.redirect('/show')
    })
})
