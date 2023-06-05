import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 3000;

interface User {
  id: number
  name: string
}

interface Task {
  id: number
  description: string
  done: boolean
}

interface UsersDb {
  [userId: number]: User
}

interface TasksDb {
  [userId: number]: Task[]
}

const users: UsersDb = {
  1: {
    id: 1,
    name: 'Pepe',
  },
  2: {
    id: 2,
    name: 'Paco',
  },
}

const tasks: TasksDb = {
  1: [ ],
  2: [ ],
}

app.get('/users/:userId/tasks', (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  // FIXME: Handle errors!!
  res.send(JSON.stringify(tasks[userId]));
});

app.listen(port, () => {
  // tslint:disable-next-line
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
