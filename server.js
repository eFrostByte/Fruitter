const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ipadress = '192.168.15.24';
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', (req, res) => {
    res.render('index.html');
});

io.on('connection', socket => {
    console.log(`Conectado ${socket.id}`);
    socket.emit('conectou', socket.id);
});

server.listen(port, ipadress, () => {
    console.log(`Listening on ${ipadress}:${port}...`);
});
