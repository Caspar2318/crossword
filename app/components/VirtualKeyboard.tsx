type VirtualKeyboardProps = {
  disabled?: boolean;
  position: { top: number; left: number } | null;
  onKeyPress: (letter: string) => void;
  onBackspace: () => void;
};

const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function VirtualKeyboard({
  disabled = false,
  position,
  onKeyPress,
  onBackspace,
}: VirtualKeyboardProps) {
  if (!position) return null;

  return (
    <div
      data-virtual-keyboard="true"
      className="fixed z-50 w-[280px] sm:w-[320px] max-w-[92vw] rounded-2xl border-2 border-black bg-white p-2 shadow-[4px_4px_0_#000]"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="space-y-1">
        {rows.map((row) => (
          <div key={row} className="flex gap-1">
            {row.split("").map((letter) => (
              <button
                key={letter}
                disabled={disabled}
                onClick={() => onKeyPress(letter)}
                className="w-7 h-7 rounded-md border border-black bg-yellow-50 text-sm font-bold hover:bg-yellow-100 disabled:opacity-40 cursor-pointer"
              >
                {letter}
              </button>
            ))}
          </div>
        ))}

        <button
          disabled={disabled}
          onClick={onBackspace}
          className="w-full h-7 rounded-md border border-black bg-red-50 text-xs font-bold hover:bg-red-100 disabled:opacity-40 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
