import { useState } from 'react';

interface Props {
  text: string;
  maxLength: number;
}

export default function LongText({ text, maxLength }: Props) {
  const [showFullText, setShowFullText] = useState(false);
  const isBiggerThanMaxLength = text.length > maxLength;

  return (
    <div>
      <p className="hyphens-auto whitespace-pre-line break-words font-sans text-slate-600">
        {isBiggerThanMaxLength ? (
          <>{showFullText ? text : text.slice(0, maxLength - 1) + '...'}</>
        ) : (
          <>{text}</>
        )}
      </p>
      {isBiggerThanMaxLength && (
        <button
          className="text-sm text-cyan-600 transition hover:text-cyan-500 focus:text-cyan-500"
          onClick={() => setShowFullText((prev) => !prev)}
        >
          Show {!showFullText ? 'more' : 'less'}
        </button>
      )}
    </div>
  );
}
