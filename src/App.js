import React, { Component } from 'react'
import io from 'socket.io-client'

class App extends Component {

constructor(){
  super()
  this.state = {
    user : '',
    endpoint : 'http://localhost:3030',
    input:"",
    messagesList:[],
    usersOnline:[]
  }
}

  componentDidMount = async () =>{
   const user = prompt("enter your name","your name")
   this.setState({user:user})
   const socket = io(this.state.endpoint)
   socket.emit('user', user)
   this.responseMessage()
  }

  handleOnchange=(e)=>{
    this.setState({input:e.target.value})
    if(e.target.value !== ""){
    const socket = io(this.state.endpoint)
    socket.emit('message-typing',({userName:this.state.user}))
    }else{
      const socket = io(this.state.endpoint)
      socket.emit('message-typingStop',({userName:this.state.user}))
    }
  }

  // handleTyping=(event)=>{
  //   console.log(event)
  //   setInterval()
  //   // const socket = io(this.state.endpoint)
  //   // socket.emit('message-typing',({userName:this.state.user}))
  //   // console.log(this.state.user+" typing")
  // }


  handleOnSubmit=(event)=>{
    event.preventDefault()
    const socket = io(this.state.endpoint)
    socket.emit('message',({message:this.state.input,userName:this.state.user}))
    socket.emit('message-typingStop',({userName:this.state.user}))
    this.setState({input:""})
  }

  responseMessage=()=>{
    var messages=[]
    const socket = io(this.state.endpoint)
    socket.on('statusMessage',(dataList)=>{
      messages.push(dataList)
      this.setState({messagesList:messages,usersOnline:dataList.usersOnline})
    })

    socket.on('chatMessage',(message)=>{
      messages.push(message)
      this.setState({messagesList:messages})
    })

    socket.on('messageTyping',(dataList)=>{
       this.setState({usersOnline:dataList.usersOnline})
    })
    
    
  }

  render() {

    return (
      <div>
      <div style={{position:'absolute',right:0}}>
      online users
        {this.state.usersOnline.map((data,index)=>(
          <div key={index}>{data.userName} : ({data.status})</div>
        ))}
      </div>
      <h1>Hello {this.state.user}</h1>
      <form onSubmit={this.handleOnSubmit}>
      <input type="text" onChange={this.handleOnchange}  value={this.state.input}/>
      </form>
        {this.state.messagesList.map((data,index)=>(
          <p key={index}>{data.msg}</p>
        ))}
      </div>
    );
  }
}

export default App;
