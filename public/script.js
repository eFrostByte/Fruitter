const socket = io('http://192.168.15.24:3000');
const scr = document.getElementById('scr');
const ctx = scr.getContext('2d');
const WIDTH = scr.width;
const HEIGHT = scr.height;
const game = createGame(scr);
const keyboard = createKeyboardListener();

keyboard.subscribe(game.movePlayer);
renderScreen();

function renderScreen () {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'black'
    for(let playerId in game.state.players){
        const player = game.state.players[playerId];
        ctx.fillRect(player.x, player.y, 1, 1);
    }


    requestAnimationFrame(renderScreen);
}
