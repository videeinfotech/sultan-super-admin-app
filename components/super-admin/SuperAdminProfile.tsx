import React, { useState, useEffect } from 'react';
import { SuperAdminView } from '../../types.ts';
import { superAdminApi } from '../../api.ts';
import { useToast } from '../Toast.tsx';

interface Props {
  onLogout: () => void;
  onBack: () => void;
  onNavigate: (view: SuperAdminView) => void;
}

const SuperAdminProfile: React.FC<Props> = ({ onLogout, onBack, onNavigate }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Edit state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await superAdminApi.getUser();
      if (res.success) {
        setUser(res.data.user);
        setName(res.data.user.name);
        setPhone(res.data.user.phone || '');
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
      showToast('failed', 'Configuration Error: Could not retrieve administrative profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await superAdminApi.updateProfile({ name, phone });
      if (res.success) {
        setUser(res.data);
        showToast('success', 'Profile updated: Your administrative identity has been synchronized.');
        setEditing(false);
      }
    } catch (err: any) {
      showToast('failed', err.message || 'Operation Failed: Unable to synchronize profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setSaving(true);
    try {
      const res = await superAdminApi.updateAvatar(formData);
      if (res.success) {
        setUser({ ...user, avatar: res.data.avatar });
        showToast('success', 'Identity Updated: Your new profile photo has been synchronized.');
      }
    } catch (err: any) {
      showToast('failed', err.message || 'Identity Error: Unable to synchronize profile photo.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('failed', 'Security Alert: Password confirmation does not match the new password.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await superAdminApi.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      if (res.success) {
        showToast('success', 'Security Updated: Your administrative credentials have been changed successfully.');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      showToast('failed', err.message || 'Security Error: Unable to verify and update administrative credentials.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b dark:border-gray-800">
        <div className="size-10 flex items-center justify-center cursor-pointer" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
        <h2 className="text-lg font-bold flex-1 text-center">Profile & Settings</h2>
        {editing ? (
          <button
            onClick={handleUpdateProfile}
            disabled={saving}
            className="text-primary font-bold disabled:opacity-50"
          >
            {saving ? '...' : 'Save'}
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="text-primary font-bold">Edit</button>
        )}
      </header>

      <main className="pb-24">
        <div className="flex flex-col items-center p-6 gap-4">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input')?.click()}>
            <img
              src={user?.avatar || "https://picsum.photos/seed/admin_face/200/200"}
              className="size-28 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-sm object-cover"
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </div>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold">{user?.name}</p>
              <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-2 py-0.5 rounded-full">{user?.role || 'Super Admin'}</span>
            </div>
            <p className="text-[#616f89] text-sm">Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2023'}</p>
            <p
              className="text-primary text-sm font-semibold mt-2 cursor-pointer hover:underline"
              onClick={() => document.getElementById('avatar-input')?.click()}
            >
              Change Profile Photo
            </p>
          </div>
        </div>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider px-4 pb-2 pt-4 text-[#616f89]">Personal Information</h3>
          <div className="bg-white dark:bg-gray-900 border-y dark:border-gray-800 divide-y dark:divide-gray-800">
            <div className="px-4 py-3">
              <p className="text-[#616f89] text-[10px] uppercase font-bold">Full Name</p>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 bg-transparent border-none p-0 focus:ring-0 text-base"
                />
              ) : (
                <p className="mt-0.5">{user?.name}</p>
              )}
            </div>
            <div className="px-4 py-3">
              <p className="text-[#616f89] text-[10px] uppercase font-bold">Email Address</p>
              <p className="mt-0.5 text-gray-500">{user?.email}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[#616f89] text-[10px] uppercase font-bold">Phone Number</p>
              {editing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 bg-transparent border-none p-0 focus:ring-0 text-base"
                />
              ) : (
                <p className="mt-0.5">{user?.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider px-4 pb-2 pt-6 text-[#616f89]">Security</h3>
          <div className="bg-white dark:bg-gray-900 border-y dark:border-gray-800 divide-y dark:divide-gray-800">
            <div
              className="px-4 py-4 flex justify-between items-center cursor-pointer active:bg-gray-50 dark:active:bg-gray-800"
              onClick={() => setShowPasswordModal(true)}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#616f89]">lock</span>
                <span>Change Password</span>
              </div>
              <span className="material-symbols-outlined text-[#616f89]">chevron_right</span>
            </div>
            <div className="px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#616f89]">verified_user</span>
                <span>Two-Factor Authentication</span>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="size-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 px-4 flex flex-col items-center gap-4">
          <button
            onClick={onLogout}
            className="w-full bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 text-red-600 font-bold py-4 rounded-xl shadow-sm active:scale-[0.98] transition-all"
          >
            Logout
          </button>
          <p className="text-[#616f89] text-xs font-medium">Version 2.4.1 (Build 882)</p>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Change Password</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4" noValidate>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                >
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white dark:bg-gray-900 border-t border-[#dbdfe6] dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-20 pb-2">
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Overview</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('store-directory')}>
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stores</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('orders')}>
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Orders</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => onNavigate('profile')}>
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SuperAdminProfile;
