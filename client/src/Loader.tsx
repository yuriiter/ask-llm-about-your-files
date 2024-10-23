type Props = {
  type?: "border" | "grow";
};

export const Loader = ({ type = "border" }: Props) => {
  const baseClassName = `spinner-${type}`;

  return (
    <div
      className={`${baseClassName}`}
      style={{
        borderColor: "transparent",
        borderTopColor: "blue",
        borderBottomColor: "blue",
        borderRightColor: "blue",
      }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};
