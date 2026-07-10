import { EventEmitter } from 'events';
import { EventType, AppEventPayload } from './types.js';

class AppEventEmitter extends EventEmitter {
  emit(event: EventType, payload: AppEventPayload): boolean {
    return super.emit(event, payload);
  }

  on(event: EventType, listener: (payload: AppEventPayload) => void): this {
    return super.on(event, listener);
  }

  off(event: EventType, listener: (payload: AppEventPayload) => void): this {
    return super.off(event, listener);
  }

  once(event: EventType, listener: (payload: AppEventPayload) => void): this {
    return super.once(event, listener);
  }
}

export const appEventEmitter = new AppEventEmitter();
