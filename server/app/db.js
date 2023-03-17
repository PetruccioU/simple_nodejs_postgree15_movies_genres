const dotenv = require('dotenv');
dotenv.config();

// подключимся к пулу базы данных:
const Pool = require('pg').Pool     // Создадим класс из модуля Pool
const pool = new Pool({      // В пуле размещаем объект для хранения настроек
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('Data base connected successfully!');
});
pool.on('error', (err) => {
    console.log('Error is: ',err)
});

module.exports = pool
