const palette = [
  'bg-amber-400 text-amber-950',
  'bg-sky-300 text-sky-900',
  'bg-purple-300 text-purple-900',
  'bg-emerald-300 text-emerald-900',
];

function AvatarStack({ people, extraCount = 0, size = 'md' }) {
  const sizing = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-xs';

  return (
    <div className="flex items-center">
      {people.map((person, index) => (
        <div
          key={`${person}-${index}`}
          className={`relative -ml-2 flex ${sizing} items-center justify-center rounded-full border-2 border-white font-semibold first:ml-0 ${palette[index % palette.length]}`}
        >
          {person}
        </div>
      ))}
      {extraCount > 0 ? (
        <div className="relative -ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-rose-100 text-xs font-bold text-rose-500">
          +{extraCount}
        </div>
      ) : null}
    </div>
  );
}

export default AvatarStack;
