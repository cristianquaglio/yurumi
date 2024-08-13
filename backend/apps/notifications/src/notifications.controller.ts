import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { NotificationsService } from './notifications.service';
import { NotifyByEmailDto } from './dto/notify-by-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  notifyByEmail(@Payload() notifyByEmailDto: NotifyByEmailDto) {
    this.notificationsService.notifyByEmail(notifyByEmailDto);
  }
}
