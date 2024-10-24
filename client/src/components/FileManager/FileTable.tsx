import { MdDelete } from "react-icons/md";
import { Table, IconButton, Text } from "@chakra-ui/react";
import { FileInfo } from "./types";

export const FileTable: React.FC<{ files: FileInfo[] }> = ({ files }) => {
  return (
    <div className="table-responsive">
      <Table.Root variant="outline" colorScheme="gray" size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Date Uploaded</Table.ColumnHeader>
            <Table.ColumnHeader>Size</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {files.map((file) => (
            <Table.Row key={file.id}>
              <Table.Cell>
                <Text display="flex" alignItems="center" fontWeight="medium">
                  <i
                    className={`${file.icon} font-size-16 align-middle text-primary me-2`}
                  />
                  {file.name}
                </Text>
              </Table.Cell>
              <Table.Cell>{file.uploaded}</Table.Cell>
              <Table.Cell>{file.size}</Table.Cell>
              <Table.Cell>
                <IconButton
                  aria-label="Delete file"
                  variant="ghost"
                  colorScheme="red"
                >
                  <MdDelete size={20} />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
