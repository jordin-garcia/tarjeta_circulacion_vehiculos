import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto hace que no se tenga que importar en cada módulo individualmente
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // Exportamos para que otros lo inyecten
})
export class PrismaModule { }
