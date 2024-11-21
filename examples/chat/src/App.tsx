import { useState } from 'react'

import { StegoBaseApp } from 'stegobase';

import './App.css'

const app = StegoBaseApp.init("localhost:8000","", {debug: true})

function App() {

  const [messages, setMessages] = useState<string[]>([]);
  
  const addMessage = async (message: string) => {
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
          await addMessage("Hello, World!");
          await getMessages();
        }}>
          Add Message
        </button>

        <button onClick={async () => {
          await getMessages();
        }}>
          Get Messages

        </button>

        <button onClick={async () => {
          setMessages([]);
        }}>
          Clear Messages
        </button>

        <div>
          {messages.map((message: string,i) => {
            return <div key={i}>{message}</div>
          })}
        </div>

      </div>

    </>
  )
}

export default App
