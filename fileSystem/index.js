const fs = require('fs')

const content = fs.readFileSync('./fileSystem/text.txt')

console.log(content)
console.log(content.toString('utf-8'))
