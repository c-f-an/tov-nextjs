export type MenuType = 'main' | 'footer' | 'utility';
export type LinkTarget = '_self' | '_blank';

export class Menu {
  constructor(
    public readonly id: number,
    public parentId: number | null,
    public name: string,
    public url: string | null,
    public menuType: MenuType,
    public target: LinkTarget,
    public sortOrder: number,
    public isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public children: Menu[] = []
  ) {}

  static create(data: {
    parentId?: number | null;
    name: string;
    url?: string | null;
    menuType: MenuType;
    target?: LinkTarget;
    sortOrder?: number;
    isActive?: boolean;
  }): Menu {
    return new Menu(
      0,
      data.parentId || null,
      data.name,
      data.url || null,
      data.menuType,
      data.target || '_self',
      data.sortOrder || 0,
      data.isActive !== undefined ? data.isActive : true,
      new Date(),
      new Date()
    );
  }

  updateInfo(data: {
    name?: string;
    url?: string | null;
    target?: LinkTarget;
    sortOrder?: number;
  }): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.url !== undefined) this.url = data.url;
    if (data.target !== undefined) this.target = data.target;
    if (data.sortOrder !== undefined) this.sortOrder = data.sortOrder;
  }

  changeParent(parentId: number | null): void {
    this.parentId = parentId;
  }

  changeMenuType(menuType: MenuType): void {
    this.menuType = menuType;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
  }

  addChild(menu: Menu): void {
    this.children.push(menu);
  }

  removeChild(menuId: number): void {
    this.children = this.children.filter(child => child.id !== menuId);
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  isExternal(): boolean {
    return this.url ? this.url.startsWith('http://') || this.url.startsWith('https://') : false;
  }
}