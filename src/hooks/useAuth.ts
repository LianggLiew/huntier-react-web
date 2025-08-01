// Re-export the useAuth hook from AuthContext for convenience
// This follows the interface contract requirement for a separate useAuth hook

export { useAuth } from '@/contexts/AuthContext'

// Additional auth-related hooks can be added here if needed in the future