import { Link, useLocation } from "react-router";
import { Button, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import { PlayArrow, CompareArrows, FilterList } from "@mui/icons-material";
import { useState } from "react";
import { NewRunModal, NewRunData } from "./new-run-modal";

interface TabNavigationProps {
  selectedCount?: number;
  onCompare?: () => void;
  onModeFilter?: (mode: string) => void;
  onAssignedByFilter?: (assignedBy: string) => void;
  onWeekFilter?: (week: string) => void;
}

export function TabNavigation({
  selectedCount = 0,
  onCompare,
  onModeFilter,
  onAssignedByFilter,
  onWeekFilter,
}: TabNavigationProps) {
  const location = useLocation();

  const handleRunAssignment = () => {
    console.log("Running new assignment");
  };

  const isRunsActive = location.pathname === "/" || location.pathname === "/runs";
  const isParametersActive = location.pathname === "/parameter-sets";

  const [newRunModalOpen, setNewRunModalOpen] = useState(false);

  const handleOpenNewRunModal = () => {
    setNewRunModalOpen(true);
  };

  const handleCloseNewRunModal = () => {
    setNewRunModalOpen(false);
  };

  const handleSaveNewRun = (data: NewRunData) => {
    console.log("New run created:", data);
    // TODO: Implement actual run creation logic
  };

  return (
    <div className="space-y-6">
      {/* Header with Run Assignment */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Technician Assignment Planner</h1>
          <p className="text-muted-foreground mt-2">
            Simulate and compare automatic technician assignments for meeting sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            onClick={onCompare}
            disabled={selectedCount !== 2}
            startIcon={<CompareArrows />}
          >
            Compare
          </Button>
          <Button 
            onClick={handleOpenNewRunModal} 
            size="large"
            variant="contained"
            startIcon={<PlayArrow />}
          >
            New Run
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between">
          <nav className="flex gap-8" aria-label="Tabs">
            <Link
              to="/runs"
              className={`border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                isRunsActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Runs
            </Link>
            <Link
              to="/parameter-sets"
              className={`border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                isParametersActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Parameter Sets
            </Link>
          </nav>

          {/* Filters - Only show on Runs tab */}
          {isRunsActive && (
            <div className="flex items-center gap-3 pb-3">
              <FilterList className="size-4 text-muted-foreground" />
              
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  defaultValue="all"
                  onChange={(e) => onModeFilter?.(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="all">All Modes</MenuItem>
                  <MenuItem value="Fixed">Fixed</MenuItem>
                  <MenuItem value="Continuous">Continuous</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  defaultValue="all"
                  onChange={(e) => onAssignedByFilter?.(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="all">All Users</MenuItem>
                  <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
                  <MenuItem value="Michael Brown">Michael Brown</MenuItem>
                  <MenuItem value="David Chen">David Chen</MenuItem>
                  <MenuItem value="John Smith">John Smith</MenuItem>
                  <MenuItem value="Maria Garcia">Maria Garcia</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  defaultValue="all"
                  onChange={(e) => onWeekFilter?.(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="all">All Weeks</MenuItem>
                  <MenuItem value="Week 12">Week 12</MenuItem>
                  <MenuItem value="Week 11">Week 11</MenuItem>
                  <MenuItem value="Week 10">Week 10</MenuItem>
                  <MenuItem value="Week 9">Week 9</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </div>
      </div>

      {/* New Run Modal */}
      <NewRunModal
        open={newRunModalOpen}
        onClose={handleCloseNewRunModal}
        onSave={handleSaveNewRun}
      />
    </div>
  );
}