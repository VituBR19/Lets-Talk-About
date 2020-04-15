const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

const connection = require('./database/connection.js')

const app = express()

const http = require('http').createServer(app)
const io = require('socket.io').listen(http)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

/**
 * O bloco abaixo permite a utilização do HTML com node.
 */
app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, '/public'))
app.set('view engine', 'html')

io.on('connection', (socket) => {
    console.log(`usuario ${socket.id}`)
})

app.get('/room/:roomId', (req, res) => {
    res.sendFile(__dirname + '/public/room/room.html')
})

app.get('/home', async (req, res) => {
    const messages = await connection('chat').select('*')
    return res.json(messages)
})

app.post('/home', async (req, res) => {
    const {name, room} = req.body

    const newRoom = {
        name,
        message: `${name} joined to the room`,
        room,
    }
    await connection('chat').insert(newRoom)
    io.emit('chat', newRoom)

    return res.redirect(301, `/room/${room}`)
})

app.get('/messages', async (req, res) => {
    if(req.query.room) {
        const messages = await connection('chat')
          .select('*')
          .where('room', req.query.room)

        return res.json(messages)
    }

    const rooms = await connection('chat')
      .select('room')
      .groupBy('room')

    return res.json(rooms)
})

app.post('/messages', async (req, res) => {
    const {name, message, room} = req.body

    await connection('chat').insert({
        name,
        message,
        room,
    })
    io.emit('message', req.body)
    return res.json({log: 'Message sent'})
})

var server = http.listen(3001, () => {
    console.log('server is running on port', server.address().port)
  })