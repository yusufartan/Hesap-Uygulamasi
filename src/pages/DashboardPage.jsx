import React from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard from '../features/dashboard/Dashboard'
import { menuItems } from '../utils/menuItems'

export default function DashboardPage() {
  const navigate = useNavigate()

  const handleNavigate = (id) => {
    const item = menuItems.find(i => i.id === id)
    if (item) {
      navigate(item.path)
    }
  }

  return <Dashboard onNavigate={handleNavigate} menuItems={menuItems} />
}