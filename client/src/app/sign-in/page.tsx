"use client";
import { Card, Typography, Button, Layout, Space } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import Link from "next/link";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function SignInPage() {
  const session = useSession();
  const searchParams = useSearchParams();
  const redirectPathname = searchParams.get("redirect");
  const router = useRouter();

  if (session.status === "loading") return <Loading />;

  if (session.status === "authenticated") {
    router.replace("/files");
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f2f5",
        }}
      >
        <div style={{ width: "100%", maxWidth: "480px", padding: "0 16px" }}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <Title level={2}>Welcome back</Title>
                <Text type="secondary">Please sign in to continue</Text>
              </div>

              <Button
                icon={<GoogleOutlined />}
                onClick={() =>
                  signIn("google", {
                    callbackUrl: redirectPathname ?? "/files",
                  })
                }
                block
              >
                Continue with Google
              </Button>

              <Text type="secondary" style={{ textAlign: "center" }}>
                By continuing, you agree to our{" "}
                <Link href="/terms-of-service">Terms of Service</Link> and{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>
              </Text>
            </Space>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
