import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Alert from '@/components/molecule/Alert'
import { RootNav } from './navigation/RootNav'
import { NotFound } from './pages/Others/NotFound'
import { AuthProvider } from './Provider/AuthContext'
import './theme/theme.css'
import { ThemeProvider } from './theme/ThemeContext'
import { persistor_list } from './utility/config'


const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  })

  return (
    <BrowserRouter>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: persister,
          dehydrateOptions: {
            shouldDehydrateQuery: query =>
              persistor_list.includes(query.queryKey[0] as string),
          },
        }}>
        <AuthProvider>
          <ThemeProvider>
            <RootNav />
            <Alert />
          </ThemeProvider>
        </AuthProvider>
      </PersistQueryClientProvider>
    </BrowserRouter>
  )
}
