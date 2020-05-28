import { Component, OnInit, QueryList, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SortEvent, compare } from '../Interfaces/interface';
import { SortableHeaderDirective } from '../Directives/sortable-header.directive';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';

// !!!!!!!!!!!!!!!!!
interface Properties {
  Company: string,
  Contact: string,
  Country: string,
  isEditable: boolean,
  Checked: boolean;
}

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
  tableValues = [
    {Company: "Alfreds Futterkiste", Contact: "Maria Anders", Country: "Germany"},
    {Company: "Magazzini Alimentari Riuniti",Contact: "Giovanni Rovelli",Country: "Italy"},
    {Company: "Centro comercial Moctezuma",Contact: "Francisco Chang",Country: "Mexico"},
    {Company: "Ernst Handel", Contact: "Roland Mendel", Country: "Austria"},
    {Company: "Island Trading",Contact: "Helen Bennett",Country: "UK"},
    {Company: "Laughing Bacchus Winecellars",Contact: "Yoshi Tannamuri",Country: "Canada"},
    {Company: "Alfreds Futterkiste", Contact: "Maria Anders", Country: "Germany"},
    {Company: "Magazzini Alimentari Riuniti",Contact: "Giovanni Rovelli",Country: "Italy"},
    {Company: "Centro comercial Moctezuma",Contact: "Francisco Chang",Country: "Mexico"},
    {Company: "Ernst Handel", Contact: "Roland Mendel", Country: "Austria"},
    {Company: "Island Trading",Contact: "Helen Bennett",Country: "UK"},
    {Company: "Laughing Bacchus Winecellars",Contact: "Yoshi Tannamuri",Country: "Canada"},
    {Company: "Alfreds Futterkiste", Contact: "Maria Anders", Country: "Germany"},
    {Company: "Magazzini Alimentari Riuniti",Contact: "Giovanni Rovelli",Country: "Italy"},
    {Company: "Centro comercial Moctezuma",Contact: "Francisco Chang",Country: "Mexico"},
    {Company: "Ernst Handel", Contact: "Roland Mendel", Country: "Austria"},
    {Company: "Island Trading",Contact: "Helen Bennett",Country: "UK"},
    {Company: "Laughing Bacchus Winecellars",Contact: "Yoshi Tannamuri",Country: "Canada"}]
  searchText: String = '';
  page: number = 1;
  itemsPerPage: Array<number> = [5,10,15,20,30,50];
  selectedItemsPerPage: number = 20;
  mainCheck = false;
  myBackupSortingArray =[];
  noSelectCheckboxes = 0;


  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.touchedRows = [];
    this.userTable = this.fb.group({
      // query: [''],
      tableRows: this.fb.array([])
    });
    this.addDefaultValues();

    this.myBackupSortingArray = this.getFormControls.value;

    this.defineStuckState();

    // this.filter.valueChanges
    // .subscribe (
    //   (Response) =>
    //   {
    //     if (this.filter.value !== ''){
    //       // this.tableValues = ;
    //       // console.log(this.filter.value);

    //       let TestArray = this.search(this.filter.value);
    //       console.log(TestArray);
    //         // this.getFormControls.controls[0] = TestArray[0];
    //       console.log(this.getFormControls);
    //     // } else this.tableValues = this.originalArray;
      // }});


    // FILTER AREAS

      // this.myForm = this._fb.group({
      //   appname: ['', Validators.required],
      //   properties: this._fb.array(this._properties.map(p => (this._fb.group({
      //     key: [p.key, { validators: [Validators.required], updateOn: 'blur' }],
      //     value: [p.value, { validators: [Validators.required], updateOn: 'blur' }]
      //   })))),
      //   query: ['']
      // });
  }
//       this.filteredProperties$ = this.userTable.valueChanges.pipe(
//         map(value => {

//           // in this map I extend the Property type with an index which I need to bind the formControl in the template. this is the index of the FormGroup in the FormArray
//           if (value.query === '') {
//             return value.tableRows.map((p, index) => ({ ...p, index }));
//           }
//           const queryLower = value.query.toLowerCase();
//           return value.tableRows.filter(p => p.Company.toLowerCase().includes(queryLower) || p.Contact.toLowerCase().includes(queryLower) || p.Country.toLowerCase().includes(queryLower)).map(p => ({ ...p, index: value.tableRows.indexOf(p) }));
//         }),
//         // valueChanges stream only starts after the first change, so use startWith to provide an initial value
//         startWith(
//           this.getFormControls.value.map(p => ({ ...p, index: this.getFormControls.value.indexOf(p) }))))
// // .subscribe( (value) =>
// //   console.log(value));
// ;
//   }

