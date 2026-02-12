// importando appError para ser herdado
import { AppError } from '../app.error';

// exportando classe de error personalizado
export class CredentialsUserError extends AppError {
  constructor() {
    super('Email or password incorrect!', 400);
  }
}
