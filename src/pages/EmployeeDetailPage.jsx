import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, AlertTriangle, Gift, DollarSign, Calendar, TrendingDown, TrendingUp, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { employeeApi, fineApi, bonusApi, salaryApi } from '../services/api'
import Modal from '../components/Modal'

const s = {
  page: { maxWidth: '1100px', margin: '0 auto' },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'none', border: 'none', color: '#6366f1', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer', padding: '8px 0', marginBottom: '24px',
    transition: 'all 0.2s',
  },
  profileCard: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    borderRadius: '20px', padding: '32px', color: '#fff', marginBottom: '24px',
    position: 'relative', overflow: 'hidden',
  },
  profileGrid: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '24px',
  },
  profileLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  bigAvatar: {
    width: '72px', height: '72px', borderRadius: '18px',
    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '28px', fontWeight: '700',
  },
  profileName: { fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' },
  profilePos: { fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' },
  salaryBox: {
    textAlign: 'right',
  },
  salaryLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.6)' },
  salaryVal: { fontSize: '36px', fontWeight: '800', letterSpacing: '-1px' },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px', marginBottom: '32px',
  },
  statBox: {
    background: '#fff', borderRadius: '16px', padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6',
  },
  statIcon: {
    width: '40px', height: '40px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '12px',
  },
  statNum: { fontSize: '24px', fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: '13px', color: '#6b7280', marginTop: '2px' },
  section: { marginBottom: '32px' },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#111827' },
  addSmall: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', borderRadius: '10px', border: 'none',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
  },
  table: {
    width: '100%', background: '#fff', borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6',
    borderCollapse: 'separate', borderSpacing: 0, overflow: 'hidden',
  },
  th: {
    padding: '14px 20px', textAlign: 'left', fontSize: '12px',
    fontWeight: '600', color: '#6b7280', textTransform: 'uppercase',
    letterSpacing: '0.5px', background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '14px 20px', fontSize: '14px', color: '#374151',
    borderBottom: '1px solid #f3f4f6',
  },
  emptyRow: {
    textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px',
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
  textarea: {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid #d1d5db', fontSize: '15px', outline: 'none',
    resize: 'vertical', minHeight: '80px', fontFamily: 'inherit',
    transition: 'all 0.2s', boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%', border: 'none', padding: '14px', borderRadius: '12px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', color: '#fff',
    transition: 'all 0.2s',
  },
}

