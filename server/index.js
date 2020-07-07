const express = require('express');
const cors = require('cors')
const uniqid = require('uniqid')
const app = express();
const port = 3000;
const messages = [
  {id: uniqid(), author: 'server', text: 'welcome to WildChat'}
]

app.use(cors());

const server = app.listen(port, () => 
  console.log(`app listening at http://localhost:${port}`)
);
  
const io = require('socket.io').listen(server)

io.on('connect', (socket) => {
    console.log('user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.emit('initialMessageList', messages);

    // Receiving message from client
    socket.on('newMessageFromClient', (messageTextAndAuthor) => {
        const newMessage = {id: uniqid(), ...messageTextAndAuthor}
        console.log('new message from a client: ', newMessage)
        messages.push(newMessage);
        // Sending to all clients
        io.emit('message from server', newMessage);
      })
  });


  