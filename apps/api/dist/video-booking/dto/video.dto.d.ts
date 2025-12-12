export declare class CreateVideoSessionDto {
    bookingId: string;
    durationMinutes?: number;
}
export declare class VideoRoomDto {
    roomId: string;
    roomName: string;
    hostToken: string;
    participantToken: string;
    meetingUrl: string;
    expiresAt: Date;
}
export declare class JoinVideoSessionDto {
    roomId: string;
}
export declare class VideoTokenDto {
    token: string;
    roomName: string;
    meetingUrl: string;
}