export default function EmployeeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [fines, setFines] = useState([])
  const [bonuses, setBonuses] = useState([])
  const [salaryInfo, setSalaryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFineModal, setShowFineModal] = useState(false)
  const [showBonusModal, setShowBonusModal] = useState(false)
  const [fineForm, setFineForm] = useState({ reason: '', amount: '' })
  const [bonusForm, setBonusForm] = useState({ reason: '', amount: '' })
  const [editingFine, setEditingFine] = useState(null)
  const [editingBonus, setEditingBonus] = useState(null)
  const [showEditFineModal, setShowEditFineModal] = useState(false)
  const [showEditBonusModal, setShowEditBonusModal] = useState(false)
  const [editFineForm, setEditFineForm] = useState({ reason: '', amount: '' })
  const [editBonusForm, setEditBonusForm] = useState({ reason: '', amount: '' })

  const fetchAll = async () => {
    try {
      const [empRes, finesRes, bonusesRes, salaryRes] = await Promise.all([
        employeeApi.getById(id),
        fineApi.getByEmployee(id),
        bonusApi.getByEmployee(id),
        salaryApi.calculate(id),
      ])
      setEmployee(empRes.data)
      setFines(finesRes.data)
      setBonuses(bonusesRes.data)
      setSalaryInfo(salaryRes.data)
    } catch {
      toast.error("Ma'lumotlarni yuklashda xatolik!")
      navigate('/employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [id])

  const handleAddFine = async (e) => {
    e.preventDefault()
    if (!fineForm.reason.trim() || !fineForm.amount) {
      toast.error("Barcha maydonlarni to'ldiring!")
      return
    }
    try {
      await fineApi.create({
        employeeId: parseInt(id),
        reason: fineForm.reason,
        amount: parseFloat(fineForm.amount),
      })
      toast.success("Jarima qo'shildi!")
      setShowFineModal(false)
      setFineForm({ reason: '', amount: '' })
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data || "Xatolik!")
    }
  }

  const handleAddBonus = async (e) => {
    e.preventDefault()
    if (!bonusForm.reason.trim() || !bonusForm.amount) {
      toast.error("Barcha maydonlarni to'ldiring!")
      return
    }
    try {
      await bonusApi.create({
        employeeId: parseInt(id),
        reason: bonusForm.reason,
        amount: parseFloat(bonusForm.amount),
      })
      toast.success("Bonus qo'shildi!")
      setShowBonusModal(false)
      setBonusForm({ reason: '', amount: '' })
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data || "Xatolik!")
    }
  }

  const openEditFine = (fine) => {
    setEditingFine(fine)
    setEditFineForm({ reason: fine.reason, amount: fine.amount.toString() })
    setShowEditFineModal(true)
  }

  const handleEditFine = async (e) => {
    e.preventDefault()
    if (!editFineForm.reason.trim() || !editFineForm.amount) {
      toast.error("Barcha maydonlarni to'ldiring!")
      return
    }
    try {
      await fineApi.update(editingFine.id, {
        reason: editFineForm.reason,
        amount: parseFloat(editFineForm.amount),
      })
      toast.success("Jarima yangilandi!")
      setShowEditFineModal(false)
      setEditingFine(null)
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik!")
    }
  }

  const handleDeleteFine = async (fineId) => {
    if (!window.confirm("Jarimani o'chirmoqchimisiz?")) return
    try {
      await fineApi.delete(fineId)
      toast.success("Jarima o'chirildi!")
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik!")
    }
  }

  const openEditBonus = (bonus) => {
    setEditingBonus(bonus)
    setEditBonusForm({ reason: bonus.reason, amount: bonus.amount.toString() })
    setShowEditBonusModal(true)
  }

  const handleEditBonus = async (e) => {
    e.preventDefault()
    if (!editBonusForm.reason.trim() || !editBonusForm.amount) {
      toast.error("Barcha maydonlarni to'ldiring!")
      return
    }
    try {
      await bonusApi.update(editingBonus.id, {
        reason: editBonusForm.reason,
        amount: parseFloat(editBonusForm.amount),
      })
      toast.success("Bonus yangilandi!")
      setShowEditBonusModal(false)
      setEditingBonus(null)
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik!")
    }
  }

  const handleDeleteBonus = async (bonusId) => {
    if (!window.confirm("Bonusni o'chirmoqchimisiz?")) return
    try {
      await bonusApi.delete(bonusId)
      toast.success("Bonus o'chirildi!")
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik!")
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
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

  if (!employee) return null

  return (
    <div style={s.page}>
      <button
        style={s.backBtn}
        onClick={() => navigate('/employees')}
        onMouseEnter={(e) => { e.currentTarget.style.gap = '12px' }}
        onMouseLeave={(e) => { e.currentTarget.style.gap = '8px' }}
      >
        <ArrowLeft size={18} /> Orqaga
      </button>

      <div style={s.profileCard}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={s.profileGrid}>
          <div style={s.profileLeft}>
            <div style={s.bigAvatar}>{getInitials(employee.fullName)}</div>
            <div>
              <div style={s.profileName}>{employee.fullName}</div>
              <div style={s.profilePos}>{employee.position}</div>
            </div>
          </div>
          <div style={s.salaryBox}>
            <div style={s.salaryLabel}>Yakuniy oylik</div>
            <div style={s.salaryVal}>
              {salaryInfo ? salaryInfo.finalSalary.toLocaleString() : employee.salary.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div style={s.statsRow}>
        <div style={s.statBox}>
          <div style={{ ...s.statIcon, background: '#eef2ff', color: '#6366f1' }}>
            <DollarSign size={20} />
          </div>
          <div style={s.statNum}>{employee.salary.toLocaleString()}</div>
          <div style={s.statLabel}>Asosiy oylik</div>
        </div>
        <div style={s.statBox}>
          <div style={{ ...s.statIcon, background: '#d1fae5', color: '#059669' }}>
            <TrendingUp size={20} />
          </div>
          <div style={{ ...s.statNum, color: '#059669' }}>
            +{salaryInfo ? salaryInfo.totalBonuses.toLocaleString() : 0}
          </div>
          <div style={s.statLabel}>Jami bonuslar</div>
        </div>
        <div style={s.statBox}>
          <div style={{ ...s.statIcon, background: '#fee2e2', color: '#dc2626' }}>
            <TrendingDown size={20} />
          </div>
          <div style={{ ...s.statNum, color: '#dc2626' }}>
            -{salaryInfo ? salaryInfo.totalFines.toLocaleString() : 0}
          </div>
          <div style={s.statLabel}>Jami jarimalar</div>
        </div>
        <div style={s.statBox}>
          <div style={{ ...s.statIcon, background: '#fef3c7', color: '#d97706' }}>
            <Calendar size={20} />
          </div>
          <div style={s.statNum}>{fines.length + bonuses.length}</div>
          <div style={s.statLabel}>Jami yozuvlar</div>
        </div>
      </div>

      {/* Jarimalar */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Jarimalar ({fines.length})</h2>
          <button
            style={{ ...s.addSmall, background: '#fee2e2', color: '#dc2626' }}
            onClick={() => setShowFineModal(true)}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2' }}
          >
            <Plus size={14} /> Jarima qo'shish
          </button>
        </div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Sabab</th>
              <th style={s.th}>Miqdor</th>
              <th style={s.th}>Sana</th>
              <th style={{ ...s.th, textAlign: 'center' }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {fines.length === 0 ? (
              <tr>
                <td colSpan={5} style={s.emptyRow}>Jarimalar yo'q</td>
              </tr>
            ) : fines.map((f, i) => (
              <tr key={f.id}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>{f.reason}</td>
                <td style={{ ...s.td, color: '#dc2626', fontWeight: '600' }}>
                  -{f.amount.toLocaleString()}
                </td>
                <td style={{ ...s.td, color: '#6b7280' }}>{formatDate(f.date)}</td>
                <td style={{ ...s.td, textAlign: 'center' }}>
                  <button
                    onClick={() => openEditFine(f)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.2s' }}
                    title="Tahrirlash"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteFine(f.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.2s' }}
                    title="O'chirish"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bonuslar */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Bonuslar ({bonuses.length})</h2>
          <button
            style={{ ...s.addSmall, background: '#d1fae5', color: '#059669' }}
            onClick={() => setShowBonusModal(true)}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#a7f3d0' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#d1fae5' }}
          >
            <Plus size={14} /> Bonus qo'shish
          </button>
        </div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Sabab</th>
              <th style={s.th}>Miqdor</th>
              <th style={s.th}>Sana</th>
              <th style={{ ...s.th, textAlign: 'center' }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {bonuses.length === 0 ? (
              <tr>
                <td colSpan={5} style={s.emptyRow}>Bonuslar yo'q</td>
              </tr>
            ) : bonuses.map((b, i) => (
              <tr key={b.id}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>{b.reason}</td>
                <td style={{ ...s.td, color: '#059669', fontWeight: '600' }}>
                  +{b.amount.toLocaleString()}
                </td>
                <td style={{ ...s.td, color: '#6b7280' }}>{formatDate(b.date)}</td>
                <td style={{ ...s.td, textAlign: 'center' }}>
                  <button
                    onClick={() => openEditBonus(b)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.2s' }}
                    title="Tahrirlash"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteBonus(b.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.2s' }}
                    title="O'chirish"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Jarima Modal */}
      {showFineModal && (
        <Modal title="Jarima qo'shish" onClose={() => setShowFineModal(false)}>
          <form onSubmit={handleAddFine}>
            <div style={s.formGroup}>
              <label style={s.label}>Sabab</label>
              <textarea
                style={s.textarea}
                placeholder="Jarima sababi..."
                value={fineForm.reason}
                onChange={(e) => setFineForm({ ...fineForm, reason: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = '#ef4444' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Miqdor</label>
              <input
                style={s.input}
                type="number"
                placeholder="0"
                value={fineForm.amount}
                onChange={(e) => setFineForm({ ...fineForm, amount: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = '#ef4444' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>
            <button
              type="submit"
              style={{ ...s.submitBtn, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 14px rgba(239,68,68,0.4)' }}
            >
              Jarima qo'shish
            </button>
          </form>
        </Modal>
      )}

      {/* Bonus Modal */}
      {showBonusModal && (
        <Modal title="Bonus qo'shish" onClose={() => setShowBonusModal(false)}>
          <form onSubmit={handleAddBonus}>
            <div style={s.formGroup}>
              <label style={s.label}>Sabab</label>
              <textarea
                style={s.textarea}
                placeholder="Bonus sababi..."
                value={bonusForm.reason}
                onChange={(e) => setBonusForm({ ...bonusForm, reason: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = '#10b981' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Miqdor</label>
              <input
                style={s.input}
                type="number"
                placeholder="0"
                value={bonusForm.amount}
                onChange={(e) => setBonusForm({ ...bonusForm, amount: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = '#10b981' }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
              />
            </div>
            <button
              type="submit"
              style={{ ...s.submitBtn, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}
            >
              Bonus qo'shish
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
