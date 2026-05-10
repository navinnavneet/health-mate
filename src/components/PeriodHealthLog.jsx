import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Textarea,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Select,
  Checkbox,
  Badge,
  Divider,
  Icon,
  SimpleGrid,
  Tag,
  TagLabel,
  Spinner,
} from "@chakra-ui/react";
import { FaVenus, FaPlus, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getPeriodLogs, createPeriodLog, updatePeriodLog } from "../services/api.js";

const MotionBox = motion(Box);

const SYMPTOMS = [
  "Cramping",
  "Bloating",
  "Headache",
  "Mood Swings",
  "Fatigue",
  "Back Pain",
  "Nausea",
  "Breast Tenderness",
];

const FLOW_COLORS = { light: "blue", medium: "pink", heavy: "red" };

function today() {
  return new Date().toISOString().split("T")[0];
}

function predictNext(cycles) {
  const completed = cycles.filter((c) => c.startDate && c.endDate);
  if (completed.length < 2) return null;

  const sorted = [...completed].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );
  let total = 0;
  let count = 0;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (new Date(sorted[i].startDate) - new Date(sorted[i - 1].startDate)) /
        86400000
    );
    if (diff >= 14 && diff <= 60) {
      total += diff;
      count++;
    }
  }
  if (count === 0) return null;

  const avgCycle = Math.round(total / count);
  const lastStart = new Date(sorted[sorted.length - 1].startDate);
  const nextStart = new Date(lastStart);
  nextStart.setDate(nextStart.getDate() + avgCycle);
  return { date: nextStart.toISOString().split("T")[0], avgCycle };
}

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysBetween(d1, d2) {
  return Math.round((new Date(d2) - new Date(d1)) / 86400000);
}

