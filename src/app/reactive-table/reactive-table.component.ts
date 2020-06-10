import { Component, OnInit, QueryList, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SortEvent, compare, PutDTO, PostDTO } from '../Interfaces/interface';
import { SortableHeaderDirective } from '../Directives/sortable-header.directive';
import { HttpService } from '../Services/http-service.service';

@Component({
  selector: 'app-reactive-table',
  templateUrl: './reactive-table.component.html',
  styleUrls: ['./reactive-table.component.css']
})
export class ReactiveTableComponent implements OnInit {

  userTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;
  tableValues = [];
    // {Company: "Alfreds Futterkiste", Contact: "Maria Anders", Country: "Germany"},
    // {Company: "Magazzini Alimentari Riuniti",Contact: "Giovanni Rovelli",Country: "Italy"},
    // {Company: "Centro comercial Moctezuma",Contact: "Francisco Chang",Country: "Mexico"},
    // {Company: "Ernst Handel", Contact: "Roland Mendel", Country: "Austria"},
    // {Company: "Island Trading",Contact: "Helen Bennett",Country: "UK"},
    // {Company: "Laughing Bacchus Winecellars",Contact: "Yoshi Tannamuri",Country: "Canada"},
    // {Company: "Alfreds Futterkiste", Contact: "Maria Anders", Country: "Germany"},
    // {Company: "Magazzini Alimentari Riuniti",Contact: "Giovanni Rovelli",Country: "Italy"},
    // {Company: "Centro comercial Moctezuma",Contact: "Francisco Chang",Country: "Mexico"},
    // {Company: "Ernst Handel", Contact: "Roland Mendel", Country: "Austria"},
    // {Company: "Island Trading",Contact: "Helen Bennett",Country: "UK"},
    // {Company: "Laughing Bacchus Winecellars",Contact: "Yoshi Tannamuri",Country: "Canada"},
    // {Company: "Alfreds Futterkiste", Contact: "Maria Anders", Country: "Germany"},
    // {Company: "Magazzini Alimentari Riuniti",Contact: "Giovanni Rovelli",Country: "Italy"},
    // {Company: "Centro comercial Moctezuma",Contact: "Francisco Chang",Country: "Mexico"},
    // {Company: "Ernst Handel", Contact: "Roland Mendel", Country: "Austria"},
    // {Company: "Island Trading",Contact: "Helen Bennett",Country: "UK"},
    // {Company: "Laughing Bacchus Winecellars",Contact: "Yoshi Tannamuri",Country: "Canada"}]
  searchText: string = '';
  page: number = 1;
  itemsPerPage: Array<number> = [5,10,15,20,30,50];
  selectedItemsPerPage: number = 5;
  mainCheck = false;
  myBackupSortingArray =[];
  noSelectCheckboxes = 0;
  contentLoaded = false;
  tableEntriesCount = 0;
  sortingDirection = '';
  sortingHeader = '';
  @Input() columns: Array<string> = [];
  @Output() newRow: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService
             ) { }

  ngOnInit() {
    this.initiateForm();

  }

  initiateForm(){
    // TO DO!!!!!!!!!!!!!!!!!!!!11
    this.httpService.getData(this.searchText,this.sortingDirection, this.sortingHeader, this.page, this.selectedItemsPerPage).subscribe(
      (value: any) => {
        this.tableEntriesCount = value.itemsCount;
        console.log("sorting:" + this.sortingDirection);
        console.log("column:" + this.sortingHeader);
        this.tableValues = [];
        value.tableValuesDTOs.forEach(el => this.tableValues.push(el))
        this.touchedRows = [];
        this.userTable = this.fb.group({
          tableRows: this.fb.array([])
        });
        this.addDefaultValues();
        this.checkAll();

        this.myBackupSortingArray = this.getFormControls.value;

        this.contentLoaded = true;
        this.defineStuckState();

      });
  }

  addDefaultValues(){
    const control =  this.userTable.get('tableRows') as FormArray;
    for (let i = 0; i < this.tableValues.length; i ++){
      control.push(this.fb.group({
        Id: [this.tableValues[i].id],
        Company: [this.tableValues[i].company, [Validators.required, Validators.minLength(3)]],
        Contact: [this.tableValues[i].contact, [Validators.required, Validators.minLength(3)]],
        Country: [this.tableValues[i].country, [Validators.required, Validators.minLength(3)]],
        isEditable: false,
        Checked: false,
        }));
    }
  }

  addRow() {
    const control =  this.userTable.get('tableRows') as FormArray;
    control.push(this.fb.group({
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
    }));

    this.newRow.emit("Acesta este randul meu");
  }

  // deleteRow(index: number) {
  //   const control =  this.userTable.get('tableRows') as FormArray;
  //   console.log(control.controls[index].value.Id)
  //   // control.removeAt(index);
  // }

  deleteRow(index: number) {
    const control =  this.userTable.get('tableRows') as FormArray;
    const delId = control.controls[index].value.Id;
    this.httpService.deleteRow(delId).subscribe(console.log);
    control.removeAt(index);
    this.tableEntriesCount-- ;
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup, index: number) {
    if (group.get('isEditable').parent.status === "VALID") {
      if (group.value.Id !== null) {
        this.editEntryDB(group, index);
      } else {
        this.addEntryDB(group)
      }

    } else alert ("The row you are trying to edit contains invalid values");
  }

  editEntryDB(group: FormGroup, index: number){
    group.get('isEditable').setValue(false);
    const control =  this.userTable.get('tableRows') as FormArray;
    const editId = control.controls[index].value.Id;
    const tableEntry: PutDTO = {
      id: group.value.Id,
      company: group.value.Company,
      contact: group.value.Contact,
      country: group.value.Country
    }
    this.httpService.editRow(editId, tableEntry).subscribe();
  }

  addEntryDB(group: FormGroup){
      group.get('isEditable').setValue(false);
      const tableEntry: PostDTO = {
        company: group.value.Company,
        contact: group.value.Contact,
        country: group.value.Country
      }
      this.httpService.postRow(tableEntry).subscribe((value:any) =>{
        group.get('Id').setValue(value.id);
        this.tableEntriesCount++;
      });
  }

  saveUserDetails() {
    console.log(this.userTable.value);
  }

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  submitForm() {
    if(confirm("You are about to submit changed data to DB! Are you sure?")){
      const control = this.userTable.get('tableRows') as FormArray;
      this.touchedRows = control.controls
      .filter(row => row.touched)
      .map(row => row.value);
      console.log(this.touchedRows);
    }

  }

  deleteSelectedRows(){
    for (let i = this.getFormControls.value.length-1 ; i >= 0; i--) {
      if (this.getFormControls.value[i].Checked){
        this.deleteRow(i);
      }
    }
    this.checkAll();
  }

  editSelectedRows(){
    for (let i = this.getFormControls.value.length-1 ; i >= 0; i--) {
      const form = <FormGroup> this.getFormControls.controls[i];
      if (this.getFormControls.value[i].Checked && !this.getFormControls.value[i].isEditable){
        this.editRow(form);
      } else if (this.getFormControls.value[i].Checked && this.getFormControls.value[i].isEditable){
        this.doneRow(form, i);
      }
    }
  }

  checkAll(){
    if (this.getFormControls.value.length!==0) {
      if (this.getFormControls.value.every(val => val.Checked == true)) this.mainCheck = true;
      else this.mainCheck = false;
    } else this.mainCheck = false;
  }

  checkAllBoxes(){
    if (this.mainCheck===true) {
    this.getFormControls.controls.map(value => {
      value.patchValue({Checked: true})})
    } else { this.clearSelection();}

  }

  checkIfEmptyTable(){
    if (this.getFormControls.value.length!==0) {
      return false;
    } else return true;
  }

  checkIfNoCheckbox(){
  // !! EFFICIENCY Problem: this fires way too many times
    this.noSelectCheckboxes = 0;
    this.getFormControls.value.map(val => {if (val.Checked === true) this.noSelectCheckboxes++;});
    if (this.noSelectCheckboxes >0 )return false;
    else return true;
  }

  @ViewChildren (SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  onSort({column, direction}: SortEvent) {
    this.sortingDirection = direction;
    this.sortingHeader = column;

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.initiateForm();

    // let myArray = this.getFormControls.value;
    // myArray = [...myArray].sort((a, b) => {
    //   const res = compare(a[column], b[column]);
    //   return direction === 'asc' ? res : -res;
    // });
    // this.getFormControls.patchValue(myArray);
    // if (direction === "") {
    //   this.getFormControls.patchValue(this.myBackupSortingArray);
    // }
  }

  // Workaround for "position: sticky" theoretical state of 'stuck'
  defineStuckState(){
    setTimeout(function(){
      const observer = new IntersectionObserver(
        ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
        {threshold: [1]}
      );
      observer.observe(document.querySelector('.overTable'));
      observer.observe(document.querySelector('.underTable'));
    }, 1000)
  }

  clearSelection(){
    this.getFormControls.controls.map(value => {
      value.patchValue({Checked: false})})
      this.checkAll();
  }

  getRowsPendingEdit() {
    let rowsPendingEdit = 0;
    this.getFormControls.value.map(value => { if (value.isEditable) rowsPendingEdit++;})
    return rowsPendingEdit;
  }

  getRowsSelected() {
    let rowsSelected = 0;
    this.getFormControls.value.map(value => { if (value.Checked) rowsSelected++;})
    return rowsSelected;
  }

  onOptionSelect(){
    if (this.selectedItemsPerPage !== this.tableValues.length){
      this.initiateForm()
    }
  }

  isValid(group: FormGroup, formControlName: string) {
    let controlToCheck = group.get(formControlName);
    if (controlToCheck.invalid && (controlToCheck.dirty || controlToCheck.touched))
    {return false;}
    else return true;
    // console.log(group);
    // return this.getFormControls.controls[index].get("Company"); }

  }
}
