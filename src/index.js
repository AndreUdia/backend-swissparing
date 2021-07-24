/* https://npm.io/package/tournament-organizer - 
author - https://github.com/slashinfty */

const express = require('express');
const bodyParser = require('body-parser');
const TournamentOrganizer = require('tournament-organizer'); // import module
const { v4: uuidv4 } = require('uuid');
var cache = require('memory-cache'); // salve an instance of EventManager in memory

/*function GetStandings() {
    const tourney = manager.createTournament(uuidv4(), { // first parameter could be an ID
        name: 'Tournament Equals9',
        format: 'swiss',
        playoffs: 'elim',
        cutLimit: 8,
        bestOf: 3,
        winValue: 3,
        drawValue: 1,
        tiebreakers: ['magic-tcg']
    });

    //const resume = ({eventID: tourney.eventID, name: tourney.name});

    // adding as many players as you want
    tourney.addPlayer('Liam S', 123, 1); // argument 2 for an ID, argument 3 for seed
    tourney.addPlayer('Emma P.');
    tourney.addPlayer('Noah B.');
    tourney.addPlayer('Sophia R.');
    tourney.addPlayer('Petter F.');

    tourney.startEvent(); // start the event

    const active = tourney.activeMatches(); // matches in progress
    //console.log(active[0]);

    tourney.result(active[0], 2, 1); // setting one result
    //tourney.result(active[1], 2, 1); // setting one result

    const standings = tourney.standings(); // getting the standings
    //console.log(standings)
}*/

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); // to understand encoded url

// Adding a new tournament and saving it on memory (cache) while it is on course
// generating id as first argument
app.post('/new-tournament', (req, res) => {
    try {
        const manager = new TournamentOrganizer.EventManager();
        const tourney = manager.createTournament(uuidv4(), req.body); 
        cache.put('manager', manager);
        cache.put('tourney', tourney);
        res.status(200).send({tourney: cache.get('tourney')}); // response is free, could be only the tournament ID
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

app.post('/add-player', (req, res) => {
    try {

        const idForNewPlayer = uuidv4();

        cache.get('tourney').addPlayer(req.body.alias + " - " + idForNewPlayer, idForNewPlayer, req.body.seed); // Id pode vir do front ou BD
        res.status(200).send({ text: "new player added" + " - " + idForNewPlayer }); 

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

app.post('/add-result', (req, res) => {
    try {
        // for testing I have used matchNumber, but it could be id
        // As the first argument has to be an object Match - I rather get the position from active matches to be secure

        const idOfMatch = req.body[0].id;
        const resultPlayerOne = req.body[1].matchNumber
        const resultPlayerTwo = req.body[1].playerTwoWins;
        //const match = cache.get('tourney').activeMatches()[req.body[0].matchNumber -1]; This is one way without filter

        const match = cache.get('tourney').activeMatches().filter(elem => elem.id == idOfMatch);

        cache.get('tourney').result(match[0], resultPlayerOne, resultPlayerTwo); // it is possible to have a forth param, with de draw, default is zero
        res.status(200).send({ text: 'Your result has been computed' }); 
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

app.get('/start-event', (req, res) => {
    cache.get('tourney').startEvent();
    res.send({text: "you have just started an event"});
})

app.get('/standings', (req, res) => {
    res.send(cache.get('tourney').standings());
})

app.get('/active-matches', (req, res) => {
    res.send(cache.get('tourney').activeMatches());
})

app.get('/next-round', (req, res) => {
    cache.get('tourney').nextRound();
    res.send({text: "Try to start next round"});
})

app.get('/tournament-name-id', (req, res) => {
    const tourney = cache.get('tourney');
    res.send({eventID: tourney.eventID, name: tourney.name});
})

app.get('/clear-cache', (req, res) => {
    cache.del('tourney');
    cache.del('manager');
    cache.clear();
    console.log(cache.size);
    res.send({text: 'Just Cleaning some Cache'});
})


require('./controllers/playerController')(app); // give app to make it a one stand application

app.listen(3333);


// tutorial on YouTube for more details
// https://www.youtube.com/watch?v=BN_8bCfVp88&t=922s