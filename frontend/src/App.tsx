import { Routes, Route } from 'react-router-dom'
import Test2 from './pages/Test2'

function App() {
  return (
    <Routes>
      <Route path="/test2" element={<Test2 />} />
    </Routes>
  )
}

export default App