export default function PeriodHealthLog() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState("");
  const [flow, setFlow] = useState("medium");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");

  const todayStr = today();
  const activeCycle = logs.find((l) => !l.endDate || l.endDate >= todayStr);
  const prediction = predictNext(logs);

  useEffect(() => {
    getPeriodLogs(token)
      .then(setLogs)
      .catch(() => {})
      .finally(() => setLoadingLogs(false));
  }, [token]);

  function openNew() {
    setEditingId(null);
    setStartDate(today());
    setEndDate("");
    setFlow("medium");
    setSymptoms([]);
    setNotes("");
    onOpen();
  }

  function openEdit(cycle) {
    setEditingId(cycle.id);
    setStartDate(cycle.startDate);
    setEndDate(cycle.endDate || "");
    setFlow(cycle.flow);
    setSymptoms(cycle.symptoms || []);
    setNotes(cycle.notes || "");
    onOpen();
  }

  function toggleSymptom(s) {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function save() {
    setSaving(true);
    const payload = {
      startDate,
      endDate: endDate || null,
      flow,
      symptoms,
      notes,
    };
    try {
      if (editingId) {
        const updated = await updatePeriodLog(token, editingId, payload);
        setLogs((prev) => prev.map((l) => (l.id === editingId ? updated : l)));
      } else {
        const created = await createPeriodLog(token, payload);
        setLogs((prev) => [created, ...prev]);
      }
      onClose();
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
    }
  }

  const sorted = [...logs].sort((a, b) =>
    b.startDate.localeCompare(a.startDate)
  );

  return (
    <MotionBox
      bg="white"
      rounded="xl"
      shadow="md"
      p={6}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.0 }}
    >
      <HStack justify="space-between" mb={4}>
        <HStack spacing={3}>
          <Icon as={FaVenus} color="pink.500" boxSize={5} />
          <Heading size="md" color="gray.800">
            Period Health Log
          </Heading>
        </HStack>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="pink"
          size="sm"
          onClick={openNew}
        >
          Log Period
        </Button>
      </HStack>

      <Divider mb={4} />

      {loadingLogs ? (
        <HStack justify="center" py={4}>
          <Spinner size="sm" color="pink.400" />
          <Text fontSize="sm" color="gray.500">
            Loading logs...
          </Text>
        </HStack>
      ) : (
        <>
          {prediction && (
            <Box bg="pink.50" rounded="lg" p={4} mb={4}>
              <HStack spacing={3}>
                <Icon as={FaCalendarAlt} color="pink.400" />
                <Text
                  fontSize="sm"
                  color="pink.700"
                  fontWeight="semibold"
                >
                  Predicted Next Period: {fmtDate(prediction.date)}
                </Text>
                <Badge colorScheme="pink" fontSize="xs">
                  ~{prediction.avgCycle}-day cycle
                </Badge>
              </HStack>
            </Box>
          )}

          {activeCycle && (
            <Box bg="red.50" rounded="lg" p={4} mb={4}>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="semibold" color="red.700">
                  Current / Recent Cycle
                </Text>
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => openEdit(activeCycle)}
                >
                  Edit
                </Button>
              </HStack>
              <HStack spacing={4} flexWrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Started: <strong>{fmtDate(activeCycle.startDate)}</strong>
                </Text>
                {activeCycle.endDate ? (
                  <Text fontSize="sm" color="gray.600">
                    Ended: <strong>{fmtDate(activeCycle.endDate)}</strong> (
                    {daysBetween(activeCycle.startDate, activeCycle.endDate)}{" "}
                    days)
                  </Text>
                ) : (
                  <Badge colorScheme="red">Ongoing</Badge>
                )}
                <Badge colorScheme={FLOW_COLORS[activeCycle.flow]}>
                  {activeCycle.flow} flow
                </Badge>
              </HStack>
              {activeCycle.symptoms?.length > 0 && (
                <HStack mt={2} flexWrap="wrap" spacing={1}>
                  {activeCycle.symptoms.map((s) => (
                    <Tag key={s} size="sm" colorScheme="red" variant="subtle">
                      <TagLabel>{s}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              )}
            </Box>
          )}

          {sorted.length === 0 ? (
            <Box bg="gray.50" rounded="lg" p={4} textAlign="center">
              <Text fontSize="sm" color="gray.500">
                No period logs yet. Track your cycle to see patterns.
              </Text>
            </Box>
          ) : (
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                Cycle History
              </Text>
              {sorted.slice(0, 5).map((cycle) => (
                <HStack
                  key={cycle.id}
                  bg="gray.50"
                  rounded="lg"
                  p={3}
                  justify="space-between"
                  flexWrap="wrap"
                >
                  <HStack spacing={3} flexWrap="wrap">
                    <Text fontSize="sm" color="gray.700">
                      {fmtDate(cycle.startDate)}
                    </Text>
                    {cycle.endDate && (
                      <>
                        <Text fontSize="sm" color="gray.400">
                          →
                        </Text>
                        <Text fontSize="sm" color="gray.700">
                          {fmtDate(cycle.endDate)}
                        </Text>
                        <Badge colorScheme="gray" fontSize="xs">
                          {daysBetween(cycle.startDate, cycle.endDate)}d
                        </Badge>
                      </>
                    )}
                    <Badge colorScheme={FLOW_COLORS[cycle.flow]} fontSize="xs">
                      {cycle.flow}
                    </Badge>
                  </HStack>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="pink"
                    onClick={() => openEdit(cycle)}
                  >
                    Edit
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FaVenus} color="pink.500" />
              <Text>{editingId ? "Edit Period Log" : "Log New Period"}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5} pb={2}>
              <SimpleGrid columns={2} spacing={4} w="full">
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.700"
                    mb={1}
                  >
                    Start Date
                  </Text>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="sm"
                  />
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.700"
                    mb={1}
                  >
                    End Date (optional)
                  </Text>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="sm"
                  />
                </Box>
              </SimpleGrid>

              <Box w="full">
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={1}
                >
                  Flow Intensity
                </Text>
                <Select
                  value={flow}
                  onChange={(e) => setFlow(e.target.value)}
                  size="sm"
                >
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </Select>
              </Box>

              <Box w="full">
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={2}
                >
                  Symptoms
                </Text>
                <SimpleGrid columns={2} spacing={2}>
                  {SYMPTOMS.map((s) => (
                    <Checkbox
                      key={s}
                      isChecked={symptoms.includes(s)}
                      onChange={() => toggleSymptom(s)}
                      colorScheme="pink"
                    >
                      <Text fontSize="sm">{s}</Text>
                    </Checkbox>
                  ))}
                </SimpleGrid>
              </Box>

              <Box w="full">
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={1}
                >
                  Notes (optional)
                </Text>
                <Textarea
                  placeholder="Any additional observations..."
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
              colorScheme="pink"
              onClick={save}
              isDisabled={!startDate}
              isLoading={saving}
              loadingText="Saving..."
            >
              {editingId ? "Update" : "Save Log"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
}
