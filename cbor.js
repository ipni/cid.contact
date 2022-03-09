/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 Patrick Gansterer <paroga@paroga.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(global, undefined) { "use strict";
var POW_2_24 = 5.960464477539063e-8,
    POW_2_32 = 4294967296,
    POW_2_53 = 9007199254740992;

function encode(value) {
  var data = new ArrayBuffer(256);
  var dataView = new DataView(data);
  var lastLength;
  var offset = 0;

  function prepareWrite(length) {
    var newByteLength = data.byteLength;
    var requiredLength = offset + length;
    while (newByteLength < requiredLength)
      newByteLength <<= 1;
    if (newByteLength !== data.byteLength) {
      var oldDataView = dataView;
      data = new ArrayBuffer(newByteLength);
      dataView = new DataView(data);
      var uint32count = (offset + 3) >> 2;
      for (var i = 0; i < uint32count; ++i)
        dataView.setUint32(i << 2, oldDataView.getUint32(i << 2));
    }

    lastLength = length;
    return dataView;
  }
  function commitWrite() {
    offset += lastLength;
  }
  function writeFloat64(value) {
    commitWrite(prepareWrite(8).setFloat64(offset, value));
  }
  function writeUint8(value) {
    commitWrite(prepareWrite(1).setUint8(offset, value));
  }
  function writeUint8Array(value) {
    var dataView = prepareWrite(value.length);
    for (var i = 0; i < value.length; ++i)
      dataView.setUint8(offset + i, value[i]);
    commitWrite();
  }
  function writeUint16(value) {
    commitWrite(prepareWrite(2).setUint16(offset, value));
  }
  function writeUint32(value) {
    commitWrite(prepareWrite(4).setUint32(offset, value));
  }
  function writeUint64(value) {
    var low = value % POW_2_32;
    var high = (value - low) / POW_2_32;
    var dataView = prepareWrite(8);
    dataView.setUint32(offset, high);
    dataView.setUint32(offset + 4, low);
    commitWrite();
  }
  function writeTypeAndLength(type, length) {
    if (length < 24) {
      writeUint8(type << 5 | length);
    } else if (length < 0x100) {
      writeUint8(type << 5 | 24);
      writeUint8(length);
    } else if (length < 0x10000) {
      writeUint8(type << 5 | 25);
      writeUint16(length);
    } else if (length < 0x100000000) {
      writeUint8(type << 5 | 26);
      writeUint32(length);
    } else {
      writeUint8(type << 5 | 27);
      writeUint64(length);
    }
  }

  function encodeItem(value) {
    var i;

    if (value === false)
      return writeUint8(0xf4);
    if (value === true)
      return writeUint8(0xf5);
    if (value === null)
      return writeUint8(0xf6);
    if (value === undefined)
      return writeUint8(0xf7);

    switch (typeof value) {
      case "number":
        if (Math.floor(value) === value) {
          if (0 <= value && value <= POW_2_53)
            return writeTypeAndLength(0, value);
          if (-POW_2_53 <= value && value < 0)
            return writeTypeAndLength(1, -(value + 1));
        }
        writeUint8(0xfb);
        return writeFloat64(value);

      case "string":
        var utf8data = [];
        for (i = 0; i < value.length; ++i) {
          var charCode = value.charCodeAt(i);
          if (charCode < 0x80) {
            utf8data.push(charCode);
          } else if (charCode < 0x800) {
            utf8data.push(0xc0 | charCode >> 6);
            utf8data.push(0x80 | charCode & 0x3f);
          } else if (charCode < 0xd800) {
            utf8data.push(0xe0 | charCode >> 12);
            utf8data.push(0x80 | (charCode >> 6)  & 0x3f);
            utf8data.push(0x80 | charCode & 0x3f);
          } else {
            charCode = (charCode & 0x3ff) << 10;
            charCode |= value.charCodeAt(++i) & 0x3ff;
            charCode += 0x10000;

            utf8data.push(0xf0 | charCode >> 18);
            utf8data.push(0x80 | (charCode >> 12)  & 0x3f);
            utf8data.push(0x80 | (charCode >> 6)  & 0x3f);
            utf8data.push(0x80 | charCode & 0x3f);
          }
        }

        writeTypeAndLength(3, utf8data.length);
        return writeUint8Array(utf8data);

      default:
        var length;
        if (Array.isArray(value)) {
          length = value.length;
          writeTypeAndLength(4, length);
          for (i = 0; i < length; ++i)
            encodeItem(value[i]);
        } else if (value instanceof Uint8Array) {
          writeTypeAndLength(2, value.length);
          writeUint8Array(value);
        } else {
          var keys = Object.keys(value);
          length = keys.length;
          writeTypeAndLength(5, length);
          for (i = 0; i < length; ++i) {
            var key = keys[i];
            encodeItem(key);
            encodeItem(value[key]);
          }
        }
    }
  }

  encodeItem(value);

  if ("slice" in data)
    return data.slice(0, offset);

  var ret = new ArrayBuffer(offset);
  var retView = new DataView(ret);
  for (var i = 0; i < offset; ++i)
    retView.setUint8(i, dataView.getUint8(i));
  return ret;
}

function decode(data, tagger, simpleValue) {
  var dataView = new DataView(data);
  var offset = 0;

  if (typeof tagger !== "function")
    tagger = function(value) { return value; };
  if (typeof simpleValue !== "function")
    simpleValue = function() { return undefined; };

  function commitRead(length, value) {
    offset += length;
    return value;
  }
  function readArrayBuffer(length) {
    return commitRead(length, new Uint8Array(data, offset, length));
  }
  function readFloat16() {
    var tempArrayBuffer = new ArrayBuffer(4);
    var tempDataView = new DataView(tempArrayBuffer);
    var value = readUint16();

    var sign = value & 0x8000;
    var exponent = value & 0x7c00;
    var fraction = value & 0x03ff;

    if (exponent === 0x7c00)
      exponent = 0xff << 10;
    else if (exponent !== 0)
      exponent += (127 - 15) << 10;
    else if (fraction !== 0)
      return (sign ? -1 : 1) * fraction * POW_2_24;

    tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13);
    return tempDataView.getFloat32(0);
  }
  function readFloat32() {
    return commitRead(4, dataView.getFloat32(offset));
  }
  function readFloat64() {
    return commitRead(8, dataView.getFloat64(offset));
  }
  function readUint8() {
    return commitRead(1, dataView.getUint8(offset));
  }
  function readUint16() {
    return commitRead(2, dataView.getUint16(offset));
  }
  function readUint32() {
    return commitRead(4, dataView.getUint32(offset));
  }
  function readUint64() {
    return readUint32() * POW_2_32 + readUint32();
  }
  function readBreak() {
    if (dataView.getUint8(offset) !== 0xff)
      return false;
    offset += 1;
    return true;
  }
  function readLength(additionalInformation) {
    if (additionalInformation < 24)
      return additionalInformation;
    if (additionalInformation === 24)
      return readUint8();
    if (additionalInformation === 25)
      return readUint16();
    if (additionalInformation === 26)
      return readUint32();
    if (additionalInformation === 27)
      return readUint64();
    if (additionalInformation === 31)
      return -1;
    throw "Invalid length encoding";
  }
  function readIndefiniteStringLength(majorType) {
    var initialByte = readUint8();
    if (initialByte === 0xff)
      return -1;
    var length = readLength(initialByte & 0x1f);
    if (length < 0 || (initialByte >> 5) !== majorType)
      throw "Invalid indefinite length element";
    return length;
  }

  function appendUtf16Data(utf16data, length) {
    for (var i = 0; i < length; ++i) {
      var value = readUint8();
      if (value & 0x80) {
        if (value < 0xe0) {
          value = (value & 0x1f) <<  6
                | (readUint8() & 0x3f);
          length -= 1;
        } else if (value < 0xf0) {
          value = (value & 0x0f) << 12
                | (readUint8() & 0x3f) << 6
                | (readUint8() & 0x3f);
          length -= 2;
        } else {
          value = (value & 0x0f) << 18
                | (readUint8() & 0x3f) << 12
                | (readUint8() & 0x3f) << 6
                | (readUint8() & 0x3f);
          length -= 3;
        }
      }

      if (value < 0x10000) {
        utf16data.push(value);
      } else {
        value -= 0x10000;
        utf16data.push(0xd800 | (value >> 10));
        utf16data.push(0xdc00 | (value & 0x3ff));
      }
    }
  }

  function decodeItem() {
    var initialByte = readUint8();
    var majorType = initialByte >> 5;
    var additionalInformation = initialByte & 0x1f;
    var i;
    var length;

    if (majorType === 7) {
      switch (additionalInformation) {
        case 25:
          return readFloat16();
        case 26:
          return readFloat32();
        case 27:
          return readFloat64();
      }
    }

    length = readLength(additionalInformation);
    if (length < 0 && (majorType < 2 || 6 < majorType))
      throw "Invalid length";

    switch (majorType) {
      case 0:
        return length;
      case 1:
        return -1 - length;
      case 2:
        if (length < 0) {
          var elements = [];
          var fullArrayLength = 0;
          while ((length = readIndefiniteStringLength(majorType)) >= 0) {
            fullArrayLength += length;
            elements.push(readArrayBuffer(length));
          }
          var fullArray = new Uint8Array(fullArrayLength);
          var fullArrayOffset = 0;
          for (i = 0; i < elements.length; ++i) {
            fullArray.set(elements[i], fullArrayOffset);
            fullArrayOffset += elements[i].length;
          }
          return fullArray;
        }
        return readArrayBuffer(length);
      case 3:
        var utf16data = [];
        if (length < 0) {
          while ((length = readIndefiniteStringLength(majorType)) >= 0)
            appendUtf16Data(utf16data, length);
        } else
          appendUtf16Data(utf16data, length);
        return String.fromCharCode.apply(null, utf16data);
      case 4:
        var retArray;
        if (length < 0) {
          retArray = [];
          while (!readBreak())
            retArray.push(decodeItem());
        } else {
          retArray = new Array(length);
          for (i = 0; i < length; ++i)
            retArray[i] = decodeItem();
        }
        return retArray;
      case 5:
        var retObject = {};
        for (i = 0; i < length || length < 0 && !readBreak(); ++i) {
          var key = decodeItem();
          retObject[key] = decodeItem();
        }
        return retObject;
      case 6:
        return tagger(decodeItem(), length);
      case 7:
        switch (length) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return undefined;
          default:
            return simpleValue(length);
        }
    }
  }

  var ret = decodeItem();
  if (offset !== data.byteLength)
    throw "Remaining bytes";
  return ret;
}

