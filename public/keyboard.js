function createKeyboardListener(document){
    const state = {
        subscribers: [],
        playerId: null
    }

    function registerPlayerId(id){
        state.playerId = id;
    }

    function subscribe(subFunction){
        state.subscribers.push(subFunction);
    }

    function notifyAll(command){
        for(let func in state.subscribers){
            state.subscribers[func](command);
        }
    }

    document.addEventListener('keydown', (event) => {
        notifyAll({key: event.key, playerId: state.playerId})
    })

    return {
        subscribe,
        registerPlayerId
    }

}