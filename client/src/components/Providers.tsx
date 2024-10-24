"use client";

import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdStyledComponentsRegistry from "./AntdStyleComponentsRegistry";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AntdRegistry>
      <AntdStyledComponentsRegistry>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <ConfigProvider wave={{ disabled: true }}>
              {children}
            </ConfigProvider>
          </QueryClientProvider>
        </SessionProvider>
      </AntdStyledComponentsRegistry>
    </AntdRegistry>
  );
};
