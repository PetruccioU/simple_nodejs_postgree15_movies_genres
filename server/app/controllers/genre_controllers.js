// импортируем базу данных
const db = require("../db");

// создадим класс для хранения функций обработчиков, для запросов по таблице жанров
class GenreController {

    // показать все фильмы с перечислением жанров
    async getAllGenres(req, res) {
        const allGenres = await db.query('SELECT movie_name, movie_prod_year, genre_name, genres.id FROM genres INNER JOIN movies ON genres.movie_id = movies.id ORDER BY movie_name, genre_name ASC');
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(allGenres.rows));
    }

    // добавить фильму жанры по одному по id фильма
    async addGenre(req, res) {
        const {name, movieId} = req.body
        const newGenre = await db.query('INSERT INTO genres (genre_name, movie_id) VALUES ($1, $2)', [name, movieId])   //VALUES ($1) RETURNING *
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(newGenre.rows));
    }

    // показать все фильмы жанра по его имени
    async getOneGenre(req, res) {
        //const id = req.params.id
        const {name} = req.body
        const oneGenre = await db.query('SELECT movies.id, movie_name, movie_prod_year, genre_name, genres.id FROM genres INNER JOIN movies ON genres.movie_id = movies.id WHERE genre_name LIKE($1)', [name]);
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(oneGenre.rows));
    }

    // изменить один из жанров у фильма по id жанра-фильма
    async updateGenre(req, res) {
        const genreId = parseInt(req.params.id);
        const {name} = req.body;
        await db.query
            (
                "UPDATE genres SET genre_name = $1 WHERE id = $2",   //movieId
                [name, genreId]
            );
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(req.body.rows));
        //res.status(200).send({message: "Movie Updated Successfully!"});
    }

    // удалить один из жанров у фильма по id жанра-фильма
    async deleteGenre(req,res){
        const genreId = parseInt(req.params.id);
        await db.query('DELETE FROM genres WHERE id = $1', [genreId]);
        //res.status(200).send({ message: 'Movie deleted successfully!', movieId: genreId });
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(genreId.rows));
    }
}

// экспортируем экземпляр класса контроллера жанров
module.exports = new GenreController()

