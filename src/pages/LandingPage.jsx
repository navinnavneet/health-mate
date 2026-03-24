/**
 * LandingPage — The "/" route.
 * Hero section with CTA + feature cards showcasing BMI, diet, and exercise.
 */
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaWeight,
  FaAppleAlt,
  FaRunning,
  FaChartLine,
  FaShieldAlt,
  FaUserMd,
} from "react-icons/fa";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

// Wrap Chakra Box with framer-motion for animation
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const FEATURES = [
  {
    icon: FaWeight,
    title: "BMI Tracking",
    description:
      "Instantly calculate and monitor your Body Mass Index over time.",
  },
  {
    icon: FaAppleAlt,
    title: "Diet Plans",
    description: "Get personalized meal recommendations based on your goals.",
  },
  {
    icon: FaRunning,
    title: "Exercise Plans",
    description: "Tailored workout routines that match your fitness level.",
  },
  {
    icon: FaChartLine,
    title: "Progress Insights",
    description: "Track your health journey with intuitive charts and stats.",
  },
  {
    icon: FaShieldAlt,
    title: "Data Privacy",
    description: "Your health data stays private and secure — always.",
  },
  {
    icon: FaUserMd,
    title: "Expert Backed",
    description: "Recommendations grounded in evidence-based health science.",
  },
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* ─── Hero Section ─── */}
      <Box
        bg="linear-gradient(135deg, #00b164 0%, #3182ce 100%)"
        color="white"
        py={{ base: 20, md: 32 }}
        px={6}
      >
        <Container maxW="4xl" textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Text
              fontSize="sm"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={3}
              opacity={0.9}
            >
              Welcome to HealthMate
            </Text>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontWeight="extrabold"
              lineHeight="shorter"
              mb={6}
            >
              Personalized health insights,{" "}
              <Text as="span" color="yellow.300">
                built for you
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "xl" }}
              maxW="2xl"
              mx="auto"
              mb={10}
              opacity={0.9}
            >
              HealthMate analyzes your health data to deliver actionable diet
              plans, exercise routines, and wellness recommendations — all
              tailored to your unique goals.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="brand.600"
              _hover={{ bg: "gray.100", transform: "scale(1.05)" }}
              transition="all 0.2s"
              px={10}
              fontSize="lg"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* ─── Features Section ─── */}
      <Container maxW="6xl" py={{ base: 16, md: 24 }}>
        <VStack spacing={4} mb={14} textAlign="center">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="brand.500"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Features
          </Text>
          <Heading size="xl" color="gray.800">
            Everything you need for a healthier life
          </Heading>
          <Text color="gray.500" maxW="xl" mx="auto">
            From tracking BMI to personalized meal and workout plans —
            HealthMate has you covered.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {FEATURES.map((feature, idx) => (
            <MotionBox
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* ─── CTA Band ─── */}
      <Box bg="brand.500" py={16} px={6}>
        <Container maxW="3xl" textAlign="center">
          <Heading size="lg" color="white" mb={4}>
            Ready to take control of your health?
          </Heading>
          <Text color="whiteAlpha.900" mb={8}>
            Join thousands of users who trust HealthMate for daily health
            guidance.
          </Text>
          <Button
            size="lg"
            bg="white"
            color="brand.600"
            _hover={{ bg: "gray.100" }}
            px={10}
            onClick={() => navigate("/auth")}
          >
            Get Started — It's Free
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default LandingPage;
