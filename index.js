// ПОДКЛЮЧЕНИЕ МОДУЛЕЙ
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); // Добавлено для парсинга тела запроса
require('dotenv').config();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const multer = require('multer');



// ---------------------------------------------------------------

// ПОДКЛЮЧЕНИЕ ФАЙЛОВ
// const postRequestApp = require('./adminRoutes'); // Путь к файлу postRequest.js
const pageRequestAppPage = require('./create_pages'); // Путь к файлу postRequest.js
const pageRequestAppPage2 = require('./create_calendar'); // Путь к файлу postRequest.js
const startRequest = require('./getstart');
const adminRouter = require('./router/radminRouter');
const mainPage = require('./main');

    // telegram bot  init
const { startTelegramBot, server_start, restartServer } = require('./telegram_bot');
startTelegramBot();
server_start();
// ---------------------------------------------------------------

// ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕК
const app = express(); // EXPRESS - для сайта
// ---------------------------------------------------------------


// ПОДКЛЮЧЕНИЕ ИСПОЛЬЗОВАНИЙ К ПРИЛОЖЕНИЮ
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
// app.use(postRequestApp);
app.use(pageRequestAppPage);
app.use(startRequest)
app.use(mainPage);
app.use('/api/admin', adminRouter)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Настройка multer для сохранения загруженных файлов в определенную папку
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
// ---------------------------------------------------------------


// ПЕРЕАДРЕСАЦИИ
app.get('/', (req, res) => {
    console.log('test')
    const indexPath = path.join(__dirname, 'public', 'index2.html');
    const data = fs.readFileSync(indexPath, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(data);
});



// ---------------------------------------------------------------




// Обработка 404 ошибки
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'errors', '404', "index2.html"));
});


// ST

// STOP - STOP - STOP - STOP - STOP - STOP - STOP - STOP
// SERVER SETTINGS | НЕ ИЗМЕНЯТЬ -------------------------------
const PORT = process.env.PORT || 4000;
if ("SOCKET" in process.env) {
    const socket = process.env.SOCKET;
    if (fs.existsSync(socket)) {
        fs.unlinkSync(socket);
    }
    app.listen(socket, () => {
        fs.chmodSync(socket, 0660);
        console.log(`Сервер запещен! Дата: ${new Date()}`);
        console.log(`Listening :${socket}`);
    });
} else if ("PORT" in process.env) {
    app.listen(PORT, () => {
        console.log(`Сервер запещен! Дата: ${new Date()}`);

        console.log(`Listening http:/:${PORT}/`);
    });

} else {
    app.listen(3000, function(){
        console.log(`Сервер запещен! Дата: ${new Date()}`);
        console.log('listening on *:3000');
    });
}
// SERVER SETTINGS | НЕ ИЗМЕНЯТЬ  ----------------------------------
// STOP - STOP - STOP - STOP - STOP - STOP - STOP - STOP