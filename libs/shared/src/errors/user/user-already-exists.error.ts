// importando appError para ser herdado
import { AppError } from '../app.error';

// exportando classe de error personalizado
export class userAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`User already exists from email ${email}!`, 409);
  }
}
