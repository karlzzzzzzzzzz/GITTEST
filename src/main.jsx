import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './index.css'
import Test from './pages/获取excle内容';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Test/> */}
    <BrowserRouter>
      <Routes>
        <Route path='/test' element={<Test/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
