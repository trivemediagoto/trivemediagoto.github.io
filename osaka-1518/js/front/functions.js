// 日付のフォーマットを ISO 8601 に変換
function replaceDate(dateStr) {
    const regexp = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
    return dateStr.replace(regexp, (match, year, month, day, hour, minutes, seconds) => {
        return `${year}-${month}-${ day}T${hour}:${minutes}:${seconds}.000+09:00`;
    });
}

function isHiragana(str) {
    str = (str == null) ? "" : str;
    if (str.match(/^[ぁ-んー　 ]*$/)) {
        return true;
    } else {
        return false;
    }
}
