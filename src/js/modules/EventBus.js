export default class EventBus {
    constructor() {
        this.events = {}
    }

    $on(event, callback) {
        if (!this.events.hasOwnProperty(event)) {
            this.events[event] = {
                callbacks: [],
            }
        }

        this.events[event].callbacks.push(callback)
    }

    $emit(event, data) {
        if (!this.events.hasOwnProperty(event)) {
            return
        }

        this.events[event].callbacks.forEach((callback) => {
            callback(data)
        })
    }
}