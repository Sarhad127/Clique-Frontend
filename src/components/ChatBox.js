import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import './styles/ChatBox.css';
import { fetchMessages } from './api';

const ChatBox = ({ user, friendId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const stompClientRef = useRef(null);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (friendId) {
            const loadMessages = async () => {
                try {
                    const data = await fetchMessages(user.id, friendId, token);
                    setMessages(data);
                    setTimeout(scrollToBottom, 100);
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            };

            loadMessages();
        }
    }, [friendId, user.id]);

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

                stompClient.subscribe(`/topic/messages/${user.id}`, (message) => {
                    console.log("Received message in subscription:", message.body);
                    const received = JSON.parse(message.body);
                    if (
                        (received.senderId === friendId && received.receiverId === user.id) ||
                        (received.receiverId === friendId && received.senderId === user.id)
                    ) {
                        setMessages((prev) => [...prev, received]);
                    }
                });

                console.log("Subscribed to /topic/messages/" + user.id);
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
    }, [user?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !isConnected) return;

        const message = {
            senderId: user.id,
            receiverId: friendId,
            content: newMessage,
            timestamp: new Date().toISOString(),
        };

        try {
            stompClientRef.current.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(message),
            });
            setMessages((prev) => [...prev, message]);
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    function formatDateTime(timestamp) {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }) + ", " + date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

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
                        className={`message ${
                            message.senderId === user.id ? "outgoing" : "incoming"
                        }`}
                    >
                        <div>{message.content}</div>
                        <div className="message-time">
                            {formatDateTime(message.timestamp)}
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

export default ChatBox;
