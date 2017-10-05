function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export {pad};

function GetConnectionKey() {
    var searchParams = new URLSearchParams(window.location.search);
    var key = searchParams.get('key');
    if (!key) {
        key = localStorage.getItem('key');
        if (!key) return false;
    } else {
        localStorage.setItem('key', key);
    }
    return key;
}

export {GetConnectionKey};

function GetTimeSince(timestamp) {
    if (!timestamp) return "N/A";
    var diff = Date.now() - timestamp;
    var hours = Math.floor(diff / (1000 * 60 * 60));
    var minutes = Math.floor(diff / (1000 * 60)) - (hours * 60)
    return hours + ":" + pad(minutes, 2);
}

export {GetTimeSince};

function linearScale(val, fromMin, fromMax, toMin, toMax) {
    val = (val - fromMin) / (fromMax - fromMin);
    return (val * (toMax - toMin)) + toMin;
}
export {linearScale};

function PrettyNumber(val) {
    if (!val && val !== 0) return "IDFK";
    return val.toFixed(2).replace(/./g, function(c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
}
export {PrettyNumber};
