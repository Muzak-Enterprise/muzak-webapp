const Badge: React.FC<{ text: string; color: string; onClick: () => void }> = ({
  text,
  color,
  onClick,
}) => (
  <span
    className={`px-2 py-1 rounded-full text-sm font-medium text-white ${color}`}
    onClick={onClick}
  >
    {text}
  </span>
);

export default Badge;
