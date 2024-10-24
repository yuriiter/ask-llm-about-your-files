import { Box, Card, CardBody, Heading, Container } from "@chakra-ui/react";
import { ActionButtons } from "./ActionButtons";
import { FileTable } from "./FileTable";
import { FileInfo } from "./types";

export const FileManager: React.FC = () => {
  const files: FileInfo[] = [
    {
      id: "243-fdsff23jf-sdbvn",
      name: "index.html",
      icon: "mdi mdi-file-document",
      uploaded: "12-10-2020, 09:45",
      size: "09 KB",
    },
  ];

  return (
    <Container maxW="container.xl">
      <Box>
        <Card.Root>
          <CardBody>
            <Box mb={3}>
              <ActionButtons />
            </Box>

            <Box divideX="2px">
              <Box display="flex" flexWrap="wrap" alignItems="center">
                <Heading size="md" mr={3}>
                  Files
                </Heading>
                <Box ml="auto">
                  <Box as="a" href="#" fontWeight="medium">
                    View All
                  </Box>
                </Box>
              </Box>
              <FileTable files={files} />
            </Box>
          </CardBody>
        </Card.Root>
      </Box>
    </Container>
  );
};
