// TEMPORARY COMPONENT - Remove after logo selection

export default function LogoShowcase() {
  return (
    <div className="bg-yellow-50 border-y border-yellow-200 p-8">
      <h2 className="text-xl font-bold mb-6 text-center">Pick a Logo (1-50) - Creative Edition</h2>
      <div className="grid grid-cols-10 gap-6 max-w-7xl mx-auto">

        {/* Logo 1: Negative Space C with Z cutout */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M28 12 Q32 12 32 16 L32 24 Q32 28 28 28 L20 28 L20 24 L28 24 Q28 24 28 24 L28 16 Q28 16 28 16 L20 16 L20 12 Z" fill="white"/>
            <path d="M12 18 L18 18 L12 24 L18 24" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <span className="text-xs font-bold">1</span>
        </div>

        {/* Logo 2: Sleep Wave Pattern */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M8 20 Q14 12 20 20 T32 20" stroke="white" strokeWidth="3" fill="none"/>
            <path d="M8 26 Q14 20 20 26 T32 26" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
            <circle cx="32" cy="12" r="2" fill="white"/>
          </svg>
          <span className="text-xs font-bold">2</span>
        </div>

        {/* Logo 3: Layered Squares */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect x="4" y="4" width="32" height="32" rx="6" fill="#1e40af"/>
            <rect x="8" y="8" width="24" height="24" rx="4" fill="#2563EB"/>
            <rect x="12" y="12" width="16" height="16" rx="2" fill="#3b82f6"/>
            <text x="20" y="25" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
          </svg>
          <span className="text-xs font-bold">3</span>
        </div>

        {/* Logo 4: Circular Arrow (Control/Undo) */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M12 16 L12 10 L18 10 M12 10 Q12 10 14 12 Q18 16 22 16 Q28 16 28 22 Q28 28 22 28 Q18 28 16 26" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="text-xs font-bold">4</span>
        </div>

        {/* Logo 5: Interlocking CZ */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M24 12 Q28 12 28 16 L28 20 L24 20 L24 16 L18 16 L18 12 Z" fill="white"/>
            <path d="M16 28 Q12 28 12 24 L12 20 L16 20 L16 24 L22 24 L22 28 Z" fill="white"/>
            <rect x="16" y="18" width="8" height="4" fill="#3b82f6"/>
          </svg>
          <span className="text-xs font-bold">5</span>
        </div>

        {/* Logo 6: Moon + Z (Night Theme) */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#1e293b"/>
            <path d="M15 10 Q10 15 10 20 Q10 25 15 30 Q12 28 12 20 Q12 12 15 10" fill="#fbbf24"/>
            <path d="M24 14 L30 14 L24 20 L30 20" stroke="#fbbf24" strokeWidth="2" fill="none"/>
          </svg>
          <span className="text-xs font-bold">6</span>
        </div>

        {/* Logo 7: Geometric Spiral */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <rect x="10" y="10" width="20" height="20" fill="none" stroke="white" strokeWidth="2"/>
            <rect x="14" y="14" width="12" height="12" fill="none" stroke="white" strokeWidth="2"/>
            <rect x="18" y="18" width="4" height="4" fill="white"/>
          </svg>
          <span className="text-xs font-bold">7</span>
        </div>

        {/* Logo 8: Keyboard Shortcut Icon */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <rect x="6" y="10" width="12" height="8" rx="2" fill="white"/>
            <rect x="22" y="10" width="12" height="8" rx="2" fill="white"/>
            <text x="12" y="16" fontSize="6" fontWeight="bold" fill="#2563EB" textAnchor="middle">CTRL</text>
            <text x="28" y="16" fontSize="8" fontWeight="bold" fill="#2563EB" textAnchor="middle">Z</text>
            <text x="20" y="30" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">+</text>
          </svg>
          <span className="text-xs font-bold">8</span>
        </div>

        {/* Logo 9: Abstract Network */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <circle cx="12" cy="15" r="3" fill="white"/>
            <circle cx="28" cy="15" r="3" fill="white"/>
            <circle cx="20" cy="25" r="3" fill="white"/>
            <line x1="12" y1="15" x2="28" y2="15" stroke="white" strokeWidth="2"/>
            <line x1="12" y1="15" x2="20" y2="25" stroke="white" strokeWidth="2"/>
            <line x1="28" y1="15" x2="20" y2="25" stroke="white" strokeWidth="2"/>
          </svg>
          <span className="text-xs font-bold">9</span>
        </div>

        {/* Logo 10: Pixel Art Style */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" fill="#2563EB"/>
            <rect x="8" y="8" width="4" height="4" fill="white"/>
            <rect x="12" y="8" width="4" height="4" fill="white"/>
            <rect x="8" y="12" width="4" height="4" fill="white"/>
            <rect x="24" y="8" width="4" height="12" fill="white"/>
            <rect x="20" y="16" width="4" height="4" fill="white"/>
            <rect x="8" y="24" width="12" height="4" fill="white"/>
            <rect x="20" y="24" width="8" height="4" fill="white"/>
          </svg>
          <span className="text-xs font-bold">10</span>
        </div>

        {/* Logo 11: Ribbon Fold */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M8 12 L32 12 L28 20 L32 28 L8 28 L12 20 Z" fill="white"/>
            <path d="M12 20 L28 20" stroke="#2563EB" strokeWidth="2"/>
            <text x="20" y="23" fontSize="10" fontWeight="bold" fill="#2563EB" textAnchor="middle">CZ</text>
          </svg>
          <span className="text-xs font-bold">11</span>
        </div>

        {/* Logo 12: Infinity Loop */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M12 20 Q12 15 15 15 Q18 15 20 20 Q22 15 25 15 Q28 15 28 20 Q28 25 25 25 Q22 25 20 20 Q18 25 15 25 Q12 25 12 20" fill="white"/>
          </svg>
          <span className="text-xs font-bold">12</span>
        </div>

        {/* Logo 13: Origami Style */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M20 8 L32 20 L20 32 L8 20 Z" fill="#1e40af"/>
            <path d="M20 8 L32 20 L20 20 Z" fill="#3b82f6"/>
            <path d="M8 20 L20 32 L20 20 Z" fill="white"/>
          </svg>
          <span className="text-xs font-bold">13</span>
        </div>

        {/* Logo 14: Command Symbol */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M15 10 Q10 10 10 15 L10 17 L17 17 L17 10 L15 10 M25 10 L23 10 L23 17 L30 17 L30 15 Q30 10 25 10 M10 23 L10 25 Q10 30 15 30 L17 30 L17 23 L10 23 M23 23 L23 30 L25 30 Q30 30 30 25 L30 23 L23 23" fill="none" stroke="white" strokeWidth="2"/>
          </svg>
          <span className="text-xs font-bold">14</span>
        </div>

        {/* Logo 15: Circuit Board */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#1e293b"/>
            <circle cx="12" cy="12" r="3" fill="#10b981"/>
            <circle cx="28" cy="12" r="3" fill="#10b981"/>
            <circle cx="20" cy="28" r="3" fill="#10b981"/>
            <path d="M12 12 L12 20 L20 20 L20 28 M28 12 L28 20 L20 20" stroke="#10b981" strokeWidth="2" fill="none"/>
            <rect x="11" y="19" width="2" height="2" fill="#10b981"/>
            <rect x="19" y="19" width="2" height="2" fill="#10b981"/>
          </svg>
          <span className="text-xs font-bold">15</span>
        </div>

        {/* Logo 16: Paper Plane */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M10 20 L30 10 L22 20 L30 30 Z" fill="white"/>
            <path d="M22 20 L18 26" stroke="white" strokeWidth="2"/>
          </svg>
          <span className="text-xs font-bold">16</span>
        </div>

        {/* Logo 17: Soundwave */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <rect x="8" y="16" width="3" height="8" fill="white"/>
            <rect x="13" y="12" width="3" height="16" fill="white"/>
            <rect x="18" y="8" width="3" height="24" fill="white"/>
            <rect x="23" y="14" width="3" height="12" fill="white"/>
            <rect x="28" y="18" width="3" height="4" fill="white"/>
          </svg>
          <span className="text-xs font-bold">17</span>
        </div>

        {/* Logo 18: Compass */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <circle cx="20" cy="20" r="14" fill="none" stroke="white" strokeWidth="2"/>
            <path d="M20 8 L24 18 L20 20 L16 18 Z" fill="#ef4444"/>
            <path d="M20 32 L16 22 L20 20 L24 22 Z" fill="white"/>
          </svg>
          <span className="text-xs font-bold">18</span>
        </div>

        {/* Logo 19: Hourglass */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M14 10 L26 10 L22 20 L26 30 L14 30 L18 20 Z" fill="white"/>
            <path d="M18 23 L22 23 L20 26 Z" fill="#2563EB"/>
          </svg>
          <span className="text-xs font-bold">19</span>
        </div>

        {/* Logo 20: Target/Bullseye */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <circle cx="20" cy="20" r="14" fill="white"/>
            <circle cx="20" cy="20" r="9" fill="#2563EB"/>
            <circle cx="20" cy="20" r="4" fill="white"/>
          </svg>
          <span className="text-xs font-bold">20</span>
        </div>

        {/* Logo 21: Shield */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M20 8 L30 12 L30 20 Q30 28 20 32 Q10 28 10 20 L10 12 Z" fill="white"/>
            <text x="20" y="24" fontSize="12" fontWeight="bold" fill="#2563EB" textAnchor="middle">CZ</text>
          </svg>
          <span className="text-xs font-bold">21</span>
        </div>

        {/* Logo 22: Lightning Strike */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M24 6 L14 22 L20 22 L16 34 L28 16 L22 16 Z" fill="#fbbf24" stroke="#fff" strokeWidth="1"/>
          </svg>
          <span className="text-xs font-bold">22</span>
        </div>

        {/* Logo 23: Prism */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#1e293b"/>
            <path d="M8 28 L20 8 L32 28 Z" fill="none" stroke="white" strokeWidth="2"/>
            <path d="M20 8 L20 28" stroke="#3b82f6" strokeWidth="2"/>
            <path d="M20 28 L26 28" stroke="#ef4444" strokeWidth="2"/>
            <path d="M20 28 L24 28" stroke="#fbbf24" strokeWidth="2"/>
            <path d="M20 28 L22 28" stroke="#10b981" strokeWidth="2"/>
          </svg>
          <span className="text-xs font-bold">23</span>
        </div>

        {/* Logo 24: Cube 3D */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M20 10 L30 16 L30 26 L20 32 L10 26 L10 16 Z" fill="#3b82f6"/>
            <path d="M20 10 L30 16 L20 22 L10 16 Z" fill="#60a5fa"/>
            <path d="M20 22 L20 32 L30 26 L30 16 Z" fill="#1e40af"/>
            <path d="M10 16 L20 22 L20 32 L10 26 Z" fill="#2563EB"/>
          </svg>
          <span className="text-xs font-bold">24</span>
        </div>

        {/* Logo 25: Aperture */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <circle cx="20" cy="20" r="12" fill="none" stroke="white" strokeWidth="2"/>
            <path d="M20 8 L20 14 M32 20 L26 20 M20 32 L20 26 M8 20 L14 20" stroke="white" strokeWidth="2"/>
            <path d="M28 12 L24 16 M28 28 L24 24 M12 28 L16 24 M12 12 L16 16" stroke="white" strokeWidth="2"/>
          </svg>
          <span className="text-xs font-bold">25</span>
        </div>

        {/* Logo 26: Gate */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <rect x="6" y="10" width="28" height="3" rx="1" fill="white"/>
            <rect x="8" y="16" width="24" height="2" fill="white"/>
            <rect x="10" y="13" width="3" height="18" fill="white"/>
            <rect x="27" y="13" width="3" height="18" fill="white"/>
          </svg>
          <span className="text-xs font-bold">26</span>
        </div>

        {/* Logo 27: DNA Helix */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M12 10 Q20 15 28 10 M12 20 Q20 25 28 20 M12 30 Q20 35 28 30" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M28 10 Q20 15 12 10 M28 20 Q20 25 12 20 M28 30 Q20 35 12 30" stroke="#60a5fa" strokeWidth="2" fill="none"/>
          </svg>
          <span className="text-xs font-bold">27</span>
        </div>

        {/* Logo 28: Atom */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <circle cx="20" cy="20" r="3" fill="white"/>
            <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke="white" strokeWidth="2"/>
            <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke="white" strokeWidth="2"/>
          </svg>
          <span className="text-xs font-bold">28</span>
        </div>

        {/* Logo 29: Mountain Peak */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M6 30 L20 8 L34 30 Z" fill="white"/>
            <path d="M20 8 L14 18 L20 18 Z" fill="#60a5fa"/>
            <path d="M14 22 L6 30 L22 30 Z" fill="#1e40af"/>
          </svg>
          <span className="text-xs font-bold">29</span>
        </div>

        {/* Logo 30: Wifi Signal */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M8 16 Q20 8 32 16" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M12 20 Q20 14 28 20" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M16 24 Q20 20 24 24" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="20" cy="28" r="2" fill="white"/>
          </svg>
          <span className="text-xs font-bold">30</span>
        </div>

        {/* Logo 31: Rocket */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M20 6 L24 14 L30 16 L24 18 L20 26 L16 18 L10 16 L16 14 Z" fill="white"/>
            <circle cx="20" cy="16" r="3" fill="#2563EB"/>
            <path d="M14 26 L12 34 L16 28 M26 26 L28 34 L24 28" fill="#fbbf24"/>
          </svg>
          <span className="text-xs font-bold">31</span>
        </div>

        {/* Logo 32: Lock */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <rect x="13" y="18" width="14" height="12" rx="2" fill="white"/>
            <path d="M16 18 L16 14 Q16 10 20 10 Q24 10 24 14 L24 18" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="20" cy="24" r="2" fill="#2563EB"/>
          </svg>
          <span className="text-xs font-bold">32</span>
        </div>

        {/* Logo 33: Crown */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M8 24 L12 12 L20 18 L28 12 L32 24 Z" fill="#fbbf24"/>
            <rect x="8" y="24" width="24" height="4" fill="#fbbf24"/>
            <circle cx="12" cy="12" r="2" fill="white"/>
            <circle cx="20" cy="18" r="2" fill="white"/>
            <circle cx="28" cy="12" r="2" fill="white"/>
          </svg>
          <span className="text-xs font-bold">33</span>
        </div>

        {/* Logo 34: Tree */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M20 8 L12 16 L16 16 L10 22 L14 22 L8 30 L32 30 L26 22 L30 22 L24 16 L28 16 Z" fill="#10b981"/>
            <rect x="18" y="28" width="4" height="6" fill="#92400e"/>
          </svg>
          <span className="text-xs font-bold">34</span>
        </div>

        {/* Logo 35: Eye */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <ellipse cx="20" cy="20" rx="14" ry="8" fill="white"/>
            <circle cx="20" cy="20" r="6" fill="#2563EB"/>
            <circle cx="20" cy="20" r="3" fill="white"/>
          </svg>
          <span className="text-xs font-bold">35</span>
        </div>

        {/* Logo 36: Fingerprint */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M20 10 Q14 10 14 16 M20 12 Q16 12 16 16 M20 14 L20 26 M24 16 Q24 12 20 12 M26 16 Q26 10 20 10" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M14 20 Q14 26 20 30 M16 20 Q16 24 20 28 M24 20 Q24 24 20 28 M26 20 Q26 26 20 30" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span className="text-xs font-bold">36</span>
        </div>

        {/* Logo 37: Puzzle Piece */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M10 10 L18 10 L18 8 Q18 6 20 6 Q22 6 22 8 L22 10 L30 10 L30 18 L32 18 Q34 18 34 20 Q34 22 32 22 L30 22 L30 30 L10 30 Z" fill="white"/>
          </svg>
          <span className="text-xs font-bold">37</span>
        </div>

        {/* Logo 38: Bookmark */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M14 8 L26 8 L26 32 L20 26 L14 32 Z" fill="white"/>
            <path d="M14 8 L26 8 L26 18 L20 14 L14 18 Z" fill="#60a5fa"/>
          </svg>
          <span className="text-xs font-bold">38</span>
        </div>

        {/* Logo 39: Magnet */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M10 12 L10 20 Q10 28 18 28 L22 28 Q30 28 30 20 L30 12 L24 12 L24 20 Q24 22 22 22 L18 22 Q16 22 16 20 L16 12 Z" fill="white"/>
            <rect x="10" y="12" width="6" height="6" fill="#ef4444"/>
            <rect x="24" y="12" width="6" height="6" fill="#60a5fa"/>
          </svg>
          <span className="text-xs font-bold">39</span>
        </div>

        {/* Logo 40: Gear */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M20 8 L22 12 L26 10 L26 14 L30 16 L28 20 L30 24 L26 26 L26 30 L22 28 L20 32 L18 28 L14 30 L14 26 L10 24 L12 20 L10 16 L14 14 L14 10 L18 12 Z" fill="white"/>
            <circle cx="20" cy="20" r="6" fill="#2563EB"/>
          </svg>
          <span className="text-xs font-bold">40</span>
        </div>

        {/* Logo 41: Flame */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#1e293b"/>
            <path d="M20 6 Q14 14 14 20 Q14 26 20 30 Q26 26 26 20 Q26 14 20 6 Z" fill="#f97316"/>
            <path d="M20 12 Q18 16 18 20 Q18 23 20 26 Q22 23 22 20 Q22 16 20 12 Z" fill="#fbbf24"/>
          </svg>
          <span className="text-xs font-bold">41</span>
        </div>

        {/* Logo 42: Battery */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <rect x="8" y="14" width="22" height="12" rx="2" fill="white"/>
            <rect x="30" y="18" width="2" height="4" rx="1" fill="white"/>
            <rect x="10" y="16" width="5" height="8" fill="#10b981"/>
            <rect x="16" y="16" width="5" height="8" fill="#10b981"/>
          </svg>
          <span className="text-xs font-bold">42</span>
        </div>

        {/* Logo 43: Cloud */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M14 22 Q14 18 18 18 Q18 14 22 14 Q26 14 26 18 Q30 18 30 22 Q30 26 26 26 L14 26 Q10 26 10 22 Q10 18 14 18" fill="white"/>
          </svg>
          <span className="text-xs font-bold">43</span>
        </div>

        {/* Logo 44: Umbrella */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M8 18 Q8 10 20 10 Q32 10 32 18 L28 18 Q28 14 20 14 Q12 14 12 18 Z" fill="white"/>
            <rect x="19" y="18" width="2" height="12" fill="white"/>
            <path d="M19 30 Q19 32 21 32 Q23 32 23 30" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <span className="text-xs font-bold">44</span>
        </div>

        {/* Logo 45: Star */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M20 8 L23 17 L32 17 L25 23 L28 32 L20 26 L12 32 L15 23 L8 17 L17 17 Z" fill="#fbbf24"/>
          </svg>
          <span className="text-xs font-bold">45</span>
        </div>

        {/* Logo 46: Anchor */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <circle cx="20" cy="12" r="3" fill="white"/>
            <rect x="19" y="14" width="2" height="16" fill="white"/>
            <path d="M12 22 L12 28 Q12 30 14 30 L20 30 M28 22 L28 28 Q28 30 26 30 L20 30" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="14" y="18" width="12" height="2" fill="white"/>
          </svg>
          <span className="text-xs font-bold">46</span>
        </div>

        {/* Logo 47: Bell */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <path d="M20 8 L20 10 Q14 10 14 16 L14 22 L10 26 L30 26 L26 22 L26 16 Q26 10 20 10 L20 8" fill="white"/>
            <path d="M18 28 Q18 30 20 30 Q22 30 22 28" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <span className="text-xs font-bold">47</span>
        </div>

        {/* Logo 48: Heart Monitor */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M6 20 L12 20 L15 14 L18 26 L22 16 L25 20 L34 20" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <span className="text-xs font-bold">48</span>
        </div>

        {/* Logo 49: Scissors */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2563EB"/>
            <circle cx="12" cy="14" r="4" fill="white"/>
            <circle cx="12" cy="26" r="4" fill="white"/>
            <path d="M14 16 L28 26 M14 24 L28 14" stroke="white" strokeWidth="2"/>
            <circle cx="28" cy="20" r="2" fill="white"/>
          </svg>
          <span className="text-xs font-bold">49</span>
        </div>

        {/* Logo 50: Trophy */}
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#2563EB"/>
            <path d="M14 10 L14 16 Q14 20 20 20 Q26 20 26 16 L26 10 Z" fill="#fbbf24"/>
            <rect x="12" y="8" width="2" height="4" fill="#fbbf24"/>
            <rect x="26" y="8" width="2" height="4" fill="#fbbf24"/>
            <rect x="18" y="20" width="4" height="6" fill="#fbbf24"/>
            <rect x="14" y="26" width="12" height="2" fill="#fbbf24"/>
          </svg>
          <span className="text-xs font-bold">50</span>
        </div>

      </div>
    </div>
  )
}
