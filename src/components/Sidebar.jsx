import { NavLink } from 'react-router-dom'
import { Users, LayoutDashboard, DatabaseBackup } from 'lucide-react'

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
  },
  logo: {
    padding: '28px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoTitle: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoSub: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '4px',
    marginLeft: '34px',
  },
  nav: {
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  activeLink: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  footer: {
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
}

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoTitle}>
          <LayoutDashboard size={24} />
          Fine Sheet
        </div>
        <div style={styles.logoSub}>Xodimlar boshqaruvi</div>
      </div>
      <nav style={styles.nav}>
        <NavLink
          to="/employees"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          <Users size={20} />
          Xodimlar
        </NavLink>
        <NavLink
          to="/backup"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          <DatabaseBackup size={20} />
          Bek'ap
        </NavLink>
      </nav>
      <div style={styles.footer}>
        Fine Sheet v1.0
      </div>
    </aside>
  )
}
