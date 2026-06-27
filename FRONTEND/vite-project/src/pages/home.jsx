import { useCallback, useEffect, useRef, useState } from 'react';
import LEFTPART from '../components/home/LEFTPART';
import Navbar from '../components/navbar/navbar';
import axios from 'axios';
import ChatWindow from '../components/home/RIGHTPART';
import socket from './socket';

import './home.css';

const stopStream = (stream) => {
    stream?.getTracks().forEach((track) => track.stop());
};

const HomePage = ({ darkMode, setDarkMode }) => {
    const normalizeId = (value) => {
        if (!value) {
            return '';
        }

        return typeof value === 'object' ? value._id : value;
    };

    const [isopen, setisopen] = useState(true);
    const [selectedUser, setselectedUser] = useState({});
    const [loginuser, setloginuser] = useState({});
    const [allusers, setallusers] = useState([]);
    const [message, setmessage] = useState([]);
    const [onlineusers, setonlineusers] = useState([]);
    const [incomingCall, setIncomingCall] = useState(null);
    const [activeCall, setActiveCall] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callStatus, setCallStatus] = useState('');
    const [callStartedAt, setCallStartedAt] = useState(null);
    const [callDuration, setCallDuration] = useState(0);
    const peerRef = useRef(null);
    const activeCallRef = useRef(null);

    const resetCall = useCallback(() => {
        peerRef.current?.close();
        peerRef.current = null;
        stopStream(localStream);
        setLocalStream(null);
        setRemoteStream(null);
        setActiveCall(null);
        activeCallRef.current = null;
        setCallStartedAt(null);
        setCallDuration(0);
        setCallStatus('');
    }, [localStream]);

    const getCallMedia = async (withVideo) => navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo,
    });

    const createPeer = (targetUserId) => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { to: targetUserId, candidate: event.candidate });
            }
        };

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        peer.onconnectionstatechange = () => {
            if (['disconnected', 'failed', 'closed'].includes(peer.connectionState)) {
                resetCall();
            }
        };

        peerRef.current = peer;
        return peer;
    };

    const startCall = async (type) => {
        if (!selectedUser?._id || !loginuser?._id) {
            return;
        }

        try {
            const withVideo = type === 'video';
            const stream = await getCallMedia(withVideo);
            const peer = createPeer(selectedUser._id);
            stream.getTracks().forEach((track) => peer.addTrack(track, stream));
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            const call = { user: selectedUser, type, direction: 'outgoing', phase: 'ringing' };
            setLocalStream(stream);
            setActiveCall(call);
            activeCallRef.current = call;
            setCallStartedAt(null);
            setCallDuration(0);
            setCallStatus(`Calling ${selectedUser.username}...`);
            socket.emit('call-user', {
                to: selectedUser._id,
                from: loginuser,
                offer,
                type,
            });
        } catch (err) {
            console.error(err);
            setCallStatus('Camera or microphone permission was denied.');
            setTimeout(() => setCallStatus(''), 3500);
        }
    };

    const acceptCall = async () => {
        if (!incomingCall || !loginuser?._id) {
            return;
        }

        try {
            const withVideo = incomingCall.type === 'video';
            const stream = await getCallMedia(withVideo);
            const peer = createPeer(incomingCall.from._id);
            stream.getTracks().forEach((track) => peer.addTrack(track, stream));
            await peer.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            const call = { user: incomingCall.from, type: incomingCall.type, direction: 'incoming', phase: 'connected' };
            setLocalStream(stream);
            setActiveCall(call);
            activeCallRef.current = call;
            setIncomingCall(null);
            setCallStartedAt(Date.now());
            setCallStatus(`Connected with ${incomingCall.from.username}`);
            socket.emit('answer-call', {
                to: incomingCall.from._id,
                from: loginuser,
                answer,
            });
        } catch (err) {
            console.error(err);
            setCallStatus('Could not start camera or microphone.');
            setTimeout(() => setCallStatus(''), 3500);
        }
    };

    const rejectCall = () => {
        if (incomingCall?.from?._id) {
            socket.emit('reject-call', { to: incomingCall.from._id });
        }
        setIncomingCall(null);
    };

    const endCall = () => {
        const targetUserId = activeCallRef.current?.user?._id || incomingCall?.from?._id;
        if (targetUserId) {
            socket.emit('end-call', { to: targetUserId });
        }
        setIncomingCall(null);
        resetCall();
    };

    useEffect(() => {
        if (!callStartedAt) {
            setCallDuration(0);
            return undefined;
        }

        const updateDuration = () => {
            setCallDuration(Math.floor((Date.now() - callStartedAt) / 1000));
        };
        updateDuration();
        const timer = setInterval(updateDuration, 1000);

        return () => clearInterval(timer);
    }, [callStartedAt]);

    useEffect(() => {
        axios.get('/api/user/getuser')
            .then((r) => {
                setloginuser(r.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (loginuser._id) {
            socket.emit('user-connected', loginuser._id);
        }
    }, [loginuser]);

    useEffect(() => {
        const handleUpdateUsers = (updatedUsers) => {
            setonlineusers(Object.keys(updatedUsers));
        };

        socket.on('update-users', handleUpdateUsers);

        return () => {
            socket.off('update-users', handleUpdateUsers);
        };
    }, []);

    useEffect(() => {
        const handleIncomingCall = (call) => {
            setIncomingCall(call);
            setCallStatus(`${call.from.username} is calling...`);
        };

        const handleCallAccepted = async ({ answer }) => {
            if (peerRef.current) {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                const connectedCall = activeCallRef.current
                    ? { ...activeCallRef.current, phase: 'connected' }
                    : null;
                if (connectedCall) {
                    setActiveCall(connectedCall);
                    activeCallRef.current = connectedCall;
                }
                setCallStartedAt(Date.now());
                setCallStatus(`Connected with ${activeCallRef.current?.user?.username || 'caller'}`);
            }
        };

        const handleIceCandidate = async ({ candidate }) => {
            if (peerRef.current && candidate) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        };

        const handleCallEnded = () => {
            resetCall();
        };

        const handleCallRejected = () => {
            resetCall();
            setCallStatus('Call rejected');
            setTimeout(() => setCallStatus(''), 2500);
        };

        const handleCallUnavailable = () => {
            resetCall();
            setCallStatus('User is offline');
            setTimeout(() => setCallStatus(''), 2500);
        };

        socket.on('incoming-call', handleIncomingCall);
        socket.on('call-accepted', handleCallAccepted);
        socket.on('ice-candidate', handleIceCandidate);
        socket.on('call-ended', handleCallEnded);
        socket.on('call-rejected', handleCallRejected);
        socket.on('call-unavailable', handleCallUnavailable);

        return () => {
            socket.off('incoming-call', handleIncomingCall);
            socket.off('call-accepted', handleCallAccepted);
            socket.off('ice-candidate', handleIceCandidate);
            socket.off('call-ended', handleCallEnded);
            socket.off('call-rejected', handleCallRejected);
            socket.off('call-unavailable', handleCallUnavailable);
        };
    }, [incomingCall, localStream, resetCall]);

    useEffect(() => {
        if (loginuser?._id && selectedUser?._id) {
            axios.get(`/api/user/message?senderId=${loginuser._id}&receiverId=${selectedUser._id}`)
                .then((response) => {
                    setmessage(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [loginuser, selectedUser]);

// ------------------------------------------------------

    useEffect(() => {
        axios.get('/api/user/allusers')
            .then((r) => {
                const users = r.data;

                const filter = users.filter((i) => (i._id?.toString() !== loginuser._id?.toString()));
                setallusers(filter);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [loginuser]);

    useEffect(() => {
        const handleReceiveMessage = (newmessage) => {
            const incomingSenderId = normalizeId(newmessage?.senderId);
            const incomingReceiverId = normalizeId(newmessage?.receiverId);
            const selectedId = normalizeId(selectedUser?._id);

            if (incomingSenderId === selectedId || incomingReceiverId === selectedId) {
                setmessage((prev) => [...prev, newmessage]);
                console.log(newmessage);
            }
        };

        socket.on('receivemessage', handleReceiveMessage);

        return () => {
            socket.off('receivemessage', handleReceiveMessage);
        };
    }, [selectedUser]);

    const sendmessage = (text, image) => {
        const messageData = {
            senderId: loginuser._id,
            receiverId: selectedUser._id,
            text,
            image,
        };

        if (messageData.senderId !== undefined && messageData.receiverId !== undefined) {
            socket.emit('sendmessage', { messageData });
            setmessage((prevMessages) => [...prevMessages, messageData]);
        } else {
            console.log('select user');
        }
    };

    return (
        <div className='home'>
            <Navbar setisopen={setisopen} isopen={isopen} darkMode={darkMode} setDarkMode={setDarkMode} />
            <LEFTPART isopen={isopen} setselectedUser={setselectedUser} darkMode={darkMode} allusers={allusers} loginuser={loginuser} onlineusers={onlineusers} />
            <ChatWindow
                selectedUser={selectedUser}
                darkMode={darkMode}
                sendmessage={sendmessage}
                message={message}
                incomingCall={incomingCall}
                activeCall={activeCall}
                callStatus={callStatus}
                callDuration={callDuration}
                localStream={localStream}
                remoteStream={remoteStream}
                onStartCall={startCall}
                onAcceptCall={acceptCall}
                onRejectCall={rejectCall}
                onEndCall={endCall}
            />
        </div>

    );
};

export default HomePage;
