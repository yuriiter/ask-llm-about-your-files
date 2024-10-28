"use client";

import { Card, Typography } from "antd";
import { ActionButtons } from "./ActionButtons";
import { FileTable } from "./FileTable";

const { Title } = Typography;
export const FileManager: React.FC = () => {
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
          </div>
          <FileTable />
        </div>
      </Card>
    </div>
  );
};
