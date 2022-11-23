import React, { useState, useEffect } from "react";
import { useSocket } from "../../utils/socket";
import { useAuth } from "../../utils/auth";

const SocketMessages = () => {
  const { user } = useAuth();
  const socket = useSocket();

  const [inChat, setInChat] = useState(true);
  const [copyText, setCopyText] = useState("Copy Room ID");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket.on("user-joined", (username, members) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        { text: `'${username}' joined the room!` },
      ]);
      setMembers(members);
    });

    socket.on("user-left", (username, members) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        { text: `'${username}' left the room!` },
      ]);
      setMembers(members);
    });

    socket.on("message", ({ text, sender }) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        { text, sender },
      ]);
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message) socket.emit("send-message", message);
    setMessage("");
  };

  const formatMessage = (message) => {
    if (message.sender) {
      return (
        <p>
          {message.sender === user.username ? `You:` : `${message.sender}:`}
          {message.text}
        </p>
      );
    } else {
      return <p>{message.text}</p>;
    }
  };

  const formatMembers = (member) => {
    return (
      <div className="flex flex-row items-center mb-1">
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt="user-picture"
          width="33"
          height="33"
          className="mr-1"
        />
        <span>{member.username}</span>
      </div>
    );
  };

  const copyRoomIdToClipboard = () => {
    navigator.clipboard
      .writeText(user.room)
      .then(() => {
        setCopyText("Room ID Copied!");
        const timeout = setTimeout(() => {
          setCopyText("Copy Room Id");
          clearTimeout(timeout);
        }, 2500);
      })
      .catch((err) => {
        console.error("Async: Could not copy text: ", err);
      });
  };

  return (
    <div className="flex flex-col h-full ml-2">
      <button
        className="border border-black p-2 mb-2 h-max hover:bg-gray-200"
        onClick={copyRoomIdToClipboard}
      >
        {copyText}
      </button>
      <ul className="flex flex-wrap text-center">
        <li className="w-1/2">
          <button
            className={`border border-black p-2 w-full h-full ${
              inChat ? "bg-gray-400" : "bg-white hover:bg-gray-200"
            }`}
            onClick={() => setInChat(true)}
          >
            Chat
          </button>
        </li>
        <li className="w-1/2">
          <button
            className={`border border-black border-l-0 p-2 w-full h-full ${
              !inChat ? "bg-gray-400" : "bg-white hover:bg-gray-200"
            }`}
            onClick={() => setInChat(false)}
          >
            Members
          </button>
        </li>
      </ul>
      <div className="flex-grow w-full border border-black border-t-0 p-2 overflow-y-scroll">
        {inChat ? (
          <React.Fragment>{messages.map(formatMessage)}</React.Fragment>
        ) : (
          <React.Fragment>{members.map(formatMembers)}</React.Fragment>
        )}
      </div>
      <div className="flex w-full mt-2">
        <input
          type="text"
          value={message}
          placeholder="Send a Message"
          className="block border border-black flex-grow p-2 focus-visible:none"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="border border-black border-l-0 p-2 h-max hover:bg-gray-200"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SocketMessages;
