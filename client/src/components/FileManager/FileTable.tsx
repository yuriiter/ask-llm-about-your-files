"use client";

import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import {
  DeleteOutlined,
  FileOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { FileInfo } from "./types";
import { deleteFiles, fetchFiles } from "@/lib/actions/data";
import { dateToShortHumanReadable } from "@/utils/utils";
import { useDisplayError } from "@/hooks/useDisplayError";
import toast from "react-hot-toast";

interface TableParams {
  pagination: {
    current: number;
    pageSize: number;
  };
  searchQuery: string;
}

export const FileTable: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searchQuery: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["files", tableParams],
    queryFn: () =>
      fetchFiles({
        current: tableParams.pagination.current - 1,
        pageSize: tableParams.pagination.pageSize,
        searchQuery: tableParams.searchQuery,
      }),
  });

  useDisplayError(error, "Error getting the files");

  const deleteMutation = useMutation({
    mutationFn: deleteFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      setSelectedRowKeys([]);
    },
    onError: () => toast.error("Error deleting the files"),
  });

  const handleTableChange = (pagination: any, _filters: any, _sorter: any) => {
    setTableParams({
      ...tableParams,
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  const handleSearch = debounce((value: string) => {
    setTableParams({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
      searchQuery: value,
    });
  }, 500);

  const handleDelete = () => {
    if (selectedRowKeys.length > 0) {
      deleteMutation.mutate(selectedRowKeys as string[]);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="flex items-center">
          <FileOutlined style={{ marginRight: 10 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Date Uploaded",
      dataIndex: "uploaded",
      key: "uploaded",
      render: (_: any, record: FileInfo) => (
        <span>{dateToShortHumanReadable(record.data_uploaded)}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: FileInfo) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteMutation.mutate([record.id])}
        />
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-sm">
        <Input
          placeholder="Search files..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-xs"
        />
        {selectedRowKeys.length > 0 && (
          <Button
            danger
            onClick={handleDelete}
            loading={deleteMutation.isPending}
          >
            Delete Selected ({selectedRowKeys.length})
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={data?.files ?? []}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          ...tableParams.pagination,
          total: data?.totalCount ?? 0,
        }}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </div>
  );
};
