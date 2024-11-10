const EventEmitter = require('./events');

class Emitter extends EventEmitter {}

const myE = new Emitter();

myE.on('foo',()=>{
    console.log('An event occurred 1');
});

myE.on('foo',()=>{
    console.log('An event occurred 2');
});

myE.on('foo',(event)=>{
    console.log('An event occurred ', event);
});

myE.once('call', () => {
    console.log('one time event');
});


myE.emit('foo')
myE.emit('call')
myE.emit('call')
myE.emit('foo', 'some custom event')

