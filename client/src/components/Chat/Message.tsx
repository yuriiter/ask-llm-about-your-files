"use client";

import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React from "react";

export const UserMessage: React.FC<{ content: string }> = ({ content }) => (
  <div
    style={{
      display: "flex",
      gap: "12px",
      marginBottom: "24px",
    }}
  >
    <Avatar icon={<UserOutlined />} />
    <Card
      style={{
        flex: 1,
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <pre>{content}</pre>
    </Card>
  </div>
);

export const AssistantMessage: React.FC<{ content: string }> = ({
  content,
}) => (
  <div
    style={{
      display: "flex",
      gap: "12px",
      marginBottom: "24px",
    }}
  >
    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: "#1890ff" }} />
    <Card
      style={{
        flex: 1,
        borderRadius: "8px",
      }}
    >
      <pre>{content}</pre>
    </Card>
  </div>
);
