const { Buffer } = require('buffer')

const memoryContainer = Buffer.alloc(4) // 4 bytes (32 bites)

memoryContainer[0] = 0xf4;
memoryContainer[1] = 0x00;
// memoryContainer.writeInt8(-34, 1);
memoryContainer[2] = 0x34;
memoryContainer[3] = 0xff;


console.log('', memoryContainer)
console.log('', memoryContainer[0])
console.log('', memoryContainer[1])
// console.log(memoryContainer.readInt8(1))
console.log('', memoryContainer[2])
console.log('', memoryContainer[3])

console.log('', memoryContainer.toString('hex'))
