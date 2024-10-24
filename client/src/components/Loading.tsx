import { Spinner, Center } from "@chakra-ui/react";

type Props = {
  type?: "border" | "grow";
};

export const Loading = ({ type = "border" }: Props) => {
  return (
    <Center h="100vh" w="100vw" bg="white">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
};
