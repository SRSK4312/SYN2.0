

// private dateNow = new Date().toLocaleString("ru",{year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric',second: 'numeric'})


import { ConsoleLogger } from '@nestjs/common';

export class _logger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
  }
}



