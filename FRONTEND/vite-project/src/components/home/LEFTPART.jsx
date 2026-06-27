import { useState } from 'react';


import './home.css'
const LEFTPART = (props) => {
    let [size , setsize] = useState(380);

    const handlesize =(event)=>{
        let s = event.clientX;
        if(s >= 200 && s<=600){
            setsize(event.clientX)
        }
        
    }
    
    return (
        <div className={`userlist ${props.isopen ?"open": "close"}  ${props.darkMode ? "dark" : "bright"}`} style={{width:`${size}px`}}>

            <div className='resize' onMouseDown={(event)=>{
                event.preventDefault();
                document.addEventListener('mousemove',handlesize)
                document.addEventListener('mouseup',()=>{
                    document.removeEventListener('mousemove',handlesize)
                })
            }}>
            </div>


            <div className='myaccount'style={{display:'flex',flexDirection:'row' ,padding:'14px'}}>
                <img src= {props.loginuser.profilepic} style={{width:'55px',height:'55px',borderRadius:'40px' ,boxShadow:'0px 3px 6px black'}}></img>
                <div className='text' style={{display:'flex',flexDirection:'column',marginLeft:'13px'}}>
                    <b>MY ACCOUNT</b>
                    {props.loginuser.username}
                 </div>
            </div>


            <hr></hr>
            <h2>PEOPLE</h2>
                  
            <ul type='none'>
                {props.allusers.map((i)=>(
                    <li key= {i._id }  
                       onClick={() => props.setselectedUser(i)} >  
                        <div> <img src={i.profilepic} style={{height:'50px' ,width:'50px' ,borderRadius:'20px',cursor:'pointer'}}/> {i.username} </div>
                        <div> <i style={{color: 'green',fontSize: '17px',marginTop:'14px'}}>{props.onlineusers.includes(i._id) ? 'online' : ''}</i></div>
                       </li>
                        
                ))}
            </ul>

        </div>
    );
}

export default LEFTPART;
