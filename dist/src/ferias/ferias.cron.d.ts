import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';
export declare class FeriasCron {
    private prisma;
    private notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    processarFeriasDoDia(): Promise<void>;
}
