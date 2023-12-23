import './App.css';

import { BrowserRouter,Routes, Route, Navigate  } from 'react-router-dom';

// esse import mapeia se a authentificação foi feia com sucesso
import { onAuthStateChanged } from 'firebase/auth';

// hooks
import { useState, useEffect } from 'react';
import { useAuthentication } from './hooks/useAuthentication';

// context
import { AuthProvider } from './context/AuthContext';

// components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CreatePost from './pages/CreatePost/CreatePost';
import Dashboard from './pages/Dashboard/Dashboard';
import Search from './pages/search/Search';
import Post from './pages/post/Post';
import EditPost from './pages/EditPost/EditPost';


function App() {

  // nao tem usuario na sessao inicial
  const [user, setUser] = useState(undefined)
  const {auth} = useAuthentication()

  // eu atribuo o valor de loadingUser se user for undefined
  const loadingUser = user === undefined

  // sempre que mudar a authentificação, o valor aqui será alterado
  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

  }, [auth])


  if (loadingUser) {
    return <p>Carregando...</p>
  }


  return (
    <div className="App">
     <AuthProvider value={{ user }}>
      <BrowserRouter>
        <Navbar />
          <div className="container">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/dashboard'
                element={ user ? <Dashboard /> : <Navigate to="/login"/>}
              />
              <Route path='/about' element={<About />} />
              <Route path='/search' element={<Search />} />
              <Route path='/posts/:id' element={<Post />} />
              <Route path='/login'
                element={!user ? <Login/> : <Navigate to="/" />}
              />
              <Route path='/register'
                element={!user ? <Register /> : <Navigate to="/"/>}
              />
              <Route path='/posts/edit/:id'
                element={user ? <EditPost /> : <Navigate to={'/login'}/>}
              />
              <Route path='/posts/create'
                element={ user ? <CreatePost /> : <Navigate to="/login"/>}
              />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
     </AuthProvider>
    </div>
  );
}

export default App;
