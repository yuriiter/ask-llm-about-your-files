"use client";
import { Button, Space } from "antd";
import { signOut } from "next-auth/react";
import { CommentOutlined, UploadOutlined } from "@ant-design/icons";

export const ActionButtons = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Button icon={<CommentOutlined />} type="primary" shape="circle" />
      <Space>
        <Button icon={<UploadOutlined />} type="primary">
          Upload new file
        </Button>
        <Button
          onClick={() => signOut({ redirect: true, redirectTo: "/sign-in" })}
        >
          Log out
        </Button>
      </Space>
    </div>
  );
};
