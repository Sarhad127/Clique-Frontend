import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import './styles/ChatBox.css';

const GroupChatBox = ({ user, groupId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [, setConnectionStatus] = useState("Disconnected");
    const stompClientRef = useRef(null);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };
    useEffect(() => {
        if (groupId) {
            const fetchMessages = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:8080/messages/group?groupId=${groupId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setMessages(data);
                    setTimeout(scrollToBottom, 100);
                } catch (error) {
                    console.error("Failed to fetch group messages:", error);
                }
            };

            fetchMessages();
        }
    }, [groupId]);

    useEffect(() => {
        if (!user?.id) return;

        setConnectionStatus("Connecting...");
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket connected");
                setIsConnected(true);
                setConnectionStatus("Connected");

                stompClient.subscribe(`/topic/group-messages/${groupId}`, (message) => {
                    console.log("Received group message:", message.body);
                    const received = JSON.parse(message.body);
                    if (received.groupId === groupId) {
                        setMessages((prev) => [...prev, received]);
                    }
                });
            },

            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers.message, frame.body);
                setConnectionStatus("Error");
            },
            onWebSocketError: (error) => {
                console.error("WebSocket error:", error);
                setConnectionStatus("WebSocket Error");
            },
            onWebSocketClose: () => {
                setIsConnected(false);
                setConnectionStatus("Disconnected");
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
            setIsConnected(false);
            setConnectionStatus("Disconnected");
        };
    }, [user?.id, groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !isConnected) return;

        const message = {
            senderId: user.id,
            groupId: groupId,
            content: newMessage,
            timestamp: new Date().toISOString(),
        };

        try {
            stompClientRef.current.publish({
                destination: "/app/group-chat.send",
                body: JSON.stringify(message),
            });
            setMessages((prev) => [...prev, message]);
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send group message:", error);
        }
    };

    return (
        <div className="default-chat-box">
            <div
                className="chat-messages"
                ref={messagesEndRef}
                style={{ overflowY: "auto"}}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.senderId === user.id ? "outgoing" : "incoming"}`}
                    >
                        <div className="avatar" style={{
                            backgroundColor: !message.senderAvatarUrl ? message.senderAvatarColor : 'transparent',
                        }}>
                            {message.senderAvatarUrl ? (
                                <img
                                    src={message.senderAvatarUrl}
                                    alt={`${message.senderUsername}'s avatar`}
                                    className="avatar-image"
                                />
                            ) : (
                                <span className="avatar-initials">{message.senderAvatarInitials}</span>
                            )}
                        </div>

                        <div className="message-content">
                            <div className="username">{message.senderUsername}</div>
                            <div>{message.content}</div>
                            <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
                        </div>
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
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className="send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default GroupChatBox;