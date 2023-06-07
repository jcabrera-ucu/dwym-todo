import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private url = 'http://localhost:3000'
  constructor(private http: HttpClient) {}

  public addTask(data: string, id: number){
      return this.http.post('${this.url}/user/:${id}/tasks', data)
  }
}
