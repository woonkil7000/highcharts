/*
 Highcharts JS v10.0.0 (2022-03-07)

 Boost module

 (c) 2010-2021 Highsoft AS
 Author: Torstein Honsi

 License: www.highcharts.com/license

*/
(function (b) {
    "object" === typeof module && module.exports ? (b["default"] = b, module.exports = b) : "function" === typeof define && define.amd ? define("highcharts/modules/boost", ["highcharts"], function (p) {
        b(p);
        b.Highcharts = p;
        return b
    }) : b("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (b) {
    function p(b, x, y, k) {
        b.hasOwnProperty(x) || (b[x] = k.apply(null, y), "function" === typeof CustomEvent && window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", {
            detail: {
                path: x,
                module: b[x]
            }
        })))
    }

    b = b ? b._modules : {};
    p(b, "Extensions/Boost/Boostables.js",
        [], function () {
            return "area areaspline arearange column columnrange bar line scatter heatmap bubble treemap".split(" ")
        });
    p(b, "Extensions/Boost/BoostableMap.js", [b["Extensions/Boost/Boostables.js"]], function (b) {
        var w = {};
        b.forEach(function (b) {
            w[b] = 1
        });
        return w
    });
    p(b, "Extensions/Boost/WGLShader.js", [b["Core/Utilities.js"]], function (b) {
        var w = b.clamp, y = b.error, k = b.pick;
        return function (c) {
            function b() {
                A.length && y("[highcharts boost] shader error - " + A.join("\n"))
            }

            function x(a, e) {
                var f = c.createShader("vertex" ===
                e ? c.VERTEX_SHADER : c.FRAGMENT_SHADER);
                c.shaderSource(f, a);
                c.compileShader(f);
                return c.getShaderParameter(f, c.COMPILE_STATUS) ? f : (A.push("when compiling " + e + " shader:\n" + c.getShaderInfoLog(f)), !1)
            }

            function n() {
                function f(a) {
                    return c.getUniformLocation(h, a)
                }

                var r = x("#version 100\n#define LN10 2.302585092994046\nprecision highp float;\nattribute vec4 aVertexPosition;\nattribute vec4 aColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform mat4 uPMatrix;\nuniform float pSize;\nuniform float translatedThreshold;\nuniform bool hasThreshold;\nuniform bool skipTranslation;\nuniform float xAxisTrans;\nuniform float xAxisMin;\nuniform float xAxisMinPad;\nuniform float xAxisPointRange;\nuniform float xAxisLen;\nuniform bool  xAxisPostTranslate;\nuniform float xAxisOrdinalSlope;\nuniform float xAxisOrdinalOffset;\nuniform float xAxisPos;\nuniform bool  xAxisCVSCoord;\nuniform bool  xAxisIsLog;\nuniform bool  xAxisReversed;\nuniform float yAxisTrans;\nuniform float yAxisMin;\nuniform float yAxisMinPad;\nuniform float yAxisPointRange;\nuniform float yAxisLen;\nuniform bool  yAxisPostTranslate;\nuniform float yAxisOrdinalSlope;\nuniform float yAxisOrdinalOffset;\nuniform float yAxisPos;\nuniform bool  yAxisCVSCoord;\nuniform bool  yAxisIsLog;\nuniform bool  yAxisReversed;\nuniform bool  isBubble;\nuniform bool  bubbleSizeByArea;\nuniform float bubbleZMin;\nuniform float bubbleZMax;\nuniform float bubbleZThreshold;\nuniform float bubbleMinSize;\nuniform float bubbleMaxSize;\nuniform bool  bubbleSizeAbs;\nuniform bool  isInverted;\nfloat bubbleRadius(){\nfloat value = aVertexPosition.w;\nfloat zMax = bubbleZMax;\nfloat zMin = bubbleZMin;\nfloat radius = 0.0;\nfloat pos = 0.0;\nfloat zRange = zMax - zMin;\nif (bubbleSizeAbs){\nvalue = value - bubbleZThreshold;\nzMax = max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);\nzMin = 0.0;\n}\nif (value < zMin){\nradius = bubbleZMin / 2.0 - 1.0;\n} else {\npos = zRange > 0.0 ? (value - zMin) / zRange : 0.5;\nif (bubbleSizeByArea && pos > 0.0){\npos = sqrt(pos);\n}\nradius = ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;\n}\nreturn radius * 2.0;\n}\nfloat translate(float val,\nfloat pointPlacement,\nfloat localA,\nfloat localMin,\nfloat minPixelPadding,\nfloat pointRange,\nfloat len,\nbool  cvsCoord,\nbool  isLog,\nbool  reversed\n){\nfloat sign = 1.0;\nfloat cvsOffset = 0.0;\nif (cvsCoord) {\nsign *= -1.0;\ncvsOffset = len;\n}\nif (isLog) {\nval = log(val) / LN10;\n}\nif (reversed) {\nsign *= -1.0;\ncvsOffset -= sign * len;\n}\nreturn sign * (val - localMin) * localA + cvsOffset + \n(sign * minPixelPadding);\n}\nfloat xToPixels(float value) {\nif (skipTranslation){\nreturn value;// + xAxisPos;\n}\nreturn translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord, xAxisIsLog, xAxisReversed);// + xAxisPos;\n}\nfloat yToPixels(float value, float checkTreshold) {\nfloat v;\nif (skipTranslation){\nv = value;// + yAxisPos;\n} else {\nv = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord, yAxisIsLog, yAxisReversed);// + yAxisPos;\nif (v > yAxisLen) {\nv = yAxisLen;\n}\n}\nif (checkTreshold > 0.0 && hasThreshold) {\nv = min(v, translatedThreshold);\n}\nreturn v;\n}\nvoid main(void) {\nif (isBubble){\ngl_PointSize = bubbleRadius();\n} else {\ngl_PointSize = pSize;\n}\nvColor = aColor;\nif (skipTranslation && isInverted) {\ngl_Position = uPMatrix * vec4(aVertexPosition.y + yAxisPos, aVertexPosition.x + xAxisPos, 0.0, 1.0);\n} else if (isInverted) {\ngl_Position = uPMatrix * vec4(yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, xToPixels(aVertexPosition.x) + xAxisPos, 0.0, 1.0);\n} else {\ngl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);\n}\n}",
                        "vertex"),
                    m = x("precision highp float;\nuniform vec4 fillColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform sampler2D uSampler;\nuniform bool isCircle;\nuniform bool hasColor;\nvoid main(void) {\nvec4 col = fillColor;\nvec4 tcol = texture2D(uSampler, gl_PointCoord.st);\nif (hasColor) {\ncol = vColor;\n}\nif (isCircle) {\ncol *= tcol;\nif (tcol.r < 0.0) {\ndiscard;\n} else {\ngl_FragColor = col;\n}\n} else {\ngl_FragColor = col;\n}\n}", "fragment");
                if (!r || !m) return h = !1, b(), !1;
                h = c.createProgram();
                c.attachShader(h, r);
                c.attachShader(h, m);
                c.linkProgram(h);
                if (!c.getProgramParameter(h, c.LINK_STATUS)) return A.push(c.getProgramInfoLog(h)), b(), h = !1;
                c.useProgram(h);
                c.bindAttribLocation(h, 0, "aVertexPosition");
                d = f("uPMatrix");
                q = f("pSize");
                v = f("fillColor");
                S = f("isBubble");
                K = f("bubbleSizeAbs");
                G = f("bubbleSizeByArea");
                t = f("uSampler");
                D = f("skipTranslation");
                a = f("isCircle");
                e = f("isInverted");
                return !0
            }

            function l(a, e) {
                c && h && (a = H[a] = H[a] || c.getUniformLocation(h, a), c.uniform1f(a, e))
            }

            var H =
                {}, h, d, q, v, S, K, G, D, a, e, A = [], t;
            return c && !n() ? !1 : {
                psUniform: function () {
                    return q
                }, pUniform: function () {
                    return d
                }, fillColorUniform: function () {
                    return v
                }, setBubbleUniforms: function (e, d, m, b) {
                    void 0 === b && (b = 1);
                    var f = e.options, g = Number.MAX_VALUE, A = -Number.MAX_VALUE;
                    if (c && h && e.is("bubble")) {
                        var q = e.getPxExtremes();
                        g = k(f.zMin, w(d, !1 === f.displayNegative ? f.zThreshold : -Number.MAX_VALUE, g));
                        A = k(f.zMax, Math.max(A, m));
                        c.uniform1i(S, 1);
                        c.uniform1i(a, 1);
                        c.uniform1i(G, "width" !== e.options.sizeBy);
                        c.uniform1i(K, e.options.sizeByAbsoluteValue);
                        l("bubbleZMin", g);
                        l("bubbleZMax", A);
                        l("bubbleZThreshold", e.options.zThreshold);
                        l("bubbleMinSize", q.minPxSize * b);
                        l("bubbleMaxSize", q.maxPxSize * b)
                    }
                }, bind: function () {
                    c && h && c.useProgram(h)
                }, program: function () {
                    return h
                }, create: n, setUniform: l, setPMatrix: function (a) {
                    c && h && c.uniformMatrix4fv(d, !1, a)
                }, setColor: function (a) {
                    c && h && c.uniform4f(v, a[0] / 255, a[1] / 255, a[2] / 255, a[3])
                }, setPointSize: function (a) {
                    c && h && c.uniform1f(q, a)
                }, setSkipTranslation: function (a) {
                    c && h && c.uniform1i(D, !0 === a ? 1 : 0)
                }, setTexture: function (a) {
                    c &&
                    h && c.uniform1i(t, a)
                }, setDrawAsCircle: function (e) {
                    c && h && c.uniform1i(a, e ? 1 : 0)
                }, reset: function () {
                    c && h && (c.uniform1i(S, 0), c.uniform1i(a, 0))
                }, setInverted: function (a) {
                    c && h && c.uniform1i(e, a)
                }, destroy: function () {
                    c && h && (c.deleteProgram(h), h = !1)
                }
            }
        }
    });
    p(b, "Extensions/Boost/WGLVBuffer.js", [], function () {
        return function (b, x, y) {
            function k() {
                c && (b.deleteBuffer(c), u = c = !1);
                l = 0;
                w = y || 2;
                H = []
            }

            var c = !1, u = !1, w = y || 2, n = !1, l = 0, H;
            return {
                destroy: k, bind: function () {
                    if (!c) return !1;
                    b.vertexAttribPointer(u, w, b.FLOAT, !1, 0, 0)
                }, data: H,
                build: function (h, d, q) {
                    var v;
                    H = h || [];
                    if (!(H && 0 !== H.length || n)) return k(), !1;
                    w = q || w;
                    c && b.deleteBuffer(c);
                    n || (v = new Float32Array(H));
                    c = b.createBuffer();
                    b.bindBuffer(b.ARRAY_BUFFER, c);
                    b.bufferData(b.ARRAY_BUFFER, n || v, b.STATIC_DRAW);
                    u = b.getAttribLocation(x.program(), d);
                    b.enableVertexAttribArray(u);
                    return !0
                }, render: function (h, d, q) {
                    var v = n ? n.length : H.length;
                    if (!c || !v) return !1;
                    if (!h || h > v || 0 > h) h = 0;
                    if (!d || d > v) d = v;
                    if (h >= d) return !1;
                    b.drawArrays(b[(q || "points").toUpperCase()], h / w, (d - h) / w);
                    return !0
                }, allocate: function (b) {
                    l =
                        -1;
                    n = new Float32Array(4 * b)
                }, push: function (b, d, c, v) {
                    n && (n[++l] = b, n[++l] = d, n[++l] = c, n[++l] = v)
                }
            }
        }
    });
    p(b, "Extensions/Boost/WGLRenderer.js", [b["Core/Color/Color.js"], b["Extensions/Boost/WGLShader.js"], b["Extensions/Boost/WGLVBuffer.js"], b["Core/Globals.js"], b["Core/Utilities.js"]], function (b, x, y, k, c) {
        var u = b.parse, w = k.doc, n = k.win, l = c.isNumber, H = c.isObject, h = c.merge, d = c.objectEach,
            q = c.pick;
        return function (c) {
            function v() {
                return z.pixelRatio || n.devicePixelRatio || 1
            }

            function K(a) {
                if (a.isSeriesBoosting) {
                    var e =
                        !!a.options.stacking;
                    var b = a.xData || a.options.xData || a.processedXData;
                    e = (e ? a.data : b || a.options.data).length;
                    "treemap" === a.type ? e *= 12 : "heatmap" === a.type ? e *= 6 : fa[a.type] && (e *= 2);
                    return e
                }
                return 0
            }

            function G() {
                g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
            }

            function D(a, e) {
                function b(a) {
                    a && (e.colorData.push(a[0]), e.colorData.push(a[1]), e.colorData.push(a[2]), e.colorData.push(a[3]))
                }

                function f(a, f, g, d, c) {
                    void 0 === d && (d = 1);
                    b(c);
                    1 === la || z.useGPUTranslations && !e.skipTranslation || (a *= la, f *= la, d *= la);
                    z.usePreallocated ?
                        (R.push(a, f, g ? 1 : 0, d), ra += 4) : (O.push(a), O.push(f), O.push(g ? la : 0), O.push(d))
                }

                function g() {
                    e.segments.length && (e.segments[e.segments.length - 1].to = O.length || ra)
                }

                function d() {
                    e.segments.length && e.segments[e.segments.length - 1].from === (O.length || ra) || (g(), e.segments.push({from: O.length || ra}))
                }

                function c(a, e, g, d, c) {
                    b(c);
                    f(a + g, e);
                    b(c);
                    f(a, e);
                    b(c);
                    f(a, e + d);
                    b(c);
                    f(a, e + d);
                    b(c);
                    f(a + g, e + d);
                    b(c);
                    f(a + g, e)
                }

                function A(a, b) {
                    z.useGPUTranslations || (e.skipTranslation = !0, a.x = G.toPixels(a.x, !0), a.y = K.toPixels(a.y, !0));
                    b ?
                        O = [a.x, a.y, 0, 2].concat(O) : f(a.x, a.y, 0, 2)
                }

                var m = a.pointArrayMap && "low,high" === a.pointArrayMap.join(","), q = a.chart, t = a.options,
                    T = !!t.stacking, h = t.data, r = a.xAxis.getExtremes(), n = r.min, k = r.max;
                r = a.yAxis.getExtremes();
                var l = r.min, aa = r.max, w = a.xData || t.xData || a.processedXData,
                    S = a.yData || t.yData || a.processedYData, L = a.zData || t.zData || a.processedZData, K = a.yAxis,
                    G = a.xAxis, x = a.chart.plotWidth, y = !w || 0 === w.length, p = t.connectNulls;
                r = a.points || !1;
                var D = !1, B = !1, J, ca, W = T ? a.data : w || h, N = {x: Number.MAX_VALUE, y: 0}, E = {
                        x: -Number.MAX_VALUE,
                        y: 0
                    }, Z = 0, Y = !1, F, C, P, Aa, M = -1, da = !1, Q = !1, X, Ra = "undefined" === typeof q.index, Ba = !1,
                    Ca = !1, I = !1, Pa = fa[a.type], Da = !1, Ja = !0, Ka = !0, Qa = t.zoneAxis || "y",
                    pa = t.zones || !1, U = !1, La = t.threshold, Ea = !1, la = v();
                if (!(t.boostData && 0 < t.boostData.length)) {
                    t.gapSize && (Ea = "value" !== t.gapUnit ? t.gapSize * a.closestPointRange : t.gapSize);
                    if (pa) {
                        var qa = [];
                        pa.forEach(function (a, e) {
                            if (a.color) {
                                var f = u(a.color).rgba;
                                f[0] /= 255;
                                f[1] /= 255;
                                f[2] /= 255;
                                qa[e] = f;
                                U || "undefined" !== typeof a.value || (U = f)
                            }
                        });
                        U || (w = a.pointAttribs && a.pointAttribs().fill ||
                            a.color, U = u(w).rgba, U[0] /= 255, U[1] /= 255, U[2] /= 255)
                    }
                    q.inverted && (x = a.chart.plotHeight);
                    a.closestPointRangePx = Number.MAX_VALUE;
                    d();
                    if (r && 0 < r.length) e.skipTranslation = !0, e.drawMode = "triangles", r[0].node && r[0].node.levelDynamic && r.sort(function (a, e) {
                        if (a.node) {
                            if (a.node.levelDynamic > e.node.levelDynamic) return 1;
                            if (a.node.levelDynamic < e.node.levelDynamic) return -1
                        }
                        return 0
                    }), r.forEach(function (e) {
                        var f = e.plotY;
                        if ("undefined" !== typeof f && !isNaN(f) && null !== e.y && e.shapeArgs) {
                            var b = e.shapeArgs;
                            f = b.x;
                            f = void 0 ===
                            f ? 0 : f;
                            var g = b.y;
                            g = void 0 === g ? 0 : g;
                            var d = b.width;
                            d = void 0 === d ? 0 : d;
                            b = b.height;
                            b = void 0 === b ? 0 : b;
                            var t = q.styledMode ? e.series.colorAttribs(e) : t = e.series.pointAttribs(e);
                            e = t["stroke-width"] || 0;
                            I = u(t.fill).rgba;
                            I[0] /= 255;
                            I[1] /= 255;
                            I[2] /= 255;
                            a.is("treemap") && (e = e || 1, ca = u(t.stroke).rgba, ca[0] /= 255, ca[1] /= 255, ca[2] /= 255, c(f, g, d, b, ca), e /= 2);
                            a.is("heatmap") && q.inverted && (f = G.len - f, g = K.len - g, d = -d, b = -b);
                            c(f + e, g + e, d - 2 * e, b - 2 * e, I)
                        }
                    }); else {
                        for (r = function () {
                            P = W[++M];
                            if ("undefined" === typeof P) return "continue";
                            if (Ra) return "break";
                            var b = h && h[M];
                            !y && H(b, !0) && b.color && (I = u(b.color).rgba, I[0] /= 255, I[1] /= 255, I[2] /= 255);
                            y ? (F = P[0], C = P[1], W[M + 1] && (Q = W[M + 1][0]), W[M - 1] && (da = W[M - 1][0]), 3 <= P.length && (Aa = P[2], P[2] > e.zMax && (e.zMax = P[2]), P[2] < e.zMin && (e.zMin = P[2]))) : (F = P, C = S[M], W[M + 1] && (Q = W[M + 1]), W[M - 1] && (da = W[M - 1]), L && L.length && (Aa = L[M], L[M] > e.zMax && (e.zMax = L[M]), L[M] < e.zMin && (e.zMin = L[M])));
                            if (!p && (null === F || null === C)) return d(), "continue";
                            Q && Q >= n && Q <= k && (Ba = !0);
                            da && da >= n && da <= k && (Ca = !0);
                            m ? (y && (C = P.slice(1, 3)), X = C[0], C = C[1]) : T && (F = P.x,
                                C = P.stackY, X = C - P.y);
                            null !== l && "undefined" !== typeof l && null !== aa && "undefined" !== typeof aa && (Ja = C >= l && C <= aa);
                            F > k && E.x < k && (E.x = F, E.y = C);
                            F < n && N.x > n && (N.x = F, N.y = C);
                            if (null === C && p) return "continue";
                            if (null === C || !Ja && !Ba && !Ca) return d(), "continue";
                            (Q >= n || F >= n) && (da <= k || F <= k) && (Da = !0);
                            if (!Da && !Ba && !Ca) return "continue";
                            Ea && F - da > Ea && d();
                            if (pa) {
                                var g;
                                pa.some(function (a, e) {
                                    var f = pa[e - 1];
                                    return "x" === Qa ? "undefined" !== typeof a.value && F <= a.value ? (qa[e] && (!f || F >= f.value) && (g = qa[e]), !0) : !1 : "undefined" !== typeof a.value &&
                                    C <= a.value ? (qa[e] && (!f || C >= f.value) && (g = qa[e]), !0) : !1
                                });
                                I = g || U || I
                            }
                            if (!z.useGPUTranslations && (e.skipTranslation = !0, F = G.toPixels(F, !0), C = K.toPixels(C, !0), F > x && "points" === e.drawMode)) return "continue";
                            e.hasMarkers && Da && !1 !== D && (a.closestPointRangePx = Math.min(a.closestPointRangePx, Math.abs(F - D)));
                            if (!z.useGPUTranslations && !z.usePreallocated && D && 1 > Math.abs(F - D) && B && 1 > Math.abs(C - B)) return z.debug.showSkipSummary && ++Z, "continue";
                            if (Pa) {
                                J = X;
                                if (!1 === X || "undefined" === typeof X) J = 0 > C ? C : 0;
                                m || T || (J = Math.max(null ===
                                La ? l : La, l));
                                z.useGPUTranslations || (J = K.toPixels(J, !0));
                                f(F, J, 0, 0, I)
                            }
                            t.step && !Ka && f(F, B, 0, 2, I);
                            f(F, C, 0, "bubble" === a.type ? Aa || 1 : 2, I);
                            D = F;
                            B = C;
                            Y = !0;
                            Ka = !1
                        }; M < W.length - 1 && "break" !== r();) ;
                        z.debug.showSkipSummary && console.log("skipped points:", Z);
                        Y || !1 === p || "line_strip" !== a.drawMode || (N.x < Number.MAX_VALUE && A(N, !0), E.x > -Number.MAX_VALUE && A(E))
                    }
                    g()
                }
            }

            function a() {
                E = [];
                Q.data = O = [];
                N = [];
                R && R.destroy()
            }

            function e(a) {
                if (m) {
                    var e = v();
                    m.setUniform("xAxisTrans", a.transA * e);
                    m.setUniform("xAxisMin", a.min);
                    m.setUniform("xAxisMinPad",
                        a.minPixelPadding * e);
                    m.setUniform("xAxisPointRange", a.pointRange);
                    m.setUniform("xAxisLen", a.len * e);
                    m.setUniform("xAxisPos", a.pos * e);
                    m.setUniform("xAxisCVSCoord", !a.horiz);
                    m.setUniform("xAxisIsLog", !!a.logarithmic);
                    m.setUniform("xAxisReversed", !!a.reversed)
                }
            }

            function A(a) {
                if (m) {
                    var e = v();
                    m.setUniform("yAxisTrans", a.transA * e);
                    m.setUniform("yAxisMin", a.min);
                    m.setUniform("yAxisMinPad", a.minPixelPadding * e);
                    m.setUniform("yAxisPointRange", a.pointRange);
                    m.setUniform("yAxisLen", a.len * e);
                    m.setUniform("yAxisPos",
                        a.pos * e);
                    m.setUniform("yAxisCVSCoord", !a.horiz);
                    m.setUniform("yAxisIsLog", !!a.logarithmic);
                    m.setUniform("yAxisReversed", !!a.reversed)
                }
            }

            function t(a, e) {
                m.setUniform("hasThreshold", a);
                m.setUniform("translatedThreshold", e)
            }

            function f(f) {
                var d = v();
                if (f) B = f.chartWidth * d, p = f.chartHeight * d; else return !1;
                if (!(g && B && p && m)) return !1;
                z.debug.timeRendering && console.time("gl rendering");
                g.canvas.width = B;
                g.canvas.height = p;
                m.bind();
                g.viewport(0, 0, B, p);
                m.setPMatrix([2 / B, 0, 0, 0, 0, -(2 / p), 0, 0, 0, 0, -2, 0, -1, 1, -1, 1]);
                1 < z.lineWidth &&
                !k.isMS && g.lineWidth(z.lineWidth);
                R.build(Q.data, "aVertexPosition", 4);
                R.bind();
                m.setInverted(f.inverted);
                E.forEach(function (a, c) {
                    var r = a.series.options, h = r.marker;
                    var v = "undefined" !== typeof r.lineWidth ? r.lineWidth : 1;
                    var n = r.threshold, k = l(n), T = a.series.yAxis.getThreshold(n);
                    n = q(r.marker ? r.marker.enabled : null, a.series.xAxis.isRadial ? !0 : null, a.series.closestPointRangePx > 2 * ((r.marker ? r.marker.radius : 10) || 10));
                    h = Z[h && h.symbol || a.series.symbol] || Z.circle;
                    if (0 !== a.segments.length && a.segments[0].from !== a.segments[0].to) {
                        h.isReady &&
                        (g.bindTexture(g.TEXTURE_2D, h.handle), m.setTexture(h.handle));
                        f.styledMode ? h = a.series.markerGroup && a.series.markerGroup.getStyle("fill") : (h = "points" === a.drawMode && a.series.pointAttribs && a.series.pointAttribs().fill || a.series.color, r.colorByPoint && (h = a.series.chart.options.colors[c]));
                        a.series.fillOpacity && r.fillOpacity && (h = (new b(h)).setOpacity(q(r.fillOpacity, 1)).get());
                        h = u(h).rgba;
                        z.useAlpha || (h[3] = 1);
                        "lines" === a.drawMode && z.useAlpha && 1 > h[3] && (h[3] /= 10);
                        "add" === r.boostBlending ? (g.blendFunc(g.SRC_ALPHA,
                            g.ONE), g.blendEquation(g.FUNC_ADD)) : "mult" === r.boostBlending || "multiply" === r.boostBlending ? g.blendFunc(g.DST_COLOR, g.ZERO) : "darken" === r.boostBlending ? (g.blendFunc(g.ONE, g.ONE), g.blendEquation(g.FUNC_MIN)) : g.blendFuncSeparate(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA, g.ONE, g.ONE_MINUS_SRC_ALPHA);
                        m.reset();
                        0 < a.colorData.length ? (m.setUniform("hasColor", 1), c = y(g, m), c.build(a.colorData, "aColor", 4), c.bind()) : g.disableVertexAttribArray(g.getAttribLocation(m.program(), "aColor"));
                        m.setColor(h);
                        e(a.series.xAxis);
                        A(a.series.yAxis);
                        t(k, T);
                        "points" === a.drawMode && m.setPointSize(2 * q(r.marker && r.marker.radius, .5) * d);
                        m.setSkipTranslation(a.skipTranslation);
                        "bubble" === a.series.type && m.setBubbleUniforms(a.series, a.zMin, a.zMax, d);
                        m.setDrawAsCircle(X[a.series.type] || !1);
                        if (0 < v || "line_strip" !== a.drawMode) for (v = 0; v < a.segments.length; v++) R.render(a.segments[v].from, a.segments[v].to, a.drawMode);
                        if (a.hasMarkers && n) for (m.setPointSize(2 * q(r.marker && r.marker.radius, 5) * d), m.setDrawAsCircle(!0), v = 0; v < a.segments.length; v++) R.render(a.segments[v].from,
                            a.segments[v].to, "POINTS")
                    }
                });
                z.debug.timeRendering && console.timeEnd("gl rendering");
                c && c();
                a()
            }

            function r(a) {
                G();
                if (a.renderer.forExport) return f(a);
                Y ? f(a) : setTimeout(function () {
                    r(a)
                }, 1)
            }

            var m = !1, R = !1, ra = 0, g = !1, B = 0, p = 0, O = !1, N = !1, Q = {}, Y = !1, E = [], Z = {},
                fa = {column: !0, columnrange: !0, bar: !0, area: !0, areaspline: !0, arearange: !0},
                X = {scatter: !0, bubble: !0}, z = {
                    pointSize: 1,
                    lineWidth: 1,
                    fillColor: "#AA00AA",
                    useAlpha: !0,
                    usePreallocated: !1,
                    useGPUTranslations: !1,
                    debug: {
                        timeRendering: !1, timeSeriesProcessing: !1, timeSetup: !1,
                        timeBufferCopy: !1, timeKDTree: !1, showSkipSummary: !1
                    }
                };
            return Q = {
                allocateBufferForSingleSeries: function (a) {
                    var e = 0;
                    z.usePreallocated && (a.isSeriesBoosting && (e = K(a)), R.allocate(e))
                }, pushSeries: function (a) {
                    0 < E.length && E[E.length - 1].hasMarkers && (E[E.length - 1].markerTo = N.length);
                    z.debug.timeSeriesProcessing && console.time("building " + a.type + " series");
                    var e = {
                        segments: [],
                        markerFrom: N.length,
                        colorData: [],
                        series: a,
                        zMin: Number.MAX_VALUE,
                        zMax: -Number.MAX_VALUE,
                        hasMarkers: a.options.marker ? !1 !== a.options.marker.enabled :
                            !1,
                        showMarkers: !0,
                        drawMode: {
                            area: "lines",
                            arearange: "lines",
                            areaspline: "lines",
                            column: "lines",
                            columnrange: "lines",
                            bar: "lines",
                            line: "line_strip",
                            scatter: "points",
                            heatmap: "triangles",
                            treemap: "triangles",
                            bubble: "points"
                        }[a.type] || "line_strip"
                    };
                    a.index >= E.length ? E.push(e) : E[a.index] = e;
                    D(a, e);
                    z.debug.timeSeriesProcessing && console.timeEnd("building " + a.type + " series")
                }, setSize: function (a, e) {
                    B === a && p === e || !m || (B = a, p = e, m.bind(), m.setPMatrix([2 / B, 0, 0, 0, 0, -(2 / p), 0, 0, 0, 0, -2, 0, -1, 1, -1, 1]))
                }, inited: function () {
                    return Y
                },
                setThreshold: t, init: function (e, f) {
                    function b(a, e) {
                        var f = {isReady: !1, texture: w.createElement("canvas"), handle: g.createTexture()},
                            b = f.texture.getContext("2d");
                        Z[a] = f;
                        f.texture.width = 512;
                        f.texture.height = 512;
                        b.mozImageSmoothingEnabled = !1;
                        b.webkitImageSmoothingEnabled = !1;
                        b.msImageSmoothingEnabled = !1;
                        b.imageSmoothingEnabled = !1;
                        b.strokeStyle = "rgba(255, 255, 255, 0)";
                        b.fillStyle = "#FFF";
                        e(b);
                        try {
                            g.activeTexture(g.TEXTURE0), g.bindTexture(g.TEXTURE_2D, f.handle), g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE,
                                f.texture), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR), g.bindTexture(g.TEXTURE_2D, null), f.isReady = !0
                        } catch (ja) {
                        }
                    }

                    var d = 0, c = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
                    Y = !1;
                    if (!e) return !1;
                    for (z.debug.timeSetup && console.time("gl setup"); d < c.length && !(g = e.getContext(c[d], {})); d++) ;
                    if (g) f || a();
                    else return !1;
                    g.enable(g.BLEND);
                    g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
                    g.disable(g.DEPTH_TEST);
                    g.depthFunc(g.LESS);
                    m = x(g);
                    if (!m) return !1;
                    R = y(g, m);
                    b("circle", function (a) {
                        a.beginPath();
                        a.arc(256, 256, 256, 0, 2 * Math.PI);
                        a.stroke();
                        a.fill()
                    });
                    b("square", function (a) {
                        a.fillRect(0, 0, 512, 512)
                    });
                    b("diamond", function (a) {
                        a.beginPath();
                        a.moveTo(256, 0);
                        a.lineTo(512, 256);
                        a.lineTo(256, 512);
                        a.lineTo(0, 256);
                        a.lineTo(256, 0);
                        a.fill()
                    });
                    b("triangle", function (a) {
                        a.beginPath();
                        a.moveTo(0, 512);
                        a.lineTo(256, 0);
                        a.lineTo(512,
                            512);
                        a.lineTo(0, 512);
                        a.fill()
                    });
                    b("triangle-down", function (a) {
                        a.beginPath();
                        a.moveTo(0, 0);
                        a.lineTo(256, 512);
                        a.lineTo(512, 0);
                        a.lineTo(0, 0);
                        a.fill()
                    });
                    Y = !0;
                    z.debug.timeSetup && console.timeEnd("gl setup");
                    return !0
                }, render: r, settings: z, valid: function () {
                    return !1 !== g
                }, clear: G, flush: a, setXAxis: e, setYAxis: A, data: O, gl: function () {
                    return g
                }, allocateBuffer: function (a) {
                    var e = 0;
                    z.usePreallocated && (a.series.forEach(function (a) {
                        a.isSeriesBoosting && (e += K(a))
                    }), R.allocate(e))
                }, destroy: function () {
                    a();
                    R.destroy();
                    m.destroy();
                    g && (d(Z, function (a) {
                        a.handle && g.deleteTexture(a.handle)
                    }), g.canvas.width = 1, g.canvas.height = 1)
                }, setOptions: function (a) {
                    "pixelRatio" in a || (a.pixelRatio = 1);
                    h(!0, z, a)
                }
            }
        }
    });
    p(b, "Extensions/Boost/BoostAttach.js", [b["Core/Chart/Chart.js"], b["Extensions/Boost/WGLRenderer.js"], b["Core/Globals.js"], b["Core/Utilities.js"]], function (b, x, y, k) {
        var c = y.doc, u = k.error, w;
        return function (n, k) {
            var l = n.chartWidth, h = n.chartHeight, d = n, q = n.seriesGroup || k.group,
                v = c.implementation.hasFeature("www.http://w3.org/TR/SVG11/feature#Extensibility",
                    "1.1");
            d = n.isChartSeriesBoosting() ? n : k;
            v = !1;
            w || (w = c.createElement("canvas"));
            d.renderTarget || (d.canvas = w, n.renderer.forExport || !v ? (d.renderTarget = n.renderer.image("", 0, 0, l, h).addClass("highcharts-boost-canvas").add(q), d.boostClear = function () {
                d.renderTarget.attr({href: ""})
            }, d.boostCopy = function () {
                d.boostResizeTarget();
                d.renderTarget.attr({href: d.canvas.toDataURL("image/png")})
            }) : (d.renderTargetFo = n.renderer.createElement("foreignObject").add(q), d.renderTarget = c.createElement("canvas"), d.renderTargetCtx =
                d.renderTarget.getContext("2d"), d.renderTargetFo.element.appendChild(d.renderTarget), d.boostClear = function () {
                d.renderTarget.width = d.canvas.width;
                d.renderTarget.height = d.canvas.height
            }, d.boostCopy = function () {
                d.renderTarget.width = d.canvas.width;
                d.renderTarget.height = d.canvas.height;
                d.renderTargetCtx.drawImage(d.canvas, 0, 0)
            }), d.boostResizeTarget = function () {
                l = n.chartWidth;
                h = n.chartHeight;
                (d.renderTargetFo || d.renderTarget).attr({x: 0, y: 0, width: l, height: h}).css({
                    pointerEvents: "none", mixedBlendMode: "normal",
                    opacity: 1
                });
                d instanceof b && d.markerGroup.translate(n.plotLeft, n.plotTop)
            }, d.boostClipRect = n.renderer.clipRect(), (d.renderTargetFo || d.renderTarget).clip(d.boostClipRect), d instanceof b && (d.markerGroup = d.renderer.g().add(q), d.markerGroup.translate(k.xAxis.pos, k.yAxis.pos)));
            d.canvas.width = l;
            d.canvas.height = h;
            d.boostClipRect.attr(n.getBoostClipRect(d));
            d.boostResizeTarget();
            d.boostClear();
            d.ogl || (d.ogl = x(function () {
                d.ogl.settings.debug.timeBufferCopy && console.time("buffer copy");
                d.boostCopy();
                d.ogl.settings.debug.timeBufferCopy &&
                console.timeEnd("buffer copy")
            }), d.ogl.init(d.canvas) || u("[highcharts boost] - unable to init WebGL renderer"), d.ogl.setOptions(n.options.boost || {}), d instanceof b && d.ogl.allocateBuffer(n));
            d.ogl.setSize(l, h);
            return d.ogl
        }
    });
    p(b, "Extensions/Boost/BoostUtils.js", [b["Core/Globals.js"], b["Extensions/Boost/BoostableMap.js"], b["Extensions/Boost/BoostAttach.js"], b["Core/Utilities.js"]], function (b, x, y, k) {
        function c() {
            for (var b = [], d = 0; d < arguments.length; d++) b[d] = arguments[d];
            var c = -Number.MAX_VALUE;
            b.forEach(function (b) {
                if ("undefined" !==
                    typeof b && null !== b && "undefined" !== typeof b.length && 0 < b.length) return c = b.length, !0
            });
            return c
        }

        function u(b, d, c) {
            b && d.renderTarget && d.canvas && !(c || d.chart).isChartSeriesBoosting() && b.render(c || d.chart)
        }

        function w(b, d) {
            b && d.renderTarget && d.canvas && !d.chart.isChartSeriesBoosting() && b.allocateBufferForSingleSeries(d)
        }

        function n(b, d, c, h, k, l) {
            k = k || 0;
            h = h || 3E3;
            for (var a = k + h, e = !0; e && k < a && k < b.length;) e = d(b[k], k), ++k;
            e && (k < b.length ? l ? n(b, d, c, h, k, l) : H.requestAnimationFrame ? H.requestAnimationFrame(function () {
                n(b,
                    d, c, h, k)
            }) : setTimeout(function () {
                n(b, d, c, h, k)
            }) : c && c())
        }

        function l() {
            var b = 0, d, c = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"], k = !1;
            if ("undefined" !== typeof H.WebGLRenderingContext) for (d = h.createElement("canvas"); b < c.length; b++) try {
                if (k = d.getContext(c[b]), "undefined" !== typeof k && null !== k) return !0
            } catch (G) {
            }
            return !1
        }

        var H = b.win, h = b.doc, d = k.pick;
        k = {
            patientMax: c, boostEnabled: function (b) {
                return d(b && b.options && b.options.boost && b.options.boost.enabled, !0)
            }, shouldForceChartSeriesBoosting: function (b) {
                var h =
                    0, k = 0, n = d(b.options.boost && b.options.boost.allowForce, !0);
                if ("undefined" !== typeof b.boostForceChartBoost) return b.boostForceChartBoost;
                if (1 < b.series.length) for (var l = 0; l < b.series.length; l++) {
                    var q = b.series[l];
                    0 !== q.options.boostThreshold && !1 !== q.visible && "heatmap" !== q.type && (x[q.type] && ++k, c(q.processedXData, q.options.data, q.points) >= (q.options.boostThreshold || Number.MAX_VALUE) && ++h)
                }
                b.boostForceChartBoost = n && (k === b.series.length && 0 < h || 5 < h);
                return b.boostForceChartBoost
            }, renderIfNotSeriesBoosting: u,
            allocateIfNotSeriesBoosting: w, eachAsync: n, hasWebGLSupport: l, pointDrawHandler: function (b) {
                var d = !0;
                this.chart.options && this.chart.options.boost && (d = "undefined" === typeof this.chart.options.boost.enabled ? !0 : this.chart.options.boost.enabled);
                if (!d || !this.isSeriesBoosting) return b.call(this);
                this.chart.isBoosting = !0;
                if (b = y(this.chart, this)) w(b, this), b.pushSeries(this);
                u(b, this)
            }
        };
        b.hasWebGLSupport = l;
        return k
    });
    p(b, "Extensions/Boost/BoostInit.js", [b["Core/Chart/Chart.js"], b["Core/Globals.js"], b["Core/Series/Series.js"],
        b["Core/Series/SeriesRegistry.js"], b["Core/Utilities.js"], b["Extensions/Boost/BoostUtils.js"], b["Extensions/Boost/BoostAttach.js"]], function (b, x, y, k, c, u, p) {
        var n = x.noop, l = k.seriesTypes, w = c.addEvent, h = c.extend, d = c.fireEvent, q = c.wrap, v = u.eachAsync,
            S = u.pointDrawHandler, K = u.allocateIfNotSeriesBoosting, G = u.renderIfNotSeriesBoosting,
            D = u.shouldForceChartSeriesBoosting, a;
        return function () {
            h(y.prototype, {
                renderCanvas: function () {
                    function e(a, e) {
                        var b = !1, f = "undefined" === typeof m.index, d = !0;
                        if ("undefined" ===
                            typeof a) return !0;
                        if (!f) {
                            if (V) {
                                var c = a[0];
                                var g = a[1]
                            } else c = a, g = q[e];
                            T ? (V && (g = a.slice(1, 3)), b = g[0], g = g[1]) : aa && (c = a.x, g = a.stackY, b = g - a.y);
                            ta || (d = g >= y && g <= H);
                            if (null !== g && c >= u && c <= x && d) if (a = k.toPixels(c, !0), S) {
                                if ("undefined" === typeof ba || a === D) {
                                    T || (b = g);
                                    if ("undefined" === typeof ea || g > ia) ia = g, ea = e;
                                    if ("undefined" === typeof ba || b < ha) ha = b, ba = e
                                }
                                ja && a === D || ("undefined" !== typeof ba && (g = l.toPixels(ia, !0), z = l.toPixels(ha, !0), na(a, g, ea), z !== g && na(a, z, ba)), ba = ea = void 0, D = a)
                            } else g = Math.ceil(l.toPixels(g, !0)), na(a,
                                g, e)
                        }
                        return !f
                    }

                    function b() {
                        d(c, "renderedCanvas");
                        delete c.buildKDTree;
                        c.buildKDTree();
                        oa.debug.timeKDTree && console.timeEnd("kd tree building")
                    }

                    var c = this, f = c.options || {}, h = !1, m = c.chart, k = this.xAxis, l = this.yAxis,
                        g = f.xData || c.processedXData, q = f.yData || c.processedYData, w = f.data;
                    h = k.getExtremes();
                    var u = h.min, x = h.max;
                    h = l.getExtremes();
                    var y = h.min, H = h.max, E = {}, D, S = !!c.sampling, N = !1 !== f.enableMouseTracking,
                        z = l.getThreshold(f.threshold),
                        T = c.pointArrayMap && "low,high" === c.pointArrayMap.join(","), aa = !!f.stacking,
                        sa = c.cropStart || 0, ta = c.requireSorting, V = !g, ha, ia, ba, ea,
                        ja = "x" === f.findNearestPointBy,
                        ma = this.xData || this.options.xData || this.processedXData || !1, na = function (e, b, f) {
                            e = Math.ceil(e);
                            a = ja ? e : e + "," + b;
                            N && !E[a] && (E[a] = !0, m.inverted && (e = k.len - e, b = l.len - b), va.push({
                                x: ma ? ma[sa + f] : !1,
                                clientX: e,
                                plotX: e,
                                plotY: b,
                                i: sa + f
                            }))
                        };
                    h = p(m, c);
                    m.isBoosting = !0;
                    var oa = h.settings;
                    if (this.visible) {
                        (this.points || this.graph) && this.destroyGraphics();
                        m.isChartSeriesBoosting() ? (this.markerGroup && this.markerGroup !== m.markerGroup && this.markerGroup.destroy(),
                            this.markerGroup = m.markerGroup, this.renderTarget && (this.renderTarget = this.renderTarget.destroy())) : (this.markerGroup === m.markerGroup && (this.markerGroup = void 0), this.markerGroup = c.plotGroup("markerGroup", "markers", !0, 1, m.seriesGroup));
                        var va = this.points = [];
                        c.buildKDTree = n;
                        h && (K(h, this), h.pushSeries(c), G(h, this, m));
                        m.renderer.forExport || (oa.debug.timeKDTree && console.time("kd tree building"), v(aa ? c.data : g || w, e, b))
                    }
                }
            });
            ["heatmap", "treemap"].forEach(function (a) {
                l[a] && q(l[a].prototype, "drawPoints", S)
            });
            l.bubble && (delete l.bubble.prototype.buildKDTree, q(l.bubble.prototype, "markerAttribs", function (a) {
                return this.isSeriesBoosting ? !1 : a.apply(this, [].slice.call(arguments, 1))
            }));
            l.scatter.prototype.fill = !0;
            h(l.area.prototype, {fill: !0, fillOpacity: !0, sampling: !0});
            h(l.areaspline.prototype, {fill: !0, fillOpacity: !0, sampling: !0});
            h(l.column.prototype, {fill: !0, sampling: !0});
            b.prototype.propsRequireUpdateSeries.push("boost");
            b.prototype.callbacks.push(function (a) {
                w(a, "predraw", function () {
                    a.boostForceChartBoost =
                        void 0;
                    a.boostForceChartBoost = D(a);
                    a.isBoosting = !1;
                    !a.isChartSeriesBoosting() && a.didBoost && (a.didBoost = !1);
                    a.boostClear && a.boostClear();
                    a.canvas && a.ogl && a.isChartSeriesBoosting() && (a.didBoost = !0, a.ogl.allocateBuffer(a));
                    a.markerGroup && a.xAxis && 0 < a.xAxis.length && a.yAxis && 0 < a.yAxis.length && a.markerGroup.translate(a.xAxis[0].pos, a.yAxis[0].pos)
                });
                w(a, "render", function () {
                    a.ogl && a.isChartSeriesBoosting() && a.ogl.render(a)
                });
                var e = -1, b = -1;
                w(a.pointer, "afterGetHoverData", function () {
                    var f = a.hoverSeries;
                    if (a.markerGroup &&
                        f) {
                        var d = a.inverted ? f.yAxis : f.xAxis;
                        f = a.inverted ? f.xAxis : f.yAxis;
                        if (d && d.pos !== e || f && f.pos !== b) a.markerGroup.translate(d.pos, f.pos), e = d.pos, b = f.pos
                    }
                })
            })
        }
    });
    p(b, "Extensions/BoostCanvas.js", [b["Core/Chart/Chart.js"], b["Core/Color/Color.js"], b["Core/Globals.js"], b["Core/Series/Series.js"], b["Core/Series/SeriesRegistry.js"], b["Core/Utilities.js"]], function (b, x, y, k, c, u) {
        var w = x.parse, n = y.doc, l = y.noop, p = c.seriesTypes, h = u.addEvent, d = u.extend, q = u.fireEvent,
            v = u.isNumber, S = u.merge, K = u.pick, G = u.wrap, D;
        return function () {
            y.seriesTypes.heatmap &&
            G(y.seriesTypes.heatmap.prototype, "drawPoints", function () {
                var a = this.chart, e = this.getContext(), b = this.chart.inverted, d = this.xAxis, f = this.yAxis;
                e ? (this.points.forEach(function (c) {
                    var h = c.plotY;
                    if ("undefined" !== typeof h && !isNaN(h) && null !== c.y && e) {
                        var A = c.shapeArgs || {};
                        h = A.x;
                        h = void 0 === h ? 0 : h;
                        var k = A.y;
                        k = void 0 === k ? 0 : k;
                        var g = A.width;
                        g = void 0 === g ? 0 : g;
                        A = A.height;
                        A = void 0 === A ? 0 : A;
                        c = a.styledMode ? c.series.colorAttribs(c) : c.series.pointAttribs(c);
                        e.fillStyle = c.fill;
                        b ? e.fillRect(f.len - k + d.left, d.len - h + f.top,
                            -A, -g) : e.fillRect(h + d.left, k + f.top, g, A)
                    }
                }), this.canvasToSVG()) : this.chart.showLoading("Your browser doesn't support HTML5 canvas, <br>please use a modern browser")
            });
            d(k.prototype, {
                getContext: function () {
                    var a = this.chart, e = a.chartWidth, b = a.chartHeight, d = a.seriesGroup || this.group, f = this,
                        c = function (a, b, e, f, d, c, h) {
                            a.call(this, e, b, f, d, c, h)
                        };
                    a.isChartSeriesBoosting() && (f = a, d = a.seriesGroup);
                    var h = f.ctx;
                    f.canvas || (f.canvas = n.createElement("canvas"), f.renderTarget = a.renderer.image("", 0, 0, e, b).addClass("highcharts-boost-canvas").add(d),
                        f.ctx = h = f.canvas.getContext("2d"), a.inverted && ["moveTo", "lineTo", "rect", "arc"].forEach(function (a) {
                        G(h, a, c)
                    }), f.boostCopy = function () {
                        f.renderTarget.attr({href: f.canvas.toDataURL("image/png")})
                    }, f.boostClear = function () {
                        h.clearRect(0, 0, f.canvas.width, f.canvas.height);
                        f === this && f.renderTarget.attr({href: ""})
                    }, f.boostClipRect = a.renderer.clipRect(), f.renderTarget.clip(f.boostClipRect));
                    f.canvas.width !== e && (f.canvas.width = e);
                    f.canvas.height !== b && (f.canvas.height = b);
                    f.renderTarget.attr({
                        x: 0, y: 0, width: e,
                        height: b, style: "pointer-events: none", href: ""
                    });
                    f.boostClipRect.attr(a.getBoostClipRect(f));
                    return h
                }, canvasToSVG: function () {
                    this.chart.isChartSeriesBoosting() ? this.boostClear && this.boostClear() : (this.boostCopy || this.chart.boostCopy) && (this.boostCopy || this.chart.boostCopy)()
                }, cvsLineTo: function (a, b, d) {
                    a.lineTo(b, d)
                }, renderCanvas: function () {
                    var a = this, b = a.options, c = a.chart, k = this.xAxis, f = this.yAxis,
                        n = (c.options.boost || {}).timeRendering || !1, m = 0, p = a.processedXData,
                        H = a.processedYData, g = b.data, B = k.getExtremes(),
                        G = B.min, O = B.max;
                    B = f.getExtremes();
                    var N = B.min, Q = B.max, Y = {}, E, Z = !!a.sampling, fa = b.marker && b.marker.radius,
                        X = this.cvsDrawPoint, z = b.lineWidth ? this.cvsLineTo : void 0,
                        T = fa && 1 >= fa ? this.cvsMarkerSquare : this.cvsMarkerCircle,
                        aa = this.cvsStrokeBatch || 1E3, sa = !1 !== b.enableMouseTracking, ta;
                    B = b.threshold;
                    var V = f.getThreshold(B), ha = v(B), ia = V, ba = this.fill,
                        ea = a.pointArrayMap && "low,high" === a.pointArrayMap.join(","), ja = !!b.stacking,
                        ma = a.cropStart || 0;
                    B = c.options.loading;
                    var na = a.requireSorting, oa, va = b.connectNulls, Ga =
                            !p, wa, xa, ka, ua, ya, L = ja ? a.data : p || g,
                        Ma = a.fillOpacity ? x.parse(a.color).setOpacity(K(b.fillOpacity, .75)).get() : a.color,
                        Fa = function () {
                            ba ? (J.fillStyle = Ma, J.fill()) : (J.strokeStyle = a.color, J.lineWidth = b.lineWidth, J.stroke())
                        }, Ha = function (b, e, f, d) {
                            0 === m && (J.beginPath(), z && (J.lineJoin = "round"));
                            c.scroller && "highcharts-navigator-series" === a.options.className ? (e += c.scroller.top, f && (f += c.scroller.top)) : e += c.plotTop;
                            b += c.plotLeft;
                            oa ? J.moveTo(b, e) : X ? X(J, b, e, f, ta) : z ? z(J, b, e) : T && T.call(a, J, b, e, fa, d);
                            m += 1;
                            m === aa &&
                            (Fa(), m = 0);
                            ta = {clientX: b, plotY: e, yBottom: f}
                        }, Na = "x" === b.findNearestPointBy,
                        Ia = this.xData || this.options.xData || this.processedXData || !1, za = function (a, b, e) {
                            ya = Na ? a : a + "," + b;
                            sa && !Y[ya] && (Y[ya] = !0, c.inverted && (a = k.len - a, b = f.len - b), Oa.push({
                                x: Ia ? Ia[ma + e] : !1,
                                clientX: a,
                                plotX: a,
                                plotY: b,
                                i: ma + e
                            }))
                        };
                    this.renderTarget && this.renderTarget.attr({href: ""});
                    (this.points || this.graph) && this.destroyGraphics();
                    a.plotGroup("group", "series", a.visible ? "visible" : "hidden", b.zIndex, c.seriesGroup);
                    a.markerGroup = a.group;
                    h(a, "destroy",
                        function () {
                            a.markerGroup = null
                        });
                    var Oa = this.points = [];
                    var J = this.getContext();
                    a.buildKDTree = l;
                    this.boostClear && this.boostClear();
                    this.visible && (99999 < g.length && (c.options.loading = S(B, {
                        labelStyle: {
                            backgroundColor: w("#ffffff").setOpacity(.75).get(),
                            padding: "1em",
                            borderRadius: "0.5em"
                        }, style: {backgroundColor: "none", opacity: 1}
                    }), u.clearTimeout(D), c.showLoading("Drawing..."), c.options.loading = B), n && console.time("canvas rendering"), y.eachAsync(L, function (b, e) {
                        var d = !1, g = !1, h = !1, m = !1, A = "undefined" === typeof c.index,
                            n = !0;
                        if (!A) {
                            if (Ga) {
                                var t = b[0];
                                var l = b[1];
                                L[e + 1] && (h = L[e + 1][0]);
                                L[e - 1] && (m = L[e - 1][0])
                            } else t = b, l = H[e], L[e + 1] && (h = L[e + 1]), L[e - 1] && (m = L[e - 1]);
                            h && h >= G && h <= O && (d = !0);
                            m && m >= G && m <= O && (g = !0);
                            if (ea) {
                                Ga && (l = b.slice(1, 3));
                                var r = l[0];
                                l = l[1]
                            } else ja && (t = b.x, l = b.stackY, r = l - b.y);
                            b = null === l;
                            na || (n = l >= N && l <= Q);
                            if (!b && (t >= G && t <= O && n || d || g)) if (t = Math.round(k.toPixels(t, !0)), Z) {
                                if ("undefined" === typeof ka || t === E) {
                                    ea || (r = l);
                                    if ("undefined" === typeof ua || l > xa) xa = l, ua = e;
                                    if ("undefined" === typeof ka || r < wa) wa = r, ka = e
                                }
                                t !== E && ("undefined" !==
                                typeof ka && (l = f.toPixels(xa, !0), V = f.toPixels(wa, !0), Ha(t, ha ? Math.min(l, ia) : l, ha ? Math.max(V, ia) : V, e), za(t, l, ua), V !== l && za(t, V, ka)), ka = ua = void 0, E = t)
                            } else l = Math.round(f.toPixels(l, !0)), Ha(t, l, V, e), za(t, l, e);
                            oa = b && !va;
                            0 === e % 5E4 && (a.boostCopy || a.chart.boostCopy) && (a.boostCopy || a.chart.boostCopy)()
                        }
                        return !A
                    }, function () {
                        var b = c.loadingDiv, e = c.loadingShown;
                        Fa();
                        a.canvasToSVG();
                        n && console.timeEnd("canvas rendering");
                        q(a, "renderedCanvas");
                        e && (d(b.style, {transition: "opacity 250ms", opacity: 0}), c.loadingShown =
                            !1, D = setTimeout(function () {
                            b.parentNode && b.parentNode.removeChild(b);
                            c.loadingDiv = c.loadingSpan = null
                        }, 250));
                        delete a.buildKDTree;
                        a.buildKDTree()
                    }, c.renderer.forExport ? Number.MAX_VALUE : void 0))
                }
            });
            p.scatter.prototype.cvsMarkerCircle = function (a, b, c, d) {
                a.moveTo(b, c);
                a.arc(b, c, d, 0, 2 * Math.PI, !1)
            };
            p.scatter.prototype.cvsMarkerSquare = function (a, b, c, d) {
                a.rect(b - d, c - d, 2 * d, 2 * d)
            };
            p.scatter.prototype.fill = !0;
            p.bubble && (p.bubble.prototype.cvsMarkerCircle = function (a, b, c, d, f) {
                a.moveTo(b, c);
                a.arc(b, c, this.radii &&
                    this.radii[f], 0, 2 * Math.PI, !1)
            }, p.bubble.prototype.cvsStrokeBatch = 1);
            d(p.area.prototype, {
                cvsDrawPoint: function (a, b, c, d, f) {
                    f && b !== f.clientX && (a.moveTo(f.clientX, f.yBottom), a.lineTo(f.clientX, f.plotY), a.lineTo(b, c), a.lineTo(b, d))
                }, fill: !0, fillOpacity: !0, sampling: !0
            });
            d(p.column.prototype, {
                cvsDrawPoint: function (a, b, c, d) {
                    a.rect(b - 1, c, 1, d - c)
                }, fill: !0, sampling: !0
            });
            b.prototype.callbacks.push(function (a) {
                h(a, "predraw", function () {
                    a.renderTarget && a.renderTarget.attr({href: ""});
                    a.canvas && a.canvas.getContext("2d").clearRect(0,
                        0, a.canvas.width, a.canvas.height)
                });
                h(a, "render", function () {
                    a.boostCopy && a.boostCopy()
                })
            })
        }
    });
    p(b, "Extensions/Boost/BoostOverrides.js", [b["Core/Chart/Chart.js"], b["Core/DefaultOptions.js"], b["Core/Series/Point.js"], b["Core/Series/Series.js"], b["Core/Series/SeriesRegistry.js"], b["Core/Utilities.js"], b["Extensions/Boost/BoostUtils.js"], b["Extensions/Boost/Boostables.js"], b["Extensions/Boost/BoostableMap.js"]], function (b, p, y, k, c, u, N, n, l) {
        p = p.getOptions;
        var w = c.seriesTypes;
        c = u.addEvent;
        var h = u.error,
            d = u.isArray, q = u.isNumber, v = u.pick, x = u.wrap, K = N.boostEnabled,
            G = N.shouldForceChartSeriesBoosting, D = p().plotOptions;
        b.prototype.isChartSeriesBoosting = function () {
            return v(this.options.boost && this.options.boost.seriesThreshold, 50) <= this.series.length || G(this)
        };
        b.prototype.getBoostClipRect = function (a) {
            var b = {x: this.plotLeft, y: this.plotTop, width: this.plotWidth, height: this.plotHeight};
            a === this && (a = this.inverted ? this.xAxis : this.yAxis, 1 >= a.length ? (b.y = Math.min(a[0].pos, b.y), b.height = a[0].pos - this.plotTop + a[0].len) :
                b.height = this.plotHeight);
            return b
        };
        k.prototype.getPoint = function (a) {
            var b = a, c = this.xData || this.options.xData || this.processedXData || !1;
            !a || a instanceof this.pointClass || (b = (new this.pointClass).init(this, this.options.data[a.i], c ? c[a.i] : void 0), b.category = v(this.xAxis.categories ? this.xAxis.categories[b.x] : b.x, b.x), b.dist = a.dist, b.distX = a.distX, b.plotX = a.plotX, b.plotY = a.plotY, b.index = a.i, b.isInside = this.isPointInside(a));
            return b
        };
        x(k.prototype, "searchPoint", function (a) {
            return this.getPoint(a.apply(this,
                [].slice.call(arguments, 1)))
        });
        x(y.prototype, "haloPath", function (a) {
            var b = this.series, c = this.plotX, d = this.plotY, f = b.chart.inverted;
            b.isSeriesBoosting && f && (this.plotX = b.yAxis.len - d, this.plotY = b.xAxis.len - c);
            var h = a.apply(this, Array.prototype.slice.call(arguments, 1));
            b.isSeriesBoosting && f && (this.plotX = c, this.plotY = d);
            return h
        });
        x(k.prototype, "markerAttribs", function (a, b) {
            var e = b.plotX, c = b.plotY, d = this.chart.inverted;
            this.isSeriesBoosting && d && (b.plotX = this.yAxis.len - c, b.plotY = this.xAxis.len - e);
            var h =
                a.apply(this, Array.prototype.slice.call(arguments, 1));
            this.isSeriesBoosting && d && (b.plotX = e, b.plotY = c);
            return h
        });
        c(k, "destroy", function () {
            var a = this, b = a.chart;
            b.markerGroup === a.markerGroup && (a.markerGroup = null);
            b.hoverPoints && (b.hoverPoints = b.hoverPoints.filter(function (b) {
                return b.series === a
            }));
            b.hoverPoint && b.hoverPoint.series === a && (b.hoverPoint = null)
        });
        x(k.prototype, "getExtremes", function (a) {
            return this.isSeriesBoosting && this.hasExtremes && this.hasExtremes() ? {} : a.apply(this, Array.prototype.slice.call(arguments,
                1))
        });
        ["translate", "generatePoints", "drawTracker", "drawPoints", "render"].forEach(function (a) {
            function b(b) {
                var c = this.options.stacking && ("translate" === a || "generatePoints" === a);
                if (!this.isSeriesBoosting || c || !K(this.chart) || "heatmap" === this.type || "treemap" === this.type || !l[this.type] || 0 === this.options.boostThreshold) b.call(this); else if (this[a + "Canvas"]) this[a + "Canvas"]()
            }

            x(k.prototype, a, b);
            "translate" === a && "column bar arearange columnrange heatmap treemap".split(" ").forEach(function (c) {
                w[c] && x(w[c].prototype,
                    a, b)
            })
        });
        x(k.prototype, "processData", function (a) {
            function b(a) {
                return c.forceCrop ? !1 : c.chart.isChartSeriesBoosting() || (a ? a.length : 0) >= (c.options.boostThreshold || Number.MAX_VALUE)
            }

            var c = this, k = this.options.data;
            K(this.chart) && l[this.type] ? (b(k) && "heatmap" !== this.type && "treemap" !== this.type && !this.options.stacking && this.hasExtremes && this.hasExtremes(!0) || (a.apply(this, Array.prototype.slice.call(arguments, 1)), k = this.processedXData), (this.isSeriesBoosting = b(k)) ? (k = void 0, this.options.data && this.options.data.length &&
            (k = this.getFirstValidPoint(this.options.data), q(k) || d(k) || h(12, !1, this.chart)), this.enterBoost()) : this.exitBoost && this.exitBoost()) : a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        c(k, "hide", function () {
            this.canvas && this.renderTarget && (this.ogl && this.ogl.clear(), this.boostClear())
        });
        k.prototype.enterBoost = function () {
            this.alteredByBoost = [];
            ["allowDG", "directTouch", "stickyTracking"].forEach(function (a) {
                this.alteredByBoost.push({prop: a, val: this[a], own: Object.hasOwnProperty.call(this, a)})
            }, this);
            this.directTouch = this.allowDG = !1;
            this.finishedAnimating = this.stickyTracking = !0;
            this.labelBySeries && (this.labelBySeries = this.labelBySeries.destroy())
        };
        k.prototype.exitBoost = function () {
            (this.alteredByBoost || []).forEach(function (a) {
                a.own ? this[a.prop] = a.val : delete this[a.prop]
            }, this);
            this.boostClear && this.boostClear()
        };
        k.prototype.hasExtremes = function (a) {
            var b = this.options, c = this.xAxis && this.xAxis.options, d = this.yAxis && this.yAxis.options,
                f = this.colorAxis && this.colorAxis.options;
            return b.data.length > (b.boostThreshold ||
                Number.MAX_VALUE) && q(d.min) && q(d.max) && (!a || q(c.min) && q(c.max)) && (!f || q(f.min) && q(f.max))
        };
        k.prototype.destroyGraphics = function () {
            var a = this, b = this, c = this.points, d, f;
            if (c) for (f = 0; f < c.length; f += 1) (d = c[f]) && d.destroyElements && d.destroyElements();
            ["graph", "area", "tracker"].forEach(function (a) {
                b[a] && (b[a] = b[a].destroy())
            });
            this.getZonesGraphs && this.getZonesGraphs([["graph", "highcharts-graph"]]).forEach(function (b) {
                var c = a[b[0]];
                c && (a[b[0]] = c.destroy())
            })
        };
        n.forEach(function (a) {
            D[a] && (D[a].boostThreshold =
                5E3, D[a].boostData = [], w[a].prototype.fillOpacity = !0)
        })
    });
    p(b, "Extensions/Boost/NamedColors.js", [b["Core/Color/Color.js"]], function (b) {
        var p = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            feldspar: "#d19275",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslateblue: "#8470ff",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            violetred: "#d02090",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        };
        return b.names = p
    });
    p(b, "Extensions/Boost/Boost.js", [b["Extensions/Boost/BoostUtils.js"],
        b["Extensions/Boost/BoostInit.js"], b["Extensions/BoostCanvas.js"], b["Core/Utilities.js"]], function (b, p, y, k) {
        k = k.error;
        b = b.hasWebGLSupport;
        b() ? p() : "undefined" !== typeof y ? y() : k(26)
    });
    p(b, "masters/modules/boost.src.js", [], function () {
    })
});
//# sourceMappingURL=boost.js.map