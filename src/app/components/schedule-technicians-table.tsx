import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { technicians, roomAssignments } from "../data/mockData";

interface TechnicianScheduleBlock {
  id: string;
  technician: string;
  day: string;
  startTime: number; // Hour (1-24)
  endTime: number; // Hour (1-24)
  type: "unavailable" | "mob-location" | "assignment";
  location?: string;
  session?: string;
  room?: string;
  sessionNr?: string;
  serviceType?: string;
  requester?: string;
  status?: string;
  detailedTime?: string;
}

// Convert room assignments to technician schedule blocks
const generateTechnicianScheduleBlocks = (): TechnicianScheduleBlock[] => {
  const blocks: TechnicianScheduleBlock[] = [];
  
  // Create assignment blocks from room assignments
  roomAssignments.forEach((assignment) => {
    assignment.assignedTechnicians.forEach((techName) => {
      const startHour = parseInt(assignment.startTime.split(":")[0]);
      const endHour = parseInt(assignment.endTime.split(":")[0]);
      
      blocks.push({
        id: `${assignment.id}-${techName}`,
        technician: techName,
        day: assignment.day,
        startTime: startHour,
        endTime: endHour,
        type: "assignment",
        session: assignment.session,
        location: assignment.location || "Brussels",
        room: assignment.room,
        sessionNr: assignment.sessionNr,
        serviceType: assignment.serviceType || "REG",
        status: assignment.status || "APR",
        detailedTime: `${assignment.startTime}-${assignment.endTime}`,
      });
    });
  });

  // Add unavailable time slots from technician data
  technicians.forEach((tech) => {
    // Add unavailable days
    tech.unavailableDays?.forEach((day) => {
      blocks.push({
        id: `unavailable-${tech.name}-${day}`,
        technician: tech.name,
        day: day,
        startTime: 1,
        endTime: 24,
        type: "unavailable",
      });
    });

    // Add unavailable time slots
    tech.unavailableTimeSlots?.forEach((slot) => {
      const parts = slot.split("-");
      if (parts.length >= 3) {
        const day = parts[0];
        const startTime = parts[1];
        const endTime = parts[2];
        const startHour = parseInt(startTime.split(":")[0]);
        const endHour = parseInt(endTime.split(":")[0]);

        blocks.push({
          id: `unavailable-${tech.name}-${slot}`,
          technician: tech.name,
          day: day,
          startTime: startHour,
          endTime: endHour,
          type: "unavailable",
        });
      }
    });
  });

  // Add MOB location blocks for John Smith and David Chen
  const mobTechnicians = ["John Smith", "David Chen"];
  const mobDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  mobTechnicians.forEach((techName) => {
    mobDays.forEach((day, index) => {
      // For Monday, start at 13:00
      // For Tuesday-Thursday, full day coverage
      // For Friday, end at 13:00
      let startTime = 1;
      let endTime = 24;
      
      if (day === "Monday") {
        startTime = 13;
      } else if (day === "Friday") {
        endTime = 13;
      }
      
      blocks.push({
        id: `mob-${techName}-${day}`,
        technician: techName,
        day: day,
        startTime: startTime,
        endTime: endTime,
        type: "mob-location",
        location: "Brussels",
        session: "Sonorisations projections",
        detailedTime: day === "Monday" ? "13:00-24:00" : day === "Friday" ? "01:00-13:00" : "01:00-24:00",
      });
    });
  });

  return blocks;
};

// Mock data for technician schedules
const technicianScheduleBlocks: TechnicianScheduleBlock[] = generateTechnicianScheduleBlocks();

// Get unique technician names
const getTechnicianNames = (): string[] => {
  const names = new Set<string>();
  technicianScheduleBlocks.forEach((block) => names.add(block.technician));
  return Array.from(names).sort();
}

;

interface ScheduleTechniciansTableProps {
  dayFilter?: string;
  statusFilter?: string;
  technicianFilter?: string;
  serviceTypeFilter?: string;
}

