import { useContext } from 'react'
import { AuthContext, LanguageContext } from '../App'
import jsPDF from 'jspdf'

function CertificateDownload({ points }) {
  const { user } = useContext(AuthContext)
  const { t } = useContext(LanguageContext)

  const downloadCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const getBadgeName = (pts) => {
      if (pts >= 100) return 'Platinum Eco-Warrior'
      if (pts >= 50) return 'Gold Sustainability Champion'
      if (pts >= 20) return 'Silver Earth Defender'
      return 'Bronze Planet Saver'
    }

    const badgeName = getBadgeName(points)

    // --- Background Border ---
    doc.setDrawColor(34, 197, 94)
    doc.setLineWidth(3)
    doc.rect(10, 10, 277, 190) // Outer border
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.rect(13, 13, 271, 184) // Inner border

    // --- Title ---
    doc.setFontSize(36)
    doc.setTextColor(34, 197, 94)
    doc.setFont("helvetica", "bold")
    doc.text('ECOTRACK ACHIEVEMENT AWARD', 148.5, 45, { align: 'center' })

    // --- Subtitle ---
    doc.setFontSize(18)
    doc.setTextColor(80, 80, 80)
    doc.setFont("helvetica", "italic")
    doc.text('This officially certifies that', 148.5, 65, { align: 'center' })

    // --- Name ---
    doc.setFontSize(40)
    doc.setTextColor(22, 163, 74)
    doc.setFont("times", "bolditalic")
    doc.text(user?.name || 'Eco Champion', 148.5, 85, { align: 'center' })

    // --- Divider ---
    doc.setDrawColor(200, 200, 200)
    doc.line(90, 95, 207, 95)

    // --- Description ---
    doc.setFontSize(16)
    doc.setTextColor(60, 60, 60)
    doc.setFont("helvetica", "normal")
    const msg = `has successfully achieved the honorable rank of\n\n"${badgeName}"\n\nby accumulating ${points} Eco Points through outstanding dedication to\nmeasuring, reducing, and offsetting their carbon footprint.`
    doc.text(msg, 148.5, 115, { align: 'center' })

    // --- Date & Signatures Area ---
    doc.setTextColor(0, 0, 0)
    
    // Date (Left)
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    const formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    doc.text(formattedDate, 65, 160, { align: 'center' }) // Date above line
    doc.setDrawColor(150, 150, 150)
    doc.line(40, 162, 90, 162) // Line
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('DATE', 65, 168, { align: 'center' }) // Label below line
    
    // Signature (Right)
    doc.setFontSize(22)
    doc.setTextColor(34, 197, 94)
    doc.setFont("times", "italic")
    doc.text('EcoTrack AI', 232, 159, { align: 'center' }) // Signature above line
    doc.setDrawColor(150, 150, 150)
    doc.line(207, 162, 257, 162) // Line
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.setFont("helvetica", "normal")
    doc.text('AUTHORIZED SIGNATURE', 232, 168, { align: 'center' }) // Label below line

    // --- Seal ---
    doc.setDrawColor(34, 197, 94)
    doc.setFillColor(34, 197, 94)
    doc.circle(148.5, 170, 16, 'F')
    doc.setLineWidth(1)
    doc.setDrawColor(255, 255, 255)
    doc.circle(148.5, 170, 13, 'S') // inner white ring
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text('ECO', 148.5, 169, { align: 'center' })
    doc.text('SEAL', 148.5, 174, { align: 'center' })

    doc.save(`EcoTrack_Certificate_${user?.name || 'User'}.pdf`)
  }

  return (
    <button 
      onClick={downloadCertificate} 
      style={{ 
        background: 'linear-gradient(135deg, #10b981, #059669)', 
        color: 'white', 
        padding: '14px 24px', 
        borderRadius: '12px',
        fontWeight: '700',
        border: 'none',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
        marginTop: '10px'
      }}
    >
      🎓 Download Achievement Certificate
    </button>
  )
}

export default CertificateDownload
