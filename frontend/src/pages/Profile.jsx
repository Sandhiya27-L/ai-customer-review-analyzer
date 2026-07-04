import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { profileApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileApi.get()
      .then(({ data }) => {
        setProfile(data);
        setForm({ fullName: data.fullName, email: data.email });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await profileApi.update(form);
      setProfile(data);
      updateUser({ fullName: data.fullName, email: data.email });
      setEditMode(false);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

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
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Profile">
        <SkeletonLoader className="h-96" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Profile Information</h2>
            <button type="button" onClick={() => setEditMode(!editMode)} className="btn-secondary text-sm">
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name</label>
                <input className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <LoadingSpinner size="sm" /> : 'Save Changes'}
              </button>
            </form>
          ) : (
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-sm text-slate-500">Name</dt>
                <dd className="text-lg font-semibold">{profile.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Email</dt>
                <dd className="text-lg font-semibold">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Joined Date</dt>
                <dd className="text-lg font-semibold">{new Date(profile.joinedDate).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Total Analyses</dt>
                <dd className="text-lg font-semibold">{profile.totalAnalyses}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold">Change Password</h2>
          <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Current Password</label>
              <input type="password" className="input-field" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">New Password</label>
              <input type="password" className="input-field" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm Password</label>
              <input type="password" className="input-field" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <LoadingSpinner size="sm" /> : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
