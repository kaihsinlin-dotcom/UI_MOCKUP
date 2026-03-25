import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  Paper,
  Box,
} from "@mui/material";
import { roomAssignments } from "../data/mockData";
import { RoomAssignment } from "../types/assignment";

interface RoomsTableProps {
  roomFilter?: string;
  serviceTypeFilter?: string;
  townFilter?: string;
  technicianFilter?: string;
  sessionNrFilter?: string;
}

export function RoomsTable({
  roomFilter = "all",
  serviceTypeFilter = "all",
  townFilter = "all",
  technicianFilter = "all",
  sessionNrFilter = "",
}: RoomsTableProps) {
  // Filter rooms
  const filteredRooms = roomAssignments.filter((room) => {
    if (roomFilter !== "all" && room.room !== roomFilter) return false;
    if (serviceTypeFilter !== "all" && room.serviceType !== serviceTypeFilter) return false;
    if (townFilter !== "all" && room.town !== townFilter) return false;
    if (technicianFilter !== "all") {
      const hasTechnician = room.assignedTechnicians.some(tech => tech === technicianFilter);
      if (!hasTechnician) return false;
    }
    if (sessionNrFilter && !room.sessionNr.includes(sessionNrFilter)) return false;
    return true;
  });

  const getServiceTypeColor = (serviceType: "REG" | "MOB") => {
    switch (serviceType) {
      case "REG":
        return { 
          backgroundColor: "#0ea5e9", // sky blue
          color: "white"
        };
      case "MOB":
        return { 
          backgroundColor: "#fef08a", // light yellow
          color: "#000"
        };
      default:
        return {};
    }
  };

  // Helper function to determine if a technician is MOB type
  // For mockup purposes, we'll mark some technicians as MOB based on their name
  const isMobTechnician = (techName: string) => {
    // Mark specific technicians as MOB for demonstration
    const mobTechnicians = ["David Chen", "John Smith", "Emily Davis"];
    return mobTechnicians.includes(techName);
  };

  const getTechnicianChipStyle = (techName: string) => {
    if (isMobTechnician(techName)) {
      return {
        backgroundColor: "#fef08a", // light yellow for MOB
        color: "#000",
        borderColor: "#fef08a"
      };
    }
    return {};
  };

  return (
    <div className="rounded-md border overflow-visible">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell>Session Nr.</TableCell>
              <TableCell>Town</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Assigned Technicians</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.room}</TableCell>
                <TableCell>{room.sessionNr}</TableCell>
                <TableCell>{room.town}</TableCell>
                <TableCell>
                  <Chip 
                    label={room.serviceType} 
                    size="small"
                    sx={getServiceTypeColor(room.serviceType)}
                  />
                </TableCell>
                <TableCell>{room.startTime}</TableCell>
                <TableCell>{room.endTime}</TableCell>
                <TableCell>
                  {room.assignedTechnicians.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {room.assignedTechnicians.map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          size="small"
                          variant="outlined"
                          sx={getTechnicianChipStyle(tech)}
                        />
                      ))}
                    </Box>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}