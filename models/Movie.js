const { mongo } = require("mongoose");
const mongoose = require("monoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
