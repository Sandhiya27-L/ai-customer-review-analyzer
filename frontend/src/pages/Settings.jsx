import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMoon, FiSun, FiTrash2 } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { profileApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await profileApi.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await profileApi.deleteAccount();
      logout();
      toast.success('Account deleted');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold">Appearance</h2>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
              <span>Dark Mode</span>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`relative h-7 w-14 rounded-full transition ${darkMode ? 'bg-primary-600' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${darkMode ? 'left-7' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold">Change Password</h2>
          <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
            <input type="password" placeholder="Current password" className="input-field" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
            <input type="password" placeholder="New password" className="input-field" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
            <input type="password" placeholder="Confirm password" className="input-field" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <LoadingSpinner size="sm" /> : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="glass-card border-red-200 p-6 dark:border-red-900">
          <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
          <p className="mt-2 text-sm text-slate-500">Permanently delete your account and all associated data.</p>
          <button type="button" onClick={handleDeleteAccount} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30">
            <FiTrash2 /> Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
