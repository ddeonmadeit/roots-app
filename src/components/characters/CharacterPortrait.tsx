// Character portrait illustrations.
// Style: painterly cartoon — nearly-closed squinting eyes, prominent bulbous nose,
// puffy pushed-up cheeks, layered skin highlights. Each character is unique in
// features, hair/headwear, and clothing; the artistic style is shared.

interface PortraitProps { size?: number }

// ─── Shared style helpers ─────────────────────────────────────────────────────

// Base face: ellipse + forehead highlight + prominent nose + puffed cheeks + squint eyes
// Each character passes in their own skin tones, feature sizes, and specials.

// ── Nyogokuru — Grandma ──────────────────────────────────────────────────────
// Distinctive: white doek headwrap sitting high, smaller softer nose, warm closed smile
function NyogokuruPortrait({ size = 200 }: PortraitProps) {
  const h = Math.round(size * 1.2);
  return (
    <svg viewBox="0 0 200 240" width={size} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Blouse — amber stripe */}
      <path d="M14 240 L14 175 Q14 160 30 153 L64 144 Q100 150 136 144 L170 153 Q186 160 186 175 L186 240Z" fill="#C4782A"/>
      <path d="M28 172 L172 172" stroke="rgba(255,255,255,0.20)" strokeWidth="1.8"/>
      <path d="M28 188 L172 188" stroke="rgba(255,255,255,0.20)" strokeWidth="1.8"/>
      <path d="M28 204 L172 204" stroke="rgba(255,255,255,0.20)" strokeWidth="1.8"/>
      <path d="M72 144 L68 218" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8"/>
      <path d="M100 150 L96 218" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8"/>
      <path d="M128 144 L132 218" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8"/>

      {/* Ears */}
      <ellipse cx="30" cy="104" rx="13" ry="17" fill="#8B5C38"/>
      <ellipse cx="170" cy="104" rx="13" ry="17" fill="#8B5C38"/>
      <ellipse cx="34" cy="104" rx="7" ry="11" fill="#6E4428"/>
      <ellipse cx="166" cy="104" rx="7" ry="11" fill="#6E4428"/>

      {/* Head base */}
      <ellipse cx="100" cy="98" rx="70" ry="68" fill="#8B5C38"/>

      {/* Doek — white headwrap, the main identity feature */}
      {/* Wrap body covering top of head */}
      <path d="M34 84 Q38 30 100 24 Q162 30 166 84 Q144 50 100 46 Q56 50 34 84Z" fill="#F0E8D8"/>
      {/* Lower roll of doek */}
      <path d="M34 86 Q50 65 100 60 Q150 65 166 86 Q140 103 100 98 Q60 103 34 86Z" fill="#E0D4BE"/>
      {/* Front knot / gather detail */}
      <ellipse cx="100" cy="63" rx="20" ry="10" fill="#D4C4A8"/>
      <path d="M84 59 Q100 52 116 59" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none"/>
      <path d="M88 67 Q100 63 112 67" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none"/>

      {/* Forehead highlight — painterly, softer for grandma */}
      <ellipse cx="76" cy="76" rx="30" ry="20" fill="#B07848" opacity="0.38" transform="rotate(-18 76 76)"/>

      {/* Nose — prominent but slightly softer than grandpa */}
      <ellipse cx="100" cy="112" rx="18" ry="16" fill="#9E6440"/>
      <ellipse cx="93" cy="106" rx="8" ry="6" fill="#C07848" opacity="0.55"/>
      <circle cx="88" cy="121" r="7" fill="#6A3C20"/>
      <circle cx="112" cy="121" r="7" fill="#6A3C20"/>
      <ellipse cx="88" cy="122" rx="3.5" ry="3" fill="#3C1E0A"/>
      <ellipse cx="112" cy="122" rx="3.5" ry="3" fill="#3C1E0A"/>

      {/* Cheeks — prominent and puffed */}
      <ellipse cx="60" cy="116" rx="26" ry="22" fill="#A06438" opacity="0.36"/>
      <ellipse cx="140" cy="116" rx="26" ry="22" fill="#A06438" opacity="0.36"/>

      {/* Eyes — nearly closed squint, joyful */}
      <path d="M60 96 Q76 88 92 92" stroke="#2A1208" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M62 99 Q76 103 91 99" stroke="#3A2010" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M108 92 Q124 88 140 96" stroke="#2A1208" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M109 99 Q124 103 138 99" stroke="#3A2010" strokeWidth="1.6" strokeLinecap="round" fill="none"/>

      {/* Brows — arched, gentle */}
      <path d="M57 86 Q76 78 93 82" stroke="#4A2A10" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
      <path d="M107 82 Q124 78 143 86" stroke="#4A2A10" strokeWidth="2.8" strokeLinecap="round" fill="none"/>

      {/* Smile — warm and closed */}
      <path d="M72 132 Q100 148 128 132" stroke="#3A1A08" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Laugh lines */}
      <path d="M66 122 Q62 130 65 136" stroke="#6A3C20" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M134 122 Q138 130 135 136" stroke="#6A3C20" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5"/>

      {/* Chin shadow */}
      <ellipse cx="100" cy="155" rx="36" ry="12" fill="#6A3C20" opacity="0.20"/>

      {/* Gold earrings */}
      <circle cx="18" cy="110" r="6" fill="#C8A058"/>
      <circle cx="18" cy="110" r="3" fill="#E0C070"/>
      <circle cx="182" cy="110" r="6" fill="#C8A058"/>
      <circle cx="182" cy="110" r="3" fill="#E0C070"/>
    </svg>
  );
}

