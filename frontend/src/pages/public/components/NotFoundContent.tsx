import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { NotFoundGeneralSection } from '../../../entities/page';
import { DEFAULT_NOT_FOUND_SECTIONS } from '../../../entities/page';

interface NotFoundContentProps {
  content?: NotFoundGeneralSection;
  isInsidePreview?: boolean;
}

export function NotFoundContent({ content, isInsidePreview = false }: NotFoundContentProps) {
  const navigate = useNavigate();
  const data = content || DEFAULT_NOT_FOUND_SECTIONS.general;

  const handleAction = () => {
    if (isInsidePreview) return;
    if (data.buttonLink?.startsWith('http')) {
      window.location.href = data.buttonLink;
    } else {
      navigate(data.buttonLink || '/');
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-center bg-white min-h-[calc(100vh-140px)]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full flex flex-col items-center select-none"
      >
        {/* Custom Vector Illustration matching reference image */}
        <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-[16/11] mb-5 flex items-center justify-center">
          <svg
            viewBox="0 0 360 240"
            className="w-full h-full drop-shadow-sm overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow beneath the browser */}
            <ellipse cx="145" cy="216" rx="95" ry="5.5" fill="#e2e8f0" opacity="0.8" />

            {/* Sparkle rays top-left of the browser */}
            <line x1="68" y1="58" x2="56" y2="44" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="72" x2="42" y2="72" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="78" y1="50" x2="78" y2="34" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Cute Sad Browser Window */}
            <g className="browser-window">
              {/* Outer Box */}
              <rect
                x="64"
                y="76"
                width="136"
                height="108"
                rx="9"
                fill="#ffffff"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* Header bar background */}
              <rect
                x="65.5"
                y="77.5"
                width="133"
                height="17"
                rx="7"
                fill="#f0f9ff"
              />
              <line x1="64" y1="94.5" x2="200" y2="94.5" stroke="#bae6fd" strokeWidth="1.5" />

              {/* 3 Header dots */}
              <circle cx="74" cy="86" r="2.2" fill="#7dd3fc" />
              <circle cx="81" cy="86" r="2.2" fill="#7dd3fc" />
              <circle cx="88" cy="86" r="2.2" fill="#7dd3fc" />

              {/* Eyes */}
              <circle cx="102" cy="126" r="3.4" fill="#52525b" />
              <circle cx="162" cy="126" r="3.4" fill="#52525b" />

              {/* Pink Blush Cheeks */}
              <ellipse cx="99" cy="136" rx="5" ry="3.2" fill="#fca5a5" opacity="0.85" />
              <ellipse cx="165" cy="136" rx="5" ry="3.2" fill="#fca5a5" opacity="0.85" />

              {/* Sad Mouth Shape */}
              <path
                d="M 122 146 C 122 136 142 136 142 146 Z"
                fill="#71717a"
              />
            </g>

            {/* Speech Bubble "404" placed at upper right with clear full visibility */}
            <g className="speech-bubble">
              {/* Tail pointing down-left to browser window */}
              <path
                d="M 175 130 C 158 150 142 155 138 155 C 150 145 165 138 178 132 Z"
                fill="#38bdf8"
              />
              {/* Circle Bubble */}
              <circle cx="218" cy="88" r="56" fill="#38bdf8" />
              {/* 404 Code Text */}
              <text
                x="218"
                y="102"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="42"
                fontWeight="700"
                fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
                letterSpacing="-0.5px"
              >
                {data.badgeCode || '404'}
              </text>
            </g>
          </svg>
        </div>

        {/* Heading in exact cyan with uppercase letter spacing */}
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-normal text-[#38bdf8] tracking-[0.14em] uppercase font-['Plus_Jakarta_Sans'] mb-5">
          {data.heading || 'PAGE NOT FOUND'}
        </h1>

        {/* 3-Line Description */}
        <div className="space-y-1.5 text-[15px] sm:text-base text-zinc-500 font-normal leading-relaxed mb-8 max-w-md">
          <p>{data.line1 || 'We looked everywhere for this page.'}</p>
          <p>{data.line2 || 'Are you sure the website URL is correct?'}</p>
          <p>{data.line3 || 'Get in touch with the site owner.'}</p>
        </div>

        {/* Action Button: Pill Outline */}
        <button
          type="button"
          onClick={handleAction}
          className="h-11 px-8 rounded-full border-2 border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-white text-sm sm:text-[15px] font-normal tracking-wide transition-colors duration-200 cursor-pointer inline-flex items-center justify-center select-none"
        >
          {data.buttonText || 'Go Back Home'}
        </button>
      </motion.div>
    </main>
  );
}
