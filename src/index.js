/* https://npm.io/package/tournament-organizer - 
author - https://github.com/slashinfty */

const express = require('express');
const bodyParser = require('body-parser');
const TournamentOrganizer = require('tournament-organizer'); // import module

function GetStandings() {
    const manager = new TournamentOrganizer.EventManager(); // create new tournament

    const tourney = manager.createTournament(null, {
        name: 'My Example Tournament',
        format: 'swiss',
        playoffs: 'elim',
        cutLimit: 8,
        bestOf: 3,
        winValue: 3,
        drawValue: 1,
        tiebreakers: ['magic-tcg']
    });

    // adding as many players as you want
    tourney.addPlayer('Liam S');
    tourney.addPlayer('Emma P.');
    tourney.addPlayer('Noah B.');
    tourney.addPlayer('Sophia R.');

    tourney.startEvent(); // start the event

    const active = tourney.activeMatches(); // matches in progress
    //console.log(active);

    tourney.result(active[0], 2, 1); // setting one result

    const standings = tourney.standings(); // getting the standings
    console.log(standings)

    return standings;
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); // to understand encoded url

app.get('/', (req, res) => {
    res.send(GetStandings());
})

app.listen(3333);
