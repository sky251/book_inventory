import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Books from './Books'
import CreateBook from './CreateBook'
import UpdateBook from './UpdateBook';

const App = ()=>{
  return <>
  <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Books/>}></Route>
        <Route path='/create' element={<CreateBook/>}></Route>
        <Route path='/update/:id' element={<UpdateBook/>}></Route>
      </Routes>
    </BrowserRouter>
  </div>
  </>
}

export default App