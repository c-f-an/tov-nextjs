import { Menu, MenuType } from '../entities/Menu';

interface IMenuRepository {
  findById(id: number): Promise<Menu | null>;
  findByType(menuType: MenuType, includeInactive?: boolean): Promise<Menu[]>;
  findAll(includeInactive?: boolean): Promise<Menu[]>;
  findChildren(parentId: number, includeInactive?: boolean): Promise<Menu[]>;
  save(menu: Menu): Promise<Menu>;
  update(menu: Menu): Promise<void>;
  delete(id: number): Promise<void>;
  buildHierarchy(menus: Menu[]): Menu[];
}

export type { IMenuRepository };