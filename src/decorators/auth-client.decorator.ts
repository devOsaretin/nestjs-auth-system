import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthClient = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
