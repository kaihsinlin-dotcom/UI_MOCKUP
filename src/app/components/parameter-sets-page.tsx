import {
  TextField,
  MenuItem,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { Separator } from "./ui/separator";
import { parameterSets } from "../data/mockData";
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
              readOnly: (parameterSet.author || parameterSet.createdBy) !== "My self",
            }}
            disabled={(parameterSet.author || parameterSet.createdBy) !== "My self"}
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
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <TextField
            label="Max. daily working hours"
            type="number"
            value={parameterSet.maxDailyWorkingHours || 8}
            onChange={handleChange("maxDailyWorkingHours")}
            fullWidth
            variant="outlined"
            inputProps={{ min: 0, step: 0.5 }}
          />
          
          <TextField
            label="Max. daily overtime hours per day"
            type="number"
            value={parameterSet.maxDailyOvertimeHours || 0}
            onChange={handleChange("maxDailyOvertimeHours")}
            fullWidth
            variant="outlined"
            inputProps={{ min: 0, step: 0.5 }}
          />
        </Box>
      </Box>

      {/* Divider */}
      <Separator className="my-8" />

      {/* Section 3: Constraints (Placeholder) */}
      <Box>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Constraints
        </Typography>
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">
            Constraints data table will be implemented here
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}