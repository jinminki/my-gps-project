const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;  // 환경 변수에서 포트를 가져옴

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.send('GPS Notification System Server is Running');
});

// 서버 시작
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