//   filteredProperties$: Observable<Properties>;
//   // filteredProperties$;

//   // get tableRows(): FormArray {
//   //   return <FormArray>this.userTable.get('Company');
//   // }

//   getArrayFormGroup(index: number): FormGroup {

//     return this.getFormControls.at(index) as FormGroup;
//   }

  // FILTER AREA
  // filter = new FormControl('');
  // search(text: string){
  //   console.log("searching");
  //   // console.log(this.getFormControls.controls);
  //   let returnResult = this.getFormControls.controls.filter(it => {
  //     let term = text.toLowerCase();
  //     // return entity.value.Company.toLowerCase().includes(term)
  //     //                 || entity.value.Contact.toLowerCase().includes(term)
  //     //                 || entity.value.Country.toLowerCase().includes(term);
  //     // it => {
  //       if (it.value.Company.toString().toLowerCase().includes(term)) return it.value.Company.toString().toLowerCase().includes(term); else
  //       if (it.value.Contact.toString().toLowerCase().includes(term)) return it.value.Contact.toString().toLowerCase().includes(term); else
  //       if (it.value.Country.toString().toLowerCase().includes(term)) return it.value.Country.toString().toLowerCase().includes(term);

  //   });
  //         // console.log(returnResult);
  //     return returnResult;
  // }

// AREA



  initiateForm(): FormGroup {
    return this.fb.group({
      Company: ['',
      [Validators.required,
      Validators.minLength(3)]],
      Contact: ['',
      [Validators.required,
      Validators.minLength(3)]],
      Country: ['',
      [Validators.required,
      Validators.minLength(3)]],
      isEditable: [true],
      Checked: [false]
    });
  }

  addDefaultValues(){
    const control =  this.userTable.get('tableRows') as FormArray;
    for (let i = 0; i < this.tableValues.length; i ++){
      control.push(this.fb.group({
        Company: [this.tableValues[i].Company, [Validators.required, Validators.minLength(3)]],
        Contact: [this.tableValues[i].Contact, [Validators.required, Validators.minLength(3)]],
        Country: [this.tableValues[i].Country, [Validators.required, Validators.minLength(3)]],
        isEditable: false,
        Checked: false,
        }));
    }
  }

  addRow() {
    const control =  this.userTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    console.log(this.getFormControls.value[index]);
    console.log(index);
    const control =  this.userTable.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!WARNING
    this.doSomething();
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
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
  // !! EFFICIENCY: this fires way too many times

    this.noSelectCheckboxes = 0
    this.getFormControls.value.map(val => {if (val.Checked === true) this.noSelectCheckboxes++;});
    if (this.noSelectCheckboxes >0 )return false;
    else return true;
  }

  @ViewChildren (SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;


  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    let myArray = this.getFormControls.value;
    myArray = [...myArray].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
    this.getFormControls.patchValue(myArray);
    if (direction === "") {
      this.getFormControls.patchValue(this.myBackupSortingArray);
    }
  }

  defineStuckState(){
    // Workaround for position: sticky theoretical state of 'stuck'
   const observer = new IntersectionObserver(
      ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
      {threshold: [1]}
    );
    observer.observe(document.querySelector('.overTable'));
    observer.observe(document.querySelector('.underTable'));

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

  editablePositions = [];

  doSomething(){

    // let editableGroups = this.getFormControls.controls.filter(group => group.value.isEditable === true);
    // console.log(editableGroups);

    // group.get('isEditable').value

    // let editablePositions = [];
    this.editablePositions =[];
     this.getFormControls.controls.forEach((group,index) => {
      if (group.value.isEditable) this.editablePositions.push(index);
        })
    console.log(this.editablePositions);
    // this.getFormControls.controls.map(group => {
    //    console.log(group.value.isEditable);})

  }

  position = 0;

  returnFirstEditPosition (){
    console.log("I fired!");
    this.position = this.editablePositions[0];
    this.editablePositions.shift();
    console.log(this.editablePositions);
    return this.position;
  }
}
