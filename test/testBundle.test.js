import test from 'ava'
// import mock from 'mock-fs'
// const Menelaus = require('./src/index')

const mock = require('mock-fs');
const fs = require('fs')

test('bundle', async(t) => {
    mock({
        'path/to/fake': {
            'some-file.txt': 'file content here',
            'config.js': 'module.exports={}'
        },
        'path/to/fake/source': {
            '/post.html': '{{centent}}',
            '/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
        },
        'path/to/fake/post': {
            'a.md': "> here is a simple test"
        },
        'path/to/fake/index.txt': 'hhhh'
    });
    

    // const menelaus =  new Menelaus({bundle: false, workDirectory: '/path/to/fake', globalContext: {}, postFloder: 'post', destFloder: 'dist', themeFloder: 'source', postTemplateFilename: 'post.html'})

    // await menelaus.bundle()

    console.log(fs.readFileSync('path/to/fake/index.txt').toString('utf-8'))
    t.pass()
})