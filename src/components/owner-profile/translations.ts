
export const getProfileTranslations = (language: 'en' | 'id') => {
  const translations = {
    en: {
      pageTitle: 'Owner Profile',
      pageDescription: 'Manage your personal information',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter your username',
      avatarLabel: 'Profile Photo',
      uploadButton: 'Upload Image',
      changeButton: 'Change Image',
      cancel: 'Cancel',
      save: 'Save Changes',
      success: 'Profile updated successfully',
      loading: 'Loading profile information...'
    },
    id: {
      pageTitle: 'Profil Pemilik',
      pageDescription: 'Kelola informasi pribadi Anda',
      usernameLabel: 'Nama Pengguna',
      usernamePlaceholder: 'Masukkan nama pengguna Anda',
      avatarLabel: 'Foto Profil',
      uploadButton: 'Unggah Gambar',
      changeButton: 'Ganti Gambar',
      cancel: 'Batal',
      save: 'Simpan Perubahan',
      success: 'Profil berhasil diperbarui',
      loading: 'Memuat informasi profil...'
    }
  };
  
  return translations[language];
};
