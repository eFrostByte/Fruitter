function createGame(scr){
    const state = {
        players:{
            'player1': {x:1, y:3},
            'player2': {x:3, y:1},
            'player3': {x:9, y:9},
        },
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