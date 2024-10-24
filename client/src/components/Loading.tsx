import { Spin } from "antd";

export const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
      }}
    >
      <Spin size="large" />
    </div>
  );
};
