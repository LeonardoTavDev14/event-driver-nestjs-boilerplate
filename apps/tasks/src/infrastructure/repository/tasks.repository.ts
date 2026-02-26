// Importando entidade Tasks
import { Tasks } from '../../domain/entities/tasks.entity';

// Importando database para a utilização do prisma
import { Database } from '@app/shared';

// Importando classe abstrata a ser implementada nesta classe
import { TasksRepositories } from '../../domain/repositories/tasks.repositories';

// Importando Injectable para mostrar que esta classe é um provider
import { Injectable } from '@nestjs/common';

// Importando mapper para a otimização de código
import { DatabaseTasksMapper } from '../mappers/database.tasks.mappers';

@Injectable()
export class TasksRepository implements TasksRepositories {
  constructor(private readonly database: Database) {}

  async saveTask(tasks: Tasks): Promise<Tasks> {
    // convertando os dados para o tipo do prisma
    const data = DatabaseTasksMapper.toDatabase(tasks);

    // criando task no banco de dados
    const newTask = await this.database.tasks.create({ data });

    // retornando os dados em uma nova entidade
    return DatabaseTasksMapper.toDomain(newTask);
  }

  async findTaskByTitle(title: string): Promise<Tasks | null> {
    // procurando task pelo titulo
    const taskAlreadyExists = await this.database.tasks.findFirst({
      where: { title: title.toLowerCase() },
    });

    // caso não encontre nenhum titulo vinculado, retorna nulo
    if (!taskAlreadyExists) {
      return null;
    }

    // retornando dados encontrados
    return DatabaseTasksMapper.toDomain(taskAlreadyExists);
  }
}
