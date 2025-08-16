import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  planId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string = 'usd';
}
