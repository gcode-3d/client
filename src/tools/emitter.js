import EventEmitter from "events";
const eventEmitter = new EventEmitter();

export default {
  on: (event, fn) => eventEmitter.on(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  emit: (event, payload) => eventEmitter.emit(event, payload),
  removeListener: (event, fn) => eventEmitter.removeListener(event, fn),
};
