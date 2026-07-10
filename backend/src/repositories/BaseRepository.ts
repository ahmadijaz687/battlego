export interface IRepository<T, CreateInput, UpdateInput> {
  findById(id: string): Promise<T | null>;
  findMany(params?: { skip?: number; take?: number; orderBy?: Record<string, 'asc' | 'desc'> }): Promise<T[]>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<void>;
  count(where?: Record<string, unknown>): Promise<number>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaModel = { [key: string]: any };

export class BaseRepository<T, CreateInput, UpdateInput> implements IRepository<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly model: PrismaModel,
    protected readonly modelName: string
  ) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findMany(params?: { skip?: number; take?: number; orderBy?: Record<string, 'asc' | 'desc'> }): Promise<T[]> {
    return this.model.findMany({
      skip: params?.skip,
      take: params?.take || 20,
      orderBy: params?.orderBy || { createdAt: 'desc' },
    });
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.model.count({ where });
  }
}
