import { RobotOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Title, Text } = Typography;

export const EmptyState = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "2rem",
      textAlign: "center",
      color: "#666",
    }}
  >
    <RobotOutlined style={{ fontSize: "48px", marginBottom: "1rem" }} />
    <Title level={3}>How can I help you today?</Title>
    <Text type="secondary">Type a message to start the conversation</Text>
  </div>
);
