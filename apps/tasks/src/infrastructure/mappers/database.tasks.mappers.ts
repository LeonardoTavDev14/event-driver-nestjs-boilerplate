// Importando entidade Tasks
import { Tasks } from '../../domain/entities/tasks.entity';

// exportando classe de mappers para otimização de código
export class DatabaseTasksMapper {
  // para a uma nova instância de entidade usuário para classe de domain
  static toDomain(raw: any): Tasks {
    return new Tasks(
      raw.title,
      raw.description,
      raw.priority,
      raw.dateStart,
      raw.dateEnd,
      raw.userId,
      raw.comments,
      raw.id,
    );
  }

  // para os dados no prisma
  static toDatabase(tasks: Tasks) {
    return {
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      priority: tasks.priority,
      dateStart: undefined,
      dateEnd: undefined,
      userId: tasks.userId,
      comments: tasks.comments,
    };
  }
}
