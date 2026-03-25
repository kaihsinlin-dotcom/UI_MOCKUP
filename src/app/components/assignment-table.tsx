import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Calendar } from "./ui/calendar";
import {
  Calendar as CalendarIcon,
  Play,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { assignmentRuns, parameterSets } from "../data/mockData";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export function AssignmentTable() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 2, 15), // March 15, 2026 (Monday)
    to: new Date(2026, 2, 19),   // March 19, 2026 (Friday)
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleRunAssignment = () => {
    console.log("Running new assignment for date range:", dateRange);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Running":
        return <Clock className="size-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle2 className="size-4 text-green-500" />;
      case "Failed":
        return <XCircle className="size-4 text-red-500" />;
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
      case "Balanced":
        return "default";
      case "Skills Priority":
        return "secondary";
      case "Minimize Conflicts":
        return "outline";
      default:
        return "outline";
    }
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
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[280px] justify-start">
                <CalendarIcon className="mr-2 size-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                      {format(dateRange.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleRunAssignment} size="lg">
            <Play className="mr-2 size-4" />
            New Run
          </Button>
        </div>
      </div>

      {/* Tabs for Runs and Parameter Sets */}
      <Tabs defaultValue="runs" className="w-full">
        <TabsList>
          <TabsTrigger value="runs">Runs</TabsTrigger>
          <TabsTrigger value="parameters">Parameter Sets</TabsTrigger>
        </TabsList>

        {/* Runs Tab */}
        <TabsContent value="runs" className="mt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Week of Run</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Last Improvement</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Snapshot</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(run.status)}
                        {run.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="font-medium">{run.description}</div>
                        <div className="text-sm text-muted-foreground">
                          <Badge variant={getStatusBadgeVariant(run.status)} className="mt-1">
                            {run.status}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{run.weekOfRun}</TableCell>
                    <TableCell>
                      {format(new Date(run.started), "MMM dd, HH:mm")}
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
                        <span className="text-sm font-medium">{run.score.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {run.lastImprovement}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getModeBadgeVariant(run.mode)}>
                        {run.mode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Parameter Sets Tab */}
        <TabsContent value="parameters" className="mt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter Set ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Parameters</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
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
                      <Badge variant="secondary">{paramSet.usageCount} runs</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          Max: {paramSet.parameters.maxSessionsPerDay}
                        </Badge>
                        {paramSet.parameters.prioritizeSkills && (
                          <Badge variant="outline" className="text-xs">
                            Skills Priority
                          </Badge>
                        )}
                        {paramSet.parameters.allowOvertime && (
                          <Badge variant="outline" className="text-xs">
                            Overtime OK
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Penalty: {paramSet.parameters.conflictPenalty}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
