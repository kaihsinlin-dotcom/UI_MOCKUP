import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
} from "@mui/material";
import { parameterSets } from "../data/mockData";
import { format } from "date-fns";
import { Link } from "react-router";

export function ParameterSetsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Version</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Usage Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameterSets.map((paramSet) => (
              <TableRow key={paramSet.id} hover>
                <TableCell>
                  <Link
                    to={`/parameter-set/${paramSet.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none', 
                      cursor: 'pointer',
                      fontWeight: 500 
                    }}
                  >
                    <Box className="hover:underline">
                      {paramSet.name}
                    </Box>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/parameter-set/${paramSet.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    <Box sx={{ maxWidth: '400px' }} className="hover:underline">
                      {paramSet.description}
                    </Box>
                  </Link>
                </TableCell>
                <TableCell>
                  {paramSet.weekType && (
                    <Chip
                      label={paramSet.weekType}
                      color={paramSet.weekType === "Plenary week" ? "primary" : "default"}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>{paramSet.version || "1.0"}</TableCell>
                <TableCell>{paramSet.author || paramSet.createdBy}</TableCell>
                <TableCell>
                  {format(new Date(paramSet.createdDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Box sx={{ textAlign: 'center' }}>
                    {paramSet.usageCount}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
