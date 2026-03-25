import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { TabNavigation } from "./tab-navigation";
import { RunsPage } from "./runs-page";

export default function Root() {
  const location = useLocation();
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [assignedByFilter, setAssignedByFilter] = useState<string>("all");
  const [weekFilter, setWeekFilter] = useState<string>("all");

  const handleCompare = () => {
    console.log("Comparing runs:", selectedRuns);
    // TODO: Implement comparison logic
  };

  const isRunsPage = location.pathname === "/" || location.pathname === "/runs";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <TabNavigation
          selectedCount={selectedRuns.length}
          onCompare={handleCompare}
          onModeFilter={setModeFilter}
          onAssignedByFilter={setAssignedByFilter}
          onWeekFilter={setWeekFilter}
        />
        {isRunsPage ? (
          <RunsPage
            onSelectionChange={setSelectedRuns}
            modeFilter={modeFilter}
            assignedByFilter={assignedByFilter}
            weekFilter={weekFilter}
          />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
