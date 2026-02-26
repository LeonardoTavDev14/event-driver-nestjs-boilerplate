// exportando entidade Tasks
import { Tasks } from '../entities/tasks.entity';

// exportando classe de abstrata para ser implementada
export abstract class TasksRepositories {
  abstract saveTask(tasks: Tasks): Promise<Tasks>;
  abstract findTaskByTitle(title: string): Promise<Tasks | null>;
}
