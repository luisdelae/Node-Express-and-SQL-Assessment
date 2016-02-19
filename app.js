var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var randomNumber = require('./randomNumber.js');

var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/animal_tracker';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/animals', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM animals');

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }

    });
});

app.post('/animals', function(req, res) {
    var addAnimal = {
        animal_type: req.body.animal_type,
        animal_qty: randomNumber(1, 100)
    };
    console.log(addAnimal.animal_type);
    pg.connect(connectionString, function(err, client, done) {
        client.query('INSERT INTO animals (animal_type, animal_qty) ' +
            'VALUES ($1, $2);',
            [addAnimal.animal_type, addAnimal.animal_qty],
            function(err, result) {
                done();
                if(err) {
                    console.log('Error inserting data: ', err);
                    res.send(false);
                } else {
                    res.send(addAnimal);
                }
            });
    });
});

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
