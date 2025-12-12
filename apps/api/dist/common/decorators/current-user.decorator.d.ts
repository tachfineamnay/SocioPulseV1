export interface CurrentUserPayload {
    id: string;
    email: string;
    role: string;
    status: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof CurrentUserPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
