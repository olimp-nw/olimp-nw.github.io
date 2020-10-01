/* Contester JavaScript support functions
 * Copyright (c) 2007-2010, Klopov Igor
 * Please see license.txt in Contester directory
 * for copyright notices and details.
 */

var contesterVersion = "2.3";

var alreadyFocused = false;

function obj(oid) {
  if (document.getElementById) {
    return document.getElementById(oid);
  } else if (document.all) {
    return document.all[oid];
  } else {
    return null;
  }
}
function setFocus(oid) {
  o = obj(oid);
  if (!o) return;
  o.focus();
}
function quote(fid, text) {
  f = obj(fid);
  if (!f) return;
  f.value += '[quote] ' + text + ' [/quote]\n';
  f.focus();
}
function quoteSelected(fid) {
  ds = document.selection;
  if (!ds) return;
  selected = ds.createRange().text;
  if (!selected) {
    alert('Сначала выделите текст для цитирования!');
  } else {
    quote(fid, selected);
  }
}
function checkLength(fid, max) {
  f = obj(fid);
  if (!f) return true;
  left = max - f.value.length;
  return (left > -5);
}
function keepLength(fid, max) {
  f = obj(fid);
  if (!f) return;
  left = max - (msg = f.value).length;
  if (left < 0) {
    f.value = msg.substring(0, max);
  }
}
function keepLengthEx(fid, max, cid) {
  f = obj(fid);
  if (!f) return;
  c = obj(cid);
  if (!c) return;
  cs = c.style;
  left = max - (msg = f.value).length;
  if (left < 0) {
    f.value = msg.substring(0, max); c.innerHTML = 0;
  } else {
    c.innerHTML = left;
  } // без else!
  if (left <= 20) {
    cs.color = 'red'; cs.fontWeight = 'bold';
  } else {
    cs.color = 'black'; cs.fontWeight = 'normal';
  }
}
function appendValue(oid, app) {
  o = obj(oid);
  if (!o) return;
  if (!o.value) return;
  o.value = o.value + app;
}
function hide(oid) {
  o = obj(oid);
  if (!o) return;
  o.style.display = 'none';
}
function show(oid) {
  o = obj(oid);
  if (!o) return;
  o.style.display = '';
}
function makeBack(oid) {
  o = obj(oid);
  if (!o) return;
  o.className = 'back';
}
function makeLight(oid) {
  o = obj(oid);
  if (!o) return;
  o.className = 'light';
}
function makeDark(oid) {
  o = obj(oid);
  if (!o) return;
  o.className = 'dark';
}
function drop(hid, sid) {
  hide(hid);
  show(sid);
}
function dropEx(hid, s1id, s2id) {
  hide(hid);
  show(s1id);
  show(s2id);
}
function burn(oidp) {
  makeLight(oidp + 'x');
  makeBack(oidp + 'y');
  makeBack(oidp + 'z');
}
function unburn(oidp) {
  makeDark(oidp + 'x');
  makeLight(oidp + 'y');
  makeLight(oidp + 'z');
}
function setDocument(c, oid) {
  var o = obj(oid);
  if (!o) return;
  o.innerHTML = c;
}
function loadDocument(u, oid) {
  var o = obj(oid);
  if (!o) return;
  var r;
  if (window.XMLHttpRequest) {
    r = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    r = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (!r) return;
  r.onreadystatechange = function() {
    if (r.readyState != 4) return;
    try { r.status; } catch (e) {
      setTimeout(function(){loadDocument(u, oid);}, 10000);
      return;
    }
    if (r.status != 200) {
      setTimeout(function(){loadDocument(u, oid);}, 10000);
      return;
    }
    ins = r.responseText;
    if (ins.indexOf('<nochange />') == 0) {
      setTimeout(function(){loadDocument(u, oid);}, 10000);
      return;
    }
    o.innerHTML = ins;
    while (true) {
      bp = ins.indexOf('<script');
      if (bp == -1) break;
      ins = ins.substring(bp, ins.length);
      bp = ins.indexOf('>');
      ins = ins.substring(bp + 1, ins.length);
      ep = ins.indexOf('</script');
      var scr = ins.substring(0, ep);
      while (scr.substring(0, 1) == ' ') scr = scr.substring(1, scr.length);
      while (scr.substring(scr.length - 1, scr.length) == ' ') scr = scr.substring(0, scr.length - 1);
      if (scr.substring(0, 4) == '<!--') scr = scr.substring(4, scr.length);
      if (scr.substring(scr.length - 5, scr.length) == '//-->') scr = scr.substring(0, scr.length - 5);
      eval(scr);
    }
  }
  r.open('GET', u, true);
  r.send(null);
}
function leadZero(a) {if (a < 10) {return '0' + a.toString(10);} else {return a.toString(10);};}
function unleadZero(b) {if (b.substr(0, 1) == '0') {return b.substr(1);} else {return b;};}
function tickTime(sid, mid, hid, delta) {
  var s = obj(sid);
  if (!s) return;
  var m = obj(mid);
  if (!m) return;
  var h = obj(hid);
  if (!h) return;
  var ss = unleadZero(s.innerHTML);
  var sm = unleadZero(m.innerHTML);
  var sh = unleadZero(h.innerHTML);
  var ts = parseInt(ss);
  var tm = parseInt(sm);
  var th = parseInt(sh);
  ts += delta;
  if (ts < 0) {ts = 59; tm--;};
  if (ts > 59) {ts = 0; tm++;};
  if (tm < 0) {tm = 59; th--;};
  if (tm > 59) {tm = 0; th++;};
  if (th < 0) {
    if (delta < 0) {
      setTimeout(function(){window.location.reload();}, 3000);
    }
  } else {
    s.innerHTML = leadZero(ts);
    m.innerHTML = leadZero(tm);
    h.innerHTML = leadZero(th);
    setTimeout(function(){tickTime(sid, mid, hid, delta);}, 1000);
  }
}
function addSecondsRu(dt, incsec) {
  function getToken(delimiter) {
    x = dt.indexOf(delimiter);
    if (x < 0) x = dt.length;
    var r = parseInt(unleadZero(dt.substring(0, x)));
    if (isNaN(r)) return -1;
    dt = dt.substring(x + 1);
    return r; }
  var dd = getToken('.');
  if (dd < 0) return '';
  var dm = getToken('.');
  if (dm < 0) return '';
  var dy = getToken(' ');
  if (dy < 0) return '';
  var th = getToken(':');
  if (th < 0) return '';
  var tm = getToken(':');
  if (tm < 0) tm = 0;
  var ts = getToken(' ');
  if (ts < 0) ts = 0;
  var c = 0;
  ts += incsec;
  if (ts > 59) {
    c = ts % 60;
    tm += (ts - c) / 60;
    ts = c; }
  if (tm > 59) {
    c = tm % 60;
    th += (tm - c) / 60;
    tm = c; }
  if (th > 23) {
    c = th % 24;
    dd += (th - c) / 24;
    th = c; }
  return leadZero(dd) + '.' + leadZero(dm) + '.' + leadZero(dy) + ' ' +          leadZero(th) + ':' + leadZero(tm) + ':' + leadZero(ts);
}
function blinkText(tid) {
  var t = obj(tid);
  if (!t) return;
  t.style.color = '#8000ff';
  setTimeout(function(){unblinkText(tid);}, 250);
}
function unblinkText(tid) {
  var t = obj(tid);
  if (!t) return;
  t.style.color = '';
  setTimeout(function(){blinkText(tid);}, 250);
}
var markerLastClickedID = '';
var markerLastClickedHref = '';
function markerHighLight(node) {
  var sn = node.firstChild;
  while (sn) {
    if (sn.tagName.toString().toLowerCase() == 'td') {
      if (!sn.getAttribute('classsave')) {
        sn.setAttribute('classsave', sn.className);
      }
      sn.className = 'marked';
    }
    sn = sn.nextSibling;
  }
}
function markerUnhighLight(node) {
  var sn = node.firstChild; var a;
  while (sn) {
    if (a = sn.getAttribute('classsave')) {
      sn.className = a;
    }
    sn = sn.nextSibling;
  }
}
function markerClick(pid, mrn, mrv) {
  var sn = obj(pid).firstChild;
  while (sn) {
    if (sn.getAttribute) {
      if (sn.getAttribute('mrn0')) {
        if (sn.getAttribute(mrn) == mrv) {
          markerHighLight(sn);
        } else {
          markerUnhighLight(sn);
        }
      }
    }
    sn = sn.nextSibling;
  }
}
function properSourceFile(f) {
  if (!f) return true;
  if (f == '') return true;
  f = f.toLowerCase();
  var e2 = f.substring(f.length - 2, f.length);
  var e3 = f.substring(f.length - 3, f.length);
  var e4 = f.substring(f.length - 4, f.length);
  var e5 = f.substring(f.length - 5, f.length);
  if (e4 == '.cpp') return true; else
  if (e2 == '.c') return true; else
  if (e4 == '.dpr') return true; else
  if (e4 == '.pas') return true; else
  if (e5 == '.java') return true; else
  if (e3 == '.cs') return true; else
  if (e3 == '.js') return true; else
  if (e3 == '.vb') return true; else
  return false;
}
function fitTextarea(tid) {
  t = obj(tid);
  if (!t) return;
  if (t.rows < 16) {
    t.rows = 16;
  }
  var w = 0;
  if (self.screen) {
    w = screen.width;
  } else if (self.java) {
    var j = java.awt.Toolkit.getDefaultToolkit();
    var s = j.getScreenSize();
    w = s.width;
  }
  if (w > 1030) {
    if (t.style.width != '450px') {
      t.style.width = '450px';
    }
  }
}
