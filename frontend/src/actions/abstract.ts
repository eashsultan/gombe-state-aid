'use server'

import { prisma } from '@/lib/prisma'
import {
  ABSTRACT_MAX_BYTES,
  ABSTRACT_MIME_TYPES,
  ABSTRACTS_BUCKET,
  getSupabaseAdmin,
} from '@/lib/supabase-admin'

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
}

export async function submitAbstract(formData: FormData) {
  try {
    const title = (formData.get('title') as string || '').trim();
    const authorName = (formData.get('authorName') as string || '').trim();
    const email = (formData.get('email') as string || '').trim();
    const organization = (formData.get('organization') as string || '').trim();
    const themeId = (formData.get('themeId') as string || '').trim();
    const content = (formData.get('text') as string || '').trim();
    const coAuthors = ((formData.get('coAuthors') as string) || '').trim() || null;
    const phone = ((formData.get('phone') as string) || '').trim() || null;
    const presentationType = ((formData.get('presentationType') as string) || '').trim() || null;
    const keywords = ((formData.get('keywords') as string) || '').trim() || null;
    const declaration = formData.get('declaration') === 'on';

    if (!title || !authorName || !email || !organization || !themeId || !content) {
      return { success: false, error: 'Please complete all required fields.' };
    }
    if (!declaration) {
      return { success: false, error: 'Please accept the declaration to submit.' };
    }

    const file = formData.get('file') as File | null;
    let filePath: string | null = null;
    if (file && file.size > 0) {
      if (!ABSTRACT_MIME_TYPES.includes(file.type)) {
        return { success: false, error: 'Only PDF or Word documents are accepted.' };
      }
      if (file.size > ABSTRACT_MAX_BYTES) {
        return { success: false, error: 'File must be smaller than 10 MB.' };
      }
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return { success: false, error: 'File upload is not configured. Please try again later.' };
      }
      const record = await prisma.abstract.create({
        data: { title, authorName, email, organization, themeId, text: content, coAuthors, phone, presentationType, keywords, declaration, status: 'SUBMITTED' },
      });
      filePath = `${record.id}/${safeFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from(ABSTRACTS_BUCKET)
        .upload(filePath, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: true });
      if (uploadError) {
        console.error('Abstract upload error:', uploadError);
        await prisma.abstract.delete({ where: { id: record.id } });
        return { success: false, error: 'File upload failed. Please try again.' };
      }
      await prisma.abstract.update({ where: { id: record.id }, data: { fileUrl: filePath } });
      return { success: true };
    }

    await prisma.abstract.create({
      data: { title, authorName, email, organization, themeId, text: content, coAuthors, phone, presentationType, keywords, declaration, status: 'SUBMITTED' }
    });

    return { success: true };
  } catch (error) {
    console.error('Abstract submission error:', error);
    return { success: false, error: 'Abstract submission failed.' };
  }
}

export async function getAbstractFileUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.storage.from(ABSTRACTS_BUCKET).createSignedUrl(path, 3600);
  if (error) {
    console.error('Signed URL error:', error);
    return null;
  }
  return data.signedUrl;
}
