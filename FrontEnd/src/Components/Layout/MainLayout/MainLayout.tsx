import Login from '../../Pages/Login/Login'
import MainRoute from '../../Routes/MainRoute/MainRoute'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import './MainLayout.css'

function MainLayout(): JSX.Element {
  return (
    <div className="MainLayout">
      <main>
        <Login />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default MainLayout
