import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AfastamentosService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.afastamento.create({ data });
  }

  findAll() {
    return this.prisma.afastamento.findMany({
      include: { colab: true },
      orderBy: { data_inicio: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.afastamento.findUnique({
      where: { id },
      include: { colab: true },
    });
  }

  update(id: string, data: any) {
    return this.prisma.afastamento.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.afastamento.delete({
      where: { id },
    });
  }
}
