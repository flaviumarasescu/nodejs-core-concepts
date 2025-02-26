const { Duplex } = require('node:stream');
const fs = require('node:fs');

class DuplexStream extends Duplex {
    constructor({
        writableHighWaterMark,
        readableHighWaterMark,
        readFileName,
        writeFileName,
    }) {
        super({ readableHighWaterMark, writableHighWaterMark });
        this.readFileName = readFileName;
        this.writeFileName = writeFileName;
        this.readFd = null;
        this.writeFd = null;
        this.chunks = [];
        this.chunksSize = 0;
    }

    _construct(callback) {
        fs.open(this.readFileName, 'r', (err, readFd) => {
            if (err) return callback(err);
            this.readFd = readFd;
            fs.open(this.writeFileName, 'w', (err, writeFd) => {
                if (err) return callback(err);
                this.writeFd = writeFd;
                callback();
            });
        });
    }

    _write(chunk, endoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
                if (err) return callback(err);

                this.chunks = [];
                this.chunksSize = 0;
                callback();
            });
        } else {
            callback();
        }
    }

    _read(size) {
        const buff = Buffer.alloc(size);
        fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err);

            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
        });
    }

    _final(callback) {
        fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err);
            this.chunks = [];
            callback();
        });
    }

    _destroy(err, callback) {
        callback(err);
    }
}

const duplex = new DuplexStream({
    readFileName: 'read.txt',
    writeFileName: 'write.txt',
});

duplex.write(Buffer.from('Write text 1'));
duplex.write(Buffer.from('Write text 2'));
duplex.write(Buffer.from('Write text 3'));
duplex.end(Buffer.from('Write text 4'));

duplex.on('data', (chunk) => {
    console.log(chunk.toString('utf-8'));
});
