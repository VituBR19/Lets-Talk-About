$(() => {
    $('#room-name').text(localStorage.roomname)

    $("#chat").submit((event) => {
        event.preventDefault()

        if($("input[name=message]").val() === '') {
            alert('Type some message')
            return
        }

        sendMessage({
            name: localStorage.username,
            message: $("input[name=message]").val(),
            room: localStorage.roomname,
        })

        $('input[name=message]').val('')

        scrollDown()
    })

    getMessages()
})

function addMessage(message) {
    $('#room-name').val(message.room)

    if(message.message.includes("joined to the room")) {
        console.log('123')
        $('.messages').append(`
            <div class="join">
                <span class="message-content">${message.message}</span>
            </div>
        `)
        scrollDown()
        return
    }

    if(message.name === localStorage.username) {
        $('.messages').append(`
            <div class="message-balloon my-message">
                <span class="message-content">${message.name}</span>
                <span class="message-content">${message.message}</span>
            </div>
        `)
        scrollDown()

        return
    }

    $('.messages').append(`
        <div class="message-balloon room-message">
            <span class="message-content">${message.name}</span>
            <span class="message-content">${message.message}</span>
        </div>
    `)
}

function getMessages() {
    $.get(`https://localhost:3001/messages?room=${localStorage.roomname}`, (data) => {
        data.forEach(addMessage)
    })

    scrollDown()
}

function sendMessage(message){
    $.post('https://localhost:3001/messages', message)
}

var socket = io.connect('https://localhost:3001/')

socket.on('message', (data) => {
    addMessage(data)

    scrollDown()
})   

setTimeout(() => {
    socket.on('chat', addMessage)
}, 4000)

// Makes scroll always be at bottom
function scrollDown() {
    console.log('olameu amigo')
    $(".messages").animate({ scrollTop: $('.messages').height() * $('.messages').height() }, "slow")
}