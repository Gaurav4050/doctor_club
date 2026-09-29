import { NextResponse } from 'next/server';
import { getRegistrations, deleteRegistration, setAllRegistrations, isCloudConfigured, saveRegistration } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

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
      cloudConfigured: isCloudConfigured(),
      stats: {
        total,
        personalClinics,
        hospitalAffiliated,
        uniqueCities,
        batchDistribution
      },
      data: list
    }, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Registration ID required' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    await deleteRegistration(id);
    return NextResponse.json({ success: true, message: `Registration ${id} deleted successfully.` }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
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
      }, { headers: NO_CACHE_HEADERS });
    }

    // Support syncing multiple records (e.g. from browser localStorage)
    if (body.action === 'sync' && Array.isArray(body.data)) {
      const currentList = await getRegistrations();
      let addedCount = 0;
      const existingPhoneMap = new Set(currentList.map(i => i.phone));

      for (const item of body.data) {
        if (item.phone && !existingPhoneMap.has(item.phone)) {
          await saveRegistration(item);
          existingPhoneMap.add(item.phone);
          addedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Synced ${addedCount} new registrations from browser storage.`,
        addedCount
      }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400, headers: NO_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
