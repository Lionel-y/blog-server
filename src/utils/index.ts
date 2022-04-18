import { EntityTarget, getRepository } from 'typeorm';

export function excludeColumns<T>(
  entity: EntityTarget<T>,
  exclude: (keyof T)[],
): (keyof T)[] {
  const columns = getRepository(entity).metadata.columns.map(
    ({ databaseName }) => databaseName,
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return columns.filter((column) => !exclude.includes(column));
}

export function format2Day(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getNdayBefore(d: Date, n: number) {
  const _ = new Date(d);
  _.setDate(_.getDate() + n);
  return _;
}
