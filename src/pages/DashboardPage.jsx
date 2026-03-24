/**
 * DashboardPage — The "/dashboard" route.
 * Displays BMI, diet recommendations, and exercise plan using dummy data.
 * Includes a fake loading state: "Analyzing your health data..."
 */
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  List,
  ListItem,
  ListIcon,
  Spinner,
  Progress,
  Divider,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaWeight,
  FaAppleAlt,
  FaRunning,
  FaCheckCircle,
  FaHeartbeat,
  FaFire,
  FaTint,
  FaBed,
} from "react-icons/fa";
import StatCard from "../components/StatCard";

const MotionBox = motion(Box);

// ─── BMI Utilities ───
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}

function getBMICategory(bmi) {
  const val = parseFloat(bmi);
  if (val < 18.5) return { label: "Underweight", color: "blue" };
  if (val < 25) return { label: "Normal", color: "green" };
  if (val < 30) return { label: "Overweight", color: "orange" };
  return { label: "Obese", color: "red" };
}

// ─── Dummy recommendation data based on goal ───
const DIET_PLANS = {
  lose: {
    title: "Calorie Deficit Diet",
    calories: "1,800 kcal/day",
    meals: [
      "Breakfast: Oatmeal with berries & chia seeds",
      "Snack: Greek yogurt with almonds",
      "Lunch: Grilled chicken salad with quinoa",
      "Snack: Apple slices with peanut butter",
      "Dinner: Baked salmon with steamed vegetables",
    ],
  },
  gain: {
    title: "High Protein Bulking Diet",
    calories: "2,800 kcal/day",
    meals: [
      "Breakfast: Eggs, whole wheat toast & avocado",
      "Snack: Protein shake with banana",
      "Lunch: Brown rice, chicken breast & lentils",
      "Snack: Trail mix with dried fruits",
      "Dinner: Lean beef stir-fry with sweet potato",
    ],
  },
  maintain: {
    title: "Balanced Maintenance Diet",
    calories: "2,200 kcal/day",
    meals: [
      "Breakfast: Smoothie bowl with granola",
      "Snack: Mixed nuts & a fruit",
      "Lunch: Turkey wrap with veggies",
      "Snack: Hummus with carrot sticks",
      "Dinner: Grilled fish with brown rice & broccoli",
    ],
  },
};

