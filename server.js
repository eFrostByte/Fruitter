function createGame(scr){
    const state = {
        players:{},
        fruits:{},
        scr,
        update: null,
    };

    function checkForFruitCollision(playerId){
        for(let fruitId in state.fruits){
            const fruit = state.fruits[fruitId]
            const player = state.players[playerId]
            if(player.x == fruit.x && player.y == fruit.y){
                removeFruit(fruitId);
                state.players[playerId].score += 1;
                if(state.update){state.update({state})}
            }
        }
    }

    function start(){
        const interval = 5000;
        setInterval(() => {
            addFruit({})
        }, interval);
        console.log('The game has started!');
    }

    function setUpdate(newUpdate){
        state.update = newUpdate;
    }

    function addPlayer(command){
        playerX = 'x' in command ? command.x : Math.floor(Math.random()*state.scr.width)
        playerY = 'y' in command ? command.y : Math.floor(Math.random()*state.scr.height)
        state.players[command.playerId] = {x:playerX, y:playerY, score:0};
        if(state.update){state.update({state})}
    }

    function removePlayer(playerId){
        delete state.players[playerId];
        if(state.update){state.update({state})}
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
            checkForFruitCollision(command.playerId);
            if(state.update){state.update({state})};
        }
    }

    function addFruit(command){
        const xx = 'x' in command ? command.x : Math.floor(Math.random()*state.scr.width);
        const yy = 'y' in command ? command.y : Math.floor(Math.random()*state.scr.height);
        const fruitId = `${xx}|${yy}`;
        state.fruits[fruitId] = {x: xx, y: yy};
        if(state.update){state.update({state})}
    }
    
    function removeFruit(fruitId){
        delete state.fruits[fruitId];
        if(state.update){state.update({state})}
    }

    
    


    return {
        state,
        start,
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        setUpdate,
    }
}

const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ipadress = '192.168.15.24';
const port = 3000;
const width = 10;
const height = 10;
const game = createGame({width, height})
game.setUpdate((command) => {
    io.emit('update', command.state);
})

game.start();



app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', (req, res) => {
    res.render('index.html');
});

io.on('connection', socket => {
    const playerId = socket.id;
    function update(){
        socket.broadcast.emit('update', game.state);
    }

    function start(){
        setInterval(() => {
            addFruit({});
        }, 4000);
    }

    socket.on('add-fruit', () => {})

    console.log(`Conectado ${playerId}`);
    game.addPlayer({playerId: playerId})
    socket.emit('setup', game.state);
    update();
    socket.on('disconnect', () => {
        console.log(`Desconectado ${playerId}`);
        game.removePlayer(playerId);
        update();
    });
    socket.on('move-player', command => {
        game.movePlayer(command);
    });
});

server.listen(port, ipadress, () => {
    console.log(`Listening on ${ipadress}:${port}...`);
});
