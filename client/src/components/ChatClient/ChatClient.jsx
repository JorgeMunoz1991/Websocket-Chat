import React, { useState, useEffect } from "react";
import "./ChatClient.css";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const socket = io("https://chat-server-edwin-dev.onrender.com/");

export const ChatClient = () => {
  const [message, setMessage] = useState("");
  const [username, setUserName] = useState("Machine");
  const [showPicker, setShowPicker] = useState(false);
  const [listMessages, setListMessages] = useState(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    return storedMessages
      ? JSON.parse(storedMessages)
      : [
          {
            body: "Welcome to the chat room",
            user: "Machine",
            timestamp: new Date().toLocaleString(),
          },
        ];
  });

  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);

  const handleClear = (index) => {
    const updatedMessages = [...listMessages];
    updatedMessages.splice(index, 1);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    setListMessages(updatedMessages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "" && username.trim() !== "") {
      const timestamp = new Date().toLocaleString();
      const newMsg = {
        body: `${message} - ${timestamp}`,
        user: username,
      };
      socket.emit("message", newMsg);
      setListMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMsg];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      setMessage("");
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    const receiveMessage = (msg) => {
      setListMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, msg];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    };
    socket.on("message", receiveMessage);

    return () => socket.off("message", receiveMessage);
  }, []);

  return (
    <>
      <input
        onChange={(event) => setUserName(event.target.value)}
        className="txt-username"
        type="text"
        placeholder="username"
      />

      <div className="div-chat">
        {listMessages.map((message, idx) => (
          <div
            key={message + idx}
            className="message-container"
            onMouseEnter={() => setHoveredMessageIndex(idx)}
            onMouseLeave={() => setHoveredMessageIndex(null)}
          >
            <div className="timestamp">{message.timestamp}</div>
            <div className="message-text">
              <span>
                <strong>{message.user}:</strong> {message.body}
              </span>
              {hoveredMessageIndex === idx && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={() => handleClear(idx)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="trash-icon" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="div-type-chat">
          <img
            className="emoji-icon"
            width="30"
            height="30"
            src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
            onClick={() => setShowPicker(!showPicker)}
          />
          {showPicker && <Picker onEmojiClick={onEmojiClick} />}{" "}
          <input
            value={message}
            placeholder="Type your message"
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            name="text"
            id="chat-message"
            className="input-style"
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </>
  );
};
