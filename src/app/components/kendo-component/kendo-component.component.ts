import { Component } from '@angular/core';
import { EmployeeServiceService } from '../../services/employee-service.service';
import { NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { employee } from '../../app.component';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

@Component({
  selector: 'app-kendo-component',
  standalone: true,
  imports: [CommonModule, GridModule, ExcelExportModule, ReactiveFormsModule, FormsModule, PDFExportModule],
  templateUrl: './kendo-component.component.html',
  styleUrl: './kendo-component.component.css'
})
export class KendoComponentComponent {
  constructor(
    private empService: EmployeeServiceService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  title = 'MyProject';
  viewmode: 'grid' | 'form' | 'details' | null = 'grid';
  employeeList: employee[] = [];
  showtable: boolean | null = true;
  selecteduser: employee | null = null;
  edituser: employee | null = null;
  selectedKeys: string[] = [];
  showBulkForm = false;
  bulkForm!: FormGroup;



  get employee_list(): employee[] {
    return this.employeeList;
  }

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
    this.router.navigate([`/details/${id}`]);
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

  EditForm(emp: employee) {
    this.router.navigate([`/form/${emp.EmpId}`]);
  }

  delete(data: employee) {
    this.empService.DeleteEmployee(+data.EmpId).subscribe(() => {
      this.loadEmployeeList();
    });
  }

  loadEmployeeList() {
    this.empService.GetAllEmployees().subscribe((data: any) => {
      this.employeeList = data.map((item: any) => ({
        EmpId: item.empId.toString(),
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
    });
  }

  toggleBulkEditForm() {
    this.showBulkForm = !this.showBulkForm;
  }

  submitBulkEdit() {
    const updates = this.bulkForm.value;
    const updatedList = this.employeeList.filter(emp => this.selectedKeys.includes(emp.EmpId));

    let completed = 0;
    updatedList.forEach(emp => {
      const updatedEmp = {
        EmpId: emp.EmpId,
        ResourceName: emp.ResourceName,
        Designation: updates.Designation || emp.Designation,
        ReportingTo: emp.ReportingTo,
        Billable: updates.Billable === 'YES',
        TechnologySkill: emp.TechnologySkill,
        ProjectAllocation: updates.ProjectAllocation || emp.ProjectAllocation,
        Location: updates.Location || emp.Location,
        EmailId: emp.EmailId,
        CteDoj: emp.CteDoj,
        Remarks: emp.Remarks
      };

      this.empService.UpdateEmployee(+emp.EmpId, updatedEmp).subscribe(() => {
        completed++;
        if (completed === updatedList.length) {
          alert('Bulk update successful!');
          this.bulkForm.reset();
          this.selectedKeys = [];
          this.showBulkForm = false;
          this.loadEmployeeList();
        }
      });
    });
  }

  exportToCSV(): void {
    const csvRows: string[] = [];
    const headers = [
      'empId', 'resourceName', 'designation', 'reportingTo', 'billable',
      'technologySkill', 'projectAllocation', 'location', 'emailId', 'cteDoj', 'remarks'
    ];
    csvRows.push(headers.join(','));

    this.employeeList.forEach((item: employee) => {
      const row = [
        item.EmpId, item.ResourceName, item.Designation, item.ReportingTo, item.Billable,
        item.TechnologySkill, item.ProjectAllocation, item.Location, item.EmailId,
        item.CteDoj, item.Remarks
      ].map(field => `"${String(field).replace(/"/g, '""')}"`);
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'EmployeeDetails.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  ngOnInit() {
    this.bulkForm = this.fb.group({
      Designation: [''],
      Billable: [''],
      ProjectAllocation: [''],
      Location: ['']
    });

    this.loadEmployeeList();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/') {
        this.loadEmployeeList();
        this.showtable = true;
        this.viewmode = null;
      }
    });
  }

  ngOnchanges() {
    this.employeeList = [...this.employeeList];
    this.loadEmployeeList();
  }
}