const EXERCISE_PLANS = {
  lose: {
    title: "Fat Burning Routine",
    sessions: "5 days/week",
    exercises: [
      "30 min brisk walking or jogging",
      "HIIT circuit (20 min)",
      "Jump rope — 3 sets of 3 min",
      "Bodyweight squats & lunges",
      "Core work — planks & bicycle crunches",
    ],
  },
  gain: {
    title: "Strength Building Routine",
    sessions: "4 days/week",
    exercises: [
      "Bench press — 4×8",
      "Deadlifts — 4×6",
      "Barbell squats — 4×8",
      "Pull-ups — 3×max",
      "Overhead press — 3×10",
    ],
  },
  maintain: {
    title: "General Fitness Routine",
    sessions: "3-4 days/week",
    exercises: [
      "Moderate jog or cycling — 30 min",
      "Full body dumbbell circuit",
      "Yoga / stretching — 20 min",
      "Swimming or hiking",
      "Core & mobility work",
    ],
  },
};

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Pull data from router state, or use defaults
  const healthData = location.state?.healthData || {
    weight: 75,
    height: 175,
    goal: "maintain",
    age: 28,
    gender: "male",
    activityLevel: "moderate",
  };

  const bmi = calculateBMI(healthData.weight, healthData.height);
  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  const goal = healthData.goal || "maintain";
  const diet = DIET_PLANS[goal] || DIET_PLANS.maintain;
  const exercise = EXERCISE_PLANS[goal] || EXERCISE_PLANS.maintain;

  // Fake loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ─── Loading Screen ───
  if (loading) {
    return (
      <Flex
        minH="calc(100vh - 64px)"
        align="center"
        justify="center"
        bg="linear-gradient(135deg, #e6f7ef 0%, #e8f4fd 100%)"
        direction="column"
        gap={6}
      >
        <Spinner size="xl" color="brand.500" thickness="4px" speed="0.65s" />
        <VStack spacing={2}>
          <Heading size="md" color="gray.700">
            Analyzing your health data...
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Generating personalized recommendations
          </Text>
        </VStack>
      </Flex>
    );
  }

  // ─── Dashboard Content ───
  return (
    <Box
      minH="calc(100vh - 64px)"
      bg="linear-gradient(135deg, #e6f7ef 0%, #e8f4fd 100%)"
      py={10}
      px={4}
    >
      <Container maxW="6xl">
        {/* Page header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={10}
        >
          <Heading size="xl" color="gray.800">
            Your Health Dashboard
          </Heading>
          <Text color="gray.500" mt={2}>
            Here are your personalized insights based on the data you provided.
          </Text>
        </MotionBox>

        {/* ─── Top Stats Row ─── */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={10}>
          {/* BMI Card */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <StatCard
              label="BMI"
              value={bmi || "—"}
              badge={bmiCategory?.label}
              badgeColor={bmiCategory?.color}
            />
          </MotionBox>

          {/* Calories */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <StatCard label="Daily Calories" value={diet.calories}>
              <Icon as={FaFire} color="orange.400" />
            </StatCard>
          </MotionBox>

          {/* Hydration */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <StatCard label="Water Intake" value="2.5 L/day">
              <Icon as={FaTint} color="blue.400" />
            </StatCard>
          </MotionBox>

          {/* Sleep */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <StatCard label="Sleep Goal" value="7-8 hrs">
              <Icon as={FaBed} color="purple.400" />
            </StatCard>
          </MotionBox>
        </SimpleGrid>

        {/* ─── BMI Progress Bar ─── */}
        <MotionBox
          bg="white"
          rounded="xl"
          shadow="md"
          p={6}
          mb={10}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Text fontWeight="semibold" color="gray.700" mb={3}>
            BMI Scale
          </Text>
          <HStack spacing={0} w="full" h={3} rounded="full" overflow="hidden">
            <Box bg="blue.300" flex={18.5} />
            <Box bg="green.400" flex={6.5} />
            <Box bg="orange.400" flex={5} />
            <Box bg="red.400" flex={10} />
          </HStack>
          <HStack justify="space-between" mt={2} fontSize="xs" color="gray.500">
            <Text>Underweight &lt;18.5</Text>
            <Text>Normal 18.5-24.9</Text>
            <Text>Overweight 25-29.9</Text>
            <Text>Obese 30+</Text>
          </HStack>
          {bmi && (
            <Text mt={3} fontSize="sm" color="gray.600">
              Your BMI of <strong>{bmi}</strong> falls in the{" "}
              <Badge colorScheme={bmiCategory.color}>{bmiCategory.label}</Badge>{" "}
              range.
            </Text>
          )}
        </MotionBox>

        {/* ─── Diet & Exercise Cards ─── */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Diet Plan */}
          <MotionBox
            bg="white"
            rounded="xl"
            shadow="md"
            p={6}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <HStack mb={4} spacing={3}>
              <Icon as={FaAppleAlt} color="green.500" boxSize={6} />
              <Heading size="md" color="gray.800">
                {diet.title}
              </Heading>
            </HStack>
            <Badge colorScheme="green" mb={4}>
              {diet.calories}
            </Badge>
            <Divider my={3} />
            <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={3}>
              Daily Meal Plan
            </Text>
            <List spacing={2}>
              {diet.meals.map((meal) => (
                <ListItem key={meal} fontSize="sm" color="gray.600">
                  <ListIcon as={FaCheckCircle} color="green.400" />
                  {meal}
                </ListItem>
              ))}
            </List>
          </MotionBox>

          {/* Exercise Plan */}
          <MotionBox
            bg="white"
            rounded="xl"
            shadow="md"
            p={6}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <HStack mb={4} spacing={3}>
              <Icon as={FaRunning} color="blue.500" boxSize={6} />
              <Heading size="md" color="gray.800">
                {exercise.title}
              </Heading>
            </HStack>
            <Badge colorScheme="blue" mb={4}>
              {exercise.sessions}
            </Badge>
            <Divider my={3} />
            <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={3}>
              Workout Routine
            </Text>
            <List spacing={2}>
              {exercise.exercises.map((ex) => (
                <ListItem key={ex} fontSize="sm" color="gray.600">
                  <ListIcon as={FaCheckCircle} color="blue.400" />
                  {ex}
                </ListItem>
              ))}
            </List>
          </MotionBox>
        </SimpleGrid>

        {/* ─── Quick Tips ─── */}
        <MotionBox
          mt={10}
          bg="white"
          rounded="xl"
          shadow="md"
          p={6}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <HStack mb={4} spacing={3}>
            <Icon as={FaHeartbeat} color="red.400" boxSize={5} />
            <Heading size="md" color="gray.800">
              Health Tips
            </Heading>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[
              "Drink at least 8 glasses of water each day.",
              "Aim for 7-8 hours of quality sleep every night.",
              "Take short walks after meals to aid digestion.",
            ].map((tip, i) => (
              <Box key={i} bg="gray.50" rounded="lg" p={4}>
                <Text fontSize="sm" color="gray.600">
                  💡 {tip}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default DashboardPage;
