export function MapsView() {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <div className="p-4 border-b border-zinc-200">
        <h2 className="text-lg font-semibold text-zinc-900">Карта участков</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Интерактивная карта расположения производственных участков и объектов компании
        </p>
      </div>
      <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1vjDbp-VHRdAiez7zkd1xpvLD3NzL7kI&ehbc=2E312F"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Карта участков Шугнов Голд"
        />
      </div>
    </div>
  );
}
