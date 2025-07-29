
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiDictionary } from './api-dictionary.service';
import { HttpParams } from '@angular/common/http';

 
@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  constructor(private api: ApiService) {}
 
  GetEmployee(empId: string) {
    const params = new HttpParams().set('id', empId);
    return this.api.get(ApiDictionary.GetEmployeeById.url, params);
  }
 
  AddNewEployee(data: any) {
    return this.api.post(ApiDictionary.AddEmployee.url, data);
  }
 
  GetAllEmployees() {
    return this.api.get(ApiDictionary.GetAllEmployees.url);
  }
 
  UpdateEmployee(empID: number, data: any ) {
    return this.api.put(`${ApiDictionary.UpdateEmployee.url}/${empID}`, data);
  }
 
  DeleteEmployee(empId: number) {
    return this.api.delete(`${ApiDictionary.DeleteEmployee.url}?id=${empId}`);
  }

  GetSkills(){
    return this.api.get(ApiDictionary.Skills.url);
  }

  GetDesignations(){
    return this.api.get(ApiDictionary.Designations.url);
  }

  GetLocations(){
    return this.api.get(ApiDictionary.Locations.url);
  }

}
