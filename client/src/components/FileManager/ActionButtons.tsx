"use client";
import { Button, IconButton, HStack, Box } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { FaCommentAlt } from "react-icons/fa";

export const ActionButtons = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <IconButton
        aria-label="Comment"
        icon={<FaCommentAlt />}
        colorScheme="blue"
        rounded="full"
      />
      <HStack spacing={2}>
        <Button leftIcon={<i className="mdi mdi-plus" />} colorScheme="blue">
          Upload new file
        </Button>
        <Button
          onClick={() => signOut({ redirect: true, redirectTo: "/sign-in" })}
          variant="outline"
        >
          Log out
        </Button>
      </HStack>
    </Box>
  );
};
