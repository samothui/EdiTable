import { Component, OnInit, QueryList, ViewChildren, Input, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SortableHeaderDirective } from '../Directives/sortable-header.directive';

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

export type SortDirection = 'asc' | 'desc' | '';


@Component({
  selector: 'app-reactive-table',
  templateUrl: './reactive-table.component.html',
  styleUrls: ['./reactive-table.component.css']
})
export class ReactiveTableComponent implements OnInit {

  userTable: FormGroup;
  control: FormArray;
  tableValues = [];
  filter: string = '';
  filterColumn: string = '';
  page: number = 1;
  mainCheck = false;
  noSelectCheckboxes = 0;
  contentLoaded = false;

  filterArray: Array<any> = [];

  sortingDirection = '';
  sortingHeader = '';

  @Input() tableEntriesCount = 0;
  @Input() itemsPerPage: Array<number> = [];
  @Input() selectedItemsPerPage: number;
  @Input() columns: Array<string> = [];
  @Input() isEditable: boolean = true;
  @Input() isDeleteable: boolean = true;
  @Input() isSelectable: boolean = true;
  @Input() isSearchable: boolean = true;
  @Input() isSortable: boolean = true;
  @Input() formArray = new EventEmitter<any>();
  @Input() newRow;
  @Input() idReceiver: EventEmitter<any>;
  @Input() valuesReceiver: EventEmitter<any>;

  @Output() addRowChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteRowChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() editRowChange = new EventEmitter<any>();
  @Output() rowClickedChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() initiateFormChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() newRowChange = new EventEmitter<any>();

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  constructor(
    private fb: FormBuilder,
             ) { }


  ngOnInit() {
    this.initiateForm();


    for (let i = 0; i < this.columns.length; i++){
      this.filterArray.push({
        column: this.columns[i],
        value: ''});}

  }

  ngOnChanges(changes: SimpleChanges){
    for (let propName in changes) {


      let change = changes[propName];}
    console.log(changes)

  }

  initiateForm(){
    this.valuesReceiver.subscribe((value: any)=>{
        // this.tableEntriesCount = value.itemsCount;
        // console.log("Sorting direction: " + this.sortingDirection);
        // console.log("Sorting column: " + this.sortingHeader);

        // this.tableValues = [];
        // value.tableValuesDTOs.forEach(el => this.tableValues.push(el))

        // this.keyNames = Object.keys(this.tableValues[0]);
        // this.keyNames = this.titleCaseArray(this.keyNames);
        // this.keyNames = this.keyNames.slice(1);

        // console.log(this.keyNames);


        this.userTable = this.fb.group({
          tableRows: this.fb.array([])
        });

        this.formArray.subscribe((array: Array<FormGroup>) => {

          const control =  this.userTable.get('tableRows') as FormArray
          control.clear();
          array.forEach(value => control.push(value))

        })

        // this.addDefaultValues();
        this.checkAll();


        this.contentLoaded = true;
        this.defineStuckState();
    })

    this.initiateFormChange.emit({
      filter: this.filter,
      filterColumn: this.filterColumn,
      sortingDirection: this.sortingDirection,
      sortingHeader: this.sortingHeader,
      currentPage: this.page,
      selectedItemsPerPage: this.selectedItemsPerPage})
   }

  addDefaultValues(){
    const control =  this.userTable.get('tableRows') as FormArray;
    for (let i = 0; i < this.tableValues.length; i ++){
      control.push(this.fb.group({
        Id: this.tableValues[i].id,
        Company: [this.tableValues[i].company, [Validators.required, Validators.minLength(3)]],
        Contact: [this.tableValues[i].contact, [Validators.required, Validators.minLength(3)]],
        Country: [this.tableValues[i].country, [Validators.required, Validators.minLength(2)]],
        isEditable: false,
        Checked: false,
        }));
    }
  }

  addRow() {
    this.newRowChange.emit("New row added");
    const control =  this.userTable.get('tableRows') as FormArray;
    control.push(this.newRow);
  }

  deleteRow(index: number) {
    const control =  this.userTable.get('tableRows') as FormArray;
    const delId = control.controls[index].value.Id;

    this.deleteRowChange.emit(delId);

    control.removeAt(index);
    this.tableEntriesCount-- ;
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    if (group.get('isEditable').parent.status === "VALID") {
      group.get('isEditable').setValue(false);
      if (group.value.Id !== null) {
        this.editEntryDB(group);
      } else {
        this.addEntryDB(group)
      }
    } else alert ("The row you are trying to edit contains invalid values");
  }


  editEntryDB(group: FormGroup){
    this.editRowChange.emit(group);
  }

  addEntryDB(group: FormGroup){
    let idReceived: number;
    this.idReceiver.subscribe((value)=> {
      idReceived = value
      group.get('Id').setValue(idReceived);
      this.tableEntriesCount++;

    })
    this.addRowChange.emit(group);
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
        this.doneRow(form);
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
  }

  search(column:string, value: string){
    // FUTURE FEATURE: search by 2 values using filterArray
    console.log("Searched column: " + column);
    this.filter = value;
    this.filterColumn = column;
    this.initiateForm();
  }

  checkTextArea(column:string, value: string){
    if (value === '') {
      this.search(column, value);
    }
  }

  resetSearchFilter(){
    this.filterArray = [];
    for (let i = 0; i < this.columns.length; i++){
      this.filterArray.push({
        column: this.columns[i],
        value: ''});
    }
    this.filter = '';
    this.filterColumn = '';
    this.initiateForm();
  }

  emitRow(rowValue: any){
    this.rowClickedChange.emit(rowValue);
  }
}
