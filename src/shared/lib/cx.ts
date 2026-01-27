type CxValue = string | number | false | null | undefined | 0;

export function cx(...v: CxValue[]): string {
  return v.filter((x): x is string | number => Boolean(x)).join(' ');
}
