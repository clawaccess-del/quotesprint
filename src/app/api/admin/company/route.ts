import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';
import { CompanyProfile, saveCompanyProfile } from '@/lib/supabase';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL('/admin?error=auth', request.url), 303);

  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!email) return NextResponse.redirect(new URL('/admin?company=missing-email#client-accounts', request.url), 303);

  const profile: CompanyProfile = {
    business: String(formData.get('business') || ''),
    businessIndustry: String(formData.get('businessIndustry') || ''),
    companyLogoUrl: String(formData.get('companyLogoUrl') || ''),
    companyPhone: String(formData.get('companyPhone') || ''),
    companyWebsite: String(formData.get('companyWebsite') || ''),
    companyOffer: String(formData.get('companyOffer') || ''),
    idealCustomer: String(formData.get('idealCustomer') || ''),
    serviceArea: String(formData.get('serviceArea') || ''),
    brandVoice: String(formData.get('brandVoice') || ''),
    differentiator: String(formData.get('differentiator') || ''),
    guarantee: String(formData.get('guarantee') || ''),
  };

  await saveCompanyProfile(email, profile);
  return NextResponse.redirect(new URL('/admin?company=saved#client-accounts', request.url), 303);
}
