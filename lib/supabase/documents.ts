import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface DocumentCategory {
  id: string;
  name: { ko: string; en: string };
  slug: string;
  description?: { ko: string; en: string };
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: { ko: string; en: string };
  description?: { ko: string; en: string };
  category_id: string;
  category?: DocumentCategory;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  thumbnail_url?: string;
  content_text?: string; // For text files or extracted content
  tags: string[];
  downloads: number;
  views: number;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  metadata?: {
    pages?: number;
    author?: string;
    created_date?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// Get all document categories
export async function getDocumentCategories(activeOnly = false) {
  const supabase = createClientComponentClient();
  
  let query = supabase
    .from('document_categories')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as DocumentCategory[];
}

// Create document category
export async function createDocumentCategory(category: Omit<DocumentCategory, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('document_categories')
    .insert({
      ...category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as DocumentCategory;
}

// Update document category
export async function updateDocumentCategory(id: string, updates: Partial<DocumentCategory>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('document_categories')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as DocumentCategory;
}

// Delete document category
export async function deleteDocumentCategory(id: string) {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('document_categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Get all documents
export async function getDocuments(options?: {
  category_id?: string;
  published_only?: boolean;
  featured_only?: boolean;
}) {
  const supabase = createClientComponentClient();
  
  let query = supabase
    .from('documents')
    .select(`
      *,
      category:document_categories(*)
    `)
    .order('display_order', { ascending: true });
  
  if (options?.category_id) {
    query = query.eq('category_id', options.category_id);
  }
  
  if (options?.published_only) {
    query = query.eq('is_published', true);
  }
  
  if (options?.featured_only) {
    query = query.eq('is_featured', true);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as Document[];
}

// Get single document
export async function getDocument(id: string) {
  const supabase = createClientComponentClient();
  
  // Increment view count
  await supabase.rpc('increment_document_views', { doc_id: id });
  
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      category:document_categories(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Document;
}

// Create document
export async function createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'category'>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('documents')
    .insert({
      ...document,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Document;
}

// Update document
export async function updateDocument(id: string, updates: Partial<Document>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('documents')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Document;
}

// Delete document
export async function deleteDocument(id: string) {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Increment download count
export async function incrementDownloadCount(id: string) {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase.rpc('increment_document_downloads', { doc_id: id });
  
  if (error) throw error;
}