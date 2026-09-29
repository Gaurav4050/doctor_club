import { NextResponse } from 'next/server';
import { saveRegistration, getRegistrations } from '@/lib/storage';

export async function GET() {
  try {
    const list = await getRegistrations();
    return NextResponse.json({
      success: true,
      total: list.length,
      recent: list.slice(0, 5).map(item => ({
        id: item.id,
        name: item.name,
        city: item.city,
        batchYear: item.batchYear,
        clinicType: item.clinicType,
        registrationDate: item.registrationDate
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Required fields validation
    const { name, phone, email, batchYear, city, clinicName, clinicType } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Name, Phone number, and Email are required.' },
        { status: 400 }
      );
    }

    // Clean phone number (Indian phone format check)
    const cleanedPhone = phone.replace(/[^0-9+]/g, '');

    const result = await saveRegistration({
      ...body,
      phone: cleanedPhone
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Welcome to All India Doctors Club Association.',
      data: result.data,
      total: result.total,
      storageStatus: result.storageStatus
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error while saving registration.' },
      { status: 500 }
    );
  }
}
