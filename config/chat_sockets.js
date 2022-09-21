module.exports.chatSockets = function (server) {
  let io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.sockets.on('connection', (socket) => {
    console.log('New connection received', socket.id);

    socket.on('disconnect', function () {
      console.log('socket disconnected');
    });

    socket.on('join_room', function (data) {
      console.log('joining request rec.', data);

      socket.join(data.chatroom);

      io.in(data.chatroom).emit('user_joined', data);
    });

    //* detect send_message and broadcast to everyone in the room
    socket.on('send_message', function (data) {
      io.in(data.chatroom).emit('receive_message', data);
    });
  });
};
