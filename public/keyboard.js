function createKeyboardListener(cId){
    console.log(cId);
    const subscribers = [];
    function subscribe(subFunction){
        subscribers.push(subFunction);
    }

    function notifyAll(command){
        for(let func in subscribers){
            subscribers[func](command);
            console.log(command);
        }
    }

    document.addEventListener('keydown', (event) => {
        notifyAll({key: event.key, playerId: cId})
    })

    return {
        subscribe
    }

}