// ── Sekuru — Grandpa ─────────────────────────────────────────────────────────
// Distinctive: short white hair, red plaid shirt, suspenders, biggest grin & most prominent nose
// Most directly styled after the reference character
function SekuruPortrait({ size = 200 }: PortraitProps) {
  const h = Math.round(size * 1.2);
  return (
    <svg viewBox="0 0 200 240" width={size} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Red plaid shirt */}
      <path d="M8 240 L8 165 Q8 150 26 142 L58 132 Q100 138 142 132 L174 142 Q192 150 192 165 L192 240Z" fill="#B83030"/>
      {/* Plaid horizontal lines */}
      <path d="M8 162 L192 162" stroke="rgba(200,120,100,0.38)" strokeWidth="2.2"/>
      <path d="M8 178 L192 178" stroke="rgba(200,120,100,0.38)" strokeWidth="2.2"/>
      <path d="M8 194 L192 194" stroke="rgba(200,120,100,0.38)" strokeWidth="2.2"/>
      <path d="M8 210 L192 210" stroke="rgba(200,120,100,0.38)" strokeWidth="2.2"/>
      <path d="M8 226 L192 226" stroke="rgba(200,120,100,0.38)" strokeWidth="2.2"/>
      {/* Plaid vertical lines */}
      <path d="M48 132 L44 240" stroke="rgba(200,120,100,0.28)" strokeWidth="2.2"/>
      <path d="M78 132 L74 240" stroke="rgba(200,120,100,0.28)" strokeWidth="2.2"/>
      <path d="M100 138 L96 240" stroke="rgba(200,120,100,0.28)" strokeWidth="2.2"/>
      <path d="M122 132 L126 240" stroke="rgba(200,120,100,0.28)" strokeWidth="2.2"/>
      <path d="M152 132 L156 240" stroke="rgba(200,120,100,0.28)" strokeWidth="2.2"/>

      {/* Suspenders */}
      <path d="M68 132 L58 240" stroke="#A08448" strokeWidth="12" strokeLinecap="round"/>
      <path d="M132 132 L142 240" stroke="#A08448" strokeWidth="12" strokeLinecap="round"/>
      <path d="M68 132 L58 240" stroke="rgba(180,155,80,0.35)" strokeWidth="4" strokeLinecap="round"/>
      <path d="M132 132 L142 240" stroke="rgba(180,155,80,0.35)" strokeWidth="4" strokeLinecap="round"/>
      {/* Shirt button/collar */}
      <circle cx="100" cy="140" r="4.5" fill="#8A2020"/>
      <circle cx="100" cy="152" r="4" fill="#8A2020"/>

      {/* Ears */}
      <ellipse cx="26" cy="100" rx="15" ry="20" fill="#7A4020"/>
      <ellipse cx="174" cy="100" rx="15" ry="20" fill="#7A4020"/>
      <ellipse cx="30" cy="100" rx="8" ry="13" fill="#5C2E10"/>
      <ellipse cx="170" cy="100" rx="8" ry="13" fill="#5C2E10"/>

      {/* Head — round, wide at cheeks */}
      <ellipse cx="100" cy="88" rx="74" ry="72" fill="#7A4020"/>

      {/* Forehead highlight — strong, offset, painterly */}
      <ellipse cx="72" cy="62" rx="38" ry="26" fill="#C07038" opacity="0.42" transform="rotate(-22 72 62)"/>
      <ellipse cx="64" cy="56" rx="18" ry="12" fill="#D08848" opacity="0.30" transform="rotate(-22 64 56)"/>

      {/* Short white hair */}
      <path d="M32 72 Q36 22 100 16 Q164 22 168 72 Q146 38 100 34 Q54 38 32 72Z" fill="#DDD4C0"/>
      <path d="M46 60 Q68 36 100 32" stroke="rgba(190,182,162,0.50)" strokeWidth="2.5" fill="none"/>
      <path d="M154 60 Q132 36 100 32" stroke="rgba(190,182,162,0.50)" strokeWidth="2.5" fill="none"/>

      {/* Eyes — nearly closed, heavy upper lid, the most squinted of all characters */}
      <path d="M54 88 Q72 78 92 84" stroke="#1E0E06" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <path d="M56 93 Q72 97 90 93" stroke="#3A2010" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M108 84 Q128 78 146 88" stroke="#1E0E06" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <path d="M110 93 Q128 97 144 93" stroke="#3A2010" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Crow's feet */}
      <path d="M52 88 Q44 84 42 76" stroke="#5C2E10" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55"/>
      <path d="M148 88 Q156 84 158 76" stroke="#5C2E10" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55"/>

      {/* Brows — thick, expressive */}
      <path d="M52 78 Q72 68 92 73" stroke="#2A1208" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M108 73 Q128 68 148 78" stroke="#2A1208" strokeWidth="4" strokeLinecap="round" fill="none"/>

      {/* NOSE — largest and most dominant, directly from reference */}
      <ellipse cx="100" cy="113" rx="23" ry="21" fill="#9C5428"/>
      <ellipse cx="91" cy="106" rx="10" ry="8" fill="#C87038" opacity="0.58"/>
      <circle cx="84" cy="125" r="9.5" fill="#582C10"/>
      <circle cx="116" cy="125" r="9.5" fill="#582C10"/>
      <ellipse cx="84" cy="126" rx="4.5" ry="4" fill="#2E1006"/>
      <ellipse cx="116" cy="126" rx="4.5" ry="4" fill="#2E1006"/>

      {/* Cheeks — maximum puff, pushed up hard against eye line */}
      <ellipse cx="56" cy="120" rx="30" ry="26" fill="#9C5428" opacity="0.40"/>
      <ellipse cx="144" cy="120" rx="30" ry="26" fill="#9C5428" opacity="0.40"/>
      <ellipse cx="48" cy="114" rx="16" ry="14" fill="#C07840" opacity="0.24"/>
      <ellipse cx="152" cy="114" rx="16" ry="14" fill="#C07840" opacity="0.24"/>

      {/* Huge grin — widest smile of all characters */}
      <path d="M62 138 Q100 162 138 138" stroke="#2E1006" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* White stubble hint */}
      <ellipse cx="100" cy="152" rx="30" ry="10" fill="rgba(220,210,195,0.22)"/>
      {/* Chin roundness */}
      <ellipse cx="100" cy="158" rx="42" ry="16" fill="#5C2E10" opacity="0.20"/>
    </svg>
  );
}

