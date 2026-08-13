import { Controller, Post, Put, Param, Body, Request, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('stores/:storeId/ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.NORMAL_USER)
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  async submitRating(
    @Param('storeId') storeId: string,
    @Request() req: any,
    @Body() dto: SubmitRatingDto
  ) {
    return this.ratingsService.submitRating(storeId, req.user.id, dto.value);
  }

  @Put()
  async updateRating(
    @Param('storeId') storeId: string,
    @Request() req: any,
    @Body() dto: SubmitRatingDto
  ) {
    return this.ratingsService.updateRating(storeId, req.user.id, dto.value);
  }
}
