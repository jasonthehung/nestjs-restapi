import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  async logToFile(entry: string) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date())}\t${entry}`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        fs.mkdirSync(path.join(__dirname, '..', '..', 'logs'));
      }
      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', 'logs', 'myLogFile.log'),
        formattedEntry + '\n',
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;

    this.logToFile(entry).catch((err) =>
      console.error('Failed to log to file:', err),
    );

    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;

    this.logToFile(entry).catch((err) =>
      console.error('Failed to log to file:', err),
    );

    super.error(message, stackOrContext);
  }
}
