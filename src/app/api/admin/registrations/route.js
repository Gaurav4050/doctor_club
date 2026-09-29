import { NextResponse } from 'next/server';
import { getRegistrations, deleteRegistration, setAllRegistrations } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const list = await getRegistrations();

    // Calculate metrics
    const total = list.length;
    const personalClinics = list.filter(item => 
      item.clinicType && item.clinicType.toLowerCase().includes('personal')
    ).length;
    const hospitalAffiliated = list.filter(item => 
      item.clinicType && (item.clinicType.toLowerCase().includes('hospital') || item.clinicType.toLowerCase().includes('consultant'))
    ).length;

    // Get unique cities
    const uniqueCities = [...new Set(list.map(i => i.city).filter(Boolean))].length;

    // Batch distribution
    const batchDistribution = {};
    list.forEach(i => {
      if (i.batchYear) {
        batchDistribution[i.batchYear] = (batchDistribution[i.batchYear] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        total,
        personalClinics,
        hospitalAffiliated,
        uniqueCities,
        batchDistribution
      },
      data: list
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Registration ID required' }, { status: 400 });
    }

    await deleteRegistration(id);
    return NextResponse.json({ success: true, message: `Registration ${id} deleted successfully.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (body.action === 'restore' && Array.isArray(body.data)) {
      const result = await setAllRegistrations(body.data);
      return NextResponse.json({
        success: true,
        message: `Successfully restored ${result.count} registrations.`,
        count: result.count
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
