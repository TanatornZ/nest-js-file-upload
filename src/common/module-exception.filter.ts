import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ModuleHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default values
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      `Internal server error: Failed to call ${request.url.slice(1)} API`;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // Normalize message
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        const r = res as Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message = r.message ?? r.error ?? JSON.stringify(r);
      }
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      method: request.method,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
