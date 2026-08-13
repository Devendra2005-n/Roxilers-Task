import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STORE_OWNER)
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    return this.ownerService.getDashboard(req.user.id);
  }
}
