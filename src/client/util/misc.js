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
