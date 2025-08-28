import { NextRequest, NextResponse } from 'next/server';
import { Container } from '@/infrastructure/config/container';
import { UserProfile } from '@/core/domain/entities/UserProfile';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = Container.getInstance();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload || typeof payload.userId !== 'number') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const profileRepository = container.getUserProfileRepository();
    const profile = await profileRepository.findByUserId(payload.userId);

    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        userId: profile.userId,
        churchName: profile.churchName,
        position: profile.position,
        denomination: profile.denomination,
        address: profile.address,
        postcode: profile.postcode,
        birthDate: profile.birthDate,
        gender: profile.gender,
        profileImage: profile.profileImage,
        newsletterSubscribe: profile.newsletterSubscribe,
        marketingAgree: profile.marketingAgree,
        privacyAgreeDate: profile.privacyAgreeDate,
        termsAgreeDate: profile.termsAgreeDate,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = Container.getInstance();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload || typeof payload.userId !== 'number') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const profileRepository = container.getUserProfileRepository();

    // Check if profile already exists
    const existingProfile = await profileRepository.findByUserId(payload.userId);
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    // Create new profile
    const newProfile = UserProfile.create({
      userId: payload.userId,
      churchName: body.churchName,
      position: body.position,
      denomination: body.denomination,
      address: body.address,
      postcode: body.postcode,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      gender: body.gender,
      profileImage: body.profileImage,
      newsletterSubscribe: body.newsletterSubscribe || false,
      marketingAgree: body.marketingAgree || false,
      privacyAgreeDate: body.privacyAgreeDate ? new Date(body.privacyAgreeDate) : null,
      termsAgreeDate: body.termsAgreeDate ? new Date(body.termsAgreeDate) : null
    });

    const savedProfile = await profileRepository.save(newProfile);

    return NextResponse.json({
      profile: {
        id: savedProfile.id,
        userId: savedProfile.userId,
        churchName: savedProfile.churchName,
        position: savedProfile.position,
        denomination: savedProfile.denomination,
        address: savedProfile.address,
        postcode: savedProfile.postcode,
        birthDate: savedProfile.birthDate,
        gender: savedProfile.gender,
        profileImage: savedProfile.profileImage,
        newsletterSubscribe: savedProfile.newsletterSubscribe,
        marketingAgree: savedProfile.marketingAgree,
        privacyAgreeDate: savedProfile.privacyAgreeDate,
        termsAgreeDate: savedProfile.termsAgreeDate,
        createdAt: savedProfile.createdAt,
        updatedAt: savedProfile.updatedAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = Container.getInstance();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload || typeof payload.userId !== 'number') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const profileRepository = container.getUserProfileRepository();

    const profile = await profileRepository.findByUserId(payload.userId);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update profile fields
    profile.updateProfileInfo({
      churchName: body.churchName,
      position: body.position,
      denomination: body.denomination,
      address: body.address,
      postcode: body.postcode,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      gender: body.gender
    });

    if (body.profileImage !== undefined) {
      profile.updateProfileImage(body.profileImage);
    }

    if (body.newsletterSubscribe !== undefined) {
      profile.updateNewsletterSubscription(body.newsletterSubscribe);
    }

    if (body.marketingAgree !== undefined) {
      profile.updateMarketingAgreement(body.marketingAgree);
    }

    await profileRepository.update(profile);

    return NextResponse.json({
      profile: {
        id: profile.id,
        userId: profile.userId,
        churchName: profile.churchName,
        position: profile.position,
        denomination: profile.denomination,
        address: profile.address,
        postcode: profile.postcode,
        birthDate: profile.birthDate,
        gender: profile.gender,
        profileImage: profile.profileImage,
        newsletterSubscribe: profile.newsletterSubscribe,
        marketingAgree: profile.marketingAgree,
        privacyAgreeDate: profile.privacyAgreeDate,
        termsAgreeDate: profile.termsAgreeDate,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}