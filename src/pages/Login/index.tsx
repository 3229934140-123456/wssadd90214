import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store/useAppStore';
import { consultants } from '@/data/consultants';

export function Login() {
  const navigate = useNavigate();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入账号和密码');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user = consultants[0];
      setCurrentUser(user);
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 mb-6 shadow-lg shadow-primary-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-warm-gray-800 mb-2">
              医美线索接待台
            </h1>
            <p className="text-warm-gray-500">
              美团 · 新氧 线索统一管理平台
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-warm-gray-700 mb-1.5">
                账号
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-400" />
                <Input
                  type="text"
                  placeholder="请输入账号"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-gray-700 mb-1.5">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-warm-gray-300 rounded-lg bg-white placeholder-warm-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-warm-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-warm-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-warm-gray-600">记住我</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                忘记密码？
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登 录'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-warm-gray-50 rounded-lg">
            <p className="text-xs text-warm-gray-500 text-center">
              演示账号：主管账号 / 咨询师账号
              <br />
              密码：任意密码即可登录
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white" />
        </div>

        <div className="relative z-10 max-w-lg px-12 text-white">
          <h2 className="text-4xl font-serif font-bold mb-6 leading-tight">
            让每一条线索
            <br />
            都不被遗漏
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            美团与新氧线索统一接入，智能分配咨询师，
            标准化接待流程，数据化管理复盘，
            全面提升咨询转化率。
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="font-medium">统一线索池</p>
                <p className="text-white/70 text-sm">多平台线索汇聚，一目了然</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <p className="font-medium">智能分配</p>
                <p className="text-white/70 text-sm">按项目品类和时段自动分配</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <p className="font-medium">数据复盘</p>
                <p className="text-white/70 text-sm">质检评分，持续优化转化</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
