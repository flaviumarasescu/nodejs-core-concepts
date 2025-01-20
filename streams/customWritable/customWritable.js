const { Writable } = require('node:stream');
const fs = require('node:fs');

class FileWriteStream extends Writable {
    constructor({highWaterMark, fileName}) {
        super({ highWaterMark });

        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.writesCount = 0;
    }


    // This will run after the constructor, and it will put off calling all the other
    // methods until we call the callback function
    _construct (callback) {
        fs.open(this.fileName, 'w', (err, fd) => {
            if(err) {
                // if we call the callback with an argument, it means that we have an error
                // and we should not proceed
                callback(err);
            }
            this.fd = fd;
            // no arguments it means it was successful
            callback();

        })
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        if(this.chunksSize > this.writableHighWaterMark) {
           fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
               if(err) {
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

    }
}

const stream = new FileWriteStream({ highWaterMark: 3, fileName: 'text.txt' });
stream.write(Buffer.from('this is some string', 'utf-8'));
// stream.end(Buffer.from('The last write', 'utf-8'));
//
// stream.on('drain', ()=>{
//
// })
