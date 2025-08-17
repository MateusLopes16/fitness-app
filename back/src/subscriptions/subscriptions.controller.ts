import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';

interface CreateSubscriptionDto {
  plan: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface UpdatePlanDto {
  plan: string;
}

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async createSubscription(
    @Request() req: any,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    try {
      const subscription = await this.subscriptionsService.createSubscription(
        req.user.sub,
        createSubscriptionDto.plan,
        createSubscriptionDto.stripeCustomerId,
        createSubscriptionDto.stripeSubscriptionId,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Subscription created successfully',
        data: subscription,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getUserSubscription(@Request() req: any) {
    try {
      console.log('Getting subscription for user:', req.user.sub);
      const subscription = await this.subscriptionsService.getUserSubscription(
        req.user.sub,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription retrieved successfully',
        data: subscription,
      };
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw new HttpException(
        'Failed to retrieve subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('plan')
  async updateSubscriptionPlan(
    @Request() req: any,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    try {
      const subscription = await this.subscriptionsService.updateSubscriptionPlan(
        req.user.sub,
        updatePlanDto.plan,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription plan updated successfully',
        data: subscription,
      };
    } catch (error) {
      if (error.message === 'Subscription not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to update subscription plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async cancelSubscription(@Request() req: any) {
    try {
      const subscription = await this.subscriptionsService.cancelSubscription(
        req.user.sub,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription cancelled successfully',
        data: subscription,
      };
    } catch (error) {
      if (error.message === 'Subscription not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to cancel subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('format-plan/:plan')
  formatPlan(@Param('plan') plan: string) {
    const formattedPlan = this.subscriptionsService.formatPlanName(plan);
    
    return {
      statusCode: HttpStatus.OK,
      data: {
        original: plan,
        formatted: formattedPlan,
      },
    };
  }
}
