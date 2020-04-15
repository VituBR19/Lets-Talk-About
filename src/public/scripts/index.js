$(() => {
    localStorage.clear()

    $("#create-room-button").click((event) => {
        localStorage.username = $("#username").val()
        localStorage.roomname = $(".room-name").val()

        joinRoom()
    })

    $('.chat-room').click((e) => {
        if(!$("#username").val()) {
            return alert('You need a NickName!')
        }

        localStorage.username = $("#username").val()
        localStorage.roomname = e.target.id

        joinRoom()
    })

    $('#create').click((e) => {
        transitionDisplay('.action', '.create-room')
    })

    $('#search').click((e) => {
        transitionDisplay('.action', '.search-room')
    })

    $('.back-home').click((e) => {
        transitionDisplay('.search-room', '.action', '.create-room')
    })

    $("#typed-room").keyup((e) => {
        let queryRoom = $("#typed-room").val()
        getRooms(queryRoom)
    })

    getRooms()
})

function postRedirect(room) {
    $.post(`https://localhost:3001/home`, room)
}

function filterRoom(rooms, name) {
    if(rooms.room == name) {
        $('.chat-container').empty()
        console.log(rooms.room)
        addRooms(rooms)
    }
}

function getRooms(name = '') {
    $.get(`https://localhost:3001/messages`, (data) => {
        if(name) {
            data.forEach(rooms => {
                filterRoom(rooms, name)
            })
            return 
        }
        $('.chat-container').empty()

        data.forEach(addRooms)
    })
}

function addRooms(data) {
    if(data.room) {
        $('.chat-container').append(`
            <div class='rooms'>
                <h4>${data.room}</h4>
                <a id='${data.room}' >Join</a>
            </div>
        `)

        return
    }
}

function joinRoom() {
    postRedirect({
        name: localStorage.username,
        room: localStorage.roomname
    })
    location.replace(`https://localhost:3001/room/${localStorage.roomname}`)
}

function transitionDisplay(hide, show, hide2) {
    if(hide2) {
        $(hide2).hide()
    }
    $(hide).hide()
    $(show).fadeIn("slow")
    $(show).css('display', 'flex')
}

var socket = io.connect('https://localhost:3001/')

socket.on('chat', addRooms)   
