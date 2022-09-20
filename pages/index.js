import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import TopBg from "../svgs/TopBg.js";
import LookupBg from "../svgs/LookupBg.js";
import { Waypoint } from "react-waypoint";
import Slider from "react-slick";
import cbor from "cbor";

export default function Home(props) {
  const setPagePos = props.setPagePos;
  const homeRef = props.homeRef;
  const aboutRef = props.aboutRef;
  const abbreviateNumber = props.abbreviateNumber;
  const [queryString, setQueryString] = useState("");
  const optionsList = [
    "CID Contact",
    "FilSwan",
    "Ken Labs",
    "Leeway Hertz",
    "PiKniK",
    "SXX",
  ];
  const [selectedOption, setSelectedOption] = useState(0);

  const [displayData, setDisplayData] = useState();

  const [searchError, setSearchError] = useState();

  const [accordionState, setAccordionState] = useState(false);

  // Total Indexed
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalIndexedResponse, setTotalIndexedResponse] = useState();
  const [totalIndexed, setTotalIndexed] = useState();

  // Total Providers
  const [providerError, setProviderError] = useState(null);
  const [providerIsLoaded, setProviderIsLoaded] = useState(false);
  const [totalProvidersResponse, setTotalProvidersResponse] = useState();
  const [totalProviders, setTotalProviders] = useState();

  // Total Indexed nodes
  const [totalIndexerNodes, setTotalIndexerNodes] = useState();

  const [uptimeError, setUptimeError] = useState(null);
  const [uptimeIsLoaded, setUptimeIsLoaded] = useState(false);
  const [uptimeResponse, setUptimeResponse] = useState();
  const [uptime, setUptime] = useState();

  useEffect(() => {
    // Total Indexer Nodes
    setTotalIndexerNodes(optionsList.length);

    let root = "/";
    if (window.location != window.parent.location) {
      root = document.referrer;
    }

    // Total Indexed
    fetch(root + "/stats")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setTotalIndexedResponse(result);
          const totalIndexedResult = abbreviateNumber(
            totalIndexedResponse ? totalIndexedResponse.EntriesEstimate : 0
          );
          setTotalIndexed(totalIndexedResult);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );

    // Total Providers
    fetch(root + "/providers")
      .then((res) => res.json())
      .then(
        (result) => {
          setProviderIsLoaded(true);
          setTotalProvidersResponse(result);
        },
        (error) => {
          setProviderIsLoaded(true);
          setProviderError(error);
          setTotalProvidersResponse(0);
        }
      );

    if (totalProvidersResponse) {
      setTotalProviders(totalProvidersResponse.length);
    }

    // Uptime
    fetch(
      "https://api.uptimerobot.com/v2/getMonitors?api_key=ur1627161-9cac4a9b63c5d62559d8ef5b&monitors=791322928&custom_uptime_ratios=30&format=json&logs=1",
      {
        body: "api_key=ur1627161-9cac4a9b63c5d62559d8ef5b&monitors=791322928&custom_uptime_ratios=30&format=json&logs=1",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setUptimeIsLoaded(true);
          setUptimeResponse(result);
          if (result) {
            setUptime(result.monitors[0].custom_uptime_ratio);
          }
        },

        (error) => {
          setUptimeIsLoaded(true);
          setUptimeError(error);
        }
      );

    (() => {
      "use strict";
      var e = Math.pow(2, 31),
        r = Math.pow(2, 7),
        t = Math.pow(2, 14),
        n = Math.pow(2, 21),
        o = Math.pow(2, 28),
        i = Math.pow(2, 35),
        s = Math.pow(2, 42),
        a = Math.pow(2, 49),
        c = Math.pow(2, 56),
        h = Math.pow(2, 63);
      const d = {
          encode: function r(t, n, o) {
            n = n || [];
            for (var i = (o = o || 0); t >= e; )
              (n[o++] = (255 & t) | 128), (t /= 128);
            for (; -128 & t; ) (n[o++] = (255 & t) | 128), (t >>>= 7);
            return (n[o] = 0 | t), (r.bytes = o - i + 1), n;
          },
          decode: function e(r, t) {
            var n,
              o = 0,
              i = 0,
              s = (t = t || 0),
              a = r.length;
            do {
              if (s >= a)
                throw (
                  ((e.bytes = 0), new RangeError("Could not decode varint"))
                );
              (n = r[s++]),
                (o += i < 28 ? (127 & n) << i : (127 & n) * Math.pow(2, i)),
                (i += 7);
            } while (n >= 128);
            return (e.bytes = s - t), o;
          },
          encodingLength: function (e) {
            return e < r
              ? 1
              : e < t
              ? 2
              : e < n
              ? 3
              : e < o
              ? 4
              : e < i
              ? 5
              : e < s
              ? 6
              : e < a
              ? 7
              : e < c
              ? 8
              : e < h
              ? 9
              : 10;
          },
        },
        f = (e) => [d.decode(e), d.decode.bytes],
        u = (e, r, t = 0) => (d.encode(e, r, t), r),
        p = (e) => d.encodingLength(e),
        b =
          (new Uint8Array(0),
          (e) => {
            if (e instanceof Uint8Array && "Uint8Array" === e.constructor.name)
              return e;
            if (e instanceof ArrayBuffer) return new Uint8Array(e);
            if (ArrayBuffer.isView(e))
              return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
            throw new Error("Unknown type, must be binary type");
          });
      class l {
        constructor(e, r, t, n) {
          (this.code = e), (this.size = r), (this.digest = t), (this.bytes = n);
        }
      }
      class w {
        constructor(e, r, t) {
          (this.name = e), (this.prefix = r), (this.baseEncode = t);
        }
        encode(e) {
          if (e instanceof Uint8Array)
            return `${this.prefix}${this.baseEncode(e)}`;
          throw Error("Unknown type, must be binary type");
        }
      }
      class y {
        constructor(e, r, t) {
          (this.name = e), (this.prefix = r), (this.baseDecode = t);
        }
        decode(e) {
          if ("string" == typeof e) {
            if (e[0] === this.prefix) return this.baseDecode(e.slice(1));
            throw Error(
              `Unable to decode multibase string ${JSON.stringify(e)}, ${
                this.name
              } decoder only supports inputs prefixed with ${this.prefix}`
            );
          }
          throw Error("Can only multibase decode strings");
        }
        or(e) {
          return m(this, e);
        }
      }
      class g {
        constructor(e) {
          this.decoders = e;
        }
        or(e) {
          return m(this, e);
        }
        decode(e) {
          const r = e[0],
            t = this.decoders[r];
          if (t) return t.decode(e);
          throw RangeError(
            `Unable to decode multibase string ${JSON.stringify(
              e
            )}, only inputs prefixed with ${Object.keys(
              this.decoders
            )} are supported`
          );
        }
      }
      const m = (e, r) =>
        new g({
          ...(e.decoders || { [e.prefix]: e }),
          ...(r.decoders || { [r.prefix]: r }),
        });
      class v {
        constructor(e, r, t, n) {
          (this.name = e),
            (this.prefix = r),
            (this.baseEncode = t),
            (this.baseDecode = n),
            (this.encoder = new w(e, r, t)),
            (this.decoder = new y(e, r, n));
        }
        encode(e) {
          return this.encoder.encode(e);
        }
        decode(e) {
          return this.decoder.decode(e);
        }
      }
      const C = ({ name: e, prefix: r, encode: t, decode: n }) =>
          new v(e, r, t, n),
        x = ({ prefix: e, name: r, alphabet: t }) => {
          const { encode: n, decode: o } = (function (e, r) {
            if (e.length >= 255) throw new TypeError("Alphabet too long");
            for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
              t[n] = 255;
            for (var o = 0; o < e.length; o++) {
              var i = e.charAt(o),
                s = i.charCodeAt(0);
              if (255 !== t[s]) throw new TypeError(i + " is ambiguous");
              t[s] = o;
            }
            var a = e.length,
              c = e.charAt(0),
              h = Math.log(a) / Math.log(256),
              d = Math.log(256) / Math.log(a);
            function f(e) {
              if ("string" != typeof e) throw new TypeError("Expected String");
              if (0 === e.length) return new Uint8Array();
              var r = 0;
              if (" " !== e[r]) {
                for (var n = 0, o = 0; e[r] === c; ) n++, r++;
                for (
                  var i = ((e.length - r) * h + 1) >>> 0, s = new Uint8Array(i);
                  e[r];

                ) {
                  var d = t[e.charCodeAt(r)];
                  if (255 === d) return;
                  for (
                    var f = 0, u = i - 1;
                    (0 !== d || f < o) && -1 !== u;
                    u--, f++
                  )
                    (d += (a * s[u]) >>> 0),
                      (s[u] = d % 256 >>> 0),
                      (d = (d / 256) >>> 0);
                  if (0 !== d) throw new Error("Non-zero carry");
                  (o = f), r++;
                }
                if (" " !== e[r]) {
                  for (var p = i - o; p !== i && 0 === s[p]; ) p++;
                  for (var b = new Uint8Array(n + (i - p)), l = n; p !== i; )
                    b[l++] = s[p++];
                  return b;
                }
              }
            }
            return {
              encode: function (r) {
                if (
                  (r instanceof Uint8Array ||
                    (ArrayBuffer.isView(r)
                      ? (r = new Uint8Array(
                          r.buffer,
                          r.byteOffset,
                          r.byteLength
                        ))
                      : Array.isArray(r) && (r = Uint8Array.from(r))),
                  !(r instanceof Uint8Array))
                )
                  throw new TypeError("Expected Uint8Array");
                if (0 === r.length) return "";
                for (
                  var t = 0, n = 0, o = 0, i = r.length;
                  o !== i && 0 === r[o];

                )
                  o++, t++;
                for (
                  var s = ((i - o) * d + 1) >>> 0, h = new Uint8Array(s);
                  o !== i;

                ) {
                  for (
                    var f = r[o], u = 0, p = s - 1;
                    (0 !== f || u < n) && -1 !== p;
                    p--, u++
                  )
                    (f += (256 * h[p]) >>> 0),
                      (h[p] = f % a >>> 0),
                      (f = (f / a) >>> 0);
                  if (0 !== f) throw new Error("Non-zero carry");
                  (n = u), o++;
                }
                for (var b = s - n; b !== s && 0 === h[b]; ) b++;
                for (var l = c.repeat(t); b < s; ++b) l += e.charAt(h[b]);
                return l;
              },
              decodeUnsafe: f,
              decode: function (e) {
                var t = f(e);
                if (t) return t;
                throw new Error(`Non-${r} character`);
              },
            };
          })(t, r);
          return C({ prefix: e, name: r, encode: n, decode: (e) => b(o(e)) });
        },
        E = ({ name: e, prefix: r, bitsPerChar: t, alphabet: n }) =>
          C({
            prefix: r,
            name: e,
            encode: (e) =>
              ((e, r, t) => {
                const n = "=" === r[r.length - 1],
                  o = (1 << t) - 1;
                let i = "",
                  s = 0,
                  a = 0;
                for (let n = 0; n < e.length; ++n)
                  for (a = (a << 8) | e[n], s += 8; s > t; )
                    (s -= t), (i += r[o & (a >> s)]);
                if ((s && (i += r[o & (a << (t - s))]), n))
                  for (; (i.length * t) & 7; ) i += "=";
                return i;
              })(e, n, t),
            decode: (r) =>
              ((e, r, t, n) => {
                const o = {};
                for (let e = 0; e < r.length; ++e) o[r[e]] = e;
                let i = e.length;
                for (; "=" === e[i - 1]; ) --i;
                const s = new Uint8Array(((i * t) / 8) | 0);
                let a = 0,
                  c = 0,
                  h = 0;
                for (let r = 0; r < i; ++r) {
                  const i = o[e[r]];
                  if (void 0 === i) throw new SyntaxError(`Non-${n} character`);
                  (c = (c << t) | i),
                    (a += t),
                    a >= 8 && ((a -= 8), (s[h++] = 255 & (c >> a)));
                }
                if (a >= t || 255 & (c << (8 - a)))
                  throw new SyntaxError("Unexpected end of data");
                return s;
              })(r, n, t, e),
          }),
        A = x({
          name: "base58btc",
          prefix: "z",
          alphabet:
            "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
        }),
        D =
          (x({
            name: "base58flickr",
            prefix: "Z",
            alphabet:
              "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
          }),
          E({
            prefix: "b",
            name: "base32",
            alphabet: "abcdefghijklmnopqrstuvwxyz234567",
            bitsPerChar: 5,
          }));
      E({
        prefix: "B",
        name: "base32upper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        bitsPerChar: 5,
      }),
        E({
          prefix: "c",
          name: "base32pad",
          alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
          bitsPerChar: 5,
        }),
        E({
          prefix: "C",
          name: "base32padupper",
          alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
          bitsPerChar: 5,
        }),
        E({
          prefix: "v",
          name: "base32hex",
          alphabet: "0123456789abcdefghijklmnopqrstuv",
          bitsPerChar: 5,
        }),
        E({
          prefix: "V",
          name: "base32hexupper",
          alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
          bitsPerChar: 5,
        }),
        E({
          prefix: "t",
          name: "base32hexpad",
          alphabet: "0123456789abcdefghijklmnopqrstuv=",
          bitsPerChar: 5,
        }),
        E({
          prefix: "T",
          name: "base32hexpadupper",
          alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
          bitsPerChar: 5,
        }),
        E({
          prefix: "h",
          name: "base32z",
          alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
          bitsPerChar: 5,
        });
      class I {
        constructor(e, r, t, n) {
          (this.code = r),
            (this.version = e),
            (this.multihash = t),
            (this.bytes = n),
            (this.byteOffset = n.byteOffset),
            (this.byteLength = n.byteLength),
            (this.asCID = this),
            (this._baseCache = new Map()),
            Object.defineProperties(this, {
              byteOffset: $,
              byteLength: $,
              code: N,
              version: N,
              multihash: N,
              bytes: N,
              _baseCache: $,
              asCID: $,
            });
        }
        toV0() {
          if (0 === this.version) return this;
          {
            const { code: e, multihash: r } = this;
            if (e !== M)
              throw new Error("Cannot convert a non dag-pb CID to CIDv0");
            if (r.code !== L)
              throw new Error(
                "Cannot convert non sha2-256 multihash CID to CIDv0"
              );
            return I.createV0(r);
          }
        }
        toV1() {
          switch (this.version) {
            case 0: {
              const { code: e, digest: r } = this.multihash,
                t = ((e, r) => {
                  const t = r.byteLength,
                    n = p(e),
                    o = n + p(t),
                    i = new Uint8Array(o + t);
                  return u(e, i, 0), u(t, i, n), i.set(r, o), new l(e, t, r, i);
                })(e, r);
              return I.createV1(this.code, t);
            }
            case 1:
              return this;
            default:
              throw Error(
                `Can not convert CID version ${this.version} to version 0. This is a bug please report`
              );
          }
        }
        equals(e) {
          return (
            e &&
            this.code === e.code &&
            this.version === e.version &&
            ((r = this.multihash) === (t = e.multihash) ||
              (r.code === t.code &&
                r.size === t.size &&
                ((e, r) => {
                  if (e === r) return !0;
                  if (e.byteLength !== r.byteLength) return !1;
                  for (let t = 0; t < e.byteLength; t++)
                    if (e[t] !== r[t]) return !1;
                  return !0;
                })(r.bytes, t.bytes)))
          );
          var r, t;
        }
        toString(e) {
          const { bytes: r, version: t, _baseCache: n } = this;
          return 0 === t ? S(r, n, e || A.encoder) : z(r, n, e || D.encoder);
        }
        toJSON() {
          return {
            code: this.code,
            version: this.version,
            hash: this.multihash.bytes,
          };
        }
        get [Symbol.toStringTag]() {
          return "CID";
        }
        [Symbol.for("nodejs.util.inspect.custom")]() {
          return "CID(" + this.toString() + ")";
        }
        static isCID(e) {
          return O(/^0\.0/, T), !(!e || (!e[P] && e.asCID !== e));
        }
        get toBaseEncodedString() {
          throw new Error("Deprecated, use .toString()");
        }
        get codec() {
          throw new Error(
            '"codec" property is deprecated, use integer "code" property instead'
          );
        }
        get buffer() {
          throw new Error(
            "Deprecated .buffer property, use .bytes to get Uint8Array instead"
          );
        }
        get multibaseName() {
          throw new Error('"multibaseName" property is deprecated');
        }
        get prefix() {
          throw new Error('"prefix" property is deprecated');
        }
        static asCID(e) {
          if (e instanceof I) return e;
          if (null != e && e.asCID === e) {
            const { version: r, code: t, multihash: n, bytes: o } = e;
            return new I(r, t, n, o || V(r, t, n.bytes));
          }
          if (null != e && !0 === e[P]) {
            const { version: r, multihash: t, code: n } = e,
              o = ((e) => {
                const r = b(e),
                  [t, n] = f(r),
                  [o, i] = f(r.subarray(n)),
                  s = r.subarray(n + i);
                if (s.byteLength !== o) throw new Error("Incorrect length");
                return new l(t, o, s, r);
              })(t);
            return I.create(r, n, o);
          }
          return null;
        }
        static create(e, r, t) {
          if ("number" != typeof r)
            throw new Error("String codecs are no longer supported");
          switch (e) {
            case 0:
              if (r !== M)
                throw new Error(
                  `Version 0 CID must use dag-pb (code: ${M}) block encoding`
                );
              return new I(e, r, t, t.bytes);
            case 1: {
              const n = V(e, r, t.bytes);
              return new I(e, r, t, n);
            }
            default:
              throw new Error("Invalid version");
          }
        }
        static createV0(e) {
          return I.create(0, M, e);
        }
        static createV1(e, r) {
          return I.create(1, e, r);
        }
        static decode(e) {
          const [r, t] = I.decodeFirst(e);
          if (t.length) throw new Error("Incorrect length");
          return r;
        }
        static decodeFirst(e) {
          const r = I.inspectBytes(e),
            t = r.size - r.multihashSize,
            n = b(e.subarray(t, t + r.multihashSize));
          if (n.byteLength !== r.multihashSize)
            throw new Error("Incorrect length");
          const o = n.subarray(r.multihashSize - r.digestSize),
            i = new l(r.multihashCode, r.digestSize, o, n);
          return [
            0 === r.version ? I.createV0(i) : I.createV1(r.codec, i),
            e.subarray(r.size),
          ];
        }
        static inspectBytes(e) {
          let r = 0;
          const t = () => {
            const [t, n] = f(e.subarray(r));
            return (r += n), t;
          };
          let n = t(),
            o = M;
          if (
            (18 === n ? ((n = 0), (r = 0)) : 1 === n && (o = t()),
            0 !== n && 1 !== n)
          )
            throw new RangeError(`Invalid CID version ${n}`);
          const i = r,
            s = t(),
            a = t(),
            c = r + a;
          return {
            version: n,
            codec: o,
            multihashCode: s,
            digestSize: a,
            multihashSize: c - i,
            size: c,
          };
        }
        static parse(e, r) {
          const [t, n] = U(e, r),
            o = I.decode(n);
          return o._baseCache.set(t, e), o;
        }
      }
      const U = (e, r) => {
          switch (e[0]) {
            case "Q": {
              const t = r || A;
              return [A.prefix, t.decode(`${A.prefix}${e}`)];
            }
            case A.prefix: {
              const t = r || A;
              return [A.prefix, t.decode(e)];
            }
            case D.prefix: {
              const t = r || D;
              return [D.prefix, t.decode(e)];
            }
            default:
              if (null == r)
                throw Error(
                  "To parse non base32 or base58btc encoded CID multibase decoder must be provided"
                );
              return [e[0], r.decode(e)];
          }
        },
        S = (e, r, t) => {
          const { prefix: n } = t;
          if (n !== A.prefix)
            throw Error(`Cannot string encode V0 in ${t.name} encoding`);
          const o = r.get(n);
          if (null == o) {
            const o = t.encode(e).slice(1);
            return r.set(n, o), o;
          }
          return o;
        },
        z = (e, r, t) => {
          const { prefix: n } = t,
            o = r.get(n);
          if (null == o) {
            const o = t.encode(e);
            return r.set(n, o), o;
          }
          return o;
        },
        M = 112,
        L = 18,
        V = (e, r, t) => {
          const n = p(e),
            o = n + p(r),
            i = new Uint8Array(o + t.byteLength);
          return u(e, i, 0), u(r, i, n), i.set(t, o), i;
        },
        P = Symbol.for("@ipld/js-cid/CID"),
        N = { writable: !1, configurable: !1, enumerable: !0 },
        $ = { writable: !1, enumerable: !1, configurable: !1 },
        O = (e, r) => {
          if (!e.test("0.0.0-dev")) throw new Error(r);
          console.warn(r);
        },
        T =
          "CID.isCID(v) is deprecated and will be removed in the next major release.\nFollowing code pattern:\n\nif (CID.isCID(value)) {\n  doSomethingWithCID(value)\n}\n\nIs replaced with:\n\nconst cid = CID.asCID(value)\nif (cid) {\n  // Make sure to use cid instead of value\n  doSomethingWithCID(cid)\n}\n";
      window.b2c = function (e) {
        return I.decode(e);
      };
    })();
  }, [totalIndexed, totalIndexerNodes, uptime]);

  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>CID Contact</title>
        <meta
          name="description"
          content="An Interplanetary Network Indexer built for IPFS and Filecoin"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon-16x16.png"
        />
        <link rel="manifest" href="site.webmanifest" />
        <link rel="mask-icon" href="safari-pinned-tab.svg" color="#6abcfe" />
        <link rel="shortcut icon" href="favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main>
        <Waypoint
          onEnter={() => handelHomeEnter(setPagePos)}
          //onLeave={() => handelHomeLeave(setPagePos)}
        >
          <section className="hero" ref={homeRef}>
            <h2>Content Routing for the Distributed Web</h2>
            <p>An Interplanetary Network Indexer built for IPFS and Filecoin</p>
            <div className="dataRow">
              <div className={totalIndexed ? "dataCol" : "hidden"}>
                <div className="innerWrapper">
                  <div className="box">
                    <div className="textWrapper">
                      <p>
                        <strong>{totalIndexed && totalIndexed}</strong>
                        Total CIDs Indexed
                      </p>
                    </div>
                    <div className="bgImage"></div>
                  </div>
                </div>
              </div>
              <div className={totalProviders ? "dataCol" : "hidden"}>
                <div className="innerWrapper">
                  <div className="box">
                    <div className="textWrapper">
                      <p>
                        <strong>{totalProviders && totalProviders}</strong>
                        Total Number of Providers
                      </p>
                    </div>
                    <div className="bgImage"></div>
                  </div>
                </div>
              </div>
              <div className="dataCol">
                <div className="innerWrapper">
                  <div className="box">
                    <div className="textWrapper">
                      <p>
                        <strong>
                          {totalIndexerNodes && totalIndexerNodes}
                        </strong>
                        Number of Indexer Node Operators
                      </p>
                    </div>
                    <div className="bgImage"></div>
                  </div>
                </div>
              </div>
              <div className="dataCol">
                <div className="innerWrapper">
                  <div className="box">
                    <div className="textWrapper">
                      <p>
                        <strong>{uptime && uptime}</strong>
                        Uptime in the last 30 days
                      </p>
                    </div>
                    <div className="bgImage"></div>
                  </div>
                </div>
              </div>
            </div>
            <TopBg />
          </section>
        </Waypoint>
        <section
          className={
            accordionState && !searchError ? "results active" : "results"
          }
        >
          <div className="container">
            <h3>Look up your CID</h3>
            <div className="formRow">
              <div className="inputWrapper">
                <input
                  type="text"
                  name="queryString"
                  id="queryString"
                  placeholder="bafybeigvgzoolc3drupxhlevdp2ugqcrbcsqfmcek2zxiw5wctk3xjpjwy"
                  value={queryString}
                  onChange={(e) => {
                    setQueryString(e.target.value);
                    setSearchError();
                  }}
                />
              </div>
              <CustomSelect
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                optionsList={optionsList}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  handelSearch(
                    queryString,
                    optionsList,
                    selectedOption,
                    displayData,
                    setDisplayData,
                    accordionState,
                    setAccordionState,
                    setSearchError
                  )
                }
              >
                <span>Contact</span>
              </button>
            </div>

            {searchError ? (
              <p className="errorNotice">{searchError}</p>
            ) : (
              <div className="accordionWrapper">
                <button
                  type="button"
                  onClick={() =>
                    toggleAccordion(accordionState, setAccordionState)
                  }
                  className={
                    accordionState
                      ? "accordion-button collapsed"
                      : "accordion-button"
                  }
                >
                  <span></span> Results{" "}
                </button>
                <div
                  className={
                    accordionState
                      ? "accordion-collapse show"
                      : "accordion-collapse"
                  }
                >
                  <>
                    {displayData &&
                      displayData.map((dataResult, resultIndex) => (
                        <div className="resultItem" key={resultIndex}>
                          <h4>Found At</h4>
                          <dl>
                            <dt>Peer Id:</dt>
                            <dd>{dataResult.Provider.ID}</dd>

                            <dt>Multiaddress:</dt>
                            <dd>{dataResult.Provider.Addrs}</dd>

                            {dataResult.Protocol && (
                              <>
                                <dt>Protocol:</dt>
                                <dd>{dataResult.Protocol}</dd>
                              </>
                            )}

                            {dataResult.DealInfo && (
                              <>
                                <dt>Deal Info:</dt>
                                <dd>
                                  {dataResult.DealInfo.map(
                                    (dealInfo, dIndex) => (
                                      <span key={dIndex}>
                                        {dealInfo}
                                        <br />
                                      </span>
                                    )
                                  )}
                                </dd>
                              </>
                            )}
                          </dl>
                        </div>
                      ))}
                  </>
                </div>
              </div>
            )}
          </div>
          <LookupBg />
        </section>
        <Waypoint
          onEnter={() => handelAboutEnter(setPagePos)}
          //onLeave={() => handelAboutLeave(setPagePos)}
        >
          <section className="about" ref={aboutRef}>
            <div className="container">
              <h3>About CID Contact</h3>
              <Row>
                <Col xs={12} md={4} className="imgCol pe-md-5 mb-5 mb-md-0">
                  <img src="images/about-1.svg" alt="Map" />
                </Col>
                <Col xs={12} md={8} className="textCol">
                  <p>
                    <strong>Content routing</strong> is the a term used to
                    describe the problem of finding providers for a given piece
                    of content. If you have a hash, or CID of some data, how do
                    you find who has it in the IPFS and Filecoin system?
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4} className="imgCol pe-md-5 mb-5 mb-md-0">
                  <img src="images/about-2.svg" alt="Solarsystem" />
                </Col>
                <Col xs={12} md={8} className="textCol">
                  <p>
                    In IPFS, a <strong>Distributed Hash Table</strong> (DHT) is
                    used as a decentralized answer to content routing. However,
                    when considering the number of records in Filecoin storage
                    providers, it is clear that simply announcing these records
                    to the DHT will place an undue burden on current DHT
                    participants. It will take too much bandwidth and storage
                    space to be practical.
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4} className="imgCol pe-md-5 mb-5 mb-md-0">
                  <img src="images/about-3.svg" alt="Connected Circles" />
                </Col>
                <Col xs={12} md={8} className="textCol">
                  <p>
                    CID Contact encompasses a number of work streams to increase
                    the scalability and resilience of content routing.{" "}
                    <strong>Network Indexer</strong> provides aggregated views
                    of content routing, and harness the heterogeneity of network
                    resources. <strong>Delegated Content Routing</strong>{" "}
                    defines protocols for multiple content routing providers to
                    be discovered and used safely, efficiently, and in a
                    decentralized manner by clients.
                  </p>
                </Col>
              </Row>

              <h3>Partners</h3>

              <Slider {...settings}>
                <a
                  href="https://kencloud.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="images/kenLabs.svg" alt="Ken Labs Logo" />
                </a>
                <a
                  href="https://www.leewayhertz.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="images/LeewayHertz.svg" alt="Leeway Hertz Logo" />
                </a>
                <a
                  href="https://www.piknik.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="images/PiKNiK.svg" alt="PiKNiK Logo" />
                </a>
                <a
                  href="https://www.filswan.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="images/FilSwan-logo.svg" alt="FilSwan Logo" />
                </a>
                <a
                  href="https://www.sxxfuture.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="images/SanXiaXingFutureData.svg"
                    alt="San Xia Xing Future Data Logo"
                  />
                </a>
                <a href="https://infura.io/" target="_blank" rel="noreferrer">
                  <img src="images/Infura.svg" alt="Infura Logo" />
                </a>
                <a
                  href="https://www.cloudflare.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="images/Cloudflare.svg" alt="Cloudflare Logo" />
                </a>
              </Slider>
            </div>
          </section>
        </Waypoint>
      </main>
    </>
  );
}

