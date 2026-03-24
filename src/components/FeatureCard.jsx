/**
 * FeatureCard — Reusable card used on the Landing page to showcase features.
 * Accepts an icon, title, and description.
 */
import { Box, Icon, Heading, Text, VStack } from "@chakra-ui/react";

function FeatureCard({ icon, title, description }) {
  return (
    <Box
      bg="white"
      rounded="xl"
      shadow="md"
      p={8}
      textAlign="center"
      transition="all 0.3s"
      _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
    >
      <VStack spacing={4}>
        <Icon as={icon} w={10} h={10} color="brand.500" />
        <Heading size="md" color="gray.700">
          {title}
        </Heading>
        <Text color="gray.500" fontSize="sm">
          {description}
        </Text>
      </VStack>
    </Box>
  );
}

export default FeatureCard;
