import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertType, AlertStatus } from './create-alert.dto';

export class AlertResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty({ enum: AlertType })
  type: AlertType;

  @ApiProperty({ enum: AlertStatus })
  status: AlertStatus;

  @ApiPropertyOptional()
  targetPrice?: number;

  @ApiPropertyOptional()
  rsiThreshold?: number;

  @ApiPropertyOptional()
  minSignalStrength?: number;

  @ApiPropertyOptional()
  timeframe?: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  repeatAlert: boolean;

  @ApiPropertyOptional()
  triggeredAt?: Date;

  @ApiPropertyOptional()
  triggeredPrice?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
