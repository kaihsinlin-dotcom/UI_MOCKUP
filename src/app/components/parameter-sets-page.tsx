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
    <Paper className="p-6 max-w-4xl mx-auto">
      {/* Title */}
      <Typography variant="h5" component="h1" className="mb-6 font-semibold">
        Parameter Set
      </Typography>

      {/* Section 1: Basic Information */}
      <Box className="space-y-6 mb-8">
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
        
        <Box className="grid grid-cols-2 gap-6">
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
      <Box className="space-y-6 mb-8">
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
        
        <Box className="grid grid-cols-2 gap-6">
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
        <Typography variant="h6" component="h2" className="mb-4">
          Constraints
        </Typography>
        <Box className="border rounded-md p-4 text-center text-gray-500">
          <Typography variant="body2">
            Constraints data table will be implemented here
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}