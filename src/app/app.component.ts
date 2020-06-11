import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpService } from './Services/http-service.service';
import { PutDTO, PostDTO, QueryParameters } from './Interfaces/interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EdiTable';

  columns = ['Company', 'Contact', 'Country'];
  itemsPerPage: Array<number> = [5,10,15,20,30,50,];
  selectedItemsPerPage: number = 20;
  isEditable: boolean = true;
  isDeleteable: boolean = true;
  isSelectable: boolean = false;
  isSearchable: boolean = false;
  isSortable: boolean = false;
  boolOptions: Array<boolean> = [true, false]

  doSomething(){
    console.log(this.form);
  }


  constructor(
    private fb: FormBuilder,
    private httpService: HttpService
             ) { }

  form = this.fb.group({
    Id: [],
    Company: ['',
    [Validators.required,
    Validators.minLength(3)]],
    Contact: ['',
    [Validators.required,
    Validators.minLength(3)]],
    Country: ['',
    [Validators.required,
    Validators.minLength(2)]],
    isEditable: [true],
    Checked: [false]
  });

  deleteRow(deleteId: number){
    this.httpService.deleteRow(deleteId).subscribe();
  }

  editRow(group: FormGroup){
    const editId = group.value.Id;
    const tableEntry: PutDTO = {
      id: group.value.Id,
      company: group.value.Company,
      contact: group.value.Contact,
      country: group.value.Country
    }

    this.httpService.editRow(editId, tableEntry).subscribe();
  }

  @Output() idReceivedChange = new EventEmitter<any>();


  addRow(group:FormGroup){

    const tableEntry: PostDTO = {
      company: group.value.Company,
      contact: group.value.Contact,
      country: group.value.Country
    }

    this.httpService.postRow(tableEntry).subscribe((value:any) =>{
      this.idReceivedChange.emit(value.id);
    });
  }

  @Output() valuesChange: EventEmitter<any> = new EventEmitter<any>();

  initiateForm(queryParameters: QueryParameters){
    let receivedValues: any;
    this.httpService.getData(
      queryParameters.filter,
      queryParameters.filterColumn,
      queryParameters.sortingDirection,
      queryParameters.sortingHeader,
      queryParameters.currentPage,
      queryParameters.selectedItemsPerPage
    ).subscribe((value)=> {
      receivedValues = value;
      console.log(receivedValues);
      this.valuesChange.emit(receivedValues);
    });
  }
}
