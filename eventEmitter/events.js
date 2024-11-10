module.exports = class EventEmitter {
    lsdm = {}

    addListener(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || []
        this.listeners[eventName].push(fn);
        return this;
    }

    on(eventName, fn) {
        return this.addListener(eventName, fn);
    }


    emit(eventName, ...args) {
        const fns = this.listeners[eventName]
        if(!fns) return
        fns.forEach((fn) =>{
            fn(...args)
        })
        return true
    }

    once(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || []
        const eventWrapper = () => {
            fn()
            this.off(eventName, eventWrapper)
        }
        this.listeners[eventName].push(eventWrapper);
        return this
    }

    off(eventName, fn) {
        return this.removeListener(eventName, fn)
    }

    removeListener(eventName, fn) {
        const fns = this.listeners[eventName]
        if(!fns) return this
        for( let i = fns.length; i >= 0 ; i--) {
            if(fns[i] === fn) {
                fns.splice(i, 1)
                break
            }
        }
        return this
    }

    listenerCount(eventName) {
        const fns = this.listeners[eventName] || []
        return fns.length
    }

    rawListeners(eventName) {
        return this.listeners[eventName];
    }

}
