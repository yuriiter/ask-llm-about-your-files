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
