const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://songjintest.netlify.app", // Netlify에서 배포한 클라이언트 URL
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

app.use(express.json());  // JSON 요청을 처리하기 위해 추가

// 포트 설정 (환경 변수에서 가져오거나 기본 5000번 사용)
const port = process.env.PORT || 5000;

// 클라이언트에서 출입금지구역 좌표를 받아서 저장하는 API 경로
app.post('/save-restricted-area', (req, res) => {
    const coordinates = req.body.coordinates;

    if (coordinates && Array.isArray(coordinates)) {
        console.log('Received coordinates:', coordinates);
        // 좌표를 처리하는 로직 (필요 시 데이터베이스 저장 등)
        res.status(200).json({ message: 'Coordinates saved successfully' });
    } else {
        console.error('Invalid coordinates:', req.body);
        res.status(400).json({ message: 'Invalid coordinates' });
    }
});

// 클라이언트에서 위치 데이터를 전송받고 알림을 보내는 API 경로
app.post('/send-location', (req, res) => {
    const { lat, lon } = req.body;
    
    // 위치 데이터가 유효한지 확인
    if (lat && lon) {
        console.log(`Received location: Latitude ${lat}, Longitude ${lon}`);
        io.emit('notification', `GPS 위치: 위도 ${lat}, 경도 ${lon}`);
        res.status(200).send({ message: 'Location received and notification sent' });
    } else {
        console.error('Invalid location data received:', req.body);
        res.status(400).send({ message: 'Invalid location data' });
    }
});

// 기본 경로 라우트 (테스트 용도)
app.get('/', (req, res) => {
    res.send('GPS Notification System Server is Running');
});

// 서버 실행
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
