import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Upload, 
  Shuffle, 
  Layers, 
  Image, 
  Download, 
  BarChart3, 
  Settings,
  Users,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Zap
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import UploadInterface from './components/UploadInterface';
import TemplateMapping from './components/TemplateMapping';
import BulkProcessing from './components/BulkProcessing';
import ImageEnhancement from './components/ImageEnhancement';
import ExportCenter from './components/ExportCenter';
import Analytics from './components/Analytics';
import UserManagement from './components/UserManagement';
import AuthModal from './components/AuthModal';
import { useAuth, useUI } from './store/useStore';
import { authAPI } from './services/api';
import toast from 'react-hot-toast';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Smart Upload & AI Processing', icon: Upload },
  { id: 'mapping', label: 'Dynamic Template Mapping', icon: Shuffle },
  { id: 'bulk', label: 'Bulk Processing', icon: Layers },
  { id: 'images', label: 'Image Enhancement', icon: Image },
  { id: 'export', label: 'Export Center', icon: Download },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'users', label: 'User Management', icon: Users },
];

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { activeTab, sidebarOpen, loading, setActiveTab, setSidebarOpen, setLoading } = useUI();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('syndicate-ai-token');
      if (token && !isAuthenticated) {
        try {
          setLoading(true);
          const response = await authAPI.getCurrentUser();
          // This would update the store with user data
          console.log('User data:', response);
        } catch (error) {
          localStorage.removeItem('syndicate-ai-token');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, [isAuthenticated, setLoading]);

  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'upload': return <UploadInterface />;
      case 'mapping': return <TemplateMapping />;
      case 'bulk': return <BulkProcessing />;
      case 'images': return <ImageEnhancement />;
      case 'export': return <ExportCenter />;
      case 'analytics': return <Analytics />;
      case 'users': return <UserManagement />;
      default: return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <Zap className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Syndicate AI</h2>
          <p className="text-gray-600">Initializing intelligent catalog automation...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Syndicate AI</span>
                <p className="text-xs text-blue-100">Production Ready v1.0</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 px-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-200
                    ${activeTab === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-105'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {activeTab === item.id && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Status Indicator */}
          <div className="mx-4 mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">AI Engine Active</span>
            </div>
            <p className="text-xs text-green-600">Enhanced processing & real-time analytics online</p>
          </div>

          {/* User info in sidebar */}
          {user && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative">
                  <img 
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search SKUs, templates, attributes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-800">Production Ready</span>
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <div className="relative">
                    <img 
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face"
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {renderContent()}
          </main>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;