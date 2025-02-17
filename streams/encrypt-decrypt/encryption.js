const { Transform } = require('node:stream');
const fs = require('node:fs/promises');

class Encrypt extends Transform {
    constructor(fileSize) {
        super();
        this.totalBytesRead = 0;
        this.fnCallCount = 0;
        this.totalFileSize = fileSize;
    }

    _transform(chunk, encoding, callback) {
        ++this.fnCallCount;
        this.totalBytesRead += chunk.length;
        console.log('this.fnCallCount', this.fnCallCount);

        if (this.fnCallCount % 2 === 0) {
            const percentage = (this.totalBytesRead / this.totalFileSize) * 100;
            console.log(`Encryption ${percentage}% completed`);
        }
        for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] !== 255) {
                chunk[i] += 1;
            }
        }

        callback(null, chunk);
    }
}

(async () => {
    const readFileHandle = await fs.open('read.txt', 'r');

    const writeFileHandle = await fs.open('write.txt', 'w');

    // file size

    const fileSize = (await readFileHandle.stat('read.txt')).size;

    console.log('file size', fileSize);

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const encrypt = new Encrypt(fileSize);

    readStream.pipe(encrypt).pipe(writeStream);
})();
