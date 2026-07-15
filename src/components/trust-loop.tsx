import { BookOpen, MessagesSquare, ScanLine, UsersRound } from "lucide-react";

const steps = [
  { label: "Ask", detail: "An anonymous need", icon: MessagesSquare },
  { label: "Connect", detail: "One relevant peer", icon: UsersRound },
  { label: "Protect", detail: "Two private choices", icon: ScanLine },
  { label: "Share", detail: "One safe insight", icon: BookOpen },
];

export function TrustLoop() {
  return (
    <div className="trust-loop" aria-label="Trust loop: ask, connect, protect, share">
      <div className="trust-loop-line" aria-hidden="true" />
      {steps.map(({ label, detail, icon: Icon }, index) => (
        <div className="trust-loop-step" key={label}>
          <span className="trust-loop-index">0{index + 1}</span>
          <span className="trust-loop-icon"><Icon size={21} /></span>
          <strong>{label}</strong>
          <small>{detail}</small>
        </div>
      ))}
    </div>
  );
}
