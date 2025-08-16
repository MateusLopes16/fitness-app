import { IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  planId: string;

  @IsString()
  successUrl: string;

  @IsString()
  cancelUrl: string;
}
