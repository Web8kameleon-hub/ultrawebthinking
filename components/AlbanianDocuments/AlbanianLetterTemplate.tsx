'use client'

import React, { useState } from 'react'

interface LetterTemplate {
  id: string
  name: string
  category: 'business' | 'personal' | 'official' | 'academic'
  subject: string
  content: string
  closing: string
  formal: boolean
}

const letterTemplates: LetterTemplate[] = [
  {
    id: 'business_proposal',
    name: 'Propozim Biznesi',
    category: 'business',
    subject: 'Propozim për bashkëpunim biznesor',
    formal: true,
    content: `I/E nderuar/e [Emri i marrësit],

Me anë të kësaj letre dëshirojmë t'ju paraqesim propozimin tonë për bashkëpunim biznesor.

Kompania jonë, [Emri i kompanisë], vepron në fushën e [fusha e veprimtarisë] prej [numri i viteve] vitesh dhe ka arritur rezultate të shkëlqyera në tregun vendor dhe ndërkombëtar.

Jemi të interesuar të zhvillojmë një bashkëpunim afatgjatë me kompaninë tuaj në format të:
• [Pika e parë e bashkëpunimit]
• [Pika e dytë e bashkëpunimit]  
• [Pika e tretë e bashkëpunimit]

Përfitimet e këtij bashkëpunimi do të jenë të dyanshme:
- Për kompaninë tuaj: [përfitimet për ta]
- Për kompaninë tonë: [përfitimet për ju]

Jemi të gatshëm të diskutojmë detajet e këtij propozimi në një takim që mund të organizohet sipas disponibilitetit tuaj.

Faleminderit për kohën tuaj dhe presim me padurim përgjigjen tuaj.`,
    closing: 'Me respekt të plotë'
  },
  {
    id: 'complaint_letter',
    name: 'Letër Ankese',
    category: 'official',
    subject: 'Ankesë për [përshkrimi i problemit]',
    formal: true,
    content: `I/E nderuar/e [Pozicioni/Titulli],

Me anë të kësaj letre dëshiroj të paraqes një ankesë zyrtare në lidhje me [përmbledhjeje e shkurtër e problemit].

DETAJET E PROBLEMIT:

Data e ndodhjes: [data]
Vendi: [vendi]
Personat e përfshirë: [emrat]

PËRSHKRIMI I HOLLËSISHËM:
[Përshkrimi i detajuar i problemit që ka ndodhur, duke përfshirë të gjitha rrethanat relevante]

DOKUMENTET BASHKËLIDHUR:
• [Lista e dokumenteve]
• [Fature, kontrata, foto, etj.]

ZGJIDHJA E KËRKUAR:
[Çfarë kërkoni që të bëhet për të zgjidhur problemin]

Shpresoj që kjo çështje do të trajtohet me seriozitetin dhe urgjencën që meriton. Jam i/e gatshëm/e të jap çdo informacion shtesë që mund të jetë i nevojshëm.

Faleminderit për vëmendjen tuaj dhe pres një përgjigje të shpejtë.`,
    closing: 'Me konsideratë'
  },
  {
    id: 'job_application',
    name: 'Aplikim për Punë',
    category: 'business',
    subject: 'Aplikim për pozicionin [emri i pozicionit]',
    formal: true,
    content: `I/E nderuar/e,

Me anë të kësaj letre dëshiroj të shpreh interesimin tim për pozicionin e [emri i pozicionit] të publikuar në [burimi i publikimit] më datë [data].

ARSYET E APLIKIMIT:
Pse jam kandidati i përshtatshëm për këtë pozicion:
• [Arsyeja e parë - përvojë profesionale]
• [Arsyeja e dytë - aftësi të veçanta]
• [Arsyeja e tretë - motivim dhe qëllime]

PËRVOJAT PROFESIONALE:
• [Pozicioni i fundit] - [Kompania] ([Periudha])
• [Pozicioni i mëparshëm] - [Kompania] ([Periudha])
• [Arritje dhe rezultate të veçanta]

ARSIMIMI DHE KUALIFIKIMET:
• [Niveli i arsimimit] - [Institucioni] ([Viti])
• [Certifikime dhe kurse shtesë]
• [Gjuhë të huaja dhe niveli]

AFTËSITË KYÇE:
• [Aftësia e parë]
• [Aftësia e dytë]
• [Aftësia e tretë]

Jam i/e gatshëm/e të filloj punë [data e disponueshmërisë] dhe të diskutoj detajet e bashkëpunimit në një takim personal.

Bashkëlidhur do të gjeni CV-në time të plotë dhe dokumentet e nevojshme.`,
    closing: 'Me respekt të lartë'
  },
  {
    id: 'recommendation_letter',
    name: 'Letër Rekomandimi',
    category: 'academic',
    subject: 'Letër rekomandimi për [emri i personit]',
    formal: true,
    content: `I/E nderuar/e,

Shkruaj këtë letër për të dhënë një rekomandim të fortë për [Emri i personit], të cilin/cilën e njoh prej [periudha e njohjes] në cilësinë e [roli/pozicioni].

KUALITETET PROFESIONALE:
[Emri] ka treguar gjithmonë:
• Përkushtim të jashtëzakonshëm ndaj punës
• Aftësi të shkëlqyera organizative
• Integritet të lartë dhe etikë profesionale
• Aftësi për punë në grup dhe komunikim efektiv

ARRITJET E VEÇANTA:
Gjatë kohës që ka punuar [me mua/në institucionen tonë], [emri] ka arritur:
• [Arritja e parë specifike]
• [Arritja e dytë specifike]
• [Arritja e tretë specifike]

CILËSITË PERSONALE:
[Emri] karakterizohet nga:
• Besueshmëri dhe përgjegjshmëri e lartë
• Kreativitet dhe iniciativë personale
• Aftësi për të zgjidhur probleme komplekse
• Qëndrim pozitiv dhe motivues ndaj të tjerëve

REKOMANDIMI:
Pa asnjë dyshim, rekomandoj [emrin] për [pozicioni/programi/mundësia] që po aplikon. Jam i/e bindur/ë se do të jetë një shtesë e vlefshme për [organizatën/institucionin] tuaj.

Nëse keni nevojë për informacione shtesë, mos hezitoni të më kontaktoni.`,
    closing: 'Me respekt të sinqertë'
  },
  {
    id: 'invitation_letter',
    name: 'Letër Ftese',
    category: 'personal',
    subject: 'Ftesë për [eventi/rasti]',
    formal: false,
    content: `I/E dashur/e [Emri],

Të ftoj me kënaqësi të madhe në [eventi/rasti] që do të organizohet më [data] në [vendi].

DETAJET E EVENTIT:
• Data: [data e plotë]
• Ora: [ora e fillimit] - [ora e mbarimit]
• Vendi: [adresa e plotë]
• Rasti: [përshkrimi i rastit]

PROGRAMI:
• [Ora] - [Aktiviteti i parë]
• [Ora] - [Aktiviteti i dytë]
• [Ora] - [Aktiviteti i tretë]

Prania jote do të jetë një nder i veçantë për ne dhe do t'i shtojë gëzim kësaj dite të veçantë.

INFORMACIONE PRAKTIKE:
• Veshja: [kodi i veshjes]
• Parkimi: [informacione për parkimin]
• Kontakt: [numri i telefonit për emergjenca]

Të lutem konfirmo praninë tënde deri më [data e konfirmimit] në numrin [telefoni] ose emailin [emaili].

Shpresoj të të shoh së shpejti!`,
    closing: 'Me dashuri'
  },
  {
    id: 'condolence_letter',
    name: 'Letër Ngushëllimi',
    category: 'personal',
    subject: 'Ngushëllime të sinqerta',
    formal: false,
    content: `I/E dashur/e [Emri],

Me zemër të rënduar mora vesh lajmin e trishtë për [emri i të ndjarit/së ndjares]. Dua të shpreh ngushëllimet e mia më të sinqerta për ty dhe të gjithë familjen.

[Emri i të ndjarit/së ndjares] ishte një person i veçantë që la një mbresë të thellë tek të gjithë ata që e njihnin. [Ai/Ajo] do të mbahet mend për:
• [Cilësia e parë që do të mbahet mend]
• [Cilësia e dytë që do të mbahet mend]
• [Rrëfim i shkurtër personal nëse e njihnit]

Kujtimi i [tij/saj] do të jetë gjithmonë i gjallë në zemrat tona.

Në këto momente të vështira, dua që të dish se je në mendjet dhe lutjet tona. Nëse ka diçka që mund të bëj për të të ndihmuar gjatë kësaj periudhe të dhimbshme, mos hezito të më kontaktosh.

Zoti i dhëntë paqe shpirtit të [emri i të ndjarit/së ndjares] dhe forcë juve për të kaluar këto ditë të vështira.`,
    closing: 'Me ngushëllimet më të sinqerta'
  }
]

