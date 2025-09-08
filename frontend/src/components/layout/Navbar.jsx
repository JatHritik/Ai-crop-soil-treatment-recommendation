import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  BarChart3, 
  FileText, 
  Users,
  Leaf
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText },
    ...(user?.role === 'ADMIN' ? [{ name: 'Admin', href: '/admin', icon: Users }] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div className="container-nature">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-nature rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-nature">Soil Analysis</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <div className="flex items-center space-x-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive(item.href)
                          ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300'
                          : 'text-ink-600 dark:text-surface-300 hover:text-ink-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === 'light' ? (
                <div className="w-5 h-5">🌙</div>
              ) : (
                <div className="w-5 h-5">☀️</div>
              )}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-sm text-ink-600 dark:text-surface-300">
                  Welcome, <span className="font-medium text-ink-900 dark:text-surface-100">{user?.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-ink-600 hover:text-ink-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-surface-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {isAuthenticated ? (
                  <>
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200',
                            isActive(item.href)
                              ? 'bg-accent-100 text-accent-700'
                              : 'text-ink-600 hover:text-ink-900 hover:bg-surface-100'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                    <div className="pt-4 border-t border-surface-200">
                      <div className="px-3 py-2 text-sm text-ink-600">
                        Logged in as <span className="font-medium text-ink-900">{user?.username}</span>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-ink-600 hover:text-ink-900"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export { Navbar }
