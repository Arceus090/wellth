import './App.css';

import Navbar from './components/navbar/Navbar';
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './components/home/home';
import Login from './components/login/login';
import Signup from './components/signup/Signup';
import Upload from './components/upload/Upload';
import ProfileDetail from './components/profileDetail/ProfileDetail';
import PostDetails from './components/postDetails/PostDetails';
import { useSelector } from 'react-redux';

function App() {
 const {user} = useSelector((state) => state.auth)

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
        <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
        <Route path='/upload' element={user ? <Upload /> : <Navigate to='/login' />} />
        <Route path='/profileDetail/:id' element={user ? <ProfileDetail /> : <Navigate to='/login' />} />
        <Route path='/postDetails/:id' element={user ? <PostDetails /> : <Navigate to='/login' />} />
      </Routes>
    
    </div>
  );
}

export default App;