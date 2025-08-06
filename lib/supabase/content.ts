import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Types
export interface Notice {
  id: string;
  title: { ko: string; en: string };
  content: { ko: string; en: string };
  category: 'general' | 'service' | 'event' | 'maintenance';
  is_pinned: boolean;
  is_published: boolean;
  author: string;
  views: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  title: { ko: string; en: string };
  content: { ko: string; en: string };
  excerpt: { ko: string; en: string };
  category: 'news' | 'event' | 'promotion' | 'update';
  featured_image?: string;
  author: string;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  event_date?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  question: { ko: string; en: string };
  answer: { ko: string; en: string };
  category: 'general' | 'product' | 'order' | 'delivery' | 'return' | 'payment' | 'membership';
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  views: number;
  helpful_yes: number;
  helpful_no: number;
  created_at: string;
  updated_at: string;
}

// Notice functions
export async function getNotices(isAdmin = false) {
  const supabase = createClientComponentClient();
  
  let query = supabase
    .from('notices')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (!isAdmin) {
    query = query.eq('is_published', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching notices:', error);
    return [];
  }
  
  return data as Notice[];
}

export async function getNotice(id: string) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching notice:', error);
    return null;
  }
  
  return data as Notice;
}

export async function createNotice(notice: Omit<Notice, 'id' | 'created_at' | 'updated_at' | 'views'>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('notices')
    .insert({
      ...notice,
      published_at: notice.is_published ? new Date().toISOString() : null
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
  
  return data as Notice;
}

export async function updateNotice(id: string, updates: Partial<Notice>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('notices')
    .update({
      ...updates,
      published_at: updates.is_published ? new Date().toISOString() : null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating notice:', error);
    throw error;
  }
  
  return data as Notice;
}

export async function deleteNotice(id: string) {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting notice:', error);
    throw error;
  }
}

// News functions
export async function getNews(isAdmin = false) {
  const supabase = createClientComponentClient();
  
  let query = supabase
    .from('news')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (!isAdmin) {
    query = query.eq('is_published', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }
  
  return data as NewsItem[];
}

export async function getNewsItem(id: string) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching news item:', error);
    return null;
  }
  
  // Increment views
  await supabase
    .from('news')
    .update({ views: data.views + 1 })
    .eq('id', id);
  
  return data as NewsItem;
}

export async function createNewsItem(newsItem: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments'>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('news')
    .insert({
      ...newsItem,
      published_at: newsItem.is_published ? new Date().toISOString() : null
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating news item:', error);
    throw error;
  }
  
  return data as NewsItem;
}

export async function updateNewsItem(id: string, updates: Partial<NewsItem>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('news')
    .update({
      ...updates,
      published_at: updates.is_published ? new Date().toISOString() : null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating news item:', error);
    throw error;
  }
  
  return data as NewsItem;
}

export async function deleteNewsItem(id: string) {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting news item:', error);
    throw error;
  }
}

// FAQ functions
export async function getFAQs(isAdmin = false) {
  const supabase = createClientComponentClient();
  
  let query = supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (!isAdmin) {
    query = query.eq('is_published', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
  
  return data as FAQItem[];
}

export async function getFAQ(id: string) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching FAQ:', error);
    return null;
  }
  
  // Increment views
  await supabase
    .from('faqs')
    .update({ views: data.views + 1 })
    .eq('id', id);
  
  return data as FAQItem;
}

export async function createFAQ(faq: Omit<FAQItem, 'id' | 'created_at' | 'updated_at' | 'views' | 'helpful_yes' | 'helpful_no'>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('faqs')
    .insert(faq)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating FAQ:', error);
    throw error;
  }
  
  return data as FAQItem;
}

export async function updateFAQ(id: string, updates: Partial<FAQItem>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('faqs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating FAQ:', error);
    throw error;
  }
  
  return data as FAQItem;
}

export async function deleteFAQ(id: string) {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting FAQ:', error);
    throw error;
  }
}

export async function updateFAQOrder(faqs: { id: string; display_order: number }[]) {
  const supabase = createClientComponentClient();
  
  const promises = faqs.map(faq =>
    supabase
      .from('faqs')
      .update({ display_order: faq.display_order })
      .eq('id', faq.id)
  );
  
  await Promise.all(promises);
}

export async function incrementFAQFeedback(id: string, type: 'helpful_yes' | 'helpful_no') {
  const supabase = createClientComponentClient();
  
  const { data } = await supabase
    .from('faqs')
    .select(type)
    .eq('id', id)
    .single();
  
  if (data) {
    await supabase
      .from('faqs')
      .update({ [type]: data[type] + 1 })
      .eq('id', id);
  }
}