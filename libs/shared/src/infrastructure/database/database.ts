// importando prismaClient para gerenciamento do banco de dados
import { PrismaClient } from '@prisma/client';

// importando onModuleInit e onModuleDestroy para conexão e desconexão com o banco de dados
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

// importando injectable para mostrar que está classe é um provider
import { Injectable } from '@nestjs/common';

// importando prismapg para conexão com o banco de dados
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class Database
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // url de conexão com o banco de dados
    const connectionString = `${process.env.DATABASE_URL}`;

    // criando adapter para o banco de dados
    const adapter = new PrismaPg({ connectionString });

    // herdando adapter no constructor
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
