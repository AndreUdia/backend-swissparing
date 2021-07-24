const mongoose = require('mongoose');

// there should be lots of other fields, keeping simple just for tests
const PlayerSchema = new mongoose.Schema({
    alias: {
        type: String,
        require: true,
    },
    id: {
        type: String,
        unique: false,
        require: true,
    },
    seed: {
        type: Number,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;