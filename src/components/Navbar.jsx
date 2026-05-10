/**
 * Navbar — Persistent navigation bar across all pages.
 * Displays the FitSense brand name and navigation links.
 * Responsive: collapses into a hamburger menu on mobile.
 */
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { FaHeartbeat, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext.jsx";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
];

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box bg="white" px={6} shadow="sm" position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Brand */}
        <HStack
          as={RouterLink}
          to="/"
          spacing={2}
          _hover={{ textDecoration: "none" }}
        >
          <Box color="brand.500" fontSize="xl">
            <FaHeartbeat />
          </Box>
          <Text fontSize="xl" fontWeight="bold" color="brand.600">
            FitSense
          </Text>
        </HStack>

        {/* Desktop links */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.to}
              as={RouterLink}
              to={link.to}
              variant={location.pathname === link.to ? "solid" : "ghost"}
              colorScheme="brand"
              size="sm"
            >
              {link.label}
            </Button>
          ))}
          {isAuthenticated ? (
            <>
              <Text fontSize="sm" color="gray.600">
                Hello, {user?.name?.split(" ")[0] || "User"}
              </Text>
              <Button
                onClick={handleLogout}
                variant="outline"
                colorScheme="brand"
                size="sm"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              as={RouterLink}
              to="/auth"
              variant="outline"
              colorScheme="brand"
              size="sm"
            >
              Login
            </Button>
          )}
        </HStack>

        {/* Mobile hamburger */}
        <IconButton
          size="md"
          icon={isOpen ? <FaTimes /> : <FaBars />}
          aria-label="Toggle menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          variant="ghost"
        />
      </Flex>

      {/* Mobile menu */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={3}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                as={RouterLink}
                to={link.to}
                variant="ghost"
                colorScheme="brand"
                justifyContent="flex-start"
                onClick={onClose}
              >
                {link.label}
              </Button>
            ))}
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                variant="outline"
                colorScheme="brand"
              >
                Logout
              </Button>
            ) : (
              <Button
                as={RouterLink}
                to="/auth"
                variant="outline"
                colorScheme="brand"
                onClick={onClose}
              >
                Login
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default Navbar;
