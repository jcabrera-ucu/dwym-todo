import express, { Express, Request, Response } from 'express';
import { ErrorCodes } from './errorCodes';
import { User } from './user';
import { Task } from './task';


const app: Express = express();
const port = 3000;

app.use(express.json());

const users: User[] = [
    {id: 1, name: 'Pepe'},
    {id: 2, name: 'Paco'},
];

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

    const {description, done} = req.body;

    if (!description || (done !== false && done !== true)) {
        res.status(400).send(JSON.stringify({
            'code': ErrorCodes.INCORRECT_TYPES
        }));
    }

    task.description = description;
    task.done = done;

    res.status(201).json(task);
});

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
    const {description, done} = req.body;

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
