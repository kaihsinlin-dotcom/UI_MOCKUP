import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import { ChevronRight, ChevronDown, Flag, FlagTriangleRight } from "lucide-react";
import { roomAssignments } from "../data/mockData";
import { RoomAssignment } from "../types/assignment";

interface FlaggedTechnician {
  technicianName: string;
  sessionId?: string; // If undefined, flagged for entire room
  roomName?: string;
}

export function ScheduleRoomsTable() {
  const [expandedTowns, setExpandedTowns] = useState<Set<string>>(new Set(["BRU"]));
  const [expandedPrefixes, setExpandedPrefixes] = useState<Set<string>>(new Set());
  const [selectedSession, setSelectedSession] = useState<RoomAssignment | null>(null);
  const [flaggedTechnicians, setFlaggedTechnicians] = useState<FlaggedTechnician[]>([]);
  
  // Filter states
  const [roomFilter] = useState("all");
  const [serviceTypeFilter] = useState("all");
  const [townFilter] = useState("all");
  const [technicianFilter] = useState("all");
  const [sessionNrFilter] = useState("");

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [9, 13, 17, 21];

  // Calculate which time slot a session belongs to based on start time
  const getTimeSlot = (startTime: string): number => {
    const hour = parseInt(startTime.split(":")[0]);
    return hour;
  };

  // Check if a technician is flagged for a session or room
  const isTechnicianFlagged = (technicianName: string, sessionId: string, roomName: string): boolean => {
    return flaggedTechnicians.some(
      (flagged) =>
        flagged.technicianName === technicianName &&
        (flagged.sessionId === sessionId || flagged.roomName === roomName)
    );
  };

  // Toggle flag for a technician in a specific session
  const toggleFlagTechnicianInSession = (technicianName: string, sessionId: string) => {
    setFlaggedTechnicians((prev) => {
      const existing = prev.find(
        (f) => f.technicianName === technicianName && f.sessionId === sessionId
      );
      if (existing) {
        return prev.filter((f) => !(f.technicianName === technicianName && f.sessionId === sessionId));
      } else {
        return [...prev, { technicianName, sessionId }];
      }
    });
  };

  // Flag all technicians in a room
  const flagAllTechniciansInRoom = (roomName: string) => {
    // Get all unique technicians assigned to this room
    const roomSessions = roomAssignments.filter((a) => a.room === roomName);
    const uniqueTechnicians = new Set<string>();
    roomSessions.forEach((session) => {
      session.assignedTechnicians.forEach((tech) => uniqueTechnicians.add(tech));
    });

    setFlaggedTechnicians((prev) => {
      // Remove existing flags for this room
      const withoutRoom = prev.filter((f) => f.roomName !== roomName);
      // Add new flags for all technicians in this room
      const newFlags: FlaggedTechnician[] = Array.from(uniqueTechnicians).map((tech) => ({
        technicianName: tech,
        roomName,
      }));
      return [...withoutRoom, ...newFlags];
    });
  };

  // Unflag all technicians in a room
  const unflagAllTechniciansInRoom = (roomName: string) => {
    setFlaggedTechnicians((prev) => prev.filter((f) => f.roomName !== roomName));
  };

  // Check if any technician in a room is flagged
  const isRoomFlagged = (roomName: string): boolean => {
    return flaggedTechnicians.some((f) => f.roomName === roomName);
  };

  // Toggle flag for a specific technician in a specific room (all sessions in that room)
  const toggleFlagTechnicianInRoom = (technicianName: string, roomName: string) => {
    setFlaggedTechnicians((prev) => {
      const existing = prev.find(
        (f) => f.technicianName === technicianName && f.roomName === roomName
      );
      if (existing) {
        return prev.filter((f) => !(f.technicianName === technicianName && f.roomName === roomName));
      } else {
        return [...prev, { technicianName, roomName }];
      }
    });
  };

  // Check if a specific technician is flagged in a specific room
  const isTechnicianFlaggedInRoom = (technicianName: string, roomName: string): boolean => {
    return flaggedTechnicians.some(
      (f) => f.technicianName === technicianName && f.roomName === roomName
    );
  };

  // Get unique technicians for a room
  const getRoomTechnicians = (roomName: string): string[] => {
    const roomSessions = roomAssignments.filter((a) => a.room === roomName);
    const uniqueTechnicians = new Set<string>();
    roomSessions.forEach((session) => {
      session.assignedTechnicians.forEach((tech) => uniqueTechnicians.add(tech));
    });
    return Array.from(uniqueTechnicians).sort();
  };

  // Helper to format date headers
  const getDateHeader = (day: string, weekNumber: number = 12): string => {
    // Starting from Mon 17/03/2025 (Week 12)
    const baseDate = new Date(2025, 2, 17); // March 17, 2025
    const dayIndex = weekDays.indexOf(day);
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayIndex);
    
    const dayShort = day.substring(0, 3);
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    return `${dayShort} ${dateStr}`;
  };

  // Helper to get color for technician (diagonal stripe pattern)
  const getTechnicianColor = (techName: string, index: number): string => {
    const mobTechnicians = ["David Chen", "John Smith"];
    
    if (mobTechnicians.includes(techName)) {
      return "#fde047"; // Yellow for MOB technicians
    }
    
    // Different colors for different technicians
    const colors = ["#ef4444", "#22c55e", "#3b82f6", "#a855f7", "#f97316"];
    return colors[index % colors.length];
  };

  // Calculate session duration in hours and minutes
  const calculateDuration = (startTime: string, endTime: string): string => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) return `${minutes}min`;
    if (minutes === 0) return `${hours}hr`;
    return `${hours}hr${minutes}`;
  };

  // Format datetime for display
  const formatDateTime = (day: string, startTime: string, endTime: string): string => {
    const baseDate = new Date(2025, 2, 17); // March 17, 2025
    const dayIndex = weekDays.indexOf(day);
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayIndex);
    
    const dayShort = day.substring(0, 3);
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const duration = calculateDuration(startTime, endTime);
    
    return `${dayShort} ${dateStr} ${startTime}-${endTime} (${duration})`;
  };

  // Filter room assignments
  const filteredAssignments = roomAssignments.filter((assignment) => {
    if (roomFilter !== "all" && assignment.room !== roomFilter) return false;
    if (serviceTypeFilter !== "all" && assignment.serviceType !== serviceTypeFilter) return false;
    if (townFilter !== "all" && assignment.town !== townFilter) return false;
    if (technicianFilter !== "all") {
      const hasTechnician = assignment.assignedTechnicians.some(tech => tech === technicianFilter);
      if (!hasTechnician) return false;
    }
    if (sessionNrFilter && !assignment.sessionNr.includes(sessionNrFilter)) return false;
    return true;
  });

  // Extract room prefix from room name (first 3 characters or part before hyphen)
  const getRoomPrefix = (roomName: string): string => {
    const hyphenIndex = roomName.indexOf("-");
    if (hyphenIndex > 0) {
      return roomName.substring(0, hyphenIndex);
    }
    return roomName.substring(0, 3);
  };

  // Group assignments by town → room prefix → room
  const townGroups = filteredAssignments.reduce((acc, assignment) => {
    const town = assignment.town;
    const prefix = getRoomPrefix(assignment.room);
    const room = assignment.room;
    
    if (!acc[town]) {
      acc[town] = {};
    }
    if (!acc[town][prefix]) {
      acc[town][prefix] = {};
    }
    if (!acc[town][prefix][room]) {
      acc[town][prefix][room] = [];
    }
    acc[town][prefix][room].push(assignment);
    return acc;
  }, {} as Record<string, Record<string, Record<string, RoomAssignment[]>>>);

  const toggleTown = (town: string) => {
    const newExpanded = new Set(expandedTowns);
    if (newExpanded.has(town)) {
      newExpanded.delete(town);
    } else {
      newExpanded.add(town);
    }
    setExpandedTowns(newExpanded);
  };

  const togglePrefix = (townPrefix: string) => {
    const newExpanded = new Set(expandedPrefixes);
    if (newExpanded.has(townPrefix)) {
      newExpanded.delete(townPrefix);
    } else {
      newExpanded.add(townPrefix);
    }
    setExpandedPrefixes(newExpanded);
  };

  // Get sessions for a specific room, day, and time slot
  const getSessionsForSlot = (
    town: string,
    prefix: string | null,
    room: string | null,
    day: string,
    timeSlot: number
  ): RoomAssignment[] => {
    if (room) {
      // Get sessions for a specific room
      const roomSessions = townGroups[town]?.[prefix!]?.[room] || [];
      return roomSessions.filter(
        session => session.day === day && getTimeSlot(session.startTime) === timeSlot
      );
    } else if (prefix) {
      // Get sessions for all rooms in this prefix
      const prefixRooms = townGroups[town]?.[prefix] || {};
      return Object.values(prefixRooms)
        .flat()
        .filter(session => session.day === day && getTimeSlot(session.startTime) === timeSlot);
    } else {
      // Get sessions for all rooms in this town
      const townPrefixes = townGroups[town] || {};
      return Object.values(townPrefixes)
        .flatMap(prefixRooms => Object.values(prefixRooms))
        .flat()
        .filter(session => session.day === day && getTimeSlot(session.startTime) === timeSlot);
    }
  };

  const renderSessionBlocks = (sessions: RoomAssignment[]) => {
    if (sessions.length === 0 || sessions.every(s => s.assignedTechnicians.length === 0)) {
      return null;
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {sessions.map((session) => {
          if (session.assignedTechnicians.length === 0) return null;
          
          const mobTechnicians = ["David Chen", "John Smith"];
          const duration = calculateDuration(session.startTime, session.endTime);
          const assignedCount = session.assignedTechnicians.length;
          const requiredCount = session.requiredTechnicians;
          const isFullyStaffed = assignedCount >= requiredCount;
          
          // Status color mapping
          const getStatusColor = (status: string) => {
            switch (status) {
              case "APR": return { bg: "#22c55e", color: "#fff" }; // Green
              case "WIP": return { bg: "#fb923c", color: "#fff" }; // Orange
              case "TBC": return { bg: "#fb923c", color: "#fff" }; // Orange
              case "CAN": return { bg: "#ef4444", color: "#fff" }; // Red
              case "REJ": return { bg: "#ef4444", color: "#fff" }; // Red
              case "WAI": return { bg: "#a855f7", color: "#fff" }; // Purple
              case "REGIE": return { bg: "#3b82f6", color: "#fff" }; // Blue
              default: return { bg: "#9ca3af", color: "#fff" }; // Gray
            }
          };
          
          const statusColors = getStatusColor(session.status);
          
          return (
            <Box
              key={session.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                p: 0.75,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                backgroundColor: "#fafafa",
                fontSize: "0.7rem",
              }}
            >
              {/* Status chip */}
              <Chip 
                label={session.status} 
                size="small"
                sx={{
                  height: "16px",
                  fontSize: "0.6rem",
                  alignSelf: "flex-start",
                  backgroundColor: statusColors.bg,
                  color: statusColors.color,
                  fontWeight: 600,
                  "& .MuiChip-label": {
                    px: 0.75,
                    py: 0,
                  },
                }}
              />

              {/* Technician count chip */}
              <Chip 
                label={`${assignedCount}/${requiredCount} technicians`}
                size="small"
                sx={{
                  height: "16px",
                  fontSize: "0.6rem",
                  alignSelf: "flex-start",
                  backgroundColor: isFullyStaffed ? "#22c55e" : "#ef4444",
                  color: "#fff",
                  fontWeight: 600,
                  "& .MuiChip-label": {
                    px: 0.75,
                    py: 0,
                  },
                }}
              />

              {/* Technician chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.25 }}>
                {session.assignedTechnicians.map((tech, techIdx) => {
                  const isMob = mobTechnicians.includes(tech);
                  const isFlagged = isTechnicianFlagged(tech, session.id, session.room);
                  const isFlaggedInRoom = isTechnicianFlaggedInRoom(tech, session.room);
                  return (
                    <Box key={techIdx} sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <Chip
                        label={tech}
                        size="small"
                        sx={{
                          height: "18px",
                          fontSize: "0.65rem",
                          backgroundColor: isFlagged ? "#fee2e2" : (isMob ? "#fde047" : "#e5e7eb"),
                          color: "#000",
                          border: isFlagged ? "1px solid #ef4444" : "none",
                          "& .MuiChip-label": {
                            px: 0.75,
                            py: 0,
                          },
                        }}
                      />
                      {/* Flag for this session only */}
                      <Tooltip title={isFlagged ? "Unflag from this session" : "Flag from this session"}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFlagTechnicianInSession(tech, session.id);
                          }}
                          sx={{
                            padding: "2px",
                            width: "16px",
                            height: "16px",
                          }}
                        >
                          <Flag 
                            className="size-3" 
                            style={{ 
                              fill: isFlagged ? "#ef4444" : "none",
                              stroke: isFlagged ? "#ef4444" : "#9ca3af",
                            }} 
                          />
                        </IconButton>
                      </Tooltip>
                      {/* Flag for all sessions in this room */}
                      <Tooltip title={isFlaggedInRoom ? `Unflag ${tech} from all ${session.room} sessions` : `Flag ${tech} from all ${session.room} sessions`} >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFlagTechnicianInRoom(tech, session.room);
                          }}
                          sx={{
                            padding: "2px",
                            width: "16px",
                            height: "16px",
                          }}
                        >
                          <FlagTriangleRight 
                            className="size-3" 
                            style={{ 
                              fill: isFlaggedInRoom ? "#ef4444" : "none",
                              stroke: isFlaggedInRoom ? "#ef4444" : "#6b7280",
                            }} 
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                })}
              </Box>

              {/* Time and duration */}
              <Typography sx={{ fontSize: "0.65rem", color: "#666" }}>
                {session.startTime}-{session.endTime} ({duration})
              </Typography>

              {/* Requester */}
              <Typography sx={{ fontSize: "0.65rem", color: "#666", fontWeight: 500 }}>
                Requester: {session.requester}
              </Typography>

              {/* Service type */}
              <Chip 
                label={session.serviceType} 
                size="small"
                sx={{
                  height: "16px",
                  fontSize: "0.6rem",
                  alignSelf: "flex-start",
                  backgroundColor: session.serviceType === "MOB" ? "#fef3c7" : "#dbeafe",
                  color: "#000",
                  "& .MuiChip-label": {
                    px: 0.75,
                    py: 0,
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    );
  };

  const handleCloseDialog = () => {
    setSelectedSession(null);
  };

  return (
    <>
      <div className="rounded-md border overflow-visible">
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 2400 }}>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    minWidth: 150, 
                    position: "sticky", 
                    left: 0, 
                    backgroundColor: "background.paper",
                    zIndex: 2,
                    borderRight: "2px solid #ddd"
                  }}
                >
                  Room
                </TableCell>
                {weekDays.slice(0, 7).map((day) => (
                  <TableCell
                    key={day}
                    colSpan={4}
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
                          minWidth: 120,
                          width: 120,
                          borderLeft: slot === 9 ? "2px solid #ddd" : "1px solid #e0e0e0",
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
              {Object.entries(townGroups).map(([town, prefixes]) => {
                const isExpanded = expandedTowns.has(town);
                const prefixList = Object.keys(prefixes).sort();

                return (
                  <React.Fragment key={town}>
                    {/* Town row */}
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: 0,
                          backgroundColor: "#f5f5f5",
                          zIndex: 1,
                          borderRight: "2px solid #ddd",
                          fontWeight: "bold",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton size="small" onClick={() => toggleTown(town)}>
                            {isExpanded ? (
                              <ChevronDown className="size-4" />
                            ) : (
                              <ChevronRight className="size-4" />
                            )}
                          </IconButton>
                          {town}
                        </Box>
                      </TableCell>
                      {weekDays.slice(0, 7).map((day) => (
                        <React.Fragment key={day}>
                          {timeSlots.map((slot) => {
                            // Get all sessions for this town on this day/time
                            const townSessions = Object.values(prefixes)
                              .flatMap(prefixRooms => Object.values(prefixRooms))
                              .flat()
                              .filter(
                                session => session.day === day && getTimeSlot(session.startTime) === slot
                              );
                            return (
                              <TableCell
                                key={`${day}-${slot}`}
                                sx={{
                                  padding: "4px",
                                  borderLeft: slot === 9 ? "2px solid #ddd" : "1px solid #e0e0e0",
                                  backgroundColor: "#f5f5f5",
                                }}
                              >
                                {renderSessionBlocks(townSessions)}
                              </TableCell>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </TableRow>

                    {/* Prefix rows (when expanded) */}
                    {isExpanded &&
                      prefixList.map((prefix) => {
                        const isPrefixExpanded = expandedPrefixes.has(`${town}-${prefix}`);
                        const roomList = Object.keys(prefixes[prefix]).sort();

                        return (
                          <React.Fragment key={prefix}>
                            {/* Prefix row */}
                            <TableRow sx={{ backgroundColor: "#e9ecef" }}>
                              <TableCell
                                sx={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "#e9ecef",
                                  zIndex: 1,
                                  borderRight: "2px solid #ddd",
                                  paddingLeft: 6,
                                  fontWeight: "bold",
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <IconButton size="small" onClick={() => togglePrefix(`${town}-${prefix}`)}>
                                    {isPrefixExpanded ? (
                                      <ChevronDown className="size-4" />
                                    ) : (
                                      <ChevronRight className="size-4" />
                                    )}
                                  </IconButton>
                                  {prefix}
                                </Box>
                              </TableCell>
                              {weekDays.slice(0, 7).map((day) => (
                                <React.Fragment key={day}>
                                  {timeSlots.map((slot) => {
                                    return (
                                      <TableCell
                                        key={`${day}-${slot}`}
                                        sx={{
                                          padding: "4px",
                                          borderLeft: slot === 9 ? "2px solid #ddd" : "1px solid #e0e0e0",
                                          backgroundColor: "#e9ecef",
                                        }}
                                      >
                                        {/* Empty - no details on prefix rows */}
                                      </TableCell>
                                    );
                                  })}
                                </React.Fragment>
                              ))}
                            </TableRow>

                            {/* Room rows (when expanded) */}
                            {isPrefixExpanded &&
                              roomList.map((roomName) => {
                                return (
                                <TableRow key={roomName}>
                                  <TableCell
                                    sx={{
                                      position: "sticky",
                                      left: 0,
                                      backgroundColor: "background.paper",
                                      zIndex: 1,
                                      borderRight: "2px solid #ddd",
                                      paddingLeft: 8,
                                    }}
                                  >
                                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                                      {roomName}
                                    </Typography>
                                  </TableCell>
                                  {weekDays.slice(0, 7).map((day) => (
                                    <React.Fragment key={day}>
                                      {timeSlots.map((slot) => {
                                        const sessions = getSessionsForSlot(town, prefix, roomName, day, slot);
                                        return (
                                          <TableCell
                                            key={`${day}-${slot}`}
                                            sx={{
                                              padding: "4px",
                                              borderLeft: slot === 9 ? "2px solid #ddd" : "1px solid #e0e0e0",
                                            }}
                                          >
                                            {renderSessionBlocks(sessions)}
                                          </TableCell>
                                        );
                                      })}
                                    </React.Fragment>
                                  ))}
                                </TableRow>
                                );
                              })}
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Session Details Dialog */}
      <Dialog 
        open={selectedSession !== null} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedSession && (
          <>
            <DialogTitle>
              <Typography variant="h6" component="div">
                {selectedSession.session}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Session #{selectedSession.sessionNr}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                {/* Date and Time */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(selectedSession.day, selectedSession.startTime, selectedSession.endTime)}
                  </Typography>
                </Box>

                {/* Service Type */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Service Type
                  </Typography>
                  <Chip 
                    label={selectedSession.serviceType} 
                    size="small"
                    color={selectedSession.serviceType === "MOB" ? "warning" : "default"}
                  />
                </Box>

                {/* Assigned Technicians */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Assigned Technicians
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedSession.assignedTechnicians.length > 0 ? (
                      selectedSession.assignedTechnicians.map((tech, idx) => {
                        const mobTechnicians = ["David Chen", "John Smith"];
                        const isMob = mobTechnicians.includes(tech);
                        return (
                          <Chip
                            key={idx}
                            label={tech}
                            size="small"
                            sx={{
                              backgroundColor: isMob ? "#fde047" : "#e0e0e0",
                              color: "#000",
                            }}
                          />
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No technicians assigned
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Requester */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Requester
                  </Typography>
                  <Typography variant="body1">
                    {selectedSession.requester}
                  </Typography>
                </Box>

                {/* Room and Town */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedSession.room}, {selectedSession.town}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}