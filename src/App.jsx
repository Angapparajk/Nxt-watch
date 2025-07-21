import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./components/Home'));
const Trending = lazy(() => import('./components/Trending'));
const Gaming = lazy(() => import('./components/Gaming'));
const SavedVideos = lazy(() => import('./components/SavedVideos'));
const VideoItemDetails = lazy(() => import('./components/VideoItemDetails'));
const Login = lazy(() => import('./components/login'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/gaming" element={<Gaming />} />
          <Route path="/saved-videos" element={<SavedVideos />} />
          <Route path="/videos/:id" element={<VideoItemDetails />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
