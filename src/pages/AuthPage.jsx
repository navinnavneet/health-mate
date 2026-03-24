/**
 * AuthPage — The "/auth" route.
 * Toggle between Login and Signup forms.
 * No real authentication — just UI + navigation to the health form.
 */
import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  InputGroup,
  InputLeftElement,
  Divider,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaHeartbeat } from "react-icons/fa";

const MotionBox = motion(Box);

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Just navigate — no real auth
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/form");
  };

  return (
    <Box
      minH="calc(100vh - 64px)"
      bg="linear-gradient(135deg, #e6f7ef 0%, #e8f4fd 100%)"
      display="flex"
      alignItems="center"
      py={12}
    >
      <Container maxW="md">
        <MotionBox
          bg="white"
          rounded="2xl"
          shadow="xl"
          p={{ base: 8, md: 10 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <VStack spacing={2} mb={8}>
            <Box color="brand.500" fontSize="3xl">
              <FaHeartbeat />
            </Box>
            <Heading size="lg" color="gray.800">
              {isLogin ? "Welcome back" : "Create your account"}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {isLogin
                ? "Log in to access your health dashboard"
                : "Sign up to get personalized health insights"}
            </Text>
          </VStack>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {/* Show name field only for Signup */}
              {!isLogin && (
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.400">
                    <FaUser />
                  </InputLeftElement>
                  <Input placeholder="Full name" type="text" size="lg" />
                </InputGroup>
              )}

              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.400">
                  <FaEnvelope />
                </InputLeftElement>
                <Input placeholder="Email address" type="email" size="lg" />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.400">
                  <FaLock />
                </InputLeftElement>
                <Input placeholder="Password" type="password" size="lg" />
              </InputGroup>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                w="full"
                mt={2}
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
              >
                {isLogin ? "Log In" : "Sign Up"}
              </Button>
            </VStack>
          </form>

          {/* Divider */}
          <Box position="relative" py={6}>
            <Divider />
            <AbsoluteCenter bg="white" px={3}>
              <Text fontSize="sm" color="gray.400">
                OR
              </Text>
            </AbsoluteCenter>
          </Box>

          {/* Toggle between login / signup */}
          <HStack justify="center" fontSize="sm">
            <Text color="gray.500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <Button
              variant="link"
              colorScheme="brand"
              size="sm"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </Button>
          </HStack>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default AuthPage;
