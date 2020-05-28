import { Component, OnInit, HostListener, ViewChildren, QueryList } from '@angular/core';
import { SortableHeaderDirective } from '../Directives/sortable-header.directive';
import { SortEvent, compare } from '../Interfaces/interface';
import { FormControl, Validators } from '@angular/forms';

import {FormBuilder, FormGroup} from '@angular/forms'

import { map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor( private fb: FormBuilder) { }

  ngOnInit() {
    this.filter.valueChanges
    .subscribe (
      (Response) =>
      {
        if (this.filter.value !== ''){
          // this.tableValues = ;
          this.tableValues = this.search(this.filter.value)
        } else this.tableValues = this.originalArray;

      });

    this.myForm = this.fb.group({
      email: ['testing',[
        Validators.required,
        Validators.email
      ]],
      message:'',
      career:['',[
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]*$')
      ]]
    })

    this.myForm.valueChanges
    .pipe(
      map(value=>{
      value.career = value.career.toUpperCase();
      return value;}),
      filter(value => this.myForm.valid)
    )
    .subscribe(() => console.log(this.myForm));

  }

  get email(){return this.myForm.get('email');}
  get career(){return this.myForm.get('career');}

  tableValues = [
    {Company: "Alfreds Futterkiste", Contact: "Maria Anders", Country: "Germany", Checked: false},
    {Company: "Magazzini Alimentari Riuniti",Contact: "Giovanni Rovelli",Country: "Italy", Checked: true},
    {Company: "Centro comercial Moctezuma",Contact: "Francisco Chang",Country: "Mexico", Checked: false},
    {Company: "Ernst Handel", Contact: "Roland Mendel", Country: "Austria", Checked: false},
    {Company: "Island Trading",Contact: "Helen Bennett",Country: "UK", Checked: false},
    {Company: "Laughing Bacchus Winecellars",Contact: "Yoshi Tannamuri",Country: "Canada", Checked: false}
  ]
  private wasInside = false;
  editRow:any = "";
  showEditTable = false;
  originalArray = this.tableValues.slice();
  filter = new FormControl('');
  editIndex:number = null;
  editArray=[];
  mainCheck = false;
  p: number = 1;
  myForm: FormGroup;


  @ViewChildren (SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.editArray = [];
    }
    this.wasInside = false;
  }

  @HostListener('document:keydown.shift.enter')
  Escape(){
    console.log('You pressed Shift+Enter!');
    this.editArray=[];
  }


  SetEditLocation(index, property){
    this.editRow = Object.keys(this.tableValues[index])[property];
    this.editIndex = index;
  }

  Edit(field){
    this.editRow = field;
  }

  ClearEdit (){
  this.editRow = "";
  }


  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.tableValues = [...this.tableValues].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
    if (direction === "") {
      this.tableValues = this.search(this.filter.value);
    }
  }

  search(text: string){
    return this.originalArray.filter(entity => {
      let term = text.toLowerCase();
      return entity.Company.toLowerCase().includes(term)
          || entity.Contact.toLowerCase().includes(term)
          || entity.Country.toLowerCase().includes(term);
    });
  }

  AddRow(){
    this.tableValues.push({Company:"", Contact: "", Country:"", Checked: false})
    this.AddEditValues('Company',this.tableValues.length-1);
    this.AddEditValues('Contact',this.tableValues.length-1);
    this.AddEditValues('Country',this.tableValues.length-1);
    this.originalArray = this.tableValues;
  }

  TestMethod(row, index){
    for (let i = 0; i < this.editArray.length; i++)
    {
      if (row === this.editArray[i][0] && index === this.editArray[i][1]){
        // console.log('True, we have a row of ' + this.editArray[i][0] + ' and an index of ' + this.editArray[i][1]);
        return true;
            }
    } return false;
  }

  RemoveEditValues(row, index){
    console.log('Before array: ' + this.editArray);
    for (let i = 0; i < this.editArray.length; i++)
    {
      if (row === this.editArray[i][0] && index === this.editArray[i][1]){
        this.editArray.splice(i,1);
      }
    }
    console.log('After array: ' + this.editArray);
  }

  AddEditValues(row, index){
    this.editArray.push([row, index]);
    console.log(this.editArray);
  }

  CheckAllOptions(){
    if (this.mainCheck===false) this.tableValues.forEach(val => { val.Checked = false });
      else this.tableValues.forEach(val => { val.Checked = true });
  }

  //   if (this.tableValues.every(val => val.Checked == true))
  //   {
  //     this.tableValues.forEach(val => { val.Checked = false });
  //     this.mainCheck = false;
  //   }
  // else
  //   {
  //     this.tableValues.forEach(val => { val.Checked = true });
  //     this.mainCheck = false;
  //   }
  // }

  CheckAll(){
    if (this.tableValues.every(val => val.Checked == true)) this.mainCheck = true;
    else this.mainCheck = false;
  }

  DeleteRow(){
    for (let i = this.tableValues.length-1; i >= 0 ; i--){
      if (this.tableValues[i].Checked === true) {
        console.log("deleting row "+ i);
        this.tableValues.splice(i,1);
        this.originalArray = this.tableValues;
      }
    }
    if (this.tableValues.length===0) this.mainCheck = false;
  }
}
