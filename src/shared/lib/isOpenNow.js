export function isOpenNow() {
  const now = new Date();
  const time = now.getHours() * 60 + now.getMinutes();
  return time >= 9 * 60 && time <= 13 * 60;
}
