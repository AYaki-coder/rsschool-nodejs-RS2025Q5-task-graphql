export function batchOneToOne<T extends { id: string }>(
  ids: readonly string[],
  arr: Array<T>,
  fieldName: string,
): Array<T | null> {
  const arrMap = new Map(arr.map((el) => [el[fieldName], el]));

  return ids.map((id) => arrMap.get(id) ?? null);
}

export function batchOneToMany<T extends Record<string, unknown>, K extends keyof T>(
  ids: readonly T[K][],
  arr: T[],
  fieldName: K,
  onlyField: K,
): Array<Array<T[K]>>;

export function batchOneToMany<T extends Record<string, unknown>, K extends keyof T>(
  ids: readonly T[K][],
  arr: T[],
  fieldName: K,
): Array<Array<T>>;

export function batchOneToMany<T extends Record<string, unknown>, K extends keyof T>(
  ids: readonly T[K][],
  arr: T[],
  fieldName: K,
  onlyField?: K,
): Array<Array<T | T[K]>> {
  const arrMap = new Map<T[K], Array<T | T[K]>>();

  arr.forEach((el) => {
    const fieldValue = el[fieldName];

    if (!arrMap.has(fieldValue)) {
      arrMap.set(fieldValue, []);
    }
    const result = onlyField ? el[onlyField] : el;

    arrMap.get(fieldValue)!.push(result);
  });

  return ids.map((id) => arrMap.get(id) ?? []);
}
