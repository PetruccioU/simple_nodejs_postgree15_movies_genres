-- SQL код для создания упрощенной базы данных simple_movie_genre_db:

CREATE TABLE movies (
                        id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
                        movie_name VARCHAR(50) UNIQUE NOT NULL,
                        movie_prod_year INTEGER NOT NULL,
                        CONSTRAINT PK_movies_id PRIMARY KEY (id)
);

CREATE TABLE genres (
                        id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
                        genre_name VARCHAR(50) NOT NULL,
                        movie_id INTEGER NOT NULL,
                        FOREIGN KEY ("movie_id")  REFERENCES "movies" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
                        CONSTRAINT PK_genres_id PRIMARY KEY (id)
);