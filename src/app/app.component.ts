import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { EmployeeServiceService } from './services/employee-service.service';
import { CommonModule } from '@angular/common';
import { KendoComponentComponent } from './components/kendo-component/kendo-component.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DetailsComponent } from './components/details/details.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DetailsComponent, RouterLink, KendoComponentComponent, GridModule, ButtonsModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'resource-tracker-app';
  viewmode: 'grid' | 'form' | 'details' | null = 'grid';
  employeeList: employee[] = [];
  get employee_list(): employee[] {
    return this.employeeList;
  }
  showtable: boolean | null = true;
  selecteduser: employee | null = null;
  edituser: employee | null = null;
  constructor(private empService: EmployeeServiceService, private router: Router) { }

  ngOnInit() {
    this.loadEmployeeList();
    console.log("hello");
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/') {
        this.loadEmployeeList();
        this.showtable = true;
        this.viewmode = null;
        console.log("comming");
      }
    })
  }

  // Methods
  showform() {
    this.showtable = false;
    this.router.navigate(['/form']);
  }
  homebutton() {
    this.showtable = true;
    this.viewmode = null;
    this.router.navigate(['/']);
  }
  showdetails(emp: employee) {
    this.showtable = false;
    const id = emp.EmpId;
    this.router.navigate(['/details', id]);
  }
  AddFunc() {
    this.viewmode = 'form';
    this.selecteduser = null;
  }
  GoHome() {
    this.viewmode = 'grid';
  }
  editformtabel() {
    this.viewmode = 'form';
  }
  EditForm(data: employee) {
    this.selecteduser = data;
    this.viewmode = 'form';
    this.showtable = false;
  }
  delete(data: employee) {
    this.empService.DeleteEmployee(+data.EmpId).subscribe(() => {
      console.log("delted");
      this.loadEmployeeList();
    })
  }

  Addemp(data: employee) {
    this.showtable = true;
    this.viewmode = null;
    this.loadEmployeeList();
  }
  changing: employee[] = [];
  ngOnchanges() {
    this.employeeList = [...this.employeeList];
    this.loadEmployeeList();
  }
  BackDetails() {
    this.viewmode = 'grid';
  }

  getIndex(data: employee): number {
    return this.employeeList.findIndex(e =>
      e.EmpId === data.EmpId &&
      e.ResourceName === data.ResourceName &&
      e.Designation === data.Designation &&
      e.ReportingTo === data.ReportingTo &&
      e.Billable === data.Billable &&
      e.TechnologySkill === data.TechnologySkill &&
      e.ProjectAllocation === data.ProjectAllocation &&
      e.Location === data.Location &&
      e.EmailId === data.EmailId &&
      e.CteDoj === data.CteDoj &&
      e.Remarks === data.Remarks
    );
  }

  loadEmployeeList() {
    console.log("Calling GetAllEmployees()");
    this.empService.GetAllEmployees().subscribe((data: any) => {
      this.employeeList = data.map((item: any) => ({
        EmpId: item.empId,
        ResourceName: item.resourceName,
        Designation: item.designation,
        ReportingTo: item.reportingTo,
        Billable: item.billable,
        TechnologySkill: item.technologySkill,
        ProjectAllocation: item.projectAllocation,
        Location: item.location,
        EmailId: item.emailId,
        CteDoj: item.cteDoj,
        Remarks: item.remarks
      }));
    });
  }
}

export interface employee {
  EmpId: string;
  ResourceName: string;
  Designation: string;
  ReportingTo: string;
  Billable: string;
  TechnologySkill: string;
  ProjectAllocation: string;
  Location: string;
  EmailId: string;
  CteDoj: string;
  Remarks: string;
}