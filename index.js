// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import AuthRoutes from './rotues/Auth.js'; // Update folder name if needed (e.g., './routes/Auth.js')
import DbCon from './utils/db.js';
import MessageRoutes from './rotues/Messages.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();

// Database connection
DbCon();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use('/api/Auth', AuthRoutes);
app.use('/api/messages', MessageRoutes);

if (NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, './Frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './Frontend/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Create HTTP Server
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*', // Update with your frontend domain for production
    methods: ['GET', 'POST'],
  },
});

let users = [];
const Addusers = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const ReomveUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const GetUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('AddUserSocket', (userId) => {
    console.log('userid', userId);
    Addusers(userId, socket.id);
    io.emit('getUsers', users);
    console.log('usersfromscoket', users);
  });

  socket.on('sendMessage', (data) => {
    const { senderId, receiverId, message } = data.messagedata;
    console.log('revierId', receiverId);
    const user = GetUser(receiverId);
    console.log('senderUser', user);
    if (user?.socketId) {
      io.to(user.socketId).emit('receiveMessage', {
        userId: senderId,
        message,
      });
    } else {
      console.log('Receiver not connected');
    }
    console.log('messagedata', data);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    ReomveUser(socket.id);
    io.emit('getUsers', users);
    console.log(users);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});
