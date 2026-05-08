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

    // --- Background Border ---
    doc.setDrawColor(34, 197, 94)
    doc.setLineWidth(2)
    doc.rect(10, 10, 277, 190) // Outer border
    doc.setLineWidth(0.5)
    doc.rect(12, 12, 273, 186) // Inner border

    // --- Title ---
    doc.setFontSize(40)
    doc.setTextColor(34, 197, 94)
    doc.setFont("helvetica", "bold")
    doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 50, { align: 'center' })

    // --- Subtitle ---
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    doc.text('This is proudly awarded to', 148.5, 75, { align: 'center' })

    // --- Name ---
    doc.setFontSize(35)
    doc.setTextColor(22, 163, 74)
    doc.setFont("times", "italic")
    doc.text(user?.name || 'Eco Champion', 148.5, 100, { align: 'center' })

    // --- Divider ---
    doc.setDrawColor(200, 200, 200)
    doc.line(80, 105, 217, 105)

    // --- Description ---
    doc.setFontSize(16)
    doc.setTextColor(80, 80, 80)
    doc.setFont("helvetica", "normal")
    const msg = `In recognition of reaching ${points} Eco Points and for your dedicated \nefforts toward reducing carbon emissions and promoting sustainability.`
    doc.text(msg, 148.5, 125, { align: 'center' })

    // --- Date & Seal Area ---
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 165)
    doc.text('Signature: EcoBot AI', 220, 165)

    // --- Seal ---
    doc.setDrawColor(34, 197, 94)
    doc.setFillColor(34, 197, 94)
    doc.circle(148.5, 170, 15, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text('ECO', 148.5, 169, { align: 'center' })
    doc.text('SEAL', 148.5, 174, { align: 'center' })

    doc.save(`Eco_Certificate_${user?.name}.pdf`)
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
