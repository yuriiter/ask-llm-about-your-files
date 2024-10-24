"use client";

import { Card, Typography } from "antd";
import { ActionButtons } from "./ActionButtons";
import { FileTable } from "./FileTable";
import { FileInfo } from "./types";

const { Title } = Typography;
export const FileManager: React.FC = () => {
  const files: FileInfo[] = [
    {
      id: "243-fdsff23jf-sdbvn",
      name: "index.html",
      icon: "file",
      uploaded: "12-10-2020, 09:45",
      size: "09 KB",
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <ActionButtons />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Title level={4} style={{ margin: 0, marginRight: 12 }}>
              Files
            </Title>
            <a href="#" style={{ marginLeft: "auto" }}>
              View All
            </a>
          </div>
          <FileTable files={files} />
        </div>
      </Card>
    </div>
  );
};
