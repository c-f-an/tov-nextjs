import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { pool } from '@/infrastructure/database/mysql';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Get all site settings
    const [settings] = await pool.execute(
      'SELECT setting_key, setting_value, setting_type, description FROM site_settings ORDER BY setting_key'
    );

    // Transform settings into an object
    const settingsMap = {};
    for (const setting of settings as any[]) {
      let value = setting.setting_value;
      
      // Parse value based on type
      switch (setting.setting_type) {
        case 'number':
          value = Number(value);
          break;
        case 'boolean':
          value = value === 'true';
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch {
            value = {};
          }
          break;
      }
      
      settingsMap[setting.setting_key] = {
        value,
        type: setting.setting_type,
        description: setting.description
      };
    }

    return NextResponse.json({
      settings: settingsMap
    });
  } catch (error) {
    console.error('Admin settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Update each setting
    const updatedSettings = [];
    for (const [key, data] of Object.entries(settings)) {
      if (typeof data !== 'object' || !('value' in data)) {
        continue;
      }

      const { value, type } = data as any;
      let settingValue = value;

      // Convert value to string based on type
      switch (type) {
        case 'json':
          settingValue = JSON.stringify(value);
          break;
        case 'boolean':
          settingValue = value ? 'true' : 'false';
          break;
        default:
          settingValue = String(value);
      }

      // Update or insert setting
      await pool.execute(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_by) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         setting_value = VALUES(setting_value),
         setting_type = VALUES(setting_type),
         updated_by = VALUES(updated_by)`,
        [key, settingValue, type || 'string', admin.id]
      );

      updatedSettings.push(key);
    }

    // Log admin action
    await logAdminAction(
      admin.id,
      'UPDATE_SETTINGS',
      'site_settings',
      null,
      { updatedKeys: updatedSettings },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      updatedSettings
    });
  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}