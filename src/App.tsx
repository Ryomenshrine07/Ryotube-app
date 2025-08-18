import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Subscriptions from './pages/Subscriptions';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Search from './pages/Search';
import History from './pages/History';
import Shorts from './pages/Shorts';
import WatchLater from './pages/WatchLater';
import LikedVideos from './pages/LikedVideos';
import Downloads from './pages/Downloads';
import Login from './pages/Login';
import Upload from './pages/Upload';
import ChannelPage from './pages/ChannelPage';

function App() {
  const {isAuthenticated} = useAuth();
  useEffect( () => {

  },[isAuthenticated])
  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* // jff fntntb feditjnjnvrbtbbbbrfuehrbbbbbrbrbbfbrb */}
            <Route index element={<Home />} />
            <Route path="watch/:videoId" element={<Watch />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="search" element={<Search />} />
            <Route path="history" element={<History />} />
            <Route path="shorts" element={<Shorts />} />
            <Route path="watch-later" element={<WatchLater />} />
            <Route path="liked" element={<LikedVideos />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="upload" element={<Upload />} />
            <Route path="channel/:channelId" element={<ChannelPage/>}/>
          </Route>
        </Routes>
      </Router>

  );
}

export default App;