import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeServiceService } from '../../services/employee-service.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownsModule, MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dropdownform',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropDownsModule,
    MultiSelectModule,],
  templateUrl: './dropdownform.component.html',
  styleUrl: './dropdownform.component.css'
})
export class DropdownformComponent {
  newForm!: FormGroup;
  emp: employee | null = null;
  id: string = '';
  popupVisible = false;
  popupTitle = '';
  popupData: employee | null = null;
  parsedEmployees: any[] = [];
  importReady: boolean = false;

  billableList = ['YES', 'NO'];
  projectList = ['Schneider Electric', 'Hills', 'Project Z'];
  designationList = [];
  locationList = [];
  techList = [];


  constructor(
    private empService: EmployeeServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.newForm = new FormGroup({
      ResourceName: new FormControl('', Validators.required),
      Designation: new FormControl('', Validators.required),
      ReportingTo: new FormControl('', Validators.required),
      Billable: new FormControl('', Validators.required),
      TechnologySkill: new FormControl([], Validators.required),
      ProjectAllocation: new FormControl('', Validators.required),
      Location: new FormControl('', Validators.required),
      EmailId: new FormControl('', [Validators.required, Validators.email]),
      CteDoj: new FormControl('', Validators.required),
      Remarks: new FormControl('')
    });
    this.empService.GetDesignations().subscribe((response: any) => {
      this.designationList = response;
    });

    this.empService.GetLocations().subscribe((response: any) => {
      this.locationList = response;
    });

    this.empService.GetSkills().subscribe((response: any) => {
      this.techList = response;
    });
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (!this.id) return;
    this.empService.GetEmployee(this.id).subscribe((response: any) => {
      this.emp = {
        EmpId: response.empId,
        ResourceName: response.resourceName,
        Designation: response.designation,
        ReportingTo: response.reportingTo,
        Billable: response.billable ? 'Yes' : 'No',
        TechnologySkill: response.technologySkill,
        ProjectAllocation: response.projectAllocation,
        Location: response.location,
        EmailId: response.emailId,
        CteDoj: response.cteDoj,
        Remarks: response.remarks
      };

      this.newForm.patchValue({
        ...this.emp,
        TechnologySkill: this.emp.TechnologySkill.split(',').map((skill: string) => skill.trim())
      });
    });
  }



  onSkillChange(skills: string[]): void {
    this.newForm.patchValue({ TechnologySkill: skills });
  }

  Submit(): void {
    if (this.newForm.valid) {
      const formValue = this.newForm.value;

      const payload = {
        empId: this.emp ? +this.emp.EmpId : 0,
        resourceName: formValue.ResourceName,
        designation: formValue.Designation,
        reportingTo: formValue.ReportingTo,
        billable: formValue.Billable === 'Yes',
        technologySkill: formValue.TechnologySkill.join(', '),
        projectAllocation: formValue.ProjectAllocation,
        location: formValue.Location,
        emailId: formValue.EmailId,
        cteDoj: formValue.CteDoj,
        remarks: formValue.Remarks
      };

      if (this.emp) {
        this.empService.UpdateEmployee(payload.empId, payload).subscribe(() => {
          this.popupTitle = '✏️ Employee Updated Successfully';
          this.popupData = { ...formValue, EmpId: this.emp?.EmpId || '', Billable: formValue.Billable };
          this.popupVisible = true;
          this.router.navigate(['/kendo']);
        });
      } else {
        this.empService.AddNewEployee(payload).subscribe(() => {
          this.popupTitle = '✅ Employee Added Successfully';
          this.popupData = { ...formValue, EmpId: '', Billable: formValue.Billable };
          this.popupVisible = true;
          this.router.navigate(['/kendo']);
        });
      }

      this.newForm.reset();
    }
  }

  closePopup(): void {
    this.popupVisible = false;
    this.popupData = null;
    this.router.navigate(['/kendo']);
  }
  onCsvFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.trim().split('\n');
      const headers = lines[0].replace('\r', '').split(',').map(h => h.replace(/^"|"$/g, '').trim());

      this.parsedEmployees = [];

      for (let i = 1; i < lines.length; i++) {
        const raw = lines[i].replace('\r', '').trim();
        if (!raw) continue;

        const row = raw.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // split on commas not inside quotes
        const employee: any = {};

        headers.forEach((header, index) => {
          const key = header;
          let value = row[index]?.trim().replace(/^"|"$/g, '') ?? '';

          switch (key.toLowerCase()) {
            case 'empid':
              employee[key] = 0;
              break;
            case 'billable':
              employee[key] = value.toLowerCase() === 'yes';
              break;
            default:
              employee[key] = value;
          }
        });

        this.parsedEmployees.push(employee);
      }

      this.importReady = this.parsedEmployees.length > 0;
    };

    reader.readAsText(file);
  }

  submitCsvImport(): void {
    if (!this.importReady || this.parsedEmployees.length === 0) return;

    const insertRequests = this.parsedEmployees.map(emp =>
      this.empService.AddNewEployee(emp)
    );

    forkJoin(insertRequests).subscribe({
      next: () => {
        this.popupTitle = '✅ CSV Import Completed';
        this.popupData = null;
        this.popupVisible = true;

        // Reset state
        this.importReady = false;
        this.parsedEmployees = [];

        // Navigate to /kendo
        this.router.navigate(['/kendo']);
      },
      error: (err: any) => {
        console.error('❌ Error during CSV import:', err);
        alert('Some rows could not be imported. Check console for details.');
      }
    });
  }

}

interface employee {
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
