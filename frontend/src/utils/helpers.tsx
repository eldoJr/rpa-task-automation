export const cn = (...classes: (string | undefined)[]) => {
    return classes.filter((cls): cls is string => Boolean(cls)).join(" ");
  };
  