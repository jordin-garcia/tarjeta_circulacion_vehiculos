import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        // 1. Creamos el adaptador usando la URL de Supabase
        const adapter = new PrismaPg({
            connectionString: process.env.DIRECT_URL as string
        });

        // 2. Se lo pasamos a Prisma 7 para que pueda funcionar
        super({
            adapter,
            log: ['error', 'warn'],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
