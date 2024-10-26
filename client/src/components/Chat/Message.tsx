"use client";

import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React from "react";
import { Markdown } from "./Markdown";

interface MessageProps {
  content: string;
  role: "user" | "assistant";
}

export const MessageComponent: React.FC<MessageProps> = ({ content, role }) => {
  const isAssistant = role === "assistant";

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      <Avatar
        icon={isAssistant ? <RobotOutlined /> : <UserOutlined />}
        style={isAssistant ? { backgroundColor: "#1890ff" } : undefined}
      />
      <Card
        style={{
          flex: 1,
          borderRadius: "8px",
          backgroundColor: isAssistant ? undefined : "#f9f9f9",
        }}
      >
        <Markdown>{content}</Markdown>
      </Card>
    </div>
  );
};
