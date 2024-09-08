const express = require('express');
const cors = require('cors');  // CORS 패키지 추가
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// CORS 설정
app.use(cors({
    origin: 'https://66dd766a4a655e7a7077348d--songjintest.netlify.app',  // 클라이언트 URL 허용
    methods: ['GET', 'POST'],
    credentials: true
}));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('GPS Notification System Server is Running');
});

app.post('/send-location', (req, res) => {
    const { lat, lon } = req.body;
    io.emit('notification', '출입 금지 구역에 진입했습니다!');
    res.sendStatus(200);
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});