const { Writable } = require('node:stream');
const fs = require('node:fs');

class FileWriteStream extends Writable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });

        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.writesCount = 0;
    }

    // This will run after the constructor, and it will put off calling all the other
    // methods until we call the callback function
    _construct(callback) {
        fs.open(this.fileName, 'w', (err, fd) => {
            if (err) {
                // if we call the callback with an argument, it means that we have an error
                // and we should not proceed
                callback(err);
            }
            this.fd = fd;
            // no arguments it means it was successful
            callback();
        });
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunksSize = 0;
                ++this.writesCount;
                callback();
            });
        } else {
            // when it's done, call the cb function
            callback();
        }
    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err) {
                return callback(err);
            }

            this.chunks = [];
            callback();
        });
    }

    _destroy(error, callback) {
        console.log('Number of writes: ', this.writesCount);
        if (this.fd) {
            fs.close(this.fd, (err) => {
                callback(err || error);
            });
        } else {
            callback(error);
        }
    }
}

(async () => {
    console.time('Write many');

    const stream = new FileWriteStream({
        // highWaterMark: 1800,
        fileName: 'text.txt',
    });

    let i = 0;
    const numberOfWrites = 10000000;

    const writeMany = () => {
        while (i < numberOfWrites) {
            const buff = Buffer.from(` ${i} `, 'utf-8');

            if (i === numberOfWrites - 1) {
                return stream.end(buff);
            }

            i++;
            if (!stream.write(buff)) {
                break;
            }
        }
    };

    writeMany();

    let drainNr = 0;

    stream.on('drain', () => {
        console.log('Drained - Safe to write more! ');
        ++drainNr;
        writeMany();
    });

    stream.on('finish', () => {
        console.timeEnd('Write many');
        console.log('drainNr', drainNr);
    });
})();
