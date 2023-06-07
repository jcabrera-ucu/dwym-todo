import express, { Express, Request, Response } from 'express';
import { ErrorCodes } from './errorCodes';
import { User } from './user';
import { Task } from './task';
import { arrayBuffer } from 'stream/consumers';

const app: Express = express();
const port = 3000;

const users: User[] = [
  { id: 1, name: 'Pepe' },
  { id: 2, name: 'Paco' },
];

function existsUserWithId(userId: number): boolean {
  for (const user of users) {
    if (user.id == userId) {
      return true;
    }
  }
  return false;
}

function existsTaskWithId(userId: number, taskId: number): boolean {
  for (const task of tasks) {
    if (task.id == taskId) {
      if (task.userId = userId) {
        return true
      }
    }
  }
  return false;
}

var tasks: Task[] = [
  {
    id: 1,
    userId: 1,
    description: 'Buy milk',
    done: false,
  },
];

function filterTasksByUserId(userId: number): Task[] {
  return tasks.filter(x => x.userId === userId);
}

app.get('/users/:userId/tasks', (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (existsUserWithId(userId)) {
    res.send(JSON.stringify(filterTasksByUserId(userId)));
  } else {
    res.status(404).send(JSON.stringify({
      'code': ErrorCodes.UNKNOWN_USER,
    }));
  }
});

app.listen(port, () => {
  // tslint:disable-next-line
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.delete('/users/:userId/tasks/:id', function (req, res) {
  const userId = Number(req.params.userId);
  const taskId = Number(req.params.id)
  let currentTasks: Task[] = [];
  const response = { error: false, msg: "deleted" };
  if (existsTaskWithId(userId, taskId)) {
    currentTasks = tasks.filter(taskId => +taskId != +req.params.id)
  }
  tasks = currentTasks;
  res.json(response);
});


