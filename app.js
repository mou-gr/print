var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
const pdf = require('./print')

var app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({
    extended: true
}))
const jsonLookUpFolder = `jsonLookUp/`

app.post('/pdf', function (req, res) {
    console.time('request ' + req.body.contractActivityId)
    pdf.createDoc(req.body.contractActivityId, req.body.wizard, jsonLookUpFolder, req.body.type)
        .then( binary => {
            res.contentType('application/pdf')
            binary.pipe(res)
            console.timeEnd('request ' + req.body.contractActivityId)
            // 'created pdf for activity: ' + req.body.contractActivityId)
        })
        .catch(error => {
            res.send('error:' + error)
            console.log('activity: ' + req.body.contractActivityId, error)
            process.exit(-1)
        })
})

var server = http.createServer(app)
var port = process.env.PORT || 1234
server.listen(port)

console.log('http server listening on %d', port)
