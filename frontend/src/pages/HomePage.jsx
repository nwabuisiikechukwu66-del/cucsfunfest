import Navbar from '../components/ui/Navbar.jsx'
import Hero from '../components/sections/Hero.jsx'
import About from '../components/sections/About.jsx'
import Schedule from '../components/sections/Schedule.jsx'
import Tickets from '../components/sections/Tickets.jsx'
import Features from '../components/sections/Features.jsx'
import Contact from '../components/sections/Contact.jsx'
import Footer from '../components/ui/Footer.jsx'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="divider" />
      <About />
      <div className="divider" />
      <Schedule />
      <div className="divider" />
      <Tickets />
      <div className="divider" />
      <Features />
      <div className="divider" />
      <Contact />
      <Footer />
    </>
  )
}