var obj = { encode: encode, decode: decode };

if (typeof define === "function" && define.amd)
  define("cbor/cbor", obj);
else if (typeof module !== "undefined" && module.exports)
  module.exports = obj;
else if (!global.CBOR)
  global.CBOR = obj;

})(this);

(()=>{"use strict";var e=Math.pow(2,31),r=Math.pow(2,7),t=Math.pow(2,14),n=Math.pow(2,21),o=Math.pow(2,28),i=Math.pow(2,35),s=Math.pow(2,42),a=Math.pow(2,49),c=Math.pow(2,56),h=Math.pow(2,63);const d={encode:function r(t,n,o){n=n||[];for(var i=o=o||0;t>=e;)n[o++]=255&t|128,t/=128;for(;-128&t;)n[o++]=255&t|128,t>>>=7;return n[o]=0|t,r.bytes=o-i+1,n},decode:function e(r,t){var n,o=0,i=0,s=t=t||0,a=r.length;do{if(s>=a)throw e.bytes=0,new RangeError("Could not decode varint");n=r[s++],o+=i<28?(127&n)<<i:(127&n)*Math.pow(2,i),i+=7}while(n>=128);return e.bytes=s-t,o},encodingLength:function(e){return e<r?1:e<t?2:e<n?3:e<o?4:e<i?5:e<s?6:e<a?7:e<c?8:e<h?9:10}},f=e=>[d.decode(e),d.decode.bytes],u=(e,r,t=0)=>(d.encode(e,r,t),r),p=e=>d.encodingLength(e),b=(new Uint8Array(0),e=>{if(e instanceof Uint8Array&&"Uint8Array"===e.constructor.name)return e;if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);throw new Error("Unknown type, must be binary type")});class l{constructor(e,r,t,n){this.code=e,this.size=r,this.digest=t,this.bytes=n}}class w{constructor(e,r,t){this.name=e,this.prefix=r,this.baseEncode=t}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class y{constructor(e,r,t){this.name=e,this.prefix=r,this.baseDecode=t}decode(e){if("string"==typeof e){if(e[0]===this.prefix)return this.baseDecode(e.slice(1));throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`)}throw Error("Can only multibase decode strings")}or(e){return m(this,e)}}class g{constructor(e){this.decoders=e}or(e){return m(this,e)}decode(e){const r=e[0],t=this.decoders[r];if(t)return t.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}const m=(e,r)=>new g({...e.decoders||{[e.prefix]:e},...r.decoders||{[r.prefix]:r}});class v{constructor(e,r,t,n){this.name=e,this.prefix=r,this.baseEncode=t,this.baseDecode=n,this.encoder=new w(e,r,t),this.decoder=new y(e,r,n)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}const C=({name:e,prefix:r,encode:t,decode:n})=>new v(e,r,t,n),x=({prefix:e,name:r,alphabet:t})=>{const{encode:n,decode:o}=function(e,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),n=0;n<t.length;n++)t[n]=255;for(var o=0;o<e.length;o++){var i=e.charAt(o),s=i.charCodeAt(0);if(255!==t[s])throw new TypeError(i+" is ambiguous");t[s]=o}var a=e.length,c=e.charAt(0),h=Math.log(a)/Math.log(256),d=Math.log(256)/Math.log(a);function f(e){if("string"!=typeof e)throw new TypeError("Expected String");if(0===e.length)return new Uint8Array;var r=0;if(" "!==e[r]){for(var n=0,o=0;e[r]===c;)n++,r++;for(var i=(e.length-r)*h+1>>>0,s=new Uint8Array(i);e[r];){var d=t[e.charCodeAt(r)];if(255===d)return;for(var f=0,u=i-1;(0!==d||f<o)&&-1!==u;u--,f++)d+=a*s[u]>>>0,s[u]=d%256>>>0,d=d/256>>>0;if(0!==d)throw new Error("Non-zero carry");o=f,r++}if(" "!==e[r]){for(var p=i-o;p!==i&&0===s[p];)p++;for(var b=new Uint8Array(n+(i-p)),l=n;p!==i;)b[l++]=s[p++];return b}}}return{encode:function(r){if(r instanceof Uint8Array||(ArrayBuffer.isView(r)?r=new Uint8Array(r.buffer,r.byteOffset,r.byteLength):Array.isArray(r)&&(r=Uint8Array.from(r))),!(r instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(0===r.length)return"";for(var t=0,n=0,o=0,i=r.length;o!==i&&0===r[o];)o++,t++;for(var s=(i-o)*d+1>>>0,h=new Uint8Array(s);o!==i;){for(var f=r[o],u=0,p=s-1;(0!==f||u<n)&&-1!==p;p--,u++)f+=256*h[p]>>>0,h[p]=f%a>>>0,f=f/a>>>0;if(0!==f)throw new Error("Non-zero carry");n=u,o++}for(var b=s-n;b!==s&&0===h[b];)b++;for(var l=c.repeat(t);b<s;++b)l+=e.charAt(h[b]);return l},decodeUnsafe:f,decode:function(e){var t=f(e);if(t)return t;throw new Error(`Non-${r} character`)}}}(t,r);return C({prefix:e,name:r,encode:n,decode:e=>b(o(e))})},E=({name:e,prefix:r,bitsPerChar:t,alphabet:n})=>C({prefix:r,name:e,encode:e=>((e,r,t)=>{const n="="===r[r.length-1],o=(1<<t)-1;let i="",s=0,a=0;for(let n=0;n<e.length;++n)for(a=a<<8|e[n],s+=8;s>t;)s-=t,i+=r[o&a>>s];if(s&&(i+=r[o&a<<t-s]),n)for(;i.length*t&7;)i+="=";return i})(e,n,t),decode:r=>((e,r,t,n)=>{const o={};for(let e=0;e<r.length;++e)o[r[e]]=e;let i=e.length;for(;"="===e[i-1];)--i;const s=new Uint8Array(i*t/8|0);let a=0,c=0,h=0;for(let r=0;r<i;++r){const i=o[e[r]];if(void 0===i)throw new SyntaxError(`Non-${n} character`);c=c<<t|i,a+=t,a>=8&&(a-=8,s[h++]=255&c>>a)}if(a>=t||255&c<<8-a)throw new SyntaxError("Unexpected end of data");return s})(r,n,t,e)}),A=x({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),D=(x({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),E({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}));E({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),E({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),E({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),E({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),E({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),E({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),E({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),E({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});class I{constructor(e,r,t,n){this.code=r,this.version=e,this.multihash=t,this.bytes=n,this.byteOffset=n.byteOffset,this.byteLength=n.byteLength,this.asCID=this,this._baseCache=new Map,Object.defineProperties(this,{byteOffset:$,byteLength:$,code:N,version:N,multihash:N,bytes:N,_baseCache:$,asCID:$})}toV0(){if(0===this.version)return this;{const{code:e,multihash:r}=this;if(e!==M)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==L)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return I.createV0(r)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,t=((e,r)=>{const t=r.byteLength,n=p(e),o=n+p(t),i=new Uint8Array(o+t);return u(e,i,0),u(t,i,n),i.set(r,o),new l(e,t,r,i)})(e,r);return I.createV1(this.code,t)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}equals(e){return e&&this.code===e.code&&this.version===e.version&&((r=this.multihash)===(t=e.multihash)||r.code===t.code&&r.size===t.size&&((e,r)=>{if(e===r)return!0;if(e.byteLength!==r.byteLength)return!1;for(let t=0;t<e.byteLength;t++)if(e[t]!==r[t])return!1;return!0})(r.bytes,t.bytes));var r,t}toString(e){const{bytes:r,version:t,_baseCache:n}=this;return 0===t?S(r,n,e||A.encoder):z(r,n,e||D.encoder)}toJSON(){return{code:this.code,version:this.version,hash:this.multihash.bytes}}get[Symbol.toStringTag](){return"CID"}[Symbol.for("nodejs.util.inspect.custom")](){return"CID("+this.toString()+")"}static isCID(e){return O(/^0\.0/,T),!(!e||!e[P]&&e.asCID!==e)}get toBaseEncodedString(){throw new Error("Deprecated, use .toString()")}get codec(){throw new Error('"codec" property is deprecated, use integer "code" property instead')}get buffer(){throw new Error("Deprecated .buffer property, use .bytes to get Uint8Array instead")}get multibaseName(){throw new Error('"multibaseName" property is deprecated')}get prefix(){throw new Error('"prefix" property is deprecated')}static asCID(e){if(e instanceof I)return e;if(null!=e&&e.asCID===e){const{version:r,code:t,multihash:n,bytes:o}=e;return new I(r,t,n,o||V(r,t,n.bytes))}if(null!=e&&!0===e[P]){const{version:r,multihash:t,code:n}=e,o=(e=>{const r=b(e),[t,n]=f(r),[o,i]=f(r.subarray(n)),s=r.subarray(n+i);if(s.byteLength!==o)throw new Error("Incorrect length");return new l(t,o,s,r)})(t);return I.create(r,n,o)}return null}static create(e,r,t){if("number"!=typeof r)throw new Error("String codecs are no longer supported");switch(e){case 0:if(r!==M)throw new Error(`Version 0 CID must use dag-pb (code: ${M}) block encoding`);return new I(e,r,t,t.bytes);case 1:{const n=V(e,r,t.bytes);return new I(e,r,t,n)}default:throw new Error("Invalid version")}}static createV0(e){return I.create(0,M,e)}static createV1(e,r){return I.create(1,e,r)}static decode(e){const[r,t]=I.decodeFirst(e);if(t.length)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=I.inspectBytes(e),t=r.size-r.multihashSize,n=b(e.subarray(t,t+r.multihashSize));if(n.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=n.subarray(r.multihashSize-r.digestSize),i=new l(r.multihashCode,r.digestSize,o,n);return[0===r.version?I.createV0(i):I.createV1(r.codec,i),e.subarray(r.size)]}static inspectBytes(e){let r=0;const t=()=>{const[t,n]=f(e.subarray(r));return r+=n,t};let n=t(),o=M;if(18===n?(n=0,r=0):1===n&&(o=t()),0!==n&&1!==n)throw new RangeError(`Invalid CID version ${n}`);const i=r,s=t(),a=t(),c=r+a;return{version:n,codec:o,multihashCode:s,digestSize:a,multihashSize:c-i,size:c}}static parse(e,r){const[t,n]=U(e,r),o=I.decode(n);return o._baseCache.set(t,e),o}}const U=(e,r)=>{switch(e[0]){case"Q":{const t=r||A;return[A.prefix,t.decode(`${A.prefix}${e}`)]}case A.prefix:{const t=r||A;return[A.prefix,t.decode(e)]}case D.prefix:{const t=r||D;return[D.prefix,t.decode(e)]}default:if(null==r)throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");return[e[0],r.decode(e)]}},S=(e,r,t)=>{const{prefix:n}=t;if(n!==A.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const o=r.get(n);if(null==o){const o=t.encode(e).slice(1);return r.set(n,o),o}return o},z=(e,r,t)=>{const{prefix:n}=t,o=r.get(n);if(null==o){const o=t.encode(e);return r.set(n,o),o}return o},M=112,L=18,V=(e,r,t)=>{const n=p(e),o=n+p(r),i=new Uint8Array(o+t.byteLength);return u(e,i,0),u(r,i,n),i.set(t,o),i},P=Symbol.for("@ipld/js-cid/CID"),N={writable:!1,configurable:!1,enumerable:!0},$={writable:!1,enumerable:!1,configurable:!1},O=(e,r)=>{if(!e.test("0.0.0-dev"))throw new Error(r);console.warn(r)},T="CID.isCID(v) is deprecated and will be removed in the next major release.\nFollowing code pattern:\n\nif (CID.isCID(value)) {\n  doSomethingWithCID(value)\n}\n\nIs replaced with:\n\nconst cid = CID.asCID(value)\nif (cid) {\n  // Make sure to use cid instead of value\n  doSomethingWithCID(cid)\n}\n";window.b2c=function(e){return I.decode(e)}})();