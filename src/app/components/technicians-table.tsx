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
  LinearProgress,
} from "@mui/material";
import { technicianAssignments } from "../data/mockData";
import { TechnicianAssignment } from "../types/assignment";

interface TechniciansTableProps {
  dayFilter?: string;
  statusFilter?: string;
}

export function TechniciansTable({
  dayFilter = "all",
  statusFilter = "all",
}: TechniciansTableProps) {
  // Filter technicians
  const filteredTechnicians = technicianAssignments.filter((tech) => {
    if (dayFilter !== "all" && tech.day !== dayFilter) return false;
    if (statusFilter !== "all" && tech.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Unavailable":
        return { variant: "filled" as const, color: "success" as const };
      case "Fully Booked":
        return { variant: "filled" as const, color: "warning" as const };
      case "Overbooked":
        return { variant: "filled" as const, color: "error" as const };
      default:
        return { variant: "outlined" as const, color: "default" as const };
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization <= 50) return "success";
    if (utilization <= 90) return "warning";
    return "error";
  };

  return (
    <div className="rounded-md border overflow-visible">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Technician</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Sessions</TableCell>
              <TableCell>Utilization</TableCell>
              <TableCell>Assigned Rooms</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTechnicians.map((tech) => (
              <TableRow key={tech.id}>
                <TableCell className="font-medium">{tech.technician}</TableCell>
                <TableCell>{tech.day}</TableCell>
                <TableCell>
                  {tech.sessions} / {tech.maxSessions}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: 100 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(tech.utilization, 100)}
                        color={getUtilizationColor(tech.utilization)}
                      />
                    </Box>
                    <span className="text-sm font-medium">
                      {tech.utilization}%
                    </span>
                  </Box>
                </TableCell>
                <TableCell>
                  {tech.assignedRooms.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {tech.assignedRooms.map((room, index) => (
                        <Chip
                          key={index}
                          label={room}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {tech.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip {...getStatusColor(tech.status)} label={tech.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