export function ScheduleTechniciansTable({ 
  dayFilter = "all",
  statusFilter = "all",
  technicianFilter = "all",
  serviceTypeFilter = "all"
}: ScheduleTechniciansTableProps) {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [1, 5, 9, 13, 17, 21];

  // Helper to format date headers
  const getDateHeader = (day: string, weekNumber: number = 12): string => {
    // Starting from Mon 18/03/2024 (Week 12)
    const baseDate = new Date(2024, 2, 18); // March 18, 2024
    const dayIndex = weekDays.indexOf(day);
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayIndex);
    
    const dayShort = day.substring(0, 3);
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    return `${dayShort} ${dateStr}`;
  };

  // Get blocks for a specific technician, day, and time slot
  const getBlocksForSlot = (
    technician: string,
    day: string,
    timeSlot: number,
    rowType: "assignments" | "mob"
  ): TechnicianScheduleBlock[] => {
    return technicianScheduleBlocks.filter(
      (block) =>
        block.technician === technician &&
        block.day === day &&
        block.startTime <= timeSlot &&
        block.endTime > timeSlot &&
        (rowType === "assignments" ? block.type !== "mob-location" : block.type === "mob-location")
    );
  };

  // Check if a technician has MOB blocks
  const hasMobBlocks = (technician: string): boolean => {
    return technicianScheduleBlocks.some(
      (block) => block.technician === technician && block.type === "mob-location"
    );
  };

  const renderTimeSlotCell = (technician: string, day: string, timeSlot: number, rowType: "assignments" | "mob") => {
    const blocks = getBlocksForSlot(technician, day, timeSlot, rowType);
    
    if (blocks.length === 0) {
      return null;
    }

    // Render blocks - priority: assignment > mob-location > unavailable
    const assignment = blocks.find((b) => b.type === "assignment");
    const mobLocation = blocks.find((b) => b.type === "mob-location");
    const unavailable = blocks.find((b) => b.type === "unavailable");

    const blockToRender = assignment || mobLocation || unavailable;

    if (!blockToRender) return null;

    // Override location for display purposes (mock up only)
    let displayLocation = blockToRender.location;
    if (blockToRender.type === "assignment") {
      if (technician === "Emily Davis") {
        displayLocation = "Strasbourg";
      } else if (technician === "Michael Brown") {
        displayLocation = "Luxembourg";
      }
    }

    // Calculate background color
    let backgroundColor = "#e5e7eb"; // Gray default
    let textColor = "#000";

    if (blockToRender.type === "unavailable") {
      backgroundColor = "#ef4444"; // Red
      textColor = "#fff";
    } else if (blockToRender.type === "mob-location") {
      backgroundColor = "#fde047"; // Yellow
      textColor = "#000";
    } else if (blockToRender.type === "assignment") {
      backgroundColor = "#d97706"; // Brown/orange
      textColor = "#fff";
    }

    return (
      <Box
        sx={{
          backgroundColor,
          color: textColor,
          padding: "8px",
          borderRadius: "4px",
          fontSize: "0.75rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          minHeight: "80px",
        }}
      >
        {blockToRender.type === "unavailable" && (
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, textAlign: "center" }}>
            Unavailable
          </Typography>
        )}
        
        {blockToRender.type === "mob-location" && (
          <>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700 }}>
              {blockToRender.detailedTime || `${blockToRender.startTime}:00-${blockToRender.endTime}:00`}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {displayLocation}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 500, lineHeight: 1.2 }}>
              {blockToRender.session}
            </Typography>
          </>
        )}
        
        {blockToRender.type === "assignment" && (
          <>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700 }}>
              {blockToRender.detailedTime || `${blockToRender.startTime}:00-${blockToRender.endTime}:00`}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {displayLocation}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {blockToRender.room}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 500, lineHeight: 1.2 }}>
              {blockToRender.session}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, mt: "auto" }}>
              {blockToRender.status}
            </Typography>
          </>
        )}
      </Box>
    );
  };

  const allTechnicianNames = getTechnicianNames();

  // Determine status for a technician based on their schedule blocks
  const getTechnicianStatus = (technician: string): string[] => {
    const statuses: string[] = [];
    const blocks = technicianScheduleBlocks.filter((b) => b.technician === technician);
    if (blocks.some((b) => b.type === "mob-location")) statuses.push("MOB");
    if (blocks.some((b) => b.type === "assignment" && b.serviceType === "REG")) statuses.push("REG");
    if (blocks.some((b) => b.type === "unavailable")) statuses.push("Unavailable");
    return statuses;
  };

  // Filter technician names
  const technicianNames = allTechnicianNames.filter((name) => {
    // Filter by technician name
    if (technicianFilter !== "all" && name !== technicianFilter) return false;
    // Filter by status
    if (statusFilter !== "all") {
      const statuses = getTechnicianStatus(name);
      if (!statuses.includes(statusFilter)) return false;
    }
    // Filter by service type
    if (serviceTypeFilter !== "all") {
      const blocks = technicianScheduleBlocks.filter((b) => b.technician === name);
      const hasServiceType = blocks.some(
        (b) => b.type === "assignment" && b.serviceType === serviceTypeFilter
      );
      if (!hasServiceType) return false;
    }
    return true;
  });

  return (
    <div className="rounded-md border overflow-visible">
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 2400 }}>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  minWidth: 200, 
                  position: "sticky", 
                  left: 0, 
                  backgroundColor: "background.paper",
                  zIndex: 2,
                  borderRight: "2px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                Technician
              </TableCell>
              {weekDays.slice(0, 7).map((day) => (
                <TableCell
                  key={day}
                  colSpan={6}
                  align="center"
                  sx={{
                    borderLeft: "2px solid #ddd",
                    backgroundColor: "#f8f9fa",
                    fontWeight: "bold",
                  }}
                >
                  {getDateHeader(day)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                  backgroundColor: "background.paper",
                  zIndex: 2,
                  borderRight: "2px solid #ddd"
                }}
              />
              {weekDays.slice(0, 7).map((day) => (
                <React.Fragment key={day}>
                  {timeSlots.map((slot) => (
                    <TableCell
                      key={`${day}-${slot}`}
                      align="center"
                      sx={{
                        fontSize: "0.75rem",
                        padding: "4px",
                        minWidth: 80,
                        width: 80,
                        borderLeft: slot === 1 ? "2px solid #ddd" : "1px solid #e0e0e0",
                      }}
                    >
                      {slot}
                    </TableCell>
                  ))}
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {technicianNames.map((technician) => (
              <React.Fragment key={technician}>
                {/* Main assignments row */}
                <TableRow>
                  <TableCell
                    rowSpan={hasMobBlocks(technician) ? 2 : 1}
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: "background.paper",
                      zIndex: 1,
                      borderRight: "2px solid #ddd",
                      fontWeight: 500,
                    }}
                  >
                    {technician}
                  </TableCell>
                  {weekDays.slice(0, 7).map((day) => (
                    <React.Fragment key={day}>
                      {timeSlots.map((slot) => (
                        <TableCell
                          key={`${day}-${slot}`}
                          sx={{
                            padding: "4px",
                            borderLeft: slot === 1 ? "2px solid #ddd" : "1px solid #e0e0e0",
                            verticalAlign: "middle",
                          }}
                        >
                          {renderTimeSlotCell(technician, day, slot, "assignments")}
                        </TableCell>
                      ))}
                    </React.Fragment>
                  ))}
                </TableRow>
                {/* MOB row (if applicable) */}
                {hasMobBlocks(technician) && (
                  <TableRow>
                    {weekDays.slice(0, 7).map((day) => (
                      <React.Fragment key={day}>
                        {timeSlots.map((slot) => (
                          <TableCell
                            key={`${day}-${slot}-mob`}
                            sx={{
                              padding: "4px",
                              borderLeft: slot === 1 ? "2px solid #ddd" : "1px solid #e0e0e0",
                              verticalAlign: "middle",
                            }}
                          >
                            {renderTimeSlotCell(technician, day, slot, "mob")}
                          </TableCell>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}