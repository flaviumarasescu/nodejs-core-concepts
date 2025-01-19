const fs = require('node:fs/promises');
const { pipeline } = require('node:stream');

// Custom streaming solution using Buffers
// 153.591ms
// Not efficient
//
// (async () => {
//     console.time('copy not efficient')
//     const destFile = await fs.open('text-copy.txt', 'w');
//     const result = await fs.readFile('text.txt');
//
//     await destFile.write(result)
//
//     console.timeEnd('copy not efficient')
// })();


// 444.455ms
// Efficient memory usage
// (async () => {
//     console.time('copy');
//     const srcFile = await fs.open('text.txt', 'r');
//     const destFile = await fs.open('text-copy.txt', 'w');
//
//     let bytesRead = -1;
//
//     while(bytesRead !== 0) {
//         const readResult = await srcFile.read();
//         // console.log('readResult', readResult);
//         // console.log('readResult.buffer', readResult.buffer[16300])
//
//         bytesRead = readResult.bytesRead;
//
//         if(bytesRead !== 16384) {
//             const indexOfNotFilled = readResult.buffer.indexOf(0);
//             const newBuffer = Buffer.alloc(indexOfNotFilled);
//             readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//             destFile.write(newBuffer);
//         } else {
//
//             destFile.write(readResult.buffer);
//         }
//     }
//
//     console.timeEnd('copy');
//
// })();


// 319.121ms
(async () => {
    console.time('copy');
    const srcFile = await fs.open('text.txt', 'r');
    const destFile = await fs.open('text-copy.txt', 'w');

    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    // readStream.pipe(writeStream);

    pipeline(readStream, writeStream, (err) => {
        console.log(err);
        console.timeEnd('copy');

    });

    // readStream.on('end', () => {
    //     console.timeEnd('copy');
    //
    // })


})();
