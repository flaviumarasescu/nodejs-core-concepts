const fs = require('fs')

const content = fs.readFileSync('./fileSystem/src.txt')

console.log(content)
console.log(content.toString('utf-8'))
