import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ProcessPostEvent } from './process-post.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'process_post' })
  handleProcessPost(data: ProcessPostEvent) {
    return this.appService.handleProcessPost(data);
  }
}
