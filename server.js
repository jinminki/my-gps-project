const express = require('express');
const cors = require('cors');  // CORS 미들웨어 추가
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// CORS 설정: 최신 Netlify URL 추가
app.use(cors({
    origin: '*',  // 모든 도메인에서 접근 허용
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
