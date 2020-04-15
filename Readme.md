## Real time chat
This project is a study about how chat works and how can I deploy an app. I chose learn it with node, because I want to practice more this tech.

## SQL Data Base
I chose this database because I have more practice with this db. 
To start work with this db on Node, I had to install a query builder called knex. A query builder will do the commons SQL querys like 'SELECT', 'INSERT', be more dynamic.
- To install Knex, run `npm install knex`.
- Install sqlite3 to handle sql, run `npm install sqlite3`.

To create the connection config with db I had to run `npx knex init`. I did not use npm because I didnt want to manage any pack, I just wanted to open a file, so I did npx. It will create a file on root, that will contain all informations about connection on puduction, local and pre-production environment.

Knex has a feature called Migrations, it creates the tables and history of changes, like a version control. So into my Knex.js I will say "Hey development env. when you create some migration, please create it into my migrations folder" or JSON language:
    
    development: {
        client: 'sqlite3',
            connection: {
                filename: './dev.sqlite3'
        },
            migrations: {
            directory: './src/database/migrations'
        }
        useNullAsDefault: true, (this is to the default value always be null)
    },

- Run `npx knex migrate:make create_name`.
- For the chat I chose "message" to be the table's name.

So finally, to create a table, go to the migration file, into `Up` function that has knex as param, I have to code `return knex.schema.createTable('message', function(table) {...})`. It will create a table, and inside this param function I can create the fields using 

- `table.string('id').primary()` to create a primary key field.
- `table.string('name').notNullable()` to create a name field that can't be null
- `table.string('message').notNullable()` to create a message field that can't be null
- `table.string('room').notNullable()` to create a room field that can't be null
- And run `npx knex migrate:latest` to execute migration

If you did some mistake when create a migration, into the `Down` function just code `return knex.schema.dropTable('message')` to delete the table and run `npx knex migrate:down` to execute `Down` function.

So in my database folder, inside src folder, I created a connection.js to handle sql connection. First I needed require knex, and the db config that is into knexfile.js

``
    const knex = require('knex');
    const config = require('../../knexfile.js');
    const connection = knex(config.development);
``


## Server side

To the server side (`server.js`) I've required express, path, http, cors, socket.io and body-parser, don't worry about instalation you can just run `npm install` to install all of them. First of all, what are all that dependencies?

- Express is designed for building web applications and APIs.
- Path provides utilities for working with file and directory paths.
- HTTP designed to support many features of the protocol which have been traditionally difficult to use.
- Socket.io enables real-time, bidirectional and event-based communication.
- Body-Parser parses incoming request bodies in a middleware before your handlers.

My server.js serve a static html file, using `express.static(path.join(__dirname, 'public'))`, it serves the file into the public folder in the same directory of server.js.

Create routes:

- A route to create a room using POST protocol.
- A route to get the message using GET protocol.
- A route to insert message using POST protocol.

And finally I put the http server to listen the 3001 port. 

The socket.io listen when a user is online through `io.on('connection', function)`, so all the time a client access the url server, socket.io listen to the connection and execute the function param, and the most important all the time a cliente make a post request, it emits a kind of message containing the body request (name, message).

## Client side

To the client side I used jquery and socket.io cdn. 
Build a form with an input for name, input for message and a div to shows all messages sent. For the scripts always the cliente side is loaded it connects with socket.io and gets the message from server and shows off into the div. Always the form is submited it calls the post request and send the data to server. Socket.io connects to the server all the time searching for new messages and bring it to the div. 

### Demo

I used Heroku to deploy the app, because it's simple and fast.

 - [Lets Talk about!](http://lets-talk-about.herokuapp.com/)
