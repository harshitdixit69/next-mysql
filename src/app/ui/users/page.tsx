'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/solid';

type User = {
  id: number;
  name: string;
  email: string;
};

type ApiResponse = {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
};

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  const fetchUsers = async (page: number, searchTerm: string) => {
    // Encode search term to safely send in URL (if you want to extend search later)
    const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';

    const res = await fetch(`/api/users?page=${page}&limit=${limit}${searchQuery}`);
    if (!res.ok) {
      toast.error('Failed to fetch users');
      return;
    }
    const data: ApiResponse = await res.json();
    setUsers(data.users);
    setTotalPages(data.totalPages);
    setPage(data.page);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/users/${editingId}` : '/api/users';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      toast.success(editingId ? 'User updated' : 'User added');
      setName('');
      setEmail('');
      setEditingId(null);
      fetchUsers(page, search);
    } else {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('User deleted');
      // If deleting the last item on the last page, go back a page
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
        fetchUsers(page - 1, search);
      } else {
        fetchUsers(page, search);
      }
    } else {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setEditingId(user.id);
    toast('Editing user...');
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 px-4 py-6">
      <div className="max-w-5xl mx-auto relative">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-0 right-0 flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-sm shadow"
          aria-label="Toggle Dark Mode"
        >
          <SunIcon className="h-4 w-4 dark:hidden" />
          <MoonIcon className="h-4 w-4 hidden dark:inline" />
        </button>

        <h1 className="text-5xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 text-center">
          User Manager
        </h1>

        {/* Form Section */}
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1 on new search
          }}
          className="border px-4 py-2 rounded w-full md:w-1/3 mb-4 dark:bg-gray-700 dark:border-gray-600"
          aria-label="Search users"
        />

        {/* Users Table */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-indigo-50 dark:bg-gray-700 text-indigo-700 dark:text-indigo-200">
              <tr>
                <th className="px-6 py-3 font-medium">Avatar</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-6 py-4 text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr
                    key={user.id}
                    className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition border-t border-gray-100 dark:border-gray-600"
                  >
                    <td className="px-6 py-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3 flex gap-4">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        aria-label={`Edit user ${user.name}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        aria-label={`Delete user ${user.name}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
                }`}
                aria-current={page === i + 1 ? 'page' : undefined}
                aria-label={`Go to page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
