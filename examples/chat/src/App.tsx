import { useState } from 'react'

import { StegoBaseApp } from 'stegobase';

import './App.css'

const app = StegoBaseApp.init("localhost:8000","", {debug: true})

type Message = {
  name: string;
  message: string;
}

function App() {

  const [message, setMessage] = useState({
    name: "",
    message: ""
  })

  const [messages, setMessages] = useState<Message[]>([]);
  
  const addMessage = async () => {
    const messageId = Math.random().toString().substring(10);
    await app.set(["messages", messageId], message);
  }

  const getMessages = async () => {
    const messageIdResp = await app.list(["messages"]);
    const messageIds = messageIdResp.value;
    console.log(messageIds);

    const messages = await Promise.all(messageIds.map(async (messageId: string) => {
      return (await app.get(messageId.key)).value.value;
    }));

    console.log(messages);

    setMessages(messages);
  }



  return (
    <>
      <h1>
        Stego Base Demo
      </h1>

      <div>


        <button onClick={async () => {
          await getMessages();
        }}>
          Get Messages
        </button>

        {/* message */}
        <div>
          <input type="text" value={message.name} onChange={(e) => setMessage({...message, name: e.target.value})} />
          <input type="text" value={message.message} onChange={(e) => setMessage({...message, message: e.target.value})} />
          <button onClick={async () => {
            // only send if name and message are not empty
            if (!message.name || !message.message) {
              return;
            }

            await addMessage();
            await getMessages();
            setMessage({name: "", message: ""});
          }}>
            Add Message
          </button>

        <div>
          {messages.map((message: string,i) => {
            return <div key={i}>
              {message.name}: {message.message}
            </div>
          })}
        </div>

      </div>
    </div>

    </>
  )
}

export default App