// ── Senge — Aunty ─────────────────────────────────────────────────────────────
// Distinctive: tall teal headwrap with yellow band, big open-hearted grin, yellow drop earrings
function SengePortrait({ size = 200 }: PortraitProps) {
  const h = Math.round(size * 1.2);
  return (
    <svg viewBox="0 0 200 240" width={size} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Teal blouse */}
      <path d="M14 240 L14 172 Q14 157 30 150 L62 142 Q100 148 138 142 L170 150 Q186 157 186 172 L186 240Z" fill="#3A7A6A"/>
      <path d="M28 170 L172 170" stroke="rgba(255,220,80,0.28)" strokeWidth="1.8"/>
      <path d="M28 186 L172 186" stroke="rgba(255,220,80,0.28)" strokeWidth="1.8"/>
      <path d="M28 202 L172 202" stroke="rgba(255,220,80,0.28)" strokeWidth="1.8"/>
      <path d="M68 142 L64 216" stroke="rgba(255,220,80,0.18)" strokeWidth="1.8"/>
      <path d="M100 148 L96 216" stroke="rgba(255,220,80,0.18)" strokeWidth="1.8"/>
      <path d="M132 142 L136 216" stroke="rgba(255,220,80,0.18)" strokeWidth="1.8"/>

      {/* Ears */}
      <ellipse cx="28" cy="106" rx="14" ry="18" fill="#9B6A42"/>
      <ellipse cx="172" cy="106" rx="14" ry="18" fill="#9B6A42"/>
      <ellipse cx="32" cy="106" rx="7" ry="11" fill="#784E2E"/>
      <ellipse cx="168" cy="106" rx="7" ry="11" fill="#784E2E"/>

      {/* Head */}
      <ellipse cx="100" cy="102" rx="70" ry="67" fill="#9B6A42"/>

      {/* Forehead highlight */}
      <ellipse cx="76" cy="78" rx="32" ry="22" fill="#C08450" opacity="0.38" transform="rotate(-18 76 78)"/>

      {/* Tall teal headwrap */}
      <path d="M34 90 Q38 36 100 30 Q162 36 166 90 Q142 54 100 50 Q58 54 34 90Z" fill="#3A7A6A"/>
      {/* Wrap upper portion */}
      <path d="M38 88 Q54 62 100 56 Q146 62 162 88 Q136 106 100 100 Q64 106 38 88Z" fill="#2A6058"/>
      {/* Yellow band across wrap */}
      <path d="M40 80 Q100 68 160 80" stroke="#E8C840" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M44 74 Q100 64 156 74" stroke="rgba(240,200,60,0.30)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Wrap knot/twist at top */}
      <ellipse cx="100" cy="44" rx="18" ry="12" fill="#4A8A7A"/>
      <path d="M86 40 Q100 34 114 40" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none"/>

      {/* Nose — prominent, medium size */}
      <ellipse cx="100" cy="114" rx="19" ry="17" fill="#AE7248"/>
      <ellipse cx="92" cy="107" rx="8" ry="6.5" fill="#D09060" opacity="0.52"/>
      <circle cx="86" cy="124" r="7.5" fill="#7A4828"/>
      <circle cx="114" cy="124" r="7.5" fill="#7A4828"/>
      <ellipse cx="86" cy="125" rx="3.5" ry="3" fill="#3C1E0A"/>
      <ellipse cx="114" cy="125" rx="3.5" ry="3" fill="#3C1E0A"/>

      {/* Cheeks — very prominent, wide grin pushes them up */}
      <ellipse cx="58" cy="120" rx="28" ry="24" fill="#AE7248" opacity="0.38"/>
      <ellipse cx="142" cy="120" rx="28" ry="24" fill="#AE7248" opacity="0.38"/>

      {/* Eyes — squinting with big smile energy */}
      <path d="M58 100 Q76 91 92 95" stroke="#2A1208" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M60 103 Q76 107 91 103" stroke="#3A2010" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M108 95 Q124 91 142 100" stroke="#2A1208" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M109 103 Q124 107 140 103" stroke="#3A2010" strokeWidth="1.6" strokeLinecap="round" fill="none"/>

      {/* Brows */}
      <path d="M56 90 Q76 81 93 86" stroke="#3A2010" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M107 86 Q124 81 144 90" stroke="#3A2010" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Wide, warmest smile — most open */}
      <path d="M66 134 Q100 156 134 134" stroke="#3A1A08" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

      {/* Yellow drop earrings */}
      <circle cx="15" cy="112" r="5.5" fill="#E8C840"/>
      <line x1="15" y1="118" x2="15" y2="128" stroke="#C8A830" strokeWidth="2.5"/>
      <circle cx="15" cy="131" r="5" fill="#E8C840"/>
      <circle cx="185" cy="112" r="5.5" fill="#E8C840"/>
      <line x1="185" y1="118" x2="185" y2="128" stroke="#C8A830" strokeWidth="2.5"/>
      <circle cx="185" cy="131" r="5" fill="#E8C840"/>

      {/* Chin shadow */}
      <ellipse cx="100" cy="160" rx="38" ry="12" fill="#784E2E" opacity="0.18"/>
    </svg>
  );
}