const CustomSelect = (props) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const setSelectedThenCloseDropdown = (index) => {
    props.setSelectedOption(index);
    setIsOptionsOpen(false);
  };

  const handleKeyDown = (index) => (e) => {
    switch (e.key) {
      case " ":
      case "SpaceBar":
      case "Enter":
        e.preventDefault();
        setSelectedThenCloseDropdown(index);
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (e) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOptionsOpen(false);
        break;
      case "ArrowUp":
        e.preventDefault();
        props.setSelectedOption(
          props.selectedOption - 1 >= 0
            ? props.selectedOption - 1
            : props.optionsList.length - 1
        );
        break;
      case "ArrowDown":
        e.preventDefault();
        props.setSelectedOption(
          props.selectedOption == props.optionsList.length - 1
            ? 0
            : props.selectedOption + 1
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="selectWrapper">
      <div className="selectContainer">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOptionsOpen}
          className={isOptionsOpen ? "expanded" : ""}
          onClick={toggleOptions}
          onKeyDown={handleListKeyDown}
        >
          {props.optionsList[props.selectedOption]}
        </button>
        <ul
          className={`options ${isOptionsOpen ? "show" : ""}`}
          role="listbox"
          aria-activedescendant={props.optionsList[props.selectedOption]}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {props.optionsList.map((option, index) => (
            <li
              id={option}
              role="option"
              aria-selected={props.selectedOption == index}
              tabIndex={0}
              onKeyDown={handleKeyDown(index)}
              onClick={() => {
                setSelectedThenCloseDropdown(index);
              }}
              key={index}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// varint decoding
var MSB = 0x80,
  REST = 0x7f;

function readVarint(buf, offset) {
  var res = 0,
    offset = offset || 0,
    shift = 0,
    counter = offset,
    b,
    l = buf.length;

  do {
    if (counter >= l || shift > 49) {
      throw new RangeError("Could not decode varint");
    }
    b = buf[counter++];
    res += shift < 28 ? (b & REST) << shift : (b & REST) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB);

  return [res, counter - offset];
}

function joinPath(a, b) {
  return (a[a.length - 1] === "/" ? a : a + "/") + b;
}

function onSearch(
  queryString,
  optionsList,
  selectedOption,
  displayData,
  setDisplayData,
  setSearchError
) {
  let sb = queryString;
  if (sb == "") {
    sb = "bafybeigvgzoolc3drupxhlevdp2ugqcrbcsqfmcek2zxiw5wctk3xjpjwy";
  }

  const endpoints = [
    "https://cid.contact",
    "https://filecoin-indexer.filswan.com",
    "https://index-finder.kencloud.com",
    " https://i.dltstack.co",
    "https://filecoin-indexer.piknik.com:3443",
    "https://filecoin-indexer.sxxfuture.com:33005",
  ];

  const endpoint = endpoints[selectedOption];

  fetch(`${joinPath(endpoint, "cid")}/${sb}`)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else if (response.status == 404) {
        throw "No results for this query";
      } else if (response.status == 400) {
        throw "Bad request - check that the CID is correct";
      } else {
        throw Error(response.statusText);
      }
    })
    .then((data) => {
      const res = data.MultihashResults[0];
      const test = res.ProviderResults;

      let providers = {};
      for (let i = 0; i < res.ProviderResults.length; i++) {
        let provider = res.ProviderResults[i];
        if (providers[provider.Provider.ID] == undefined) {
          providers[provider.Provider.ID] = {};
        }
        providers[provider.Provider.ID][provider.ContextID] = provider;
      }
      const pids = Object.keys(providers);

      for (let i = 0; i < pids.length; i++) {
        let pd = providers[pids[i]];
        let addrs = "";
        let keys = {};
        let contexts = Object.keys(pd);
        for (let j = 0; j < contexts.length; j++) {
          let mdBytes = base64ToBytesArr(pd[contexts[j]].Metadata);
          while (mdBytes.length > 0) {
            let next = popProtocol(mdBytes);
            let name = next[0];
            mdBytes = next[1];
            let ctx = toContext(name, mdBytes);
            if (keys[name] == undefined) {
              keys[name] = [];
            }
            if (ctx[0] != "") {
              keys[name].push(ctx[0]);
            }
            mdBytes = ctx[1];
            addrs = pd[contexts[j]].Provider.Addrs;
            if (name == -1) {
              break;
            }
          }
        }
        let newArr = [...test];

        for (const [index, value] of Object.keys(keys).entries()) {
          newArr[i]["Protocol"] = value;

          const deals = [];
          for (const [dealIndex, dealValue] of keys[
            Object.keys(keys)
          ].entries()) {
            deals.push(dealValue);
          }
          if (deals.length) {
            newArr[i].DealInfo = deals;
          }
        }
        setDisplayData(newArr);
      }
    })
    .catch((error) => {
      setSearchError(error);
    });
}

function popProtocol(buf) {
  try {
    let [code, Vlen] = readVarint(buf, 0);
    buf = buf.slice(Vlen);
    if (code == 0x900) {
      return ["Bitswap", buf];
    } else if (code == 0x910 || code == 4128768) {
      return ["Graphsync", buf];
    } else {
      return [code, buf];
    }
  } catch (e) {
    return [-1, buf];
  }
}
function toContext(code, buf) {
  if (code == "Graphsync") {
    try {
      const cborData = cbor.decodeFirstSync(Uint8Array.from(buf).buffer);
      const cid = window.b2c(
        Uint8Array.from(cborData.PieceCID.value).subarray(1)
      );
      let str = "In piece " + cid.toString();
      if (cborData.VerifiedDeal) {
        str += " (Stored as verified data)";
      }
      if (cborData.FastRetrieval) {
        str += " (Unsealed copy available)";
      }
      return [str, Uint8Array.from([])];
    } catch (e) {
      return ["Non-CBOR Context:" + e, buf];
    }
  }
  return ["", buf];
}
const abc = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
];
function base64ToBytesArr(str) {
  let result = [];
  for (let i = 0; i < str.length / 4; i++) {
    let chunk = [...str.slice(4 * i, 4 * i + 4)];
    let bin = chunk
      .map((x) => abc.indexOf(x).toString(2).padStart(6, 0))
      .join("");
    let bytes = bin.match(/.{1,8}/g).map((x) => +("0b" + x));
    result.push(
      ...bytes.slice(0, 3 - (str[4 * i + 2] == "=") - (str[4 * i + 3] == "="))
    );
  }
  return result;
}

function handelSearch(
  queryString,
  optionsList,
  selectedOption,
  displayData,
  setDisplayData,
  accordionState,
  setAccordionState,
  setSearchError
) {
  onSearch(
    queryString,
    optionsList,
    selectedOption,
    displayData,
    setDisplayData,
    setSearchError
  );
  !accordionState && toggleAccordion(accordionState, setAccordionState);
}

function toggleAccordion(accordionState, setAccordionState) {
  setTimeout(() => {
    const parentDiv = document.querySelector(".accordion-collapse");
    if (parentDiv.children.length > 0) {
      accordionState ? setAccordionState(false) : setAccordionState(true);
    }
  }, 250);
}

function handelHomeEnter(setPagePos) {
  setPagePos("home");
}
function handelHomeLeave(setPagePos) {
  setPagePos("");
}
function handelAboutEnter(setPagePos) {
  setPagePos("about");
}
function handelAboutLeave(setPagePos) {
  setPagePos("");
}
