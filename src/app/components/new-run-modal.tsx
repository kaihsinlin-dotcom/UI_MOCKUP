import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from "@mui/material";
import { parameterSets } from "../data/mockData";

interface NewRunModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewRunData) => void;
}

export interface NewRunData {
  week: number;
  parameterSetId: string;
  mode: "Fixed" | "Continuous";
  duration?: number; // in hours, only for Fixed mode
  autoSnapshot: boolean;
  snapshotInterval?: number; // in minutes
}

export function NewRunModal({ open, onClose, onSave }: NewRunModalProps) {
  const [week, setWeek] = useState<number | "">("");
  const [parameterSetId, setParameterSetId] = useState("");
  const [mode, setMode] = useState<"Fixed" | "Continuous" | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [autoSnapshot, setAutoSnapshot] = useState(false);
  const [snapshotInterval, setSnapshotInterval] = useState<number | "">("");

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setWeek("");
      setParameterSetId("");
      setMode("");
      setDuration("");
      setAutoSnapshot(false);
      setSnapshotInterval("");
    }
  }, [open]);

  // Check if form is valid
  const isValid = () => {
    if (!week || !parameterSetId || !mode) return false;
    if (mode === "Fixed" && !duration) return false;
    if (autoSnapshot && (!snapshotInterval || snapshotInterval <= 0)) return false;
    return true;
  };

  const handleSave = () => {
    if (!isValid()) return;

    const data: NewRunData = {
      week: week as number,
      parameterSetId,
      mode: mode as "Fixed" | "Continuous",
      duration: mode === "Fixed" ? (duration as number) : undefined,
      autoSnapshot,
      snapshotInterval: autoSnapshot ? (snapshotInterval as number) : undefined,
    };

    onSave(data);
    onClose();
  };

  // Generate week options (1-52)
  const weekOptions = Array.from({ length: 52 }, (_, i) => i + 1);

  // Duration options in hours
  const durationOptions = [0.5, 1, 2, 3, 4, 6, 8, 12, 24];

  // Snapshot interval options in minutes
  const intervalOptions = [10, 20, 30, 40, 60, 90, 120];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Assignment Run</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          {/* Week Selection */}
          <FormControl fullWidth required>
            <InputLabel>Week of Run</InputLabel>
            <Select
              value={week}
              label="Week of Run"
              onChange={(e) => setWeek(e.target.value as number)}
            >
              {weekOptions.map((w) => (
                <MenuItem key={w} value={w}>
                  Week {w} (2026)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Parameter Set Selection */}
          <FormControl fullWidth required>
            <InputLabel>Parameter Set</InputLabel>
            <Select
              value={parameterSetId}
              label="Parameter Set"
              onChange={(e) => setParameterSetId(e.target.value)}
            >
              {parameterSets.map((param, index) => (
                <MenuItem key={param.id} value={param.id}>
                  Parameter Set {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Mode Selection */}
          <FormControl fullWidth required>
            <InputLabel>Mode</InputLabel>
            <Select
              value={mode}
              label="Mode"
              onChange={(e) => setMode(e.target.value as "Fixed" | "Continuous")}
            >
              <MenuItem value="Fixed">Fixed</MenuItem>
              <MenuItem value="Continuous">Continuous</MenuItem>
            </Select>
          </FormControl>

          {/* Duration (only for Fixed mode) */}
          {mode === "Fixed" && (
            <FormControl fullWidth required>
              <InputLabel>Duration</InputLabel>
              <Select
                value={duration}
                label="Duration"
                onChange={(e) => setDuration(e.target.value as number)}
              >
                {durationOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d >= 1 ? `${d} hour${d > 1 ? "s" : ""}` : `${d * 60} minutes`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Auto Snapshot */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={autoSnapshot}
                  onChange={(e) => setAutoSnapshot(e.target.checked)}
                />
              }
              label="Auto Snapshot Save"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Automatically save snapshots at regular intervals
            </Typography>
          </Box>

          {/* Snapshot Interval (only when auto snapshot is enabled) */}
          {autoSnapshot && (
            <TextField
              sx={{ width: '100px' }}
              required
              type="number"
              label="minutes"
              value={snapshotInterval}
              onChange={(e) => setSnapshotInterval(e.target.value ? Number(e.target.value) : "")}
              inputProps={{ min: 1, step: 1 }}
              helperText="Enter interval in minutes (e.g., 20, 30, 60)"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isValid()}
        >
          Run
        </Button>
      </DialogActions>
    </Dialog>
  );
}