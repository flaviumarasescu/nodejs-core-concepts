const fs = require('fs/promises');

// open (32) file descriptor

(async () => {
    const CREATE_FILE = 'create a file';
    const DELETE_FILE = 'delete the file';
    const RENAME_FILE = 'rename the file';
    const ADD_TO_FILE = 'add to the file';


    const createFile = async (path) => {
        // fs.appendFile(path, 'New content', (error) =>{
        //     console.error('err:', error)
        // })
        try {
            const existingFileHandle = await fs.open(path, 'r');
            existingFileHandle?.close();
            console.log(`The file ${path} already exists.`);
            return;
        } catch (e) {
            if (e.code === 'ENOENT') {
                const newFileHandler = await fs.open(path, 'w');
                console.log('New file created');
                newFileHandler.close();
            } else {
                console.error('Create file error:', e)
            }

        }
    }

    const deleteFile = async (path) => {
        try {
            await fs.unlink(path);
            console.log(`Successfully deleted ${path}.`);
            return;
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.log('No file at this path to remove.')
            } else {
                console.log('Delete error:', e);
            }
        }
    }

    const renameFile = async (oldPath, newPath) => {
        try {
            await fs.rename(oldPath, newPath)
            console.log('File renamed')
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.log('No file at this path to rename.')
            } else {
                console.error('Rename error', e)
            }
        }
    }

    let addedContent;

    const addToFile = async (path, content) => {
        if (addedContent === content) return;
        addedContent = content
        try {
            const fileHandler = await fs.open(path, 'a');
            fileHandler.write(content);
            fileHandler.close()
        } catch (e) {
            console.error('Add to file error', e);
        }
    }


    const commandFileHandler = await fs.open('./command.txt', 'r');

    commandFileHandler.on('change', async () => {
        const size = (await commandFileHandler.stat()).size;

        const buff = Buffer.alloc(size);

        const offset = 0;
        const length = buff.byteLength;
        const position = 0;

        await commandFileHandler.read(
            buff,
            offset,
            length,
            position
        );

        const command = buff.toString('utf-8');

        // add a file:
        // add the file <path>
        if (command.includes(CREATE_FILE)) {
           const filePath = command.substring(CREATE_FILE.length + 1);
           const filePathFormatted = filePath.trim()
           createFile(filePathFormatted);
        }

        // delete a file:
        // delete the file <path>
        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1);
            const filePathFormatted = filePath.trim()
            deleteFile(filePathFormatted)
        }

        // rename file:
        // rename the file <path> to <new-path>
        if (command.includes(RENAME_FILE)) {
            const _idx = command.indexOf(' to ')
            const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
            const newFilePath = command.substring(_idx + 4);
            const newFilePathFormatted = newFilePath.trim();
            renameFile(oldFilePath, newFilePathFormatted);
        }

        // add to file:
        // add to the file <path> this content: <content>
        if (command.includes(ADD_TO_FILE)) {
            const _idx = command.indexOf(' this content: ');
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
            const content = command.substring(_idx + 15);
            addToFile(filePath, content)
        }
    })

    const watcher = fs.watch('./command.txt');

    for await (const event of watcher) {
        if (event.eventType === 'change'){
            commandFileHandler.emit('change')
        }
    }

    commandFileHandler.close()
})();
