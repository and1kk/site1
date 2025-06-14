const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
};

const server = http.createServer((req, res) => {
    console.log(`Запрошен URL: ${req.url}`);

    // Если запрошен корень — редирект на login.html
    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(302, { Location: '/pages/login.html' });
        res.end();
        return;
    }

    // Формируем путь к файлу (от корня проекта)
    // Ограничиваем доступ к папкам pages, scripts и т.д.
    let safePath = path.normalize(decodeURI(req.url)).replace(/^(\.\.[\/\\])+/, '');

    // Если URL не начинается с /pages или /scripts, вернуть 404
    if (!safePath.startsWith('/pages') && !safePath.startsWith('/scripts')) {
        res.writeHead(404);
        res.end('404 - Not Found');
        return;
    }

    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404);
            res.end('404 - Not Found');
            return;
        }

        // Определяем Content-Type по расширению файла
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });

        // Читаем и отправляем файл
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});