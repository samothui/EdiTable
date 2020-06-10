import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { PutDTO, PostDTO } from '../Interfaces/interface';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ){}

  getData(filter: string, sortOrder: string, sortHeader: string, pageNumber: number, pageSize: number){
    const url = 'https://localhost:44363/api/Initial_Values/byParams'
    return this.http.get(url, {
      params: new HttpParams()
      .set('filter', filter)
      .set('sortOrder', sortOrder)
      .set('sortHeader', sortHeader)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())


    });
  }

  deleteRow(id: number){
    const url = 'https://localhost:44363/api/Initial_Values/'
    return this.http.delete(url+id);
  }

  editRow(id: number, value: PutDTO){
    const url = 'https://localhost:44363/api/Initial_Values/'
    return this.http.put(url+id, value);
  }

  postRow(value: PostDTO){
    const url = 'https://localhost:44363/api/Initial_Values/'
    return this.http.post(url, value);
  }
}
