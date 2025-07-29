import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { employee } from '../../app.component';
import { EmployeeServiceService } from '../../services/employee-service.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalEmployees = 0;
  totalManagers = 0;
  totalProjects = 0;
  totalLocations = 0;
  billablePercent = 0;

  allEmployees: employee[] = [];

  managerGroups: { [key: string]: employee[] } = {};
  projectGroups: { [key: string]: employee[] } = {};
  locationGroups: { [key: string]: employee[] } = {};

  skillChartData: any[] = [];

  constructor(private empService: EmployeeServiceService) { }

  ngOnInit(): void {
    this.loadDashboard();
  }
  loadDashboard() {
    this.empService.GetAllEmployees().subscribe((data: any[]) => {
      // ✅ Corrected mapping to PascalCase keys as expected by the employee interface
      const employees: employee[] = data.map((item: any) => ({
        EmpId: item.empId,
        ResourceName: item.resourceName,
        Designation: item.designation,
        ReportingTo: item.reportingTo,
        Billable: item.billable ? 'YES' : 'NO',
        TechnologySkill: item.technologySkill,
        ProjectAllocation: item.projectAllocation,
        Location: item.location,
        EmailId: item.emailId,
        CteDoj: item.cteDoj,
        Remarks: item.remarks
      }));

      this.allEmployees = employees;
      this.totalEmployees = employees.length;

      const managerSet = new Set(employees.map(e => e.ReportingTo));
      this.totalManagers = managerSet.size;

      const projectSet = new Set(employees.map(e => e.ProjectAllocation));
      this.totalProjects = projectSet.size;

      const locationSet = new Set(employees.map(e => e.Location));
      this.totalLocations = locationSet.size;

      const billableCount = employees.filter(e => e.Billable === 'YES').length;
      this.billablePercent = Math.round((billableCount / employees.length) * 100);

      this.managerGroups = this.groupBy(employees, 'ReportingTo');
      this.projectGroups = this.groupBy(employees, 'ProjectAllocation');
      this.locationGroups = this.groupBy(employees, 'Location');

      const skillMap = new Map<string, number>();
      employees.forEach(emp => {
        if (emp.TechnologySkill) {
          emp.TechnologySkill.split(',').forEach((s: string) => {
            const skill = s.trim();
            if (skill) {
              skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
            }
          });
        }
      });
      this.skillChartData = Array.from(skillMap.entries()).map(([name, value]) => ({ name, value }));
    });
  }


  groupBy(arr: employee[], key: keyof employee): { [key: string]: employee[] } {
    return arr.reduce((acc, obj) => {
      const groupKey = obj[key] || 'Unassigned';
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(obj);
      return acc;
    }, {} as { [key: string]: employee[] });
  }
}
