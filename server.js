const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const pointInPolygon = require('point-in-polygon');  // 다각형 내 위치 확인용

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://songjintest.netlify.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// CORS 설정
app.use(cors({
    origin: 'https://songjintest.netlify.app',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

const port = process.env.PORT || 3000;

// 출입 금지 구역 좌표 설정
const restrictedArea = [
    { lat: 35.9470822, lng: 126.6853641 }, // 좌표 1
    { lat: 35.9467586, lng: 126.6854137 }, // 좌표 2
    { lat: 35.9467934, lng: 126.6856927 }, // 좌표 3
    { lat: 35.9471093, lng: 126.6856364 }, // 좌표 4
    { lat: 35.9470822, lng: 126.6853641 }  // 좌표 5
];

// 서버에서 위치 정보를 수신하고 출입 금지 구역 여부를 확인
app.post('/send-location', (req, res) => {
    const { lat, lon } = req.body;
    
    // 좌표가 출입 금지 구역에 포함되는지 확인
    const isInRestrictedArea = pointInPolygon([lat, lon], restrictedArea.map(p => [p.lat, p.lng]));
    
    if (isInRestrictedArea) {
        io.emit('notification', '출입 금지 구역에 진입했습니다!');
        res.status(200).send('Entered restricted area');
    } else {
        res.status(200).send('Location received');
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
