import s from "./StatusTag.module.css";

export default function StatusTag({
  status,
  label,
}: {
  status: "green" | "yellow" | "red" | "neutral" | string;
  label: string;
}) {
  const cls =
    status === "green"
      ? s.green
      : status === "yellow"
        ? s.yellow
        : status === "red"
          ? s.red
          : s.neutral;

  return <span className={`${s.tag} ${cls}`}>{label}</span>;
}
