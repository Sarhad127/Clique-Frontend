import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import './styles/ChatBox.css';
import { fetchGroupMessages } from './api';

const GroupChatBox = ({ user, groupId, selectedGroupChat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [, setConnectionStatus] = useState("Disconnected");
    const stompClientRef = useRef(null);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const messagesEndRef = useRef(null);

    const backgroundStyle = selectedGroupChat
        ? {
            backgroundImage: `url(${selectedGroupChat.backgroundImageUrl})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }
        : {};

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

    function formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) + ", " + date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    useEffect(() => {
        if (groupId) {
            const loadGroupMessages = async () => {
                try {
                    const data = await fetchGroupMessages(groupId, token);
                    setMessages(data);
                    setTimeout(scrollToBottom, 100);
                } catch (error) {
                    console.error("Failed to fetch group messages:", error);
                }
            };

            loadGroupMessages();
        }
    }, [groupId, token]);

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
                style={backgroundStyle}
            >
                {messages.map((message, index) => {
                    const isOutgoing = message.senderId === user.id;

                    return (
                        <div
                            key={index}
                            className={`message ${isOutgoing ? "outgoing" : "incoming"}`}
                        >
                            {!isOutgoing && (
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
                            )}

                            <div className="message-details">
                                <div className="message-header">
                                    <div className="username">{message.senderUsername}</div>
                                    <div className="message-time">{formatDateTime(message.timestamp)}</div>
                                </div>
                                <div className="message-content">{message.content}</div>
                            </div>

                            {isOutgoing && (
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
                            )}
                        </div>
                    );
                })}
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