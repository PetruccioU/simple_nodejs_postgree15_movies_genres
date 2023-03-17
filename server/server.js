const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';

// импортируем сервер из app
const server = require('./app/app');

// прослушаем порт
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});