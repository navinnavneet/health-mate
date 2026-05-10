/**
 * AuthPage — The "/auth" route.
 * Connects to the backend for signup and login.
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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaHeartbeat } from "react-icons/fa";
import { registerUser, loginUser, getProfile } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const MotionBox = motion(Box);

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    const hasProfile = Boolean(localStorage.getItem(`fitsense_profile_${user.id}`));
    return <Navigate to={hasProfile ? "/dashboard" : "/form"} replace />;
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);

      login(response.user, response.token);

      if (!isLogin) {
        // New signup — always collect health data first
        navigate("/form", { replace: true });
      } else {
        // Returning user — check if they already have a profile
        try {
          const profile = await getProfile(response.token);
          localStorage.setItem(`fitsense_profile_${response.user.id}`, JSON.stringify(profile));
          navigate("/dashboard", { replace: true });
        } catch {
          navigate("/form", { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || "Unable to authenticate.");
    } finally {
      setLoading(false);
    }
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

          {error && (
            <Alert status="error" mb={6} rounded="lg">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {!isLogin && (
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.400">
                    <FaUser />
                  </InputLeftElement>
                  <Input
                    placeholder="Full name"
                    type="text"
                    size="lg"
                    value={form.name}
                    onChange={handleChange("name")}
                  />
                </InputGroup>
              )}

              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.400">
                  <FaEnvelope />
                </InputLeftElement>
                <Input
                  placeholder="Email address"
                  type="email"
                  size="lg"
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.400">
                  <FaLock />
                </InputLeftElement>
                <Input
                  placeholder="Password"
                  type="password"
                  size="lg"
                  value={form.password}
                  onChange={handleChange("password")}
                />
              </InputGroup>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                w="full"
                mt={2}
                isLoading={loading}
                loadingText={isLogin ? "Logging in" : "Signing up"}
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
              >
                {isLogin ? "Log In" : "Sign Up"}
              </Button>
            </VStack>
          </form>

          <Box position="relative" py={6}>
            <Divider />
            <AbsoluteCenter bg="white" px={3}>
              <Text fontSize="sm" color="gray.400">
                OR
              </Text>
            </AbsoluteCenter>
          </Box>

          <HStack justify="center" fontSize="sm">
            <Text color="gray.500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <Button
              variant="link"
              colorScheme="brand"
              size="sm"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
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
