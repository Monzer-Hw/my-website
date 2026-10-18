// Drawn stand-in stills for projects without a real poster image (design reference).
// Each one shows the project's own subject: a cited answer, a solved grid, a workflow.

const GIVEN = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
const SOLVED = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

export function PosterArt({ kind }: { kind: "rag" | "sudoku" | "flow" }) {
  if (kind === "rag") return <RagArt />;
  if (kind === "sudoku") return <SudokuArt />;
  return <FlowArt />;
}

function RagArt() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-[8%] pt-[6%] pb-[18%] text-[0.625rem] leading-[1.45]">
      <p className="max-w-[80%] self-end rounded-[10px_10px_2px_10px] bg-poster-line px-2.5 py-1.5 text-poster-text">
        Which contracts renew automatically in Q3?
      </p>
      <p className="max-w-[86%] rounded-[10px_10px_10px_2px] bg-poster-2 px-2.5 py-2 text-poster-ink">
        Three renew on 1 July unless cancelled 60 days before <Cite n={1} />
        <Cite n={3} />. The supplier agreement renews yearly <Cite n={2} />.
      </p>
    </div>
  );
}

function Cite({ n }: { n: number }) {
  return (
    <b className="mx-px inline-block rounded-[3px] bg-bg px-1 text-[0.9em] font-semibold text-ink">{n}</b>
  );
}

function SudokuArt() {
  return (
    <div className="absolute inset-0 grid place-items-center pb-[4%]">
      <div className="grid aspect-square w-[min(34%,200px)] grid-cols-9 border-2 border-poster-ink bg-poster-2">
        {[...SOLVED].map((digit, i) => {
          const row = Math.floor(i / 9);
          const col = i % 9;
          const given = GIVEN[i] !== ".";
          const solvedShown = !given && i % 7 === 0; // a few solver answers, in green
          return (
            <span
              key={i}
              className={[
                "grid place-items-center text-[clamp(0.4375rem,0.3rem+0.4vw,0.75rem)] tabular-nums",
                col === 2 || col === 5 ? "border-r border-r-poster-ink" : col < 8 ? "border-r border-r-poster-line" : "",
                row === 2 || row === 5 ? "border-b border-b-poster-ink" : row < 8 ? "border-b border-b-poster-line" : "",
                solvedShown ? "text-live-2" : "text-bg",
              ].join(" ")}
            >
              {given || solvedShown ? digit : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function FlowArt() {
  const nodes = [
    ["Inbox", "PDF"],
    ["Extract", "LLM"],
    ["Check", "vs. PO"],
    ["ERP", "posted"],
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-[5%] pb-[10%]">
      {nodes.map(([label, note], i) => (
        <div key={label} className="contents">
          {i > 0 && <span className="h-px max-w-4 min-w-1.5 flex-1 bg-poster-ink" />}
          <span className="rounded-[8px] bg-poster-2 px-2 py-1.5 text-[0.625rem] leading-[1.3] whitespace-nowrap text-poster-text shadow-[inset_0_0_0_1px_var(--color-poster-line)]">
            {label}
            <small className="block text-[0.9em] text-poster-ink">{note}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
