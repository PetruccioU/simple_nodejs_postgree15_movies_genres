const http = require("http");

// создадим класс эмиттер, и его экземпляр для работы с событийно-ориентированной моделью NodeJS
const EventEmitter = require('events')
const emitter = new EventEmitter();

// создадим класс "Роутер" для создания и последующего хранения функций обработчиков запросов
class Router
{
    // создадим конструктор эндпоинтов: в нем будем хранить объекты с ключём-маршрутом эндпоинта('/movies','/genres'),
    // а в значении будем хранить ещё один объект с ключём-методом http запроса('GET','POST','PUT','DELETE') и значение функцией обработчиком

    // возьмем за основу такую структуру
    // endpoints = {
    //     '/маршрут запроса':{
    //                  'HTTP метод запроса' : колбэк-функция обработчик,
    //                  'GET' : handler1,
    //                  'POST': handler2
    //    }
    // }
    constructor() {
        this.endpoints ={}
    }

    // добавим метод request
    request(method='GET', path, handler)
    {
        //убедимся что эндпоинта с таким маршрутом path нет, если его нет то создаем объект эндпоинт
        if(!this.endpoints[path]) {
            this.endpoints[path]={}
        }
        // запишем его в переменную
        const endpoint = this.endpoints[path];

        // теперь проверим есть ли в нашем маршруте такой метод, если да то выкидываем ошибку
        if (endpoint[method])
        {
            throw new Error(`Метод [${method}] по маршруту ${path} уже существует`)
        }
        // в обратном случае в значение объекта-метода добавляем функцию обработчик handler из запроса
        endpoint[method] = handler

        // "подпишемся" на событие "запрос"(то-есть здесь мы будем ожидать появления запроса),
        // с именем типа: [путь]:[метод], создавать это событие мы будем в дальнейшем(в сервере)
        emitter.on(`[${path}]:[${method}]`,(req,res)=>{handler(req,res)})
    }

    // добавим методы для создания основных 4-х http запросов, необходимых для реализации CRUD-операций
    // они будут являться экземплярами объекта request с прописанным типом http-запроса, на вход будут принимать путь
    // запроса path и callback-функцию обработчик handler
    get(path,handler)
    {
        this.request('GET', path, handler);
    }
    post(path,handler)
    {
        this.request('POST', path, handler);
    }
    put(path,handler)
    {
        this.request('PUT', path, handler);
    }
    delete(path,handler)
    {
        this.request('DELETE', path, handler);
    }
}

// создаем эндпоинты:
const router = new Router();

const movieController = require('./controllers/movie_controllers')
// эндпоинты для фильмов:
router.get('/all_movie', movieController.getAllMovies);              //  получить все фильмы без жанров
router.post('/movie', movieController.addMovie);                     //  добавим фильм без указания жанра
router.get('/movie', movieController.getOneMovie);                   //  получим один фильм с его жанрами по id фильма
router.put('/movie', movieController.updateMovie);                   //  изменить название фильма
router.delete('/movie', movieController.deleteMovie);                //  удалить фильм и его жанры

const genreController = require('./controllers/genre_controllers');
// эндпоинты для жанров
router.get('/all_genre', genreController.getAllGenres);              //  получить все фильмы с жанрами
router.post('/genre', genreController.addGenre);                     //  добавить фильму жанр
router.get('/genre', genreController.getOneGenre);                   //  получить все фильмы одного жанра по его имени
router.put('/genre', genreController.updateGenre);                   //  изменить жанр у фильма
router.delete('/genre', genreController.deleteGenre);                //  удалить жанр у фильма

// создаем сервер
const app = http.createServer((req, res)=> {

    // по событию получения данных из запроса, сохраним тело этого запроса(ожидаем формат JSON) в переменную:
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
        console.log('chunk: ',chunk)
    })
    // по завершению запроса преобразуем JSON из переменной body в объект и присвоим его полю body запроса(req)
    req.on('end', () => {
        if (body) {
            //console.log('body: ', (body))
            req.body = JSON.parse(body)
        }

        // получим параметры запроса из url
        const parsedURL = new URL(req.url, 'http://localhost:8000/')
        req.pathName = parsedURL.pathname
        const params= {};
        parsedURL.searchParams.forEach((value, key)=>params[key]=value)
        req.params = params;
        //console.log('req.params: ', JSON.stringify(req.params))

        // создадим событие, на которое мы до этого подписались
        const emitted = emitter.emit(`[${req.pathName}]:[${req.method}]`, req, res)

        if (!emitted) {
            res.end()
        }
    })
})

// экспортируем сервер
module.exports = app;