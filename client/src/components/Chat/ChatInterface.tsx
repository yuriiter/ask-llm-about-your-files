"use client";

import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { Layout, Input, Button, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { EmptyState } from "./EmptyState";
import { Message } from "./types";
import { AssistantMessage, UserMessage } from "./Message";
import Link from "next/link";

const { Header, Footer, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout
      style={{
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <Header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Chat Assistant
        </Title>
        <Link href="/files" passHref>
          <Button
            style={{ marginLeft: 20 }}
            type="link"
            icon={<ArrowLeftOutlined />}
          >
            Back to files
          </Button>
        </Link>
      </Header>

      <Content
        style={{
          padding: "24px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
            {messages.map((message) =>
              message.type === "user" ? (
                <UserMessage key={message.id} content={message.content} />
              ) : (
                <AssistantMessage key={message.id} content={message.content} />
              ),
            )}
            {isLoading && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <Avatar
                  icon={<RobotOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                />
                <Card
                  style={{
                    flex: 1,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                  }}
                >
                  <Spin />
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Content>

      <Footer
        style={{
          padding: "12px 24px",
          backgroundColor: "#fff",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            gap: "8px",
          }}
        >
          <TextArea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              resize: "none",
              padding: "8px 12px",
              borderRadius: "8px",
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              height: "auto",
              padding: "8px 16px",
            }}
          />
        </div>
        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "8px",
            fontSize: "12px",
          }}
        >
          Press Enter to send, Shift + Enter for new line
        </Text>
      </Footer>
    </Layout>
  );
};
