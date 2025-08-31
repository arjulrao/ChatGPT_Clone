import './App.css'
import AppRoutes from './AppRoutes'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <>
      <ThemeToggle global={true} />
      <AppRoutes />
    </>
  )
}

export default App