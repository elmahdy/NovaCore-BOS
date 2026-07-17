import { Module } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ApiGatewayService],
  exports: [ApiGatewayService, AuthModule],
})
export class ApiGatewayModule {}
