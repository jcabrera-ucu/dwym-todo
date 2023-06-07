import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  id: number = 0;
  description: string = '';
  selectUser(id: number) {
    this.id = id;
  }
  constructor(private taskService: TasksService) {}

  public addTasks(description : string,id : number){
      this.taskService.addTask(this.description, this.id);
  }
}
