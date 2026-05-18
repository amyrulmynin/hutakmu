import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Debts from "./pages/Debts"
import NewDebt from "./pages/NewDebt"
import Borrowers from "./pages/Borrowers"
import NewBorrower from "./pages/NewBorrower"
import Approvals from "./pages/Approvals"
import Settings from "./pages/Settings"
import MyDebts from "./pages/MyDebts"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/debts" element={<Debts />} />
        <Route path="/dashboard/debts/new" element={<NewDebt />} />
        <Route path="/dashboard/borrowers" element={<Borrowers />} />
        <Route path="/dashboard/borrowers/new" element={<NewBorrower />} />
        <Route path="/dashboard/approvals" element={<Approvals />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/my-debts" element={<MyDebts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
