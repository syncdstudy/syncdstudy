/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */

'use client';

import React, { useEffect, useState } from 'react';
import '@/app/globals.css';
import supabase from '@/lib/supabaseClient';

const MyProfilePage = () => {
  const [profile, setProfile] = useState<any>({});
  const [sessions, setSessions] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
      } else {
        if (user) {
          console.log('User ID (UUID):', user.id);
        } else {
          console.log('User is null');
        }
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error fetching user:', userError);
          return;
        }

        if (user) {
          setUser(user);
          setUserEmail(user.email || '');

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 is "no rows returned" which is expected for new users
            console.error('Error fetching profile:', profileError);
          }

          const { data: sessionData, error: sessionError } = await supabase
            .from('StudySession')
            .select('*')
            .eq('user_id', user.id);

          if (sessionError) {
            console.error('Error fetching sessions:', sessionError);
          }

          setProfile({
            ...profileData,
            email: user.email,
            headshot_url: profileData?.headshot_url ?? '',
          });

          setIsPublic(profileData?.public || false);
          if (sessionData) setSessions(sessionData);
        }
      } catch (err) {
        console.error('Unexpected error in fetchData:', err);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        console.error('Auth error:', authError);
        alert('Auth error: user not found.');
        return;
      }

      const profileData = {
        first_name: profile.first_name || null,
        last_name: profile.last_name || null,
        year: profile.year || null,
        phone: profile.phone || null,
        headshot_url: profile.headshot_url || null,
        public: isPublic,
      };

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' }); // ensures it targets auth.uid()

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        alert(`Failed to save profile: ${upsertError.message}`);
      } else {
        alert('Profile saved successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadHeadshot = async (file: File) => {
    if (!file || !user) {
      alert('No file or user found.');
      return;
    }

    setIsLoading(true);
    try {
      // Log the file name and size
      console.log('Selected file:', file.name, 'Size:', file.size);

      // Show preview immediately
      const localPreview = URL.createObjectURL(file);
      setProfile((prev: any) => ({ ...prev, headshot_url: localPreview }));

      // Build safe filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/headshot.${fileExt}`;
      console.log('Generated filename:', fileName);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('headshots')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert(`Upload failed: ${uploadError.message}`);
        return;
      }

      // Get the public URL
      const { data } = supabase.storage.from('headshots').getPublicUrl(fileName);
      const publicUrl = data?.publicUrl;
      if (!publicUrl) {
        alert('Could not retrieve public URL for the uploaded file.');
        return;
      }

      // Update profile state
      setProfile((prev: any) => ({ ...prev, headshot_url: publicUrl }));

      // Update just the headshot URL in the database
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ headshot_url: publicUrl })
        .eq('id', user.id);

      if (dbError) {
        console.error('DB error updating headshot:', dbError);
        alert(`Failed to save headshot: ${dbError.message}`);
      } else {
        alert('Headshot uploaded and profile updated!');
      }
    } catch (err) {
      console.error('Exception during upload:', err);
      alert(`An error occurred during upload: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container py-5">
      <h1 className="text-center mb-5">My Profile</h1>

      <div className="d-flex flex-column flex-lg-row align-items-start justify-content-center gap-5">
        <div className="info-box text-start" style={{ flex: '1', maxWidth: '500px' }}>
          <h4 className="text-center mb-3">Profile Info</h4>
          <div className="text-center mb-3">
            <div
              className="rounded-circle mb-2 mx-auto"
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: '#f0f0f0',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ccc',
              }}
            >
              {profile.headshot_url ? (
                <img
                  src={profile.headshot_url}
                  alt="Headshot"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#777' }}>Add Headshot</span>
              )}
            </div>

            <label htmlFor="headshotUpload" className="custom-button px-3 py-2" style={{ cursor: 'pointer' }}>
              Upload Photo
            </label>
            <input
              type="file"
              id="headshotUpload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadHeadshot(file);
                }
              }}
            />
          </div>

          <form>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="First Name:"
              value={profile.first_name || ''}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Last Name:"
              value={profile.last_name || ''}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            />
            <select
              className="form-control mb-3"
              value={profile.year || ''}
              onChange={(e) => setProfile({ ...profile, year: e.target.value })}
            >
              <option value="">Year:</option>
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
              <option>Graduate</option>
            </select>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="E-Mail:"
              value={userEmail}
              readOnly
            />
            <input
              type="tel"
              className="form-control mb-3"
              placeholder="Phone Number (optional):"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isPublic">Public Profile</label>
            </div>
          </form>

          <div className="text-end mt-4">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={async () => {
                if (!confirm('Are you sure you want to delete your profile?')) return;
                setIsLoading(true);

                try {
                  const { data: authData, error: authError } = await supabase.auth.getUser();
                  if (authError || !authData.user) {
                    alert('No user found');
                    return;
                  }

                  const { error } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('id', authData.user.id);

                  if (error) {
                    console.error('Delete error:', error);
                    alert(`Delete failed: ${error.message}`);
                  } else {
                    alert('Profile deleted!');
                    setProfile({});
                  }
                } catch (err) {
                  console.error('Exception during delete:', err);
                  alert(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              Delete Profile
            </button>
          </div>

          <button
            className="custom-button mt-3 w-100"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Session History */}
        <div className="info-box text-start" style={{ flex: '1', maxWidth: '500px' }}>
          <h4 className="text-center mb-3">Session History</h4>
          <ul>
            {sessions.length > 0 ? (
              sessions.map((s) => (
                <li key={s.id}>
                  {s.title}
                  {' '}
                  –
                  {new Date(s.date).toLocaleDateString()}
                </li>
              ))
            ) : (
              <p>No sessions yet.</p>
            )}
          </ul>

          <h5 className="mt-4">Achievements</h5>
          <ul>
            {sessions.length >= 5 && <li>🎖 Joined 5+ sessions</li>}
            {sessions.some((s) => s.role === 'sensei') && <li>🌟 Led a session as Sensei</li>}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default MyProfilePage;
