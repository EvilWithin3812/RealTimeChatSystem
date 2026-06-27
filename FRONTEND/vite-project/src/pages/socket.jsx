
import {io} from 'socket.io-client';

const socket = io(window.location.origin, {
    transports: ["websocket"], // Avoids polling issues
    withCredentials: true // Ensures proper CORS handling
});


export default socket;
