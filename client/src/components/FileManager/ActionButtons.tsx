"use client";
import { useState } from "react";
import { Button, Space, Modal, Upload, message } from "antd";
import { signOut } from "next-auth/react";
import {
  CommentOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { RcFile, UploadProps } from "antd/es/upload";
import { uploadFile } from "@/lib/actions/data";

const { Dragger } = Upload;

export const ActionButtons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<RcFile[]>([]);

  const handleUpload = async () => {
    if (fileList.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      if (fileList[0]) {
        formData.append("file", fileList[0]);
      } else return;

      const result = await uploadFile(formData);

      setFileList([]);
      setIsModalOpen(false);
      message.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
    },

    beforeUpload: (file: RcFile) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/zip",
        "application/pdf",
        "text/plain",
        "text/markdown",
      ];

      if (!file.type || !file.size) {
        message.error("Error uploading file");
        return Upload.LIST_IGNORE;
      }

      const isAllowedType = allowedTypes.includes(file.type);
      const isLessThan100MB = file.size / 1024 / 1024 < 100;

      if (!isAllowedType) {
        message.error(
          "You can only upload PNG, JPEG, ZIP, PDF, TXT, or MD files!",
        );
        return Upload.LIST_IGNORE;
      }

      if (!isLessThan100MB) {
        message.error("File must be smaller than 10MB!");
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },

    fileList,
    accept: ".png,.jpg,.jpeg,.zip,.pdf,.txt,.md",
    multiple: false,
    maxCount: 1,
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button icon={<CommentOutlined />} type="primary" shape="circle" />
        <Space>
          <Button
            icon={<UploadOutlined />}
            type="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Upload new file
          </Button>
          <Button
            onClick={() => signOut({ redirect: true, redirectTo: "/sign-in" })}
          >
            Log out
          </Button>
        </Space>
      </div>

      <Modal
        title="Upload File"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false);
              setFileList([]);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handleUpload}
            loading={uploading}
            disabled={fileList.length === 0}
          >
            Upload
          </Button>,
        ]}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag a file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for single file upload. Maximum size: 100MB
          </p>
        </Dragger>
      </Modal>
    </>
  );
};
