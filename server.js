const express = require('express');
const cors = require('cors');  // CORS 미들웨어 추가
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://shiny-genie-6484c8.netlify.app",  // 최신 Netlify URL 추가
        methods: ["GET", "POST"],
        credentials: true
    }
});

// CORS 설정
app.use(cors({
    origin: 'https://shiny-genie-6484c8.netlify.app',  // Netlify URL로 변경
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());  // JSON 요청을 처리하기 위해 추가

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('GPS Notification System Server is Running');
});

// 위치 정보 받는 라우트
app.post('/send-location', (req, res) => {
    const { lat, lon } = req.body;
    console.log('Location data received:', lat, lon);  // 요청 데이터 출력
    if (lat && lon) {
        io.emit('notification', '출입 금지 구역에 진입했습니다!');
        res.status(200).send('Location received');
    } else {
        res.status(400).send('Invalid location data');
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
