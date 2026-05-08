import { useState, useEffect } from 'react'

function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setSupportsPWA(true)
      setPromptInstall(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const onClick = (evt) => {
    evt.preventDefault()
    if (promptInstall) {
      promptInstall.prompt()
    } else {
      alert("Installation is handled by your browser. On Chrome, look for the 'Install' icon in the address bar. On Safari/iPhone, use 'Add to Home Screen' in the Share menu.")
    }
  }

  return (
    <button className="pwa-install-btn" onClick={onClick} title="Install as Desktop/Mobile App">
      <i className="bi bi-download"></i> Install App
    </button>
  )
}

export default InstallPWA
