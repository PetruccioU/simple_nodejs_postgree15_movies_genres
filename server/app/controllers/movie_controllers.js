const db = require('../db')

// создадим класс для создания методов-функций обработчиков для запросов по таблице фильмов
class MovieController {

    // получим все фильмы без жанров
    async getAllMovies(req, res) {
        const allMovies = await db.query('SELECT * FROM movies ORDER BY id ASC');
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(allMovies.rows));
    }

    // добавим фильм без указания жанра
    async addMovie(req, res) {
        let {name, year} = req.body   // Деструктурируем JSON req.body в переменные name и year
        const newMovie = await db.query('INSERT INTO movies (movie_name, movie_prod_year) values ($1, $2)', [name, year]);
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(newMovie.rows[0]));
    }

    // получим один фильм с его жанрами по id фильма
    async getOneMovie(req, res) {
        const id = req.params.id
        const oneMovie = await db.query('SELECT movie_id, movie_name, movie_prod_year, genre_name FROM genres INNER JOIN movies ON genres.movie_id = movies.id WHERE genres.movie_id = $1', [id]);
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(oneMovie.rows));
    }

    // изменим название фильма и год его производства по его id
    async updateMovie(req, res) {
        const movieId = (req.params.id);
        let {name, year} = req.body;
        await db.query("UPDATE movies SET movie_name = $1, movie_prod_year = $2  WHERE id = $3", [name, year, movieId]);
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(req.body.rows,movieId.rows));
    }

    // удалим фильм вместе с его жанрами из таблицы жанров
    async deleteMovie(req, res) {
        const movieId = (req.params.id);
        await db.query('DELETE FROM movies WHERE id = $1', [movieId]);
        await db.query('DELETE FROM genres WHERE movie_id = $1 ', [movieId]);
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(movieId.rows));
    }
}

// экспортируем экземпляр класса контроллера фильмов
module.exports = new MovieController()
