function createGame(scr){
    const state = {
        players:{},
        fruits:{},
        scr
    };

    function addPlayer(command){
        playerX = 'x' in command ? command.x : Math.floor(Math.random()*state.scr.width)
        playerY = 'y' in command ? command.y : Math.floor(Math.random()*state.scr.height)
        state.players[command.playerId] = {x:playerX, y:playerY};
    }

    function removePlayer(playerId){
        delete state.players[playerId];
    }

    function movePlayer(command){
        const acceptedMoves = {
            ArrowUp(player){
                if(player.y > 0){
                    player.y = player.y - 1
                }
            },
            ArrowRight(player){
                if(player.x < state.scr.width-1){
                    player.x = player.x + 1
                }
            },
            ArrowDown(player){
                if(player.y < state.scr.height-1){
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player){
                if(player.x > 0){
                    player.x = player.x -1
                }
            }
        }   
        
        const key = command.key;
        const player = state.players[command.playerId];
        const moveFunction = acceptedMoves[key];

        if(moveFunction && player){
            moveFunction(player);
        }
    }



    return {
        state,
        addPlayer,
        removePlayer,
        movePlayer
    }
}

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
    socket.emit('setup', socket.id);
});

server.listen(port, ipadress, () => {
    console.log(`Listening on ${ipadress}:${port}...`);
});
