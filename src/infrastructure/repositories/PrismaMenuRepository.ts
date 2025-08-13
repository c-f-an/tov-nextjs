import { Menu, MenuType, LinkTarget } from '@/core/domain/entities/Menu';
import { IMenuRepository } from '@/core/domain/repositories/IMenuRepository';
import { prisma } from '../database/prisma';
import { Menu as PrismaMenu, MenuType as PrismaMenuType, LinkTarget as PrismaLinkTarget } from '@prisma/client';

export class PrismaMenuRepository implements IMenuRepository {
  private toDomain(prismaMenu: PrismaMenu): Menu {
    return new Menu(
      prismaMenu.id,
      prismaMenu.parentId,
      prismaMenu.name,
      prismaMenu.url,
      prismaMenu.menuType as MenuType,
      prismaMenu.target as LinkTarget,
      prismaMenu.sortOrder,
      prismaMenu.isActive,
      prismaMenu.createdAt || new Date(),
      prismaMenu.updatedAt || new Date()
    );
  }

  async findById(id: number): Promise<Menu | null> {
    const menu = await prisma.menu.findUnique({
      where: { id }
    });

    return menu ? this.toDomain(menu) : null;
  }

  async findByType(menuType: MenuType, includeInactive: boolean = false): Promise<Menu[]> {
    const menus = await prisma.menu.findMany({
      where: {
        menuType: menuType as PrismaMenuType,
        ...(includeInactive ? {} : { isActive: true })
      },
      orderBy: [
        { parentId: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    const domainMenus = menus.map(menu => this.toDomain(menu));
    return this.buildHierarchy(domainMenus);
  }

  async findAll(includeInactive: boolean = false): Promise<Menu[]> {
    const menus = await prisma.menu.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [
        { menuType: 'asc' },
        { parentId: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return menus.map(menu => this.toDomain(menu));
  }

  async findChildren(parentId: number, includeInactive: boolean = false): Promise<Menu[]> {
    const menus = await prisma.menu.findMany({
      where: {
        parentId,
        ...(includeInactive ? {} : { isActive: true })
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return menus.map(menu => this.toDomain(menu));
  }

  async save(menu: Menu): Promise<Menu> {
    const savedMenu = await prisma.menu.create({
      data: {
        parentId: menu.parentId,
        name: menu.name,
        url: menu.url,
        menuType: menu.menuType as PrismaMenuType,
        target: menu.target as PrismaLinkTarget,
        sortOrder: menu.sortOrder,
        isActive: menu.isActive
      }
    });

    return this.toDomain(savedMenu);
  }

  async update(menu: Menu): Promise<void> {
    await prisma.menu.update({
      where: { id: menu.id },
      data: {
        parentId: menu.parentId,
        name: menu.name,
        url: menu.url,
        menuType: menu.menuType as PrismaMenuType,
        target: menu.target as PrismaLinkTarget,
        sortOrder: menu.sortOrder,
        isActive: menu.isActive
      }
    });
  }

  async delete(id: number): Promise<void> {
    // Delete children first (cascade)
    await prisma.menu.deleteMany({
      where: { parentId: id }
    });
    
    await prisma.menu.delete({
      where: { id }
    });
  }

  buildHierarchy(menus: Menu[]): Menu[] {
    const menuMap = new Map<number, Menu>();
    const roots: Menu[] = [];

    // First pass: create map
    menus.forEach(menu => {
      menuMap.set(menu.id, menu);
    });

    // Second pass: build hierarchy
    menus.forEach(menu => {
      if (menu.parentId && menuMap.has(menu.parentId)) {
        const parent = menuMap.get(menu.parentId)!;
        parent.addChild(menu);
      } else {
        roots.push(menu);
      }
    });

    return roots;
  }
}