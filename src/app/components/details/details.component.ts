import { Component, EventEmitter, Output } from '@angular/core';
// import { employee } from '../../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeServiceService } from '../../services/employee-service.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  @Output() BackEvent = new EventEmitter<void>();
  id: string = "";
  emp?: employee;
  something?: string = "Something"
  constructor(private router: ActivatedRoute, private empservice: EmployeeServiceService, private route: Router, private locaton: Location) { }
  ngOnInit() {
    console.log("details");
    this.id = this.router.snapshot.paramMap.get('id')!;

    if (this.id) {
      this.empservice.GetEmployee(this.id).subscribe((response) => {
        console.log(response);
        this.emp = response as employee
      })
    } else {

    }
  };
  GoBack() {
    this.locaton.back();
  }
  EditForm() {
    console.log("Hello from editform");
    // this.selecteduser = ;
    // this.viewmode = 'form';
    // this.showtable = false;
    this.route.navigate([`/form/${this.emp?.empId}`]);
    // const index = this.employeeList.indexOf(data);
  }
  DeleteResource() {
    const id = this.emp?.empId;
    if (id !== undefined) {
      this.empservice.DeleteEmployee(parseInt(id)).subscribe((res: any) => {
        console.log("deleted");
        this.route.navigate([`/kendo`]);
      });
    } else {
      console.warn("Cannot delete: empId is undefined");
    }
  }
}

export interface employee {
  empId: string;
  resourceName: string;
  designation: string;
  reportingTo: string;
  billable: string;
  technologySkill: string;
  projectAllocation: string;
  location: string;
  emailId: string;
  cteDoj: string;
  remarks: string;
}