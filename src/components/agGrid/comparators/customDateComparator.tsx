export const customDateComparator = (valueA: string, valueB: string) => {
  const dateA = new Date(valueA);
  const dateB = new Date(valueB);
  return dateA.getTime() - dateB.getTime();
};
