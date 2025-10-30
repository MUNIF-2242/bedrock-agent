// app/page.js
"use client";

import React, { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [selectedService, setSelectedService] = useState("general");

  const services = [
    { id: "wifi", name: "Wifi", icon: "📶" },
    { id: "laundry", name: "Laundry", icon: "🧺" },
  ];

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/bedrock-agent/userQuery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId,
          service: selectedService,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: " + data.error },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to agent" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);
    setMessages([]);
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Services</h1>
        </div>
        <div className="services-list">
          {services.map((service) => (
            <button
              key={service.id}
              className={`service-item ${
                selectedService === service.id ? "active" : ""
              }`}
              onClick={() => handleServiceChange(service.id)}
            >
              <span className="service-icon">{service.icon}</span>
              <span className="service-name">{service.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="container">
        <div className="chat-header">
          <h1>Bedrock Agent Chat</h1>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>Start a conversation with your Bedrock agent</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">
                <strong>{msg.role === "user" ? "You" : "Agent"}:</strong>
                <p>
                  {msg.content.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i > 0 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-content">
                <strong>Agent:</strong>
                <p className="loading">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
