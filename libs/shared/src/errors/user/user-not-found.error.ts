// importando appError para ser herdado
import { AppError } from '../app.error';

// exportando classe de error personalizado
export class UserNotFoundError extends AppError {
  constructor() {
    super('Credentials not found!', 404);
  }
}
