import { IMenuRepository } from '@/core/domain/repositories/IMenuRepository';
import { Menu, MenuType, LinkTarget } from '@/core/domain/entities/Menu';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface MenuRow extends RowDataPacket {
  id: number;
  parent_id: number | null;
  name: string;
  url: string | null;
  menu_type: MenuType;
  target: LinkTarget;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class MySQLMenuRepository implements IMenuRepository {
  async findById(id: number): Promise<Menu | null> {
    const row = await queryOne<MenuRow>(
      'SELECT * FROM menus WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToMenu(row) : null;
  }

  async findByType(menuType: MenuType, includeInactive: boolean = false): Promise<Menu[]> {
    const whereConditions = ['menu_type = ?'];
    const params: any[] = [menuType];
    
    if (!includeInactive) {
      whereConditions.push('is_active = true');
    }
    
    const rows = await query<MenuRow>(
      `SELECT * FROM menus WHERE ${whereConditions.join(' AND ')} ORDER BY sort_order ASC, name ASC`,
      params
    );
    
    const menus = rows.map(row => this.mapToMenu(row));
    return this.buildHierarchy(menus);
  }

  async findAll(includeInactive: boolean = false): Promise<Menu[]> {
    const whereClause = includeInactive ? '' : 'WHERE is_active = true';
    const rows = await query<MenuRow>(
      `SELECT * FROM menus ${whereClause} ORDER BY menu_type, sort_order ASC, name ASC`
    );
    
    const menus = rows.map(row => this.mapToMenu(row));
    return this.buildHierarchy(menus);
  }

  async findChildren(parentId: number, includeInactive: boolean = false): Promise<Menu[]> {
    const whereConditions = ['parent_id = ?'];
    const params: any[] = [parentId];
    
    if (!includeInactive) {
      whereConditions.push('is_active = true');
    }
    
    const rows = await query<MenuRow>(
      `SELECT * FROM menus WHERE ${whereConditions.join(' AND ')} ORDER BY sort_order ASC, name ASC`,
      params
    );
    
    return rows.map(row => this.mapToMenu(row));
  }

  async save(menu: Menu): Promise<Menu> {
    const result = await query<any>(
      `INSERT INTO menus (parent_id, name, url, menu_type, target, sort_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        menu.parentId,
        menu.name,
        menu.url,
        menu.menuType,
        menu.target,
        menu.sortOrder,
        menu.isActive
      ]
    );
    
    return new Menu(
      result.insertId,
      menu.parentId,
      menu.name,
      menu.url,
      menu.menuType,
      menu.target,
      menu.sortOrder,
      menu.isActive,
      new Date(),
      new Date()
    );
  }

  async update(menu: Menu): Promise<void> {
    await query(
      `UPDATE menus 
       SET parent_id = ?, name = ?, url = ?, menu_type = ?, target = ?, sort_order = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        menu.parentId,
        menu.name,
        menu.url,
        menu.menuType,
        menu.target,
        menu.sortOrder,
        menu.isActive,
        menu.id
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM menus WHERE id = ?', [id]);
  }

  buildHierarchy(menus: Menu[]): Menu[] {
    const menuMap = new Map<number, Menu>();
    const rootMenus: Menu[] = [];

    // First pass: create a map of all menus
    menus.forEach(menu => {
      menuMap.set(menu.id, menu);
    });

    // Second pass: build the hierarchy
    menus.forEach(menu => {
      if (menu.parentId === null) {
        rootMenus.push(menu);
      } else {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.addChild(menu);
        }
      }
    });

    // Sort root menus and their children
    const sortMenus = (menuList: Menu[]) => {
      menuList.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
      menuList.forEach(menu => {
        if (menu.hasChildren()) {
          sortMenus(menu.children);
        }
      });
    };

    sortMenus(rootMenus);
    return rootMenus;
  }

  private mapToMenu(row: MenuRow): Menu {
    return new Menu(
      row.id,
      row.parent_id,
      row.name,
      row.url,
      row.menu_type,
      row.target,
      row.sort_order,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }
}