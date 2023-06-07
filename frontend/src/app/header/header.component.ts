import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isActiveUser1 : boolean = false;
  isActiveUser2 : boolean = false;

  id: number = 1;
  description: string = '';
  selectUser(id: number) {
    this.id = id;
  }
  constructor(private taskService: TasksService) {}

  public addTasks(description : string,id : number){
      this.taskService.addTask(this.description, this.id);
  }
}
