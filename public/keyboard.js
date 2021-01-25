function createKeyboardListener(){
    const subscribers = [];
    function subscribe(subFunction){
        subscribers.push(subFunction);
    }

    function notifyAll(command){
        for(let func in subscribers){
            subscribers[func](command);
        }
    }

    document.addEventListener('keydown', (event) => {
        notifyAll({key: event.key, playerId: 'player1'})
    })

    return {
        subscribe
    }

}