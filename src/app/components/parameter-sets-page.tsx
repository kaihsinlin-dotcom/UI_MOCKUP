import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TableContainer,
  Paper,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { parameterSets } from "../data/mockData";
import { format } from "date-fns";

export function ParameterSetsPage() {
  return (
    <div className="rounded-md border">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameter Set ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Usage Count</TableCell>
              <TableCell>Parameters</TableCell>
              <TableCell className="w-[80px]"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameterSets.map((paramSet) => (
              <TableRow key={paramSet.id}>
                <TableCell className="font-medium">{paramSet.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{paramSet.name}</div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] text-sm text-muted-foreground">
                    {paramSet.description}
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(paramSet.createdDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{paramSet.createdBy}</TableCell>
                <TableCell>
                  <Chip label={`${paramSet.usageCount} runs`} size="small" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Chip
                      label={`Max: ${paramSet.parameters.maxSessionsPerDay}`}
                      variant="outlined"
                      size="small"
                    />
                    {paramSet.parameters.prioritizeSkills && (
                      <Chip
                        label="Skills Priority"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {paramSet.parameters.allowOvertime && (
                      <Chip
                        label="Overtime OK"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    <Chip
                      label={`Penalty: ${paramSet.parameters.conflictPenalty}`}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <MoreVert className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}