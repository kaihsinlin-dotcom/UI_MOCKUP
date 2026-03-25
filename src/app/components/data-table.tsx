import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Search,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Plus,
} from "lucide-react";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "on-leave";
  joinDate: string;
  salary: number;
}

const mockData: Employee[] = [
  {
    id: "EMP001",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    joinDate: "2022-01-15",
    salary: 95000,
  },
  {
    id: "EMP002",
    name: "Michael Chen",
    email: "m.chen@company.com",
    role: "Product Manager",
    department: "Product",
    status: "active",
    joinDate: "2021-06-20",
    salary: 110000,
  },
  {
    id: "EMP003",
    name: "Emma Davis",
    email: "emma.d@company.com",
    role: "UX Designer",
    department: "Design",
    status: "on-leave",
    joinDate: "2023-03-10",
    salary: 85000,
  },
  {
    id: "EMP004",
    name: "James Wilson",
    email: "j.wilson@company.com",
    role: "DevOps Engineer",
    department: "Engineering",
    status: "active",
    joinDate: "2020-11-05",
    salary: 98000,
  },
  {
    id: "EMP005",
    name: "Olivia Martinez",
    email: "olivia.m@company.com",
    role: "Marketing Lead",
    department: "Marketing",
    status: "active",
    joinDate: "2022-08-22",
    salary: 92000,
  },
  {
    id: "EMP006",
    name: "Daniel Brown",
    email: "d.brown@company.com",
    role: "Data Analyst",
    department: "Analytics",
    status: "inactive",
    joinDate: "2021-04-18",
    salary: 78000,
  },
  {
    id: "EMP007",
    name: "Sophia Taylor",
    email: "s.taylor@company.com",
    role: "HR Manager",
    department: "Human Resources",
    status: "active",
    joinDate: "2019-09-12",
    salary: 88000,
  },
  {
    id: "EMP008",
    name: "Liam Anderson",
    email: "l.anderson@company.com",
    role: "Backend Developer",
    department: "Engineering",
    status: "active",
    joinDate: "2023-01-30",
    salary: 87000,
  },
  {
    id: "EMP009",
    name: "Ava Thomas",
    email: "ava.t@company.com",
    role: "Sales Executive",
    department: "Sales",
    status: "active",
    joinDate: "2022-05-14",
    salary: 82000,
  },
  {
    id: "EMP010",
    name: "Noah Garcia",
    email: "n.garcia@company.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "on-leave",
    joinDate: "2021-12-08",
    salary: 75000,
  },
];

type SortField = keyof Employee;
type SortDirection = "asc" | "desc" | null;

export function DataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Get unique departments for filter
  const departments = useMemo(
    () => Array.from(new Set(mockData.map((emp) => emp.department))),
    []
  );

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = mockData.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || employee.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "all" || employee.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, statusFilter, departmentFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((emp) => emp.id)));
    }
  };

  const getStatusBadgeVariant = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "on-leave":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employee Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all employee information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="size-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={departmentFilter}
          onValueChange={(value) => {
            setDepartmentFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected rows info */}
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-md">
          <span className="text-sm">
            {selectedRows.size} row(s) selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedRows(new Set())}
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    paginatedData.length > 0 &&
                    selectedRows.size === paginatedData.length
                  }
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-2">
                  ID
                  {sortField === "id" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Name
                  {sortField === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center gap-2">
                  Role
                  {sortField === "role" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("department")}
              >
                <div className="flex items-center gap-2">
                  Department
                  {sortField === "department" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortField === "status" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("salary")}
              >
                <div className="flex items-center gap-2">
                  Salary
                  {sortField === "salary" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="size-8 mb-2 opacity-50" />
                    <p>No results found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((employee) => (
                <TableRow
                  key={employee.id}
                  data-state={selectedRows.has(employee.id) ? "selected" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(employee.id)}
                      onCheckedChange={() => toggleRowSelection(employee.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {employee.email}
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${employee.salary.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="size-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="size-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">
            {filteredData.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredData.length)}
          </span>{" "}
          of <span className="font-medium">{filteredData.length}</span> results
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 py-1">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-9"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
