import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formArrayFilterPipe'
})
export class FormArrayFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;

    searchText = searchText.toLowerCase();
    let returnResult =  items.filter( it => {
      if (it.value.Company.toString().toLowerCase().includes(searchText)) return it.value.Company.toString().toLowerCase().includes(searchText); else
      if (it.value.Contact.toString().toLowerCase().includes(searchText)) return it.value.Contact.toString().toLowerCase().includes(searchText); else
      if (it.value.Country.toString().toLowerCase().includes(searchText)) return it.value.Country.toString().toLowerCase().includes(searchText);
    });
    // console.log(returnResult);
    return returnResult;
  }

}



@Pipe({ name: 'withParent', pure: false })
export class WithParentPipe implements PipeTransform {
    transform(value: Array<any>, args: any[] = null): any {

        return value.map(t=> {
            return {
                item: t,
                parent: value
            }
        });
    }
}
