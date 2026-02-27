import { getContainer } from '@/infrastructure/config/getContainer';
import { NextRequest, NextResponse } from 'next/server';

import { IMenuRepository } from '@/core/domain/repositories/IMenuRepository';
import { Menu, MenuType } from '@/core/domain/entities/Menu';
import { IAuthService } from '@/core/domain/services/IAuthService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuType = searchParams.get('type') as MenuType | null;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const container = getContainer();
    const menuRepository = container.getMenuRepository();

    let menus;
    if (menuType) {
      menus = await menuRepository.findByType(menuType, includeInactive);
    } else {
      menus = await menuRepository.findAll(includeInactive);
    }

    // Transform menus to response format
    const transformMenu = (menu: Menu): any => ({
      id: menu.id,
      parentId: menu.parentId,
      name: menu.name,
      url: menu.url,
      menuType: menu.menuType,
      target: menu.target,
      sortOrder: menu.sortOrder,
      isActive: menu.isActive,
      children: menu.children.map(transformMenu)
    });

    return NextResponse.json({
      menus: menus.map(transformMenu)
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = getContainer();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.name || !body.menuType) {
      return NextResponse.json(
        { error: 'Name and menuType are required' },
        { status: 400 }
      );
    }

    const menuRepository = container.getMenuRepository();
    
    const newMenu = Menu.create({
      parentId: body.parentId,
      name: body.name,
      url: body.url,
      menuType: body.menuType as MenuType,
      target: body.target,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    const savedMenu = await menuRepository.save(newMenu);

    return NextResponse.json({
      menu: {
        id: savedMenu.id,
        parentId: savedMenu.parentId,
        name: savedMenu.name,
        url: savedMenu.url,
        menuType: savedMenu.menuType,
        target: savedMenu.target,
        sortOrder: savedMenu.sortOrder,
        isActive: savedMenu.isActive,
        createdAt: savedMenu.createdAt,
        updatedAt: savedMenu.updatedAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Failed to create menu' },
      { status: 500 }
    );
  }
}