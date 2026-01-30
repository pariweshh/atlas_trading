import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new alert' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAlertDto) {
    return this.alertsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all alerts for current user' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'all'] })
  findAll(@CurrentUser('id') userId: string, @Query('status') status?: string) {
    if (status === 'active') {
      return this.alertsService.findActiveByUser(userId);
    }
    return this.alertsService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific alert' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.alertsService.findOne(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an alert' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAlertDto,
  ) {
    return this.alertsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an alert' })
  delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.alertsService.delete(id, userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an alert' })
  cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.alertsService.cancelAlert(id, userId);
  }
}
