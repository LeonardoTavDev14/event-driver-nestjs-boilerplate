// Importando entidade Tasks
import { Tasks } from '../../domain/entities/tasks.entity';

// Importando Inject para a utilização de filas na aplicação
import { HttpStatus, Inject } from '@nestjs/common';

// Importando classes de abstrata para ser uma injeção de dependência
import { TasksRepositories } from '../../domain/repositories/tasks.repositories';
import { UserRepositories } from 'apps/users/src/domain/repositories/user.repositories';

// Importando Injectable para mostrar que esta classe é um provider
import { Injectable } from '@nestjs/common';

// Importando rpc para tratar os erros de forma personalizada
import { RpcException } from '@nestjs/microservices';

// interface de dados
interface ITaskRequest {
  id: string;
  title: string;
  description: string;
  comments: string;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TasksRepositories)
    private readonly tasksRepository: TasksRepositories,
    @Inject(UserRepositories) private readonly userRepository: UserRepositories,
  ) {}

  async execute(data: ITaskRequest): Promise<Tasks> {
    // procurando usuário que está fazendo a requisição
    const userRequested = await this.userRepository.findUserById(data.id);

    // caso não encontre nenhum usuário vinculado ao id, retorna um erro
    if (!userRequested) {
      throw new RpcException({
        message: 'User not found!',
        status: HttpStatus.NOT_FOUND,
        code: 'User not found error',
      });
    }

    // permissão aceita para criar task
    const allowedPermission = ['BACK_LOG'];

    // validando permissão do usuário

    // procurando task pelo titulo
    const taskAlreadyExists = await this.tasksRepository.findTaskByTitle(
      data.title,
    );

    // caso encontre um titulo vinculado, retorna um erro
    if (!taskAlreadyExists) {
      throw new RpcException({
        message: 'Task already exists!',
        status: HttpStatus.BAD_REQUEST,
        code: 'Task found',
      });
    }

    // criando task pela entidade
    const newTask = new Tasks(
      data.title,
      data.description,
      'TODO',
      userRequested.id!,
      data.comments,
      undefined,
      undefined,
    );

    // criando task no banco de dados
    const createdTask = await this.tasksRepository.saveTask(newTask);

    // retornando task criada
    return createdTask;
  }
}
