import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/lib/database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Note = Tables<'notes'>;
type Category = Tables<'categories'>;

// Demo mode storage keys
const DEMO_NOTES_KEY = '@foiltribe_demo_notes';
const DEMO_CATEGORIES_KEY = '@foiltribe_demo_categories';
const DEMO_VERSION_KEY = '@foiltribe_demo_version';
const DEMO_DATA_VERSION = '3'; // Increment this to reset demo data

// Sample demo notes - 10 total (4 with images, 6 without)
// Order matters for masonry layout: even indices (0,2,4,6,8) = left column, odd (1,3,5,7,9) = right
const INITIAL_DEMO_NOTES: Note[] = [
  // Index 0 - LEFT (pinned, no image)
  {
    id: 'demo-note-1',
    user_id: 'demo-user-id',
    title: 'Welcome to foiltribe!',
    description: 'This is a demo note. You can create, edit, and delete notes to try out the app. All data is stored locally on your device.\n\nTry these features:\n• Tap the + button to create notes\n• Swipe left on a note to delete\n• Tap the pin icon to keep important notes at top\n• Use categories to organize your notes',
    color: '#fef3c7',
    category_id: null,
    image_url: null,
    pinned: true,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Index 1 - RIGHT (IMAGE)
  {
    id: 'demo-note-2',
    user_id: 'demo-user-id',
    title: 'Travel Plans',
    description: 'Summer trip to Japan!\n\nTokyo - 4 days\nKyoto - 3 days\nOsaka - 2 days\n\nThings to do:\n• Visit temples and shrines\n• Try authentic ramen\n• See Mount Fuji',
    color: '#dbeafe',
    category_id: 'demo-cat-4',
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  // Index 2 - LEFT (IMAGE)
  {
    id: 'demo-note-3',
    user_id: 'demo-user-id',
    title: 'Morning Routine',
    description: '6:00 - Wake up\n6:15 - Meditation\n6:30 - Exercise\n7:00 - Shower\n7:30 - Healthy breakfast\n8:00 - Review daily goals',
    color: '#fed7aa',
    category_id: 'demo-cat-1',
    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  // Index 3 - RIGHT (no image)
  {
    id: 'demo-note-4',
    user_id: 'demo-user-id',
    title: 'Shopping List',
    description: '• Milk\n• Eggs\n• Bread\n• Coffee\n• Fresh fruits\n• Vegetables\n• Pasta\n• Olive oil',
    color: '#dcfce7',
    category_id: 'demo-cat-1',
    image_url: null,
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
  // Index 4 - LEFT (IMAGE)
  {
    id: 'demo-note-5',
    user_id: 'demo-user-id',
    title: 'Healthy Recipe',
    description: 'Avocado Toast with Eggs\n\nIngredients:\n• 2 slices sourdough bread\n• 1 ripe avocado\n• 2 eggs\n• Cherry tomatoes\n• Salt, pepper, chili flakes',
    color: '#ccfbf1',
    category_id: 'demo-cat-1',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString(),
  },
  // Index 5 - RIGHT (IMAGE)
  {
    id: 'demo-note-6',
    user_id: 'demo-user-id',
    title: 'Workout Plan',
    description: 'Monday: Chest + Triceps\nTuesday: Back + Biceps\nWednesday: Rest\nThursday: Legs\nFriday: Shoulders\nSaturday: Full Body\nSunday: Rest',
    color: '#dbeafe',
    category_id: 'demo-cat-1',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString(),
  },
  // Index 6 - LEFT (no image)
  {
    id: 'demo-note-7',
    user_id: 'demo-user-id',
    title: 'Project Ideas',
    description: '1. Build a mobile app\n2. Learn new programming language\n3. Start a tech blog\n4. Create an online course\n5. Contribute to open source',
    color: '#e9d5ff',
    category_id: 'demo-cat-2',
    image_url: null,
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 518400000).toISOString(),
  },
  // Index 7 - RIGHT (no image)
  {
    id: 'demo-note-8',
    user_id: 'demo-user-id',
    title: 'Meeting Notes',
    description: 'Q4 Planning Meeting\n\nKey points:\n• Revenue target: $2M\n• New product launch in November\n• Expand marketing team\n• Focus on customer retention',
    color: '#fce7f3',
    category_id: 'demo-cat-2',
    image_url: null,
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 'demo-note-9',
    user_id: 'demo-user-id',
    title: 'Book Recommendations',
    description: '📚 Currently Reading:\n• Atomic Habits - James Clear\n\n📖 To Read:\n• Deep Work - Cal Newport\n• The Psychology of Money\n• Thinking, Fast and Slow',
    color: '#fef3c7',
    category_id: 'demo-cat-3',
    image_url: null,
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 691200000).toISOString(),
    updated_at: new Date(Date.now() - 691200000).toISOString(),
  },
  {
    id: 'demo-note-10',
    user_id: 'demo-user-id',
    title: 'Gift Ideas',
    description: 'Birthday gifts for Mom:\n• Spa voucher\n• Flowers\n• Photo album\n• Cooking class subscription\n• Personalized jewelry',
    color: '#fce7f3',
    category_id: 'demo-cat-1',
    image_url: null,
    pinned: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 777600000).toISOString(),
    updated_at: new Date(Date.now() - 777600000).toISOString(),
  },
];

const INITIAL_DEMO_CATEGORIES: Category[] = [
  {
    id: 'demo-cat-1',
    user_id: 'demo-user-id',
    name: 'Personal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-2',
    user_id: 'demo-user-id',
    name: 'Work',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-3',
    user_id: 'demo-user-id',
    name: 'Ideas',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-4',
    user_id: 'demo-user-id',
    name: 'Travel',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

type NotesContextType = {
  notes: Note[];
  categories: Category[];
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
  createNote: (noteData: {
    title?: string | null;
    description: string;
    color?: string | null;
    category_id?: string | null;
    image_url?: string | null;
    pinned?: boolean;
  }) => Promise<{ data?: Note; error?: Error | null }>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<{ data?: Note; error?: Error | null }>;
  deleteNote: (id: string) => Promise<{ error?: Error | null }>;
  togglePin: (id: string) => Promise<{ data?: Note; error?: Error | null }>;
  getNote: (id: string) => Promise<{ data?: Note | null; error?: Error | null }>;
  createCategory: (name: string) => Promise<{ data?: Category; error?: Error | null }>;
  updateCategory: (id: string, name: string) => Promise<{ data?: Category; error?: Error | null }>;
  deleteCategory: (id: string) => Promise<{ error?: Error | null }>;
  searchNotes: (query: string) => Promise<Note[]>;
  getNoteCountByCategory: (categoryId: string) => number;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user, isDemoMode } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Demo mode: Load/save to AsyncStorage
  const loadDemoData = useCallback(async () => {
    try {
      // Check if demo data version has changed - if so, reset to fresh demo data
      const storedVersion = await AsyncStorage.getItem(DEMO_VERSION_KEY);
      const shouldReset = storedVersion !== DEMO_DATA_VERSION;

      if (shouldReset) {
        // Reset demo data to latest version
        await AsyncStorage.setItem(DEMO_VERSION_KEY, DEMO_DATA_VERSION);
        await AsyncStorage.setItem(DEMO_NOTES_KEY, JSON.stringify(INITIAL_DEMO_NOTES));
        await AsyncStorage.setItem(DEMO_CATEGORIES_KEY, JSON.stringify(INITIAL_DEMO_CATEGORIES));
        setNotes(INITIAL_DEMO_NOTES);
        setCategories(INITIAL_DEMO_CATEGORIES);
      } else {
        const storedNotes = await AsyncStorage.getItem(DEMO_NOTES_KEY);
        const storedCategories = await AsyncStorage.getItem(DEMO_CATEGORIES_KEY);

        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        } else {
          setNotes(INITIAL_DEMO_NOTES);
          await AsyncStorage.setItem(DEMO_NOTES_KEY, JSON.stringify(INITIAL_DEMO_NOTES));
        }

        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        } else {
          setCategories(INITIAL_DEMO_CATEGORIES);
          await AsyncStorage.setItem(DEMO_CATEGORIES_KEY, JSON.stringify(INITIAL_DEMO_CATEGORIES));
        }
      }
    } catch (e) {
      console.error('Error loading demo data:', e);
      setNotes(INITIAL_DEMO_NOTES);
      setCategories(INITIAL_DEMO_CATEGORIES);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  const saveDemoNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(DEMO_NOTES_KEY, JSON.stringify(newNotes));
    } catch (e) {
      console.error('Error saving demo notes:', e);
    }
  };

  const saveDemoCategories = async (newCategories: Category[]) => {
    try {
      await AsyncStorage.setItem(DEMO_CATEGORIES_KEY, JSON.stringify(newCategories));
    } catch (e) {
      console.error('Error saving demo categories:', e);
    }
  };

  const fetchNotes = useCallback(async () => {
    if (isDemoMode) {
      await loadDemoData();
      return;
    }

    if (!user) {
      setNotes([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  }, [user, isDemoMode, loadDemoData]);

  const fetchCategories = useCallback(async () => {
    if (isDemoMode) {
      // Already loaded in loadDemoData
      return;
    }

    if (!user) {
      setCategories([]);
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  }, [user, isDemoMode]);

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, [fetchNotes, fetchCategories]);

  const refresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchNotes(), fetchCategories()]);
  };

  const createNote = async (noteData: {
    title?: string | null;
    description: string;
    color?: string | null;
    category_id?: string | null;
    image_url?: string | null;
    pinned?: boolean;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Demo mode: create locally
    if (isDemoMode) {
      const newNote: Note = {
        id: `demo-note-${Date.now()}`,
        user_id: 'demo-user-id',
        title: noteData.title || null,
        description: noteData.description,
        color: noteData.color || null,
        category_id: noteData.category_id || null,
        image_url: noteData.image_url || null,
        pinned: noteData.pinned || false,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updatedNotes = newNote.pinned
        ? [newNote, ...notes]
        : [...notes.filter(n => n.pinned), newNote, ...notes.filter(n => !n.pinned)];

      setNotes(updatedNotes);
      await saveDemoNotes(updatedNotes);
      return { data: newNote, error: undefined };
    }

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        ...noteData,
      })
      .select()
      .single();

    if (!error && data) {
      // Add to beginning if pinned, otherwise after pinned notes
      if (data.pinned) {
        setNotes(prev => [data, ...prev]);
      } else {
        setNotes(prev => {
          const pinnedNotes = prev.filter(n => n.pinned);
          const unpinnedNotes = prev.filter(n => !n.pinned);
          return [...pinnedNotes, data, ...unpinnedNotes];
        });
      }
    }

    return { data: data || undefined, error };
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    // Demo mode: update locally
    if (isDemoMode) {
      const updatedNotes = notes.map(n => {
        if (n.id === id) {
          return { ...n, ...updates, updated_at: new Date().toISOString() };
        }
        return n;
      }).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setNotes(updatedNotes);
      await saveDemoNotes(updatedNotes);
      const updatedNote = updatedNotes.find(n => n.id === id);
      return { data: updatedNote, error: undefined };
    }

    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setNotes(prev => {
        const updated = prev.map(n => n.id === id ? data : n);
        // Re-sort by pinned status
        return updated.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      });
    }

    return { data: data || undefined, error };
  };

  const deleteNote = async (id: string) => {
    // Demo mode: delete locally
    if (isDemoMode) {
      const updatedNotes = notes.filter(n => n.id !== id);
      setNotes(updatedNotes);
      await saveDemoNotes(updatedNotes);
      return { error: undefined };
    }

    // Soft delete
    const { error } = await supabase
      .from('notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }

    return { error };
  };

  const togglePin = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return { error: new Error('Note not found') };

    return updateNote(id, { pinned: !note.pinned });
  };

  const getNote = async (id: string) => {
    // Demo mode: find locally
    if (isDemoMode) {
      const note = notes.find(n => n.id === id);
      return { data: note || null, error: note ? null : new Error('Note not found') };
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  };

  // Category functions
  const createCategory = async (name: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Demo mode: create locally
    if (isDemoMode) {
      const newCategory: Category = {
        id: `demo-cat-${Date.now()}`,
        user_id: 'demo-user-id',
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updatedCategories = [...categories, newCategory].sort((a, b) => a.name.localeCompare(b.name));
      setCategories(updatedCategories);
      await saveDemoCategories(updatedCategories);
      return { data: newCategory, error: undefined };
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: user.id, name })
      .select()
      .single();

    if (!error && data) {
      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    }

    return { data: data || undefined, error };
  };

  const updateCategory = async (id: string, name: string) => {
    // Demo mode: update locally
    if (isDemoMode) {
      const updatedCategories = categories
        .map(c => c.id === id ? { ...c, name, updated_at: new Date().toISOString() } : c)
        .sort((a, b) => a.name.localeCompare(b.name));
      setCategories(updatedCategories);
      await saveDemoCategories(updatedCategories);
      const updated = updatedCategories.find(c => c.id === id);
      return { data: updated, error: undefined };
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setCategories(prev => prev.map(c => c.id === id ? data : c).sort((a, b) => a.name.localeCompare(b.name)));
    }

    return { data: data || undefined, error };
  };

  const deleteCategory = async (id: string) => {
    // Demo mode: delete locally
    if (isDemoMode) {
      const updatedCategories = categories.filter(c => c.id !== id);
      setCategories(updatedCategories);
      await saveDemoCategories(updatedCategories);
      return { error: undefined };
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }

    return { error };
  };

  const searchNotes = async (query: string) => {
    if (!user || !query.trim()) return [];

    // Demo mode: search locally
    if (isDemoMode) {
      const lowerQuery = query.toLowerCase();
      return notes.filter(n =>
        (n.title?.toLowerCase().includes(lowerQuery)) ||
        (n.description?.toLowerCase().includes(lowerQuery))
      );
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching notes:', error);
      return [];
    }

    return data || [];
  };

  const getNoteCountByCategory = (categoryId: string) => {
    return notes.filter(n => n.category_id === categoryId).length;
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        categories,
        isLoading,
        isRefreshing,
        refresh,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
        getNote,
        createCategory,
        updateCategory,
        deleteCategory,
        searchNotes,
        getNoteCountByCategory,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
