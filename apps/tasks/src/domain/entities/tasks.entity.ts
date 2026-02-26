// exportando tipos de prioridades de tarefas
export const statusPriority = {
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE',
  TESTED: 'TESTED',
  REVIEWED: 'REVIEWED',
  COMPLETED: 'COMPLETED',
} as const;

// exportando tipos de status de prioridades de tarefas com typeof
export type statusPriority =
  (typeof statusPriority)[keyof typeof statusPriority];

// exportando classe de entitidade de tarefas
export class Tasks {
  // atributos
  public readonly id?: string;
  public readonly title: string;
  public readonly description: string;
  public readonly priority: statusPriority;
  public readonly dateStart?: Date;
  public readonly dateEnd?: Date;
  public readonly userId: string;
  public readonly comments: string;

  //   inicializador
  constructor(
    title: string,
    description: string,
    priority: statusPriority,
    userId: string,
    comments: string,
    dateStart?: Date,
    dateEnd?: Date,
    id?: string,
  ) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.userId = userId;
    this.comments = comments;

    if (dateStart !== undefined) this.dateStart = dateStart;
    if (dateEnd !== undefined) this.dateEnd = dateEnd;
    if (id) this.id = id;
  }
}