// ── Rwasibo — Uncle ───────────────────────────────────────────────────────────
// Distinctive: short neat dark hair, navy shirt, broader build, steady calm smile
function RwasiboPortrait({ size = 200 }: PortraitProps) {
  const h = Math.round(size * 1.2);
  return (
    <svg viewBox="0 0 200 240" width={size} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Navy shirt — broader body */}
      <path d="M4 240 L4 160 Q4 145 24 137 L56 126 Q100 132 144 126 L176 137 Q196 145 196 160 L196 240Z" fill="#2A4A7A"/>
      {/* Collar detail */}
      <path d="M82 126 L100 140 L118 126 L110 120 L100 132 L90 120Z" fill="#1A3660"/>
      <path d="M82 126 L100 140" stroke="#3A5A8A" strokeWidth="1" fill="none"/>
      <path d="M100 140 L118 126" stroke="#3A5A8A" strokeWidth="1" fill="none"/>
      <path d="M20 165 L180 165" stroke="rgba(60,90,130,0.40)" strokeWidth="1.5"/>
      <path d="M12 182 L188 182" stroke="rgba(60,90,130,0.40)" strokeWidth="1.5"/>

      {/* Ears — slightly larger, suits the broader face */}
      <ellipse cx="24" cy="98" rx="16" ry="21" fill="#6A3C20"/>
      <ellipse cx="176" cy="98" rx="16" ry="21" fill="#6A3C20"/>
      <ellipse cx="28" cy="98" rx="8" ry="13" fill="#4E2C14"/>
      <ellipse cx="172" cy="98" rx="8" ry="13" fill="#4E2C14"/>

      {/* Head — wider/broader than other characters */}
      <ellipse cx="100" cy="88" rx="76" ry="72" fill="#6A3C20"/>

      {/* Forehead highlight */}
      <ellipse cx="74" cy="64" rx="36" ry="24" fill="#9A5A30" opacity="0.40" transform="rotate(-20 74 64)"/>

      {/* Short neat dark hair */}
      <path d="M28 68 Q32 20 100 14 Q168 20 172 68 Q150 34 100 30 Q50 34 28 68Z" fill="#1E0E06"/>
      {/* Hair fade at sides — slightly lighter */}
      <path d="M28 68 Q26 80 28 92" stroke="#2A1208" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M172 68 Q174 80 172 92" stroke="#2A1208" strokeWidth="8" strokeLinecap="round" fill="none"/>

      {/* Nose — prominent, wide, confident */}
      <ellipse cx="100" cy="110" rx="22" ry="20" fill="#8A4C24"/>
      <ellipse cx="91" cy="103" rx="9.5" ry="7.5" fill="#B06838" opacity="0.52"/>
      <circle cx="84" cy="122" r="9" fill="#522810"/>
      <circle cx="116" cy="122" r="9" fill="#522810"/>
      <ellipse cx="84" cy="123" rx="4" ry="3.5" fill="#280E04"/>
      <ellipse cx="116" cy="123" rx="4" ry="3.5" fill="#280E04"/>

      {/* Cheeks — solid, calm */}
      <ellipse cx="54" cy="116" rx="28" ry="24" fill="#8A4C24" opacity="0.36"/>
      <ellipse cx="146" cy="116" rx="28" ry="24" fill="#8A4C24" opacity="0.36"/>

      {/* Eyes — calm, steady squint (not as extreme as grandpa) */}
      <path d="M54 88 Q72 81 90 85" stroke="#1A0A04" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M56 92 Q72 96 88 92" stroke="#2A1208" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M110 85 Q128 81 146 88" stroke="#1A0A04" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M112 92 Q128 96 144 92" stroke="#2A1208" strokeWidth="1.6" strokeLinecap="round" fill="none"/>

      {/* Brows — strong, straight */}
      <path d="M52 78 Q72 70 91 74" stroke="#1A0A04" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M109 74 Q128 70 148 78" stroke="#1A0A04" strokeWidth="4" strokeLinecap="round" fill="none"/>

      {/* Calm, steady smile — narrower than aunty/grandpa */}
      <path d="M70 130 Q100 148 130 130" stroke="#2E1006" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Short beard/stubble */}
      <ellipse cx="100" cy="146" rx="32" ry="11" fill="rgba(28,14,4,0.22)"/>

      {/* Chin */}
      <ellipse cx="100" cy="155" rx="44" ry="15" fill="#522810" opacity="0.18"/>
    </svg>
  );
}

