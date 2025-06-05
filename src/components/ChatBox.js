import React, { useState, useEffect } from "react";

const ChatBox = ({ user, friendId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        console.log("Fetching messages for friendId:", friendId);
        if (friendId) {
            const fetchMessages = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:8080/messages?userId=${user.id}&friendId=${friendId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    const data = await response.json();
                    console.log("Fetched messages:", data);
                    setMessages(data);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            };

            fetchMessages();
        }
    }, [friendId, user.id]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const message = {
            senderId: user.id,
            receiverId: friendId,
            content: newMessage,
            timestamp: new Date().toISOString(),
        };

        console.log("Sending message:", message);

        try {
            const response = await fetch("http://localhost:8080/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                const sentMessage = await response.json();
                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setNewMessage("");
            } else {
                console.error("Error sending message:", response);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.userId === user.id ? "outgoing" : "incoming"}`}>
                        <div>{message.content}</div>
                        <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
                    </div>
                ))}
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="chat-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
