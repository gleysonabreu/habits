import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';
import { AppError } from '../errors/AppError';
import { authOptions } from '../pages/api/auth/[...nextauth]';

async function userLoggedIn(
  request: NextApiRequest,
  response: NextApiResponse,
  next: NextHandler,
) {
  const session = await unstable_getServerSession(
    request,
    response,
    authOptions,
  );

  if (!session || !session.user) {
    throw new AppError('User not authenticated!', 401);
  }

  request.user = {
    ...session.user,
  };

  return next();
}

export default Object.freeze({
  userLoggedIn,
});
