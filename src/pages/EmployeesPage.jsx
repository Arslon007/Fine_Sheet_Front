import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Users, DollarSign, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { employeeApi } from '../services/api'
import Modal from '../components/Modal'

const positions = ['Developer', 'Designer', 'Manager', 'QA', 'HR', 'DevOps']

const s = {
  page: { maxWidth: '1200px', margin: '0 auto' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
  },
  title: { fontSize: '28px', fontWeight: '700', color: '#111827', letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: '#6b7280', marginTop: '4px' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(99,102,241,0.4)', transition: 'all 0.2s',
  },
  searchWrap: {
    position: 'relative', marginBottom: '24px',
  },
  searchIcon: {
    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px',
    border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none',
    background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s', boxSizing: 'border-box',
  },
  stats: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px', marginBottom: '24px',
  },
  statCard: {
    background: '#fff', borderRadius: '14px', padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #f3f4f6',
  },
  statLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#111827', marginTop: '4px' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6',
    cursor: 'pointer', transition: 'all 0.25s', position: 'relative',
    overflow: 'hidden',
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '16px',
  },
  avatar: {
    width: '48px', height: '48px', borderRadius: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: '700', fontSize: '18px',
  },
  badge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
    fontWeight: '600', background: '#eef2ff', color: '#4f46e5',
  },
  cardName: { fontSize: '17px', fontWeight: '600', color: '#111827', marginBottom: '4px' },
  cardPos: { fontSize: '13px', color: '#6b7280' },
  cardBottom: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6',
  },
  salary: { fontSize: '20px', fontWeight: '700', color: '#111827' },
  viewBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: '#f9fafb', border: '1px solid #e5e7eb', padding: '8px 16px',
    borderRadius: '10px', fontSize: '13px', fontWeight: '500', color: '#374151',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  formGroup: { marginBottom: '20px' },
  label: {
    display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid #d1d5db', fontSize: '15px', outline: 'none',
    transition: 'all 0.2s', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid #d1d5db', fontSize: '15px', outline: 'none',
    background: '#fff', cursor: 'pointer', boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff', border: 'none', padding: '14px', borderRadius: '12px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(99,102,241,0.4)', transition: 'all 0.2s',
  },
  empty: {
    textAlign: 'center', padding: '60px 20px', color: '#9ca3af',
  },
  emptyIcon: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px', color: '#9ca3af',
  },
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ fullName: '', position: 'Developer', salary: '' })
  const navigate = useNavigate()

  const fetchEmployees = async () => {
    try {
      const res = await employeeApi.getAll()
      setEmployees(res.data)
    } catch {
      toast.error("Xodimlarni yuklashda xatolik!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmployees() }, [])

  const filtered = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  )

  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName.trim() || !form.position || !form.salary) {
      toast.error("Barcha maydonlarni to'ldiring!")
      return
    }
    try {
      await employeeApi.create({ ...form, salary: parseFloat(form.salary) })
      toast.success("Xodim muvaffaqiyatli qo'shildi!")
      setShowModal(false)
      setForm({ fullName: '', position: 'Developer', salary: '' })
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data || "Xatolik yuz berdi!")
    }
  }

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #e5e7eb',
            borderTopColor: '#6366f1', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
          }} />
          Yuklanmoqda...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Xodimlar</h1>
          <p style={s.subtitle}>Barcha xodimlar ro'yxati va boshqaruvi</p>
        </div>
        <button
          style={s.addBtn}
          onClick={() => setShowModal(true)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.4)' }}
        >
          <Plus size={18} /> Yangi xodim
        </button>
      </div>

      <div style={s.stats}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Jami xodimlar</div>
          <div style={s.statValue}>{employees.length}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Jami oylik fondi</div>
          <div style={{ ...s.statValue, color: '#059669' }}>
            {totalSalary.toLocaleString()} so'm
          </div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Lavozimlar</div>
          <div style={s.statValue}>
            {new Set(employees.map(e => e.position)).size}
          </div>
        </div>
      </div>

      <div style={s.searchWrap}>
        <Search size={18} style={s.searchIcon} />
        <input
          style={s.searchInput}
          placeholder="Xodim qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
          onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)' }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>
            <Users size={28} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: '500', color: '#6b7280' }}>
            {search ? "Hech narsa topilmadi" : "Hali xodimlar yo'q"}
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
            {search ? "Boshqa so'z bilan qidirib ko'ring" : "Yangi xodim qo'shish uchun tugmani bosing"}
          </p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(emp => (
            <div
              key={emp.id}
              style={s.card}
              onClick={() => navigate(`/employees/${emp.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              <div style={s.cardTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={s.avatar}>{getInitials(emp.fullName)}</div>
                  <div>
                    <div style={s.cardName}>{emp.fullName}</div>
                    <div style={s.cardPos}>{emp.position}</div>
                  </div>
                </div>
                <span style={s.badge}>{emp.position}</span>
              </div>
              <div style={s.cardBottom}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Oylik maosh</div>
                  <div style={s.salary}>{emp.salary.toLocaleString()}</div>
                </div>
                <button
                  style={s.viewBtn}
                  onClick={(e) => { e.stopPropagation(); navigate(`/employees/${emp.id}`) }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4f46e5' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#374151' }}
                >
                  <Eye size={14} /> Batafsil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Yangi xodim qo'shish" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div style={s.formGroup}>
              <label style={s.label}>To'liq ism</label>
              <input
                style={s.input}
                placeholder="Ism familiya"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Lavozim</label>
              <select
                style={s.select}
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              >
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Oylik maosh</label>
              <input
                style={s.input}
                type="number"
                placeholder="0"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>
            <button
              type="submit"
              style={s.submitBtn}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Qo'shish
            </button>
          </form>
        </Modal>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
