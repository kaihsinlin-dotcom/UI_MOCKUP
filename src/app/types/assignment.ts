export interface Constraint {
  id: string;
  name: string;
  type: string;
  weight: number;
  description: string;
}

export interface ParameterSet {
  id: string;
  name: string;
  description: string;
  version?: string;
  author?: string;
  createdDate: string;
  createdBy: string;
  usageCount: number;
  weekType?: "Plenary week" | "Non-plenary week";
  maxDailyWorkingHours?: number;
  maxDailyOvertimeHours?: number;
  constraints?: Constraint[];
  parameters: {
    maxSessionsPerDay: number;
    prioritizeSkills: boolean;
    allowOvertime: boolean;
    conflictPenalty: number;
  };
}

export interface AssignmentRun {
  id: string;
  description: string;
  weekOfRun: string;
  started: string;
  by: string;
  score: number;
  lastImprovement: string;
  mode: "Fixed" | "Continuous";
  status: "Running" | "Completed" | "Failed";
  versions: number;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  skills: string[];
  maxSessionsPerDay: number;
  unavailableDays: string[];
  unavailableTimeSlots: string[];
}

export interface MeetingSession {
  id: string;
  title: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
  requiredSkills: string[];
  technicianCount: number;
}

export interface AssignmentScenario {
  id: string;
  name: string;
  description: string;
  generatedDate: string;
  assignments: {
    sessionId: string;
    technicianIds: string[];
  }[];
  metrics: {
    totalSessions: number;
    assignedSessions: number;
    unassignedSessions: number;
    averageUtilization: number;
    constraintViolations: number;
  };
}

export interface RoomAssignment {
  id: string;
  room: string;
  day: DayOfWeek;
  sessionNr: string;
  town: string;
  session: string;
  startTime: string;
  endTime: string;
  assignedTechnicians: string[];
  serviceType: "REG" | "MOB";
  requester: string;
  status: "WIP" | "CAN" | "APR" | "WAI" | "REJ" | "TBC" | "REGIE";
  requiredTechnicians: number;
}

export interface TechnicianAssignment {
  id: string;
  technician: string;
  day: DayOfWeek;
  sessions: number;
  maxSessions: number;
  utilization: number; // percentage
  assignedRooms: string[];
  skills: string[];
  status: "MOB" | "REG" | "Unavailable";
}

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";