import {
  TextField,
  MenuItem,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Separator } from "./ui/separator";
import { parameterSets } from "../data/mockData";
import { useState } from "react";
import { Constraint } from "../types/assignment";

export function ParameterSetsPage() {
  // Use the first parameter set as default for demonstration
  const [parameterSet, setParameterSet] = useState(parameterSets[0]);
  const [editingConstraintId, setEditingConstraintId] = useState<string | null>(null);
  const [editedWeight, setEditedWeight] = useState<number>(0);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setParameterSet({
      ...parameterSet,
      [field]: event.target.value,
    });
  };

  const handleEditWeight = (constraint: Constraint) => {
    setEditingConstraintId(constraint.id);
    setEditedWeight(constraint.weight);
  };

  const handleSaveWeight = (constraintId: string) => {
    if (parameterSet.constraints) {
      const updatedConstraints = parameterSet.constraints.map((c) =>
        c.id === constraintId ? { ...c, weight: editedWeight } : c
      );
      setParameterSet({
        ...parameterSet,
        constraints: updatedConstraints,
      });
    }
    setEditingConstraintId(null);
  };

  const handleCancelEdit = () => {
    setEditingConstraintId(null);
    setEditedWeight(0);
  };

  // Check if the author field should be editable
  const isAuthorEditable = (parameterSet.author || parameterSet.createdBy) === "My self";

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

      {/* Section 3: Constraints Table */}
      <Box>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Constraints
        </Typography>
        {parameterSet.constraints && parameterSet.constraints.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, width: '25%' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '20%' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '20%' }}>Weight</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '35%' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parameterSet.constraints.map((constraint) => (
                  <TableRow key={constraint.id} hover>
                    <TableCell>{constraint.name}</TableCell>
                    <TableCell>{constraint.type}</TableCell>
                    <TableCell>
                      {editingConstraintId === constraint.id ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            type="number"
                            value={editedWeight}
                            onChange={(e) => setEditedWeight(Number(e.target.value))}
                            size="small"
                            inputProps={{ min: 0, max: 10, step: 1 }}
                            sx={{ width: '80px' }}
                          />
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSaveWeight(constraint.id)}
                            sx={{ p: 0.5 }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={handleCancelEdit}
                            sx={{ p: 0.5 }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">{constraint.weight}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleEditWeight(constraint)}
                            sx={{ p: 0.5 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={constraint.description}
                        fullWidth
                        size="small"
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="standard"
                        sx={{
                          '& .MuiInput-root': {
                            '&:before': { borderBottom: 'none' },
                            '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            '&:after': { borderBottom: 'none' },
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">
              No constraints defined
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}