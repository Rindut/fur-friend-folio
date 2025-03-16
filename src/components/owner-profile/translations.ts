
export const getProfileTranslations = (language: 'en' | 'id') => {
  const translations = {
    en: {
      pageTitle: 'Owner Profile',
      pageDescription: 'Manage your personal information',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter your username',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      provinceLabel: 'Province',
      provinceSelect: 'Select your province',
      avatarLabel: 'Profile Photo',
      uploadButton: 'Upload Image',
      changeButton: 'Change Image',
      cancel: 'Cancel',
      save: 'Save Changes',
      success: 'Profile updated successfully',
      loading: 'Loading profile information...',
      emailLabel: 'Email Address'
    },
    id: {
      pageTitle: 'Profil Pemilik',
      pageDescription: 'Kelola informasi pribadi Anda',
      usernameLabel: 'Nama Pengguna',
      usernamePlaceholder: 'Masukkan nama pengguna Anda',
      fullNameLabel: 'Nama Lengkap',
      fullNamePlaceholder: 'Masukkan nama lengkap Anda',
      phoneLabel: 'Nomor Telepon',
      phonePlaceholder: 'Masukkan nomor telepon Anda',
      provinceLabel: 'Provinsi',
      provinceSelect: 'Pilih provinsi Anda',
      avatarLabel: 'Foto Profil',
      uploadButton: 'Unggah Gambar',
      changeButton: 'Ganti Gambar',
      cancel: 'Batal',
      save: 'Simpan Perubahan',
      success: 'Profil berhasil diperbarui',
      loading: 'Memuat informasi profil...',
      emailLabel: 'Alamat Email'
    }
  };
  
  return translations[language];
};
