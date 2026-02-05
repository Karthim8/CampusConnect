const socketIO = require('socket.io');

const initSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    const users = new Map(); // userId -> socketId

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join', (userId) => {
            users.set(userId, socket.id);
            io.emit('userStatus', Array.from(users.keys())); // Send online users list
        });

        socket.on('sendMessage', ({ senderId, receiverId, content }) => {
            const receiverSocketId = users.get(receiverId);
            const message = { senderId, content, timestamp: new Date() };

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receiveMessage', message);
            }
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }
            io.emit('userStatus', Array.from(users.keys()));
            console.log('User disconnected');
        });
    });

    return io;
};

module.exports = initSocket;
