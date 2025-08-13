import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/config/container.tsyringe';
import { IMenuRepository } from '@/core/domain/repositories/IMenuRepository';
import { IAuthService } from '@/core/domain/services/IAuthService';
import { MenuType, LinkTarget } from '@/core/domain/entities/Menu';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menuId = parseInt(params.id);
    
    if (isNaN(menuId)) {
      return NextResponse.json(
        { error: 'Invalid menu ID' },
        { status: 400 }
      );
    }

    const menuRepository = container.resolve<IMenuRepository>('IMenuRepository');
    const menu = await menuRepository.findById(menuId);

    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    // Get children
    const children = await menuRepository.findChildren(menuId);

    return NextResponse.json({
      menu: {
        id: menu.id,
        parentId: menu.parentId,
        name: menu.name,
        url: menu.url,
        menuType: menu.menuType,
        target: menu.target,
        sortOrder: menu.sortOrder,
        isActive: menu.isActive,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
        children: children.map(child => ({
          id: child.id,
          name: child.name,
          url: child.url,
          target: child.target,
          sortOrder: child.sortOrder,
          isActive: child.isActive
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const authService = container.resolve<IAuthService>('IAuthService');
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const menuId = parseInt(params.id);
    
    if (isNaN(menuId)) {
      return NextResponse.json(
        { error: 'Invalid menu ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const menuRepository = container.resolve<IMenuRepository>('IMenuRepository');
    const menu = await menuRepository.findById(menuId);

    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    // Update menu
    menu.updateInfo({
      name: body.name,
      url: body.url,
      target: body.target as LinkTarget,
      sortOrder: body.sortOrder
    });

    if (body.parentId !== undefined) {
      menu.changeParent(body.parentId);
    }

    if (body.menuType !== undefined) {
      menu.changeMenuType(body.menuType as MenuType);
    }

    if (body.isActive !== undefined) {
      if (body.isActive) {
        menu.activate();
      } else {
        menu.deactivate();
      }
    }

    await menuRepository.update(menu);

    return NextResponse.json({
      menu: {
        id: menu.id,
        parentId: menu.parentId,
        name: menu.name,
        url: menu.url,
        menuType: menu.menuType,
        target: menu.target,
        sortOrder: menu.sortOrder,
        isActive: menu.isActive,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const authService = container.resolve<IAuthService>('IAuthService');
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const menuId = parseInt(params.id);
    
    if (isNaN(menuId)) {
      return NextResponse.json(
        { error: 'Invalid menu ID' },
        { status: 400 }
      );
    }

    const menuRepository = container.resolve<IMenuRepository>('IMenuRepository');
    const menu = await menuRepository.findById(menuId);

    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    await menuRepository.delete(menuId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu' },
      { status: 500 }
    );
  }
}