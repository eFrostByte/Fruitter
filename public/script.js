const socket = io('http://192.168.15.24:3000');
const scr = document.getElementById('scr');
const ctx = scr.getContext('2d');
const WIDTH = scr.width;
const HEIGHT = scr.height;
const game = createGame(scr);
const keyboard = createKeyboardListener(document); 

function appendPlayer(pid){
    const node = document.createElement('H2');
    const textNode = document.createTextNode(`${pid}: ${game.state.players[pid].score}`);
    node.appendChild(textNode);
    document.getElementById('scorediv').appendChild(node);
    node.id = pid;
}

function dispendPlayer(pid){
    const el = document.getElementById(pid);
    el.parentNode.removeChild(el)
}

socket.on('connect', () => {
    console.log(socket.id);
})

socket.on('setup', state => {
    game.addPlayer({playerId: socket.id});
    keyboard.registerPlayerId(socket.id);
    game.setState(state);
    document.getElementById('scorediv');
    for(let playerId in game.state.players){
        appendPlayer(playerId);
    }
});

socket.on('update', state => {
    game.setState(state);
})

socket.on('add-client-player', data => {
    if(data != socket.id){
        appendPlayer(data);
    }
})

socket.on('remove-client-player', data => {
    dispendPlayer(data);
})

socket.on('add-score', playerId => {
    document.getElementById(playerId).innerText = `${playerId}: ${game.state.players[playerId].score}`;
})


keyboard.subscribe(game.movePlayer); 
keyboard.subscribe((command) => {
    socket.emit('move-player', command)
})
renderScreen();

function renderScreen () {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    for(let playerId in game.state.players){
        const player = game.state.players[playerId];
        if(playerId == socket.id){
            ctx.fillStyle = 'yellow';
        }else{
            ctx.fillStyle = 'rgba(64, 64, 64, 0.1)'
        }
        ctx.fillRect(player.x, player.y, 1, 1);
    }
    for(let fruitId in game.state.fruits){
        const fruit = game.state.fruits[fruitId];
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(fruit.x, fruit.y, 1, 1);
    }


    requestAnimationFrame(renderScreen);
}
