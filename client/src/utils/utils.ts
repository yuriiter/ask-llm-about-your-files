export const cn = (...classNames: (string | undefined | null | boolean)[]) =>
  classNames
    .filter(
      (className) => typeof className === "string" && className.length > 0,
    )
    .join(" ");

export const promisedTimeout = (duration: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(1), duration);
  });

export const bytesToHumanReadable = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

export const dateToShortHumanReadable = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};
