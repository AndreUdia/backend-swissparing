/* https://npm.io/package/tournament-organizer - 
author - https://github.com/slashinfty */

const express = require('express');
const bodyParser = require('body-parser');
const TournamentOrganizer = require('tournament-organizer'); // import module
const { v4: uuidv4 } = require('uuid');

function GetStandings() {
    const manager = new TournamentOrganizer.EventManager(); // create new tournament
    //console.log(manager);

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

    const resume = ({eventID: tourney.eventID, name: tourney.name});

    console.log(resume);

    // adding as many players as you want
    tourney.addPlayer('Liam S');
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

    tourney.nextRound(); // calls next round if all active matches are finished

    return active;
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); // to understand encoded url

app.get('/', (req, res) => {
    res.send(GetStandings());
})

app.listen(3333);