// ── Umukuru — The Parable Elder ───────────────────────────────────────────────
// Distinctive: long flowing white beard, expressive wrinkle lines, brown robe, deepest squint
function UmukuruPortrait({ size = 200 }: PortraitProps) {
  const h = Math.round(size * 1.2);
  return (
    <svg viewBox="0 0 200 240" width={size} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Brown robe */}
      <path d="M10 240 L10 165 Q10 150 28 142 L58 130 Q100 136 142 130 L172 142 Q190 150 190 165 L190 240Z" fill="#7A5C3A"/>
      <path d="M64 130 L60 212" stroke="rgba(255,255,255,0.10)" strokeWidth="4"/>
      <path d="M136 130 L140 212" stroke="rgba(255,255,255,0.10)" strokeWidth="4"/>
      <path d="M28 164 L172 164" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>

      {/* Ears */}
      <ellipse cx="28" cy="102" rx="14" ry="18" fill="#7A5030"/>
      <ellipse cx="172" cy="102" rx="14" ry="18" fill="#7A5030"/>
      <ellipse cx="32" cy="102" rx="7" ry="11" fill="#5A3818"/>
      <ellipse cx="168" cy="102" rx="7" ry="11" fill="#5A3818"/>

      {/* Head */}
      <ellipse cx="100" cy="94" rx="70" ry="68" fill="#7A5030"/>

      {/* Forehead highlight — shows the wisdom/age */}
      <ellipse cx="74" cy="70" rx="34" ry="22" fill="#A87040" opacity="0.38" transform="rotate(-16 74 70)"/>

      {/* White/grey hair at sides and top — wispy */}
      <path d="M32 78 Q36 28 100 22 Q164 28 168 78 Q148 42 100 38 Q52 42 32 78Z" fill="#DDD5C2"/>
      <path d="M32 80 Q28 100 26 116" stroke="#D0C8B0" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M168 80 Q172 100 174 116" stroke="#D0C8B0" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M46 68 Q64 42 100 38" stroke="rgba(190,182,162,0.50)" strokeWidth="2.5" fill="none"/>
      <path d="M154 68 Q136 42 100 38" stroke="rgba(190,182,162,0.50)" strokeWidth="2.5" fill="none"/>

      {/* Nose — large, elder's prominent nose */}
      <ellipse cx="100" cy="112" rx="20" ry="18" fill="#926040"/>
      <ellipse cx="92" cy="105" rx="9" ry="7" fill="#B87E50" opacity="0.50"/>
      <circle cx="86" cy="122" r="8" fill="#5A3418"/>
      <circle cx="114" cy="122" r="8" fill="#5A3418"/>
      <ellipse cx="86" cy="123" rx="3.8" ry="3.2" fill="#301408"/>
      <ellipse cx="114" cy="123" rx="3.8" ry="3.2" fill="#301408"/>

      {/* Cheeks */}
      <ellipse cx="58" cy="118" rx="26" ry="22" fill="#926040" opacity="0.36"/>
      <ellipse cx="142" cy="118" rx="26" ry="22" fill="#926040" opacity="0.36"/>

      {/* Eyes — deeply squinted, the most hooded of all — wisdom lines */}
      <path d="M54 90 Q72 80 92 85" stroke="#1A0A04" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M56 95 Q72 100 90 95" stroke="#2A1208" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M108 85 Q128 80 146 90" stroke="#1A0A04" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M110 95 Q128 100 144 95" stroke="#2A1208" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* Crow's feet — deeply etched */}
      <path d="M52 90 Q44 86 40 78" stroke="#5A3418" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.60"/>
      <path d="M50 94 Q42 92 38 86" stroke="#5A3418" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.40"/>
      <path d="M148 90 Q156 86 160 78" stroke="#5A3418" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.60"/>
      <path d="M150 94 Q158 92 162 86" stroke="#5A3418" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.40"/>
      {/* Forehead lines */}
      <path d="M68 64 Q100 60 132 64" stroke="#5A3418" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.30"/>
      <path d="M72 56 Q100 52 128 56" stroke="#5A3418" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.22"/>

      {/* Brows — bushy, grey/white */}
      <path d="M50 80 Q72 70 92 75" stroke="#8A8070" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M108 75 Q128 70 150 80" stroke="#8A8070" strokeWidth="4" strokeLinecap="round" fill="none"/>

      {/* Moustache — white/grey */}
      <path d="M84 130 Q92 126 100 129 Q108 126 116 130" stroke="#D0C8B0" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Long white beard — the defining feature */}
      <path d="M58 140 Q62 162 66 184 Q78 210 100 214 Q122 210 134 184 Q138 162 142 140" fill="#E0D8C8"/>
      <path d="M60 142 Q58 165 60 185" stroke="rgba(200,192,174,0.45)" strokeWidth="2" fill="none"/>
      <path d="M80 144 Q78 170 80 190" stroke="rgba(200,192,174,0.45)" strokeWidth="1.5" fill="none"/>
      <path d="M100 146 L100 210" stroke="rgba(200,192,174,0.45)" strokeWidth="1.5" fill="none"/>
      <path d="M120 144 Q122 170 120 190" stroke="rgba(200,192,174,0.45)" strokeWidth="1.5" fill="none"/>
      <path d="M140 142 Q142 165 140 185" stroke="rgba(200,192,174,0.45)" strokeWidth="2" fill="none"/>

      {/* Knowing smile beneath moustache */}
      <path d="M80 133 Q100 143 120 133" stroke="#3A1A08" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ── Mama — Mother ─────────────────────────────────────────────────────────────
