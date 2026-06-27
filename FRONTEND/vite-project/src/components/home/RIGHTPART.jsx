import { useState,useEffect,useRef  } from 'react';
import { FaPhone, FaPhoneSlash, FaVideo } from "react-icons/fa";
import { FaPaperPlane, FaImage } from 'react-icons/fa';
import Empty from './empty';
import './home.css';
import axios from 'axios';

const ChatWindow = (props) => {
  let [text , settext] = useState("");
  let [image ,setimage] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const formatDuration = (seconds = 0) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handletext = (e) =>{
    settext(e.target.value);
  }


  const handleimage = (e)=>{
    setLoading(true);
    let msgpic = e.target.files[0];
    let formdata = new FormData();
    formdata.append('msgpic' , msgpic);
    axios.post('/api/user/uploads', formdata, {
        headers:{
            'Content-Type': 'multipart/form-data',
        }
    })
    .then((response)=>{
        setimage(response.data);
        setLoading(false);
    }) 
    .catch((err)=>{
        console.log(err);
        setLoading(false);
    })

  }
  const handleRemoveImage = () => {
    setimage(null); 
    setLoading(false); 
  };
  
  const sendbutton = ()=>{
    props.sendmessage(text,image);
    settext('');
    setimage(null);
    // console.log(props.message);
  }
  



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.message]);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = props.localStream || null;
    }
  }, [props.localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = props.remoteStream || null;
    }
  }, [props.remoteStream]);

  const Id = props.selectedUser?._id || '';

  return (  
    <>
    {Id ? (
    <div className={`chatwindow ${props.darkMode ? "dark" : "bright"}`}>
    <div className='head'>
        <div className='t'> 
            <img src={props.selectedUser.profilepic} style={{ marginTop: '4px', height: '60px', width: '58px', borderRadius: '22px' }} />
            <div className='text'>
                <h4>{props.selectedUser.username}</h4>
                <i>select for more info</i>
            </div>
        </div>

        <div className='icons'>
            <ul>
                <li title="Voice call" onClick={() => props.onStartCall('audio')}><FaPhone /></li>
                <li title="Video call" onClick={() => props.onStartCall('video')}><FaVideo /></li>
            </ul>
        </div>
    </div>

    {(props.incomingCall || props.activeCall || props.callStatus) && (
        <div className="callPanel">
            {props.incomingCall && (
                <>
                    <div className="callMeta">
                        <div className="callPulse">{props.incomingCall.type === 'video' ? <FaVideo /> : <FaPhone />}</div>
                        <div>
                            <strong>{props.incomingCall.from.username}</strong>
                            <span>{props.incomingCall.type === 'video' ? 'Incoming video call' : 'Incoming voice call'}</span>
                        </div>
                    </div>
                    <button className="callAccept" onClick={props.onAcceptCall}>Accept</button>
                    <button className="callEnd" onClick={props.onRejectCall}>Reject</button>
                </>
            )}

            {!props.incomingCall && props.activeCall && (
                <>
                    <div className="callMeta">
                        <div className={`callPulse ${props.activeCall.phase === 'connected' ? 'connected' : ''}`}>
                            {props.activeCall.type === 'video' ? <FaVideo /> : <FaPhone />}
                        </div>
                        <div>
                            <strong>{props.activeCall.user.username}</strong>
                            <span>{props.callStatus || (props.activeCall.type === 'video' ? 'Video call' : 'Voice call')}</span>
                        </div>
                    </div>
                    <div className="callTimer">{props.activeCall.phase === 'connected' ? formatDuration(props.callDuration) : 'Ringing'}</div>
                    <button className="callEnd" onClick={props.onEndCall}><FaPhoneSlash /> End</button>
                </>
            )}

            {!props.incomingCall && !props.activeCall && props.callStatus && (
                <span>{props.callStatus}</span>
            )}
        </div>
    )}

    {props.activeCall && (
        <div className={`callStage ${props.activeCall.type === 'audio' ? 'audioOnly' : ''}`}>
            <div className="remoteVideoBox">
                {props.activeCall.type === 'video' ? (
                    <video ref={remoteVideoRef} autoPlay playsInline />
                ) : (
                    <div className="audioAvatar">
                        <FaPhone />
                        <span>{props.activeCall.user.username}</span>
                        <b>{props.activeCall.phase === 'connected' ? formatDuration(props.callDuration) : 'Ringing...'}</b>
                    </div>
                )}
            </div>
            <video className="localVideoBox" ref={localVideoRef} autoPlay muted playsInline />
        </div>
    )}

    <div className='msg'>
    
       <div className='msgwindow'> 

       {props.message.map((m, index) => (
        <div 
        key={index} 
        className={props.selectedUser._id?.toString() === m.senderId?.toString() ? "receivedMessage" : "sentMessage"}>  
        {m.text && m.text}
        {m.image && <img src={m.image} style={{width:'300px' ,height:'300px'}}></img>}
        </div>
    ))}
    <div ref={messagesEndRef} />
    </div>
        
    </div>

    <div className="typeMessage">
        <div className="inputSection">
            <input type="text" 
           placeholder={loading || image ? "wait image is loading...." : "TYPE YOUR MESSAGE"}  value={text} onChange={handletext} />

            {image && (
                <div className="imagePreview">
                  <img src={image} alt="preview" style={{ width: '100px', height: '100px' }} />
                  <button className="removeImageButton" onClick={handleRemoveImage}>X</button>
                </div>
              )}


            <i>
                <label htmlFor="fileUpload" className="uploadIcon">
                    <FaImage />
                    <input type="file" id="fileUpload" accept="image/*" onChange={handleimage} hidden />
                </label>
                <button className="sendButton" onClick={sendbutton}>
                    <FaPaperPlane />
                </button>
            </i>
        </div>
    </div>
</div>
)
:   
(<Empty/>)} 
</>
);
};



export default ChatWindow;
