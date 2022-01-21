import { route } from ".";
import {movies} from "../db/films"

/**
 * Route to create a film. Returns the new user in the payload
 */
// let movies = [];

export const getmovies = (req, res) => {
    console.log(`movies in the database: ${movies}`);
    res.send({ data: movies });
}

export const createmovie = (req, res) => {   
    const movie = req.body;
    movies.push({...movie, id: uuid()});
    console.log(`movie [${movie.moviename}] added to the database.`);
    res.send({ data: movies });
};

export const getmovie = (req, res) => {
    res.send(req.params.id)
};

export const deletemovie = (req, res) => { 
    console.log(`movie with id ${req.params.id} has been deleted`);
    movies = movies.filter((movie) => movie.id !== req.params.id);
    res.send({ data: movies });
};

export const updatemovie =  (req,res) => {
    const movie = movies.find((movie) => movie.id === req.params.id);
    movie.moviename = req.body.moviename;
    movie.year = req.body.year;
    console.log(`moviename has been updated to ${req.body.moviename}.age has been updated to ${req.body.age}`)
    res.send({ data: movies });
};
