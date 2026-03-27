import {
  TextField,
  MenuItem,
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Separator } from "./ui/separator";
import { parameterSets } from "../data/mockData";
import { Constraint } from "../types/assignment";
import { useState } from "react";

export function ParameterSetsPage() {
  // Use the first parameter set as default for demonstration
  const [parameterSet, setParameterSet] = useState(parameterSets[0]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setParameterSet({
      ...parameterSet,
      [field]: event.target.value,
    });
  };

  // Check if the author field should be editable
  const isAuthorEditable = (parameterSet.author || parameterSet.createdBy) === "My self";

  // Constraints editing state
  const [constraints, setConstraints] = useState<Constraint[]>(parameterSet.constraints ?? []);
  const [editingRows, setEditingRows] = useState<Record<number, number>>({});

  const startEdit = (index: number) => {
    setEditingRows((prev) => ({ ...prev, [index]: constraints[index].weight }));
  };

  const cancelEdit = (index: number) => {
    setEditingRows((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const saveEdit = (index: number) => {
    const newWeight = editingRows[index];
    setConstraints((prev) =>
      prev.map((c, i) => (i === index ? { ...c, weight: newWeight } : c))
    );
    cancelEdit(index);
  };

  const handleWeightChange = (index: number, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setEditingRows((prev) => ({ ...prev, [index]: parsed }));
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      {/* Title */}
      <Typography variant="h5" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Parameter Set
      </Typography>

      {/* Section 1: Basic Information */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
        <TextField
          label="Name"
          value={parameterSet.name}
          onChange={handleChange("name")}
          fullWidth
          variant="outlined"
        />
        
        <TextField
          label="Description"
          value={parameterSet.description}
          onChange={handleChange("description")}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
        />
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <TextField
            label="Version"
            value={parameterSet.version || "1.0"}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            disabled
          />
          
          <TextField
            label="Author"
            value={parameterSet.author || parameterSet.createdBy}
            onChange={handleChange("author")}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: !isAuthorEditable,
            }}
            disabled={!isAuthorEditable}
          />
        </Box>
      </Box>

      {/* Divider */}
      <Separator className="my-8" />

      {/* Section 2: Week Configuration */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
        <TextField
          select
          label="Week type"
          value={parameterSet.weekType || "Plenary week"}
          onChange={handleChange("weekType")}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="Plenary week">Plenary week</MenuItem>
          <MenuItem value="Non-plenary week">Non-plenary week</MenuItem>
        </TextField>
        
        <Box sx={{ display: 'flex', gap: 3 }}>
          <TextField
            label="Max. daily working hours"
            type="number"
            value={parameterSet.maxDailyWorkingHours || 8}
            onChange={handleChange("maxDailyWorkingHours")}
            variant="outlined"
            inputProps={{ min: 0, step: 0.5 }}
            sx={{ maxWidth: '200px' }}
          />
          
          <TextField
            label="Max. daily overtime hours per day"
            type="number"
            value={parameterSet.maxDailyOvertimeHours || 0}
            onChange={handleChange("maxDailyOvertimeHours")}
            variant="outlined"
            inputProps={{ min: 0, step: 0.5 }}
            sx={{ maxWidth: '200px' }}
          />
        </Box>
      </Box>

      {/* Divider */}
      <Separator className="my-8" />

      {/* Section 3: Constraints */}
      <Box>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Constraints
        </Typography>
        <Table size="small" sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 160 }}>Weight</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {constraints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                  No constraints defined
                </TableCell>
              </TableRow>
            ) : (
              constraints.map((constraint, index) => {
                const isEditing = index in editingRows;
                return (
                  <TableRow key={index} hover>
                    <TableCell>{constraint.name}</TableCell>
                    <TableCell>{constraint.type}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {isEditing ? (
                          <>
                            <TextField
                              type="number"
                              value={editingRows[index]}
                              onChange={(e) => handleWeightChange(index, e.target.value)}
                              size="small"
                              inputProps={{ min: 0, step: 1 }}
                              sx={{ width: 80 }}
                              autoFocus
                            />
                            <Tooltip title="Save">
                              <IconButton size="small" color="success" onClick={() => saveEdit(index)}>
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton size="small" color="error" onClick={() => cancelEdit(index)}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Box component="span" sx={{ minWidth: 32 }}>{constraint.weight}</Box>
                            <Tooltip title="Edit weight">
                              <IconButton size="small" onClick={() => startEdit(index)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{constraint.description}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}