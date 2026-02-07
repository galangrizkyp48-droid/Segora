type EventCallback = (data?: any) => void;

class EventBus {
    private events: Map<string, EventCallback[]> = new Map();

    emit(event: string, data?: any) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }

    on(event: string, callback: EventCallback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);
    }

    off(event: string, callback: EventCallback) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            this.events.set(event, callbacks.filter(cb => cb !== callback));
        }
    }
}

export const eventBus = new EventBus();
