import { PartialType } from '@nestjs/swagger';
import { CreateAlertDto } from './create-alert.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AlertStatus } from './create-alert.dto';

export class UpdateAlertDto extends PartialType(CreateAlertDto) {
  @ApiPropertyOptional({ enum: AlertStatus })
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;
}
