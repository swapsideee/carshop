export function normalize(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/і/g, "и")
        .replace(/ї/g, "и")
        .replace(/є/g, "е")
        .replace(/[ʼ']/g, "")
        .replace(/[шщ]/g, "sh")
        .replace(/ч/g, "ch")
        .replace(/ц/g, "ts")
        .replace(/ж/g, "zh")
        .replace(/ю/g, "yu")
        .replace(/я/g, "ya")
        .replace(/й/g, "i")
        .replace(/х/g, "h")
        .replace(/ъ/g, "")
        .replace(/ь/g, "")
        .replace(/[^a-zа-я0-9\s]/gi, "");
}
