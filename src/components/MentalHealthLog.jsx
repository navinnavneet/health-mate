import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Badge,
  Divider,
  Icon,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { FaBrain, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getMentalLogs, saveMentalLog } from "../services/api.js";

const MotionBox = motion(Box);

const MOOD = [
  { label: "Very Bad", emoji: "😞", color: "red" },
  { label: "Bad", emoji: "😟", color: "orange" },
  { label: "Neutral", emoji: "😐", color: "yellow" },
  { label: "Good", emoji: "🙂", color: "teal" },
  { label: "Great", emoji: "😄", color: "green" },
];

const STRESS = ["Very Low", "Low", "Moderate", "High", "Very High"];
const ENERGY = ["Exhausted", "Tired", "Normal", "Energized", "Pumped"];

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function MentalHealthLog() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [notes, setNotes] = useState("");

  const todayStr = today();
  const todayLog = logs.find((l) => l.date === todayStr);

  useEffect(() => {
    getMentalLogs(token)
      .then(setLogs)
      .catch(() => {})
      .finally(() => setLoadingLogs(false));
  }, [token]);

  function openModal() {
    if (todayLog) {
      setMood(todayLog.mood);
      setStress(todayLog.stress);
      setEnergy(todayLog.energy);
      setNotes(todayLog.notes);
    } else {
      setMood(3);
      setStress(3);
      setEnergy(3);
      setNotes("");
    }
    onOpen();
  }

  async function save() {
    setSaving(true);
    try {
      const saved = await saveMentalLog(token, {
        date: todayStr,
        mood,
        stress,
        energy,
        notes,
      });
      setLogs((prev) =>
        prev.find((l) => l.date === todayStr)
          ? prev.map((l) => (l.date === todayStr ? saved : l))
          : [saved, ...prev]
      );
      onClose();
    } catch {
      // Silent fail — show stale data
    } finally {
      setSaving(false);
    }
  }

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const log = logs.find((l) => l.date === dateStr);
    const dayLabel =
      i === 0 ? "Today" : d.toLocaleDateString("en", { weekday: "short" });
    return { dateStr, log, dayLabel };
  });

  return (
    <MotionBox
      bg="white"
      rounded="xl"
      shadow="md"
      p={6}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.9 }}
    >
      <HStack justify="space-between" mb={4}>
        <HStack spacing={3}>
          <Icon as={FaBrain} color="purple.500" boxSize={5} />
          <Heading size="md" color="gray.800">
            Mental Health Log
          </Heading>
        </HStack>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="purple"
          size="sm"
          onClick={openModal}
        >
          {todayLog ? "Update Today" : "Log Today"}
        </Button>
      </HStack>

      <Divider mb={4} />

      {loadingLogs ? (
        <HStack justify="center" py={4}>
          <Spinner size="sm" color="purple.400" />
          <Text fontSize="sm" color="gray.500">
            Loading logs...
          </Text>
        </HStack>
      ) : (
        <>
          <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={3}>
            Last 7 Days
          </Text>
          <HStack spacing={2} flexWrap="wrap">
            {last7.map(({ dateStr, log, dayLabel }) => (
              <Tooltip
                key={dateStr}
                label={`${dayLabel}: ${log ? MOOD[log.mood - 1].label : "Not logged"}`}
                hasArrow
              >
                <Box
                  textAlign="center"
                  bg={log ? `${MOOD[log.mood - 1].color}.50` : "gray.50"}
                  rounded="lg"
                  p={2}
                  minW="48px"
                  cursor="default"
                >
                  <Text fontSize="xl">
                    {log ? MOOD[log.mood - 1].emoji : "—"}
                  </Text>
                  <Text fontSize="10px" color="gray.500">
                    {dayLabel}
                  </Text>
                </Box>
              </Tooltip>
            ))}
          </HStack>

          {todayLog ? (
            <Box bg="purple.50" rounded="lg" p={4} mt={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="purple.700"
                mb={2}
              >
                Today's Entry
              </Text>
              <HStack spacing={4} flexWrap="wrap">
                <HStack>
                  <Text fontSize="sm" color="gray.600">
                    Mood:
                  </Text>
                  <Badge colorScheme={MOOD[todayLog.mood - 1].color}>
                    {MOOD[todayLog.mood - 1].emoji} {MOOD[todayLog.mood - 1].label}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontSize="sm" color="gray.600">
                    Stress:
                  </Text>
                  <Badge colorScheme="orange">{STRESS[todayLog.stress - 1]}</Badge>
                </HStack>
                <HStack>
                  <Text fontSize="sm" color="gray.600">
                    Energy:
                  </Text>
                  <Badge colorScheme="blue">{ENERGY[todayLog.energy - 1]}</Badge>
                </HStack>
              </HStack>
              {todayLog.notes && (
                <Text
                  fontSize="sm"
                  color="gray.600"
                  mt={2}
                  fontStyle="italic"
                >
                  "{todayLog.notes}"
                </Text>
              )}
            </Box>
          ) : (
            <Box bg="gray.50" rounded="lg" p={4} mt={4} textAlign="center">
              <Text fontSize="sm" color="gray.500">
                No entry for today yet.{" "}
                <Text
                  as="span"
                  color="purple.500"
                  cursor="pointer"
                  onClick={openModal}
                >
                  How are you feeling?
                </Text>
              </Text>
            </Box>
          )}
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FaBrain} color="purple.500" />
              <Text>
                {todayLog ? "Update Mental Health Log" : "Log Mental Health"}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} pb={2}>
              <Box w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Mood
                  </Text>
                  <Badge colorScheme={MOOD[mood - 1].color}>
                    {MOOD[mood - 1].emoji} {MOOD[mood - 1].label}
                  </Badge>
                </HStack>
                <Slider
                  value={mood}
                  min={1}
                  max={5}
                  step={1}
                  onChange={setMood}
                  colorScheme="purple"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs" color="gray.400">
                    Very Bad
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Great
                  </Text>
                </HStack>
              </Box>

              <Box w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Stress Level
                  </Text>
                  <Badge colorScheme="orange">{STRESS[stress - 1]}</Badge>
                </HStack>
                <Slider
                  value={stress}
                  min={1}
                  max={5}
                  step={1}
                  onChange={setStress}
                  colorScheme="orange"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs" color="gray.400">
                    Very Low
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Very High
                  </Text>
                </HStack>
              </Box>

              <Box w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Energy Level
                  </Text>
                  <Badge colorScheme="blue">{ENERGY[energy - 1]}</Badge>
                </HStack>
                <Slider
                  value={energy}
                  min={1}
                  max={5}
                  step={1}
                  onChange={setEnergy}
                  colorScheme="blue"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs" color="gray.400">
                    Exhausted
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Pumped
                  </Text>
                </HStack>
              </Box>

              <Box w="full">
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={2}
                >
                  Notes (optional)
                </Text>
                <Textarea
                  placeholder="How are you feeling today? Any thoughts or observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  resize="vertical"
                  fontSize="sm"
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={save}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save Log
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
}
