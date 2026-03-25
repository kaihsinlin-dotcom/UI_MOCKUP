import { useState } from "react";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  LinearProgress,
  Box,
  Typography,
  TableContainer,
  Paper,
} from "@mui/material";
import {
  MoreVert,
  CheckCircle,
  Cancel,
  Schedule,
  ExpandMore,
  ChevronRight,
  Save,
  Stop,
  Delete,
} from "@mui/icons-material";
import { assignmentRuns } from "../data/mockData";
import { format } from "date-fns";
import { Link } from "react-router";

interface RunsPageProps {
  onSelectionChange?: (selectedIds: string[]) => void;
  modeFilter?: string;
  assignedByFilter?: string;
  weekFilter?: string;
}

export function RunsPage({
  onSelectionChange,
  modeFilter = "all",
  assignedByFilter = "all",
  weekFilter = "all",
}: RunsPageProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRuns, setSelectedRuns] = useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: HTMLElement | null;
  }>({});

  const handleMenuOpen = (runId: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => ({ ...prev, [runId]: event.currentTarget }));
  };

  const handleMenuClose = (runId: string) => {
    setAnchorEl((prev) => ({ ...prev, [runId]: null }));
  };

  const toggleRow = (runId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(runId)) {
      newExpanded.delete(runId);
    } else {
      newExpanded.add(runId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelection = (runId: string) => {
    const newSelected = new Set(selectedRuns);
    if (newSelected.has(runId)) {
      newSelected.delete(runId);
    } else {
      newSelected.add(runId);
    }
    setSelectedRuns(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Running":
        return <Schedule className="size-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="size-4 text-green-500" />;
      case "Failed":
        return <Cancel className="size-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Running":
        return "default";
      case "Completed":
        return "secondary";
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getModeBadgeVariant = (mode: string) => {
    switch (mode) {
      case "Fixed":
        return { variant: "filled" as const, color: "primary" as const };
      case "Continuous":
        return { 
          variant: "filled" as const, 
          sx: { 
            backgroundColor: "#22c55e", 
            color: "white",
          } 
        };
      default:
        return { variant: "outlined" as const, color: "default" as const };
    }
  };

  // Helper function to get week color based on week number
  const getWeekColor = (week: string) => {
    const weekNum = parseInt(week.replace("Week ", ""));
    const colors = ["bg-green-500", "bg-red-500", "bg-blue-500"];
    return colors[weekNum % 3];
  };

  // Helper function to calculate week start date
  const getWeekStartDate = (week: string) => {
    const weekNum = parseInt(week.replace("Week ", ""));
    // Assuming 2026 starts on a Thursday, calculate week start
    const year2026Start = new Date(2026, 0, 1); // January 1, 2026
    const daysToAdd = (weekNum - 1) * 7;
    const weekStart = new Date(year2026Start);
    weekStart.setDate(weekStart.getDate() + daysToAdd);
    return format(weekStart, "MMM dd");
  };

  const handleSave = (runId: string) => {
    console.log("Save run:", runId);
  };

  const handleStop = (runId: string) => {
    console.log("Stop run:", runId);
  };

  const handleDelete = (runId: string) => {
    console.log("Delete run:", runId);
  };

  // Filter runs
  const filteredRuns = assignmentRuns.filter((run) => {
    if (modeFilter !== "all" && run.mode !== modeFilter) return false;
    if (assignedByFilter !== "all" && run.by !== assignedByFilter) return false;
    if (weekFilter !== "all" && run.weekOfRun !== weekFilter) return false;
    return true;
  });

  return (
    <div className="rounded-md border overflow-visible">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="w-[50px]"></TableCell>
              <TableCell className="w-[50px]"></TableCell>
              <TableCell>Run ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Week of Run</TableCell>
              <TableCell>Started</TableCell>
              <TableCell>Assigned by</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Last Improvement</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Snapshot</TableCell>
              <TableCell className="w-[80px]"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRuns.map((run) => {
              const isExpanded = expandedRows.has(run.id);
              const hasMultipleVersions = run.versions > 1;
              const isSelected = selectedRuns.has(run.id);

              return (
                <React.Fragment key={run.id}>
                  <TableRow>
                    <TableCell>
                      {hasMultipleVersions && (
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(run.id)}
                        >
                          {isExpanded ? (
                            <ExpandMore className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleSelection(run.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        to={`/run/${run.id}`}
                      
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
                      >
                        <div className="flex items-center gap-2 hover:underline">
                          {run.id}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/run/${run.id}`}
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
                      >
                        <div className="max-w-[300px] hover:underline">
                          <div className="font-medium">{run.description}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{run.weekOfRun}</span>
                        <div
                          className={`${getWeekColor(run.weekOfRun)} size-2 rounded-full`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(run.started), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{run.by}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${run.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {run.score.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(run.lastImprovement), "MMM dd, yyyy HH:mm")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        {...getModeBadgeVariant(run.mode)}
                        label={run.mode}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{run.versions}</span>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(run.id, event)}
                      >
                        <MoreVert className="size-4" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl[run.id]}
                        open={Boolean(anchorEl[run.id])}
                        onClose={() => handleMenuClose(run.id)}
                      >
                        <MenuItem onClick={() => handleSave(run.id)}>
                          <Save className="mr-2 size-4" />
                          Save
                        </MenuItem>
                        <MenuItem onClick={() => handleStop(run.id)}>
                          <Stop className="mr-2 size-4" />
                          Stop
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleDelete(run.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Delete className="mr-2 size-4" />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded versions */}
                  {isExpanded && hasMultipleVersions && (
                    <>
                      {Array.from({ length: run.versions }, (_, i) => i + 1)
                        .reverse()
                        .map((version) => {
                          const versionId = `${run.id}-v${version}`;
                          const isVersionSelected = selectedRuns.has(versionId);
                          
                          return (
                          <TableRow
                            key={versionId}
                            className="bg-muted/50"
                          >
                            <TableCell></TableCell>
                            <TableCell>
                              <Checkbox
                                checked={isVersionSelected}
                                onChange={() => toggleSelection(versionId)}
                              />
                            </TableCell>
                            <TableCell className="pl-8">
                              <span className="text-sm text-muted-foreground">
                                {version}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                Version {version} snapshot
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {run.weekOfRun}
                                </span>
                                <div
                                  className={`${getWeekColor(run.weekOfRun)} size-2 rounded-full opacity-60`}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {format(
                                  new Date(
                                    new Date(run.started).getTime() +
                                      version * 3600000
                                  ),
                                  "MMM dd, yyyy HH:mm"
                                )}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {run.by}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary opacity-60"
                                    style={{
                                      width: `${Math.max(
                                        50,
                                        run.score - (run.versions - version) * 2
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {Math.max(
                                    50,
                                    run.score - (run.versions - version) * 2
                                  ).toFixed(1)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <Chip
                                {...getModeBadgeVariant(run.mode)}
                                label={run.mode}
                                sx={{ opacity: 0.6 }}
                              />
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium text-muted-foreground">
                                {version}
                              </span>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={(event) =>
                                  handleMenuOpen(`${run.id}-v${version}`, event)
                                }
                              >
                                <MoreVert className="size-4" />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl[`${run.id}-v${version}`]}
                                open={Boolean(anchorEl[`${run.id}-v${version}`])}
                                onClose={() => handleMenuClose(`${run.id}-v${version}`)}
                              >
                                <MenuItem
                                  onClick={() => handleSave(`${run.id}-v${version}`)}
                                >
                                  <Save className="mr-2 size-4" />
                                  Save
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleStop(`${run.id}-v${version}`)}
                                >
                                  <Stop className="mr-2 size-4" />
                                  Stop
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    handleDelete(`${run.id}-v${version}`)
                                  }
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Delete className="mr-2 size-4" />
                                  Delete
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        );
                        })}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}