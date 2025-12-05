import { Module } from '@nestjs/common';
import { VideoBookingController } from './video-booking.controller';
import { VideoBookingService } from './video-booking.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [VideoBookingController],
    providers: [VideoBookingService],
    exports: [VideoBookingService],
})
export class VideoBookingModule { }