// Distinctive: natural close hair, loving warm expression, mauve blouse, stud earrings
function MamaPortrait({ size = 200 }: PortraitProps) {
  const h = Math.round(size * 1.2);
  return (
    <svg viewBox="0 0 200 240" width={size} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Mauve blouse */}
      <path d="M16 240 L16 174 Q16 159 32 152 L64 144 Q100 150 136 144 L168 152 Q184 159 184 174 L184 240Z" fill="#8A4A6A"/>
      <path d="M30 172 L170 172" stroke="rgba(255,200,220,0.22)" strokeWidth="1.8"/>
      <path d="M30 188 L170 188" stroke="rgba(255,200,220,0.22)" strokeWidth="1.8"/>
      <path d="M30 204 L170 204" stroke="rgba(255,200,220,0.22)" strokeWidth="1.8"/>
      <path d="M70 144 L66 216" stroke="rgba(255,200,220,0.14)" strokeWidth="1.8"/>
      <path d="M100 150 L96 216" stroke="rgba(255,200,220,0.14)" strokeWidth="1.8"/>
      <path d="M130 144 L134 216" stroke="rgba(255,200,220,0.14)" strokeWidth="1.8"/>

      {/* Ears */}
      <ellipse cx="30" cy="104" rx="13" ry="17" fill="#8B5A38"/>
      <ellipse cx="170" cy="104" rx="13" ry="17" fill="#8B5A38"/>
      <ellipse cx="34" cy="104" rx="7" ry="11" fill="#6A3E20"/>
      <ellipse cx="166" cy="104" rx="7" ry="11" fill="#6A3E20"/>

      {/* Head */}
      <ellipse cx="100" cy="100" rx="70" ry="68" fill="#8B5A38"/>

      {/* Natural close-cropped hair */}
      <path d="M34 84 Q38 32 100 26 Q162 32 166 84 Q144 48 100 44 Q56 48 34 84Z" fill="#1E0E06"/>
      {/* Hair fullness at sides */}
      <path d="M34 84 Q30 100 32 116" stroke="#1E0E06" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <path d="M166 84 Q170 100 168 116" stroke="#1E0E06" strokeWidth="10" strokeLinecap="round" fill="none"/>
      {/* Natural hair texture — soft stippled feel */}
      <path d="M48 72 Q68 46 100 42" stroke="rgba(50,26,10,0.55)" strokeWidth="2.5" fill="none"/>
      <path d="M152 72 Q132 46 100 42" stroke="rgba(50,26,10,0.55)" strokeWidth="2.5" fill="none"/>
      <path d="M40 82 Q38 70 42 62" stroke="rgba(50,26,10,0.45)" strokeWidth="2" fill="none"/>
      <path d="M160 82 Q162 70 158 62" stroke="rgba(50,26,10,0.45)" strokeWidth="2" fill="none"/>

      {/* Forehead highlight */}
      <ellipse cx="76" cy="76" rx="30" ry="20" fill="#B07040" opacity="0.38" transform="rotate(-18 76 76)"/>

      {/* Nose — prominent, feminine shape */}
      <ellipse cx="100" cy="114" rx="18" ry="16" fill="#A06440"/>
      <ellipse cx="93" cy="107" rx="8" ry="6" fill="#C88050" opacity="0.52"/>
      <circle cx="87" cy="123" r="7" fill="#6A3C1E"/>
      <circle cx="113" cy="123" r="7" fill="#6A3C1E"/>
      <ellipse cx="87" cy="124" rx="3.2" ry="2.8" fill="#3A1A08"/>
      <ellipse cx="113" cy="124" rx="3.2" ry="2.8" fill="#3A1A08"/>

      {/* Cheeks — warm, loving */}
      <ellipse cx="60" cy="118" rx="26" ry="22" fill="#A06440" opacity="0.36"/>
      <ellipse cx="140" cy="118" rx="26" ry="22" fill="#A06440" opacity="0.36"/>
      {/* Warm rosy cheek tint */}
      <ellipse cx="54" cy="114" rx="14" ry="12" fill="#C07060" opacity="0.16"/>
      <ellipse cx="146" cy="114" rx="14" ry="12" fill="#C07060" opacity="0.16"/>

      {/* Eyes — loving squint, slightly more open than grandpa */}
      <path d="M58 98 Q76 90 92 94" stroke="#1E0E06" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M60 102 Q76 106 90 102" stroke="#2A1208" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M108 94 Q124 90 142 98" stroke="#1E0E06" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M110 102 Q124 106 140 102" stroke="#2A1208" strokeWidth="1.6" strokeLinecap="round" fill="none"/>

      {/* Brows */}
      <path d="M56 88 Q76 80 93 84" stroke="#3A1A08" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
      <path d="M107 84 Q124 80 144 88" stroke="#3A1A08" strokeWidth="2.8" strokeLinecap="round" fill="none"/>

      {/* Loving smile */}
      <path d="M70 133 Q100 150 130 133" stroke="#3A1808" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Laugh lines */}
      <path d="M65 124 Q61 132 64 138" stroke="#6A3C1E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.48"/>
      <path d="M135 124 Q139 132 136 138" stroke="#6A3C1E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.48"/>

      {/* Chin shadow */}
      <ellipse cx="100" cy="158" rx="36" ry="11" fill="#6A3C1E" opacity="0.18"/>

      {/* Stud earrings — mauve */}
      <circle cx="18" cy="110" r="5" fill="#C890B0"/>
      <circle cx="18" cy="110" r="2.5" fill="#E0B0D0"/>
      <circle cx="182" cy="110" r="5" fill="#C890B0"/>
      <circle cx="182" cy="110" r="2.5" fill="#E0B0D0"/>
    </svg>
  );
}

