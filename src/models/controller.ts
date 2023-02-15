import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

async function onHandleError(
  error: Error,
  _request: NextApiRequest,
  response: NextApiResponse,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({ errors: error.issues });
  }

  return response
    .status(500)
    .json({ message: `Internal server error - ${error.message}` });
}

async function onNoMatchHandler(
  _request: NextApiRequest,
  response: NextApiResponse,
) {
  return response.status(404).json({
    message:
      'Could not find this resource on the system. Make sure the path (PATH) and method (GET, POST, PUT, DELETE) are correct.',
  });
}

export default Object.freeze({
  onNoMatchHandler,
  onHandleError,
});
