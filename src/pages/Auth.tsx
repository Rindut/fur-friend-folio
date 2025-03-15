
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PawPrint, Mail, Lock, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');

  const translations = {
    en: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      welcomeBack: 'Welcome back',
      signInDesc: 'Enter your credentials to access your account',
      createAccount: 'Create an account',
      signUpDesc: 'Enter your information to create an account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signInNow: 'Sign in now',
      signUpNow: 'Sign up now',
    },
    id: {
      signIn: 'Masuk',
      signUp: 'Daftar',
      email: 'Email',
      password: 'Kata Sandi',
      username: 'Nama Pengguna',
      welcomeBack: 'Selamat Datang Kembali',
      signInDesc: 'Masukkan kredensial Anda untuk mengakses akun Anda',
      createAccount: 'Buat akun',
      signUpDesc: 'Masukkan informasi Anda untuk membuat akun',
      alreadyHaveAccount: 'Sudah punya akun?',
      dontHaveAccount: 'Belum punya akun?',
      signInNow: 'Masuk sekarang',
      signUpNow: 'Daftar sekarang',
    }
  };

  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (!error) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signUp(signupEmail, signupPassword, signupUsername);
      if (!error) {
        setActiveTab('login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-140px)] px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-coral/20 p-2">
              <PawPrint className="h-6 w-6 text-coral" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">ANABULKU</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">{t.signIn}</TabsTrigger>
              <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader className="px-0 pt-0">
                <CardTitle>{t.welcomeBack}</CardTitle>
                <CardDescription>{t.signInDesc}</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="login-password">{t.password}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        className="pl-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : t.signIn}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                <p>
                  {t.dontHaveAccount}{' '}
                  <Button variant="link" className="p-0" onClick={() => setActiveTab('signup')}>
                    {t.signUpNow}
                  </Button>
                </p>
              </div>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <CardHeader className="px-0 pt-0">
                <CardTitle>{t.createAccount}</CardTitle>
                <CardDescription>{t.signUpDesc}</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-username">{t.username}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-username"
                        type="text"
                        className="pl-10"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">{t.password}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        className="pl-10"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : t.signUp}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                <p>
                  {t.alreadyHaveAccount}{' '}
                  <Button variant="link" className="p-0" onClick={() => setActiveTab('login')}>
                    {t.signInNow}
                  </Button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