export const AlbanianLetterTemplate: React.FC = (): React.JSX.Element => {
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null)
  const [letterData, setLetterData] = useState({
    sender: {
      name: '',
      title: '',
      company: '',
      address: '',
      phone: '',
      email: ''
    },
    recipient: {
      name: '',
      title: '',
      company: '',
      address: ''
    },
    subject: '',
    content: '',
    closing: '',
    date: new Date().toLocaleDateString('sq-AL')
  })
  const [showPreview, setShowPreview] = useState(false)

  const handleTemplateSelect = (template: LetterTemplate) => {
    setSelectedTemplate(template)
    setLetterData(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content,
      closing: template.closing
    }))
  }

  const updateLetterData = (section: string, field: string, value: string) => {
    setLetterData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value
      }
    }))
  }

  const updateDirectField = (field: string, value: string) => {
    setLetterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const exportToPDF = () => {
    window.print()
  }

  const saveLetter = () => {
    const letterContent = {
      name: selectedTemplate?.name || 'Letër e Personalizuar',
      data: letterData,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(letterContent, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Leter_${letterContent.name.replace(/\s+/g, '_')}.json`
    a.click()
  }

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              ✉️ Shabllonet e Letrave Shqiptare
            </h1>
            <p className="text-xl text-gray-600">
              Zgjidhni një shablon për të krijuar letrën tuaj profesionale
            </p>
          </div>

          {/* Template Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(
              letterTemplates.reduce((acc, template) => {
                if (!acc[template.category]) acc[template.category] = []
                acc[template.category].push(template)
                return acc
              }, {} as { [key: string]: LetterTemplate[] })
            ).map(([category, templates]) => (
              <div key={category} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  {category === 'business' && '💼 Biznes'}
                  {category === 'personal' && '👤 Personale'}
                  {category === 'official' && '🏛️ Zyrtare'}
                  {category === 'academic' && '🎓 Akademike'}
                </h3>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left p-4 rounded-lg hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all"
                    >
                      <div className="font-medium text-sm mb-1">{template.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{template.subject}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${
                          template.formal 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {template.formal ? 'Formale' : 'Informale'}
                        </span>
                        <span className="text-blue-600 text-sm">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Letter Option */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">✏️</div>
            <h3 className="text-2xl font-bold mb-4">Krijoni Letër të Personalizuar</h3>
            <p className="text-gray-600 mb-6">
              Filloni nga një letër bosh dhe personalizojeni sipas nevojave tuaja
            </p>
            <button
              onClick={() => {
                setSelectedTemplate({
                  id: 'custom',
                  name: 'Letër e Personalizuar',
                  category: 'personal',
                  subject: '',
                  content: '',
                  closing: 'Me respekt',
                  formal: true
                })
                setLetterData(prev => ({
                  ...prev,
                  subject: '',
                  content: '',
                  closing: 'Me respekt'
                }))
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Filloni nga e Para
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-600 hover:text-blue-600"
            >
              ← Kthehu te shabllonet
            </button>
            <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {showPreview ? 'Ndrysho' : 'Shiko'}
            </button>
            <button
              onClick={saveLetter}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              💾 Ruaj
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {showPreview ? (
          // Preview Mode - Letter Format
          <div className="bg-white shadow-lg rounded-lg p-12 max-w-4xl mx-auto print:shadow-none print:max-w-none">
            {/* Sender Info */}
            <div className="text-right mb-8">
              <div className="font-bold">{letterData.sender.name}</div>
              {letterData.sender.title && <div>{letterData.sender.title}</div>}
              {letterData.sender.company && <div>{letterData.sender.company}</div>}
              {letterData.sender.address && <div className="whitespace-pre-line">{letterData.sender.address}</div>}
              <div className="mt-2">
                {letterData.sender.phone && <div>Tel: {letterData.sender.phone}</div>}
                {letterData.sender.email && <div>Email: {letterData.sender.email}</div>}
              </div>
            </div>

            {/* Date */}
            <div className="text-right mb-8">
              {letterData.date}
            </div>

            {/* Recipient Info */}
            <div className="mb-8">
              <div className="font-bold">{letterData.recipient.name}</div>
              {letterData.recipient.title && <div>{letterData.recipient.title}</div>}
              {letterData.recipient.company && <div>{letterData.recipient.company}</div>}
              {letterData.recipient.address && <div className="whitespace-pre-line">{letterData.recipient.address}</div>}
            </div>

            {/* Subject */}
            <div className="mb-6">
              <strong>LËNDA: {letterData.subject}</strong>
            </div>

            {/* Content */}
            <div className="mb-8 whitespace-pre-line leading-relaxed">
              {letterData.content}
            </div>

            {/* Closing */}
            <div className="text-right">
              <div className="mb-16">{letterData.closing},</div>
              <div className="border-b border-gray-400 w-48 ml-auto mb-2"></div>
              <div>{letterData.sender.name}</div>
              {letterData.sender.title && <div className="text-sm text-gray-600">{letterData.sender.title}</div>}
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-6">Të dhënat e Letrës</h3>
              
              <div className="space-y-6">
                {/* Sender Information */}
                <div>
                  <h4 className="font-medium mb-3 text-blue-700">Dërguesi</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
 placeholder="Emri dhe mbiemri"
                      value={letterData.sender.name}
                      onChange={(e) => updateLetterData('sender', 'name', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      type="text"
 placeholder="Pozicioni/Titulli"
                      value={letterData.sender.title}
                      onChange={(e) => updateLetterData('sender', 'title', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      type="text"
 placeholder="Kompania/Institucioni"
                      value={letterData.sender.company}
                      onChange={(e) => updateLetterData('sender', 'company', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <textarea
 placeholder="Adresa"
                      value={letterData.sender.address}
                      onChange={(e) => updateLetterData('sender', 'address', e.target.value)}
                      className="w-full p-3 border rounded-lg h-20 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="tel"
 placeholder="Telefoni"
                        value={letterData.sender.phone}
                        onChange={(e) => updateLetterData('sender', 'phone', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      />
                      <input
                        type="email"
 placeholder="Email"
                        value={letterData.sender.email}
                        onChange={(e) => updateLetterData('sender', 'email', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Information */}
                <div>
                  <h4 className="font-medium mb-3 text-red-700">Marrësi</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
 placeholder="Emri dhe mbiemri"
                      value={letterData.recipient.name}
                      onChange={(e) => updateLetterData('recipient', 'name', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      type="text"
 placeholder="Pozicioni/Titulli"
                      value={letterData.recipient.title}
                      onChange={(e) => updateLetterData('recipient', 'title', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      type="text"
 placeholder="Kompania/Institucioni"
                      value={letterData.recipient.company}
                      onChange={(e) => updateLetterData('recipient', 'company', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <textarea
 placeholder="Adresa"
                      value={letterData.recipient.address}
                      onChange={(e) => updateLetterData('recipient', 'address', e.target.value)}
                      className="w-full p-3 border rounded-lg h-20 resize-none"
                    />
                  </div>
                </div>

                {/* Letter Details */}
                <div>
                  <h4 className="font-medium mb-3 text-green-700">Detajet e Letrës</h4>
                  <div className="space-y-3">
                    <input
                      type="date"
                      value={new Date(letterData.date.split('/').reverse().join('-')).toISOString().split('T')[0]}
                      onChange={(e) => updateDirectField('date', new Date(e.target.value).toLocaleDateString('sq-AL'))}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      type="text"
 placeholder="Lënda e letrës"
                      value={letterData.subject}
                      onChange={(e) => updateDirectField('subject', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <select
                      value={letterData.closing}
                      onChange={(e) => updateDirectField('closing', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="Me respekt">Me respekt</option>
                      <option value="Me respekt të plotë">Me respekt të plotë</option>
                      <option value="Me konsideratë">Me konsideratë</option>
                      <option value="Me dashuri">Me dashuri</option>
                      <option value="Me respekt të sinqertë">Me respekt të sinqertë</option>
                      <option value="Me ngushëllimet më të sinqerta">Me ngushëllimet më të sinqerta</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-6">Përmbajtja e Letrës</h3>
              <textarea
                value={letterData.content}
                onChange={(e) => updateDirectField('content', e.target.value)}
                className="w-full h-96 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
 placeholder="Shkruani përmbajtjen e letrës këtu..."
                style={{ fontFamily: 'Times New Roman, serif', lineHeight: '1.6' }}
              />
              
              {/* Quick Insert Options */}
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Elemente të shpejta:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateDirectField('content', letterData.content + '\n\n[Emri i marrësit]')}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                  >
                    + Emri i marrësit
                  </button>
                  <button
                    onClick={() => updateDirectField('content', letterData.content + '\n\n[Data]')}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                  >
                    + Data
                  </button>
                  <button
                    onClick={() => updateDirectField('content', letterData.content + '\n\n[Kompania/Institucioni]')}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                  >
                    + Kompania
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlbanianLetterTemplate

