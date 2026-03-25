import { useState } from "react";
import { useParams } from "react-router";
import {
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Button,
  TextField,
  Chip
} from "@mui/material";
import { Flag } from "@mui/icons-material";
import { RoomsTable } from "./rooms-table";
import { ScheduleRoomsTable } from "./schedule-rooms-table";
import { ScheduleTechniciansTable } from "./schedule-technicians-table";
import { TechniciansTable } from "./technicians-table";
import { assignmentRuns, roomAssignments } from "../data/mockData";

export function RunDetailPage() {
  const { runId } = useParams<{ runId: string }>();
  const [activeTab, setActiveTab] = useState(0);
  
  // Filters for Rooms view
  const [roomFilter, setRoomFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [townFilter, setTownFilter] = useState("all");
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [sessionNrFilter, setSessionNrFilter] = useState("");
  
  // Filters for Technicians view
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [technicianNameFilter, setTechnicianNameFilter] = useState("all");
  const [techServiceTypeFilter, setTechServiceTypeFilter] = useState("all");

  // Find the run details
  const run = assignmentRuns.find((r) => r.id === runId);

  if (!run) {
    return (
      <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "background.default" }}>
        <Typography variant="h5">Run not found</Typography>
      </Box>
    );
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Reset filters when switching tabs
    if (newValue === 0) {
      setRoomFilter("all");
      setServiceTypeFilter("all");
      setTownFilter("all");
      setTechnicianFilter("all");
      setSessionNrFilter("");
    } else {
      setDayFilter("all");
      setStatusFilter("all");
      setTechnicianNameFilter("all");
      setTechServiceTypeFilter("all");
    }
  };

  const handleFlag = () => {
    console.log("Flag action triggered");
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const technicianStatuses = ["Available", "Fully Booked", "Overbooked"];
  
  // Get unique values for filters
  const rooms = Array.from(new Set(roomAssignments.map((r) => r.room)));
  const towns = Array.from(new Set(roomAssignments.map((r) => r.town)));
  const serviceTypes = ["REG", "MOB"];
  const sessionNumbers = Array.from(new Set(roomAssignments.map((r) => r.sessionNr)));
  const technicians = Array.from(
    new Set(roomAssignments.flatMap((r) => r.assignedTechnicians))
  ).filter(Boolean);

   const getModeBadgeVariant = (mode: string) => {
    switch (mode) {
      case "Fixed":
        return { variant: "filled" as const, color: "primary" as const };
      case "Continuous":
        return { 
          variant: "filled" as const, 
          sx: { 
            backgroundColor: "#22c55e", 
            color: "white",
            fontWeight: 500
          } 
        };
      default:
        return { variant: "outlined" as const, color: "default" as const };
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {run.id} - {run.description}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Week: {run.weekOfRun} | Mode:  <Chip
                        {...getModeBadgeVariant(run.mode)}
                        label={run.mode}
                      /> | Score: <b>{run.score.toFixed(1)}</b>
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Flag />}
          onClick={handleFlag}
          sx={{ 
            minWidth: 120,
            backgroundColor: "#22c55e",
            color: "white",
            "&:hover": {
              backgroundColor: "#16a34a"
            }
          }}
        >
          Flag
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Rooms" />
          <Tab label="Technicians" />
        </Tabs>
      </Paper>

      {/* Filters */}
      {activeTab === 0 ? (
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Rooms</InputLabel>
            <Select
              value={roomFilter}
              label="Rooms"
              onChange={(e) => setRoomFilter(e.target.value)}
            >
              <MenuItem value="all">All Rooms</MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room} value={room}>
                  {room}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Service Type</InputLabel>
            <Select
              value={serviceTypeFilter}
              label="Service Type"
              onChange={(e) => setServiceTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              {serviceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Town</InputLabel>
            <Select
              value={townFilter}
              label="Town"
              onChange={(e) => setTownFilter(e.target.value)}
            >
              <MenuItem value="all">All Locations</MenuItem>
              {towns.map((town) => (
                <MenuItem key={town} value={town}>
                  {town}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Assigned Technicians</InputLabel>
            <Select
              value={technicianFilter}
              label="Assigned Technicians"
              onChange={(e) => setTechnicianFilter(e.target.value)}
            >
              <MenuItem value="all">All Technicians</MenuItem>
              {technicians.map((tech) => (
                <MenuItem key={tech} value={tech}>
                  {tech}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Session Nr</InputLabel>
            <Select
              value={sessionNrFilter}
              label="Session Nr"
              onChange={(e) => setSessionNrFilter(e.target.value)}
            >
              <MenuItem value="">All Sessions</MenuItem>
              {sessionNumbers.map((sessionNr) => (
                <MenuItem key={sessionNr} value={sessionNr}>
                  {sessionNr}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Day</InputLabel>
            <Select
              value={dayFilter}
              label="Day"
              onChange={(e) => setDayFilter(e.target.value)}
            >
              <MenuItem value="all">All Days</MenuItem>
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {technicianStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Technician Name</InputLabel>
            <Select
              value={technicianNameFilter}
              label="Technician Name"
              onChange={(e) => setTechnicianNameFilter(e.target.value)}
            >
              <MenuItem value="all">All Technicians</MenuItem>
              {technicians.map((tech) => (
                <MenuItem key={tech} value={tech}>
                  {tech}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Service Type</InputLabel>
            <Select
              value={techServiceTypeFilter}
              label="Service Type"
              onChange={(e) => setTechServiceTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              {serviceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Tables */}
      {activeTab === 0 && (
        <ScheduleRoomsTable
          roomFilter={roomFilter}
          serviceTypeFilter={serviceTypeFilter}
          townFilter={townFilter}
          technicianFilter={technicianFilter}
          sessionNrFilter={sessionNrFilter}
        />
      )}
      {activeTab === 1 && (
        <ScheduleTechniciansTable dayFilter={dayFilter} statusFilter={statusFilter} />
      )}
    </Box>
  );
}