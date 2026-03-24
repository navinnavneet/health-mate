/**
 * HealthFormPage — The "/form" route.
 * Collects user health data (age, gender, height, weight, activity, goal).
 * On submit → navigates to /dashboard with the form data via location state.
 */
import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Progress,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";

const MotionBox = motion(Box);

// Default form values
const INITIAL_FORM = {
  age: "",
  gender: "",
  height: "",
  weight: "",
  activityLevel: "",
  goal: "",
};

// Compute how many fields are filled for the progress bar
function getProgress(form) {
  const fields = Object.values(form);
  const filled = fields.filter((v) => v !== "").length;
  return Math.round((filled / fields.length) * 100);
}

function HealthFormPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass form data to the dashboard via router state
    navigate("/dashboard", { state: { healthData: form } });
  };

  const progress = getProgress(form);

  return (
    <Box
      minH="calc(100vh - 64px)"
      bg="linear-gradient(135deg, #e6f7ef 0%, #e8f4fd 100%)"
      py={12}
      px={4}
    >
      <Container maxW="2xl">
        <MotionBox
          bg="white"
          rounded="2xl"
          shadow="xl"
          p={{ base: 6, md: 10 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <VStack spacing={2} mb={6} textAlign="center">
            <Box color="brand.500" fontSize="2xl">
              <FaClipboardList />
            </Box>
            <Heading size="lg" color="gray.800">
              Tell us about yourself
            </Heading>
            <Text color="gray.500" fontSize="sm">
              We'll use this information to generate personalized health
              recommendations.
            </Text>
          </VStack>

          {/* Progress indicator */}
          <Box mb={6}>
            <Text fontSize="xs" color="gray.500" mb={1}>
              {progress}% complete
            </Text>
            <Progress
              value={progress}
              size="sm"
              colorScheme="brand"
              rounded="full"
              hasStripe
              isAnimated
            />
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
                {/* Age */}
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color="gray.600">
                    Age
                  </FormLabel>
                  <NumberInput
                    min={1}
                    max={120}
                    value={form.age}
                    onChange={handleChange("age")}
                  >
                    <NumberInputField placeholder="e.g. 25" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                {/* Gender */}
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color="gray.600">
                    Gender
                  </FormLabel>
                  <Select
                    placeholder="Select gender"
                    value={form.gender}
                    onChange={handleChange("gender")}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>

                {/* Height */}
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color="gray.600">
                    Height (cm)
                  </FormLabel>
                  <NumberInput
                    min={50}
                    max={300}
                    value={form.height}
                    onChange={handleChange("height")}
                  >
                    <NumberInputField placeholder="e.g. 175" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                {/* Weight */}
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color="gray.600">
                    Weight (kg)
                  </FormLabel>
                  <NumberInput
                    min={20}
                    max={300}
                    value={form.weight}
                    onChange={handleChange("weight")}
                  >
                    <NumberInputField placeholder="e.g. 70" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              {/* Activity Level */}
              <FormControl isRequired>
                <FormLabel fontSize="sm" color="gray.600">
                  Activity Level
                </FormLabel>
                <Select
                  placeholder="Select activity level"
                  value={form.activityLevel}
                  onChange={handleChange("activityLevel")}
                >
                  <option value="sedentary">
                    Sedentary (little or no exercise)
                  </option>
                  <option value="light">Lightly active (1-3 days/week)</option>
                  <option value="moderate">
                    Moderately active (3-5 days/week)
                  </option>
                  <option value="active">Very active (6-7 days/week)</option>
                  <option value="extreme">
                    Extremely active (athlete level)
                  </option>
                </Select>
              </FormControl>

              {/* Goal */}
              <FormControl isRequired>
                <FormLabel fontSize="sm" color="gray.600">
                  Health Goal
                </FormLabel>
                <Select
                  placeholder="Select your goal"
                  value={form.goal}
                  onChange={handleChange("goal")}
                >
                  <option value="lose">Lose weight</option>
                  <option value="gain">Gain muscle</option>
                  <option value="maintain">Maintain weight</option>
                </Select>
              </FormControl>

              {/* Submit */}
              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                w="full"
                mt={4}
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
              >
                Analyze My Health
              </Button>
            </VStack>
          </form>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default HealthFormPage;
