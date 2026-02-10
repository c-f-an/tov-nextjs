export class ResourceType {
  constructor(
    public readonly id: number,
    public name: string,
    public code: string,
    public sortOrder: number
  ) {}

  static create(
    name: string,
    code: string,
    sortOrder: number = 0
  ): ResourceType {
    return new ResourceType(0, name, code, sortOrder);
  }

  update(data: Partial<{
    name: string;
    code: string;
    sortOrder: number;
  }>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.code !== undefined) this.code = data.code;
    if (data.sortOrder !== undefined) this.sortOrder = data.sortOrder;
  }
}
