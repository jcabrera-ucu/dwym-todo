import express, { Express, Request, Response } from 'express';
import { ErrorCodes } from './errorCodes';
import { User } from './user';
import { Task } from './task';
import { arrayBuffer } from 'stream/consumers';
import { json } from 'body-parser';


const app: Express = express();
const port = 3000;

app.use(express.json());

const users: User[] = [
  { id: 1, name: 'Pepe' },
  { id: 2, name: 'Paco' },
];

/**
 * Check the existance of a user in the users db.
 * 
 * @param userId Id of the user to look for
 * @returns true if the user exists, false otherwise.
 */
function existsUserWithId(userId: number): boolean {
  for (const user of users) {
    if (user.id === userId) {
      return true;
    }
  }
  return false;
}

const tasks: Task[] = [
  {
    id: 1,
    userId: 1,
    description: 'Buy milk',
    done: false,
  },
];

/**
 * Get the tasks list for a given user.
 * 
 * @param userId The id of the user to get the tasks for
 * @returns A list of Tasks
 */
function filterTasksByUserId(userId: number): Task[] {
  return tasks.filter(x => x.userId === userId);
}

app.put('/users/:userId/task/:taskId', (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const taskId = Number(req.params.taskId);

  if (!existsUserWithId(userId)) {
    res.status(404).send(JSON.stringify({
      'code': ErrorCodes.UNKNOWN_USER,
    }));
    return;
  }

  const userTasks = filterTasksByUserId(userId);
  const task = userTasks.find(t => t.id === taskId);

  if (!task) {
    res.status(404).send(JSON.stringify({
      'code': ErrorCodes.UNKNOWN_TASK,
    }));
    return;
  }

  const { description, done } = req.body;

  if (!description || (done !== false && done !== true)) {
    res.status(400).send(JSON.stringify({
      'code': ErrorCodes.INCORRECT_TYPES
    }));
  }

  task.description = description;
  task.done = done;

  res.status(201).json(task);
});

/**
 * Get all the tasks for a given user.
 */
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


app.post('/users/:userId/tasks', (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const { description, done } = req.body;

  const userExists = users.some((user) => user.id === userId);
  if (!userExists) {
    return res.status(404).send(JSON.stringify({
      'code': ErrorCodes.UNKNOWN_USER,
    }));
  }

  const newTask: Task = {
    id: tasks.length + 1,
    userId,
    description,
    done,
  };

  tasks.push(newTask);

  return res.status(201).json(newTask);
});

app.listen(port, () => {
  // tslint:disable-next-line
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


//it is the method to delete a task with the id.
app.delete('/users/:userId/tasks/:id', (req, res) => {
  const userId = Number(req.params.userId);
  const taskId = Number(req.params.id)
  const response = { status: 200, msg: "deleted task" };

  let taskToDelete = tasks.find(t => t.id === taskId);

  const indexToDelete = tasks.findIndex(task => task.id === taskId);

  if (taskToDelete) {
    tasks.splice(indexToDelete);
    res.send(response);
  }
  else {
    res.status(404).send(JSON.stringify({
      'code': ErrorCodes.UNKNOWN_TASK,
    }));
  }
});
