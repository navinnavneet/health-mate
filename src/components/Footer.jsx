/**
 * Footer — Simple footer shown on some pages.
 */
import { Box, Text, Flex, HStack, Link } from "@chakra-ui/react";
import { FaHeartbeat } from "react-icons/fa";

function Footer() {
  return (
    <Box bg="gray.800" color="gray.400" py={8} px={6}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        maxW="6xl"
        mx="auto"
        gap={4}
      >
        <HStack spacing={2}>
          <Box color="brand.400">
            <FaHeartbeat />
          </Box>
          <Text fontWeight="bold" color="white">
            FitSense
          </Text>
        </HStack>
        <Text fontSize="sm">
          © {new Date().getFullYear()} FitSense. All rights reserved.
        </Text>
        <HStack spacing={4} fontSize="sm">
          <Link href="#" _hover={{ color: "white" }}>
            Privacy
          </Link>
          <Link href="#" _hover={{ color: "white" }}>
            Terms
          </Link>
          <Link href="#" _hover={{ color: "white" }}>
            Contact
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Footer;