// ── Locked silhouette ─────────────────────────────────────────────────────────
function LockedPortrait({ size = 200 }: PortraitProps) {
  const h = Math.round(size * 1.2);
  return (
    <svg viewBox="0 0 200 240" width={size} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 240 L20 175 Q20 160 36 153 L66 145 Q100 151 134 145 L164 153 Q180 160 180 175 L180 240Z" fill="rgba(180,170,155,0.45)"/>
      <ellipse cx="100" cy="100" rx="64" ry="62" fill="rgba(180,170,155,0.45)"/>
      <path d="M40 86 Q44 38 100 32 Q156 38 160 86 Q138 52 100 48 Q62 52 40 86Z" fill="rgba(200,192,178,0.35)"/>
    </svg>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export default function CharacterPortrait({
  characterId,
  size = 200,
  locked = false,
}: {
  characterId: string;
  size?: number;
  locked?: boolean;
}) {
  if (locked) return <LockedPortrait size={size} />;
  switch (characterId) {
    case "nyogokuru":  return <NyogokuruPortrait size={size} />;
    case "sekuru":     return <SekuruPortrait size={size} />;
    case "senge":      return <SengePortrait size={size} />;
    case "rwasibo":    return <RwasiboPortrait size={size} />;
    case "umukuru-1":
    case "umukuru-2":
    case "umukuru-3":  return <UmukuruPortrait size={size} />;
    case "mama":       return <MamaPortrait size={size} />;
    default:           return <LockedPortrait size={size} />;
  }
}
