// src/components/Layout.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  HomeIcon,
  UsersIcon,
  WrenchIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Determinar si el usuario es gerente
  const isGerente = user?.rol === 'GERENTE';

  // Configuración de navegación dinámica
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Clientes', href: '/clientes', icon: UsersIcon, requiresRole: ['GERENTE'] },
    { name: 'Sierras', href: '/sierras', icon: WrenchIcon },
    { name: 'Historial', href: '/historial', icon: ClipboardDocumentListIcon },
    { name: 'Reportes', href: '/reportes', icon: ChartBarIcon, requiresRole: ['GERENTE'] },
    { name: 'Usuarios', href: '/usuarios', icon: UserGroupIcon, requiresRole: ['GERENTE'] }
  ].filter(item => !item.requiresRole || item.requiresRole.includes(user?.rol));

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar para móvil */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <img src="/austech-logo.png" alt="Austech Logo" className="h-8 w-auto" />
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                      } mr-3 h-6 w-6 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <img src="/austech-logo.png" alt="Austech Logo" className="h-8 w-auto" />
            </div>
          </div>
          
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                      } mr-3 h-6 w-6 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-gray-800 pl-1 pt-1 sm:pl-3 sm:pt-3">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-300 hover:text-gray-900 focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* User Menu */}
            <div className="ml-4 flex items-center md:ml-6">
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none">
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="h-8 w-8 text-gray-300" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{user?.nombre}</p>
                        <p className="text-xs text-gray-300">{user?.rol}</p>
                      </div>
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? 'bg-gray-600' : ''
                          } block px-4 py-2 text-sm text-gray-300 w-full text-left`}
                        >
                          Cerrar sesión
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}