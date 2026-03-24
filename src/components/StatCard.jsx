/**
 * StatCard — Reusable dashboard stat card.
 * Displays a label, value, and optional badge with color coding.
 */
import { Box, Heading, Text, Badge, VStack } from "@chakra-ui/react";

function StatCard({ label, value, badge, badgeColor = "green", children }) {
  return (
    <Box
      bg="white"
      rounded="xl"
      shadow="md"
      p={6}
      transition="all 0.3s"
      _hover={{ shadow: "lg" }}
    >
      <VStack align="start" spacing={3}>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="gray.500"
          textTransform="uppercase"
        >
          {label}
        </Text>
        {value && (
          <Heading size="lg" color="gray.800">
            {value}
          </Heading>
        )}
        {badge && (
          <Badge
            colorScheme={badgeColor}
            fontSize="sm"
            px={2}
            py={1}
            rounded="md"
          >
            {badge}
          </Badge>
        )}
        {children}
      </VStack>
    </Box>
  );
}

export default StatCard;
