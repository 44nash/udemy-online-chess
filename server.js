const express = require('express');
const dotenv = require('dotenv');
const db = require("./config/db");
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser')
const {redisClient} = require("./config/redis")

const {newUser, removeUser} = require('./util/user')

dotenv.config();
// Routers
const viewRoutes = require('./routes/views')
const userRoutes = require('./routes/api/user')

const app = express()

const server = http.createServer(app)

db.connect((err) => {
    if(err){
        console.log(err);
        process.exit(1)
    }
    console.log("Connected to MySQL Database....")
})

app.use(cookieParser('secret'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', viewRoutes)
app.use('/api', userRoutes)

const io = socketIO(server);

io.on('connection', (socket) => {
    socket.on('user-connected', (user, roomId=null) => {
        if(roomId){
            //TODO: Join with room ID
        }else{
            newUser(socket.id, user);
        }
    })
    socket.on('send-total-rooms-and-users', () => {
        redisClient.get('total-users', (err, reply) => {  // <--- Never excutes the code Lesson 17
            if(err) throw err; 

            let totalUsers = 0;
            let totalRooms = 0;
            let numberOfRooms = [0, 0, 0, 0];

            if(reply){
                totalUsers = parseInt(reply);
            }

            redisClient.get('total-rooms', (err, reply) => {
                if(err) throw err;

                if(reply){
                    totalRooms = parseInt(reply);
                }

                redisClient.get('number-of-rooms', (err, reply) => {
                    if(err) throw err;

                    if(reply){
                        numberOfRooms = JSON.parse(reply);
                    }

                    socket.emit("receive-number-of-rooms-and-users", numberOfRooms, totalRooms, totalUsers);
                })
            })
        });
    });

    socket.on('disconnect', () => {
        let socketId = socket.id;

        redisClient.get(socketId, (err, reply) => {
            if(err) throw err;

            if(reply){
                let user = JSON.parse(reply);

                if(user.room){
                    //TODO: Remove user's room and also remove user from the room
                }
            }
        })
        
        removeUser(socketId);
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))