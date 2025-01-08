const fs = require('fs/promises');

(async () => {
    console.time('read big')
    const fileHandlerRead = await fs.open('./text.txt', 'r');
    const fileHandlerWrite = await fs.open('./dest.txt', 'w');

    const streamRead = fileHandlerRead.createReadStream({highWaterMark: 64 * 1024});
    const streamWrite = fileHandlerWrite.createWriteStream();

    let split = '';

    streamRead.on('data', (chunk) => {
        console.log('--------------');
        // console.log(chunk);
        const numbers = chunk.toString('utf-8').split('  ');


        if(Number(numbers[0]) !== Number(numbers[1]) - 1) {
            if(split) {
                numbers[0] = split.trim() + numbers[0].trim();
            }
        }


        if(Number(numbers[numbers.length - 2]) + 1 !== Number(numbers[numbers.length - 1])) {
            split = numbers.pop();
        }
        // console.log('numbers', numbers)
        numbers.forEach((number) => {
            if(number % 2 === 0) {
                // console.log(chunk.length);
                if(!streamWrite.write(' ' + Number(number) + ' ')) {
                    streamRead.pause();
                }
            }
        })


    });

    streamWrite.on('drain', () => {
        streamRead.resume();
    })

    streamRead.on('end', () => {
        console.log('Done reading')
        console.timeEnd('read big')
    })
})();
