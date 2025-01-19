// const fs = require('fs/promises');

// Write many: 961.776ms
//
// ( async () => {
//     console.time('Write many')
//
//     const fileHandler = await fs.open('./src.txt', 'w')
//
//     for( let i = 0; i< 100000; i++) {
//         try {
//             await fileHandler.write(` ${i} `)
//         } catch (e) {
//             console.error('add to file err', e)
//         }
//     }
//     console.timeEnd('Write many')
// })()



// writeMany: 450.72ms
// const fs = require('node:fs');
//
// (async  () => {
//     console.time('writeMany');
//     fs.open('test.txt', 'w', (err, fd) => {
//         for (let i = 0; i < 100000; i++) {
//             const buff = Buffer.from(` ${i} `, 'utf-8')
//             fs.writeSync(fd, ` ${i} `);
//         }
//
//         console.timeEnd('writeMany');
//
//     });
// })();


// const fs = require('fs/promises');
//
// // Write many: 961.776ms
//
// ( async () => {
//     console.time('Write many')
//     const fileHandler = await fs.open('./src.txt', 'w')
//
//     const stream = fileHandler.createWriteStream()
//
//     for( let i = 0; i< 100000; i++) {
//         try {
//             const buff = Buffer.from(` ${i} `, 'utf-8')
//             stream.write(buff)
//         } catch (e) {
//             console.error('add to file err', e)
//         }
//     }
//     console.timeEnd('Write many')
//     fileHandler.close();
// })()



const fs = require('fs/promises');

// Write many: 525.545ms

( async () => {
    console.time('Write many')
    const fileHandler = await fs.open('./text.txt', 'w')

    const stream = fileHandler.createWriteStream()
    console.log(stream.writableHighWaterMark)

    // const buff = Buffer.alloc(16383, 'a')
    // console.log(stream.write(buff))
    // console.log(stream.write(Buffer.alloc(1, 10)))
    // console.log(stream.write(Buffer.alloc(1, 10)))
    // console.log(stream.write(Buffer.alloc(1, 10)))

    // console.log(stream.writableLength);


    // stream.on('drain', () => {
    //     console.log(stream.write(Buffer.alloc(1, 10)))
    //     console.log(stream.writableLength);
    //
    //
    //     console.log('Safe to write more! ')
    // })

    let i = 0;
    const numberOfWrites = 10000000;

    const writeMany = () => {
        while ( i < numberOfWrites) {
            const buff = Buffer.from(` ${i} `, 'utf-8')

            if(i === numberOfWrites - 1) {
                return stream.end(buff);
            }

            i++;
            if(!stream.write(buff)) {
                break;
            }
        }
    }

    writeMany();

    stream.on('drain', () => {
        console.log('Drained - Safe to write more! ')
        writeMany();
    })

    stream.on('finish', () => {
        console.timeEnd('Write many');
        fileHandler.close();
    })
})()
