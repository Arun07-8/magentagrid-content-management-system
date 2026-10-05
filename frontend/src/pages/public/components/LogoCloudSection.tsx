export function LogoCloudSection() {
  const logos = [
    { name: 'Lenovo', text: 'Lenovo' },
    { name: 'ENERGEN', text: 'ENERGEN' },
    { name: 'Google', text: 'Google' },
    { name: 'Alphabet', text: 'Alphabet' },
    { name: 'Olippyn', text: 'Olippyn' },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-50/80 border border-zinc-200/70 shadow-2xs">
          <div className="flex items-center justify-around flex-wrap gap-8 sm:gap-12 opacity-80 hover:opacity-100 transition-opacity">
            {logos.map((logo) => (
              <span
                key={logo.name}
                className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-800 font-['Space_Grotesk'] hover:text-zinc-950 transition-colors select-none"
              >
                {logo.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
