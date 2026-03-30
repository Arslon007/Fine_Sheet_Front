import { useState, useEffect } from 'react'
import { backupApi } from '../services/api'
import { DatabaseBackup, Plus, RotateCcw, Trash2, Users, AlertTriangle, X } from 'lucide-react'
import toast from 'react-hot-toast'

const styles = {
  page: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e1b4b',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '8px',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
  },
  btnGreen: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '13px',
  },
  btnRed: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '13px',
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e1b4b',
    marginBottom: '6px',
  },
  cardDate: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
  },
  cardStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#6b7280',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af',
    fontSize: '15px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    width: '420px',
    maxWidth: '90vw',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e1b4b',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    marginBottom: '20px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  warning: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    background: '#fef3c7',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  warningText: {
    fontSize: '13px',
    color: '#92400e',
    lineHeight: '1.5',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  btnCancel: {
    background: '#f3f4f6',
    color: '#374151',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}

export default function BackupPage() {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(null)
  const [backupName, setBackupName] = useState('')

  const loadBackups = async () => {
    try {
      const res = await backupApi.getAll()
      setBackups(res.data)
    } catch {
      toast.error("Bek'aplarni yuklashda xatolik")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBackups() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await backupApi.save(backupName || null)
      toast.success("Bek'ap muvaffaqiyatli saqlandi!")
      setShowSaveModal(false)
      setBackupName('')
      loadBackups()
    } catch {
      toast.error("Bek'ap saqlashda xatolik")
    } finally {
      setSaving(false)
    }
  }

  const handleRestore = async (id) => {
    try {
      await backupApi.restore(id)
      toast.success("Ma'lumotlar muvaffaqiyatli tiklandi!")
      setShowRestoreModal(null)
    } catch {
      toast.error("Tiklashda xatolik yuz berdi")
    }
  }

  const handleDelete = async (id) => {
    try {
      await backupApi.delete(id)
      toast.success("Bek'ap o'chirildi")
      loadBackups()
    } catch {
      toast.error("O'chirishda xatolik")
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('uz-UZ', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>
            <DatabaseBackup size={28} />
            Bek'ap boshqaruvi
          </div>
          <div style={styles.subtitle}>
            Ma'lumotlarni bazada saqlash va tiklash
          </div>
        </div>
        <button
          style={{ ...styles.btn, ...styles.btnPrimary }}
          onClick={() => setShowSaveModal(true)}
        >
          <Plus size={18} />
          Bek'ap yaratish
        </button>
      </div>

      {loading ? (
        <div style={styles.empty}>Yuklanmoqda...</div>
      ) : backups.length === 0 ? (
        <div style={styles.empty}>
          <DatabaseBackup size={48} color="#d1d5db" />
          <div style={{ marginTop: '16px' }}>Hali bek'aplar yo'q</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            "Bek'ap yaratish" tugmasini bosib birinchi bek'apni saqlang
          </div>
        </div>
      ) : (
        backups.map((b) => (
          <div key={b.id} style={styles.card}>
            <div style={styles.cardInfo}>
              <div style={styles.cardName}>{b.name}</div>
              <div style={styles.cardDate}>{formatDate(b.createdAt)}</div>
              <div style={styles.cardStats}>
                <span style={styles.stat}>
                  <Users size={14} /> {b.employeeCount} xodim
                </span>
                <span style={styles.stat}>
                  🔴 {b.fineCount} jarima
                </span>
                <span style={styles.stat}>
                  🟢 {b.bonusCount} bonus
                </span>
              </div>
            </div>
            <div style={styles.cardActions}>
              <button
                style={{ ...styles.btn, ...styles.btnGreen }}
                onClick={() => setShowRestoreModal(b)}
                title="Tiklash"
              >
                <RotateCcw size={16} />
                Tiklash
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnRed }}
                onClick={() => handleDelete(b.id)}
                title="O'chirish"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div style={styles.modalOverlay} onClick={() => setShowSaveModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>
              Yangi bek'ap yaratish
              <X size={20} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setShowSaveModal(false)} />
            </div>
            <input
              style={styles.input}
              placeholder="Bek'ap nomi (ixtiyoriy)"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              autoFocus
            />
            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={() => setShowSaveModal(false)}>
                Bekor qilish
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary, ...(saving ? styles.btnDisabled : {}) }}
                onClick={handleSave}
                disabled={saving}
              >
                <Plus size={16} />
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div style={styles.modalOverlay} onClick={() => setShowRestoreModal(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>
              Bek'apni tiklash
              <X size={20} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setShowRestoreModal(null)} />
            </div>
            <div style={styles.warning}>
              <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={styles.warningText}>
                <strong>Diqqat!</strong> Tiklash joriy barcha ma'lumotlarni o'chirib,
                <strong> "{showRestoreModal.name}"</strong> bek'apidagi ma'lumotlar bilan almashtiradi.
              </div>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={() => setShowRestoreModal(null)}>
                Bekor qilish
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnGreen }}
                onClick={() => handleRestore(showRestoreModal.id)}
              >
                <RotateCcw size={16} />
                Tiklash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
