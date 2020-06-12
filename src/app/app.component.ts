import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
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
  tableEntriesCount: number = 0;
  tableEntryTemplate: FormGroup;

  @Output() idReceivedChange = new EventEmitter<any>();
  @Output() valuesChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() formArrayChange: EventEmitter<any> = new EventEmitter<any>();

  // onRefresh(){
  //   //server stuff
  //   data = response;
  // }

  ngOnInit(){
    this.newRow();
  }

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService
             ) { }


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




  initiateForm(queryParameters: QueryParameters){
    let receivedValues: any;
    this.httpService.getData(
      queryParameters.filter,
      queryParameters.filterColumn,
      queryParameters.sortingDirection,
      queryParameters.sortingHeader,
      queryParameters.currentPage,
      queryParameters.selectedItemsPerPage
    ).subscribe((value: any)=> {
      this.tableEntriesCount = value.itemsCount;
      this.valuesChange.emit(""); //CHANGE THIS
      this.formArrayChange.emit(this.addDefaultValues(value.tableValuesDTOs));

    });
  }

  rowClicked(rowValue: any){
    console.log(rowValue);
  }

  addDefaultValues(receivedValues: any){
    let control: Array<FormGroup> = [];
    for (let i = 0; i < receivedValues.length; i ++){
      control.push(this.fb.group({
        Id: receivedValues[i].id,
        Company: [receivedValues[i].company, [Validators.required, Validators.minLength(3)]],
        Contact: [receivedValues[i].contact, [Validators.required, Validators.minLength(3)]],
        Country: [receivedValues[i].country, [Validators.required, Validators.minLength(2)]],
        isEditable: false,
        Checked: false,
        }));
    }
    return control;
  }

  newRow(){
    this.tableEntryTemplate = this.fb.group({
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
      Checked: [false],
    });
  }
}
