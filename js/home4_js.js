(function (window, undefined) {
    var Globalize, regexHex, regexInfinity, regexParseFloat, regexTrim, arrayIndexOf, endsWith, extend, isArray, isFunction, isObject, startsWith, trim, truncate, zeroPad, appendPreOrPostMatch, expandFormat, formatDate, formatNumber, getTokenRegExp, getEra, getEraYear, parseExact, parseNegativePattern;
    Globalize = function (cultureSelector) {
        return new Globalize.prototype.init(cultureSelector);
    };
    if (typeof require !== "undefined" && typeof exports !== "undefined" && typeof module !== "undefined") {
        module.exports = Globalize;
    } else {
        window.Globalize = Globalize;
    }
    Globalize.cultures = {};
    Globalize.prototype = {
        constructor: Globalize,
        init: function (cultureSelector) {
            this.cultures = Globalize.cultures;
            this.cultureSelector = cultureSelector;
            return this;
        }
    };
    Globalize.prototype.init.prototype = Globalize.prototype;
    Globalize.cultures["default"] = {
        name: "en",
        englishName: "English",
        nativeName: "English",
        isRTL: false,
        language: "en",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ",",
            ".": ".",
            groupSizes: [3],
            "+": "+",
            "-": "-",
            "NaN": "NaN",
            negativeInfinity: "-Infinity",
            positiveInfinity: "Infinity",
            percent: {
                pattern: ["-n %", "n %"],
                decimals: 2,
                groupSizes: [3],
                ",": ",",
                ".": ".",
                symbol: "%"
            },
            currency: {
                pattern: ["($n)", "$n"],
                decimals: 2,
                groupSizes: [3],
                ",": ",",
                ".": ".",
                symbol: "$"
            }
        },
        calendars: {
            standard: {
                name: "Gregorian_USEnglish",
                "/": "/",
                ":": ":",
                firstDay: 0,
                days: {
                    names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                },
                months: {
                    names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                    namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
                },
                AM: ["AM", "am", "AM"],
                PM: ["PM", "pm", "PM"],
                eras: [{
                    "name": "A.D.",
                    "start": null,
                    "offset": 0
                }],
                twoDigitYearMax: 2029,
                patterns: {
                    d: "M/d/yyyy",
                    D: "dddd, MMMM dd, yyyy",
                    t: "h:mm tt",
                    T: "h:mm:ss tt",
                    f: "dddd, MMMM dd, yyyy h:mm tt",
                    F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                    M: "MMMM dd",
                    Y: "yyyy MMMM",
                    S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
                }
            }
        },
        messages: {}
    };
    Globalize.cultures["default"].calendar = Globalize.cultures["default"].calendars.standard;
    Globalize.cultures.en = Globalize.cultures["default"];
    Globalize.cultureSelector = "en";
    regexHex = /^0x[a-f0-9]+$/i;
    regexInfinity = /^[+\-]?infinity$/i;
    regexParseFloat = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
    regexTrim = /^\s+|\s+$/g;
    arrayIndexOf = function (array, item) {
        if (array.indexOf) {
            return array.indexOf(item);
        }
        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    };
    endsWith = function (value, pattern) {
        return value.substr(value.length - pattern.length) === pattern;
    };
    extend = function () {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== "object" && !isFunction(target)) {
            target = {};
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (isObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isObject(src) ? src : {};
                        }
                        target[name] = extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
    isFunction = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Function]";
    };
    isObject = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    };
    startsWith = function (value, pattern) {
        return value.indexOf(pattern) === 0;
    };
    trim = function (value) {
        return (value + "").replace(regexTrim, "");
    };
    truncate = function (value) {
        if (isNaN(value)) {
            return NaN;
        }
        return Math[value < 0 ? "ceil" : "floor"](value);
    };
    zeroPad = function (str, count, left) {
        var l;
        for (l = str.length; l < count; l += 1) {
            str = (left ? ("0" + str) : (str + "0"));
        }
        return str;
    };
    appendPreOrPostMatch = function (preMatch, strings) {
        var quoteCount = 0,
            escaped = false;
        for (var i = 0, il = preMatch.length; i < il; i++) {
            var c = preMatch.charAt(i);
            switch (c) {
            case "\'":
                if (escaped) {
                    strings.push("\'");
                } else {
                    quoteCount++;
                }
                escaped = false;
                break;
            case "\\":
                if (escaped) {
                    strings.push("\\");
                }
                escaped = !escaped;
                break;
            default:
                strings.push(c);
                escaped = false;
                break;
            }
        }
        return quoteCount;
    };
    expandFormat = function (cal, format) {
        format = format || "F";
        var pattern, patterns = cal.patterns,
            len = format.length;
        if (len === 1) {
            pattern = patterns[format];
            if (!pattern) {
                throw "Invalid date format string \'" + format + "\'.";
            }
            format = pattern;
        } else if (len === 2 && format.charAt(0) === "%") {
            format = format.charAt(1);
        }
        return format;
    };
    formatDate = function (value, format, culture) {
        var cal = culture.calendar,
            convert = cal.convert,
            ret;
        if (!format || !format.length || format === "i") {
            if (culture && culture.name.length) {
                if (convert) {
                    ret = formatDate(value, cal.patterns.F, culture);
                } else {
                    var eraDate = new Date(value.getTime()),
                        era = getEra(value, cal.eras);
                    eraDate.setFullYear(getEraYear(value, cal, era));
                    ret = eraDate.toLocaleString();
                }
            } else {
                ret = value.toString();
            }
            return ret;
        }
        var eras = cal.eras,
            sortable = format === "s";
        format = expandFormat(cal, format);
        ret = [];
        var hour, zeros = ["0", "00", "000"],
            foundDay, checkedDay, dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
            quoteCount = 0,
            tokenRegExp = getTokenRegExp(),
            converted;

        function padZeros(num, c) {
            var r, s = num + "";
            if (c > 1 && s.length < c) {
                r = (zeros[c - 2] + s);
                return r.substr(r.length - c, c);
            } else {
                r = s;
            }
            return r;
        }

        function hasDay() {
            if (foundDay || checkedDay) {
                return foundDay;
            }
            foundDay = dayPartRegExp.test(format);
            checkedDay = true;
            return foundDay;
        }

        function getPart(date, part) {
            if (converted) {
                return converted[part];
            }
            switch (part) {
            case 0:
                return date.getFullYear();
            case 1:
                return date.getMonth();
            case 2:
                return date.getDate();
            default:
                throw "Invalid part value " + part;
            }
        }
        if (!sortable && convert) {
            converted = convert.fromGregorian(value);
        }
        for (;;) {
            var index = tokenRegExp.lastIndex,
                ar = tokenRegExp.exec(format);
            var preMatch = format.slice(index, ar ? ar.index : format.length);
            quoteCount += appendPreOrPostMatch(preMatch, ret);
            if (!ar) {
                break;
            }
            if (quoteCount % 2) {
                ret.push(ar[0]);
                continue;
            }
            var current = ar[0],
                clength = current.length;
            switch (current) {
            case "ddd":
            case "dddd":
                var names = (clength === 3) ? cal.days.namesAbbr : cal.days.names;
                ret.push(names[value.getDay()]);
                break;
            case "d":
            case "dd":
                foundDay = true;
                ret.push(padZeros(getPart(value, 2), clength));
                break;
            case "MMM":
            case "MMMM":
                var part = getPart(value, 1);
                ret.push((cal.monthsGenitive && hasDay()) ? (cal.monthsGenitive[clength === 3 ? "namesAbbr" : "names"][part]) : (cal.months[clength === 3 ? "namesAbbr" : "names"][part]));
                break;
            case "M":
            case "MM":
                ret.push(padZeros(getPart(value, 1) + 1, clength));
                break;
            case "y":
            case "yy":
            case "yyyy":
                part = converted ? converted[0] : getEraYear(value, cal, getEra(value, eras), sortable);
                if (clength < 4) {
                    part = part % 100;
                }
                ret.push(padZeros(part, clength));
                break;
            case "h":
            case "hh":
                hour = value.getHours() % 12;
                if (hour === 0) hour = 12;
                ret.push(padZeros(hour, clength));
                break;
            case "H":
            case "HH":
                ret.push(padZeros(value.getHours(), clength));
                break;
            case "m":
            case "mm":
                ret.push(padZeros(value.getMinutes(), clength));
                break;
            case "s":
            case "ss":
                ret.push(padZeros(value.getSeconds(), clength));
                break;
            case "t":
            case "tt":
                part = value.getHours() < 12 ? (cal.AM ? cal.AM[0] : " ") : (cal.PM ? cal.PM[0] : " ");
                ret.push(clength === 1 ? part.charAt(0) : part);
                break;
            case "f":
            case "ff":
            case "fff":
                ret.push(padZeros(value.getMilliseconds(), 3).substr(0, clength));
                break;
            case "z":
            case "zz":
                hour = value.getTimezoneOffset() / 60;
                ret.push((hour <= 0 ? "+" : "-") + padZeros(Math.floor(Math.abs(hour)), clength));
                break;
            case "zzz":
                hour = value.getTimezoneOffset() / 60;
                ret.push((hour <= 0 ? "+" : "-") + padZeros(Math.floor(Math.abs(hour)), 2) + ":" + padZeros(Math.abs(value.getTimezoneOffset() % 60), 2));
                break;
            case "g":
            case "gg":
                if (cal.eras) {
                    ret.push(cal.eras[getEra(value, eras)].name);
                }
                break;
            case "/":
                ret.push(cal["/"]);
                break;
            default:
                throw "Invalid date format pattern \'" + current + "\'.";
            }
        }
        return ret.join("");
    };
    (function () {
        var expandNumber;
        expandNumber = function (number, precision, formatInfo) {
            var groupSizes = formatInfo.groupSizes,
                curSize = groupSizes[0],
                curGroupIndex = 1,
                factor = Math.pow(10, precision),
                rounded = Math.round(number * factor) / factor;
            if (!isFinite(rounded)) {
                rounded = number;
            }
            number = rounded;
            var numberString = number + "",
                right = "",
                split = numberString.split(/e/i),
                exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
            numberString = split[0];
            split = numberString.split(".");
            numberString = split[0];
            right = split.length > 1 ? split[1] : "";
            var l;
            if (exponent > 0) {
                right = zeroPad(right, exponent, false);
                numberString += right.slice(0, exponent);
                right = right.substr(exponent);
            } else if (exponent < 0) {
                exponent = -exponent;
                numberString = zeroPad(numberString, exponent + 1, true);
                right = numberString.slice(-exponent, numberString.length) + right;
                numberString = numberString.slice(0, - exponent);
            }
            if (precision > 0) {
                right = formatInfo["."] + ((right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision));
            } else {
                right = "";
            }
            var stringIndex = numberString.length - 1,
                sep = formatInfo[","],
                ret = "";
            while (stringIndex >= 0) {
                if (curSize === 0 || curSize > stringIndex) {
                    return numberString.slice(0, stringIndex + 1) + (ret.length ? (sep + ret + right) : right);
                }
                ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + (ret.length ? (sep + ret) : "");
                stringIndex -= curSize;
                if (curGroupIndex < groupSizes.length) {
                    curSize = groupSizes[curGroupIndex];
                    curGroupIndex++;
                }
            }
            return numberString.slice(0, stringIndex + 1) + sep + ret + right;
        };
        formatNumber = function (value, format, culture) {
            if (!isFinite(value)) {
                if (value === Infinity) {
                    return culture.numberFormat.positiveInfinity;
                }
                if (value === -Infinity) {
                    return culture.numberFormat.negativeInfinity;
                }
                return culture.numberFormat["NaN"];
            }
            if (!format || format === "i") {
                return culture.name.length ? value.toLocaleString() : value.toString();
            }
            format = format || "D";
            var nf = culture.numberFormat,
                number = Math.abs(value),
                precision = -1,
                pattern;
            if (format.length > 1) precision = parseInt(format.slice(1), 10);
            var current = format.charAt(0).toUpperCase(),
                formatInfo;
            switch (current) {
            case "D":
                pattern = "n";
                number = truncate(number);
                if (precision !== -1) {
                    number = zeroPad("" + number, precision, true);
                }
                if (value < 0) number = "-" + number;
                break;
            case "N":
                formatInfo = nf;
            case "C":
                formatInfo = formatInfo || nf.currency;
            case "P":
                formatInfo = formatInfo || nf.percent;
                pattern = value < 0 ? formatInfo.pattern[0] : (formatInfo.pattern[1] || "n");
                if (precision === -1) precision = formatInfo.decimals;
                number = expandNumber(number * (current === "P" ? 100 : 1), precision, formatInfo);
                break;
            default:
                throw "Bad number format specifier: " + current;
            }
            var patternParts = /n|\$|-|%/g,
                ret = "";
            for (;;) {
                var index = patternParts.lastIndex,
                    ar = patternParts.exec(pattern);
                ret += pattern.slice(index, ar ? ar.index : pattern.length);
                if (!ar) {
                    break;
                }
                switch (ar[0]) {
                case "n":
                    ret += number;
                    break;
                case "$":
                    ret += nf.currency.symbol;
                    break;
                case "-":
                    if (/[1-9]/.test(number)) {
                        ret += nf["-"];
                    }
                    break;
                case "%":
                    ret += nf.percent.symbol;
                    break;
                }
            }
            return ret;
        };
    }());
    getTokenRegExp = function () {
        return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
    };
    getEra = function (date, eras) {
        if (!eras) return 0;
        var start, ticks = date.getTime();
        for (var i = 0, l = eras.length; i < l; i++) {
            start = eras[i].start;
            if (start === null || ticks >= start) {
                return i;
            }
        }
        return 0;
    };
    getEraYear = function (date, cal, era, sortable) {
        var year = date.getFullYear();
        if (!sortable && cal.eras) {
            year -= cal.eras[era].offset;
        }
        return year;
    };
    (function () {
        var expandYear, getDayIndex, getMonthIndex, getParseRegExp, outOfRange, toUpper, toUpperArray;
        expandYear = function (cal, year) {
            if (year < 100) {
                var now = new Date(),
                    era = getEra(now),
                    curr = getEraYear(now, cal, era),
                    twoDigitYearMax = cal.twoDigitYearMax;
                twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt(twoDigitYearMax, 10) : twoDigitYearMax;
                year += curr - (curr % 100);
                if (year > twoDigitYearMax) {
                    year -= 100;
                }
            }
            return year;
        };
        getDayIndex = function (cal, value, abbr) {
            var ret, days = cal.days,
                upperDays = cal._upperDays;
            if (!upperDays) {
                cal._upperDays = upperDays = [toUpperArray(days.names), toUpperArray(days.namesAbbr), toUpperArray(days.namesShort)];
            }
            value = toUpper(value);
            if (abbr) {
                ret = arrayIndexOf(upperDays[1], value);
                if (ret === -1) {
                    ret = arrayIndexOf(upperDays[2], value);
                }
            } else {
                ret = arrayIndexOf(upperDays[0], value);
            }
            return ret;
        };
        getMonthIndex = function (cal, value, abbr) {
            var months = cal.months,
                monthsGen = cal.monthsGenitive || cal.months,
                upperMonths = cal._upperMonths,
                upperMonthsGen = cal._upperMonthsGen;
            if (!upperMonths) {
                cal._upperMonths = upperMonths = [toUpperArray(months.names), toUpperArray(months.namesAbbr)];
                cal._upperMonthsGen = upperMonthsGen = [toUpperArray(monthsGen.names), toUpperArray(monthsGen.namesAbbr)];
            }
            value = toUpper(value);
            var i = arrayIndexOf(abbr ? upperMonths[1] : upperMonths[0], value);
            if (i < 0) {
                i = arrayIndexOf(abbr ? upperMonthsGen[1] : upperMonthsGen[0], value);
            }
            return i;
        };
        getParseRegExp = function (cal, format) {
            var re = cal._parseRegExp;
            if (!re) {
                cal._parseRegExp = re = {};
            } else {
                var reFormat = re[format];
                if (reFormat) {
                    return reFormat;
                }
            }
            var expFormat = expandFormat(cal, format).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"),
                regexp = ["^"],
                groups = [],
                index = 0,
                quoteCount = 0,
                tokenRegExp = getTokenRegExp(),
                match;
            while ((match = tokenRegExp.exec(expFormat)) !== null) {
                var preMatch = expFormat.slice(index, match.index);
                index = tokenRegExp.lastIndex;
                quoteCount += appendPreOrPostMatch(preMatch, regexp);
                if (quoteCount % 2) {
                    regexp.push(match[0]);
                    continue;
                }
                var m = match[0],
                    len = m.length,
                    add;
                switch (m) {
                case "dddd":
                case "ddd":
                case "MMMM":
                case "MMM":
                case "gg":
                case "g":
                    add = "(\\D+)";
                    break;
                case "tt":
                case "t":
                    add = "(\\D*)";
                    break;
                case "yyyy":
                case "fff":
                case "ff":
                case "f":
                    add = "(\\d{" + len + "})";
                    break;
                case "dd":
                case "d":
                case "MM":
                case "M":
                case "yy":
                case "y":
                case "HH":
                case "H":
                case "hh":
                case "h":
                case "mm":
                case "m":
                case "ss":
                case "s":
                    add = "(\\d\\d?)";
                    break;
                case "zzz":
                    add = "([+-]?\\d\\d?:\\d{2})";
                    break;
                case "zz":
                case "z":
                    add = "([+-]?\\d\\d?)";
                    break;
                case "/":
                    add = "(\\/)";
                    break;
                default:
                    throw "Invalid date format pattern \'" + m + "\'.";
                }
                if (add) {
                    regexp.push(add);
                }
                groups.push(match[0]);
            }
            appendPreOrPostMatch(expFormat.slice(index), regexp);
            regexp.push("$");
            var regexpStr = regexp.join("").replace(/\s+/g, "\\s+"),
                parseRegExp = {
                    "regExp": regexpStr,
                    "groups": groups
                };
            return re[format] = parseRegExp;
        };
        outOfRange = function (value, low, high) {
            return value < low || value > high;
        };
        toUpper = function (value) {
            return value.split("\u00A0").join(" ").toUpperCase();
        };
        toUpperArray = function (arr) {
            var results = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                results[i] = toUpper(arr[i]);
            }
            return results;
        };
        parseExact = function (value, format, culture) {
            value = trim(value);
            var cal = culture.calendar,
                parseInfo = getParseRegExp(cal, format),
                match = new RegExp(parseInfo.regExp).exec(value);
            if (match === null) {
                return null;
            }
            var groups = parseInfo.groups,
                era = null,
                year = null,
                month = null,
                date = null,
                weekDay = null,
                hour = 0,
                hourOffset, min = 0,
                sec = 0,
                msec = 0,
                tzMinOffset = null,
                pmHour = false;
            for (var j = 0, jl = groups.length; j < jl; j++) {
                var matchGroup = match[j + 1];
                if (matchGroup) {
                    var current = groups[j],
                        clength = current.length,
                        matchInt = parseInt(matchGroup, 10);
                    switch (current) {
                    case "dd":
                    case "d":
                        date = matchInt;
                        if (outOfRange(date, 1, 31)) return null;
                        break;
                    case "MMM":
                    case "MMMM":
                        month = getMonthIndex(cal, matchGroup, clength === 3);
                        if (outOfRange(month, 0, 11)) return null;
                        break;
                    case "M":
                    case "MM":
                        month = matchInt - 1;
                        if (outOfRange(month, 0, 11)) return null;
                        break;
                    case "y":
                    case "yy":
                    case "yyyy":
                        year = clength < 4 ? expandYear(cal, matchInt) : matchInt;
                        if (outOfRange(year, 0, 9999)) return null;
                        break;
                    case "h":
                    case "hh":
                        hour = matchInt;
                        if (hour === 12) hour = 0;
                        if (outOfRange(hour, 0, 11)) return null;
                        break;
                    case "H":
                    case "HH":
                        hour = matchInt;
                        if (outOfRange(hour, 0, 23)) return null;
                        break;
                    case "m":
                    case "mm":
                        min = matchInt;
                        if (outOfRange(min, 0, 59)) return null;
                        break;
                    case "s":
                    case "ss":
                        sec = matchInt;
                        if (outOfRange(sec, 0, 59)) return null;
                        break;
                    case "tt":
                    case "t":
                        pmHour = cal.PM && (matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2]);
                        if (!pmHour && (!cal.AM || (matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2]))) return null;
                        break;
                    case "f":
                    case "ff":
                    case "fff":
                        msec = matchInt * Math.pow(10, 3 - clength);
                        if (outOfRange(msec, 0, 999)) return null;
                        break;
                    case "ddd":
                    case "dddd":
                        weekDay = getDayIndex(cal, matchGroup, clength === 3);
                        if (outOfRange(weekDay, 0, 6)) return null;
                        break;
                    case "zzz":
                        var offsets = matchGroup.split(/:/);
                        if (offsets.length !== 2) return null;
                        hourOffset = parseInt(offsets[0], 10);
                        if (outOfRange(hourOffset, - 12, 13)) return null;
                        var minOffset = parseInt(offsets[1], 10);
                        if (outOfRange(minOffset, 0, 59)) return null;
                        tzMinOffset = (hourOffset * 60) + (startsWith(matchGroup, "-") ? -minOffset : minOffset);
                        break;
                    case "z":
                    case "zz":
                        hourOffset = matchInt;
                        if (outOfRange(hourOffset, - 12, 13)) return null;
                        tzMinOffset = hourOffset * 60;
                        break;
                    case "g":
                    case "gg":
                        var eraName = matchGroup;
                        if (!eraName || !cal.eras) return null;
                        eraName = trim(eraName.toLowerCase());
                        for (var i = 0, l = cal.eras.length; i < l; i++) {
                            if (eraName === cal.eras[i].name.toLowerCase()) {
                                era = i;
                                break;
                            }
                        }
                        if (era === null) return null;
                        break;
                    }
                }
            }
            var result = new Date(),
                defaultYear, convert = cal.convert;
            defaultYear = convert ? convert.fromGregorian(result)[0] : result.getFullYear();
            if (year === null) {
                year = defaultYear;
            } else if (cal.eras) {
                year += cal.eras[(era || 0)].offset;
            }
            if (month === null) {
                month = 0;
            }
            if (date === null) {
                date = 1;
            }
            if (convert) {
                result = convert.toGregorian(year, month, date);
                if (result === null) return null;
            } else {
                result.setFullYear(year, month, date);
                if (result.getDate() !== date) return null;
                if (weekDay !== null && result.getDay() !== weekDay) {
                    return null;
                }
            }
            if (pmHour && hour < 12) {
                hour += 12;
            }
            result.setHours(hour, min, sec, msec);
            if (tzMinOffset !== null) {
                var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
                result.setHours(result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60);
            }
            return result;
        };
    }());
    parseNegativePattern = function (value, nf, negativePattern) {
        var neg = nf["-"],
            pos = nf["+"],
            ret;
        switch (negativePattern) {
        case "n -":
            neg = " " + neg;
            pos = " " + pos;
        case "n-":
            if (endsWith(value, neg)) {
                ret = ["-", value.substr(0, value.length - neg.length)];
            } else if (endsWith(value, pos)) {
                ret = ["+", value.substr(0, value.length - pos.length)];
            }
            break;
        case "- n":
            neg += " ";
            pos += " ";
        case "-n":
            if (startsWith(value, neg)) {
                ret = ["-", value.substr(neg.length)];
            } else if (startsWith(value, pos)) {
                ret = ["+", value.substr(pos.length)];
            }
            break;
        case "(n)":
            if (startsWith(value, "(") && endsWith(value, ")")) {
                ret = ["-", value.substr(1, value.length - 2)];
            }
            break;
        }
        return ret || ["", value];
    };
    Globalize.prototype.findClosestCulture = function (cultureSelector) {
        return Globalize.findClosestCulture.call(this, cultureSelector);
    };
    Globalize.prototype.format = function (value, format, cultureSelector) {
        return Globalize.format.call(this, value, format, cultureSelector);
    };
    Globalize.prototype.localize = function (key, cultureSelector) {
        return Globalize.localize.call(this, key, cultureSelector);
    };
    Globalize.prototype.parseInt = function (value, radix, cultureSelector) {
        return Globalize.parseInt.call(this, value, radix, cultureSelector);
    };
    Globalize.prototype.parseFloat = function (value, radix, cultureSelector) {
        return Globalize.parseFloat.call(this, value, radix, cultureSelector);
    };
    Globalize.prototype.culture = function (cultureSelector) {
        return Globalize.culture.call(this, cultureSelector);
    };
    Globalize.addCultureInfo = function (cultureName, baseCultureName, info) {
        var base = {}, isNew = false;
        if (typeof cultureName !== "string") {
            info = cultureName;
            cultureName = this.culture().name;
            base = this.cultures[cultureName];
        } else if (typeof baseCultureName !== "string") {
            info = baseCultureName;
            isNew = (this.cultures[cultureName] == null);
            base = this.cultures[cultureName] || this.cultures["default"];
        } else {
            isNew = true;
            base = this.cultures[baseCultureName];
        }
        this.cultures[cultureName] = extend(true, {}, base, info);
        if (isNew) {
            this.cultures[cultureName].calendar = this.cultures[cultureName].calendars.standard;
        }
    };
    Globalize.findClosestCulture = function (name) {
        var match;
        if (!name) {
            return this.findClosestCulture(this.cultureSelector) || this.cultures["default"];
        }
        if (typeof name === "string") {
            name = name.split(",");
        }
        if (isArray(name)) {
            var lang, cultures = this.cultures,
                list = name,
                i, l = list.length,
                prioritized = [];
            for (i = 0; i < l; i++) {
                name = trim(list[i]);
                var pri, parts = name.split(";");
                lang = trim(parts[0]);
                if (parts.length === 1) {
                    pri = 1;
                } else {
                    name = trim(parts[1]);
                    if (name.indexOf("q=") === 0) {
                        name = name.substr(2);
                        pri = parseFloat(name);
                        pri = isNaN(pri) ? 0 : pri;
                    } else {
                        pri = 1;
                    }
                }
                prioritized.push({
                    lang: lang,
                    pri: pri
                });
            }
            prioritized.sort(function (a, b) {
                if (a.pri < b.pri) {
                    return 1;
                } else if (a.pri > b.pri) {
                    return -1;
                }
                return 0;
            });
            for (i = 0; i < l; i++) {
                lang = prioritized[i].lang;
                match = cultures[lang];
                if (match) {
                    return match;
                }
            }
            for (i = 0; i < l; i++) {
                lang = prioritized[i].lang;
                do {
                    var index = lang.lastIndexOf("-");
                    if (index === -1) {
                        break;
                    }
                    lang = lang.substr(0, index);
                    match = cultures[lang];
                    if (match) {
                        return match;
                    }
                }
                while (1);
            }
            for (i = 0; i < l; i++) {
                lang = prioritized[i].lang;
                for (var cultureKey in cultures) {
                    var culture = cultures[cultureKey];
                    if (culture.language == lang) {
                        return culture;
                    }
                }
            }
        } else if (typeof name === "object") {
            return name;
        }
        return match || null;
    };
    Globalize.format = function (value, format, cultureSelector) {
        var culture = this.findClosestCulture(cultureSelector);
        if (value instanceof Date) {
            value = formatDate(value, format, culture);
        } else if (typeof value === "number") {
            value = formatNumber(value, format, culture);
        }
        return value;
    };
    Globalize.localize = function (key, cultureSelector) {
        return this.findClosestCulture(cultureSelector).messages[key] || this.cultures["default"].messages[key];
    };
    Globalize.parseDate = function (value, formats, culture) {
        culture = this.findClosestCulture(culture);
        var date, prop, patterns;
        if (formats) {
            if (typeof formats === "string") {
                formats = [formats];
            }
            if (formats.length) {
                for (var i = 0, l = formats.length; i < l; i++) {
                    var format = formats[i];
                    if (format) {
                        date = parseExact(value, format, culture);
                        if (date) {
                            break;
                        }
                    }
                }
            }
        } else {
            patterns = culture.calendar.patterns;
            for (prop in patterns) {
                date = parseExact(value, patterns[prop], culture);
                if (date) {
                    break;
                }
            }
        }
        return date || null;
    };
    Globalize.parseInt = function (value, radix, cultureSelector) {
        return truncate(Globalize.parseFloat(value, radix, cultureSelector));
    };
    Globalize.parseFloat = function (value, radix, cultureSelector) {
        if (typeof radix !== "number") {
            cultureSelector = radix;
            radix = 10;
        }
        var culture = this.findClosestCulture(cultureSelector);
        var ret = NaN,
            nf = culture.numberFormat;
        if (value.indexOf(culture.numberFormat.currency.symbol) > -1) {
            value = value.replace(culture.numberFormat.currency.symbol, "");
            value = value.replace(culture.numberFormat.currency["."], culture.numberFormat["."]);
        }
        value = trim(value);
        if (regexInfinity.test(value)) {
            ret = parseFloat(value);
        } else if (!radix && regexHex.test(value)) {
            ret = parseInt(value, 16);
        } else {
            var signInfo = parseNegativePattern(value, nf, nf.pattern[0]),
                sign = signInfo[0],
                num = signInfo[1];
            if (sign === "" && nf.pattern[0] !== "(n)") {
                signInfo = parseNegativePattern(value, nf, "(n)");
                sign = signInfo[0];
                num = signInfo[1];
            }
            if (sign === "" && nf.pattern[0] !== "-n") {
                signInfo = parseNegativePattern(value, nf, "-n");
                sign = signInfo[0];
                num = signInfo[1];
            }
            sign = sign || "+";
            var exponent, intAndFraction, exponentPos = num.indexOf("e");
            if (exponentPos < 0) exponentPos = num.indexOf("E");
            if (exponentPos < 0) {
                intAndFraction = num;
                exponent = null;
            } else {
                intAndFraction = num.substr(0, exponentPos);
                exponent = num.substr(exponentPos + 1);
            }
            var integer, fraction, decSep = nf["."],
                decimalPos = intAndFraction.indexOf(decSep);
            if (decimalPos < 0) {
                integer = intAndFraction;
                fraction = null;
            } else {
                integer = intAndFraction.substr(0, decimalPos);
                fraction = intAndFraction.substr(decimalPos + decSep.length);
            }
            var groupSep = nf[","];
            integer = integer.split(groupSep).join("");
            var altGroupSep = groupSep.replace(/\u00A0/g, " ");
            if (groupSep !== altGroupSep) {
                integer = integer.split(altGroupSep).join("");
            }
            var p = sign + integer;
            if (fraction !== null) {
                p += "." + fraction;
            }
            if (exponent !== null) {
                var expSignInfo = parseNegativePattern(exponent, nf, "-n");
                p += "e" + (expSignInfo[0] || "+") + expSignInfo[1];
            }
            if (regexParseFloat.test(p)) {
                ret = parseFloat(p);
            }
        }
        return ret;
    };
    Globalize.culture = function (cultureSelector) {
        if (typeof cultureSelector !== "undefined") {
            this.cultureSelector = cultureSelector;
        }
        return this.findClosestCulture(cultureSelector) || this.cultures["default"];
    };
}(this));
(function (c, j) {
    function k(a) {
        return !c(a).parents().andSelf().filter(function () {
            return c.curCSS(this, "visibility") === "hidden" || c.expr.filters.hidden(this)
        }).length
    }
    c.ui = c.ui || {};
    if (!c.ui.version) {
        c.extend(c.ui, {
            version: "1.8.11",
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91,
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91
            }
        });
        c.fn.extend({
            _focus: c.fn.focus,
            focus: function (a, b) {
                return typeof a === "number" ? this.each(function () {
                    var d = this;
                    setTimeout(function () {
                        c(d).focus();
                        b && b.call(d)
                    }, a)
                }) : this._focus.apply(this, arguments)
            },
            scrollParent: function () {
                var a;
                a = c.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
                    return /(relative|absolute|fixed)/.test(c.curCSS(this, "position", 1)) && /(auto|scroll)/.test(c.curCSS(this, "overflow", 1) + c.curCSS(this, "overflow-y", 1) + c.curCSS(this, "overflow-x", 1))
                }).eq(0) : this.parents().filter(function () {
                    return /(auto|scroll)/.test(c.curCSS(this, "overflow", 1) + c.curCSS(this, "overflow-y", 1) + c.curCSS(this, "overflow-x", 1))
                }).eq(0);
                return /fixed/.test(this.css("position")) || !a.length ? c(document) : a
            },
            zIndex: function (a) {
                if (a !== j) return this.css("zIndex", a);
                if (this.length) {
                    a = c(this[0]);
                    for (var b; a.length && a[0] !== document;) {
                        b = a.css("position");
                        if (b === "absolute" || b === "relative" || b === "fixed") {
                            b = parseInt(a.css("zIndex"), 10);
                            if (!isNaN(b) && b !== 0) return b
                        }
                        a = a.parent()
                    }
                }
                return 0
            },
            disableSelection: function () {
                return this.bind((c.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (a) {
                    a.preventDefault()
                })
            },
            enableSelection: function () {
                return this.unbind(".ui-disableSelection")
            }
        });
        c.each(["Width", "Height"], function (a, b) {
            function d(f, g, l, m) {
                c.each(e, function () {
                    g -= parseFloat(c.curCSS(f, "padding" + this, true)) || 0;
                    if (l) g -= parseFloat(c.curCSS(f, "border" + this + "Width", true)) || 0;
                    if (m) g -= parseFloat(c.curCSS(f, "margin" + this, true)) || 0
                });
                return g
            }
            var e = b === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
                h = b.toLowerCase(),
                i = {
                    innerWidth: c.fn.innerWidth,
                    innerHeight: c.fn.innerHeight,
                    outerWidth: c.fn.outerWidth,
                    outerHeight: c.fn.outerHeight
                };
            c.fn["inner" + b] = function (f) {
                if (f === j) return i["inner" + b].call(this);
                return this.each(function () {
                    c(this).css(h, d(this, f) + "px")
                })
            };
            c.fn["outer" + b] = function (f, g) {
                if (typeof f !== "number") return i["outer" + b].call(this, f);
                return this.each(function () {
                    c(this).css(h, d(this, f, true, g) + "px")
                })
            }
        });
        c.extend(c.expr[":"], {
            data: function (a, b, d) {
                return !!c.data(a, d[3])
            },
            focusable: function (a) {
                var b = a.nodeName.toLowerCase(),
                    d = c.attr(a, "tabindex");
                if ("area" === b) {
                    b = a.parentNode;
                    d = b.name;
                    if (!a.href || !d || b.nodeName.toLowerCase() !== "map") return false;
                    a = c("img[usemap=#" + d + "]")[0];
                    return !!a && k(a)
                }
                return (/input|select|textarea|button|object/.test(b) ? !a.disabled : "a" == b ? a.href || !isNaN(d) : !isNaN(d)) && k(a)
            },
            tabbable: function (a) {
                var b = c.attr(a, "tabindex");
                return (isNaN(b) || b >= 0) && c(a).is(":focusable")
            }
        });
        c(function () {
            var a = document.body,
                b = a.appendChild(b = document.createElement("div"));
            c.extend(b.style, {
                minHeight: "100px",
                height: "auto",
                padding: 0,
                borderWidth: 0
            });
            c.support.minHeight = b.offsetHeight === 100;
            c.support.selectstart = "onselectstart" in b;
            a.removeChild(b).style.display = "none"
        });
        c.extend(c.ui, {
            plugin: {
                add: function (a, b, d) {
                    a = c.ui[a].prototype;
                    for (var e in d) {
                        a.plugins[e] = a.plugins[e] || [];
                        a.plugins[e].push([b, d[e]])
                    }
                },
                call: function (a, b, d) {
                    if ((b = a.plugins[b]) && a.element[0].parentNode) for (var e = 0; e < b.length; e++) a.options[b[e][0]] && b[e][1].apply(a.element, d)
                }
            },
            contains: function (a, b) {
                return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b)
            },
            hasScroll: function (a, b) {
                if (c(a).css("overflow") === "hidden") return false;
                b = b && b === "left" ? "scrollLeft" : "scrollTop";
                var d = false;
                if (a[b] > 0) return true;
                a[b] = 1;
                d = a[b] > 0;
                a[b] = 0;
                return d
            },
            isOverAxis: function (a, b, d) {
                return a > b && a < b + d
            },
            isOver: function (a, b, d, e, h, i) {
                return c.ui.isOverAxis(a, d, h) && c.ui.isOverAxis(b, e, i)
            }
        })
    }
})(jQuery);;
(function (b, j) {
    if (b.cleanData) {
        var k = b.cleanData;
        b.cleanData = function (a) {
            for (var c = 0, d;
            (d = a[c]) != null; c++) b(d).triggerHandler("remove");
            k(a)
        }
    } else {
        var l = b.fn.remove;
        b.fn.remove = function (a, c) {
            return this.each(function () {
                if (!c) if (!a || b.filter(a, [this]).length) b("*", this).add([this]).each(function () {
                    b(this).triggerHandler("remove")
                });
                return l.call(b(this), a, c)
            })
        }
    }
    b.widget = function (a, c, d) {
        var e = a.split(".")[0],
            f;
        a = a.split(".")[1];
        f = e + "-" + a;
        if (!d) {
            d = c;
            c = b.Widget
        }
        b.expr[":"][f] = function (h) {
            return !!b.data(h, a)
        };
        b[e] = b[e] || {};
        b[e][a] = function (h, g) {
            arguments.length && this._createWidget(h, g)
        };
        c = new c;
        c.options = b.extend(true, {}, c.options);
        b[e][a].prototype = b.extend(true, c, {
            namespace: e,
            widgetName: a,
            widgetEventPrefix: b[e][a].prototype.widgetEventPrefix || a,
            widgetBaseClass: f
        }, d);
        b.widget.bridge(a, b[e][a])
    };
    b.widget.bridge = function (a, c) {
        b.fn[a] = function (d) {
            var e = typeof d === "string",
                f = Array.prototype.slice.call(arguments, 1),
                h = this;
            d = !e && f.length ? b.extend.apply(null, [true, d].concat(f)) : d;
            if (e && d.charAt(0) === "_") return h;
            e ? this.each(function () {
                var g = b.data(this, a),
                    i = g && b.isFunction(g[d]) ? g[d].apply(g, f) : g;
                if (i !== g && i !== j) {
                    h = i;
                    return false
                }
            }) : this.each(function () {
                var g = b.data(this, a);
                g ? g.option(d || {})._init() : b.data(this, a, new c(d, this))
            });
            return h
        }
    };
    b.Widget = function (a, c) {
        arguments.length && this._createWidget(a, c)
    };
    b.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function (a, c) {
            b.data(c, this.widgetName, this);
            this.element = b(c);
            this.options = b.extend(true, {}, this.options, this._getCreateOptions(), a);
            var d = this;
            this.element.bind("remove." + this.widgetName, function () {
                d.destroy()
            });
            this._create();
            this._trigger("create");
            this._init()
        },
        _getCreateOptions: function () {
            return b.metadata && b.metadata.get(this.element[0])[this.widgetName]
        },
        _create: function () {},
        _init: function () {},
        destroy: function () {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
        },
        widget: function () {
            return this.element
        },
        option: function (a, c) {
            var d = a;
            if (arguments.length === 0) return b.extend({}, this.options);
            if (typeof a === "string") {
                if (c === j) return this.options[a];
                d = {};
                d[a] = c
            }
            this._setOptions(d);
            return this
        },
        _setOptions: function (a) {
            var c = this;
            b.each(a, function (d, e) {
                c._setOption(d, e)
            });
            return this
        },
        _setOption: function (a, c) {
            this.options[a] = c;
            if (a === "disabled") this.widget()[c ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", c);
            return this
        },
        enable: function () {
            return this._setOption("disabled", false)
        },
        disable: function () {
            return this._setOption("disabled", true)
        },
        _trigger: function (a, c, d) {
            var e = this.options[a];
            c = b.Event(c);
            c.type = (a === this.widgetEventPrefix ? a : this.widgetEventPrefix + a).toLowerCase();
            d = d || {};
            if (c.originalEvent) {
                a = b.event.props.length;
                for (var f; a;) {
                    f = b.event.props[--a];
                    c[f] = c.originalEvent[f]
                }
            }
            this.element.trigger(c, d);
            return !(b.isFunction(e) && e.call(this.element[0], c, d) === false || c.isDefaultPrevented())
        }
    }
})(jQuery);;
(function (b) {
    b.widget("ui.mouse", {
        options: {
            cancel: ":input,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function () {
            var a = this;
            this.element.bind("mousedown." + this.widgetName, function (c) {
                return a._mouseDown(c)
            }).bind("click." + this.widgetName, function (c) {
                if (true === b.data(c.target, a.widgetName + ".preventClickEvent")) {
                    b.removeData(c.target, a.widgetName + ".preventClickEvent");
                    c.stopImmediatePropagation();
                    return false
                }
            });
            this.started = false
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName)
        },
        _mouseDown: function (a) {
            a.originalEvent = a.originalEvent || {};
            if (!a.originalEvent.mouseHandled) {
                this._mouseStarted && this._mouseUp(a);
                this._mouseDownEvent = a;
                var c = this,
                    e = a.which == 1,
                    f = typeof this.options.cancel == "string" ? b(a.target).parents().add(a.target).filter(this.options.cancel).length : false;
                if (!e || f || !this._mouseCapture(a)) return true;
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) this._mouseDelayTimer = setTimeout(function () {
                    c.mouseDelayMet = true
                }, this.options.delay);
                if (this._mouseDistanceMet(a) && this._mouseDelayMet(a)) {
                    this._mouseStarted = this._mouseStart(a) !== false;
                    if (!this._mouseStarted) {
                        a.preventDefault();
                        return true
                    }
                }
                true === b.data(a.target, this.widgetName + ".preventClickEvent") && b.removeData(a.target, this.widgetName + ".preventClickEvent");
                this._mouseMoveDelegate = function (d) {
                    return c._mouseMove(d)
                };
                this._mouseUpDelegate = function (d) {
                    return c._mouseUp(d)
                };
                b(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                a.preventDefault();
                return a.originalEvent.mouseHandled = true
            }
        },
        _mouseMove: function (a) {
            if (b.browser.msie && !(document.documentMode >= 9) && !a.button) return this._mouseUp(a);
            if (this._mouseStarted) {
                this._mouseDrag(a);
                return a.preventDefault()
            }
            if (this._mouseDistanceMet(a) && this._mouseDelayMet(a))(this._mouseStarted = this._mouseStart(this._mouseDownEvent, a) !== false) ? this._mouseDrag(a) : this._mouseUp(a);
            return !this._mouseStarted
        },
        _mouseUp: function (a) {
            b(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                a.target == this._mouseDownEvent.target && b.data(a.target, this.widgetName + ".preventClickEvent", true);
                this._mouseStop(a)
            }
            return false
        },
        _mouseDistanceMet: function (a) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function () {
            return this.mouseDelayMet
        },
        _mouseStart: function () {},
        _mouseDrag: function () {},
        _mouseStop: function () {},
        _mouseCapture: function () {
            return true
        }
    })
})(jQuery);;
(function (c) {
    c.ui = c.ui || {};
    var n = /left|center|right/,
        o = /top|center|bottom/,
        t = c.fn.position,
        u = c.fn.offset;
    c.fn.position = function (b) {
        if (!b || !b.of) return t.apply(this, arguments);
        b = c.extend({}, b);
        var a = c(b.of),
            d = a[0],
            g = (b.collision || "flip").split(" "),
            e = b.offset ? b.offset.split(" ") : [0, 0],
            h, k, j;
        if (d.nodeType === 9) {
            h = a.width();
            k = a.height();
            j = {
                top: 0,
                left: 0
            }
        } else if (d.setTimeout) {
            h = a.width();
            k = a.height();
            j = {
                top: a.scrollTop(),
                left: a.scrollLeft()
            }
        } else if (d.preventDefault) {
            b.at = "left top";
            h = k = 0;
            j = {
                top: b.of.pageY,
                left: b.of.pageX
            }
        } else {
            h = a.outerWidth();
            k = a.outerHeight();
            j = a.offset()
        }
        c.each(["my", "at"], function () {
            var f = (b[this] || "").split(" ");
            if (f.length === 1) f = n.test(f[0]) ? f.concat(["center"]) : o.test(f[0]) ? ["center"].concat(f) : ["center", "center"];
            f[0] = n.test(f[0]) ? f[0] : "center";
            f[1] = o.test(f[1]) ? f[1] : "center";
            b[this] = f
        });
        if (g.length === 1) g[1] = g[0];
        e[0] = parseInt(e[0], 10) || 0;
        if (e.length === 1) e[1] = e[0];
        e[1] = parseInt(e[1], 10) || 0;
        if (b.at[0] === "right") j.left += h;
        else if (b.at[0] === "center") j.left += h / 2;
        if (b.at[1] === "bottom") j.top += k;
        else if (b.at[1] === "center") j.top += k / 2;
        j.left += e[0];
        j.top += e[1];
        return this.each(function () {
            var f = c(this),
                l = f.outerWidth(),
                m = f.outerHeight(),
                p = parseInt(c.curCSS(this, "marginLeft", true)) || 0,
                q = parseInt(c.curCSS(this, "marginTop", true)) || 0,
                v = l + p + (parseInt(c.curCSS(this, "marginRight", true)) || 0),
                w = m + q + (parseInt(c.curCSS(this, "marginBottom", true)) || 0),
                i = c.extend({}, j),
                r;
            if (b.my[0] === "right") i.left -= l;
            else if (b.my[0] === "center") i.left -= l / 2;
            if (b.my[1] === "bottom") i.top -= m;
            else if (b.my[1] === "center") i.top -= m / 2;
            i.left = Math.round(i.left);
            i.top = Math.round(i.top);
            r = {
                left: i.left - p,
                top: i.top - q
            };
            c.each(["left", "top"], function (s, x) {
                c.ui.position[g[s]] && c.ui.position[g[s]][x](i, {
                    targetWidth: h,
                    targetHeight: k,
                    elemWidth: l,
                    elemHeight: m,
                    collisionPosition: r,
                    collisionWidth: v,
                    collisionHeight: w,
                    offset: e,
                    my: b.my,
                    at: b.at
                })
            });
            c.fn.bgiframe && f.bgiframe();
            f.offset(c.extend(i, {
                using: b.using
            }))
        })
    };
    c.ui.position = {
        fit: {
            left: function (b, a) {
                var d = c(window);
                d = a.collisionPosition.left + a.collisionWidth - d.width() - d.scrollLeft();
                b.left = d > 0 ? b.left - d : Math.max(b.left - a.collisionPosition.left, b.left)
            },
            top: function (b, a) {
                var d = c(window);
                d = a.collisionPosition.top + a.collisionHeight - d.height() - d.scrollTop();
                b.top = d > 0 ? b.top - d : Math.max(b.top - a.collisionPosition.top, b.top)
            }
        },
        flip: {
            left: function (b, a) {
                if (a.at[0] !== "center") {
                    var d = c(window);
                    d = a.collisionPosition.left + a.collisionWidth - d.width() - d.scrollLeft();
                    var g = a.my[0] === "left" ? -a.elemWidth : a.my[0] === "right" ? a.elemWidth : 0,
                        e = a.at[0] === "left" ? a.targetWidth : -a.targetWidth,
                        h = -2 * a.offset[0];
                    b.left += a.collisionPosition.left < 0 ? g + e + h : d > 0 ? g + e + h : 0
                }
            },
            top: function (b, a) {
                if (a.at[1] !== "center") {
                    var d = c(window);
                    d = a.collisionPosition.top + a.collisionHeight - d.height() - d.scrollTop();
                    var g = a.my[1] === "top" ? -a.elemHeight : a.my[1] === "bottom" ? a.elemHeight : 0,
                        e = a.at[1] === "top" ? a.targetHeight : -a.targetHeight,
                        h = -2 * a.offset[1];
                    b.top += a.collisionPosition.top < 0 ? g + e + h : d > 0 ? g + e + h : 0
                }
            }
        }
    };
    if (!c.offset.setOffset) {
        c.offset.setOffset = function (b, a) {
            if (/static/.test(c.curCSS(b, "position"))) b.style.position = "relative";
            var d = c(b),
                g = d.offset(),
                e = parseInt(c.curCSS(b, "top", true), 10) || 0,
                h = parseInt(c.curCSS(b, "left", true), 10) || 0;
            g = {
                top: a.top - g.top + e,
                left: a.left - g.left + h
            };
            "using" in a ? a.using.call(b, g) : d.css(g)
        };
        c.fn.offset = function (b) {
            var a = this[0];
            if (!a || !a.ownerDocument) return null;
            if (b) return this.each(function () {
                c.offset.setOffset(this, b)
            });
            return u.call(this)
        }
    }
})(jQuery);;
(function (d) {
    d.widget("ui.draggable", d.ui.mouse, {
        widgetEventPrefix: "drag",
        options: {
            addClasses: true,
            appendTo: "parent",
            axis: false,
            connectToSortable: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            grid: false,
            handle: false,
            helper: "original",
            iframeFix: false,
            opacity: false,
            refreshPositions: false,
            revert: false,
            revertDuration: 500,
            scope: "default",
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: false,
            snapMode: "both",
            snapTolerance: 20,
            stack: false,
            zIndex: false
        },
        _create: function () {
            if (this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position"))) this.element[0].style.position = "relative";
            this.options.addClasses && this.element.addClass("ui-draggable");
            this.options.disabled && this.element.addClass("ui-draggable-disabled");
            this._mouseInit()
        },
        destroy: function () {
            if (this.element.data("draggable")) {
                this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
                this._mouseDestroy();
                return this
            }
        },
        _mouseCapture: function (a) {
            var b = this.options;
            if (this.helper || b.disabled || d(a.target).is(".ui-resizable-handle")) return false;
            this.handle = this._getHandle(a);
            if (!this.handle) return false;
            return true
        },
        _mouseStart: function (a) {
            var b = this.options;
            this.helper = this._createHelper(a);
            this._cacheHelperProportions();
            if (d.ui.ddmanager) d.ui.ddmanager.current = this;
            this._cacheMargins();
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.positionAbs = this.element.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            d.extend(this.offset, {
                click: {
                    left: a.pageX - this.offset.left,
                    top: a.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this.position = this._generatePosition(a);
            this.originalPageX = a.pageX;
            this.originalPageY = a.pageY;
            b.cursorAt && this._adjustOffsetFromHelper(b.cursorAt);
            b.containment && this._setContainment();
            if (this._trigger("start", a) === false) {
                this._clear();
                return false
            }
            this._cacheHelperProportions();
            d.ui.ddmanager && !b.dropBehaviour && d.ui.ddmanager.prepareOffsets(this, a);
            this.helper.addClass("ui-draggable-dragging");
            this._mouseDrag(a, true);
            return true
        },
        _mouseDrag: function (a, b) {
            this.position = this._generatePosition(a);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!b) {
                b = this._uiHash();
                if (this._trigger("drag", a, b) === false) {
                    this._mouseUp({});
                    return false
                }
                this.position = b.position
            }
            if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px";
            d.ui.ddmanager && d.ui.ddmanager.drag(this, a);
            return false
        },
        _mouseStop: function (a) {
            var b = false;
            if (d.ui.ddmanager && !this.options.dropBehaviour) b = d.ui.ddmanager.drop(this, a);
            if (this.dropped) {
                b = this.dropped;
                this.dropped = false
            }
            if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original") return false;
            if (this.options.revert == "invalid" && !b || this.options.revert == "valid" && b || this.options.revert === true || d.isFunction(this.options.revert) && this.options.revert.call(this.element, b)) {
                var c = this;
                d(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                    c._trigger("stop", a) !== false && c._clear()
                })
            } else this._trigger("stop", a) !== false && this._clear();
            return false
        },
        cancel: function () {
            this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
            return this
        },
        _getHandle: function (a) {
            var b = !this.options.handle || !d(this.options.handle, this.element).length ? true : false;
            d(this.options.handle, this.element).find("*").andSelf().each(function () {
                if (this == a.target) b = true
            });
            return b
        },
        _createHelper: function (a) {
            var b = this.options;
            a = d.isFunction(b.helper) ? d(b.helper.apply(this.element[0], [a])) : b.helper == "clone" ? this.element.clone() : this.element;
            a.parents("body").length || a.appendTo(b.appendTo == "parent" ? this.element[0].parentNode : b.appendTo);
            a[0] != this.element[0] && !/(fixed|absolute)/.test(a.css("position")) && a.css("position", "absolute");
            return a
        },
        _adjustOffsetFromHelper: function (a) {
            if (typeof a == "string") a = a.split(" ");
            if (d.isArray(a)) a = {
                left: +a[0],
                top: +a[1] || 0
            };
            if ("left" in a) this.offset.click.left = a.left + this.margins.left;
            if ("right" in a) this.offset.click.left = this.helperProportions.width - a.right + this.margins.left;
            if ("top" in a) this.offset.click.top = a.top + this.margins.top;
            if ("bottom" in a) this.offset.click.top = this.helperProportions.height - a.bottom + this.margins.top
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var a = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                a.left += this.scrollParent.scrollLeft();
                a.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && d.browser.msie) a = {
                top: 0,
                left: 0
            };
            return {
                top: a.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: a.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if (this.cssPosition == "relative") {
                var a = this.element.position();
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            } else return {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function () {
            var a = this.options;
            if (a.containment == "parent") a.containment = this.helper[0].parentNode;
            if (a.containment == "document" || a.containment == "window") this.containment = [(a.containment == "document" ? 0 : d(window).scrollLeft()) - this.offset.relative.left - this.offset.parent.left, (a.containment == "document" ? 0 : d(window).scrollTop()) - this.offset.relative.top - this.offset.parent.top, (a.containment == "document" ? 0 : d(window).scrollLeft()) + d(a.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (a.containment == "document" ? 0 : d(window).scrollTop()) + (d(a.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(a.containment) && a.containment.constructor != Array) {
                var b = d(a.containment)[0];
                if (b) {
                    a = d(a.containment).offset();
                    var c = d(b).css("overflow") != "hidden";
                    this.containment = [a.left + (parseInt(d(b).css("borderLeftWidth"), 10) || 0) + (parseInt(d(b).css("paddingLeft"), 10) || 0), a.top + (parseInt(d(b).css("borderTopWidth"), 10) || 0) + (parseInt(d(b).css("paddingTop"), 10) || 0), a.left + (c ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt(d(b).css("borderLeftWidth"), 10) || 0) - (parseInt(d(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, a.top + (c ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt(d(b).css("borderTopWidth"), 10) || 0) - (parseInt(d(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom]
                }
            } else if (a.containment.constructor == Array) this.containment = a.containment
        },
        _convertPositionTo: function (a, b) {
            if (!b) b = this.position;
            a = a == "absolute" ? 1 : -1;
            var c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                f = /(html|body)/i.test(c[0].tagName);
            return {
                top: b.top + this.offset.relative.top * a + this.offset.parent.top * a - (d.browser.safari && d.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0 : c.scrollTop()) * a),
                left: b.left + this.offset.relative.left * a + this.offset.parent.left * a - (d.browser.safari && d.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : c.scrollLeft()) * a)
            }
        },
        _generatePosition: function (a) {
            var b = this.options,
                c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                f = /(html|body)/i.test(c[0].tagName),
                e = a.pageX,
                g = a.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (a.pageX - this.offset.click.left < this.containment[0]) e = this.containment[0] + this.offset.click.left;
                    if (a.pageY - this.offset.click.top < this.containment[1]) g = this.containment[1] + this.offset.click.top;
                    if (a.pageX - this.offset.click.left > this.containment[2]) e = this.containment[2] + this.offset.click.left;
                    if (a.pageY - this.offset.click.top > this.containment[3]) g = this.containment[3] + this.offset.click.top
                }
                if (b.grid) {
                    g = this.originalPageY + Math.round((g - this.originalPageY) / b.grid[1]) * b.grid[1];
                    g = this.containment ? !(g - this.offset.click.top < this.containment[1] || g - this.offset.click.top > this.containment[3]) ? g : !(g - this.offset.click.top < this.containment[1]) ? g - b.grid[1] : g + b.grid[1] : g;
                    e = this.originalPageX + Math.round((e - this.originalPageX) / b.grid[0]) * b.grid[0];
                    e = this.containment ? !(e - this.offset.click.left < this.containment[0] || e - this.offset.click.left > this.containment[2]) ? e : !(e - this.offset.click.left < this.containment[0]) ? e - b.grid[0] : e + b.grid[0] : e
                }
            }
            return {
                top: g - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (d.browser.safari && d.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0 : c.scrollTop()),
                left: e - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (d.browser.safari && d.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : c.scrollLeft())
            }
        },
        _clear: function () {
            this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = false
        },
        _trigger: function (a, b, c) {
            c = c || this._uiHash();
            d.ui.plugin.call(this, a, [b, c]);
            if (a == "drag") this.positionAbs = this._convertPositionTo("absolute");
            return d.Widget.prototype._trigger.call(this, a, b, c)
        },
        plugins: {},
        _uiHash: function () {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    });
    d.extend(d.ui.draggable, {
        version: "1.8.11"
    });
    d.ui.plugin.add("draggable", "connectToSortable", {
        start: function (a, b) {
            var c = d(this).data("draggable"),
                f = c.options,
                e = d.extend({}, b, {
                    item: c.element
                });
            c.sortables = [];
            d(f.connectToSortable).each(function () {
                var g = d.data(this, "sortable");
                if (g && !g.options.disabled) {
                    c.sortables.push({
                        instance: g,
                        shouldRevert: g.options.revert
                    });
                    g.refreshPositions();
                    g._trigger("activate", a, e)
                }
            })
        },
        stop: function (a, b) {
            var c = d(this).data("draggable"),
                f = d.extend({}, b, {
                    item: c.element
                });
            d.each(c.sortables, function () {
                if (this.instance.isOver) {
                    this.instance.isOver = 0;
                    c.cancelHelperRemoval = true;
                    this.instance.cancelHelperRemoval = false;
                    if (this.shouldRevert) this.instance.options.revert = true;
                    this.instance._mouseStop(a);
                    this.instance.options.helper = this.instance.options._helper;
                    c.options.helper == "original" && this.instance.currentItem.css({
                        top: "auto",
                        left: "auto"
                    })
                } else {
                    this.instance.cancelHelperRemoval = false;
                    this.instance._trigger("deactivate", a, f)
                }
            })
        },
        drag: function (a, b) {
            var c = d(this).data("draggable"),
                f = this;
            d.each(c.sortables, function () {
                this.instance.positionAbs = c.positionAbs;
                this.instance.helperProportions = c.helperProportions;
                this.instance.offset.click = c.offset.click;
                if (this.instance._intersectsWith(this.instance.containerCache)) {
                    if (!this.instance.isOver) {
                        this.instance.isOver = 1;
                        this.instance.currentItem = d(f).clone().appendTo(this.instance.element).data("sortable-item", true);
                        this.instance.options._helper = this.instance.options.helper;
                        this.instance.options.helper = function () {
                            return b.helper[0]
                        };
                        a.target = this.instance.currentItem[0];
                        this.instance._mouseCapture(a, true);
                        this.instance._mouseStart(a, true, true);
                        this.instance.offset.click.top = c.offset.click.top;
                        this.instance.offset.click.left = c.offset.click.left;
                        this.instance.offset.parent.left -= c.offset.parent.left - this.instance.offset.parent.left;
                        this.instance.offset.parent.top -= c.offset.parent.top - this.instance.offset.parent.top;
                        c._trigger("toSortable", a);
                        c.dropped = this.instance.element;
                        c.currentItem = c.element;
                        this.instance.fromOutside = c
                    }
                    this.instance.currentItem && this.instance._mouseDrag(a)
                } else if (this.instance.isOver) {
                    this.instance.isOver = 0;
                    this.instance.cancelHelperRemoval = true;
                    this.instance.options.revert = false;
                    this.instance._trigger("out", a, this.instance._uiHash(this.instance));
                    this.instance._mouseStop(a, true);
                    this.instance.options.helper = this.instance.options._helper;
                    this.instance.currentItem.remove();
                    this.instance.placeholder && this.instance.placeholder.remove();
                    c._trigger("fromSortable", a);
                    c.dropped = false
                }
            })
        }
    });
    d.ui.plugin.add("draggable", "cursor", {
        start: function () {
            var a = d("body"),
                b = d(this).data("draggable").options;
            if (a.css("cursor")) b._cursor = a.css("cursor");
            a.css("cursor", b.cursor)
        },
        stop: function () {
            var a = d(this).data("draggable").options;
            a._cursor && d("body").css("cursor", a._cursor)
        }
    });
    d.ui.plugin.add("draggable", "iframeFix", {
        start: function () {
            var a = d(this).data("draggable").options;
            d(a.iframeFix === true ? "iframe" : a.iframeFix).each(function () {
                d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1E3
                }).css(d(this).offset()).appendTo("body")
            })
        },
        stop: function () {
            d("div.ui-draggable-iframeFix").each(function () {
                this.parentNode.removeChild(this)
            })
        }
    });
    d.ui.plugin.add("draggable", "opacity", {
        start: function (a, b) {
            a = d(b.helper);
            b = d(this).data("draggable").options;
            if (a.css("opacity")) b._opacity = a.css("opacity");
            a.css("opacity", b.opacity)
        },
        stop: function (a, b) {
            a = d(this).data("draggable").options;
            a._opacity && d(b.helper).css("opacity", a._opacity)
        }
    });
    d.ui.plugin.add("draggable", "scroll", {
        start: function () {
            var a = d(this).data("draggable");
            if (a.scrollParent[0] != document && a.scrollParent[0].tagName != "HTML") a.overflowOffset = a.scrollParent.offset()
        },
        drag: function (a) {
            var b = d(this).data("draggable"),
                c = b.options,
                f = false;
            if (b.scrollParent[0] != document && b.scrollParent[0].tagName != "HTML") {
                if (!c.axis || c.axis != "x") if (b.overflowOffset.top + b.scrollParent[0].offsetHeight - a.pageY < c.scrollSensitivity) b.scrollParent[0].scrollTop = f = b.scrollParent[0].scrollTop + c.scrollSpeed;
                else if (a.pageY - b.overflowOffset.top < c.scrollSensitivity) b.scrollParent[0].scrollTop = f = b.scrollParent[0].scrollTop - c.scrollSpeed;
                if (!c.axis || c.axis != "y") if (b.overflowOffset.left + b.scrollParent[0].offsetWidth - a.pageX < c.scrollSensitivity) b.scrollParent[0].scrollLeft = f = b.scrollParent[0].scrollLeft + c.scrollSpeed;
                else if (a.pageX - b.overflowOffset.left < c.scrollSensitivity) b.scrollParent[0].scrollLeft = f = b.scrollParent[0].scrollLeft - c.scrollSpeed
            } else {
                if (!c.axis || c.axis != "x") if (a.pageY - d(document).scrollTop() < c.scrollSensitivity) f = d(document).scrollTop(d(document).scrollTop() - c.scrollSpeed);
                else if (d(window).height() - (a.pageY - d(document).scrollTop()) < c.scrollSensitivity) f = d(document).scrollTop(d(document).scrollTop() + c.scrollSpeed);
                if (!c.axis || c.axis != "y") if (a.pageX - d(document).scrollLeft() < c.scrollSensitivity) f = d(document).scrollLeft(d(document).scrollLeft() - c.scrollSpeed);
                else if (d(window).width() - (a.pageX - d(document).scrollLeft()) < c.scrollSensitivity) f = d(document).scrollLeft(d(document).scrollLeft() + c.scrollSpeed)
            }
            f !== false && d.ui.ddmanager && !c.dropBehaviour && d.ui.ddmanager.prepareOffsets(b, a)
        }
    });
    d.ui.plugin.add("draggable", "snap", {
        start: function () {
            var a = d(this).data("draggable"),
                b = a.options;
            a.snapElements = [];
            d(b.snap.constructor != String ? b.snap.items || ":data(draggable)" : b.snap).each(function () {
                var c = d(this),
                    f = c.offset();
                this != a.element[0] && a.snapElements.push({
                    item: this,
                    width: c.outerWidth(),
                    height: c.outerHeight(),
                    top: f.top,
                    left: f.left
                })
            })
        },
        drag: function (a, b) {
            for (var c = d(this).data("draggable"), f = c.options, e = f.snapTolerance, g = b.offset.left, n = g + c.helperProportions.width, m = b.offset.top, o = m + c.helperProportions.height, h = c.snapElements.length - 1; h >= 0; h--) {
                var i = c.snapElements[h].left,
                    k = i + c.snapElements[h].width,
                    j = c.snapElements[h].top,
                    l = j + c.snapElements[h].height;
                if (i - e < g && g < k + e && j - e < m && m < l + e || i - e < g && g < k + e && j - e < o && o < l + e || i - e < n && n < k + e && j - e < m && m < l + e || i - e < n && n < k + e && j - e < o && o < l + e) {
                    if (f.snapMode != "inner") {
                        var p = Math.abs(j - o) <= e,
                            q = Math.abs(l - m) <= e,
                            r = Math.abs(i - n) <= e,
                            s = Math.abs(k - g) <= e;
                        if (p) b.position.top = c._convertPositionTo("relative", {
                            top: j - c.helperProportions.height,
                            left: 0
                        }).top - c.margins.top;
                        if (q) b.position.top = c._convertPositionTo("relative", {
                            top: l,
                            left: 0
                        }).top - c.margins.top;
                        if (r) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: i - c.helperProportions.width
                        }).left - c.margins.left;
                        if (s) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: k
                        }).left - c.margins.left
                    }
                    var t = p || q || r || s;
                    if (f.snapMode != "outer") {
                        p = Math.abs(j - m) <= e;
                        q = Math.abs(l - o) <= e;
                        r = Math.abs(i - g) <= e;
                        s = Math.abs(k - n) <= e;
                        if (p) b.position.top = c._convertPositionTo("relative", {
                            top: j,
                            left: 0
                        }).top - c.margins.top;
                        if (q) b.position.top = c._convertPositionTo("relative", {
                            top: l - c.helperProportions.height,
                            left: 0
                        }).top - c.margins.top;
                        if (r) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: i
                        }).left - c.margins.left;
                        if (s) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: k - c.helperProportions.width
                        }).left - c.margins.left
                    }
                    if (!c.snapElements[h].snapping && (p || q || r || s || t)) c.options.snap.snap && c.options.snap.snap.call(c.element, a, d.extend(c._uiHash(), {
                        snapItem: c.snapElements[h].item
                    }));
                    c.snapElements[h].snapping = p || q || r || s || t
                } else {
                    c.snapElements[h].snapping && c.options.snap.release && c.options.snap.release.call(c.element, a, d.extend(c._uiHash(), {
                        snapItem: c.snapElements[h].item
                    }));
                    c.snapElements[h].snapping = false
                }
            }
        }
    });
    d.ui.plugin.add("draggable", "stack", {
        start: function () {
            var a = d(this).data("draggable").options;
            a = d.makeArray(d(a.stack)).sort(function (c, f) {
                return (parseInt(d(c).css("zIndex"), 10) || 0) - (parseInt(d(f).css("zIndex"), 10) || 0)
            });
            if (a.length) {
                var b = parseInt(a[0].style.zIndex) || 0;
                d(a).each(function (c) {
                    this.style.zIndex = b + c
                });
                this[0].style.zIndex = b + a.length
            }
        }
    });
    d.ui.plugin.add("draggable", "zIndex", {
        start: function (a, b) {
            a = d(b.helper);
            b = d(this).data("draggable").options;
            if (a.css("zIndex")) b._zIndex = a.css("zIndex");
            a.css("zIndex", b.zIndex)
        },
        stop: function (a, b) {
            a = d(this).data("draggable").options;
            a._zIndex && d(b.helper).css("zIndex", a._zIndex)
        }
    })
})(jQuery);;
(function (d) {
    d.widget("ui.droppable", {
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: false,
            addClasses: true,
            greedy: false,
            hoverClass: false,
            scope: "default",
            tolerance: "intersect"
        },
        _create: function () {
            var a = this.options,
                b = a.accept;
            this.isover = 0;
            this.isout = 1;
            this.accept = d.isFunction(b) ? b : function (c) {
                return c.is(b)
            };
            this.proportions = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight
            };
            d.ui.ddmanager.droppables[a.scope] = d.ui.ddmanager.droppables[a.scope] || [];
            d.ui.ddmanager.droppables[a.scope].push(this);
            a.addClasses && this.element.addClass("ui-droppable")
        },
        destroy: function () {
            for (var a = d.ui.ddmanager.droppables[this.options.scope], b = 0; b < a.length; b++) a[b] == this && a.splice(b, 1);
            this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");
            return this
        },
        _setOption: function (a, b) {
            if (a == "accept") this.accept = d.isFunction(b) ? b : function (c) {
                return c.is(b)
            };
            d.Widget.prototype._setOption.apply(this, arguments)
        },
        _activate: function (a) {
            var b = d.ui.ddmanager.current;
            this.options.activeClass && this.element.addClass(this.options.activeClass);
            b && this._trigger("activate", a, this.ui(b))
        },
        _deactivate: function (a) {
            var b = d.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            b && this._trigger("deactivate", a, this.ui(b))
        },
        _over: function (a) {
            var b = d.ui.ddmanager.current;
            if (!(!b || (b.currentItem || b.element)[0] == this.element[0])) if (this.accept.call(this.element[0], b.currentItem || b.element)) {
                this.options.hoverClass && this.element.addClass(this.options.hoverClass);
                this._trigger("over", a, this.ui(b))
            }
        },
        _out: function (a) {
            var b = d.ui.ddmanager.current;
            if (!(!b || (b.currentItem || b.element)[0] == this.element[0])) if (this.accept.call(this.element[0], b.currentItem || b.element)) {
                this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
                this._trigger("out", a, this.ui(b))
            }
        },
        _drop: function (a, b) {
            var c = b || d.ui.ddmanager.current;
            if (!c || (c.currentItem || c.element)[0] == this.element[0]) return false;
            var e = false;
            this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function () {
                var g = d.data(this, "droppable");
                if (g.options.greedy && !g.options.disabled && g.options.scope == c.options.scope && g.accept.call(g.element[0], c.currentItem || c.element) && d.ui.intersect(c, d.extend(g, {
                    offset: g.element.offset()
                }), g.options.tolerance)) {
                    e = true;
                    return false
                }
            });
            if (e) return false;
            if (this.accept.call(this.element[0], c.currentItem || c.element)) {
                this.options.activeClass && this.element.removeClass(this.options.activeClass);
                this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
                this._trigger("drop", a, this.ui(c));
                return this.element
            }
            return false
        },
        ui: function (a) {
            return {
                draggable: a.currentItem || a.element,
                helper: a.helper,
                position: a.position,
                offset: a.positionAbs
            }
        }
    });
    d.extend(d.ui.droppable, {
        version: "1.8.11"
    });
    d.ui.intersect = function (a, b, c) {
        if (!b.offset) return false;
        var e = (a.positionAbs || a.position.absolute).left,
            g = e + a.helperProportions.width,
            f = (a.positionAbs || a.position.absolute).top,
            h = f + a.helperProportions.height,
            i = b.offset.left,
            k = i + b.proportions.width,
            j = b.offset.top,
            l = j + b.proportions.height;
        switch (c) {
        case "fit":
            return i <= e && g <= k && j <= f && h <= l;
        case "intersect":
            return i < e + a.helperProportions.width / 2 && g - a.helperProportions.width / 2 < k && j < f + a.helperProportions.height / 2 && h - a.helperProportions.height / 2 < l;
        case "pointer":
            return d.ui.isOver((a.positionAbs || a.position.absolute).top + (a.clickOffset || a.offset.click).top, (a.positionAbs || a.position.absolute).left + (a.clickOffset || a.offset.click).left, j, i, b.proportions.height, b.proportions.width);
        case "touch":
            return (f >= j && f <= l || h >= j && h <= l || f < j && h > l) && (e >= i && e <= k || g >= i && g <= k || e < i && g > k);
        default:
            return false
        }
    };
    d.ui.ddmanager = {
        current: null,
        droppables: {
            "default": []
        },
        prepareOffsets: function (a, b) {
            var c = d.ui.ddmanager.droppables[a.options.scope] || [],
                e = b ? b.type : null,
                g = (a.currentItem || a.element).find(":data(droppable)").andSelf(),
                f = 0;
            a: for (; f < c.length; f++) if (!(c[f].options.disabled || a && !c[f].accept.call(c[f].element[0], a.currentItem || a.element))) {
                for (var h = 0; h < g.length; h++) if (g[h] == c[f].element[0]) {
                    c[f].proportions.height = 0;
                    continue a
                }
                c[f].visible = c[f].element.css("display") != "none";
                if (c[f].visible) {
                    e == "mousedown" && c[f]._activate.call(c[f], b);
                    c[f].offset = c[f].element.offset();
                    c[f].proportions = {
                        width: c[f].element[0].offsetWidth,
                        height: c[f].element[0].offsetHeight
                    }
                }
            }
        },
        drop: function (a, b) {
            var c = false;
            d.each(d.ui.ddmanager.droppables[a.options.scope] || [], function () {
                if (this.options) {
                    if (!this.options.disabled && this.visible && d.ui.intersect(a, this, this.options.tolerance)) c = c || this._drop.call(this, b);
                    if (!this.options.disabled && this.visible && this.accept.call(this.element[0], a.currentItem || a.element)) {
                        this.isout = 1;
                        this.isover = 0;
                        this._deactivate.call(this, b)
                    }
                }
            });
            return c
        },
        drag: function (a, b) {
            a.options.refreshPositions && d.ui.ddmanager.prepareOffsets(a, b);
            d.each(d.ui.ddmanager.droppables[a.options.scope] || [], function () {
                if (!(this.options.disabled || this.greedyChild || !this.visible)) {
                    var c = d.ui.intersect(a, this, this.options.tolerance);
                    if (c = !c && this.isover == 1 ? "isout" : c && this.isover == 0 ? "isover" : null) {
                        var e;
                        if (this.options.greedy) {
                            var g = this.element.parents(":data(droppable):eq(0)");
                            if (g.length) {
                                e = d.data(g[0], "droppable");
                                e.greedyChild = c == "isover" ? 1 : 0
                            }
                        }
                        if (e && c == "isover") {
                            e.isover = 0;
                            e.isout = 1;
                            e._out.call(e, b)
                        }
                        this[c] = 1;
                        this[c == "isout" ? "isover" : "isout"] = 0;
                        this[c == "isover" ? "_over" : "_out"].call(this, b);
                        if (e && c == "isout") {
                            e.isout = 0;
                            e.isover = 1;
                            e._over.call(e, b)
                        }
                    }
                }
            })
        }
    }
})(jQuery);;
jQuery.effects || function (f, j) {
    function n(c) {
        var a;
        if (c && c.constructor == Array && c.length == 3) return c;
        if (a = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c)) return [parseInt(a[1], 10), parseInt(a[2], 10), parseInt(a[3], 10)];
        if (a = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c)) return [parseFloat(a[1]) * 2.55, parseFloat(a[2]) * 2.55, parseFloat(a[3]) * 2.55];
        if (a = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c)) return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)];
        if (a = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c)) return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)];
        if (/rgba\(0, 0, 0, 0\)/.exec(c)) return o.transparent;
        return o[f.trim(c).toLowerCase()]
    }
    function s(c, a) {
        var b;
        do {
            b = f.curCSS(c, a);
            if (b != "" && b != "transparent" || f.nodeName(c, "body")) break;
            a = "backgroundColor"
        } while (c = c.parentNode);
        return n(b)
    }
    function p() {
        var c = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle,
            a = {}, b, d;
        if (c && c.length && c[0] && c[c[0]]) for (var e = c.length; e--;) {
            b = c[e];
            if (typeof c[b] == "string") {
                d = b.replace(/\-(\w)/g, function (g, h) {
                    return h.toUpperCase()
                });
                a[d] = c[b]
            }
        } else for (b in c) if (typeof c[b] === "string") a[b] = c[b];
        return a
    }
    function q(c) {
        var a, b;
        for (a in c) {
            b = c[a];
            if (b == null || f.isFunction(b) || a in t || /scrollbar/.test(a) || !/color/i.test(a) && isNaN(parseFloat(b))) delete c[a]
        }
        return c
    }
    function u(c, a) {
        var b = {
            _: 0
        }, d;
        for (d in a) if (c[d] != a[d]) b[d] = a[d];
        return b
    }
    function k(c, a, b, d) {
        if (typeof c == "object") {
            d = a;
            b = null;
            a = c;
            c = a.effect
        }
        if (f.isFunction(a)) {
            d = a;
            b = null;
            a = {}
        }
        if (typeof a == "number" || f.fx.speeds[a]) {
            d = b;
            b = a;
            a = {}
        }
        if (f.isFunction(b)) {
            d = b;
            b = null
        }
        a = a || {};
        b = b || a.duration;
        b = f.fx.off ? 0 : typeof b == "number" ? b : b in f.fx.speeds ? f.fx.speeds[b] : f.fx.speeds._default;
        d = d || a.complete;
        return [c, a, b, d]
    }
    function m(c) {
        if (!c || typeof c === "number" || f.fx.speeds[c]) return true;
        if (typeof c === "string" && !f.effects[c]) return true;
        return false
    }
    f.effects = {};
    f.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderColor", "color", "outlineColor"], function (c, a) {
        f.fx.step[a] = function (b) {
            if (!b.colorInit) {
                b.start = s(b.elem, a);
                b.end = n(b.end);
                b.colorInit = true
            }
            b.elem.style[a] = "rgb(" + Math.max(Math.min(parseInt(b.pos * (b.end[0] - b.start[0]) + b.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(b.pos * (b.end[1] - b.start[1]) + b.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(b.pos * (b.end[2] - b.start[2]) + b.start[2], 10), 255), 0) + ")"
        }
    });
    var o = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0],
        transparent: [255, 255, 255]
    }, r = ["add", "remove", "toggle"],
        t = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
    f.effects.animateClass = function (c, a, b, d) {
        if (f.isFunction(b)) {
            d = b;
            b = null
        }
        return this.queue("fx", function () {
            var e = f(this),
                g = e.attr("style") || " ",
                h = q(p.call(this)),
                l, v = e.attr("className");
            f.each(r, function (w, i) {
                c[i] && e[i + "Class"](c[i])
            });
            l = q(p.call(this));
            e.attr("className", v);
            e.animate(u(h, l), a, b, function () {
                f.each(r, function (w, i) {
                    c[i] && e[i + "Class"](c[i])
                });
                if (typeof e.attr("style") == "object") {
                    e.attr("style").cssText = "";
                    e.attr("style").cssText = g
                } else e.attr("style", g);
                d && d.apply(this, arguments)
            });
            h = f.queue(this);
            l = h.splice(h.length - 1, 1)[0];
            h.splice(1, 0, l);
            f.dequeue(this)
        })
    };
    f.fn.extend({
        _addClass: f.fn.addClass,
        addClass: function (c, a, b, d) {
            return a ? f.effects.animateClass.apply(this, [{
                add: c
            },
            a, b, d]) : this._addClass(c)
        },
        _removeClass: f.fn.removeClass,
        removeClass: function (c, a, b, d) {
            return a ? f.effects.animateClass.apply(this, [{
                remove: c
            },
            a, b, d]) : this._removeClass(c)
        },
        _toggleClass: f.fn.toggleClass,
        toggleClass: function (c, a, b, d, e) {
            return typeof a == "boolean" || a === j ? b ? f.effects.animateClass.apply(this, [a ? {
                add: c
            } : {
                remove: c
            },
            b, d, e]) : this._toggleClass(c, a) : f.effects.animateClass.apply(this, [{
                toggle: c
            },
            a, b, d])
        },
        switchClass: function (c, a, b, d, e) {
            return f.effects.animateClass.apply(this, [{
                add: a,
                remove: c
            },
            b, d, e])
        }
    });
    f.extend(f.effects, {
        version: "1.8.11",
        save: function (c, a) {
            for (var b = 0; b < a.length; b++) a[b] !== null && c.data("ec.storage." + a[b], c[0].style[a[b]])
        },
        restore: function (c, a) {
            for (var b = 0; b < a.length; b++) a[b] !== null && c.css(a[b], c.data("ec.storage." + a[b]))
        },
        setMode: function (c, a) {
            if (a == "toggle") a = c.is(":hidden") ? "show" : "hide";
            return a
        },
        getBaseline: function (c, a) {
            var b;
            switch (c[0]) {
            case "top":
                b = 0;
                break;
            case "middle":
                b = 0.5;
                break;
            case "bottom":
                b = 1;
                break;
            default:
                b = c[0] / a.height
            }
            switch (c[1]) {
            case "left":
                c = 0;
                break;
            case "center":
                c = 0.5;
                break;
            case "right":
                c = 1;
                break;
            default:
                c = c[1] / a.width
            }
            return {
                x: c,
                y: b
            }
        },
        createWrapper: function (c) {
            if (c.parent().is(".ui-effects-wrapper")) return c.parent();
            var a = {
                width: c.outerWidth(true),
                height: c.outerHeight(true),
                "float": c.css("float")
            }, b = f("<div></div>").addClass("ui-effects-wrapper").css({
                fontSize: "100%",
                background: "transparent",
                border: "none",
                margin: 0,
                padding: 0
            });
            c.wrap(b);
            b = c.parent();
            if (c.css("position") == "static") {
                b.css({
                    position: "relative"
                });
                c.css({
                    position: "relative"
                })
            } else {
                f.extend(a, {
                    position: c.css("position"),
                    zIndex: c.css("z-index")
                });
                f.each(["top", "left", "bottom", "right"], function (d, e) {
                    a[e] = c.css(e);
                    if (isNaN(parseInt(a[e], 10))) a[e] = "auto"
                });
                c.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })
            }
            return b.css(a).show()
        },
        removeWrapper: function (c) {
            if (c.parent().is(".ui-effects-wrapper")) return c.parent().replaceWith(c);
            return c
        },
        setTransition: function (c, a, b, d) {
            d = d || {};
            f.each(a, function (e, g) {
                unit = c.cssUnit(g);
                if (unit[0] > 0) d[g] = unit[0] * b + unit[1]
            });
            return d
        }
    });
    f.fn.extend({
        effect: function (c) {
            var a = k.apply(this, arguments),
                b = {
                    options: a[1],
                    duration: a[2],
                    callback: a[3]
                };
            a = b.options.mode;
            var d = f.effects[c];
            if (f.fx.off || !d) return a ? this[a](b.duration, b.callback) : this.each(function () {
                b.callback && b.callback.call(this)
            });
            return d.call(this, b)
        },
        _show: f.fn.show,
        show: function (c) {
            if (m(c)) return this._show.apply(this, arguments);
            else {
                var a = k.apply(this, arguments);
                a[1].mode = "show";
                return this.effect.apply(this, a)
            }
        },
        _hide: f.fn.hide,
        hide: function (c) {
            if (m(c)) return this._hide.apply(this, arguments);
            else {
                var a = k.apply(this, arguments);
                a[1].mode = "hide";
                return this.effect.apply(this, a)
            }
        },
        __toggle: f.fn.toggle,
        toggle: function (c) {
            if (m(c) || typeof c === "boolean" || f.isFunction(c)) return this.__toggle.apply(this, arguments);
            else {
                var a = k.apply(this, arguments);
                a[1].mode = "toggle";
                return this.effect.apply(this, a)
            }
        },
        cssUnit: function (c) {
            var a = this.css(c),
                b = [];
            f.each(["em", "px", "%", "pt"], function (d, e) {
                if (a.indexOf(e) > 0) b = [parseFloat(a), e]
            });
            return b
        }
    });
    f.easing.jswing = f.easing.swing;
    f.extend(f.easing, {
        def: "easeOutQuad",
        swing: function (c, a, b, d, e) {
            return f.easing[f.easing.def](c, a, b, d, e)
        },
        easeInQuad: function (c, a, b, d, e) {
            return d * (a /= e) * a + b
        },
        easeOutQuad: function (c, a, b, d, e) {
            return -d * (a /= e) * (a - 2) + b
        },
        easeInOutQuad: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return d / 2 * a * a + b;
            return -d / 2 * (--a * (a - 2) - 1) + b
        },
        easeInCubic: function (c, a, b, d, e) {
            return d * (a /= e) * a * a + b
        },
        easeOutCubic: function (c, a, b, d, e) {
            return d * ((a = a / e - 1) * a * a + 1) + b
        },
        easeInOutCubic: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return d / 2 * a * a * a + b;
            return d / 2 * ((a -= 2) * a * a + 2) + b
        },
        easeInQuart: function (c, a, b, d, e) {
            return d * (a /= e) * a * a * a + b
        },
        easeOutQuart: function (c, a, b, d, e) {
            return -d * ((a = a / e - 1) * a * a * a - 1) + b
        },
        easeInOutQuart: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return d / 2 * a * a * a * a + b;
            return -d / 2 * ((a -= 2) * a * a * a - 2) + b
        },
        easeInQuint: function (c, a, b, d, e) {
            return d * (a /= e) * a * a * a * a + b
        },
        easeOutQuint: function (c, a, b, d, e) {
            return d * ((a = a / e - 1) * a * a * a * a + 1) + b
        },
        easeInOutQuint: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return d / 2 * a * a * a * a * a + b;
            return d / 2 * ((a -= 2) * a * a * a * a + 2) + b
        },
        easeInSine: function (c, a, b, d, e) {
            return -d * Math.cos(a / e * (Math.PI / 2)) + d + b
        },
        easeOutSine: function (c, a, b, d, e) {
            return d * Math.sin(a / e * (Math.PI / 2)) + b
        },
        easeInOutSine: function (c, a, b, d, e) {
            return -d / 2 * (Math.cos(Math.PI * a / e) - 1) + b
        },
        easeInExpo: function (c, a, b, d, e) {
            return a == 0 ? b : d * Math.pow(2, 10 * (a / e - 1)) + b
        },
        easeOutExpo: function (c, a, b, d, e) {
            return a == e ? b + d : d * (-Math.pow(2, - 10 * a / e) + 1) + b
        },
        easeInOutExpo: function (c, a, b, d, e) {
            if (a == 0) return b;
            if (a == e) return b + d;
            if ((a /= e / 2) < 1) return d / 2 * Math.pow(2, 10 * (a - 1)) + b;
            return d / 2 * (-Math.pow(2, - 10 * --a) + 2) + b
        },
        easeInCirc: function (c, a, b, d, e) {
            return -d * (Math.sqrt(1 - (a /= e) * a) - 1) + b
        },
        easeOutCirc: function (c, a, b, d, e) {
            return d * Math.sqrt(1 - (a = a / e - 1) * a) + b
        },
        easeInOutCirc: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return -d / 2 * (Math.sqrt(1 - a * a) - 1) + b;
            return d / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
        },
        easeInElastic: function (c, a, b, d, e) {
            c = 1.70158;
            var g = 0,
                h = d;
            if (a == 0) return b;
            if ((a /= e) == 1) return b + d;
            g || (g = e * 0.3);
            if (h < Math.abs(d)) {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
            return -(h * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g)) + b
        },
        easeOutElastic: function (c, a, b, d, e) {
            c = 1.70158;
            var g = 0,
                h = d;
            if (a == 0) return b;
            if ((a /= e) == 1) return b + d;
            g || (g = e * 0.3);
            if (h < Math.abs(d)) {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
            return h * Math.pow(2, - 10 * a) * Math.sin((a * e - c) * 2 * Math.PI / g) + d + b
        },
        easeInOutElastic: function (c, a, b, d, e) {
            c = 1.70158;
            var g = 0,
                h = d;
            if (a == 0) return b;
            if ((a /= e / 2) == 2) return b + d;
            g || (g = e * 0.3 * 1.5);
            if (h < Math.abs(d)) {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
            if (a < 1) return -0.5 * h * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g) + b;
            return h * Math.pow(2, - 10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g) * 0.5 + d + b
        },
        easeInBack: function (c, a, b, d, e, g) {
            if (g == j) g = 1.70158;
            return d * (a /= e) * a * ((g + 1) * a - g) + b
        },
        easeOutBack: function (c, a, b, d, e, g) {
            if (g == j) g = 1.70158;
            return d * ((a = a / e - 1) * a * ((g + 1) * a + g) + 1) + b
        },
        easeInOutBack: function (c, a, b, d, e, g) {
            if (g == j) g = 1.70158;
            if ((a /= e / 2) < 1) return d / 2 * a * a * (((g *= 1.525) + 1) * a - g) + b;
            return d / 2 * ((a -= 2) * a * (((g *= 1.525) + 1) * a + g) + 2) + b
        },
        easeInBounce: function (c, a, b, d, e) {
            return d - f.easing.easeOutBounce(c, e - a, 0, d, e) + b
        },
        easeOutBounce: function (c, a, b, d, e) {
            return (a /= e) < 1 / 2.75 ? d * 7.5625 * a * a + b : a < 2 / 2.75 ? d * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + b : a < 2.5 / 2.75 ? d * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + b : d * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + b
        },
        easeInOutBounce: function (c, a, b, d, e) {
            if (a < e / 2) return f.easing.easeInBounce(c, a * 2, 0, d, e) * 0.5 + b;
            return f.easing.easeOutBounce(c, a * 2 - e, 0, d, e) * 0.5 + d * 0.5 + b
        }
    })
}(jQuery);;
(function (b) {
    b.effects.highlight = function (c) {
        return this.queue(function () {
            var a = b(this),
                e = ["backgroundImage", "backgroundColor", "opacity"],
                d = b.effects.setMode(a, c.options.mode || "show"),
                f = {
                    backgroundColor: a.css("backgroundColor")
                };
            if (d == "hide") f.opacity = 0;
            b.effects.save(a, e);
            a.show().css({
                backgroundImage: "none",
                backgroundColor: c.options.color || "#ffff99"
            }).animate(f, {
                queue: false,
                duration: c.duration,
                easing: c.options.easing,
                complete: function () {
                    d == "hide" && a.hide();
                    b.effects.restore(a, e);
                    d == "show" && !b.support.opacity && this.style.removeAttribute("filter");
                    c.callback && c.callback.apply(this, arguments);
                    a.dequeue()
                }
            })
        })
    }
})(jQuery);;
(function (d) {
    d.effects.pulsate = function (a) {
        return this.queue(function () {
            var b = d(this),
                c = d.effects.setMode(b, a.options.mode || "show");
            times = (a.options.times || 5) * 2 - 1;
            duration = a.duration ? a.duration / 2 : d.fx.speeds._default / 2;
            isVisible = b.is(":visible");
            animateTo = 0;
            if (!isVisible) {
                b.css("opacity", 0).show();
                animateTo = 1
            }
            if (c == "hide" && isVisible || c == "show" && !isVisible) times--;
            for (c = 0; c < times; c++) {
                b.animate({
                    opacity: animateTo
                }, duration, a.options.easing);
                animateTo = (animateTo + 1) % 2
            }
            b.animate({
                opacity: animateTo
            }, duration, a.options.easing, function () {
                animateTo == 0 && b.hide();
                a.callback && a.callback.apply(this, arguments)
            });
            b.queue("fx", function () {
                b.dequeue()
            }).dequeue()
        })
    }
})(jQuery);;;
(function ($) {
    $.fn.ajaxSubmit = function (options) {
        if (!this.length) {
            log('ajaxSubmit: skipping submit process - no element selected');
            return this;
        }
        if (typeof options == 'function') {
            options = {
                success: options
            };
        }
        var action = this.attr('action');
        var url = (typeof action === 'string') ? $.trim(action) : '';
        if (url) {
            url = (url.match(/^([^#]+)/) || [])[1];
        }
        url = url || window.location.href || '';
        options = $.extend(true, {
            url: url,
            type: this[0].getAttribute('method') || 'GET',
            iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
        }, options);
        var veto = {};
        this.trigger('form-pre-serialize', [this, options, veto]);
        if (veto.veto) {
            log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
            return this;
        }
        if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
            log('ajaxSubmit: submit aborted via beforeSerialize callback');
            return this;
        }
        var n, v, a = this.formToArray(options.semantic);
        if (options.data) {
            options.extraData = options.data;
            for (n in options.data) {
                if (options.data[n] instanceof Array) {
                    for (var k in options.data[n]) {
                        a.push({
                            name: n,
                            value: options.data[n][k]
                        });
                    }
                } else {
                    v = options.data[n];
                    v = $.isFunction(v) ? v() : v;
                    a.push({
                        name: n,
                        value: v
                    });
                }
            }
        }
        if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
            log('ajaxSubmit: submit aborted via beforeSubmit callback');
            return this;
        }
        this.trigger('form-submit-validate', [a, this, options, veto]);
        if (veto.veto) {
            log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
            return this;
        }
        var q = $.param(a);
        if (options.type.toUpperCase() == 'GET') {
            options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
            options.data = null;
        } else {
            options.data = q;
        }
        var $form = this,
            callbacks = [];
        if (options.resetForm) {
            callbacks.push(function () {
                $form.resetForm();
            });
        }
        if (options.clearForm) {
            callbacks.push(function () {
                $form.clearForm();
            });
        }
        if (!options.dataType && options.target) {
            var oldSuccess = options.success || function () {};
            callbacks.push(function (data) {
                var fn = options.replaceTarget ? 'replaceWith' : 'html';
                $(options.target)[fn](data).each(oldSuccess, arguments);
            });
        } else if (options.success) {
            callbacks.push(options.success);
        }
        options.success = function (data, status, xhr) {
            var context = options.context || options;
            for (var i = 0, max = callbacks.length; i < max; i++) {
                callbacks[i].apply(context, [data, status, xhr || $form, $form]);
            }
        };
        var fileInputs = $('input:file', this).length > 0;
        var mp = 'multipart/form-data';
        var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);
        if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
            if (options.closeKeepAlive) {
                $.get(options.closeKeepAlive, fileUpload);
            } else {
                fileUpload();
            }
        } else {
            $.ajax(options);
        }
        this.trigger('form-submit-notify', [this, options]);
        return this;

        function fileUpload() {
            var form = $form[0];
            if ($(':input[name=submit],:input[id=submit]', form).length) {
                alert('Error: Form elements must not have name or id of "submit".');
                return;
            }
            var s = $.extend(true, {}, $.ajaxSettings, options);
            s.context = s.context || s;
            var id = 'jqFormIO' + (new Date().getTime()),
                fn = '_' + id;
            var $io = $('<iframe id="' + id + '" name="' + id + '" src="' + s.iframeSrc + '" />');
            var io = $io[0];
            $io.css({
                position: 'absolute',
                top: '-1000px',
                left: '-1000px'
            });
            var xhr = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: 'n/a',
                getAllResponseHeaders: function () {},
                getResponseHeader: function () {},
                setRequestHeader: function () {},
                abort: function () {
                    this.aborted = 1;
                    $io.attr('src', s.iframeSrc);
                }
            };
            var g = s.global;
            if (g && !$.active++) {
                $.event.trigger("ajaxStart");
            }
            if (g) {
                $.event.trigger("ajaxSend", [xhr, s]);
            }
            if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
                if (s.global) {
                    $.active--;
                }
                return;
            }
            if (xhr.aborted) {
                return;
            }
            var timedOut = 0;
            var sub = form.clk;
            if (sub) {
                var n = sub.name;
                if (n && !sub.disabled) {
                    s.extraData = s.extraData || {};
                    s.extraData[n] = sub.value;
                    if (sub.type == "image") {
                        s.extraData[n + '.x'] = form.clk_x;
                        s.extraData[n + '.y'] = form.clk_y;
                    }
                }
            }

            function doSubmit() {
                var t = $form.attr('target'),
                    a = $form.attr('action');
                form.setAttribute('target', id);
                if (form.getAttribute('method') != 'POST') {
                    form.setAttribute('method', 'POST');
                }
                if (form.getAttribute('action') != s.url) {
                    form.setAttribute('action', s.url);
                }
                if (!s.skipEncodingOverride) {
                    $form.attr({
                        encoding: 'multipart/form-data',
                        enctype: 'multipart/form-data'
                    });
                }
                if (s.timeout) {
                    setTimeout(function () {
                        timedOut = true;
                        cb();
                    }, s.timeout);
                }
                var extraInputs = [];
                try {
                    if (s.extraData) {
                        for (var n in s.extraData) {
                            extraInputs.push($('<input type="hidden" name="' + n + '" value="' + s.extraData[n] + '" />').appendTo(form)[0]);
                        }
                    }
                    $io.appendTo('body');
                    io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
                    form.submit();
                } finally {
                    form.setAttribute('action', a);
                    if (t) {
                        form.setAttribute('target', t);
                    } else {
                        $form.removeAttr('target');
                    }
                    $(extraInputs).remove();
                }
            }
            if (s.forceSync) {
                doSubmit();
            } else {
                setTimeout(doSubmit, 10);
            }
            var data, doc, domCheckCount = 50;

            function cb() {
                doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
                if (!doc || doc.location.href == s.iframeSrc) {
                    return;
                }
                io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);
                var ok = true;
                try {
                    if (timedOut) {
                        throw 'timeout';
                    }
                    var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                    log('isXml=' + isXml);
                    if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
                        if (--domCheckCount) {
                            log('requeing onLoad callback, DOM not available');
                            setTimeout(cb, 250);
                            return;
                        }
                    }
                    xhr.responseText = doc.body ? doc.body.innerHTML : doc.documentElement ? doc.documentElement.innerHTML : null;
                    xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                    xhr.getResponseHeader = function (header) {
                        var headers = {
                            'content-type': s.dataType
                        };
                        return headers[header];
                    };
                    var scr = /(json|script)/.test(s.dataType);
                    if (scr || s.textarea) {
                        var ta = doc.getElementsByTagName('textarea')[0];
                        if (ta) {
                            xhr.responseText = ta.value;
                        } else if (scr) {
                            var pre = doc.getElementsByTagName('pre')[0];
                            var b = doc.getElementsByTagName('body')[0];
                            if (pre) {
                                xhr.responseText = pre.textContent;
                            } else if (b) {
                                xhr.responseText = b.innerHTML;
                            }
                        }
                    } else if (s.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
                        xhr.responseXML = toXml(xhr.responseText);
                    }
                    data = httpData(xhr, s.dataType, s);
                } catch (e) {
                    log('error caught:', e);
                    ok = false;
                    xhr.error = e;
                    s.error.call(s.context, xhr, 'error', e);
                    g && $.event.trigger("ajaxError", [xhr, s, e]);
                }
                if (xhr.aborted) {
                    log('upload aborted');
                    ok = false;
                }
                if (ok) {
                    s.success.call(s.context, data, 'success', xhr);
                    g && $.event.trigger("ajaxSuccess", [xhr, s]);
                }
                g && $.event.trigger("ajaxComplete", [xhr, s]);
                if (g && !--$.active) {
                    $.event.trigger("ajaxStop");
                }
                s.complete && s.complete.call(s.context, xhr, ok ? 'success' : 'error');
                setTimeout(function () {
                    $io.removeData('form-plugin-onload');
                    $io.remove();
                    xhr.responseXML = null;
                }, 100);
            }
            var toXml = $.parseXML || function (s, doc) {
                    if (window.ActiveXObject) {
                        doc = new ActiveXObject('Microsoft.XMLDOM');
                        doc.async = 'false';
                        doc.loadXML(s);
                    } else {
                        doc = (new DOMParser()).parseFromString(s, 'text/xml');
                    }
                    return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
                };
            var parseJSON = $.parseJSON || function (s) {
                    return window['eval']('(' + s + ')');
                };
            var httpData = function (xhr, type, s) {
                var ct = xhr.getResponseHeader('content-type') || '',
                    xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                    data = xml ? xhr.responseXML : xhr.responseText;
                if (xml && data.documentElement.nodeName === 'parsererror') {
                    $.error && $.error('parsererror');
                }
                if (s && s.dataFilter) {
                    data = s.dataFilter(data, type);
                }
                if (typeof data === 'string') {
                    if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                        data = parseJSON(data);
                    } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                        $.globalEval(data);
                    }
                }
                return data;
            };
        }
    };
    $.fn.ajaxForm = function (options) {
        if (this.length === 0) {
            var o = {
                s: this.selector,
                c: this.context
            };
            if (!$.isReady && o.s) {
                log('DOM not ready, queuing ajaxForm');
                $(function () {
                    $(o.s, o.c).ajaxForm(options);
                });
                return this;
            }
            log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
            return this;
        }
        return this.ajaxFormUnbind().bind('submit.form-plugin', function (e) {
            if (!e.isDefaultPrevented()) {
                e.preventDefault();
                $(this).ajaxSubmit(options);
            }
        }).bind('click.form-plugin', function (e) {
            var target = e.target;
            var $el = $(target);
            if (!($el.is(":submit,input:image"))) {
                var t = $el.closest(':submit');
                if (t.length == 0) {
                    return;
                }
                target = t[0];
            }
            var form = this;
            form.clk = target;
            if (target.type == 'image') {
                if (e.offsetX != undefined) {
                    form.clk_x = e.offsetX;
                    form.clk_y = e.offsetY;
                } else if (typeof $.fn.offset == 'function') {
                    var offset = $el.offset();
                    form.clk_x = e.pageX - offset.left;
                    form.clk_y = e.pageY - offset.top;
                } else {
                    form.clk_x = e.pageX - target.offsetLeft;
                    form.clk_y = e.pageY - target.offsetTop;
                }
            }
            setTimeout(function () {
                form.clk = form.clk_x = form.clk_y = null;
            }, 100);
        });
    };
    $.fn.ajaxFormUnbind = function () {
        return this.unbind('submit.form-plugin click.form-plugin');
    };
    $.fn.formToArray = function (semantic) {
        var a = [];
        if (this.length === 0) {
            return a;
        }
        var form = this[0];
        var els = semantic ? form.getElementsByTagName('*') : form.elements;
        if (!els) {
            return a;
        }
        var i, j, n, v, el, max, jmax;
        for (i = 0, max = els.length; i < max; i++) {
            el = els[i];
            n = el.name;
            if (!n) {
                continue;
            }
            if (semantic && form.clk && el.type == "image") {
                if (!el.disabled && form.clk == el) {
                    a.push({
                        name: n,
                        value: $(el).val()
                    });
                    a.push({
                        name: n + '.x',
                        value: form.clk_x
                    }, {
                        name: n + '.y',
                        value: form.clk_y
                    });
                }
                continue;
            }
            v = $.fieldValue(el, true);
            if (v && v.constructor == Array) {
                for (j = 0, jmax = v.length; j < jmax; j++) {
                    a.push({
                        name: n,
                        value: v[j]
                    });
                }
            } else if (v !== null && typeof v != 'undefined') {
                a.push({
                    name: n,
                    value: v
                });
            }
        }
        if (!semantic && form.clk) {
            var $input = $(form.clk),
                input = $input[0];
            n = input.name;
            if (n && !input.disabled && input.type == 'image') {
                a.push({
                    name: n,
                    value: $input.val()
                });
                a.push({
                    name: n + '.x',
                    value: form.clk_x
                }, {
                    name: n + '.y',
                    value: form.clk_y
                });
            }
        }
        return a;
    };
    $.fn.formSerialize = function (semantic) {
        return $.param(this.formToArray(semantic));
    };
    $.fn.fieldSerialize = function (successful) {
        var a = [];
        this.each(function () {
            var n = this.name;
            if (!n) {
                return;
            }
            var v = $.fieldValue(this, successful);
            if (v && v.constructor == Array) {
                for (var i = 0, max = v.length; i < max; i++) {
                    a.push({
                        name: n,
                        value: v[i]
                    });
                }
            } else if (v !== null && typeof v != 'undefined') {
                a.push({
                    name: this.name,
                    value: v
                });
            }
        });
        return $.param(a);
    };
    $.fn.fieldValue = function (successful) {
        for (var val = [], i = 0, max = this.length; i < max; i++) {
            var el = this[i];
            var v = $.fieldValue(el, successful);
            if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
                continue;
            }
            v.constructor == Array ? $.merge(val, v) : val.push(v);
        }
        return val;
    };
    $.fieldValue = function (el, successful) {
        var n = el.name,
            t = el.type,
            tag = el.tagName.toLowerCase();
        if (successful === undefined) {
            successful = true;
        }
        if (successful && (!n || el.disabled || t == 'reset' || t == 'button' || (t == 'checkbox' || t == 'radio') && !el.checked || (t == 'submit' || t == 'image') && el.form && el.form.clk != el || tag == 'select' && el.selectedIndex == -1)) {
            return null;
        }
        if (tag == 'select') {
            var index = el.selectedIndex;
            if (index < 0) {
                return null;
            }
            var a = [],
                ops = el.options;
            var one = (t == 'select-one');
            var max = (one ? index + 1 : ops.length);
            for (var i = (one ? index : 0); i < max; i++) {
                var op = ops[i];
                if (op.selected) {
                    var v = op.value;
                    if (!v) {
                        v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                    }
                    if (one) {
                        return v;
                    }
                    a.push(v);
                }
            }
            return a;
        }
        return $(el).val();
    };
    $.fn.clearForm = function () {
        return this.each(function () {
            $('input,select,textarea', this).clearFields();
        });
    };
    $.fn.clearFields = $.fn.clearInputs = function () {
        return this.each(function () {
            var t = this.type,
                tag = this.tagName.toLowerCase();
            if (t == 'text' || t == 'password' || tag == 'textarea') {
                this.value = '';
            } else if (t == 'checkbox' || t == 'radio') {
                this.checked = false;
            } else if (tag == 'select') {
                this.selectedIndex = -1;
            }
        });
    };
    $.fn.resetForm = function () {
        return this.each(function () {
            if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
                this.reset();
            }
        });
    };
    $.fn.enable = function (b) {
        if (b === undefined) {
            b = true;
        }
        return this.each(function () {
            this.disabled = !b;
        });
    };
    $.fn.selected = function (select) {
        if (select === undefined) {
            select = true;
        }
        return this.each(function () {
            var t = this.type;
            if (t == 'checkbox' || t == 'radio') {
                this.checked = select;
            } else if (this.tagName.toLowerCase() == 'option') {
                var $sel = $(this).parent('select');
                if (select && $sel[0] && $sel[0].type == 'select-one') {
                    $sel.find('option').selected(false);
                }
                this.selected = select;
            }
        });
    };

    function log() {
        if ($.fn.ajaxSubmit.debug) {
            var msg = '[jquery.form] ' + Array.prototype.join.call(arguments, '');
            if (window.console && window.console.log) {
                window.console.log(msg);
            } else if (window.opera && window.opera.postError) {
                window.opera.postError(msg);
            }
        }
    };
})(jQuery);
(function ($) {
    var types = ['DOMMouseScroll', 'mousewheel'];
    $.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) for (var i = types.length; i;)
            this.addEventListener(types[--i], handler, false);
            else this.onmousewheel = handler;
        },
        teardown: function () {
            if (this.removeEventListener) for (var i = types.length; i;)
            this.removeEventListener(types[--i], handler, false);
            else this.onmousewheel = null;
        }
    };
    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },
        unmousewheel: function (fn) {
            return this.unbind("mousewheel", fn);
        }
    });

    function handler(event) {
        var args = [].slice.call(arguments, 1),
            delta = 0,
            returnValue = true;
        event = $.event.fix(event || window.event);
        event.type = "mousewheel";
        if (event.wheelDelta) delta = event.wheelDelta / 120;
        if (event.detail) delta = -event.detail / 3;
        args.unshift(event, delta);
        return $.event.handle.apply(this, args);
    }
})(jQuery);
if (jQuery)(function () {
    $.extend($.fn, {
        rightClick: function (handler) {
            $(this).each(function () {
                $(this).mousedown(function (e) {
                    var evt = e;
                    $(this).mouseup(function () {
                        $(this).unbind('mouseup');
                        if (evt.button == 2) {
                            handler.call($(this), evt);
                            return false;
                        } else {
                            return true;
                        }
                    });
                });
                $(this)[0].oncontextmenu = function () {
                    return false;
                }
            });
            return $(this);
        },
        rightMouseDown: function (handler) {
            $(this).each(function () {
                $(this).mousedown(function (e) {
                    if (e.button == 2) {
                        handler.call($(this), e);
                        return false;
                    } else {
                        return true;
                    }
                });
                $(this)[0].oncontextmenu = function () {
                    return false;
                }
            });
            return $(this);
        },
        rightMouseUp: function (handler) {
            $(this).each(function () {
                $(this).mouseup(function (e) {
                    if (e.button == 2) {
                        handler.call($(this), e);
                        return false;
                    } else {
                        return true;
                    }
                });
                $(this)[0].oncontextmenu = function () {
                    return false;
                }
            });
            return $(this);
        },
        noContext: function () {
            $(this).each(function () {
                $(this)[0].oncontextmenu = function () {
                    return false;
                }
            });
            return $(this);
        }
    });
})(jQuery);
(function ($) {
    $.toJSON = function (o) {
        if (typeof (JSON) == "object" && JSON.stringify) {
            return JSON.stringify(o)
        }
        var type = typeof (o);
        if (o === null) {
            return "null"
        }
        if (type == "undefined") {
            return undefined
        }
        if (type == "number" || type == "boolean") {
            return o + ""
        }
        if (type == "string") {
            return $.quoteString(o)
        }
        if (type == "object") {
            if (typeof o.toJSON == "function") {
                return $.toJSON(o.toJSON())
            }
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10) {
                    month = "0" + month
                }
                var day = o.getUTCDate();
                if (day < 10) {
                    day = "0" + day
                }
                var year = o.getUTCFullYear();
                var hours = o.getUTCHours();
                if (hours < 10) {
                    hours = "0" + hours
                }
                var minutes = o.getUTCMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes
                }
                var seconds = o.getUTCSeconds();
                if (seconds < 10) {
                    seconds = "0" + seconds
                }
                var milli = o.getUTCMilliseconds();
                if (milli < 100) {
                    milli = "0" + milli
                }
                if (milli < 10) {
                    milli = "0" + milli
                }
                return '"' + year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + milli + 'Z"'
            }
            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++) {
                    ret.push($.toJSON(o[i]) || "null")
                }
                return "[" + ret.join(",") + "]"
            }
            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;
                if (type == "number") {
                    name = '"' + k + '"'
                } else {
                    if (type == "string") {
                        name = $.quoteString(k)
                    } else {
                        continue
                    }
                }
                if (typeof o[k] == "function") {
                    continue
                }
                var val = $.toJSON(o[k]);
                pairs.push(name + ":" + val)
            }
            return "{" + pairs.join(", ") + "}"
        }
    };
    $.evalJSON = function (src) {
        if (typeof (JSON) == "object" && JSON.parse) {
            return JSON.parse(src)
        }
        return eval("(" + src + ")")
    };
    $.secureEvalJSON = function (src) {
        if (typeof (JSON) == "object" && JSON.parse) {
            return JSON.parse(src)
        }
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, "@");
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval("(" + src + ")")
        } else {
            throw new SyntaxError("Error parsing JSON, source is not valid.")
        }
    };
    $.quoteString = function (string) {
        if (string.match(_escapeable)) {
            return '"' + string.replace(_escapeable, function (a) {
                var c = _meta[a];
                if (typeof c === "string") {
                    return c
                }
                c = a.charCodeAt();
                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
            }) + '"'
        }
        return '"' + string + '"'
    };
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    var _meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }
})(jQuery);
(function ($) {
    function getTransformProperty(element) {
        var properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
        var p;
        while (p = properties.shift()) {
            if (typeof element.style[p] != 'undefined') {
                return p;
            }
        }
        return 'transform';
    }
    var _propsObj = null;
    var proxied = $.fn.css;
    $.fn.css = function (arg, val) {
        if (_propsObj === null) {
            if (typeof $.cssProps != 'undefined') {
                _propsObj = $.cssProps;
            } else if (typeof $.props != 'undefined') {
                _propsObj = $.props;
            } else {
                _propsObj = {}
            }
        }
        if (typeof _propsObj['transform'] == 'undefined' && (arg == 'transform' || (typeof arg == 'object' && typeof arg['transform'] != 'undefined'))) {
            _propsObj['transform'] = getTransformProperty(this.get(0));
        }
        if (_propsObj['transform'] != 'transform') {
            if (arg == 'transform') {
                arg = _propsObj['transform'];
                if (typeof val == 'undefined' && jQuery.style) {
                    return jQuery.style(this.get(0), arg);
                }
            } else if (typeof arg == 'object' && typeof arg['transform'] != 'undefined') {
                arg[_propsObj['transform']] = arg['transform'];
                delete arg['transform'];
            }
        }
        return proxied.apply(this, arguments);
    };
})(jQuery);
(function ($) {
    var rotateUnits = 'deg';
    $.fn.rotate = function (val) {
        var style = $(this).css('transform') || 'none';
        if (typeof val == 'undefined') {
            if (style) {
                var m = style.match(/rotate\(([^)]+)\)/);
                if (m && m[1]) {
                    return m[1];
                }
            }
            return 0;
        }
        var m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
        if (m) {
            if (m[3]) {
                rotateUnits = m[3];
            }
            $(this).css('transform', style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')');
        }
        return this;
    }
    $.fn.scale = function (val, duration, options) {
        var style = $(this).css('transform');
        if (typeof val == 'undefined') {
            if (style) {
                var m = style.match(/scale\(([^)]+)\)/);
                if (m && m[1]) {
                    return m[1];
                }
            }
            return 1;
        }
        $(this).css('transform', style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')');
        return this;
    }
    var curProxied = $.fx.prototype.cur;
    $.fx.prototype.cur = function () {
        if (this.prop == 'rotate') {
            return parseFloat($(this.elem).rotate());
        } else if (this.prop == 'scale') {
            return parseFloat($(this.elem).scale());
        }
        return curProxied.apply(this, arguments);
    }
    $.fx.step.rotate = function (fx) {
        $(fx.elem).rotate(fx.now + rotateUnits);
    }
    $.fx.step.scale = function (fx) {
        $(fx.elem).scale(fx.now);
    }
    var animateProxied = $.fn.animate;
    $.fn.animate = function (prop) {
        if (typeof prop['rotate'] != 'undefined') {
            var m = prop['rotate'].toString().match(/^(([+-]=)?(-?\d+(\.\d+)?))(.+)?$/);
            if (m && m[5]) {
                rotateUnits = m[5];
            }
            prop['rotate'] = m[1];
        }
        return animateProxied.apply(this, arguments);
    }
})(jQuery);
(function ($) {
    var isiOS = false;
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
        isiOS = true;
    }
    $.fn.doubletap = function (onDoubleTapCallback, onTapCallback, delay) {
        var eventName, action;
        delay = delay == null ? 500 : delay;
        eventName = isiOS == true ? 'touchend' : 'click';
        $(this).bind(eventName, function (event) {
            var now = new Date().getTime();
            var lastTouch = $(this).data('lastTouch') || now + 1;
            var delta = now - lastTouch;
            clearTimeout(action);
            if (delta0) {
                if (onDoubleTapCallback != null && typeof onDoubleTapCallback == 'function') {
                    onDoubleTapCallback(event);
                }
            } else {
                $(this).data('lastTouch', now);
                action = setTimeout(function (evt) {
                    if (onTapCallback != null && typeof onTapCallback == 'function') {
                        onTapCallback(evt);
                    }
                    clearTimeout(action);
                }, delay, [event]);
            }
            $(this).data('lastTouch', now);
        });
    };
})(jQuery);
(function (glob) {
    var version = "0.3.2",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        wildcard = "*",
        fun = function () {}, numsort = function (a, b) {
            return a - b;
        }, current_event, stop, events = {
            n: {}
        }, eve = function (name, scope) {
            var e = events,
                oldstop = stop,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                z = 0,
                f = false,
                l, indexed = [],
                queue = {}, out = [],
                errors = [];
            current_event = name;
            stop = 0;
            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
            indexed.sort(numsort);
            while (indexed[z] < 0) {
                l = queue[indexed[z++]];
                out.push(l.apply(scope, args));
                if (stop) {
                    stop = oldstop;
                    return out;
                }
            }
            for (i = 0; i < ii; i++) {
                l = listeners[i];
                if ("zIndex" in l) {
                    if (l.zIndex == indexed[z]) {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            stop = oldstop;
                            return out;
                        }
                        do {
                            z++;
                            l = queue[indexed[z]];
                            l && out.push(l.apply(scope, args));
                            if (stop) {
                                stop = oldstop;
                                return out;
                            }
                        } while (l)
                    } else {
                        queue[l.zIndex] = l;
                    }
                } else {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        stop = oldstop;
                        return out;
                    }
                }
            }
            stop = oldstop;
            return out.length ? out : null;
        };
    eve.listeners = function (name) {
        var names = name.split(separator),
            e = events,
            item, items, k, i, ii, j, jj, nes, es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    eve.on = function (name, f) {
        var names = name.split(separator),
            e = events;
        for (var i = 0, ii = names.length; i < ii; i++) {
            e = e.n;
            !e[names[i]] && (e[names[i]] = {
                n: {}
            });
            e = e[names[i]];
        }
        e.f = e.f || [];
        for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
            return fun;
        }
        e.f.push(f);
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    eve.stop = function () {
        stop = 1;
    };
    eve.nt = function (subname) {
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(current_event);
        }
        return current_event;
    };
    eve.unbind = function (name, f) {
        var names = name.split(separator),
            e, key, splice, cur = [events];
        for (var i = 0, ii = names.length; i < ii; i++) {
            for (var j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                            e.f.splice(j, 1);
                            break;
                        }!e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                            funcs.splice(j, 1);
                            break;
                        }!funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        delete e.n[key].f;
                    }
                }
                e = e.n;
            }
        }
    };
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    (typeof module != "undefined" && module.exports) ? (module.exports = eve) : (glob.eve = eve);
})(this);
(function () {
    function R(first) {
        if (R.is(first, "function")) {
            return loaded ? first() : eve.on("DOMload", first);
        } else if (R.is(first, array)) {
            var a = first,
                cnv = R._engine.create[apply](R, a.splice(0, 3 + R.is(a[0], nu))),
                res = cnv.set(),
                i = 0,
                ii = a.length,
                j;
            for (; i < ii; i++) {
                j = a[i] || {};
                elements[has](j.type) && res.push(cnv[j.type]().attr(j));
            }
            return res;
        } else {
            var args = Array.prototype.slice.call(arguments, 0);
            if (R.is(args[args.length - 1], "function")) {
                var f = args.pop();
                return loaded ? f.call(R._engine.create[apply](R, args)) : eve.on("DOMload", function () {
                    f.call(R._engine.create[apply](R, args));
                });
            } else {
                return R._engine.create[apply](R, arguments);
            }
        }
    }
    R.version = "2.0.0";
    R.eve = eve;
    var loaded, separator = /[, ]+/,
        elements = {
            circle: 1,
            rect: 1,
            path: 1,
            ellipse: 1,
            text: 1,
            image: 1
        }, formatrg = /\{(\d+)\}/g,
        proto = "prototype",
        has = "hasOwnProperty",
        g = {
            doc: document,
            win: window
        }, oldRaphael = {
            was: Object.prototype[has].call(g.win, "Raphael"),
            is: g.win.Raphael
        }, Paper = function () {
            this.ca = this.customAttributes = {};
        }, paperproto, appendChild = "appendChild",
        apply = "apply",
        concat = "concat",
        supportsTouch = "createTouch" in g.doc,
        E = "",
        S = " ",
        Str = String,
        split = "split",
        events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel" [split](S),
        touchMap = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        }, lowerCase = Str.prototype.toLowerCase,
        math = Math,
        mmax = math.max,
        mmin = math.min,
        abs = math.abs,
        pow = math.pow,
        PI = math.PI,
        nu = "number",
        string = "string",
        array = "array",
        toString = "toString",
        fillString = "fill",
        objectToString = Object.prototype.toString,
        paper = {}, push = "push",
        ISURL = R._ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
        isnan = {
            "NaN": 1,
            "Infinity": 1,
            "-Infinity": 1
        }, bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        round = math.round,
        setAttribute = "setAttribute",
        toFloat = parseFloat,
        toInt = parseInt,
        upperCase = Str.prototype.toUpperCase,
        availableAttrs = R._availableAttrs = {
            "arrow-end": "none",
            "arrow-start": "none",
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: '10px "Arial"',
            "font-family": '"Arial"',
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            opacity: 1,
            path: "M0,0",
            r: 0,
            rx: 0,
            ry: 0,
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            transform: "",
            width: 0,
            x: 0,
            y: 0
        }, availableAnimAttrs = R._availableAnimAttrs = {
            blur: nu,
            "clip-rect": "csv",
            cx: nu,
            cy: nu,
            fill: "colour",
            "fill-opacity": nu,
            "font-size": nu,
            height: nu,
            opacity: nu,
            path: "path",
            r: nu,
            rx: nu,
            ry: nu,
            stroke: "colour",
            "stroke-opacity": nu,
            "stroke-width": nu,
            transform: "transform",
            width: nu,
            x: nu,
            y: nu
        }, commaSpaces = /\s*,\s*/,
        hsrg = {
            hs: 1,
            rg: 1
        }, p2s = /,?([achlmqrstvxz]),?/gi,
        pathCommand = /([achlmrqstvz])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?\s*,?\s*)+)/ig,
        tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?\s*,?\s*)+)/ig,
        pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)\s*,?\s*/ig,
        radial_gradient = R._radial_gradient = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/,
        eldata = {}, sortByKey = function (a, b) {
            return a.key - b.key;
        }, sortByNumber = function (a, b) {
            return toFloat(a) - toFloat(b);
        }, fun = function () {}, pipe = function (x) {
            return x;
        }, rectPath = R._rectPath = function (x, y, w, h, r) {
            if (r) {
                return [["M", x + r, y], ["l", w - r * 2, 0], ["a", r, r, 0, 0, 1, r, r], ["l", 0, h - r * 2], ["a", r, r, 0, 0, 1, - r, r], ["l", r * 2 - w, 0], ["a", r, r, 0, 0, 1, - r, - r], ["l", 0, r * 2 - h], ["a", r, r, 0, 0, 1, r, - r], ["z"]];
            }
            return [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", - w, 0], ["z"]];
        }, ellipsePath = function (x, y, rx, ry) {
            if (ry == null) {
                ry = rx;
            }
            return [["M", x, y], ["m", 0, - ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, - 2 * ry], ["z"]];
        }, getPath = R._getPath = {
            path: function (el) {
                return el.attr("path");
            },
            circle: function (el) {
                var a = el.attrs;
                return ellipsePath(a.cx, a.cy, a.r);
            },
            ellipse: function (el) {
                var a = el.attrs;
                return ellipsePath(a.cx, a.cy, a.rx, a.ry);
            },
            rect: function (el) {
                var a = el.attrs;
                return rectPath(a.x, a.y, a.width, a.height, a.r);
            },
            image: function (el) {
                var a = el.attrs;
                return rectPath(a.x, a.y, a.width, a.height);
            },
            text: function (el) {
                var bbox = el._getBBox();
                return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
            }
        }, mapPath = R.mapPath = function (path, matrix) {
            if (!matrix) {
                return path;
            }
            var x, y, i, j, pathi;
            path = path2curve(path);
            for (i = 0, ii = path.length; i < ii; i++) {
                pathi = path[i];
                for (j = 1, jj = pathi.length; j < jj; j += 2) {
                    x = matrix.x(pathi[j], pathi[j + 1]);
                    y = matrix.y(pathi[j], pathi[j + 1]);
                    pathi[j] = x;
                    pathi[j + 1] = y;
                }
            }
            return path;
        };
    R._g = g;
    R.type = (g.win.SVGAngle || g.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    if (R.type == "VML") {
        var d = g.doc.createElement("div"),
            b;
        d.innerHTML = '<v:shape adj="1"/>';
        b = d.firstChild;
        b.style.behavior = "url(#default#VML)";
        if (!(b && typeof b.adj == "object")) {
            return (R.type = E);
        }
        d = null;
    }
    R.svg = !(R.vml = R.type == "VML");
    R._Paper = Paper;
    R.fn = paperproto = Paper.prototype = R.prototype;
    R._id = 0;
    R._oid = 0;
    R.is = function (o, type) {
        type = lowerCase.call(type);
        if (type == "finite") {
            return !isnan[has](+o);
        }
        if (type == "array") {
            return o instanceof Array;
        }
        return (type == "null" && o === null) || (type == typeof o && o !== null) || (type == "object" && o === Object(o)) || (type == "array" && Array.isArray && Array.isArray(o)) || objectToString.call(o).slice(8, - 1).toLowerCase() == type;
    };
    R.angle = function (x1, y1, x2, y2, x3, y3) {
        if (x3 == null) {
            var x = x1 - x2,
                y = y1 - y2;
            if (!x && !y) {
                return 0;
            }
            return (180 + math.atan2(-y, - x) * 180 / PI + 360) % 360;
        } else {
            return R.angle(x1, y1, x3, y3) - R.angle(x2, y2, x3, y3);
        }
    };
    R.rad = function (deg) {
        return deg % 360 * PI / 180;
    };
    R.deg = function (rad) {
        return rad * 180 / PI % 360;
    };
    R.snapTo = function (values, value, tolerance) {
        tolerance = R.is(tolerance, "finite") ? tolerance : 10;
        if (R.is(values, array)) {
            var i = values.length;
            while (i--) if (abs(values[i] - value) <= tolerance) {
                return values[i];
            }
        } else {
            values = +values;
            var rem = value % values;
            if (rem < tolerance) {
                return value - rem;
            }
            if (rem > values - tolerance) {
                return value - rem + values;
            }
        }
        return value;
    };
    var createUUID = R.createUUID = (function (uuidRegEx, uuidReplacer) {
        return function () {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function (c) {
        var r = math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    });
    R.setWindow = function (newwin) {
        eve("setWindow", R, g.win, newwin);
        g.win = newwin;
        g.doc = g.win.document;
        if (initWin) {
            initWin(g.win);
        }
    };
    var toHex = function (color) {
        if (R.vml) {
            var trim = /^\s+|\s+$/g;
            var bod;
            try {
                var docum = new ActiveXObject("htmlfile");
                docum.write("<body>");
                docum.close();
                bod = docum.body;
            } catch (e) {
                bod = createPopup().document.body;
            }
            var range = bod.createTextRange();
            toHex = cacher(function (color) {
                try {
                    bod.style.color = Str(color).replace(trim, E);
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);
                    return "#" + ("000000" + value.toString(16)).slice(-6);
                } catch (e) {
                    return "none";
                }
            });
        } else {
            var i = g.doc.createElement("i");
            i.title = "Rapha\xebl Colour Picker";
            i.style.display = "none";
            g.doc.body.appendChild(i);
            toHex = cacher(function (color) {
                i.style.color = color;
                return g.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
            });
        }
        return toHex(color);
    }, hsbtoString = function () {
        return "hsb(" + [this.h, this.s, this.b] + ")";
    }, hsltoString = function () {
        return "hsl(" + [this.h, this.s, this.l] + ")";
    }, rgbtoString = function () {
        return this.hex;
    }, prepareRGB = function (r, g, b) {
        if (g == null && R.is(r, "object") && "r" in r && "g" in r && "b" in r) {
            b = r.b;
            g = r.g;
            r = r.r;
        }
        if (g == null && R.is(r, string)) {
            var clr = R.getRGB(r);
            r = clr.r;
            g = clr.g;
            b = clr.b;
        }
        if (r > 1 || g > 1 || b > 1) {
            r /= 255;
            g /= 255;
            b /= 255;
        }
        return [r, g, b];
    }, packageRGB = function (r, g, b, o) {
        r *= 255;
        g *= 255;
        b *= 255;
        var rgb = {
            r: r,
            g: g,
            b: b,
            hex: R.rgb(r, g, b),
            toString: rgbtoString
        };
        R.is(o, "finite") && (rgb.opacity = o);
        return rgb;
    };
    R.color = function (clr) {
        var rgb;
        if (R.is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
            rgb = R.hsb2rgb(clr);
            clr.r = rgb.r;
            clr.g = rgb.g;
            clr.b = rgb.b;
            clr.hex = rgb.hex;
        } else if (R.is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
            rgb = R.hsl2rgb(clr);
            clr.r = rgb.r;
            clr.g = rgb.g;
            clr.b = rgb.b;
            clr.hex = rgb.hex;
        } else {
            if (R.is(clr, "string")) {
                clr = R.getRGB(clr);
            }
            if (R.is(clr, "object") && "r" in clr && "g" in clr && "b" in clr) {
                rgb = R.rgb2hsl(clr);
                clr.h = rgb.h;
                clr.s = rgb.s;
                clr.l = rgb.l;
                rgb = R.rgb2hsb(clr);
                clr.v = rgb.b;
            } else {
                clr = {
                    hex: "none"
                };
                crl.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
            }
        }
        clr.toString = rgbtoString;
        return clr;
    };
    R.hsb2rgb = function (h, s, v, o) {
        if (this.is(h, "object") && "h" in h && "s" in h && "b" in h) {
            v = h.b;
            s = h.s;
            h = h.h;
            o = h.o;
        }
        h *= 360;
        var R, G, B, X, C;
        h = (h % 360) / 60;
        C = v * s;
        X = C * (1 - abs(h % 2 - 1));
        R = G = B = v - C;
        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];
        return packageRGB(R, G, B, o);
    };
    R.hsl2rgb = function (h, s, l, o) {
        if (this.is(h, "object") && "h" in h && "s" in h && "l" in h) {
            l = h.l;
            s = h.s;
            h = h.h;
        }
        if (h > 1 || s > 1 || l > 1) {
            h /= 360;
            s /= 100;
            l /= 100;
        }
        h *= 360;
        var R, G, B, X, C;
        h = (h % 360) / 60;
        C = 2 * s * (l < .5 ? l : 1 - l);
        X = C * (1 - abs(h % 2 - 1));
        R = G = B = l - C / 2;
        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];
        return packageRGB(R, G, B, o);
    };
    R.rgb2hsb = function (r, g, b) {
        b = prepareRGB(r, g, b);
        r = b[0];
        g = b[1];
        b = b[2];
        var H, S, V, C;
        V = mmax(r, g, b);
        C = V - mmin(r, g, b);
        H = (C == 0 ? null : V == r ? (g - b) / C : V == g ? (b - r) / C + 2 : (r - g) / C + 4);
        H = ((H + 360) % 6) * 60 / 360;
        S = C == 0 ? 0 : C / V;
        return {
            h: H,
            s: S,
            b: V,
            toString: hsbtoString
        };
    };
    R.rgb2hsl = function (r, g, b) {
        b = prepareRGB(r, g, b);
        r = b[0];
        g = b[1];
        b = b[2];
        var H, S, L, M, m, C;
        M = mmax(r, g, b);
        m = mmin(r, g, b);
        C = M - m;
        H = (C == 0 ? null : M == r ? (g - b) / C : M == g ? (b - r) / C + 2 : (r - g) / C + 4);
        H = ((H + 360) % 6) * 60 / 360;
        L = (M + m) / 2;
        S = (C == 0 ? 0 : L < .5 ? C / (2 * L) : C / (2 - 2 * L));
        return {
            h: H,
            s: S,
            l: L,
            toString: hsltoString
        };
    };
    R._path2string = function () {
        return this.join(",").replace(p2s, "$1");
    };

    function repush(array, item) {
        for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) {
            return array.push(array.splice(i, 1)[0]);
        }
    }

    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array.prototype.slice.call(arguments, 0),
                args = arg.join("\u2400"),
                cache = newf.cache = newf.cache || {}, count = newf.count = newf.count || [];
            if (cache[has](args)) {
                repush(count, args);
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count.length >= 1e3 && delete cache[count.shift()];
            count.push(args);
            cache[args] = f[apply](scope, arg);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        return newf;
    }
    var preload = R._preload = function (src, f) {
        var img = g.doc.createElement("img");
        img.style.cssText = "position:absolute;left:-9999em;top-9999em";
        img.onload = function () {
            f.call(this);
            this.onload = null;
            g.doc.body.removeChild(this);
        };
        img.onerror = function () {
            g.doc.body.removeChild(this);
        };
        g.doc.body.appendChild(img);
        img.src = src;
    };

    function clrToString() {
        return this.hex;
    }
    R.getRGB = cacher(function (colour) {
        if (!colour || !! ((colour = Str(colour)).indexOf("-") + 1)) {
            return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                error: 1,
                toString: clrToString
            };
        }
        if (colour == "none") {
            return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                toString: clrToString
            };
        }!(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
        var res, red, green, blue, opacity, t, values, rgb = colour.match(colourRegExp);
        if (rgb) {
            if (rgb[2]) {
                blue = toInt(rgb[2].substring(5), 16);
                green = toInt(rgb[2].substring(3, 5), 16);
                red = toInt(rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                green = toInt((t = rgb[3].charAt(2)) + t, 16);
                red = toInt((t = rgb[3].charAt(1)) + t, 16);
            }
            if (rgb[4]) {
                values = rgb[4][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            }
            if (rgb[5]) {
                values = rgb[5][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                return R.hsb2rgb(red, green, blue, opacity);
            }
            if (rgb[6]) {
                values = rgb[6][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                return R.hsl2rgb(red, green, blue, opacity);
            }
            rgb = {
                r: red,
                g: green,
                b: blue,
                toString: clrToString
            };
            rgb.hex = "#" + (16777216 | blue | (green << 8) | (red << 16)).toString(16).slice(1);
            R.is(opacity, "finite") && (rgb.opacity = opacity);
            return rgb;
        }
        return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            error: 1,
            toString: clrToString
        };
    }, R);
    R.hsb = cacher(function (h, s, b) {
        return R.hsb2rgb(h, s, b).hex;
    });
    R.hsl = cacher(function (h, s, l) {
        return R.hsl2rgb(h, s, l).hex;
    });
    R.rgb = cacher(function (r, g, b) {
        return "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
    });
    R.getColor = function (value) {
        var start = this.getColor.start = this.getColor.start || {
            h: 0,
            s: 1,
            b: value || .75
        }, rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += .075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= .2;
            start.s <= 0 && (this.getColor.start = {
                h: 0,
                s: 1,
                b: start.b
            });
        }
        return rgb.hex;
    };
    R.getColor.reset = function () {
        delete this.start;
    };

    function catmullRom2bezier(crp) {
        var d = [];
        for (var i = 0, iLen = crp.length; iLen - 2 > i; i += 2) {
            var p = [{
                x: +crp[i],
                y: +crp[i + 1]
            }, {
                x: +crp[i],
                y: +crp[i + 1]
            }, {
                x: +crp[i + 2],
                y: +crp[i + 3]
            }, {
                x: +crp[i + 4],
                y: +crp[i + 5]
            }];
            if (iLen - 4 == i) {
                p[0] = {
                    x: +crp[i - 2],
                    y: +crp[i - 1]
                };
                p[3] = p[2];
            } else if (i) {
                p[0] = {
                    x: +crp[i - 2],
                    y: +crp[i - 1]
                };
            }
            d.push(["C", (-p[0].x + 6 * p[1].x + p[2].x) / 6, (-p[0].y + 6 * p[1].y + p[2].y) / 6, (p[1].x + 6 * p[2].x - p[3].x) / 6, (p[1].y + 6 * p[2].y - p[3].y) / 6, p[2].x, p[2].y]);
        }
        return d;
    }
    R.parsePathString = cacher(function (pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {
            a: 7,
            c: 6,
            h: 1,
            l: 2,
            m: 2,
            r: 4,
            q: 4,
            s: 4,
            t: 2,
            v: 1,
            z: 0
        }, data = [];
        if (R.is(pathString, array) && R.is(pathString[0], array)) {
            data = pathClone(pathString);
        }
        if (!data.length) {
            Str(pathString).replace(pathCommand, function (a, b, c) {
                var params = [],
                    name = b.toLowerCase();
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                if (name == "m" && params.length > 2) {
                    data.push([b][concat](params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                if (name == "r") {
                    data.push([b][concat](params));
                } else while (params.length >= paramCounts[name]) {
                    data.push([b][concat](params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        data.toString = R._path2string;
        return data;
    });
    R.parseTransformString = cacher(function (TString) {
        if (!TString) {
            return null;
        }
        var paramCounts = {
            r: 3,
            s: 4,
            t: 2,
            m: 6
        }, data = [];
        if (R.is(TString, array) && R.is(TString[0], array)) {
            data = pathClone(TString);
        }
        if (!data.length) {
            Str(TString).replace(tCommand, function (a, b, c) {
                var params = [],
                    name = lowerCase.call(b);
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                data.push([b][concat](params));
            });
        }
        data.toString = R._path2string;
        return data;
    });
    R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            t13 = pow(t1, 3),
            t12 = pow(t1, 2),
            t2 = t * t,
            t3 = t2 * t,
            x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
            y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
            ax = t1 * p1x + t * c1x,
            ay = t1 * p1y + t * c1y,
            cx = t1 * c2x + t * p2x,
            cy = t1 * c2y + t * p2y,
            alpha = (90 - math.atan2(mx - nx, my - ny) * 180 / PI);
        (mx > nx || my < ny) && (alpha += 180);
        return {
            x: x,
            y: y,
            m: {
                x: mx,
                y: my
            },
            n: {
                x: nx,
                y: ny
            },
            start: {
                x: ax,
                y: ay
            },
            end: {
                x: cx,
                y: cy
            },
            alpha: alpha
        };
    };
    var pathDimensions = cacher(function (path) {
        if (!path) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
        path = path2curve(path);
        var x = 0,
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path.length; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X.push(x);
                Y.push(y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X[concat](dim.min.x, dim.max.x);
                Y = Y[concat](dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin[apply](0, X),
            ymin = mmin[apply](0, Y);
        return {
            x: xmin,
            y: ymin,
            width: mmax[apply](0, X) - xmin,
            height: mmax[apply](0, Y) - ymin
        };
    }, null, function (o) {
        return {
            x: o.x,
            y: o.y,
            width: o.width,
            height: o.height
        };
    }),
        pathClone = function (pathArray) {
            var res = [];
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) {
                pathArray = R.parsePathString(pathArray);
            }
            for (var i = 0, ii = pathArray.length; i < ii; i++) {
                res[i] = [];
                for (var j = 0, jj = pathArray[i].length; j < jj; j++) {
                    res[i][j] = pathArray[i][j];
                }
            }
            res.toString = R._path2string;
            return res;
        }, pathToRelative = R._pathToRelative = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) {
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res.push(["M", x, y]);
            }
            for (var i = start, ii = pathArray.length; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                    case "a":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +(pa[6] - x).toFixed(3);
                        r[7] = +(pa[7] - y).toFixed(3);
                        break;
                    case "v":
                        r[1] = +(pa[1] - y).toFixed(3);
                        break;
                    case "m":
                        mx = pa[1];
                        my = pa[2];
                    default:
                        for (var j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                        }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa.length; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i].length;
                switch (res[i][0]) {
                case "z":
                    x = mx;
                    y = my;
                    break;
                case "h":
                    x += +res[i][len - 1];
                    break;
                case "v":
                    y += +res[i][len - 1];
                    break;
                default:
                    x += +res[i][len - 2];
                    y += +res[i][len - 1];
                }
            }
            res.toString = R._path2string;
            return res;
        }, 0, pathClone),
        pathToAbsolute = R._pathToAbsolute = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) {
                pathArray = R.parsePathString(pathArray);
            }
            if (!pathArray || !pathArray.length) {
                return [["M", 0, 0]];
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
                res.push(r = []);
                pa = pathArray[i];
                if (pa[0] != upperCase.call(pa[0])) {
                    r[0] = upperCase.call(pa[0]);
                    switch (r[0]) {
                    case "A":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +(pa[6] + x);
                        r[7] = +(pa[7] + y);
                        break;
                    case "V":
                        r[1] = +pa[1] + y;
                        break;
                    case "H":
                        r[1] = +pa[1] + x;
                        break;
                    case "R":
                        var dots = [x, y][concat](pa.slice(1));
                        for (var j = 2, jj = dots.length; j < jj; j++) {
                            dots[j] = +dots[j] + x;
                            dots[++j] = +dots[j] + y;
                        }
                        res.pop();
                        res = res[concat](catmullRom2bezier(dots));
                        break;
                    case "M":
                        mx = +pa[1] + x;
                        my = +pa[2] + y;
                    default:
                        for (j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +pa[j] + ((j % 2) ? x : y);
                        }
                    }
                } else if (pa[0] == "R") {
                    dots = [x, y][concat](pa.slice(1));
                    res.pop();
                    res = res[concat](catmullRom2bezier(dots));
                    r = ["R"][concat](pa.slice(-2));
                } else {
                    for (var k = 0, kk = pa.length; k < kk; k++) {
                        r[k] = pa[k];
                    }
                }
                switch (r[0]) {
                case "Z":
                    x = mx;
                    y = my;
                    break;
                case "H":
                    x = r[1];
                    break;
                case "V":
                    y = r[1];
                    break;
                case "M":
                    mx = r[r.length - 2];
                    my = r[r.length - 1];
                default:
                    x = r[r.length - 2];
                    y = r[r.length - 1];
                }
            }
            res.toString = R._path2string;
            return res;
        }, null, pathClone),
        l2c = function (x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        }, q2c = function (x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [_13 * x1 + _23 * ax, _13 * y1 + _23 * ay, _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2];
        }, a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            var _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy, rotate = cacher(function (x, y, rad) {
                    var X = x * math.cos(rad) - y * math.sin(rad),
                        Y = x * math.sin(rad) + y * math.cos(rad);
                    return {
                        x: X,
                        y: Y
                    };
                });
            if (!recursive) {
                xy = rotate(x1, y1, - rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, - rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = math.cos(PI / 180 * angle),
                    sin = math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
                if (h > 1) {
                    h = math.sqrt(h);
                    rx = h * rx;
                    ry = h * ry;
                }
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) * math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                    f2 = math.asin(((y2 - cy) / ry).toFixed(9));
                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * math.cos(f2);
                y2 = cy + ry * math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = math.cos(f1),
                s1 = math.sin(f1),
                c2 = math.cos(f2),
                s2 = math.sin(f2),
                t = math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4][concat](res);
            } else {
                res = [m2, m3, m4][concat](res).join()[split](",");
                var newres = [];
                for (var i = 0, ii = res.length; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        }, findDotAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t;
            return {
                x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
            };
        }, curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                c = p1x - c1x,
                t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
                t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
                y = [p1y, p2y],
                x = [p1x, p2x],
                dot;
            abs(t1) > "1e12" && (t1 = .5);
            abs(t2) > "1e12" && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x.push(dot.x);
                y.push(dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x.push(dot.x);
                y.push(dot.y);
            }
            a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
            b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
            c = p1y - c1y;
            t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
            t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
            abs(t1) > "1e12" && (t1 = .5);
            abs(t2) > "1e12" && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x.push(dot.x);
                y.push(dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x.push(dot.x);
                y.push(dot.y);
            }
            return {
                min: {
                    x: mmin[apply](0, x),
                    y: mmin[apply](0, y)
                },
                max: {
                    x: mmax[apply](0, x),
                    y: mmax[apply](0, y)
                }
            };
        }),
        path2curve = R._path2curve = cacher(function (path, path2) {
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                }, attrs2 = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                }, processPath = function (path, d) {
                    var nx, ny;
                    if (!path) {
                        return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                    }!(path[0] in {
                        T: 1,
                        Q: 1
                    }) && (d.qx = d.qy = null);
                    switch (path[0]) {
                    case "M":
                        d.X = path[1];
                        d.Y = path[2];
                        break;
                    case "A":
                        path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
                        break;
                    case "S":
                        nx = d.x + (d.x - (d.bx || d.x));
                        ny = d.y + (d.y - (d.by || d.y));
                        path = ["C", nx, ny][concat](path.slice(1));
                        break;
                    case "T":
                        d.qx = d.x + (d.x - (d.qx || d.x));
                        d.qy = d.y + (d.y - (d.qy || d.y));
                        path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                        break;
                    case "Q":
                        d.qx = path[1];
                        d.qy = path[2];
                        path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                        break;
                    case "L":
                        path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
                        break;
                    case "H":
                        path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
                        break;
                    case "V":
                        path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
                        break;
                    case "Z":
                        path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
                        break;
                    }
                    return path;
                }, fixArc = function (pp, i) {
                    if (pp[i].length > 7) {
                        pp[i].shift();
                        var pi = pp[i];
                        while (pi.length) {
                            pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
                        }
                        pp.splice(i, 1);
                        ii = mmax(p.length, p2 && p2.length || 0);
                    }
                }, fixM = function (path1, path2, a1, a2, i) {
                    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                        path2.splice(i, 0, ["M", a2.x, a2.y]);
                        a1.bx = 0;
                        a1.by = 0;
                        a1.x = path1[i][1];
                        a1.y = path1[i][2];
                        ii = mmax(p.length, p2 && p2.length || 0);
                    }
                };
            for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
                p[i] = processPath(p[i], attrs);
                fixArc(p, i);
                p2 && (p2[i] = processPath(p2[i], attrs2));
                p2 && fixArc(p2, i);
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg.length,
                    seg2len = p2 && seg2.length;
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            return p2 ? [p, p2] : p;
        }, null, pathClone),
        parseDots = R._parseDots = cacher(function (gradient) {
            var dots = [];
            for (var i = 0, ii = gradient.length; i < ii; i++) {
                var dot = {}, par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = R.getRGB(par[1]);
                if (dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                par[2] && (dot.offset = par[2] + "%");
                dots.push(dot);
            }
            for (i = 1, ii = dots.length - 1; i < ii; i++) {
                if (!dots[i].offset) {
                    var start = toFloat(dots[i - 1].offset || 0),
                        end = 0;
                    for (var j = i + 1; j < ii; j++) {
                        if (dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if (!end) {
                        end = 100;
                        j = ii;
                    }
                    end = toFloat(end);
                    var d = (end - start) / (j - i + 1);
                    for (; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            return dots;
        }),
        tear = R._tear = function (el, paper) {
            el == paper.top && (paper.top = el.prev);
            el == paper.bottom && (paper.bottom = el.next);
            el.next && (el.next.prev = el.prev);
            el.prev && (el.prev.next = el.next);
        }, tofront = R._tofront = function (el, paper) {
            if (paper.top === el) {
                return;
            }
            tear(el, paper);
            el.next = null;
            el.prev = paper.top;
            paper.top.next = el;
            paper.top = el;
        }, toback = R._toback = function (el, paper) {
            if (paper.bottom === el) {
                return;
            }
            tear(el, paper);
            el.next = paper.bottom;
            el.prev = null;
            paper.bottom.prev = el;
            paper.bottom = el;
        }, insertafter = R._insertafter = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.top && (paper.top = el);
            el2.next && (el2.next.prev = el);
            el.next = el2.next;
            el.prev = el2;
            el2.next = el;
        }, insertbefore = R._insertbefore = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.bottom && (paper.bottom = el);
            el2.prev && (el2.prev.next = el);
            el.prev = el2.prev;
            el2.prev = el;
            el.next = el2;
        }, removed = function (methodname) {
            return function () {
                throw new Error("Rapha\xebl: you are calling to method \u201c" + methodname + "\u201d of removed object");
            };
        }, extractTransform = R._extractTransform = function (el, tstr) {
            if (tstr == null) {
                return el._.transform;
            }
            tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || E);
            var tdata = R.parseTransformString(tstr),
                deg = 0,
                dx = 0,
                dy = 0,
                sx = 1,
                sy = 1,
                _ = el._,
                m = new Matrix;
            _.transform = tdata || [];
            if (tdata) {
                for (var i = 0, ii = tdata.length; i < ii; i++) {
                    var t = tdata[i],
                        tlen = t.length,
                        command = Str(t[0]).toLowerCase(),
                        absolute = t[0] != command,
                        inver = absolute ? m.invert() : 0,
                        x1, y1, x2, y2, bb;
                    if (command == "t" && tlen == 3) {
                        if (absolute) {
                            x1 = inver.x(0, 0);
                            y1 = inver.y(0, 0);
                            x2 = inver.x(t[1], t[2]);
                            y2 = inver.y(t[1], t[2]);
                            m.translate(x2 - x1, y2 - y1);
                        } else {
                            m.translate(t[1], t[2]);
                        }
                    } else if (command == "r") {
                        if (tlen == 2) {
                            bb = bb || el.getBBox(1);
                            m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                            deg += t[1];
                        } else if (tlen == 4) {
                            if (absolute) {
                                x2 = inver.x(t[2], t[3]);
                                y2 = inver.y(t[2], t[3]);
                                m.rotate(t[1], x2, y2);
                            } else {
                                m.rotate(t[1], t[2], t[3]);
                            }
                            deg += t[1];
                        }
                    } else if (command == "s") {
                        if (tlen == 2 || tlen == 3) {
                            bb = bb || el.getBBox(1);
                            m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                            sx *= t[1];
                            sy *= t[tlen - 1];
                        } else if (tlen == 5) {
                            if (absolute) {
                                x2 = inver.x(t[3], t[4]);
                                y2 = inver.y(t[3], t[4]);
                                m.scale(t[1], t[2], x2, y2);
                            } else {
                                m.scale(t[1], t[2], t[3], t[4]);
                            }
                            sx *= t[1];
                            sy *= t[2];
                        }
                    } else if (command == "m" && tlen == 7) {
                        m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
                    }
                    _.dirtyT = 1;
                    el.matrix = m;
                }
            }
            el.matrix = m;
            _.sx = sx;
            _.sy = sy;
            _.deg = deg;
            _.dx = dx = m.e;
            _.dy = dy = m.f;
            if (sx == 1 && sy == 1 && !deg && _.bbox) {
                _.bbox.x += +dx;
                _.bbox.y += +dy;
            } else {
                _.dirtyT = 1;
            }
        }, getEmpty = function (item) {
            var l = item[0];
            switch (l.toLowerCase()) {
            case "t":
                return [l, 0, 0];
            case "m":
                return [l, 1, 0, 0, 1, 0, 0];
            case "r":
                if (item.length == 4) {
                    return [l, 0, item[2], item[3]];
                } else {
                    return [l, 0];
                }
            case "s":
                if (item.length == 5) {
                    return [l, 1, 1, item[3], item[4]];
                } else if (item.length == 3) {
                    return [l, 1, 1];
                } else {
                    return [l, 1];
                }
            }
        }, equaliseTransform = R._equaliseTransform = function (t1, t2) {
            t2 = Str(t2).replace(/\.{3}|\u2026/g, t1);
            t1 = R.parseTransformString(t1) || [];
            t2 = R.parseTransformString(t2) || [];
            var maxlength = mmax(t1.length, t2.length),
                from = [],
                to = [],
                i = 0,
                j, jj, tt1, tt2;
            for (; i < maxlength; i++) {
                tt1 = t1[i] || getEmpty(t2[i]);
                tt2 = t2[i] || getEmpty(tt1);
                if ((tt1[0] != tt2[0]) || (tt1[0].toLowerCase() == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3])) || (tt1[0].toLowerCase() == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4]))) {
                    return;
                }
                from[i] = [];
                to[i] = [];
                for (j = 0, jj = mmax(tt1.length, tt2.length); j < jj; j++) {
                    j in tt1 && (from[i][j] = tt1[j]);
                    j in tt2 && (to[i][j] = tt2[j]);
                }
            }
            return {
                from: from,
                to: to
            };
        };
    R._getContainer = function (x, y, w, h) {
        var container;
        container = h == null && !R.is(x, "object") ? g.doc.getElementById(x) : x;
        if (container == null) {
            return;
        }
        if (container.tagName) {
            if (y == null) {
                return {
                    container: container,
                    width: container.style.pixelWidth || container.offsetWidth,
                    height: container.style.pixelHeight || container.offsetHeight
                };
            } else {
                return {
                    container: container,
                    width: y,
                    height: w
                };
            }
        }
        return {
            container: 1,
            x: x,
            y: y,
            width: w,
            height: h
        };
    };
    R.pathToRelative = pathToRelative;
    R._engine = {};
    R.path2curve = path2curve;
    R.matrix = function (a, b, c, d, e, f) {
        return new Matrix(a, b, c, d, e, f);
    };

    function Matrix(a, b, c, d, e, f) {
        if (a != null) {
            this.a = +a;
            this.b = +b;
            this.c = +c;
            this.d = +d;
            this.e = +e;
            this.f = +f;
        } else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
    }
    (function (matrixproto) {
        matrixproto.add = function (a, b, c, d, e, f) {
            var out = [
                [],
                [],
                []
            ],
                m = [
                    [this.a, this.c, this.e],
                    [this.b, this.d, this.f],
                    [0, 0, 1]
                ],
                matrix = [
                    [a, c, e],
                    [b, d, f],
                    [0, 0, 1]
                ],
                x, y, z, res;
            if (a && a instanceof Matrix) {
                matrix = [
                    [a.a, a.c, a.e],
                    [a.b, a.d, a.f],
                    [0, 0, 1]
                ];
            }
            for (x = 0; x < 3; x++) {
                for (y = 0; y < 3; y++) {
                    res = 0;
                    for (z = 0; z < 3; z++) {
                        res += m[x][z] * matrix[z][y];
                    }
                    out[x][y] = res;
                }
            }
            this.a = out[0][0];
            this.b = out[1][0];
            this.c = out[0][1];
            this.d = out[1][1];
            this.e = out[0][2];
            this.f = out[1][2];
        };
        matrixproto.invert = function () {
            var me = this,
                x = me.a * me.d - me.b * me.c;
            return new Matrix(me.d / x, - me.b / x, - me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
        };
        matrixproto.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
        };
        matrixproto.translate = function (x, y) {
            this.add(1, 0, 0, 1, x, y);
        };
        matrixproto.scale = function (x, y, cx, cy) {
            y == null && (y = x);
            (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
            this.add(x, 0, 0, y, 0, 0);
            (cx || cy) && this.add(1, 0, 0, 1, - cx, - cy);
        };
        matrixproto.rotate = function (a, x, y) {
            a = R.rad(a);
            x = x || 0;
            y = y || 0;
            var cos = +math.cos(a).toFixed(9),
                sin = +math.sin(a).toFixed(9);
            this.add(cos, sin, - sin, cos, x, y);
            this.add(1, 0, 0, 1, - x, - y);
        };
        matrixproto.x = function (x, y) {
            return x * this.a + y * this.c + this.e;
        };
        matrixproto.y = function (x, y) {
            return x * this.b + y * this.d + this.f;
        };
        matrixproto.get = function (i) {
            return +this[Str.fromCharCode(97 + i)].toFixed(4);
        };
        matrixproto.toString = function () {
            return R.svg ? "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" : [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join();
        };
        matrixproto.toFilter = function () {
            return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')";
        };
        matrixproto.offset = function () {
            return [this.e.toFixed(4), this.f.toFixed(4)];
        };

        function norm(a) {
            return a[0] * a[0] + a[1] * a[1];
        }

        function normalize(a) {
            var mag = math.sqrt(norm(a));
            a[0] && (a[0] /= mag);
            a[1] && (a[1] /= mag);
        }
        matrixproto.split = function () {
            var out = {};
            out.dx = this.e;
            out.dy = this.f;
            var row = [
                [this.a, this.c],
                [this.b, this.d]
            ];
            out.scalex = math.sqrt(norm(row[0]));
            normalize(row[0]);
            out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
            row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];
            out.scaley = math.sqrt(norm(row[1]));
            normalize(row[1]);
            out.shear /= out.scaley;
            var sin = -row[0][1],
                cos = row[1][1];
            if (cos < 0) {
                out.rotate = R.deg(math.acos(cos));
                if (sin < 0) {
                    out.rotate = 360 - out.rotate;
                }
            } else {
                out.rotate = R.deg(math.asin(sin));
            }
            out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
            out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
            out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
            return out;
        };
        matrixproto.toTransformString = function (shorter) {
            var s = shorter || this[split]();
            if (s.isSimple) {
                return "t" + [s.dx, s.dy] + "s" + [s.scalex, s.scaley, 0, 0] + "r" + [s.rotate, 0, 0];
            } else {
                return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
            }
        };
    })(Matrix.prototype);
    var version = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/);
    if ((navigator.vendor == "Apple Computer, Inc.") && (version && version[1] < 4 || navigator.platform.slice(0, 2) == "iP") || (navigator.vendor == "Google Inc." && version && version[1] < 8)) {
        paperproto.safari = function () {
            var rect = this.rect(-99, - 99, this.width + 99, this.height + 99).attr({
                stroke: "none"
            });
            setTimeout(function () {
                rect.remove();
            });
        };
    } else {
        paperproto.safari = fun;
    }
    var preventDefault = function () {
        this.returnValue = false;
    }, preventTouch = function () {
        return this.originalEvent.preventDefault();
    }, stopPropagation = function () {
        this.cancelBubble = true;
    }, stopTouch = function () {
        return this.originalEvent.stopPropagation();
    }, addEvent = (function () {
        if (g.doc.addEventListener) {
            return function (obj, type, fn, element) {
                var realName = supportsTouch && touchMap[type] ? touchMap[type] : type,
                    f = function (e) {
                        var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                            scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
                            x = e.clientX + scrollX,
                            y = e.clientY + scrollY;
                        if (supportsTouch && touchMap[has](type)) {
                            for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                                if (e.targetTouches[i].target == obj) {
                                    var olde = e;
                                    e = e.targetTouches[i];
                                    e.originalEvent = olde;
                                    e.preventDefault = preventTouch;
                                    e.stopPropagation = stopTouch;
                                    break;
                                }
                            }
                        }
                        return fn.call(element, e, x, y);
                    };
                obj.addEventListener(realName, f, false);
                return function () {
                    obj.removeEventListener(realName, f, false);
                    return true;
                };
            };
        } else if (g.doc.attachEvent) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    e = e || g.win.event;
                    var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                        scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
                        x = e.clientX + scrollX,
                        y = e.clientY + scrollY;
                    e.preventDefault = e.preventDefault || preventDefault;
                    e.stopPropagation = e.stopPropagation || stopPropagation;
                    return fn.call(element, e, x, y);
                };
                obj.attachEvent("on" + type, f);
                var detacher = function () {
                    obj.detachEvent("on" + type, f);
                    return true;
                };
                return detacher;
            };
        }
    })(),
        drag = [],
        dragMove = function (e) {
            var x = e.clientX,
                y = e.clientY,
                scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
                dragi, j = drag.length;
            while (j--) {
                dragi = drag[j];
                if (supportsTouch) {
                    var i = e.touches.length,
                        touch;
                    while (i--) {
                        touch = e.touches[i];
                        if (touch.identifier == dragi.el._drag.id) {
                            x = touch.clientX;
                            y = touch.clientY;
                            (e.originalEvent ? e.originalEvent : e).preventDefault();
                            break;
                        }
                    }
                } else {
                    e.preventDefault();
                }
                var node = dragi.el.node,
                    o, next = node.nextSibling,
                    parent = node.parentNode,
                    display = node.style.display;
                g.win.opera && parent.removeChild(node);
                node.style.display = "none";
                o = dragi.el.paper.getElementByPoint(x, y);
                node.style.display = display;
                g.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
                o && eve("drag.over." + dragi.el.id, dragi.el, o);
                x += scrollX;
                y += scrollY;
                eve("drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
            }
        }, dragUp = function (e) {
            R.unmousemove(dragMove).unmouseup(dragUp);
            var i = drag.length,
                dragi;
            while (i--) {
                dragi = drag[i];
                dragi.el._drag = {};
                eve("drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
            }
            drag = [];
        }, elproto = R.el = {};
    for (var i = events.length; i--;) {
        (function (eventName) {
            R[eventName] = elproto[eventName] = function (fn, scope) {
                if (R.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({
                        name: eventName,
                        f: fn,
                        unbind: addEvent(this.shape || this.node || g.doc, eventName, fn, scope || this)
                    });
                }
                return this;
            };
            R["un" + eventName] = elproto["un" + eventName] = function (fn) {
                var events = this.events,
                    l = events.length;
                while (l--) if (events[l].name == eventName && events[l].f == fn) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    elproto.data = function (key, value) {
        var data = eldata[this.id] = eldata[this.id] || {};
        if (arguments.length == 1) {
            if (R.is(key, "object")) {
                for (var i in key) if (key[has](i)) {
                    this.data(i, key[i]);
                }
                return this;
            }
            eve("data.get." + this.id, this, data[key], key);
            return data[key];
        }
        data[key] = value;
        eve("data.set." + this.id, this, value, key);
        return this;
    };
    elproto.removeData = function (key) {
        if (key == null) {
            eldata[this.id] = {};
        } else {
            eldata[this.id] && delete eldata[this.id][key];
        }
        return this;
    };
    elproto.hover = function (f_in, f_out, scope_in, scope_out) {
        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
    };
    elproto.unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
        function start(e) {
            (e.originalEvent || e).preventDefault();
            var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft;
            this._drag.x = e.clientX + scrollX;
            this._drag.y = e.clientY + scrollY;
            this._drag.id = e.identifier;
            !drag.length && R.mousemove(dragMove).mouseup(dragUp);
            drag.push({
                el: this,
                move_scope: move_scope,
                start_scope: start_scope,
                end_scope: end_scope
            });
            onstart && eve.on("drag.start." + this.id, onstart);
            onmove && eve.on("drag.move." + this.id, onmove);
            onend && eve.on("drag.end." + this.id, onend);
            eve("drag.start." + this.id, start_scope || move_scope || this, e.clientX + scrollX, e.clientY + scrollY, e);
        }
        this._drag = {};
        this.mousedown(start);
        return this;
    };
    elproto.onDragOver = function (f) {
        f ? eve.on("drag.over." + this.id, f) : eve.unbind("drag.over." + this.id);
    };
    elproto.undrag = function () {
        var i = drag.length;
        while (i--) if (drag[i].el == this) {
            R.unmousedown(drag[i].start);
            drag.splice(i++, 1);
            eve.unbind("drag.*." + this.id);
        }!drag.length && R.unmousemove(dragMove).unmouseup(dragUp);
    };
    paperproto.circle = function (x, y, r) {
        var out = R._engine.circle(this, x || 0, y || 0, r || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    paperproto.rect = function (x, y, w, h, r) {
        var out = R._engine.rect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    paperproto.ellipse = function (x, y, rx, ry) {
        var out = R._engine.ellipse(this, x || 0, y || 0, rx || 0, ry || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    paperproto.path = function (pathString) {
        pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
        var out = R._engine.path(R.format[apply](R, arguments), this);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    paperproto.image = function (src, x, y, w, h) {
        var out = R._engine.image(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    paperproto.text = function (x, y, text) {
        var out = R._engine.text(this, x || 0, y || 0, Str(text));
        this.__set__ && this.__set__.push(out);
        return out;
    };
    paperproto.set = function (itemsArray) {
        !R.is(itemsArray, "array") && (itemsArray = Array.prototype.splice.call(arguments, 0, arguments.length));
        var out = new Set(itemsArray);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    paperproto.setStart = function (set) {
        this.__set__ = set || this.set();
    };
    paperproto.setFinish = function (set) {
        var out = this.__set__;
        delete this.__set__;
        return out;
    };
    paperproto.setSize = function (width, height) {
        return R._engine.setSize.call(this, width, height);
    };
    paperproto.setViewBox = function (x, y, w, h, fit) {
        return R._engine.setViewBox.call(this, x, y, w, h, fit);
    };
    paperproto.top = paperproto.bottom = null;
    paperproto.raphael = R;
    var getOffset = function (elem) {
        var box = elem.getBoundingClientRect(),
            doc = elem.ownerDocument,
            body = doc.body,
            docElem = doc.documentElement,
            clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            top = box.top + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop) - clientTop,
            left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
        return {
            y: top,
            x: left
        };
    };
    paperproto.getElementByPoint = function (x, y) {
        var paper = this,
            svg = paper.canvas,
            target = g.doc.elementFromPoint(x, y);
        if (g.win.opera && target.tagName == "svg") {
            var so = getOffset(svg),
                sr = svg.createSVGRect();
            sr.x = x - so.x;
            sr.y = y - so.y;
            sr.width = sr.height = 1;
            var hits = svg.getIntersectionList(sr, null);
            if (hits.length) {
                target = hits[hits.length - 1];
            }
        }
        if (!target) {
            return null;
        }
        while (target.parentNode && target != svg.parentNode && !target.raphael) {
            target = target.parentNode;
        }
        target == paper.canvas.parentNode && (target = svg);
        target = target && target.raphael ? paper.getById(target.raphaelid) : null;
        return target;
    };
    paperproto.getById = function (id) {
        var bot = this.bottom;
        while (bot) {
            if (bot.id == id) {
                return bot;
            }
            bot = bot.next;
        }
        return null;
    };
    paperproto.forEach = function (callback, thisArg) {
        var bot = this.bottom;
        while (bot) {
            if (callback.call(thisArg, bot) === false) {
                return this;
            }
            bot = bot.next;
        }
        return this;
    };

    function x_y() {
        return this.x + S + this.y;
    }

    function x_y_w_h() {
        return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
    }
    elproto.getBBox = function (isWithoutTransform) {
        if (this.removed) {
            return {};
        }
        var _ = this._;
        if (isWithoutTransform) {
            if (_.dirty || !_.bboxwt) {
                this.realPath = getPath[this.type](this);
                _.bboxwt = pathDimensions(this.realPath);
                _.bboxwt.toString = x_y_w_h;
                _.dirty = 0;
            }
            return _.bboxwt;
        }
        if (_.dirty || _.dirtyT || !_.bbox) {
            if (_.dirty || !this.realPath) {
                _.bboxwt = 0;
                this.realPath = getPath[this.type](this);
            }
            _.bbox = pathDimensions(mapPath(this.realPath, this.matrix));
            _.bbox.toString = x_y_w_h;
            _.dirty = _.dirtyT = 0;
        }
        return _.bbox;
    };
    elproto.clone = function () {
        if (this.removed) {
            return null;
        }
        var out = this.paper[this.type]().attr(this.attr());
        this.__set__ && this.__set__.push(out);
        return out;
    };
    elproto.glow = function (glow) {
        if (this.type == "text") {
            return null;
        }
        glow = glow || {};
        var s = {
            width: (glow.width || 10) + (+this.attr("stroke-width") || 1),
            fill: glow.fill || false,
            opacity: glow.opacity || .5,
            offsetx: glow.offsetx || 0,
            offsety: glow.offsety || 0,
            color: glow.color || "#000"
        }, c = s.width / 2,
            r = this.paper,
            out = r.set(),
            path = this.realPath || getPath[this.type](this);
        path = this.matrix ? mapPath(path, this.matrix) : path;
        for (var i = 1; i < c + 1; i++) {
            out.push(r.path(path).attr({
                stroke: s.color,
                fill: s.fill ? s.color : "none",
                "stroke-linejoin": "round",
                "stroke-linecap": "round",
                "stroke-width": +(s.width / c * i).toFixed(3),
                opacity: +(s.opacity / c).toFixed(3)
            }));
        }
        return out.insertBefore(this).translate(s.offsetx, s.offsety);
    };
    var curveslengths = {}, getPointAtSegmentLength = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        var len = 0,
            precision = 100,
            name = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y].join(),
            cache = curveslengths[name],
            old, dot;
        !cache && (curveslengths[name] = cache = {
            data: []
        });
        cache.timer && clearTimeout(cache.timer);
        cache.timer = setTimeout(function () {
            delete curveslengths[name];
        }, 2e3);
        if (length != null && !cache.precision) {
            var total = getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
            cache.precision = ~~total * 10;
            cache.data = [];
        }
        precision = cache.precision || precision;
        for (var i = 0; i < precision + 1; i++) {
            if (cache.data[i * precision]) {
                dot = cache.data[i * precision];
            } else {
                dot = R.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i / precision);
                cache.data[i * precision] = dot;
            }
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            if (length != null && len >= length) {
                return dot;
            }
            old = dot;
        }
        if (length == null) {
            return len;
        }
    }, getLengthFactory = function (istotal, subpath) {
        return function (path, length, onlystart) {
            path = path2curve(path);
            var x, y, p, l, sp = "",
                subpaths = {}, point, len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += ["C" + point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
                            if (onlystart) {
                                return sp;
                            }
                            subpaths.start = sp;
                            sp = ["M" + point.x, point.y + "C" + point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]].join();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return {
                                x: point.x,
                                y: point.y,
                                alpha: point.alpha
                            };
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p.shift() + p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
            point.alpha && (point = {
                x: point.x,
                y: point.y,
                alpha: point.alpha
            });
            return point;
        };
    };
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    R.getTotalLength = getTotalLength;
    R.getPointAtLength = getPointAtLength;
    R.getSubpath = function (path, from, to) {
        if (this.getTotalLength(path) - to < 1e-6) {
            return getSubpathsAtLength(path, from).end;
        }
        var a = getSubpathsAtLength(path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };
    elproto.getTotalLength = function () {
        if (this.type != "path") {
            return;
        }
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
        return getTotalLength(this.attrs.path);
    };
    elproto.getPointAtLength = function (length) {
        if (this.type != "path") {
            return;
        }
        return getPointAtLength(this.attrs.path, length);
    };
    elproto.getSubpath = function (from, to) {
        if (this.type != "path") {
            return;
        }
        return R.getSubpath(this.attrs.path, from, to);
    };
    var ef = R.easing_formulas = {
        linear: function (n) {
            return n;
        },
        "<": function (n) {
            return pow(n, 1.7);
        },
        ">": function (n) {
            return pow(n, .48);
        },
        "<>": function (n) {
            var q = .48 - n / 1.04,
                Q = math.sqrt(.1734 + q * q),
                x = Q - q,
                X = pow(abs(x), 1 / 3) * (x < 0 ? -1 : 1),
                y = -Q - q,
                Y = pow(abs(y), 1 / 3) * (y < 0 ? -1 : 1),
                t = X + Y + .5;
            return (1 - t) * 3 * t * t + t * t * t;
        },
        backIn: function (n) {
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut: function (n) {
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic: function (n) {
            if (n == !! n) {
                return n;
            }
            return pow(2, - 10 * n) * math.sin((n - .075) * (2 * PI) / .3) + 1;
        },
        bounce: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + .75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + .9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        }
    };
    ef.easeIn = ef["ease-in"] = ef["<"];
    ef.easeOut = ef["ease-out"] = ef[">"];
    ef.easeInOut = ef["ease-in-out"] = ef["<>"];
    ef["back-in"] = ef.backIn;
    ef["back-out"] = ef.backOut;
    var animationElements = [],
        requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            setTimeout(callback, 16);
        }, animation = function () {
            var Now = +new Date,
                l = 0;
            for (; l < animationElements.length; l++) {
                var e = animationElements[l];
                if (e.el.removed || e.paused) {
                    continue;
                }
                var time = Now - e.start,
                    ms = e.ms,
                    easing = e.easing,
                    from = e.from,
                    diff = e.diff,
                    to = e.to,
                    t = e.t,
                    that = e.el,
                    set = {}, now, init = {}, key;
                if (e.initstatus) {
                    time = (e.initstatus * e.anim.top - e.prev) / (e.percent - e.prev) * ms;
                    e.status = e.initstatus;
                    delete e.initstatus;
                    e.stop && animationElements.splice(l--, 1);
                } else {
                    e.status = (e.prev + (e.percent - e.prev) * (time / ms)) / e.anim.top;
                }
                if (time < 0) {
                    continue;
                }
                if (time < ms) {
                    var pos = easing(time / ms);
                    for (var attr in from) if (from[has](attr)) {
                        switch (availableAnimAttrs[attr]) {
                        case nu:
                            now = +from[attr] + pos * ms * diff[attr];
                            break;
                        case "colour":
                            now = "rgb(" + [upto255(round(from[attr].r + pos * ms * diff[attr].r)), upto255(round(from[attr].g + pos * ms * diff[attr].g)), upto255(round(from[attr].b + pos * ms * diff[attr].b))].join(",") + ")";
                            break;
                        case "path":
                            now = [];
                            for (var i = 0, ii = from[attr].length; i < ii; i++) {
                                now[i] = [from[attr][i][0]];
                                for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
                                    now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                }
                                now[i] = now[i].join(S);
                            }
                            now = now.join(S);
                            break;
                        case "transform":
                            if (diff[attr].real) {
                                now = [];
                                for (i = 0, ii = from[attr].length; i < ii; i++) {
                                    now[i] = [from[attr][i][0]];
                                    for (j = 1, jj = from[attr][i].length; j < jj; j++) {
                                        now[i][j] = from[attr][i][j] + pos * ms * diff[attr][i][j];
                                    }
                                }
                            } else {
                                var get = function (i) {
                                    return +from[attr][i] + pos * ms * diff[attr][i];
                                };
                                now = [
                                    ["m", get(0), get(1), get(2), get(3), get(4), get(5)]
                                ];
                            }
                            break;
                        case "csv":
                            if (attr == "clip-rect") {
                                now = [];
                                i = 4;
                                while (i--) {
                                    now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                }
                            }
                            break;
                        default:
                            var from2 = [][concat](from[attr]);
                            now = [];
                            i = that.paper.customAttributes[attr].length;
                            while (i--) {
                                now[i] = +from2[i] + pos * ms * diff[attr][i];
                            }
                            break;
                        }
                        set[attr] = now;
                    }
                    that.attr(set);
                    (function (id, that, anim) {
                        setTimeout(function () {
                            eve("anim.frame." + id, that, anim);
                        });
                    })(that.id, that, e.anim);
                } else {
                    (function (f, el, a) {
                        setTimeout(function () {
                            eve("anim.frame." + el.id, el, a);
                            eve("anim.finish." + el.id, el, a);
                            R.is(f, "function") && f.call(el);
                        });
                    })(e.callback, that, e.anim);
                    that.attr(to);
                    animationElements.splice(l--, 1);
                    if (e.repeat > 1 && !e.next) {
                        for (key in to) if (to[has](key)) {
                            init[key] = e.totalOrigin[key];
                        }
                        e.el.attr(init);
                        runAnimation(e.anim, e.el, e.anim.percents[0], null, e.totalOrigin, e.repeat - 1);
                    }
                    if (e.next && !e.stop) {
                        runAnimation(e.anim, e.el, e.next, null, e.totalOrigin, e.repeat);
                    }
                }
            }
            R.svg && that && that.paper && that.paper.safari();
            animationElements.length && requestAnimFrame(animation);
        }, upto255 = function (color) {
            return color > 255 ? 255 : color < 0 ? 0 : color;
        };
    elproto.animateWith = function (element, anim, params, ms, easing, callback) {
        var a = params ? R.animation(params, ms, easing, callback) : anim;
        status = element.status(anim);
        return this.animate(a).status(a, status * anim.ms / a.ms);
    };

    function CubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
        var cx = 3 * p1x,
            bx = 3 * (p2x - p1x) - cx,
            ax = 1 - cx - bx,
            cy = 3 * p1y,
            by = 3 * (p2y - p1y) - cy,
            ay = 1 - cy - by;

        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx) * t;
        }

        function solve(x, epsilon) {
            var t = solveCurveX(x, epsilon);
            return ((ay * t + by) * t + cy) * t;
        }

        function solveCurveX(x, epsilon) {
            var t0, t1, t2, x2, d2, i;
            for (t2 = x, i = 0; i < 8; i++) {
                x2 = sampleCurveX(t2) - x;
                if (abs(x2) < epsilon) {
                    return t2;
                }
                d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
                if (abs(d2) < 1e-6) {
                    break;
                }
                t2 = t2 - x2 / d2;
            }
            t0 = 0;
            t1 = 1;
            t2 = x;
            if (t2 < t0) {
                return t0;
            }
            if (t2 > t1) {
                return t1;
            }
            while (t0 < t1) {
                x2 = sampleCurveX(t2);
                if (abs(x2 - x) < epsilon) {
                    return t2;
                }
                if (x > x2) {
                    t0 = t2;
                } else {
                    t1 = t2;
                }
                t2 = (t1 - t0) / 2 + t0;
            }
            return t2;
        }
        return solve(t, 1 / (200 * duration));
    }
    elproto.onAnimation = function (f) {
        f ? eve.on("anim.frame." + this.id, f) : eve.unbind("anim.frame." + this.id);
        return this;
    };

    function Animation(anim, ms) {
        var percents = [],
            newAnim = {};
        this.ms = ms;
        this.times = 1;
        if (anim) {
            for (var attr in anim) if (anim[has](attr)) {
                newAnim[toFloat(attr)] = anim[attr];
                percents.push(toFloat(attr));
            }
            percents.sort(sortByNumber);
        }
        this.anim = newAnim;
        this.top = percents[percents.length - 1];
        this.percents = percents;
    }
    Animation.prototype.delay = function (delay) {
        var a = new Animation(this.anim, this.ms);
        a.times = this.times;
        a.del = +delay || 0;
        return a;
    };
    Animation.prototype.repeat = function (times) {
        var a = new Animation(this.anim, this.ms);
        a.del = this.del;
        a.times = math.floor(mmax(times, 0)) || 1;
        return a;
    };

    function runAnimation(anim, element, percent, status, totalOrigin, times) {
        percent = toFloat(percent);
        var params, isInAnim, isInAnimSet, percents = [],
            next, prev, timestamp, ms = anim.ms,
            from = {}, to = {}, diff = {};
        if (status) {
            for (i = 0, ii = animationElements.length; i < ii; i++) {
                var e = animationElements[i];
                if (e.el.id == element.id && e.anim == anim) {
                    if (e.percent != percent) {
                        animationElements.splice(i, 1);
                        isInAnimSet = 1;
                    } else {
                        isInAnim = e;
                    }
                    element.attr(e.totalOrigin);
                    break;
                }
            }
        } else {
            status = +to;
        }
        for (var i = 0, ii = anim.percents.length; i < ii; i++) {
            if (anim.percents[i] == percent || anim.percents[i] > status * anim.top) {
                percent = anim.percents[i];
                prev = anim.percents[i - 1] || 0;
                ms = ms / anim.top * (percent - prev);
                next = anim.percents[i + 1];
                params = anim.anim[percent];
                break;
            } else if (status) {
                element.attr(anim.anim[anim.percents[i]]);
            }
        }
        if (!params) {
            return;
        }
        if (!isInAnim) {
            for (attr in params) if (params[has](attr)) {
                if (availableAnimAttrs[has](attr) || element.paper.customAttributes[has](attr)) {
                    from[attr] = element.attr(attr);
                    (from[attr] == null) && (from[attr] = availableAttrs[attr]);
                    to[attr] = params[attr];
                    switch (availableAnimAttrs[attr]) {
                    case nu:
                        diff[attr] = (to[attr] - from[attr]) / ms;
                        break;
                    case "colour":
                        from[attr] = R.getRGB(from[attr]);
                        var toColour = R.getRGB(to[attr]);
                        diff[attr] = {
                            r: (toColour.r - from[attr].r) / ms,
                            g: (toColour.g - from[attr].g) / ms,
                            b: (toColour.b - from[attr].b) / ms
                        };
                        break;
                    case "path":
                        var pathes = path2curve(from[attr], to[attr]),
                            toPath = pathes[1];
                        from[attr] = pathes[0];
                        diff[attr] = [];
                        for (i = 0, ii = from[attr].length; i < ii; i++) {
                            diff[attr][i] = [0];
                            for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
                                diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                            }
                        }
                        break;
                    case "transform":
                        var _ = element._,
                            eq = equaliseTransform(_[attr], to[attr]);
                        if (eq) {
                            from[attr] = eq.from;
                            to[attr] = eq.to;
                            diff[attr] = [];
                            diff[attr].real = true;
                            for (i = 0, ii = from[attr].length; i < ii; i++) {
                                diff[attr][i] = [from[attr][i][0]];
                                for (j = 1, jj = from[attr][i].length; j < jj; j++) {
                                    diff[attr][i][j] = (to[attr][i][j] - from[attr][i][j]) / ms;
                                }
                            }
                        } else {
                            var m = (element.matrix || new Matrix),
                                to2 = {
                                    _: {
                                        transform: _.transform
                                    },
                                    getBBox: function () {
                                        return element.getBBox(1);
                                    }
                                };
                            from[attr] = [m.a, m.b, m.c, m.d, m.e, m.f];
                            extractTransform(to2, to[attr]);
                            to[attr] = to2._.transform;
                            diff[attr] = [(to2.matrix.a - m.a) / ms, (to2.matrix.b - m.b) / ms, (to2.matrix.c - m.c) / ms, (to2.matrix.d - m.d) / ms, (to2.matrix.e - m.e) / ms, (to2.matrix.e - m.f) / ms];
                        }
                        break;
                    case "csv":
                        var values = Str(params[attr])[split](separator),
                            from2 = Str(from[attr])[split](separator);
                        if (attr == "clip-rect") {
                            from[attr] = from2;
                            diff[attr] = [];
                            i = from2.length;
                            while (i--) {
                                diff[attr][i] = (values[i] - from[attr][i]) / ms;
                            }
                        }
                        to[attr] = values;
                        break;
                    default:
                        values = [][concat](params[attr]);
                        from2 = [][concat](from[attr]);
                        diff[attr] = [];
                        i = element.paper.customAttributes[attr].length;
                        while (i--) {
                            diff[attr][i] = ((values[i] || 0) - (from2[i] || 0)) / ms;
                        }
                        break;
                    }
                }
            }
            var easing = params.easing,
                easyeasy = R.easing_formulas[easing];
            if (!easyeasy) {
                easyeasy = Str(easing).match(bezierrg);
                if (easyeasy && easyeasy.length == 5) {
                    var curve = easyeasy;
                    easyeasy = function (t) {
                        return CubicBezierAtTime(t, + curve[1], + curve[2], + curve[3], + curve[4], ms);
                    };
                } else {
                    easyeasy = pipe;
                }
            }
            timestamp = params.start || anim.start || +new Date;
            e = {
                anim: anim,
                percent: percent,
                timestamp: timestamp,
                start: timestamp + (anim.del || 0),
                status: 0,
                initstatus: status || 0,
                stop: false,
                ms: ms,
                easing: easyeasy,
                from: from,
                diff: diff,
                to: to,
                el: element,
                callback: params.callback,
                prev: prev,
                next: next,
                repeat: times || anim.times,
                origin: element.attr(),
                totalOrigin: totalOrigin
            };
            animationElements.push(e);
            if (status && !isInAnim && !isInAnimSet) {
                e.stop = true;
                e.start = new Date - ms * status;
                if (animationElements.length == 1) {
                    return animation();
                }
            }
            if (isInAnimSet) {
                e.start = new Date - e.ms * status;
            }
            animationElements.length == 1 && requestAnimFrame(animation);
        } else {
            isInAnim.initstatus = status;
            isInAnim.start = new Date - isInAnim.ms * status;
        }
        eve("anim.start." + element.id, element, anim);
    }
    R.animation = function (params, ms, easing, callback) {
        if (params instanceof Animation) {
            return params;
        }
        if (R.is(easing, "function") || !easing) {
            callback = callback || easing || null;
            easing = null;
        }
        params = Object(params);
        ms = +ms || 0;
        var p = {}, json, attr;
        for (attr in params) if (params[has](attr) && toFloat(attr) != attr && toFloat(attr) + "%" != attr) {
            json = true;
            p[attr] = params[attr];
        }
        if (!json) {
            return new Animation(params, ms);
        } else {
            easing && (p.easing = easing);
            callback && (p.callback = callback);
            return new Animation({
                100: p
            }, ms);
        }
    };
    elproto.animate = function (params, ms, easing, callback) {
        var element = this;
        if (element.removed) {
            callback && callback.call(element);
            return element;
        }
        var anim = params instanceof Animation ? params : R.animation(params, ms, easing, callback);
        runAnimation(anim, element, anim.percents[0], null, element.attr());
        return element;
    };
    elproto.setTime = function (anim, value) {
        if (anim && value != null) {
            this.status(anim, mmin(value, anim.ms) / anim.ms);
        }
        return this;
    };
    elproto.status = function (anim, value) {
        var out = [],
            i = 0,
            len, e;
        if (value != null) {
            runAnimation(anim, this, - 1, mmin(value, 1));
            return this;
        } else {
            len = animationElements.length;
            for (; i < len; i++) {
                e = animationElements[i];
                if (e.el.id == this.id && (!anim || e.anim == anim)) {
                    if (anim) {
                        return e.status;
                    }
                    out.push({
                        anim: e.anim,
                        status: e.status
                    });
                }
            }
            if (anim) {
                return 0;
            }
            return out;
        }
    };
    elproto.pause = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            if (eve("anim.pause." + this.id, this, animationElements[i].anim) !== false) {
                animationElements[i].paused = true;
            }
        }
        return this;
    };
    elproto.resume = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            var e = animationElements[i];
            if (eve("anim.resume." + this.id, this, e.anim) !== false) {
                delete e.paused;
                this.status(e.anim, e.status);
            }
        }
        return this;
    };
    elproto.stop = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            if (eve("anim.stop." + this.id, this, animationElements[i].anim) !== false) {
                animationElements.splice(i--, 1);
            }
        }
        return this;
    };
    elproto.toString = function () {
        return "Rapha\xebl\u2019s object";
    };
    var Set = function (items) {
        this.items = [];
        this.length = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items.length; i < ii; i++) {
                if (items[i] && (items[i].constructor == elproto.constructor || items[i].constructor == Set)) {
                    this[this.items.length] = this.items[this.items.length] = items[i];
                    this.length++;
                }
            }
        }
    }, setproto = Set.prototype;
    setproto.push = function () {
        var item, len;
        for (var i = 0, ii = arguments.length; i < ii; i++) {
            item = arguments[i];
            if (item && (item.constructor == elproto.constructor || item.constructor == Set)) {
                len = this.items.length;
                this[len] = this.items[len] = item;
                this.length++;
            }
        }
        return this;
    };
    setproto.pop = function () {
        this.length && delete this[this.length--];
        return this.items.pop();
    };
    setproto.forEach = function (callback, thisArg) {
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            if (callback.call(thisArg, this.items[i], i) === false) {
                return this;
            }
        }
        return this;
    };
    for (var method in elproto) if (elproto[has](method)) {
        setproto[method] = (function (methodname) {
            return function () {
                var arg = arguments;
                return this.forEach(function (el) {
                    el[methodname][apply](el, arg);
                });
            };
        })(method);
    }
    setproto.attr = function (name, value) {
        if (name && R.is(name, array) && R.is(name[0], "object")) {
            for (var j = 0, jj = name.length; j < jj; j++) {
                this.items[j].attr(name[j]);
            }
        } else {
            for (var i = 0, ii = this.items.length; i < ii; i++) {
                this.items[i].attr(name, value);
            }
        }
        return this;
    };
    setproto.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
    setproto.splice = function (index, count, insertion) {
        index = index < 0 ? mmax(this.length + index, 0) : index;
        count = mmax(0, mmin(this.length - index, count));
        var tail = [],
            todel = [],
            args = [],
            i;
        for (i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        for (i = 0; i < count; i++) {
            todel.push(this[index + i]);
        }
        for (; i < this.length - index; i++) {
            tail.push(this[index + i]);
        }
        var arglen = args.length;
        for (i = 0; i < arglen + tail.length; i++) {
            this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
        }
        i = this.items.length = this.length -= count - arglen;
        while (this[i]) {
            delete this[i++];
        }
        return new Set(todel);
    };
    setproto.exclude = function (el) {
        for (var i = 0, ii = this.length; i < ii; i++) if (this[i] == el) {
            this.splice(i, 1);
            return true;
        }
    };
    setproto.animate = function (params, ms, easing, callback) {
        (R.is(easing, "function") || !easing) && (callback = easing || null);
        var len = this.items.length,
            i = len,
            item, set = this,
            collector;
        if (!len) {
            return this;
        }
        callback && (collector = function () {
            !--len && callback.call(set);
        });
        easing = R.is(easing, string) ? easing : collector;
        var anim = R.animation(params, ms, easing, collector);
        item = this.items[--i].animate(anim);
        while (i--) {
            this.items[i] && !this.items[i].removed && this.items[i].animateWith(item, anim);
        }
        return this;
    };
    setproto.insertAfter = function (el) {
        var i = this.items.length;
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    setproto.getBBox = function () {
        var x = [],
            y = [],
            w = [],
            h = [];
        for (var i = this.items.length; i--;) if (!this.items[i].removed) {
            var box = this.items[i].getBBox();
            x.push(box.x);
            y.push(box.y);
            w.push(box.x + box.width);
            h.push(box.y + box.height);
        }
        x = mmin[apply](0, x);
        y = mmin[apply](0, y);
        return {
            x: x,
            y: y,
            width: mmax[apply](0, w) - x,
            height: mmax[apply](0, h) - y
        };
    };
    setproto.clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            s.push(this.items[i].clone());
        }
        return s;
    };
    setproto.toString = function () {
        return "Rapha\xebl\u2018s set";
    };
    R.registerFont = function (font) {
        if (!font.face) {
            return font;
        }
        this.fonts = this.fonts || {};
        var fontcopy = {
            w: font.w,
            face: {},
            glyphs: {}
        }, family = font.face["font-family"];
        for (var prop in font.face) if (font.face[has](prop)) {
            fontcopy.face[prop] = font.face[prop];
        }
        if (this.fonts[family]) {
            this.fonts[family].push(fontcopy);
        } else {
            this.fonts[family] = [fontcopy];
        }
        if (!font.svg) {
            fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
            for (var glyph in font.glyphs) if (font.glyphs[has](glyph)) {
                var path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {},
                    d: path.d && "M" + path.d.replace(/[mlcxtrv]/g, function (command) {
                        return {
                            l: "L",
                            c: "C",
                            x: "z",
                            t: "m",
                            r: "l",
                            v: "c"
                        }[command] || "M";
                    }) + "z"
                };
                if (path.k) {
                    for (var k in path.k) if (path[has](k)) {
                        fontcopy.glyphs[glyph].k[k] = path.k[k];
                    }
                }
            }
        }
        return font;
    };
    paperproto.getFont = function (family, weight, style, stretch) {
        stretch = stretch || "normal";
        style = style || "normal";
        weight = +weight || {
            normal: 400,
            bold: 700,
            lighter: 300,
            bolder: 800
        }[weight] || 400;
        if (!R.fonts) {
            return;
        }
        var font = R.fonts[family];
        if (!font) {
            var name = new RegExp("(^|\\s)" + family.replace(/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
            for (var fontName in R.fonts) if (R.fonts[has](fontName)) {
                if (name.test(fontName)) {
                    font = R.fonts[fontName];
                    break;
                }
            }
        }
        var thefont;
        if (font) {
            for (var i = 0, ii = font.length; i < ii; i++) {
                thefont = font[i];
                if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                    break;
                }
            }
        }
        return thefont;
    };
    paperproto.print = function (x, y, string, font, size, origin, letter_spacing) {
        origin = origin || "middle";
        letter_spacing = mmax(mmin(letter_spacing || 0, 1), - 1);
        var out = this.set(),
            letters = Str(string)[split](E),
            shift = 0,
            path = E,
            scale;
        R.is(font, string) && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face["units-per-em"];
            var bb = font.face.bbox[split](separator),
                top = +bb[0],
                height = +bb[1] + (origin == "baseline" ? bb[3] - bb[1] + (+font.face.descent) : (bb[3] - bb[1]) / 2);
            for (var i = 0, ii = letters.length; i < ii; i++) {
                var prev = i && font.glyphs[letters[i - 1]] || {}, curr = font.glyphs[letters[i]];
                shift += i ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) + (font.w * letter_spacing) : 0;
                curr && curr.d && out.push(this.path(curr.d).attr({
                    fill: "#000",
                    stroke: "none",
                    transform: [
                        ["t", shift * scale, 0]
                    ]
                }));
            }
            out.transform(["...s", scale, scale, top, height, "t", (x - top) / scale, (y - height) / scale]);
        }
        return out;
    };
    R.format = function (token, params) {
        var args = R.is(params, array) ? [0][concat](params) : arguments;
        token && R.is(token, string) && args.length - 1 && (token = token.replace(formatrg, function (str, i) {
            return args[++i] == null ? E : args[i];
        }));
        return token || E;
    };
    R.fullfill = (function () {
        var tokenRegex = /\{([^\}]+)\}/g,
            objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
            replacer = function (all, key, obj) {
                var res = obj;
                key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                    name = name || quotedName;
                    if (res) {
                        if (name in res) {
                            res = res[name];
                        }
                        typeof res == "function" && isFunc && (res = res());
                    }
                });
                res = (res == null || res == obj ? all : res) + "";
                return res;
            };
        return function (str, obj) {
            return String(str).replace(tokenRegex, function (all, key) {
                return replacer(all, key, obj);
            });
        };
    })();
    R.ninja = function () {
        oldRaphael.was ? (g.win.Raphael = oldRaphael.is) : delete Raphael;
        return R;
    };
    R.st = setproto;
    (function (doc, loaded, f) {
        if (doc.readyState == null && doc.addEventListener) {
            doc.addEventListener(loaded, f = function () {
                doc.removeEventListener(loaded, f, false);
                doc.readyState = "complete";
            }, false);
            doc.readyState = "loading";
        }

        function isLoaded() {
            (/in/).test(doc.readyState) ? setTimeout(isLoaded, 9) : R.eve("DOMload");
        }
        isLoaded();
    })(document, "DOMContentLoaded");
    oldRaphael.was ? (g.win.Raphael = R) : (Raphael = R);
    eve.on("DOMload", function () {
        loaded = true;
    });
})();
window.Raphael.svg && function (R) {
    var has = "hasOwnProperty",
        Str = String,
        toFloat = parseFloat,
        toInt = parseInt,
        math = Math,
        mmax = math.max,
        abs = math.abs,
        pow = math.pow,
        separator = /[, ]+/,
        eve = R.eve,
        E = "",
        S = " ";
    var xlink = "http://www.w3.org/1999/xlink",
        markers = {
            block: "M5,0 0,2.5 5,5z",
            classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
            diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
            open: "M6,1 1,3.5 6,6",
            oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
        }, markerCounter = {};
    R.toString = function () {
        return "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
    };
    var $ = function (el, attr) {
        if (attr) {
            if (typeof el == "string") {
                el = $(el);
            }
            for (var key in attr) if (attr[has](key)) {
                if (key.substring(0, 6) == "xlink:") {
                    el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
                } else {
                    el.setAttribute(key, Str(attr[key]));
                }
            }
        } else {
            el = R._g.doc.createElementNS("http://www.w3.org/2000/svg", el);
            el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
        }
        return el;
    }, gradients = {}, rgGrad = /^url\(#(.*)\)$/,
        removeGradientFill = function (node, paper) {
            var oid = node.getAttribute("fill");
            oid = oid && oid.match(rgGrad);
            if (oid && !--gradients[oid[1]]) {
                delete gradients[oid[1]];
                paper.defs.removeChild(R._g.doc.getElementById(oid[1]));
            }
        }, addGradientFill = function (element, gradient) {
            var type = "linear",
                id = element.id + gradient,
                fx = .5,
                fy = .5,
                o = element.node,
                SVG = element.paper,
                s = o.style,
                el = R._g.doc.getElementById(id);
            if (!el) {
                gradient = Str(gradient).replace(R._radial_gradient, function (all, _fx, _fy) {
                    type = "radial";
                    if (_fx && _fy) {
                        fx = toFloat(_fx);
                        fy = toFloat(_fy);
                        var dir = ((fy > .5) * 2 - 1);
                        pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) && fy != .5 && (fy = fy.toFixed(5) - 1e-5 * dir);
                    }
                    return E;
                });
                gradient = gradient.split(/\s*\-\s*/);
                if (type == "linear") {
                    var angle = gradient.shift();
                    angle = -toFloat(angle);
                    if (isNaN(angle)) {
                        return null;
                    }
                    var vector = [0, 0, math.cos(R.rad(angle)), math.sin(R.rad(angle))],
                        max = 1 / (mmax(abs(vector[2]), abs(vector[3])) || 1);
                    vector[2] *= max;
                    vector[3] *= max;
                    if (vector[2] < 0) {
                        vector[0] = -vector[2];
                        vector[2] = 0;
                    }
                    if (vector[3] < 0) {
                        vector[1] = -vector[3];
                        vector[3] = 0;
                    }
                }
                var dots = R._parseDots(gradient);
                if (!dots) {
                    return null;
                }
                if (element.gradient) {
                    SVG.defs.removeChild(element.gradient);
                    delete element.gradient;
                }
                id = id.replace(/[\(\)\s,\xb0#]/g, "-");
                el = $(type + "Gradient", {
                    id: id
                });
                element.gradient = el;
                $(el, type == "radial" ? {
                    fx: fx,
                    fy: fy
                } : {
                    x1: vector[0],
                    y1: vector[1],
                    x2: vector[2],
                    y2: vector[3],
                    gradientTransform: element.matrix.invert()
                });
                SVG.defs.appendChild(el);
                for (var i = 0, ii = dots.length; i < ii; i++) {
                    el.appendChild($("stop", {
                        offset: dots[i].offset ? dots[i].offset : i ? "100%" : "0%",
                        "stop-color": dots[i].color || "#fff"
                    }));
                }
            }
            $(o, {
                fill: "url(#" + id + ")",
                opacity: 1,
                "fill-opacity": 1
            });
            s.fill = E;
            s.opacity = 1;
            s.fillOpacity = 1;
            return 1;
        }, updatePosition = function (o) {
            var bbox = o.getBBox(1);
            $(o.pattern, {
                patternTransform: o.matrix.invert() + " translate(" + bbox.x + "," + bbox.y + ")"
            });
        }, addArrow = function (o, value, isEnd) {
            if (o.type == "path") {
                var values = Str(value).toLowerCase().split("-"),
                    p = o.paper,
                    se = isEnd ? "end" : "start",
                    node = o.node,
                    attrs = o.attrs,
                    stroke = attrs["stroke-width"],
                    i = values.length,
                    type = "classic",
                    from, to, dx, refX, attr, w = 3,
                    h = 3,
                    t = 5;
                while (i--) {
                    switch (values[i]) {
                    case "block":
                    case "classic":
                    case "oval":
                    case "diamond":
                    case "open":
                    case "none":
                        type = values[i];
                        break;
                    case "wide":
                        h = 5;
                        break;
                    case "narrow":
                        h = 2;
                        break;
                    case "long":
                        w = 5;
                        break;
                    case "short":
                        w = 2;
                        break;
                    }
                }
                if (type == "open") {
                    w += 2;
                    h += 2;
                    t += 2;
                    dx = 1;
                    refX = isEnd ? 4 : 1;
                    attr = {
                        fill: "none",
                        stroke: attrs.stroke
                    };
                } else {
                    refX = dx = w / 2;
                    attr = {
                        fill: attrs.stroke,
                        stroke: "none"
                    };
                }
                if (o._.arrows) {
                    if (isEnd) {
                        o._.arrows.endPath && markerCounter[o._.arrows.endPath]--;
                        o._.arrows.endMarker && markerCounter[o._.arrows.endMarker]--;
                    } else {
                        o._.arrows.startPath && markerCounter[o._.arrows.startPath]--;
                        o._.arrows.startMarker && markerCounter[o._.arrows.startMarker]--;
                    }
                } else {
                    o._.arrows = {};
                }
                if (type != "none") {
                    var pathId = "raphael-marker-" + type,
                        markerId = "raphael-marker-" + se + type + w + h;
                    if (!R._g.doc.getElementById(pathId)) {
                        p.defs.appendChild($($("path"), {
                            "stroke-linecap": "round",
                            d: markers[type],
                            id: pathId
                        }));
                        markerCounter[pathId] = 1;
                    } else {
                        markerCounter[pathId]++;
                    }
                    var marker = R._g.doc.getElementById(markerId),
                        use;
                    if (!marker) {
                        marker = $($("marker"), {
                            id: markerId,
                            markerHeight: h,
                            markerWidth: w,
                            orient: "auto",
                            refX: refX,
                            refY: h / 2
                        });
                        use = $($("use"), {
                            "xlink:href": "#" + pathId,
                            transform: (isEnd ? " rotate(180 " + w / 2 + " " + h / 2 + ") " : S) + "scale(" + w / t + "," + h / t + ")",
                            "stroke-width": 1 / ((w / t + h / t) / 2)
                        });
                        marker.appendChild(use);
                        p.defs.appendChild(marker);
                        markerCounter[markerId] = 1;
                    } else {
                        markerCounter[markerId]++;
                        use = marker.getElementsByTagName("use")[0];
                    }
                    $(use, attr);
                    var delta = dx * (type != "diamond" && type != "oval");
                    if (isEnd) {
                        from = o._.arrows.startdx * stroke || 0;
                        to = R.getTotalLength(attrs.path) - delta * stroke;
                    } else {
                        from = delta * stroke;
                        to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                    }
                    attr = {};
                    attr["marker-" + se] = "url(#" + markerId + ")";
                    if (to || from) {
                        attr.d = Raphael.getSubpath(attrs.path, from, to);
                    }
                    $(node, attr);
                    o._.arrows[se + "Path"] = pathId;
                    o._.arrows[se + "Marker"] = markerId;
                    o._.arrows[se + "dx"] = delta;
                    o._.arrows[se + "Type"] = type;
                    o._.arrows[se + "String"] = value;
                } else {
                    if (isEnd) {
                        from = o._.arrows.startdx * stroke || 0;
                        to = R.getTotalLength(attrs.path) - from;
                    } else {
                        from = 0;
                        to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                    }
                    o._.arrows[se + "Path"] && $(node, {
                        d: Raphael.getSubpath(attrs.path, from, to)
                    });
                    delete o._.arrows[se + "Path"];
                    delete o._.arrows[se + "Marker"];
                    delete o._.arrows[se + "dx"];
                    delete o._.arrows[se + "Type"];
                    delete o._.arrows[se + "String"];
                }
                for (attr in markerCounter) if (markerCounter[has](attr) && !markerCounter[attr]) {
                    var item = R._g.doc.getElementById(attr);
                    item && item.parentNode.removeChild(item);
                }
            }
        }, dasharray = {
            "": [0],
            "none": [0],
            "-": [3, 1],
            ".": [1, 1],
            "-.": [3, 1, 1, 1],
            "-..": [3, 1, 1, 1, 1, 1],
            ". ": [1, 3],
            "- ": [4, 3],
            "--": [8, 3],
            "- .": [4, 3, 1, 3],
            "--.": [8, 3, 1, 3],
            "--..": [8, 3, 1, 3, 1, 3]
        }, addDashes = function (o, value, params) {
            value = dasharray[Str(value).toLowerCase()];
            if (value) {
                var width = o.attrs["stroke-width"] || "1",
                    butt = {
                        round: width,
                        square: width,
                        butt: 0
                    }[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                    dashes = [],
                    i = value.length;
                while (i--) {
                    dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
                }
                $(o.node, {
                    "stroke-dasharray": dashes.join(",")
                });
            }
        }, setFillAndStroke = function (o, params) {
            var node = o.node,
                attrs = o.attrs,
                vis = node.style.visibility;
            node.style.visibility = "hidden";
            for (var att in params) {
                if (params[has](att)) {
                    if (!R._availableAttrs[has](att)) {
                        continue;
                    }
                    var value = params[att];
                    attrs[att] = value;
                    switch (att) {
                    case "blur":
                        o.blur(value);
                        break;
                    case "href":
                    case "title":
                    case "target":
                        var pn = node.parentNode;
                        if (pn.tagName.toLowerCase() != "a") {
                            var hl = $("a");
                            pn.insertBefore(hl, node);
                            hl.appendChild(node);
                            pn = hl;
                        }
                        if (att == "target" && value == "blank") {
                            pn.setAttributeNS(xlink, "show", "new");
                        } else {
                            pn.setAttributeNS(xlink, att, value);
                        }
                        break;
                    case "cursor":
                        node.style.cursor = value;
                        break;
                    case "transform":
                        o.transform(value);
                        break;
                    case "arrow-start":
                        addArrow(o, value);
                        break;
                    case "arrow-end":
                        addArrow(o, value, 1);
                        break;
                    case "clip-rect":
                        var rect = Str(value).split(separator);
                        if (rect.length == 4) {
                            o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                            var el = $("clipPath"),
                                rc = $("rect");
                            el.id = R.createUUID();
                            $(rc, {
                                x: rect[0],
                                y: rect[1],
                                width: rect[2],
                                height: rect[3]
                            });
                            el.appendChild(rc);
                            o.paper.defs.appendChild(el);
                            $(node, {
                                "clip-path": "url(#" + el.id + ")"
                            });
                            o.clip = rc;
                        }
                        if (!value) {
                            var clip = R._g.doc.getElementById(node.getAttribute("clip-path").replace(/(^url\(#|\)$)/g, E));
                            clip && clip.parentNode.removeChild(clip);
                            $(node, {
                                "clip-path": E
                            });
                            delete o.clip;
                        }
                        break;
                    case "path":
                        if (o.type == "path") {
                            $(node, {
                                d: value ? attrs.path = R._pathToAbsolute(value) : "M0,0"
                            });
                            o._.dirty = 1;
                            if (o._.arrows) {
                                "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                                "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                            }
                        }
                        break;
                    case "width":
                        node.setAttribute(att, value);
                        o._.dirty = 1;
                        if (attrs.fx) {
                            att = "x";
                            value = attrs.x;
                        } else {
                            break;
                        }
                    case "x":
                        if (attrs.fx) {
                            value = -attrs.x - (attrs.width || 0);
                        }
                    case "rx":
                        if (att == "rx" && o.type == "rect") {
                            break;
                        }
                    case "cx":
                        node.setAttribute(att, value);
                        o.pattern && updatePosition(o);
                        o._.dirty = 1;
                        break;
                    case "height":
                        node.setAttribute(att, value);
                        o._.dirty = 1;
                        if (attrs.fy) {
                            att = "y";
                            value = attrs.y;
                        } else {
                            break;
                        }
                    case "y":
                        if (attrs.fy) {
                            value = -attrs.y - (attrs.height || 0);
                        }
                    case "ry":
                        if (att == "ry" && o.type == "rect") {
                            break;
                        }
                    case "cy":
                        node.setAttribute(att, value);
                        o.pattern && updatePosition(o);
                        o._.dirty = 1;
                        break;
                    case "r":
                        if (o.type == "rect") {
                            $(node, {
                                rx: value,
                                ry: value
                            });
                        } else {
                            node.setAttribute(att, value);
                        }
                        o._.dirty = 1;
                        break;
                    case "src":
                        if (o.type == "image") {
                            node.setAttributeNS(xlink, "href", value);
                        }
                        break;
                    case "stroke-width":
                        if (o._.sx != 1 || o._.sy != 1) {
                            value /= mmax(abs(o._.sx), abs(o._.sy)) || 1;
                        }
                        if (o.paper._vbSize) {
                            value *= o.paper._vbSize;
                        }
                        node.setAttribute(att, value);
                        if (attrs["stroke-dasharray"]) {
                            addDashes(o, attrs["stroke-dasharray"], params);
                        }
                        if (o._.arrows) {
                            "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                            "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                        }
                        break;
                    case "stroke-dasharray":
                        addDashes(o, value, params);
                        break;
                    case "fill":
                        var isURL = Str(value).match(R._ISURL);
                        if (isURL) {
                            el = $("pattern");
                            var ig = $("image");
                            el.id = R.createUUID();
                            $(el, {
                                x: 0,
                                y: 0,
                                patternUnits: "userSpaceOnUse",
                                height: 1,
                                width: 1
                            });
                            $(ig, {
                                x: 0,
                                y: 0,
                                "xlink:href": isURL[1]
                            });
                            el.appendChild(ig);
                            (function (el) {
                                R._preload(isURL[1], function () {
                                    var w = this.offsetWidth,
                                        h = this.offsetHeight;
                                    $(el, {
                                        width: w,
                                        height: h
                                    });
                                    $(ig, {
                                        width: w,
                                        height: h
                                    });
                                    o.paper.safari();
                                });
                            })(el);
                            o.paper.defs.appendChild(el);
                            node.style.fill = "url(#" + el.id + ")";
                            $(node, {
                                fill: "url(#" + el.id + ")"
                            });
                            o.pattern = el;
                            o.pattern && updatePosition(o);
                            break;
                        }
                        var clr = R.getRGB(value);
                        if (!clr.error) {
                            delete params.gradient;
                            delete attrs.gradient;
                            !R.is(attrs.opacity, "undefined") && R.is(params.opacity, "undefined") && $(node, {
                                opacity: attrs.opacity
                            });
                            !R.is(attrs["fill-opacity"], "undefined") && R.is(params["fill-opacity"], "undefined") && $(node, {
                                "fill-opacity": attrs["fill-opacity"]
                            });
                        } else if ((o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value)) {
                            if ("opacity" in attrs || "fill-opacity" in attrs) {
                                var gradient = R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, E));
                                if (gradient) {
                                    var stops = gradient.getElementsByTagName("stop");
                                    $(stops[stops.length - 1], {
                                        "stop-opacity": ("opacity" in attrs ? attrs.opacity : 1) * ("fill-opacity" in attrs ? attrs["fill-opacity"] : 1)
                                    });
                                }
                            }
                            attrs.gradient = value;
                            attrs.fill = "none";
                            break;
                        }
                        clr[has]("opacity") && $(node, {
                            "fill-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity
                        });
                    case "stroke":
                        clr = R.getRGB(value);
                        node.setAttribute(att, clr.hex);
                        att == "stroke" && clr[has]("opacity") && $(node, {
                            "stroke-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity
                        });
                        if (att == "stroke" && o._.arrows) {
                            "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                            "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                        }
                        break;
                    case "gradient":
                        (o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value);
                        break;
                    case "opacity":
                        if (attrs.gradient && !attrs[has]("stroke-opacity")) {
                            $(node, {
                                "stroke-opacity": value > 1 ? value / 100 : value
                            });
                        }
                    case "fill-opacity":
                        if (attrs.gradient) {
                            gradient = R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, E));
                            if (gradient) {
                                stops = gradient.getElementsByTagName("stop");
                                $(stops[stops.length - 1], {
                                    "stop-opacity": value
                                });
                            }
                            break;
                        }
                    default:
                        att == "font-size" && (value = toInt(value, 10) + "px");
                        var cssrule = att.replace(/(\-.)/g, function (w) {
                            return w.substring(1).toUpperCase();
                        });
                        node.style[cssrule] = value;
                        o._.dirty = 1;
                        node.setAttribute(att, value);
                        break;
                    }
                }
            }
            tuneText(o, params);
            node.style.visibility = vis;
        }, leading = 1.2,
        tuneText = function (el, params) {
            if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
                return;
            }
            var a = el.attrs,
                node = el.node,
                fontSize = node.firstChild ? toInt(R._g.doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;
            if (params[has]("text")) {
                a.text = params.text;
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                var texts = Str(params.text).split("\n"),
                    tspans = [],
                    tspan;
                for (var i = 0, ii = texts.length; i < ii; i++) {
                    tspan = $("tspan");
                    i && $(tspan, {
                        dy: fontSize * leading,
                        x: a.x
                    });
                    tspan.appendChild(R._g.doc.createTextNode(texts[i]));
                    node.appendChild(tspan);
                    tspans[i] = tspan;
                }
            } else {
                tspans = node.getElementsByTagName("tspan");
                for (i = 0, ii = tspans.length; i < ii; i++) if (i) {
                    $(tspans[i], {
                        dy: fontSize * leading,
                        x: a.x
                    });
                } else {
                    $(tspans[0], {
                        dy: 0
                    });
                }
            }
            $(node, {
                x: a.x,
                y: a.y
            });
            el._.dirty = 1;
            var bb = el._getBBox(),
                dif = a.y - (bb.y + bb.height / 2);
            dif && R.is(dif, "finite") && $(tspans[0], {
                dy: dif
            });
        }, Element = function (node, svg) {
            var X = 0,
                Y = 0;
            this[0] = this.node = node;
            node.raphael = true;
            this.id = R._oid++;
            node.raphaelid = this.id;
            this.matrix = R.matrix();
            this.realPath = null;
            this.paper = svg;
            this.attrs = this.attrs || {};
            this._ = {
                transform: [],
                sx: 1,
                sy: 1,
                deg: 0,
                dx: 0,
                dy: 0,
                dirty: 1
            };
            !svg.bottom && (svg.bottom = this);
            this.prev = svg.top;
            svg.top && (svg.top.next = this);
            svg.top = this;
            this.next = null;
        }, elproto = R.el;
    Element.prototype = elproto;
    elproto.constructor = Element;
    R._engine.path = function (pathString, SVG) {
        var el = $("path");
        SVG.canvas && SVG.canvas.appendChild(el);
        var p = new Element(el, SVG);
        p.type = "path";
        setFillAndStroke(p, {
            fill: "none",
            stroke: "#000",
            path: pathString
        });
        return p;
    };
    elproto.rotate = function (deg, cx, cy) {
        if (this.removed) {
            return this;
        }
        deg = Str(deg).split(separator);
        if (deg.length - 1) {
            cx = toFloat(deg[1]);
            cy = toFloat(deg[2]);
        }
        deg = toFloat(deg[0]);
        (cy == null) && (cx = cy);
        if (cx == null || cy == null) {
            var bbox = this.getBBox(1);
            cx = bbox.x + bbox.width / 2;
            cy = bbox.y + bbox.height / 2;
        }
        this.transform(this._.transform.concat([
            ["r", deg, cx, cy]
        ]));
        return this;
    };
    elproto.scale = function (sx, sy, cx, cy) {
        if (this.removed) {
            return this;
        }
        sx = Str(sx).split(separator);
        if (sx.length - 1) {
            sy = toFloat(sx[1]);
            cx = toFloat(sx[2]);
            cy = toFloat(sx[3]);
        }
        sx = toFloat(sx[0]);
        (sy == null) && (sy = sx);
        (cy == null) && (cx = cy);
        if (cx == null || cy == null) {
            var bbox = this.getBBox(1);
        }
        cx = cx == null ? bbox.x + bbox.width / 2 : cx;
        cy = cy == null ? bbox.y + bbox.height / 2 : cy;
        this.transform(this._.transform.concat([
            ["s", sx, sy, cx, cy]
        ]));
        return this;
    };
    elproto.translate = function (dx, dy) {
        if (this.removed) {
            return this;
        }
        dx = Str(dx).split(separator);
        if (dx.length - 1) {
            dy = toFloat(dx[1]);
        }
        dx = toFloat(dx[0]) || 0;
        dy = +dy || 0;
        this.transform(this._.transform.concat([
            ["t", dx, dy]
        ]));
        return this;
    };
    elproto.transform = function (tstr) {
        var _ = this._;
        if (tstr == null) {
            return _.transform;
        }
        R._extractTransform(this, tstr);
        this.clip && $(this.clip, {
            transform: this.matrix.invert()
        });
        this.pattern && updatePosition(this);
        this.node && $(this.node, {
            transform: this.matrix
        });
        if (_.sx != 1 || _.sy != 1) {
            var sw = this.attrs[has]("stroke-width") ? this.attrs["stroke-width"] : 1;
            this.attr({
                "stroke-width": sw
            });
        }
        return this;
    };
    elproto.hide = function () {
        !this.removed && this.paper.safari(this.node.style.display = "none");
        return this;
    };
    elproto.show = function () {
        !this.removed && this.paper.safari(this.node.style.display = "");
        return this;
    };
    elproto.remove = function () {
        if (this.removed) {
            return;
        }
        this.paper.__set__ && this.paper.__set__.exclude(this);
        eve.unbind("*.*." + this.id);
        R._tear(this, this.paper);
        this.node.parentNode.removeChild(this.node);
        for (var i in this) {
            delete this[i];
        }
        this.removed = true;
    };
    elproto._getBBox = function () {
        if (this.node.style.display == "none") {
            this.show();
            var hide = true;
        }
        var bbox = {};
        try {
            bbox = this.node.getBBox();
        } catch (e) {} finally {
            bbox = bbox || {};
        }
        hide && this.hide();
        return bbox;
    };
    elproto.attr = function (name, value) {
        if (this.removed) {
            return this;
        }
        if (name == null) {
            var res = {};
            for (var a in this.attrs) if (this.attrs[has](a)) {
                res[a] = this.attrs[a];
            }
            res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
            res.transform = this._.transform;
            return res;
        }
        if (value == null && R.is(name, "string")) {
            if (name == "fill" && this.attrs.fill == "none" && this.attrs.gradient) {
                return this.attrs.gradient;
            }
            if (name == "transform") {
                return this._.transform;
            }
            var names = name.split(separator),
                out = {};
            for (var i = 0, ii = names.length; i < ii; i++) {
                name = names[i];
                if (name in this.attrs) {
                    out[name] = this.attrs[name];
                } else if (R.is(this.paper.customAttributes[name], "function")) {
                    out[name] = this.paper.customAttributes[name].def;
                } else {
                    out[name] = R._availableAttrs[name];
                }
            }
            return ii - 1 ? out : out[names[0]];
        }
        if (value == null && R.is(name, "array")) {
            out = {};
            for (i = 0, ii = name.length; i < ii; i++) {
                out[name[i]] = this.attr(name[i]);
            }
            return out;
        }
        if (value != null) {
            var params = {};
            params[name] = value;
        } else if (name != null && R.is(name, "object")) {
            params = name;
        }
        for (var key in params) {
            eve("attr." + key + "." + this.id, this, params[key]);
        }
        for (key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
            var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
            this.attrs[key] = params[key];
            for (var subkey in par) if (par[has](subkey)) {
                params[subkey] = par[subkey];
            }
        }
        setFillAndStroke(this, params);
        return this;
    };
    elproto.toFront = function () {
        if (this.removed) {
            return this;
        }
        this.node.parentNode.appendChild(this.node);
        var svg = this.paper;
        svg.top != this && R._tofront(this, svg);
        return this;
    };
    elproto.toBack = function () {
        if (this.removed) {
            return this;
        }
        if (this.node.parentNode.firstChild != this.node) {
            this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
            R._toback(this, this.paper);
            var svg = this.paper;
        }
        return this;
    };
    elproto.insertAfter = function (element) {
        if (this.removed) {
            return this;
        }
        var node = element.node || element[element.length - 1].node;
        if (node.nextSibling) {
            node.parentNode.insertBefore(this.node, node.nextSibling);
        } else {
            node.parentNode.appendChild(this.node);
        }
        R._insertafter(this, element, this.paper);
        return this;
    };
    elproto.insertBefore = function (element) {
        if (this.removed) {
            return this;
        }
        var node = element.node || element[0].node;
        node.parentNode.insertBefore(this.node, node);
        R._insertbefore(this, element, this.paper);
        return this;
    };
    elproto.blur = function (size) {
        var t = this;
        if (+size !== 0) {
            var fltr = $("filter"),
                blur = $("feGaussianBlur");
            t.attrs.blur = size;
            fltr.id = R.createUUID();
            $(blur, {
                stdDeviation: +size || 1.5
            });
            fltr.appendChild(blur);
            t.paper.defs.appendChild(fltr);
            t._blur = fltr;
            $(t.node, {
                filter: "url(#" + fltr.id + ")"
            });
        } else {
            if (t._blur) {
                t._blur.parentNode.removeChild(t._blur);
                delete t._blur;
                delete t.attrs.blur;
            }
            t.node.removeAttribute("filter");
        }
    };
    R._engine.circle = function (svg, x, y, r) {
        var el = $("circle");
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {
            cx: x,
            cy: y,
            r: r,
            fill: "none",
            stroke: "#000"
        };
        res.type = "circle";
        $(el, res.attrs);
        return res;
    };
    R._engine.rect = function (svg, x, y, w, h, r) {
        var el = $("rect");
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {
            x: x,
            y: y,
            width: w,
            height: h,
            r: r || 0,
            rx: r || 0,
            ry: r || 0,
            fill: "none",
            stroke: "#000"
        };
        res.type = "rect";
        $(el, res.attrs);
        return res;
    };
    R._engine.ellipse = function (svg, x, y, rx, ry) {
        var el = $("ellipse");
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {
            cx: x,
            cy: y,
            rx: rx,
            ry: ry,
            fill: "none",
            stroke: "#000"
        };
        res.type = "ellipse";
        $(el, res.attrs);
        return res;
    };
    R._engine.image = function (svg, src, x, y, w, h) {
        var el = $("image");
        $(el, {
            x: x,
            y: y,
            width: w,
            height: h,
            preserveAspectRatio: "none"
        });
        el.setAttributeNS(xlink, "href", src);
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {
            x: x,
            y: y,
            width: w,
            height: h,
            src: src
        };
        res.type = "image";
        return res;
    };
    R._engine.text = function (svg, x, y, text) {
        var el = $("text");
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {
            x: x,
            y: y,
            "text-anchor": "middle",
            text: text,
            font: R._availableAttrs.font,
            stroke: "none",
            fill: "#000"
        };
        res.type = "text";
        setFillAndStroke(res, res.attrs);
        return res;
    };
    R._engine.setSize = function (width, height) {
        this.width = width || this.width;
        this.height = height || this.height;
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
        if (this._viewBox) {
            this.setViewBox.apply(this, this._viewBox);
        }
        return this;
    };
    R._engine.create = function () {
        var con = R._getContainer.apply(0, arguments),
            container = con && con.container,
            x = con.x,
            y = con.y,
            width = con.width,
            height = con.height;
        if (!container) {
            throw new Error("SVG container not found.");
        }
        var cnvs = $("svg"),
            css = "overflow:hidden;",
            isFloating;
        x = x || 0;
        y = y || 0;
        width = width || 512;
        height = height || 342;
        $(cnvs, {
            height: height,
            version: 1.1,
            width: width,
            xmlns: "http://www.w3.org/2000/svg"
        });
        if (container == 1) {
            cnvs.style.cssText = css + "position:absolute;left:" + x + "px;top:" + y + "px";
            R._g.doc.body.appendChild(cnvs);
            isFloating = 1;
        } else {
            cnvs.style.cssText = css + "position:relative";
            if (container.firstChild) {
                container.insertBefore(cnvs, container.firstChild);
            } else {
                container.appendChild(cnvs);
            }
        }
        container = new R._Paper;
        container.width = width;
        container.height = height;
        container.canvas = cnvs;
        container.clear();
        container._left = container._top = 0;
        isFloating && (container.renderfix = function () {});
        container.renderfix();
        return container;
    };
    R._engine.setViewBox = function (x, y, w, h, fit) {
        eve("setViewBox", this, this._viewBox, [x, y, w, h, fit]);
        var size = mmax(w / this.width, h / this.height),
            top = this.top,
            aspectRatio = fit ? "meet" : "xMinYMin",
            vb, sw;
        if (x == null) {
            if (this._vbSize) {
                size = 1;
            }
            delete this._vbSize;
            vb = "0 0 " + this.width + S + this.height;
        } else {
            this._vbSize = size;
            vb = x + S + y + S + w + S + h;
        }
        $(this.canvas, {
            viewBox: vb,
            preserveAspectRatio: aspectRatio
        });
        while (size && top) {
            sw = "stroke-width" in top.attrs ? top.attrs["stroke-width"] : 1;
            top.attr({
                "stroke-width": sw
            });
            top._.dirty = 1;
            top._.dirtyT = 1;
            top = top.prev;
        }
        this._viewBox = [x, y, w, h, !! fit];
        return this;
    };
    R.prototype.renderfix = function () {
        var cnvs = this.canvas,
            s = cnvs.style,
            pos = cnvs.getScreenCTM() || cnvs.createSVGMatrix(),
            left = -pos.e % 1,
            top = -pos.f % 1;
        if (left || top) {
            if (left) {
                this._left = (this._left + left) % 1;
                s.left = this._left + "px";
            }
            if (top) {
                this._top = (this._top + top) % 1;
                s.top = this._top + "px";
            }
        }
    };
    R.prototype.clear = function () {
        R.eve("clear", this);
        var c = this.canvas;
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
        this.bottom = this.top = null;
        (this.desc = $("desc")).appendChild(R._g.doc.createTextNode("Created with Rapha\xebl " + R.version));
        c.appendChild(this.desc);
        c.appendChild(this.defs = $("defs"));
    };
    R.prototype.remove = function () {
        eve("remove", this);
        this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
        for (var i in this) {
            this[i] = removed(i);
        }
    };
    var setproto = R.st;
    for (var method in elproto) if (elproto[has](method) && !setproto[has](method)) {
        setproto[method] = (function (methodname) {
            return function () {
                var arg = arguments;
                return this.forEach(function (el) {
                    el[methodname].apply(el, arg);
                });
            };
        })(method);
    }
}(window.Raphael);
window.Raphael.vml && function (R) {
    var has = "hasOwnProperty",
        Str = String,
        toFloat = parseFloat,
        math = Math,
        round = math.round,
        mmax = math.max,
        mmin = math.min,
        abs = math.abs,
        fillString = "fill",
        separator = /[, ]+/,
        eve = R.eve,
        ms = " progid:DXImageTransform.Microsoft",
        S = " ",
        E = "",
        map = {
            M: "m",
            L: "l",
            C: "c",
            Z: "x",
            m: "t",
            l: "r",
            c: "v",
            z: "x"
        }, bites = /([clmz]),?([^clmz]*)/gi,
        blurregexp = / progid:\S+Blur\([^\)]+\)/g,
        val = /-?[^,\s-]+/g,
        cssDot = "position:absolute;left:0;top:0;width:1px;height:1px",
        zoom = 21600,
        pathTypes = {
            path: 1,
            rect: 1,
            image: 1
        }, ovalTypes = {
            circle: 1,
            ellipse: 1
        }, path2vml = function (path) {
            var total = /[ahqstv]/ig,
                command = R._pathToAbsolute;
            Str(path).match(total) && (command = R._path2curve);
            total = /[clmz]/g;
            if (command == R._pathToAbsolute && !Str(path).match(total)) {
                var res = Str(path).replace(bites, function (all, command, args) {
                    var vals = [],
                        isMove = command.toLowerCase() == "m",
                        res = map[command];
                    args.replace(val, function (value) {
                        if (isMove && vals.length == 2) {
                            res += vals + map[command == "m" ? "l" : "L"];
                            vals = [];
                        }
                        vals.push(round(value * zoom));
                    });
                    return res + vals;
                });
                return res;
            }
            var pa = command(path),
                p, r;
            res = [];
            for (var i = 0, ii = pa.length; i < ii; i++) {
                p = pa[i];
                r = pa[i][0].toLowerCase();
                r == "z" && (r = "x");
                for (var j = 1, jj = p.length; j < jj; j++) {
                    r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
                }
                res.push(r);
            }
            return res.join(S);
        }, compensation = function (deg, dx, dy) {
            var m = R.matrix();
            m.rotate(-deg, .5, .5);
            return {
                dx: m.x(dx, dy),
                dy: m.y(dx, dy)
            };
        }, setCoords = function (p, sx, sy, dx, dy, deg) {
            var _ = p._,
                m = p.matrix,
                fillpos = _.fillpos,
                o = p.node,
                s = o.style,
                y = 1,
                flip = "",
                dxdy, kx = zoom / sx,
                ky = zoom / sy;
            s.visibility = "hidden";
            if (!sx || !sy) {
                return;
            }
            o.coordsize = abs(kx) + S + abs(ky);
            s.rotation = deg * (sx * sy < 0 ? -1 : 1);
            if (deg) {
                var c = compensation(deg, dx, dy);
                dx = c.dx;
                dy = c.dy;
            }
            sx < 0 && (flip += "x");
            sy < 0 && (flip += " y") && (y = -1);
            s.flip = flip;
            o.coordorigin = (dx * -kx) + S + (dy * -ky);
            if (fillpos || _.fillsize) {
                var fill = o.getElementsByTagName(fillString);
                fill = fill && fill[0];
                o.removeChild(fill);
                if (fillpos) {
                    c = compensation(deg, m.x(fillpos[0], fillpos[1]), m.y(fillpos[0], fillpos[1]));
                    fill.position = c.dx * y + S + c.dy * y;
                }
                if (_.fillsize) {
                    fill.size = _.fillsize[0] * abs(sx) + S + _.fillsize[1] * abs(sy);
                }
                o.appendChild(fill);
            }
            s.visibility = "visible";
        };
    R.toString = function () {
        return "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version;
    };
    addArrow = function (o, value, isEnd) {
        var values = Str(value).toLowerCase().split("-"),
            se = isEnd ? "end" : "start",
            i = values.length,
            type = "classic",
            w = "medium",
            h = "medium";
        while (i--) {
            switch (values[i]) {
            case "block":
            case "classic":
            case "oval":
            case "diamond":
            case "open":
            case "none":
                type = values[i];
                break;
            case "wide":
            case "narrow":
                h = values[i];
                break;
            case "long":
            case "short":
                w = values[i];
                break;
            }
        }
        var stroke = o.node.getElementsByTagName("stroke")[0];
        stroke[se + "arrow"] = type;
        stroke[se + "arrowlength"] = w;
        stroke[se + "arrowwidth"] = h;
    };
    setFillAndStroke = function (o, params) {
        o.attrs = o.attrs || {};
        var node = o.node,
            a = o.attrs,
            s = node.style,
            xy, newpath = pathTypes[o.type] && (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.cx != a.cx || params.cy != a.cy || params.rx != a.rx || params.ry != a.ry || params.r != a.r),
            isOval = ovalTypes[o.type] && (a.cx != params.cx || a.cy != params.cy || a.r != params.r || a.rx != params.rx || a.ry != params.ry),
            res = o;
        for (var par in params) if (params[has](par)) {
            a[par] = params[par];
        }
        if (newpath) {
            a.path = R._getPath[o.type](o);
            o._.dirty = 1;
        }
        params.href && (node.href = params.href);
        params.title && (node.title = params.title);
        params.target && (node.target = params.target);
        params.cursor && (s.cursor = params.cursor);
        "blur" in params && o.blur(params.blur);
        if (params.path && o.type == "path" || newpath) {
            node.path = path2vml(~Str(a.path).toLowerCase().indexOf("r") ? R._pathToAbsolute(a.path) : a.path);
            if (o.type == "image") {
                o._.fillpos = [a.x, a.y];
                o._.fillsize = [a.width, a.height];
                setCoords(o, 1, 1, 0, 0, 0);
            }
        }
        "transform" in params && o.transform(params.transform);
        if (isOval) {
            var cx = +a.cx,
                cy = +a.cy,
                rx = +a.rx || +a.r || 0,
                ry = +a.ry || +a.r || 0;
            node.path = R.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", round((cx - rx) * zoom), round((cy - ry) * zoom), round((cx + rx) * zoom), round((cy + ry) * zoom), round(cx * zoom));
        }
        if ("clip-rect" in params) {
            var rect = Str(params["clip-rect"]).split(separator);
            if (rect.length == 4) {
                rect[2] = +rect[2] + (+rect[0]);
                rect[3] = +rect[3] + (+rect[1]);
                var div = node.clipRect || R._g.doc.createElement("div"),
                    dstyle = div.style;
                dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                if (!node.clipRect) {
                    dstyle.position = "absolute";
                    dstyle.top = 0;
                    dstyle.left = 0;
                    dstyle.width = o.paper.width + "px";
                    dstyle.height = o.paper.height + "px";
                    node.parentNode.insertBefore(div, node);
                    div.appendChild(node);
                    node.clipRect = div;
                }
            }
            if (!params["clip-rect"]) {
                node.clipRect && (node.clipRect.style.clip = E);
            }
        }
        if (o.textpath) {
            var textpathStyle = o.textpath.style;
            params.font && (textpathStyle.font = params.font);
            params["font-family"] && (textpathStyle.fontFamily = '"' + params["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, E) + '"');
            params["font-size"] && (textpathStyle.fontSize = params["font-size"]);
            params["font-weight"] && (textpathStyle.fontWeight = params["font-weight"]);
            params["font-style"] && (textpathStyle.fontStyle = params["font-style"]);
        }
        if ("arrow-start" in params) {
            addArrow(res, params["arrow-start"]);
        }
        if ("arrow-end" in params) {
            addArrow(res, params["arrow-end"], 1);
        }
        if (params.opacity != null || params["stroke-width"] != null || params.fill != null || params.src != null || params.stroke != null || params["stroke-width"] != null || params["stroke-opacity"] != null || params["fill-opacity"] != null || params["stroke-dasharray"] != null || params["stroke-miterlimit"] != null || params["stroke-linejoin"] != null || params["stroke-linecap"] != null) {
            var fill = node.getElementsByTagName(fillString),
                newfill = false;
            fill = fill && fill[0];
            !fill && (newfill = fill = createNode(fillString));
            if (o.type == "image" && params.src) {
                fill.src = params.src;
            }
            params.fill && (fill.on = true);
            if (fill.on == null || params.fill == "none" || params.fill === null) {
                fill.on = false;
            }
            if (fill.on && params.fill) {
                var isURL = Str(params.fill).match(R._ISURL);
                if (isURL) {
                    fill.parentNode == node && node.removeChild(fill);
                    fill.rotate = true;
                    fill.src = isURL[1];
                    fill.type = "tile";
                    var bbox = o.getBBox(1);
                    fill.position = bbox.x + S + bbox.y;
                    o._.fillpos = [bbox.x, bbox.y];
                    R._preload(isURL[1], function () {
                        o._.fillsize = [this.offsetWidth, this.offsetHeight];
                    });
                } else {
                    fill.color = R.getRGB(params.fill).hex;
                    fill.src = E;
                    fill.type = "solid";
                    if (R.getRGB(params.fill).error && (res.type in {
                        circle: 1,
                        ellipse: 1
                    } || Str(params.fill).charAt() != "r") && addGradientFill(res, params.fill, fill)) {
                        a.fill = "none";
                        a.gradient = params.fill;
                        fill.rotate = false;
                    }
                }
            }
            if ("fill-opacity" in params || "opacity" in params) {
                var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
                opacity = mmin(mmax(opacity, 0), 1);
                fill.opacity = opacity;
                if (fill.src) {
                    fill.color = "none";
                }
            }
            node.appendChild(fill);
            var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
                newstroke = false;
            !stroke && (newstroke = stroke = createNode("stroke"));
            if ((params.stroke && params.stroke != "none") || params["stroke-width"] || params["stroke-opacity"] != null || params["stroke-dasharray"] || params["stroke-miterlimit"] || params["stroke-linejoin"] || params["stroke-linecap"]) {
                stroke.on = true;
            }
            (params.stroke == "none" || params.stroke === null || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
            var strokeColor = R.getRGB(params.stroke);
            stroke.on && params.stroke && (stroke.color = strokeColor.hex);
            opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
            var width = (toFloat(params["stroke-width"]) || 1) * .75;
            opacity = mmin(mmax(opacity, 0), 1);
            params["stroke-width"] == null && (width = a["stroke-width"]);
            params["stroke-width"] && (stroke.weight = width);
            width && width < 1 && (opacity *= width) && (stroke.weight = 1);
            stroke.opacity = opacity;
            params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
            stroke.miterlimit = params["stroke-miterlimit"] || 8;
            params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
            if (params["stroke-dasharray"]) {
                var dasharray = {
                    "-": "shortdash",
                    ".": "shortdot",
                    "-.": "shortdashdot",
                    "-..": "shortdashdotdot",
                    ". ": "dot",
                    "- ": "dash",
                    "--": "longdash",
                    "- .": "dashdot",
                    "--.": "longdashdot",
                    "--..": "longdashdotdot"
                };
                stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
            }
            newstroke && node.appendChild(stroke);
        }
        if (res.type == "text") {
            res.paper.canvas.style.display = E;
            var span = res.paper.span,
                m = 100,
                fontSize = a.font && a.font.match(/\d+(?:\.\d*)?(?=px)/);
            s = span.style;
            a.font && (s.font = a.font);
            a["font-family"] && (s.fontFamily = a["font-family"]);
            a["font-weight"] && (s.fontWeight = a["font-weight"]);
            a["font-style"] && (s.fontStyle = a["font-style"]);
            fontSize = toFloat(fontSize ? fontSize[0] : a["font-size"]);
            s.fontSize = fontSize * m + "px";
            res.textpath.string && (span.innerHTML = Str(res.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
            var brect = span.getBoundingClientRect();
            res.W = a.w = (brect.right - brect.left) / m;
            res.H = a.h = (brect.bottom - brect.top) / m;
            res.X = a.x;
            res.Y = a.y + res.H / 2;
            ("x" in params || "y" in params) && (res.path.v = R.format("m{0},{1}l{2},{1}", round(a.x * zoom), round(a.y * zoom), round(a.x * zoom) + 1));
            var dirtyattrs = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"];
            for (var d = 0, dd = dirtyattrs.length; d < dd; d++) if (dirtyattrs[d] in params) {
                res._.dirty = 1;
                break;
            }
            switch (a["text-anchor"]) {
            case "start":
                res.textpath.style["v-text-align"] = "left";
                res.bbx = res.W / 2;
                break;
            case "end":
                res.textpath.style["v-text-align"] = "right";
                res.bbx = -res.W / 2;
                break;
            default:
                res.textpath.style["v-text-align"] = "center";
                res.bbx = 0;
                break;
            }
            res.textpath.style["v-text-kern"] = true;
        }
    };
    addGradientFill = function (o, gradient, fill) {
        o.attrs = o.attrs || {};
        var attrs = o.attrs,
            pow = Math.pow,
            opacity, oindex, type = "linear",
            fxfy = ".5 .5";
        o.attrs.gradient = gradient;
        gradient = Str(gradient).replace(R._radial_gradient, function (all, fx, fy) {
            type = "radial";
            if (fx && fy) {
                fx = toFloat(fx);
                fy = toFloat(fy);
                pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
                fxfy = fx + S + fy;
            }
            return E;
        });
        gradient = gradient.split(/\s*\-\s*/);
        if (type == "linear") {
            var angle = gradient.shift();
            angle = -toFloat(angle);
            if (isNaN(angle)) {
                return null;
            }
        }
        var dots = R._parseDots(gradient);
        if (!dots) {
            return null;
        }
        o = o.shape || o.node;
        if (dots.length) {
            o.removeChild(fill);
            fill.on = true;
            fill.method = "none";
            fill.color = dots[0].color;
            fill.color2 = dots[dots.length - 1].color;
            var clrs = [];
            for (var i = 0, ii = dots.length; i < ii; i++) {
                dots[i].offset && clrs.push(dots[i].offset + S + dots[i].color);
            }
            fill.colors = clrs.length ? clrs.join() : "0% " + fill.color;
            if (type == "radial") {
                fill.type = "gradientTitle";
                fill.focus = "100%";
                fill.focussize = "0 0";
                fill.focusposition = fxfy;
                fill.angle = 0;
            } else {
                fill.type = "gradient";
                fill.angle = (270 - angle) % 360;
            }
            o.appendChild(fill);
        }
        return 1;
    };
    Element = function (node, vml) {
        this[0] = this.node = node;
        node.raphael = true;
        this.id = R._oid++;
        node.raphaelid = this.id;
        this.X = 0;
        this.Y = 0;
        this.attrs = {};
        this.paper = vml;
        this.matrix = R.matrix();
        this._ = {
            transform: [],
            sx: 1,
            sy: 1,
            dx: 0,
            dy: 0,
            deg: 0,
            dirty: 1,
            dirtyT: 1
        };
        !vml.bottom && (vml.bottom = this);
        this.prev = vml.top;
        vml.top && (vml.top.next = this);
        vml.top = this;
        this.next = null;
    };
    var elproto = R.el;
    Element.prototype = elproto;
    elproto.constructor = Element;
    elproto.transform = function (tstr) {
        if (tstr == null) {
            return this._.transform;
        }
        var vbs = this.paper._viewBoxShift,
            vbt = vbs ? "s" + [vbs.scale, vbs.scale] + "-1-1t" + [vbs.dx, vbs.dy] : E,
            oldt;
        if (vbs) {
            oldt = tstr = Str(tstr).replace(/\.{3}|\u2026/g, this._.transform || E);
        }
        R._extractTransform(this, vbt + tstr);
        var matrix = this.matrix.clone(),
            skew = this.skew,
            o = this.node,
            split, isGrad = ~Str(this.attrs.fill).indexOf("-"),
            isPatt = !Str(this.attrs.fill).indexOf("url(");
        matrix.translate(-.5, - .5);
        if (isPatt || isGrad || this.type == "image") {
            skew.matrix = "1 0 0 1";
            skew.offset = "0 0";
            split = matrix.split();
            if ((isGrad && split.noRotation) || !split.isSimple) {
                o.style.filter = matrix.toFilter();
                var bb = this.getBBox(),
                    bbt = this.getBBox(1),
                    dx = bb.x - bbt.x,
                    dy = bb.y - bbt.y;
                o.coordorigin = (dx * -zoom) + S + (dy * -zoom);
                setCoords(this, 1, 1, dx, dy, 0);
            } else {
                o.style.filter = E;
                setCoords(this, split.scalex, split.scaley, split.dx, split.dy, split.rotate);
            }
        } else {
            o.style.filter = E;
            skew.matrix = Str(matrix);
            skew.offset = matrix.offset();
        }
        oldt && (this._.transform = oldt);
        return this;
    };
    elproto.rotate = function (deg, cx, cy) {
        if (this.removed) {
            return this;
        }
        if (deg == null) {
            return;
        }
        deg = Str(deg).split(separator);
        if (deg.length - 1) {
            cx = toFloat(deg[1]);
            cy = toFloat(deg[2]);
        }
        deg = toFloat(deg[0]);
        (cy == null) && (cx = cy);
        if (cx == null || cy == null) {
            var bbox = this.getBBox(1);
            cx = bbox.x + bbox.width / 2;
            cy = bbox.y + bbox.height / 2;
        }
        this._.dirtyT = 1;
        this.transform(this._.transform.concat([
            ["r", deg, cx, cy]
        ]));
        return this;
    };
    elproto.translate = function (dx, dy) {
        if (this.removed) {
            return this;
        }
        dx = Str(dx).split(separator);
        if (dx.length - 1) {
            dy = toFloat(dx[1]);
        }
        dx = toFloat(dx[0]) || 0;
        dy = +dy || 0;
        if (this._.bbox) {
            this._.bbox.x += dx;
            this._.bbox.y += dy;
        }
        this.transform(this._.transform.concat([
            ["t", dx, dy]
        ]));
        return this;
    };
    elproto.scale = function (sx, sy, cx, cy) {
        if (this.removed) {
            return this;
        }
        sx = Str(sx).split(separator);
        if (sx.length - 1) {
            sy = toFloat(sx[1]);
            cx = toFloat(sx[2]);
            cy = toFloat(sx[3]);
            isNaN(cx) && (cx = null);
            isNaN(cy) && (cy = null);
        }
        sx = toFloat(sx[0]);
        (sy == null) && (sy = sx);
        (cy == null) && (cx = cy);
        if (cx == null || cy == null) {
            var bbox = this.getBBox(1);
        }
        cx = cx == null ? bbox.x + bbox.width / 2 : cx;
        cy = cy == null ? bbox.y + bbox.height / 2 : cy;
        this.transform(this._.transform.concat([
            ["s", sx, sy, cx, cy]
        ]));
        this._.dirtyT = 1;
        return this;
    };
    elproto.hide = function () {
        !this.removed && (this.node.style.display = "none");
        return this;
    };
    elproto.show = function () {
        !this.removed && (this.node.style.display = E);
        return this;
    };
    elproto._getBBox = function () {
        if (this.removed) {
            return {};
        }
        if (this.type == "text") {
            return {
                x: this.X + (this.bbx || 0) - this.W / 2,
                y: this.Y - this.H,
                width: this.W,
                height: this.H
            };
        } else {
            return pathDimensions(this.attrs.path);
        }
    };
    elproto.remove = function () {
        if (this.removed) {
            return;
        }
        this.paper.__set__ && this.paper.__set__.exclude(this);
        R.eve.unbind("*.*." + this.id);
        R._tear(this, this.paper);
        this.node.parentNode.removeChild(this.node);
        this.shape && this.shape.parentNode.removeChild(this.shape);
        for (var i in this) {
            delete this[i];
        }
        this.removed = true;
    };
    elproto.attr = function (name, value) {
        if (this.removed) {
            return this;
        }
        if (name == null) {
            var res = {};
            for (var a in this.attrs) if (this.attrs[has](a)) {
                res[a] = this.attrs[a];
            }
            res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
            res.transform = this._.transform;
            return res;
        }
        if (value == null && R.is(name, "string")) {
            if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                return this.attrs.gradient;
            }
            var names = name.split(separator),
                out = {};
            for (var i = 0, ii = names.length; i < ii; i++) {
                name = names[i];
                if (name in this.attrs) {
                    out[name] = this.attrs[name];
                } else if (R.is(this.paper.customAttributes[name], "function")) {
                    out[name] = this.paper.customAttributes[name].def;
                } else {
                    out[name] = R._availableAttrs[name];
                }
            }
            return ii - 1 ? out : out[names[0]];
        }
        if (this.attrs && value == null && R.is(name, "array")) {
            out = {};
            for (i = 0, ii = name.length; i < ii; i++) {
                out[name[i]] = this.attr(name[i]);
            }
            return out;
        }
        var params;
        if (value != null) {
            params = {};
            params[name] = value;
        }
        value == null && R.is(name, "object") && (params = name);
        for (var key in params) {
            eve("attr." + key + "." + this.id, this, params[key]);
        }
        if (params) {
            for (key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
                this.attrs[key] = params[key];
                for (var subkey in par) if (par[has](subkey)) {
                    params[subkey] = par[subkey];
                }
            }
            if (params.text && this.type == "text") {
                this.textpath.string = params.text;
            }
            setFillAndStroke(this, params);
        }
        return this;
    };
    elproto.toFront = function () {
        !this.removed && this.node.parentNode.appendChild(this.node);
        this.paper && this.paper.top != this && R._tofront(this, this.paper);
        return this;
    };
    elproto.toBack = function () {
        if (this.removed) {
            return this;
        }
        if (this.node.parentNode.firstChild != this.node) {
            this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
            R._toback(this, this.paper);
        }
        return this;
    };
    elproto.insertAfter = function (element) {
        if (this.removed) {
            return this;
        }
        if (element.constructor == R.st.constructor) {
            element = element[element.length - 1];
        }
        if (element.node.nextSibling) {
            element.node.parentNode.insertBefore(this.node, element.node.nextSibling);
        } else {
            element.node.parentNode.appendChild(this.node);
        }
        R._insertafter(this, element, this.paper);
        return this;
    };
    elproto.insertBefore = function (element) {
        if (this.removed) {
            return this;
        }
        if (element.constructor == R.st.constructor) {
            element = element[0];
        }
        element.node.parentNode.insertBefore(this.node, element.node);
        R._insertbefore(this, element, this.paper);
        return this;
    };
    elproto.blur = function (size) {
        var s = this.node.runtimeStyle,
            f = s.filter;
        f = f.replace(blurregexp, E);
        if (+size !== 0) {
            this.attrs.blur = size;
            s.filter = f + S + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
            s.margin = R.format("-{0}px 0 0 -{0}px", round(+size || 1.5));
        } else {
            s.filter = f;
            s.margin = 0;
            delete this.attrs.blur;
        }
    };
    R._engine.path = function (pathString, vml) {
        var el = createNode("shape");
        el.style.cssText = cssDot;
        el.coordsize = zoom + S + zoom;
        el.coordorigin = vml.coordorigin;
        var p = new Element(el, vml),
            attr = {
                fill: "none",
                stroke: "#000"
            };
        pathString && (attr.path = pathString);
        p.type = "path";
        p.path = [];
        p.Path = E;
        setFillAndStroke(p, attr);
        vml.canvas.appendChild(el);
        var skew = createNode("skew");
        skew.on = true;
        el.appendChild(skew);
        p.skew = skew;
        p.transform(E);
        return p;
    };
    R._engine.rect = function (vml, x, y, w, h, r) {
        var path = R._rectPath(x, y, w, h, r),
            res = vml.path(path),
            a = res.attrs;
        res.X = a.x = x;
        res.Y = a.y = y;
        res.W = a.width = w;
        res.H = a.height = h;
        a.r = r;
        a.path = path;
        res.type = "rect";
        return res;
    };
    R._engine.ellipse = function (vml, x, y, rx, ry) {
        var res = vml.path(),
            a = res.attrs;
        res.X = x - rx;
        res.Y = y - ry;
        res.W = rx * 2;
        res.H = ry * 2;
        res.type = "ellipse";
        setFillAndStroke(res, {
            cx: x,
            cy: y,
            rx: rx,
            ry: ry
        });
        return res;
    };
    R._engine.circle = function (vml, x, y, r) {
        var res = vml.path(),
            a = res.attrs;
        res.X = x - r;
        res.Y = y - r;
        res.W = res.H = r * 2;
        res.type = "circle";
        setFillAndStroke(res, {
            cx: x,
            cy: y,
            r: r
        });
        return res;
    };
    R._engine.image = function (vml, src, x, y, w, h) {
        var path = R._rectPath(x, y, w, h),
            res = vml.path(path).attr({
                stroke: "none"
            }),
            a = res.attrs,
            node = res.node,
            fill = node.getElementsByTagName(fillString)[0];
        a.src = src;
        res.X = a.x = x;
        res.Y = a.y = y;
        res.W = a.width = w;
        res.H = a.height = h;
        a.path = path;
        res.type = "image";
        fill.parentNode == node && node.removeChild(fill);
        fill.rotate = true;
        fill.src = src;
        fill.type = "tile";
        res._.fillpos = [x, y];
        res._.fillsize = [w, h];
        node.appendChild(fill);
        setCoords(res, 1, 1, 0, 0, 0);
        return res;
    };
    R._engine.text = function (vml, x, y, text) {
        var el = createNode("shape"),
            path = createNode("path"),
            o = createNode("textpath");
        x = x || 0;
        y = y || 0;
        text = text || "";
        path.v = R.format("m{0},{1}l{2},{1}", round(x * zoom), round(y * zoom), round(x * zoom) + 1);
        path.textpathok = true;
        o.string = Str(text);
        o.on = true;
        el.style.cssText = cssDot;
        el.coordsize = zoom + S + zoom;
        el.coordorigin = "0 0";
        var p = new Element(el, vml),
            attr = {
                fill: "#000",
                stroke: "none",
                font: R._availableAttrs.font,
                text: text
            };
        p.shape = el;
        p.path = path;
        p.textpath = o;
        p.type = "text";
        p.attrs.text = Str(text);
        p.attrs.x = x;
        p.attrs.y = y;
        p.attrs.w = 1;
        p.attrs.h = 1;
        setFillAndStroke(p, attr);
        el.appendChild(o);
        el.appendChild(path);
        vml.canvas.appendChild(el);
        var skew = createNode("skew");
        skew.on = true;
        el.appendChild(skew);
        p.skew = skew;
        p.transform(E);
        return p;
    };
    R._engine.setSize = function (width, height) {
        var cs = this.canvas.style;
        this.width = width;
        this.height = height;
        width == +width && (width += "px");
        height == +height && (height += "px");
        cs.width = width;
        cs.height = height;
        cs.clip = "rect(0 " + width + " " + height + " 0)";
        if (this._viewBox) {
            setViewBox.apply(this, this._viewBox);
        }
        return this;
    };
    R._engine.setViewBox = function (x, y, w, h, fit) {
        R.eve("setViewBox", this, this._viewBox, [x, y, w, h, fit]);
        var width = this.width,
            height = this.height,
            size = 1 / mmax(w / width, h / height),
            H, W;
        if (fit) {
            H = height / h;
            W = width / w;
            if (w * H < width) {
                x -= (width - w * H) / 2 / H;
            }
            if (h * W < height) {
                y -= (height - h * W) / 2 / W;
            }
        }
        this._viewBox = [x, y, w, h, !! fit];
        this._viewBoxShift = {
            dx: -x,
            dy: -y,
            scale: size
        };
        this.forEach(function (el) {
            el.transform("...");
        });
        return this;
    };
    var createNode, initWin = function (win) {
        var doc = win.document;
        doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            createNode = function (tagName) {
                return doc.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            createNode = function (tagName) {
                return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        }
    };
    initWin(R._g.win);
    R._engine.create = function () {
        var con = R._getContainer.apply(0, arguments),
            container = con.container,
            height = con.height,
            s, width = con.width,
            x = con.x,
            y = con.y;
        if (!container) {
            throw new Error("VML container not found.");
        }
        var res = new R._Paper,
            c = res.canvas = R._g.doc.createElement("div"),
            cs = c.style;
        x = x || 0;
        y = y || 0;
        width = width || 512;
        height = height || 342;
        res.width = width;
        res.height = height;
        width == +width && (width += "px");
        height == +height && (height += "px");
        res.coordsize = zoom * 1e3 + S + zoom * 1e3;
        res.coordorigin = "0 0";
        res.span = R._g.doc.createElement("span");
        res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";
        c.appendChild(res.span);
        cs.cssText = R.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
        if (container == 1) {
            R._g.doc.body.appendChild(c);
            cs.left = x + "px";
            cs.top = y + "px";
            cs.position = "absolute";
        } else {
            if (container.firstChild) {
                container.insertBefore(c, container.firstChild);
            } else {
                container.appendChild(c);
            }
        }
        res.renderfix = function () {};
        return res;
    };
    R.prototype.clear = function () {
        R.eve("clear", this);
        this.canvas.innerHTML = E;
        this.span = R._g.doc.createElement("span");
        this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
        this.canvas.appendChild(this.span);
        this.bottom = this.top = null;
    };
    R.prototype.remove = function () {
        R.eve("remove", this);
        this.canvas.parentNode.removeChild(this.canvas);
        for (var i in this) {
            this[i] = removed(i);
        }
        return true;
    };
    var setproto = R.st;
    for (var method in elproto) if (elproto[has](method) && !setproto[has](method)) {
        setproto[method] = (function (methodname) {
            return function () {
                var arg = arguments;
                return this.forEach(function (el) {
                    el[methodname].apply(el, arg);
                });
            };
        })(method);
    }
}(window.Raphael);
Raphael.fn.importSVG = function (rawSVG, set) {
    try {
        if (typeof rawSVG === 'undefined') throw 'No data was provided.';
        rawSVG = rawSVG.replace(/\n|\r|\t/gi, '');
        if (!rawSVG.match(/<svg(.*?)>(.*)<\/svg>/i)) throw "The data you entered doesn't contain valid SVG.";
        var findAttr = new RegExp('([a-z\-]+)="(.*?)"', 'gi'),
            findStyle = new RegExp('([a-z\-]+) ?: ?([^ ;]+)[ ;]?', 'gi'),
            findNodes = new RegExp('<(rect|polyline|circle|ellipse|path|polygon|image|text).*?\/>', 'gi');
        while (match = findNodes.exec(rawSVG)) {
            var shape, style, attr = {
                'fill': '#000'
            }, node = RegExp.$1;
            while (findAttr.exec(match)) {
                switch (RegExp.$1) {
                case 'stroke-dasharray':
                    attr[RegExp.$1] = '- ';
                    break;
                case 'style':
                    style = RegExp.$2;
                    break;
                default:
                    attr[RegExp.$1] = RegExp.$2;
                    break;
                }
            };
            if (typeof attr['stroke-width'] === 'undefined') attr['stroke-width'] = (typeof attr['stroke'] === 'undefined' ? 0 : 1);
            if (style) while (findStyle.exec(style))
            attr[RegExp.$1] = RegExp.$2;
            switch (node) {
            case 'rect':
                shape = this.rect();
                break;
            case 'circle':
                shape = this.circle();
                break;
            case 'ellipse':
                shape = this.ellipse();
                break;
            case 'path':
                shape = this.path(attr['d']);
                break;
            case 'polygon':
                shape = this.polygon(attr['points']);
                break;
            case 'image':
                shape = this.image();
                break;
            }
            shape.attr(attr);
            if (typeof set !== 'undefined') set.push(shape);
        };
    } catch (error) {
        alert('The SVG data you entered was invalid! (' + error + ')');
    }
};
Raphael.fn.polygon = function (pointString) {
    var poly = ['M'],
        point = pointString.split(' ');
    for (var i = 0; i < point.length; i++) {
        var c = point[i].split(',');
        for (var j = 0; j < c.length; j++) {
            var d = parseFloat(c[j]);
            if (d) poly.push(d);
        };
        if (i == 0) poly.push('L');
    }
    poly.push('Z');
    return this.path(poly);
};
var cssua = function (i, l) {
    var m = /[\w\-\.]+[\/][v]?\d+(\.\d+)*/g,
        n = /\b(aol|america online browser)[\s\/]*(\d+(\.\d+)*)/,
        o = /\b(msie|microsoft internet explorer)[\s\/]*(\d+(\.\d+)*)/,
        p = /rv[:](\d+(\.\d+)*).*?\bgecko[\/]\d+/,
        q = /\bopera[\s\/]*(\d+(\.\d+)*)/,
        r = /\b(mspie|microsoft pocket internet explorer)[\s\/]*(\d+(\.\d+)*)/,
        s = /\bicab[\s\/]*(\d+(\.\d+)*)/,
        t = /\bblackberry\w*[\s\/]+(\d+(\.\d+)*)/,
        u = /(\w*mobile[\/]\w*|\bipad\b|\bipod\b|\w*phone\w*|\bpda\b|\bchtml\b|\bmidp\b|\bcldc\b|blackberry\w*|windows ce\b|palm\w*\b|symbian\w*\b)/,
        g = {
            userAgent: {},
            parse: function (b) {
                var a = {};
                b = ("" + b).toLowerCase();
                if (!b) return a;
                var c = b.match(m);
                if (c) for (var e = 0; e < c.length; e++) {
                    var f = c[e].indexOf("/"),
                        d = c[e].substring(0, f);
                    if (d && d !== "mozilla") {
                        if (d === "applewebkit") d = "webkit";
                        a[d] = c[e].substr(f + 1)
                    }
                }
                if (n.exec(b)) a.aol = RegExp.$2;
                if (q.exec(b)) a.opera = RegExp.$1;
                else if (s.exec(b)) a.icab = RegExp.$1;
                else if (o.exec(b)) a.ie = RegExp.$2;
                else if (r.exec(b)) a.mspie = RegExp.$2;
                else if (p.exec(b)) a.gecko = RegExp.$1;
                if (!a.blackberry && t.exec(b)) a.blackberry = RegExp.$1;
                if (u.exec(b)) a.mobile = RegExp.$1;
                if (a.safari) if (a.chrome || a.blackberry) delete a.safari;
                else a.safari = a.version ? a.version : {
                    "419": "2.0.4",
                    "417": "2.0.3",
                    "416": "2.0.2",
                    "412": "2.0",
                    "312": "1.3",
                    "125": "1.2",
                    "85": "1.0"
                }[parseInt(a.safari, 10)] || a.safari;
                else if (a.opera && a.version) a.opera = a.version;
                a.version && delete a.version;
                return a
            },
            format: function (b) {
                function a(f, d) {
                    f = f.split(".").join("-");
                    var j = " ua-" + f;
                    if (d) {
                        d = d.split(".").join("-");
                        for (var h = d.indexOf("-"); h > 0;) {
                            j += " ua-" + f + "-" + d.substring(0, h);
                            h = d.indexOf("-", h + 1)
                        }
                        j += " ua-" + f + "-" + d
                    }
                    return j
                }
                var c = "",
                    e;
                for (e in b) if (e && b.hasOwnProperty(e)) c += a(e, b[e]);
                return c
            },
            encode: function (b) {
                var a = "",
                    c;
                for (c in b) if (c && b.hasOwnProperty(c)) {
                    if (a) a += "&";
                    a += encodeURIComponent(c) + "=" + encodeURIComponent(b[c])
                }
                return a
            }
        };
    g.userAgent = g.parse(l);
    var k = g.format(g.userAgent);
    if (i.className) i.className += k;
    else i.className = k.substr(1);
    return g
}(document.documentElement, navigator.userAgent);
$(function () {
    var _L = Nest.Localization.namespace('Console');
    var toggleCheckbox;
    var __slice = Array.prototype.slice;
    toggleCheckbox = (function () {
        function toggleCheckbox(elem, options) {
            var key, opts, value;
            this.elem = $(elem);
            opts = $.extend({}, toggleCheckbox.defaults, options);
            for (key in opts) {
                value = opts[key];
                this[key] = value;
            }
            this.elem.data(this.dataName, this);
            this.getLabels();
            this.wrapCheckboxWithDivs();
            this.attachEvents();
            this.disableTextSelection();
            if (this.resizeContainer) {
                this.optionallyResize('container');
            }
            this.initialPosition();
        }
        toggleCheckbox.prototype.isDisabled = function () {
            return this.elem.is(':disabled');
        };
        toggleCheckbox.prototype.wrapCheckboxWithDivs = function () {
            this.elem.wrap("<div class='" + this.containerClass + "' />");
            this.container = this.elem.parent();
            this.offLabel = $("<label class='" + this.labelOffClass + "'>\n  <span>" + this.uncheckedLabel + "</span>\n</label>").appendTo(this.container);
            this.offSpan = this.offLabel.children('span');
            this.onLabel = $("<label class='" + this.labelOnClass + "'>\n  <span>" + this.checkedLabel + "</span>\n</label>").appendTo(this.container);
            this.onSpan = this.onLabel.children('span');
            return this.handle = $("<div class='" + this.handleClass + "'>\n  </div>").appendTo(this.container);
        };
        toggleCheckbox.prototype.getLabels = function () {
            if ((this.elem.attr("data-checked") !== undefined) && (this.checkedLabel === "ON")) {
                this.checkedLabel = _L(this.elem.attr("data-checked"));
            }
            if ((this.elem.attr("data-unchecked") !== undefined) && (this.uncheckedLabel === "OFF")) {
                this.uncheckedLabel = _L(this.elem.attr("data-unchecked"));
            }
        };
        toggleCheckbox.prototype.disableTextSelection = function () {
            if ($.browser.msie) {
                return $([this.handle, this.offLabel, this.onLabel, this.container]).attr("unselectable", "on");
            }
        };
        toggleCheckbox.prototype._getDimension = function (elem, dimension) {
            if ($.fn.actual != null) {
                return elem.actual(dimension);
            } else {
                return elem[dimension]();
            }
        };
        toggleCheckbox.prototype.optionallyResize = function (mode) {
            var newWidth, offLabelWidth, onLabelWidth;
            onLabelWidth = this._getDimension(this.onLabel, "width");
            offLabelWidth = this._getDimension(this.offLabel, "width");
            if (mode === "container") {
                newWidth = onLabelWidth > offLabelWidth ? onLabelWidth : offLabelWidth;
                newWidth += this._getDimension(this.handle, "width") + this.handleMargin;
                return this.container.css({
                    width: newWidth
                });
            } else {
                newWidth = onLabelWidth > offLabelWidth ? onLabelWidth : offLabelWidth;
                return this.handle.css({
                    width: newWidth
                });
            }
        };
        toggleCheckbox.prototype.onMouseDown = function (event) {
            var x;
            event.preventDefault();
            if (this.isDisabled()) {
                return;
            }
            x = event.pageX || event.originalEvent.changedTouches[0].pageX;
            toggleCheckbox.currentlyClicking = this.handle;
            toggleCheckbox.dragStartPosition = x;
            return toggleCheckbox.handleLeftOffset = parseInt(this.handle.css('left'), 10) || 0;
        };
        toggleCheckbox.prototype.onDragMove = function (event, x) {
            var newWidth, p;
            if (toggleCheckbox.currentlyClicking !== this.handle) {
                return;
            }
            p = (x + toggleCheckbox.handleLeftOffset - toggleCheckbox.dragStartPosition) / this.rightSide;
            if (p < 0) {
                p = 0;
            }
            if (p > 1) {
                p = 1;
            }
            newWidth = p * this.rightSide;
            this.handle.css({
                left: newWidth
            });
            this.onLabel.css({
                width: newWidth + this.handleRadius
            });
            this.offSpan.css({
                marginRight: -newWidth
            });
            return this.onSpan.css({
                marginLeft: -(1 - p) * this.rightSide
            });
        };
        toggleCheckbox.prototype.onDragEnd = function (event, x) {
            var p;
            if (toggleCheckbox.currentlyClicking !== this.handle) {
                return;
            }
            if (this.isDisabled()) {
                return;
            }
            if (toggleCheckbox.dragging) {
                p = (x - toggleCheckbox.dragStartPosition) / this.rightSide;
                this.elem.prop('checked', p >= 0.5);
            } else {
                this.elem.prop('checked', !this.elem.prop('checked'));
            }
            toggleCheckbox.currentlyClicking = null;
            toggleCheckbox.dragging = null;
            return this.didChange();
        };
        toggleCheckbox.prototype.refresh = function () {
            return this.didChange();
        };
        toggleCheckbox.prototype.didChange = function () {
            var new_left;
            if (typeof this.onChange === "function") {
                this.onChange(this.elem, this.elem.prop('checked'));
            }
            if (this.isDisabled()) {
                this.container.addClass(this.disabledClass);
                return false;
            } else {
                this.container.removeClass(this.disabledClass);
            }
            new_left = this.elem.prop('checked') ? this.rightSide : 0;
            this.handle.stop().animate({
                left: new_left
            }, this.duration);
            this.onLabel.stop().animate({
                width: new_left + this.handleRadius
            }, this.duration);
            this.offSpan.stop().animate({
                marginRight: -new_left
            }, this.duration);
            return this.onSpan.stop().animate({
                marginLeft: new_left - this.rightSide
            }, this.duration);
        };
        toggleCheckbox.prototype.attachEvents = function () {
            var localMouseMove, localMouseUp, self;
            self = this;
            localMouseMove = function (event) {
                return self.onGlobalMove.apply(self, arguments);
            };
            localMouseUp = function (event) {
                self.onGlobalUp.apply(self, arguments);
                $(document).unbind('mousemove touchmove', localMouseMove);
                return $(document).unbind('mouseup touchend', localMouseUp);
            };
            return this.container.bind('mousedown touchstart', function (event) {
                self.onMouseDown.apply(self, arguments);
                $(document).bind('mousemove touchmove', localMouseMove);
                return $(document).bind('mouseup touchend', localMouseUp);
            });
        };
        toggleCheckbox.prototype.initialPosition = function () {
            var containerWidth, offset;
            containerWidth = this._getDimension(this.container, "width");
            this.offLabel.css({
                width: containerWidth - this.containerRadius
            });
            offset = this.containerRadius - 8;
            if ($.browser.msie && $.browser.version < 7) {
                offset -= 3;
            }
            this.rightSide = containerWidth - this._getDimension(this.handle, "width") - offset;
            if (this.elem.is(':checked')) {
                this.handle.css({
                    left: this.rightSide
                });
                this.onLabel.css({
                    width: this.rightSide + this.handleRadius
                });
                this.offSpan.css({
                    marginRight: -this.rightSide
                });
            } else {
                this.onLabel.css({
                    width: this.containerRadius
                });
                this.onSpan.css({
                    marginLeft: -this.rightSide
                });
            }
            if (this.isDisabled()) {
                return this.container.addClass(this.disabledClass);
            }
        };
        toggleCheckbox.prototype.onGlobalMove = function (event) {
            var x;
            if (!(!this.isDisabled() && toggleCheckbox.currentlyClicking)) {
                return;
            }
            event.preventDefault();
            x = event.pageX || event.originalEvent.changedTouches[0].pageX;
            if (!toggleCheckbox.dragging && (Math.abs(toggleCheckbox.dragStartPosition - x) > this.dragThreshold)) {
                toggleCheckbox.dragging = true;
            }
            return this.onDragMove(event, x);
        };
        toggleCheckbox.prototype.onGlobalUp = function (event) {
            var x;
            if (!toggleCheckbox.currentlyClicking) {
                return;
            }
            event.preventDefault();
            x = event.pageX || event.originalEvent.changedTouches[0].pageX;
            this.onDragEnd(event, x);
            return false;
        };
        toggleCheckbox.defaults = {
            duration: 200,
            checkedLabel: 'ON',
            uncheckedLabel: 'OFF',
            resizeContainer: true,
            disabledClass: 'toggleCheckDisabled',
            containerClass: 'toggleCheckContainer',
            labelOnClass: 'toggleCheckLabelOn',
            labelOffClass: 'toggleCheckLabelOff',
            handleClass: 'toggleCheckHandle',
            dragThreshold: 5,
            handleMargin: 15,
            handleRadius: 12,
            containerRadius: 10,
            dataName: "toggleStyle",
            onChange: function () {}
        };
        return toggleCheckbox;
    })();
    $.toggleStyle = this.toggleCheckbox = toggleCheckbox;
    $.fn.toggleStyle = function () {
        var args, checkbox, dataName, existingControl, method, params, _i, _len, _ref, _ref2, _ref3, _ref4;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        dataName = (_ref = (_ref2 = args[0]) != null ? _ref2.dataName : void 0) != null ? _ref : toggleCheckbox.defaults.dataName;
        _ref3 = this.filter(':checkbox');
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            checkbox = _ref3[_i];
            existingControl = $(checkbox).data(dataName);
            if (existingControl != null) {
                method = args[0], params = 2 <= args.length ? __slice.call(args, 1) : [];
                if ((_ref4 = existingControl[method]) != null) {
                    _ref4.apply(existingControl, params);
                }
            } else {
                new toggleCheckbox(checkbox, args[0]);
            }
        }
        return this;
    };
});
$(function () {
    'use strict';
    var N = window.Nest;
    $('.help-email-link').html('<a href="mailto:help@' + 'nestlabs.com" id="help_link">help@' + 'nestlabs.com</a>');
    $('input[name=username]').each(function (idx, el) {
        el.setAttribute('spellcheck', false);
    });
    $('input[name=email]').each(function (idx, el) {
        el.setAttribute('spellcheck', false);
    });
    if ($('#id_password2')[0]) {
        $('#id_password1').blur(function (e) {
            var thisOne = e.target,
                otherOne = $('#id_password2')[0];
            if (!otherOne || !otherOne.value || !thisOne.value) {
                return;
            }
            if (otherOne.value === thisOne.value) {
                otherOne.style.color = '#CCC';
            }
        });
        $('#id_password2').blur(function (e) {
            var thisOne = e.target,
                otherOne = $('#id_password1')[0];
            if (!otherOne || !otherOne.value || !thisOne.value) {
                return;
            }
            if (otherOne.value === thisOne.value) {
                thisOne.style.color = '#CCC';
            } else {
                thisOne.style.color = '#E11';
            }
        });
    }
    $(window).one('load', function () {
        var form = $('.accounts-login-form').first();
        if (form.length && $('.errorlist', form).length && $('#id_username', form).val().length) {
            N.wait(100).then(function () {
                $('#id_password', form).focus();
            });
        }
    });
});
(function ($, R, _, undefined) {
    'use strict';
    var N = window.Nest = window.Nest || {}, C = N.Cookie = {}, S = N.State = {};
    $(function () {
        N.CSS_TRANSITIONS = $('.csstransitions body').length;
    });
    N.wait = function (time) {
        var dfr = $.Deferred();
        window.setTimeout(dfr.resolve, time);
        return dfr.promise();
    };
    N.sortByCreationTime = function (a, b) {
        var act = a.creation_time || (a.attributes && a.attributes.creation_time),
            bct = b.creation_time || (b.attributes && b.attributes.creation_time);
        if (act) {
            return (!bct || (+bct < +act)) ? 1 : -1;
        } else if (bct) {
            return -1;
        } else {
            return (String(a.id) < String(b.id)) ? -1 : 1;
        }
    };
    N.Wiring = {
        backplateVersion: function (b) {
            if (!b || _.include(["Backplate-1.9", "Backplate-1.8", "Backplate-1.7", "Backplate-1.6", "Backplate-1.4"], b)) {
                return '1_00';
            } else {
                return '1_9a';
            }
        },
        renderDiagram: function (wires, b) {
            wires = wires || '';
            var d = $('<div class="wiring-diagram"/>'),
                bp = this.backplateVersion(b),
                wireMap = wires.toLowerCase().split(','),
                dWires = ["rh", "c", "w1", "ob", "y1", "aux", "g", "rc"];
            $('<img src="/images/home4/settings/backplate_' + bp + '.png?bid=' + N.BUILD_ID + '" width="223" height="223" border="0" class="backplate"/>').appendTo(d);
            _.each(wireMap, function (w, idx) {
                if (_.include(dWires, w)) {
                    d.append($('<img/>', {
                        'class': 'lit-connector',
                        src: ['/images/home4/settings/', w, '.png?bid=', N.BUILD_ID].join('')
                    }));
                }
            });
            return d;
        }
    };
    N.shortenEmailDisplay = function (email, maxlength) {
        if (email.length <= maxlength) {
            return email;
        }
        var parts = email.split('@');
        parts[1] = parts[1].split('.');
        parts = _.flatten(parts);
        var rml = maxlength - (parts[2].length + 2),
            p0 = parts[0],
            p1 = parts[1],
            p0l = Math.ceil(rml / 2),
            p1l = Math.floor(rml / 2);
        if (parts[0].length > p0l) {
            parts[0] = p0.substr(0, Math.ceil((p0l - 3) / 2)) + '...' + p0.substr(p0.length - Math.floor((p0l - 3) / 2), p0.length - 1);
        }
        if (parts[1].length > p1l) {
            parts[1] = p1.substr(0, Math.ceil((p1l - 3) / 2)) + '...' + p1.substr(p1.length - Math.floor((p0l - 3) / 2), p1.length - 1);
        }
        return parts[0] + '@' + parts[1] + '.' + parts[2];
    };
    var GA = N.GoogleAnalytics = function () {};
    GA.trackEvent = function (category, action, label, value) {
        var gaq = window['_gaq'];
        if (!gaq || $.isArray(gaq)) {
            if (GA.trackEvent.gaqErrors < 10) {
                GA.trackEvent.gaqErrors++;
                var args = arguments;
                N.wait(5000).then(function () {
                    GA.trackEvent.apply(this, args);
                });
            }
            return false;
        } else if (!category || !action) {
            N.log('Nest.GoogleAnalytics error: missing required parameters "category" and "action".');
            return false;
        }
        var errors = gaq.push.apply(window, [
            ['_trackEvent', category, action, label, value]
        ]);
        N.log('GA.trackEvent', _.toArray(arguments));
        return !errors;
    };
    GA.trackEvent.gaqErrors = 0;
    var Point = N.Point = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Point.className = 'Point';
    Point.join = function () {
        for (var a = [], i = 0, n = arguments.length; i < n; i++) {
            a.push(arguments[i]);
        }
        return a.join(' ');
    };
    Point.distanceBetween = function (a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    };
    Point.midPoint = function (points) {
        if (points.length === 1) {
            return points[0].clone();
        }
        var ax = 0,
            ay = 0;
        for (var i = 0, n = points.length; i < n; i++) {
            var p = points[i];
            ax += p.x;
            ay += p.y;
        }
        return new Point(Math.round(ax / n), Math.round(ay / n));
    };
    Point.onCircle = function (aDeg, radius, origin) {
        if (!origin.className || (origin.className !== Point.className)) {
            origin = new Point(origin);
        }
        var aRad = Math.Nest.degreesToRadians(aDeg);
        var x = (radius * Math.cos(aRad)) + origin.x;
        var y = (radius * Math.sin(aRad)) + origin.y;
        return new Point(x, y);
    };
    var p_p = Point.prototype;
    p_p.className = Point.className;
    p_p.clone = function () {
        return new Point(this.x, this.y);
    };
    p_p.toString = function () {
        return '[Point (' + this.x + ', ' + this.y + ')]';
    };
    p_p.toCString = function () {
        return this.x + ',' + this.y;
    };
    p_p.isInCircle = function (center, r, isExclusive) {
        var x2 = Math.pow(center.x - this.x, 2),
            y2 = Math.pow(center.y - this.y, 2),
            r2 = r * r;
        if (isExclusive) {
            return Boolean(x2 + y2 < r2);
        } else {
            return Boolean(x2 + y2 <= r2);
        }
    };
    p_p.distanceTo = function (p2) {
        return Point.distanceBetween(this, p2);
    };
    p_p.arcTo = p_p.A = function (rx, ry) {
        if (ry === undefined) {
            ry = rx;
        }
        return 'A' + rx + ',' + ry + ' 0 0,1 ' + this.toCString();
    };
    p_p.lineTo = p_p.L = function () {
        return 'L' + this.toCString();
    };
    p_p.moveTo = p_p.M = function () {
        return 'M' + this.toCString();
    };
    p_p.quadTo = p_p.Q = function (x, y) {
        if (x.x) {
            y = x.y;
            x = x.x;
        }
        return 'Q' + x + ',' + y + ' ' + this.toCString();
    };
    var Color = N.Color = function (r, g, b, a) {
        if (arguments.length === 1) {
            var c = arguments[0];
            if (c.className === Color.className) {
                return c.clone();
            } else if (c.indexOf('#') === 0) {
                c = c.substr(1);
                if (c.length === 3) {
                    r = c.substr(0, 1) + c.substr(0, 1);
                    g = c.substr(1, 1) + c.substr(1, 1);
                    b = c.substr(2) + c.substr(2);
                } else if (c.length === 6) {
                    r = c.substr(0, 2);
                    g = c.substr(2, 2);
                    b = c.substr(4);
                }
                r = Color._d(r);
                g = Color._d(g);
                b = Color._d(b);
            } else if (c.indexOf('rgb') > -1) {
                var t = c.indexOf('rgb'),
                    p1 = c.indexOf('('),
                    p2 = c.indexOf(')');
                if ((p2 > p1) && (p1 > t)) {
                    c = c.substring(p1 + 1, p2);
                    var args = c.split(',');
                    r = parseInt(args[0], 10);
                    g = parseInt(args[1], 10);
                    b = parseInt(args[2], 10);
                    a = parseInt(args[3], 10);
                }
            } else if (c in Color.constants) {
                var ncc = new Color(Color.constants[c]);
                if (ncc) {
                    return ncc;
                }
            }
        } else if (arguments.length === 2) {
            var e = arguments[0],
                p = arguments[1];
            if (e.style && p && p.length) {
                var v = $(e).css(p);
                var nc = new Color(v);
                if (nc) {
                    return nc;
                } else {
                    N.log('Unknown color, not in Nest.Color.constants: ' + p);
                }
            }
        }
        if (!a && (a !== 0)) {
            a = 1;
        } else if (a > 1) {
            a = a / 100;
        }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    };
    Color.className = 'Color';
    Color.constants = {
        'black': '#000',
        'blue': '#00F',
        'green': '#0F0',
        'red': '#F00',
        'white': '#FFF'
    };
    Color.average = function (color1, color2) {
        var c1 = new Color(color1),
            c2 = new Color(color2);
        var r = Math.floor((c1.r + c2.r) / 2);
        var g = Math.floor((c1.g + c2.g) / 2);
        var b = Math.floor((c1.b + c2.b) / 2);
        var a = Math.floor((c1.a + c2.a) / 2);
        return new Color(r, g, b, a);
    };
    Color.blend = function (color1, color2, pct) {
        var c1 = new Color(color1),
            c2 = new Color(color2);
        return c1.blend(c2, pct);
    };
    Color.radialGradient = function (color1, color2, xoff, yoff) {
        var offset = (xoff && yoff) ? '(' + xoff + ', ' + yoff + ')' : '';
        return 'r' + offset + (new Color(color1)) + '-' + (new Color(color2));
    };
    Color.prototype.className = Color.className;
    Color.prototype.blend = function (basecolor, pct) {
        if (!basecolor.className || basecolor.className !== Color.className) {
            basecolor = new Color(basecolor);
        }
        if (!pct && (pct !== 0)) {
            pct = 1;
        } else if (pct > 1) {
            pct = pct / 100;
        }
        var r = Math.round(((basecolor.r - this.r) * (1 - pct))) + this.r;
        var g = Math.round(((basecolor.g - this.g) * (1 - pct))) + this.g;
        var b = Math.round(((basecolor.b - this.b) * (1 - pct))) + this.b;
        return new Color(r, g, b);
    };
    Color.prototype.chroma = function (hue) {
        var lum = this.luminance(),
            c = (new Color(hue)).multiply(Math.pow(lum, 10 / 33));
        this.r = Math.round(c.r * 1.37);
        this.g = Math.round(c.g * 1.37);
        this.b = Math.round(c.b * 1.37);
        this.multiply(1);
        return this;
    };
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b, this.a);
    };
    Color.prototype.luminance = function () {
        return ((this.r / 255) * 0.299) + ((this.g / 255) * 0.587) + ((this.b / 255) * 0.114);
    };
    Color.prototype.multiply = function (pct) {
        var m = function (v) {
            return Math.min(Math.round(v * pct), 255);
        };
        this.r = m(this.r);
        this.g = m(this.g);
        this.b = m(this.b);
        return this;
    };
    Color.prototype.toHex = function () {
        var r = Color._h(this.r);
        var g = Color._h(this.g);
        var b = Color._h(this.b);
        return '#' + r + g + b;
    };
    Color.prototype.toRGBA = function () {
        return ['rgba(', [this.r, this.g, this.b, this.a].join(', '), ')'].join('');
    };
    Color.prototype.toString = function () {
        return this.toHex();
    };
    Color._d = function (h) {
        return parseInt(h, 16);
    };
    Color._h = function (n) {
        n = (+n).toString(16).toUpperCase();
        return ((n.length < 2) ? '0' + n : n);
    };
    N.roundTemperature = function (temp, scale) {
        temp = (scale.toUpperCase() === 'C') ? Math.floor(temp * 2) / 2 : temp;
        var places = (scale.toUpperCase() === 'F') ? 0 : 1;
        return Math.Nest.round(temp, places);
    };
    N.displayTemperature = function (temp, scale) {
        if (isNaN(temp) || temp === null) {
            return '?';
        } else if (scale.toUpperCase() === 'F') {
            temp = Math.Nest.CToF(temp);
        }
        return N.roundTemperature(temp, scale);
    };
    N.splitTemperature = function (temp) {
        var t = temp.toString().split('.');
        if (t.length === 1) {
            t = t[0];
        } else {
            t = t[0] + '<div class="temp-sup">' + t[1] + '</div>';
        }
        return t;
    };
    N.dataTemperature = function (temp, scale) {
        if (scale.toUpperCase() === 'F') {
            temp = Math.Nest.FToC(temp);
        }
        return temp;
    };
    N.isValidTemperature = function () {
        var isnv = function (x) {
            return !(x === null || isNaN(x));
        };
        for (var i = 0, na = arguments.length; i < na; i++) {
            if (!isnv(arguments[i])) {
                return false;
            }
        }
        return true;
    };
    var Temp = N.Temperature = function (temperature, displayScale) {
        this.temp = temperature;
        this.scale = displayScale || 'F';
        return this;
    };
    var Tp = Temp.prototype;
    Tp.equals = function (t) {
        var s1 = this.value(),
            s2 = t.value();
        if (s1 === '?' || s2 === '?') {
            return false;
        } else {
            return (this.toString() === t.toString());
        }
    };
    Tp.fractional = function () {
        return this.value()[1] !== 0;
    };
    Tp.lessThan = function (t) {
        var v1 = this.value(),
            v2 = t.value();
        return (v1[0] < v2[0]) || (v1[0] === v2[0] && v1[1] < v2[1]);
    };
    Tp.js = function () {
        var v = this.value();
        if (v === '?') {
            return v;
        } else {
            var js = String(v[0]);
            if (v[1]) {
                js += '\u2075';
            }
            return js;
        }
    };
    Tp.toNumber = function () {
        return Number(this.toString());
    };
    Tp.toString = function () {
        var v = this.value();
        return isNaN(v[0]) ? '?' : (v[1] ? v.join('.') : v[0]);
    };
    Tp.value = function () {
        var v = String(N.displayTemperature(this.temp, this.scale)).split('.');
        return [(isNaN(v[0]) ? '?' : +v[0]), + (v[1] || 0)];
    };
    S.DEFAULT_NAMESPACE = 'Nest';
    S.DAYS_UNTIL_EXPIRATION = 45;
    S.EXPIRES = new Date((new Date()).getTime() + S.DAYS_UNTIL_EXPIRATION * 24 * 60 * 60 * 1000);
    S.getBrowserPref = function (key, defaultValue, namespace) {
        return C.get(key, defaultValue, namespace);
    };
    S.setBrowserPref = function (key, value, namespace) {
        return C.set(key, value, namespace);
    };
    S.clearBrowserPref = function (key, namespace) {
        return C.clear(key, namespace);
    };
    S.debug = function (namespace) {
        N.log('Cookie Data:', C.getCookieObject(namespace));
    };
    C.NAMESPACE_SCHNACK_ERROR = 'Nest.Error';
    C.get = function (key, defaultValue, namespace) {
        namespace = namespace || S.DEFAULT_NAMESPACE;
        var crumbs = C.getCookieObject(namespace);
        return crumbs[key] || defaultValue;
    };
    C.set = function (key, value, namespace, expires) {
        expires = expires || S.EXPIRES;
        if (expires.toGMTString()) {
            expires = expires.toGMTString();
        }
        namespace = namespace || S.DEFAULT_NAMESPACE;
        var crumbs = C.getCookieObject(namespace);
        if (value === null) {
            delete crumbs[key];
        } else {
            crumbs[key] = value;
        }
        var cookie = [];
        $.each(crumbs, function (key, value) {
            cookie.push(key + '=' + encodeURIComponent(value));
        });
        var newCookie = namespace + '=' + encodeURIComponent(cookie.join(';'));
        newCookie += '; expires=' + expires;
        newCookie += '; path=/';
        document.cookie = newCookie;
        return value;
    };
    C.clear = function (key, namespace) {
        C.set(key, null, namespace);
    };
    C.getCookieObject = function (namespace) {
        var cookies = {};
        var pcs = String(document.cookie).split(';');
        $.each(pcs, function (i, o) {
            var nv = o.split('=');
            var key = nv[0],
                value = nv[1];
            if (key.charAt(0) === ' ') {
                key = key.substr(1);
            }
            cookies[key] = value;
        });
        var crumbs = {};
        var nss = [];
        if (namespace) {
            nss = [cookies[namespace]];
        } else {
            $.each(cookies, function (k, v) {
                nss.push(v);
            });
        }
        $.each(nss, function (i, ns) {
            var cookie = decodeURIComponent(ns || ''),
                frags = cookie.split(';');
            $.each(frags, function (i, c) {
                var nv = c.split('=');
                if (nv.length > 1) {
                    crumbs[nv[0]] = decodeURIComponent(nv[1]);
                }
            });
        });
        return crumbs;
    };
    var Timer = N.Timer = function (label) {
        this.label = label || '';
        this.start = (new Date()).getTime();
        this.end = null;
        return this;
    };
    Timer.prototype.stop = function () {
        this.end = (new Date()).getTime();
        this.elapsed = this.end - this.start;
        return this.elapsed;
    };
    N.Message = function (args, noTrigger) {
        args = _.isString(args) ? {
            type: args
        } : args || {};
        var msg = _.extend(function () {
            return msg.trigger();
        }, args || {}, {
            accept: args.accept || $.noop,
            error: args.error || false,
            log: args.log !== false && Boolean(N.DEBUG),
            message: args.message || '',
            reject: args.reject || $.noop,
            target: $(args.target || window),
            timestamp: new Date(),
            type: args.type || N.Message.type
        });
        msg.trigger = function () {
            msg.target.trigger(msg.type, msg);
            if (msg.log) {
                N.log('Message', '[' + msg.type + ']:', msg.message, _.extend({}, msg));
            }
            return msg;
        };
        if (!noTrigger) {
            msg.trigger();
        }
        return msg;
    };
    N.Message.type = 'nest-message';
    if (N.DEBUG) {
        $(window).bind(N.Message.type, function (msg) {
            N.log('Message', '[' + msg.type + '] sent', msg);
        });
    }
    Object.Nest = {};
    Object.Nest.copy = function (obj, deep) {
        return (deep) ? $.extend(true, {}, obj) : $.extend({}, obj);
    };
    Object.Nest.namespace = function (obj, ns) {
        obj = obj || {};
        if (!ns || !ns.length) {
            return obj;
        }
        ns = (ns.shift) ? ns : [ns];
        var n = ns.shift();
        do {
            obj = obj[n] = obj[n] || {};
        } while (n = ns.shift());
        return obj;
    };
    if (!Function.prototype.bind) {
        Function.prototype.bind = function () {
            var fn = this,
                args = Array.prototype.slice.call(arguments),
                object = args.shift();
            return function () {
                return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
            };
        };
    }
    Function.Super = function (cls, name) {
        name = name ? name + '.' : '';
        return function (method, that, args) {
            return cls.prototype[method].apply(that, args);
        };
    };
    Date.Nest = {};
    Date.Nest.MINUTES_PER_DAY = 60 * 24;
    Date.Nest.time = function () {
        return (new Date()).getTime();
    };
    Date.Nest.getDay = function (date) {
        date = date || new Date();
        return (date.getDay() + 6) % 7;
    };
    Date.Nest.getDayName = function (date) {
        date = date || new Date();
        return Date.Nest.dayNames[date.getDay()];
    };
    Date.Nest.dateFromNow = function (delta) {
        return new Date((new Date()).getTime() + delta);
    };
    Date.Nest.timeFromNow = function (d1, abbr, noSuffix, roundMethod) {
        d1 = new Date(d1);
        var rm = roundMethod || 'round',
            d2 = new Date(),
            dd = Math[rm]((d2 - d1) / 1000),
            suffix = 'now',
            unit = 'second',
            diff = dd;
        if (diff < 1) {
            return suffix;
        } else if (d2 > d1) {
            suffix = 'ago';
        } else {
            suffix = (abbr) ? '' : 'from now';
        }
        if (diff < 60) {
            unit = (diff - 1) ? (abbr ? 'secs' : 'seconds') : (abbr ? 'sec' : 'second');
        } else {
            dd = Math[rm](diff / 60);
            if (dd < 60) {
                unit = (dd - 1) ? (abbr ? 'mins' : 'minutes') : (abbr ? 'min' : 'minute');
            } else {
                dd = Math[rm](diff / (60 * 60));
                if (dd < 24) {
                    unit = (dd - 1) ? (abbr ? 'hrs' : 'hours') : (abbr ? 'hr' : 'hour');
                } else {
                    dd = Math[rm](diff / (60 * 60 * 24));
                    if (dd < 30) {
                        unit = (dd - 1) ? 'days' : 'day';
                    } else {
                        dd = Math[rm](diff / (60 * 60 * 24 * 30));
                        if (dd < 12) {
                            unit = (dd - 1) ? (abbr ? 'mos' : 'months') : (abbr ? 'mo' : 'month');
                        } else {
                            dd = Math[rm](diff / (60 * 60 * 24 * 30 * 12));
                            if (dd < 10) {
                                unit = (dd - 1) ? (abbr ? 'yrs' : 'years') : (abbr ? 'yr' : 'year');
                            } else {
                                dd = Math[rm](diff / (60 * 60 * 24 * 30 * 12 * 10));
                                if (dd < 10) {
                                    unit = (dd - 1) ? 'decades' : 'decade';
                                } else {
                                    dd = Math[rm](diff / (60 * 60 * 24 * 30 * 12 * 10 * 10));
                                    unit = abbr ? 'c.' : ((dd - 1) ? 'centuries' : 'century');
                                }
                            }
                        }
                    }
                }
            }
        }
        return dd + ' ' + unit + ((noSuffix) ? '' : ' ' + suffix);
    };
    Date.Nest.timeToTarget = function (date) {
        var now = (new Date()).getTime(),
            target = date.getTime(),
            delta = (target - now) / 60000;
        if (delta < 0) {
            return '';
        } else if (delta <= 10) {
            return 'UNDER 10 MIN';
        } else if (delta <= 20) {
            return 'IN ' + ((Math.floor(delta / 5) * 5) + 5) + ' MIN';
        } else if (delta <= 50) {
            return 'IN ' + ((Math.floor(delta / 15) * 15) + 15) + ' MIN';
        } else if (delta <= 75) {
            return 'IN 1 HR';
        } else if (delta <= 105) {
            return 'IN 1\u00BD HR';
        } else {
            return '';
        }
    };
    Date.Nest.to12Hour = function (date) {
        if (!date || !date.getHours) {
            date = new Date(date);
        }
        var h = date.getHours(),
            m = date.getMinutes(),
            ampm = (h >= 12) ? 'pm' : 'am';
        h %= 12;
        if (h === 0) {
            h = 12;
        }
        if (m < 10) {
            m = '0' + m;
        }
        return [h, m, ampm];
    };
    Date.Nest.to24Hour = function (date) {
        if (!date || !date.getHours) {
            date = new Date(date);
        }
        var h = date.getHours(),
            m = date.getMinutes();
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        return [h, m, ''];
    };
    Date.Nest.toDaySeconds = function (date) {
        return (date.getHours() * 3600) + (date.getMinutes() * 60) + date.getSeconds();
    };
    Date.Nest.fromDaySeconds = function (secs) {
        var base = new Date(1968, 11, 11, 0, 0, 0),
            ms = secs * 1000;
        return new Date(base.getTime() + ms);
    };
    Date.Nest.isNight = function (sunrise, sunset) {
        if (!_.isDate(sunrise)) {
            sunrise = new Date();
            sunrise.setHours(6);
        }
        if (!_.isDate(sunset)) {
            sunset = new Date();
            sunset.setHours(18);
        }
        var now = (new Date()).getTime(),
            sr = sunrise.getTime(),
            ss = sunset.getTime(),
            isDay = (now >= sr && now <= ss);
        return !isDay;
    };
    Date.Nest.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    Date.Nest.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var Event = window.Event || {};
    Event.Nest = {};
    Event.Nest.mouseOffset = function (e) {
        var o = $(e.target).offset();
        return {
            x: e.pageX - o.left,
            y: e.pageY - o.top
        };
    };
    Math.Nest = {};
    Math.Nest.PId180 = Math.PI / 180;
    Math.Nest.degreesToRadians = function (ad) {
        return ad * Math.Nest.PId180;
    };
    Math.Nest.radiansToDegrees = function (ar) {
        return ar / Math.Nest.PId180;
    };
    Math.Nest.round = function (num, decimalPlaces, round) {
        decimalPlaces = (typeof (decimalPlaces) === 'number') ? decimalPlaces : 0;
        round = round || Math.round;
        return round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
    };
    Math.Nest.percentage = function (num, decimalPlaces, round) {
        decimalPlaces = decimalPlaces || 0;
        return Math.Nest.round(num, decimalPlaces, round) * 100;
    };
    Math.Nest.celciusToFahrenheit = Math.Nest.CToF = function (t, round) {
        var ct = (t * (9 / 5)) + 32,
            okRoundTypes = 'boolean|number';
        return (okRoundTypes.indexOf(typeof (round)) > -1) ? Math.Nest.round(ct, round) : ct;
    };
    Math.Nest.fahrenheitToCelcius = Math.Nest.FToC = function (t, round) {
        var ct = (t - 32) * (5 / 9),
            okRoundTypes = 'boolean|number';
        return (okRoundTypes.indexOf(typeof (round)) > -1) ? Math.Nest.round(ct, round) : ct;
    };
    Math.Nest.fraction = function (num) {
        var whole = parseInt(Math.floor(num), 10),
            dec = num - whole;
        if (dec === 0) {
            return whole;
        } else if (dec === 0.25) {
            return whole + '\u00BC';
        } else if (dec === 0.5) {
            return whole + '\u00BD';
        } else if (dec === 0.75) {
            return whole + '\u00BE';
        } else {
            return num;
        }
    };
    Number.Nest = {};
    Number.Nest.isInteger = function (n) {
        return (Math.floor(n) === Math.ceil(n));
    };
    Number.Nest.constrain = function (n, min, max) {
        return Math.max(Math.min(+n, max), min);
    };
    String.Nest = {};
    String.Nest.camelCase = function (s, seps) {
        seps = seps || ['_', '-'];
        var si;
        _.each(seps, function (v, k) {
            while ((si = s.indexOf(v)) > -1) {
                s = s.substr(0, si) + s.substr(si + 1, 1).toUpperCase() + s.substr(si + 2);
            }
        });
        return s;
    };
    String.Nest.capitalize = function (s) {
        s = String(s);
        return String.Nest.ucFirst(s.toLowerCase());
    };
    String.Nest.endsWith = function (s, sub) {
        s = String(s);
        sub = String(sub);
        return s.lastIndexOf(sub) === (s.length - sub.length);
    };
    String.Nest.ucFirst = function (s) {
        s = String(s);
        return s.substr(0, 1).toUpperCase() + s.substr(1);
    };
    N.logger = function (m, args, isErrorEvent) {
        if (m === 'error') {
            args = _.toArray(args);
            _.each(args, function (v, k) {
                if (typeof v === 'object' && !_.isArray(v)) {
                    args[k] = _.reduce(v, function (memo, itm, key) {
                        return memo + ', ' + key + '=' + itm;
                    }, '').substr(2);
                }
            });
            $.post('/api/0.1/log', {
                '_logtype': 'ajax.error',
                'args': args.join(', ')
            });
        }
        var c = window.console;
        if (!c || isErrorEvent) {
            return N.logger.pass;
        }
        return ($.browser.msie && N.logger.msie) || c[m] || c.log || N.logger.pass;
    };
    N.logger.msie = function () {
        window.console.log(_.toArray(arguments).join(' '));
    };
    N.logger.pass = function () {};
    N.log = function () {
        if (!N.LOG_DEBUG) {
            return;
        }
        var ts = Date().replace(/.*\s(\d{1,2}:\d{2}:\d{2})\s.*/, '$1'),
            args = _.toArray(arguments);
        args.unshift(ts + '   ');
        N.logger('log').apply(window.console, args);
    };
    N.error = function () {
        if (!N.LOG_DEBUG) {
            return;
        }
        N.logger('error', arguments).apply(window.console, arguments);
    };
    N.info = function () {
        if (!N.LOG_DEBUG) {
            return;
        }
        var ts = Date().replace(/.*\s(\d{1,2}:\d{2}:\d{2})\s.*/, '$1'),
            args = _.toArray(arguments);
        args.unshift(ts + '   ');
        N.logger('info', arguments).apply(window.console, args);
    };
    N.warn = function () {
        if (!N.LOG_DEBUG) {
            return;
        }
        var ts = Date().replace(/.*\s(\d{1,2}:\d{2}:\d{2})\s.*/, '$1'),
            args = _.toArray(arguments);
        args.unshift(ts + '   ');
        N.logger('warn', arguments).apply(window.console, args);
    };
    N.logTiming = function (category) {
        category = category || 'Nest';
        var wpt = window && window.performance && window.performance.timing;
        if (!wpt) {
            return;
        }
        var e = ['navigationStart', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoaded', 'domComplete', 'loadEventStart', 'loadEventEnd'],
            least = -1;
        var em = _.select(e, function (k) {
            var tv = wpt[k],
                accept = (tv > least);
            if (isNaN(tv)) {
                return false;
            }
            least = Math.max(tv, least);
            return accept;
        }),
            timing = {};
        N.log('Timing:');
        for (var i = 0, j = 1, n = em.length; i < n - 2; i++, j++) {
            var sl = em[i],
                el = em[j],
                sv = wpt[sl],
                ev = wpt[el];
            N.log('   ', sl, '-', el + ':', ev - sv + 'ms');
        }
        var loadTime = wpt[_.last(em)] - wpt[_.first(em)];
        var nlt = function () {
            N.log('Page load time:', loadTime + 'ms');
            GA.trackEvent(category, 'pageLoadTimer', null, loadTime);
            return loadTime;
        };
        N.logTiming = nlt;
        return nlt();
    };
    window.onerror = function (message, file, line) {
        N.logger('error', [{
            file: file,
            line: line,
            message: message
        }], true);
    };
    N.QueryString = function (name) {
        var s = location.search.slice(1),
            data = {};
        s.replace(/([^&=]+)=([^&=]*)/g, function ($0, $1, $2) {
            data[$1] = $2;
        });
        return data[name];
    };
    N.HashString = function (name) {
        var h = window.location.hash.slice(1),
            data = {};
        h.replace(/([^&=]+)=([^&=]*)/g, function ($0, $1, $2) {
            data[$1] = $2;
        });
        return data[name];
    };
})(window.jQuery, window.Raphael, window._);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        A = N.Animate = N.Animate || {}, Q = A.Queue = A.Queue || {};
    var E = A.Event = function (args) {
        if (arguments.length > 1) {
            args = _.toArray(arguments);
        }
        if (_.isArray(args)) {
            args = {
                target: args[0],
                params: args[1],
                duration: args[2],
                callback: args[3],
                interrupt: args[4]
            };
        }
        var defaults = {
            callback: $.noop,
            params: {}
        };
        _.extend(this, defaults, args);
        this.noStop = this.noStop || this.params.hasOwnProperty('scale');
        return this;
    }, Ep = E.prototype;
    E.className = 'Event';
    Ep.className = E.className;
    Ep.animate = function () {
        return A.animate(this);
    };
    Ep.stop = function () {
        if (this.noStop) {
            return;
        }
    };
    var G = A.EventGroup = function (args) {
        var events = [];
        _.extend(this, {
            callback: $.noop
        }, args);
        _.each(this.events, function (v, k) {
            events[k] = new E(v);
        });
        this.events = events;
        this.events.sort(G.sortByDuration);
        this.noStop = this.noStop || !! (_.detect(this.events, function (v) {
            return v.noStop;
        }));
        return this;
    }, Gp = G.prototype;
    G.className = 'EventGroup';
    G.sortByDuration = function (a, b) {
        return a.duration - b.duration;
    };
    Gp.className = G.className;
    Gp.animate = function () {
        return A.animate(this);
    };
    Gp.stop = function () {
        if (this.noStop) {
            return;
        }
    };
    A.animate = function (args) {
        if (arguments.length > 1) {
            args = {
                target: arguments[0],
                params: arguments[1],
                duration: arguments[2],
                callback: arguments[3],
                interrupt: arguments[4]
            };
        } else {
            args = args || {};
        }
        var dfr = $.Deferred(),
            e = args;
        if (_.indexOf([E.className, G.className], e.className, true) === -1) {
            e = new E(args);
        }
        e.dfr = dfr;
        Q.add(e);
        return dfr.promise();
    };
    Q.current = null;
    Q.id = 1;
    Q.stack = [];
    Q.watcher = null;
    Q.add = function (qevt) {
        Q.stack.push(qevt);
        if (!Q.current) {
            Q.advance();
        }
    };
    Q.next = function () {
        return Q.stack.shift() || null;
    };
    Q.advance = function () {
        var n = Q.next();
        if (!n) {
            return;
        }
        var duration = 0,
            callback = _.once(function () {
                n.dfr.resolve();
                n.callback();
                Q.current.timer.stop();
                Q.current = null;
                Q.advance();
            });
        if (n.className === E.className) {
            n.target.animate(n.params, duration = n.duration, callback);
            if (!n.target.length) {
                N.wait(n.duration).then(callback);
            }
        } else if (n.className === G.className) {
            var ev = n.events;
            for (var i = 0, ni = ev.length; i < ni; i++) {
                var e = ev[i],
                    cb = (i === (ni - 1)) ? callback : null;
                e.target.animate(e.params, duration = Math.max(e.duration, duration), cb);
                if (cb && !e.target.length) {
                    N.wait(e.duration).then(cb);
                }
            }
        }
        Q.id++;
        Q.current = {
            callback: callback,
            duration: duration,
            event: n,
            id: Q.id,
            timer: new N.Timer('    #' + Q.id + ' - est: ' + duration + 'ms, actual')
        };
        if (!Q.watcher) {
            Q.checkStuckTimers();
        }
    };
    Q.checkStuckTimers = function () {
        var c = Q.current;
        if (c) {
            var now = (new Date()).getTime(),
                elapsed = now - c.timer.start,
                duration = c.duration,
                tardiness = elapsed - duration;
            if (tardiness > 1000 || tardiness > (10 * Math.max(duration, 25))) {
                N.log('Queue: #' + c.id, 'stuck -- force quitting');
                c.event.stop();
                c.callback();
            }
        }
        Q.watcher = window.setTimeout(Q.checkStuckTimers, 1500);
    };
})(window.jQuery, window._);
(function (_, $G) {
    'use strict';
    var N = window.Nest = window.Nest || {}, GA = N.GoogleAnalytics,
        reSpecialChars = /[ \/]/g,
        reNonWords = /[^A-Za-z\d_\-\/ ]/g;
    var L = N.Localization = N.Localization || function (key, namespace, variables) {
            var sel = '#_TMPL .js-strings';
            if (namespace) {
                sel += ' .' + namespace;
            }
            sel += ' .' + key.replace(reNonWords, '').replace(reSpecialChars, '-');
            var q = $(sel);
            if (!q.length) {
                var ns = namespace ? ' in namespace "' + namespace + '"' : '';
                N.warn('JS string "' + key + '" missing' + ns + '.');
            }
            return q.length ? q.text() : key;
        };
    L.LANGUAGE = 'en';
    L.namespace = function (ns) {
        return function (k) {
            return N.Localization(k, ns);
        };
    };
    var Lf = L.formats = {};
    Lf['en'] = Lf['en-US'] = {
        'day-time-long': 'dddd h tt',
        'day-date-short': 'ddd d',
        'hour-label-abbr': 'hr',
        'min-label-abbr': 'min',
        'time': 'h:mm tt'
    };
    Lf['es'] = Lf['es-MX'] = Lf['es-US'] = {
        'day-time-long': 'dddd h tt',
        'day-date-short': 'd ddd',
        'hour-label-abbr': 'horas',
        'min-label-abbr': 'minutos',
        'time': 'h:mm tt'
    };
    Lf['fr'] = Lf['fr-CA'] = {
        'day-time-long': 'dddd HH\'h\'mm',
        'day-date-short': 'd ddd',
        'hour-label-abbr': 'heures',
        'min-label-abbr': 'minutes',
        'time': 'HH\'h\'mm'
    };
    Lf.get = function (lang, str) {
        var full = Lf[lang],
            simple = Lf[lang.split('-')[0]];
        if (full && full[str]) {
            return full[str];
        } else if (simple && simple[str]) {
            return simple[str];
        }
        return Lf['en'][str];
    };
    var init = function () {
        var langs = N.LOCALE || navigator.language,
            lang = _.find(langs.split(','), function (val) {
                var sv = val.split(';')[0],
                    foundIt = _.include(N.LOCALES, sv);
                return foundIt && sv;
            });
        if (lang) {
            var cf = '/vendor/i18n/cultures/globalize.culture.' + lang.split(';')[0] + '.js';
            $('<script/>', {
                src: cf
            }).appendTo('head');
            N.log('Localization.init: Culture file:', _.last(cf.split('/')));
            $G.culture(lang);
            L.LANGUAGE = lang.substr(0, 2);
            $('html').addClass(L.LANGUAGE);
            N.log('Localization.init: Culture set to', lang);
            GA.trackEvent('Console', 'setLanguage', lang);
        } else {
            N.warn('Localization.init: Globalize lang undefined');
        }
    };
    $(init);
})(window._, window.Globalize);
(function ($, _, Backbone, undefined) {
    'use strict';
    var N = window.Nest,
        GA = N.GoogleAnalytics,
        C = N.Console,
        M = N.Models = N.Models || {}, S, blacklist = {}, deviceCount = 0,
        structureCount = 0,
        scheduleCount = 0;
    S = M.Structure = Backbone.Model.extend({
        Super: Function.Super(Backbone.Model, 'Structure'),
        AWAY_SETTER_ALGORITHM: 1,
        AWAY_SETTER_CLIENT: 0,
        initialize: function (args) {
            this.instance = ++structureCount;
            this.className = 'structure';
            this.dbid = args.id;
            this.id = 's' + args.id;
            this.czid = 'structure.' + args.id;
            this.collection.trigger('newStructure', this);
            var c = this.devices = new M.DeviceCollection();
            c.structure = this;
            c.refresh(args.devices, {
                silent: true
            });
            M.Cache[this.id] = this;
            return this.Super('initialize', this, arguments);
        },
        associate: function (passphrase, callback) {
            GA.trackEvent('Console', 'associateStructure');
            var self = this,
                url = C.API_PREFIX + '/passphrase/' + C.USER_ID,
                args = {
                    data: {
                        'passphrase': passphrase,
                        'structureid': self.dbid
                    },
                    success: function (data, status, xhr) {
                        callback(data, self.id);
                    },
                    type: 'POST'
                };
            M.ajax(url, args);
            return this;
        },
        getField: function (attr) {
            attr = M._classToAttr(attr);
            var func = {
                'heat_pump_aux_threshold': 'getHeatPumpAuxThreshold',
                'heat_pump_comp_threshold': 'getHeatPumpCompThreshold',
                'lower_safety_temp': 'getLowerSafetyTemp',
                'structure_name': 'getName',
                'temperature_scale': 'getTempScale',
                'upper_safety_temp': 'getUpperSafetyTemp'
            }[attr];
            return (func && this[func].apply(this, [])) || this.get(attr);
        },
        getName: function () {
            return this.attributes.name;
        },
        isAutoAway: function () {
            return this.getField('away_setter') === this.AWAY_SETTER_ALGORITHM;
        },
        isAway: function () {
            return this.get('away');
        },
        isOnline: function () {
            var m = this.devices && this.devices.models;
            return !m || _.any(this.devices.models, function (d) {
                return d.isOnline();
            });
        },
        remove: function () {
            var did = this.id,
                id = did.substr(1),
                url = C.API_PREFIX + '/structure/remove/' + id;
            M.post(url);
            GA.trackEvent('Console', 'removeStructure');
            delete M.Cache[did];
            N.CZ.clearModel();
        },
        save: function () {
            this.Super('save', this, arguments);
            var evt = this.transform._event.split('.');
            GA.trackEvent(evt.shift(), evt.join('.'));
            delete this.transform._event;
            return this;
        },
        setAway: function (isAway) {
            if (isAway === 'true') {
                isAway = true;
            } else if (isAway === 'false') {
                isAway = false;
            }
            this.set({
                away: isAway,
                away_setter: 0,
                away_timestamp: Math.round(N.CZ.getTime() / 1000)
            });
            this.transform['_event'] = 'Console.' + (isAway ? 'setAwayMode' : 'clearAwayMode');
            this.save();
            return this;
        },
        setField: function (attr, value, evt, forceSave) {
            attr = M._classToAttr(attr);
            if (value === this.getField(attr)) {
                return;
            }
            var func = {
                'structure_name': 'name'
            }[attr] || this[M._attrToSetter(attr)] || attr;
            if (typeof func === 'function') {
                func.apply(this, [value]);
            } else {
                var obj = {};
                obj[func] = value;
                this.set(obj);
                evt = evt || (function (attr) {
                    var kw = attr.split('_'),
                        fw = 'Console.set';
                    fw = _.reduce(kw, function (memo, word) {
                        fw = fw + String.Nest.ucFirst(word);
                        return fw;
                    }, fw);
                    return fw;
                })(attr);
                this.transform['_event'] = evt;
                if (forceSave && _.isUndefined(this.transform[attr])) {
                    var self = this;
                    this.transform[attr] = function (v, k) {
                        delete self[k];
                        return v;
                    };
                }
                this.save();
            }
            return this;
        },
        setLocation: function (location, displayLocation) {
            if (!location) {
                return false;
            }
            this.set({
                'location': displayLocation || location
            });
            this.transform['_event'] = 'Console.setStructureLocation';
            this.save();
            if (displayLocation) {
                this.attributes.display_location = displayLocation;
            }
            return this;
        },
        setPostalCode: function (location, postalCode) {
            var ctry = (postalCode.length > 5) ? 'CA' : 'US',
                obj = {};
            obj['postal_code'] = postalCode;
            this.transform['_event'] = 'Console.setPostalCode';
            obj['location'] = location;
            this.transform['_event'] = 'Console.setStructureLocation';
            if (ctry !== this.getField('country_code')) {
                obj['country_code'] = ctry;
                this.transform['_event'] = 'Console.setCountryCode';
            }
            this.set(obj);
            this.save();
            this.attributes.display_location = location;
            return this;
        },
        toggleAway: function () {
            var am = !this.attributes.away;
            this.setAway(am);
            return am;
        },
        toJSON: function () {
            var args = {}, self = this;
            _.each(this.transform, function (v, k) {
                var val = this.attributes[k];
                args[k] = (typeof v === 'function') ? v(val, self) : (v ? v : val);
            }, this);
            return args;
        },
        transform: {
            'away': 0,
            'away_setter': 0,
            'away_timestamp': 0,
            'country_code': 0,
            'location': 0,
            'name': 0,
            'postal_code': 0,
            'street_address': 0
        },
        url: function () {
            return C.API_PREFIX + '/structure/' + this.attributes.id;
        },
        view: function () {
            return C.getView(this.id);
        }
    });
    S.addNew = function () {
        M.post(C.API_PREFIX + '/structure/new');
        GA.trackEvent('Console', 'newStructure');
    };
    M.Device = Backbone.Model.extend({
        Super: Function.Super(Backbone.Model, 'Device'),
        MIN_RANGE_SPREAD: 1.5,
        MIN_AWAY_SPREAD_C: 3.0,
        MIN_AWAY_SPREAD_F: 6.0,
        TEMP: {
            TARGET: {
                MIN: {
                    C: 9.0,
                    F: 10.0
                },
                MAX: {
                    C: 32.0,
                    F: 32.222
                }
            },
            AWAY: {
                LOW: {
                    MIN: {
                        C: {
                            '1.2': 4.0,
                            '1.1': 4.59999,
                            '1.03': 9.0,
                            DEFAULT: 12.0
                        },
                        F: {
                            '1.1': 4.444,
                            '1.03': 10.0,
                            DEFAULT: 12.778
                        }
                    },
                    MAX: {
                        C: {
                            '1.03': 21.0,
                            DEFAULT: 23.0
                        },
                        F: {
                            '1.03': 21.111,
                            DEFAULT: 23.889
                        }
                    },
                    LEAF: 16.667,
                    DEFAULT: 10.0
                },
                HIGH: {
                    MIN: {
                        C: {
                            '2.0': 24.444,
                            '1.2': 23.5,
                            '1.03': 23.0,
                            DEFAULT: 21.0
                        },
                        F: {
                            '2.0': 24.444,
                            '1.03': 23.889,
                            DEFAULT: 21.111
                        }
                    },
                    MAX: {
                        C: {
                            DEFAULT: 32.0
                        },
                        F: {
                            DEFAULT: 32.222
                        }
                    },
                    LEAF: 27.778,
                    DEFAULT: 32.0
                }
            },
            HEAT_PUMP_AUX: {
                MIN: {
                    C: 1.5,
                    F: 1.667
                },
                MAX: {
                    C: 32.0,
                    F: 32.222
                },
                DEFAULT: {
                    C: 10.0,
                    F: 10.0
                },
                DISABLED: 1000.0
            },
            SAFETY: {
                LOW: {
                    MIN: {
                        C: 2.0,
                        F: 1.667
                    },
                    MAX: {
                        C: 7.0,
                        F: 7.222
                    },
                    DEFAULT: {
                        C: 7.0,
                        F: 7.222
                    },
                    DISABLED: -1000.0
                },
                HIGH: {
                    MIN: {
                        C: 35.0,
                        F: 35.0
                    },
                    MAX: {
                        C: 40.0,
                        F: 40.556
                    },
                    DEFAULT: {
                        C: 40.0,
                        F: 40.556
                    },
                    DISABLED: 1000.0
                }
            }
        },
        preferredTempScale: 'F',
        initialize: function (args) {
            this.instance = ++deviceCount;
            this.className = 'device';
            var did = args.id;
            this.id = 'd' + did;
            this.czid = 'device.' + did;
            if (did in blacklist) {
                return;
            }
            var ms = args.manual_schedule;
            this.schedule = ms && new M.Schedule($.evalJSON(ms), this);
            this.getStructure().collection.trigger('newDevice', this);
            M.Cache[this.id] = this;
            C.App.registerModel(this.id);
            return this.Super('initialize', this, arguments);
        },
        capabilityAtLeast: function (v) {
            var l = this.attributes.capability_level || 0;
            return (l >= v);
        },
        getAwayDefaults: function () {
            return {
                low: this.TEMP.AWAY.LOW.DEFAULT,
                high: this.TEMP.AWAY.HIGH.DEFAULT
            };
        },
        getAwayLeafBounds: function () {
            return {
                low: this.getField('leaf_away_low') || this.TEMP.AWAY.LOW.LEAF,
                high: this.getField('leaf_away_high') || this.TEMP.AWAY.HIGH.LEAF
            };
        },
        getAwayMinMax: function () {
            var self = this,
                ts = this.getTempScale(),
                testF = function (v, k) {
                    return (self.hasCapabilityLevel(k) || k === 'DEFAULT');
                };
            return {
                lowMin: _.find(this.TEMP.AWAY.LOW.MIN[ts], testF),
                lowMax: _.find(this.TEMP.AWAY.LOW.MAX[ts], testF),
                highMin: _.find(this.TEMP.AWAY.HIGH.MIN[ts], testF),
                highMax: _.find(this.TEMP.AWAY.HIGH.MAX[ts], testF)
            };
        },
        getCompressorLockoutTimeout: function () {
            var clt = Number(this.get('compressor_lockout_timeout') || 0) * 1000;
            return clt;
        },
        getDisplayTempMinMax: function () {
            var mm = this.getTempMinMax();
            if (this.getTempScale() === 'F') {
                mm = {
                    min: Math.Nest.CToF(mm.min),
                    max: Math.Nest.CToF(mm.max)
                };
            }
            return mm;
        },
        getEnergyDays: function () {
            if (!this.hasEnergyData()) {
                return 0;
            }
            var e = this.getField('energy_latest').days,
                c = _.filter(e, function (d) {
                    return d.incomplete_fields === 0;
                }).length;
            return c;
        },
        getField: function (attr) {
            attr = M._classToAttr(attr);
            var func = {
                'device_name': 'getName',
                'range_enable': 'isRangeEnabled',
                'temperature_scale': 'getTempScale',
                'time_to_target': 'getTimeToTarget'
            }[attr];
            return func ? this[func].apply(this, []) : this.get(attr);
        },
        getHeatPumpAuxDefault: function () {
            return this.TEMP.HEAT_PUMP_AUX.DEFAULT[this.getTempScale()];
        },
        getHeatPumpAuxMinMax: function () {
            var ts = this.getTempScale();
            return {
                min: this.TEMP.HEAT_PUMP_AUX.MIN[ts],
                max: this.TEMP.HEAT_PUMP_AUX.MAX[ts]
            };
        },
        getHeatPumpAuxThreshold: function () {
            var isf = (this.getTempScale() === 'F'),
                val = this.attributes.heat_pump_aux_threshold;
            if (val === this.TEMP.HEAT_PUMP_AUX.DISABLED) {
                return this.getHeatPumpAuxDefault();
            } else {
                return val;
            }
        },
        getLowerSafetyTemp: function () {
            var ts = this.getTempScale(),
                val = this.attributes.lower_safety_temp;
            if (val === this.TEMP.SAFETY.LOW.DISABLED[ts]) {
                return this.getSafetyTempDefaults().low;
            } else {
                return val;
            }
        },
        getMinAwaySpread: function () {
            var isf = (this.getTempScale() === 'F');
            return isf ? this.MIN_AWAY_SPREAD_F : this.MIN_AWAY_SPREAD_C;
        },
        getMinRangeSpread: function () {
            return this.attributes.min_range_spread || this.MIN_RANGE_SPREAD;
        },
        getName: function () {
            return this.attributes.name;
        },
        getPins: function () {
            return this.get('hvac_pins') || '';
        },
        getSafetyMinMax: function () {
            var ts = this.getTempScale();
            return {
                lowMin: this.TEMP.SAFETY.LOW.MIN[ts],
                lowMax: this.TEMP.SAFETY.LOW.MAX[ts],
                highMin: this.TEMP.SAFETY.HIGH.MIN[ts],
                highMax: this.TEMP.SAFETY.HIGH.MAX[ts]
            };
        },
        getSafetyTempDefaults: function () {
            var ts = this.getTempScale();
            return {
                high: this.TEMP.SAFETY.HIGH.DEFAULT[ts],
                low: this.TEMP.SAFETY.LOW.DEFAULT[ts]
            };
        },
        getStructure: function () {
            return this.collection.structure;
        },
        getTempMinMax: function (field) {
            field = field || 'temp';
            var ts = this.getTempScale(),
                isfmin = (field === 'temp-min'),
                isfmax = (field === 'temp-max');
            return {
                min: this.TEMP.TARGET.MIN[ts] + (isfmax ? this.MIN_RANGE_SPREAD : 0),
                max: this.TEMP.TARGET.MAX[ts] - (isfmin ? this.MIN_RANGE_SPREAD : 0)
            };
        },
        getTempScale: function () {
            return (this.attributes.temperature_scale || this.preferredTempScale).toUpperCase();
        },
        getTimeToTarget: function () {
            var tt = new Date((this.attributes.time_to_target || 0) * 1000),
                ttt = Date.Nest.timeToTarget(tt);
            return ttt;
        },
        getUpperSafetyTemp: function () {
            var ts = this.getTempScale(),
                val = this.attributes.upper_safety_temp;
            if (val === this.TEMP.SAFETY.HIGH.DISABLED[ts]) {
                return this.getSafetyTempDefaults().high;
            } else {
                return val;
            }
        },
        getWires: function () {
            return this.get('hvac_wires') || '';
        },
        hasAC: function () {
            if (this.hasCapabilityLevel(1.03)) {
                return this.attributes.can_cool || false;
            } else {
                return this.hasPin('Y1');
            }
        },
        hasX2AC: function () {
            return this.attributes.has_x2_cool || false;
        },
        hasAux: function () {
            if (this.hasCapabilityLevel(1.03)) {
                return this.attributes.has_aux_heat || false;
            } else {
                return (this.hasOB() && (this.hasPin('Aux') || this.hasPin('W1')));
            }
        },
        hasCapabilityLevel: function (v) {
            var c = this.attributes.capability_level || 0;
            return (c >= v);
        },
        hasEnergyData: function () {
            var days = this.getField('energy_latest').days || [];
            return days && days.length;
        },
        hasFan: function () {
            if (this.hasCapabilityLevel(1.01)) {
                return this.attributes.has_fan || false;
            } else {
                return this.hasPin('G');
            }
        },
        hasHeat: function () {
            if (this.hasCapabilityLevel(1.03)) {
                return this.attributes.can_heat || false;
            } else {
                return (!this.hasOB() && this.hasPin('W1') || this.hasOB() && this.hasPin('Y1'));
            }
        },
        hasX2Heat: function () {
            return this.attributes.has_x2_heat || false;
        },
        hasOB: function () {
            if (this.hasCapabilityLevel(1.03)) {
                return this.attributes.has_heat_pump || false;
            } else {
                return this.hasWire('OB');
            }
        },
        hasPin: function (p) {
            var pins = this.getPins();
            return (pins && _.indexOf(pins.toLowerCase().split(','), p.toLowerCase()) > -1);
        },
        hasPower: function () {
            return this.hasWire('Rh') || this.hasWire('Rc');
        },
        hasRange: function () {
            return this.hasAC() && this.hasHeat();
        },
        hasWire: function (w) {
            var wires = this.getWires();
            return (wires && _.indexOf(wires.toLowerCase().split(','), w.toLowerCase()) > -1);
        },
        invalidTargetTemperature: function () {
            return !N.isValidTemperature.apply(this, this.isModeRange() ? [this.get('target_temperature_low'), this.get('target_temperature_high')] : [this.get('target_temperature')]);
        },
        isAutoAway: function () {
            return this.isAway() && this.getStructure().isAutoAway() && this.isAutoAwayEnabled();
        },
        isAutoAwayEnabled: function () {
            var aae = this.get('auto_away_enable');
            return (aae === undefined) ? true : aae;
        },
        isAuxHeating: function () {
            return this.hasAux() && this.attributes.hvac_aux_heater_state;
        },
        isAway: function () {
            var s = this.getStructure();
            if (s.isAway()) {
                return this.isAutoAwayEnabled() ? true : !s.isAutoAway();
            }
            return false;
        },
        isAwayTempHighEnabled: function () {
            return this.hasCapabilityLevel(1.1) ? this.getField('away_temperature_high_enabled') : true;
        },
        isAwayTempLowEnabled: function () {
            return this.hasCapabilityLevel(1.1) ? this.getField('away_temperature_low_enabled') : true;
        },
        isConditioning: function () {
            return this.isHeating() || this.isCooling();
        },
        isCooling: function () {
            return !this.isSystemOff() && this.attributes.hvac_ac_state;
        },
        isFanCooling: function () {
            return this.attributes.fan_cooling_state;
        },
        isFanOn: function () {
            return String(this.attributes.fan_mode) === 'on';
        },
        isHeating: function () {
            return !this.isSystemOff() && (this.attributes.hvac_heater_state || this.attributes.hvac_aux_heater_state);
        },
        isHeatStage2: function () {
            return this.attributes.hvac_heat_x2_state;
        },
        isLeafOn: function () {
            return String(this.attributes.leaf) === 'true';
        },
        isLearning: function () {
            return this.get('learning_mode');
        },
        isLocked: function () {
            return String(this.attributes.temperature_lock) === 'true';
        },
        isModeCool: function () {
            return !this.isModeRange() && (this.attributes.target_temperature_type === 'cool');
        },
        isModeHeat: function () {
            return !this.isModeRange() && (this.attributes.target_temperature_type === 'heat');
        },
        isModeRange: function () {
            return (String(this.attributes.target_temperature_type) === 'range');
        },
        isOnline: function () {
            return String(this.attributes.online) === 'true';
        },
        isRangeEnabled: function () {
            return String(this.attributes.range_enable) === 'true';
        },
        isSystemOff: function () {
            return (String(this.attributes.target_temperature_type) === 'off');
        },
        remove: function () {
            var did = this.id,
                id = did.substr(1),
                url = C.API_PREFIX + '/device/remove/' + id;
            blacklist[id] = this;
            $(window).one(N.CZ.initialLoadEvent, function () {
                delete blacklist[id];
            });
            M.post(url);
            delete M.Cache[did];
        },
        save: function () {
            this.Super('save', this, arguments);
            var evt = this.transform._event.split('.');
            GA.trackEvent(evt.shift(), evt.join('.'));
            delete this.transform._event;
            return this;
        },
        setAwayTemperatureHigh: function (temp) {
            var t = Number.Nest.constrain(temp, this.getAwayMinMax().highMin, this.getAwayMinMax().highMax);
            this.set({
                'away_temperature_high': t
            });
            this.transform['_event'] = 'Console.setAwayTemperatureHigh';
            this.save();
            return this;
        },
        setAwayTemperatureLow: function (temp) {
            var t = Number.Nest.constrain(temp, this.getAwayMinMax().lowMin, this.getAwayMinMax().lowMax);
            this.set({
                'away_temperature_low': t
            });
            this.transform['_event'] = 'Console.setAwayTemperatureLow';
            this.save();
            return this;
        },
        setDataTemperatureEnabled: function (attr, enabled, temp) {
            var obj = {}, dataAttr = attr.replace(/_enabled$/, '');
            obj[attr] = enabled;
            if (enabled) {
                obj[dataAttr] = temp;
            }
            this.set(obj);
            this.transform['_event'] = 'Console.' + M._attrToSetter(attr);
            this.save();
            return this;
        },
        setField: function (attr, value, evt, forceSave) {
            attr = M._classToAttr(attr);
            if (value === this.getField(attr)) {
                return;
            }
            var func = {
                'brightness': 'user_brightness',
                'cool_when': this.setAwayTemperatureHigh,
                'heat_when': this.setAwayTemperatureLow,
                'target_temperature_type': this.setHVACMode
            }[attr] || this[M._attrToSetter(attr)] || attr;
            if (typeof func === 'function') {
                func.apply(this, [value]);
            } else {
                var obj = {};
                obj[func] = value;
                this.set(obj);
                evt = evt || (function (attr) {
                    var kw = attr.split('_'),
                        fw = 'Console.set';
                    fw = _.reduce(kw, function (memo, word) {
                        fw = fw + String.Nest.ucFirst(word);
                        return fw;
                    }, fw);
                    return fw;
                })(attr);
                this.transform['_event'] = evt;
                if (forceSave && _.isUndefined(this.transform[attr])) {
                    var self = this;
                    this.transform[attr] = function (v, k) {
                        delete self[k];
                        return v;
                    };
                }
                this.save();
            }
            return this;
        },
        setDeviceName: function (name) {
            if (name === this.get('name')) {
                return false;
            }
            this.set({
                'name': name
            });
            this.transform['_event'] = 'Console.editThermostatName';
            this.save();
            return this;
        },
        setHVACMode: function (mode) {
            var self = this,
                setHVAC = function (mode) {
                    self.set({
                        'target_temperature_type': mode
                    });
                    self.transform['_event'] = 'Console.setMode' + String.Nest.capitalize(mode);
                    return true;
                }, setOff = function () {
                    self.set({
                        'target_temperature_type': 'off'
                    });
                    self.transform['_event'] = 'Console.systemOff';
                    return true;
                }, setRange = function () {
                    self.set({
                        'learning_mode': false,
                        'target_temperature_type': 'range'
                    });
                    self.transform['_event'] = 'Console.setRangeMode';
                    return true;
                }, actions = {
                    'cool': setHVAC,
                    'heat': setHVAC,
                    'off': setOff,
                    'range': setRange
                }, am = actions[mode];
            if (am && am(mode)) {
                $(window).trigger(C.Events.HVAC_MODE_CHANGE, {
                    id: this.id
                });
                this.save();
            }
            return this;
        },
        setTargetTemperature: function (temp, evtName, attr) {
            attr = attr || 'target_temperature';
            var attrs = {};
            attrs[attr] = temp;
            this.set(attrs);
            this.transform['_event'] = 'Console.' + evtName;
            this.save();
            var imr = this.isModeRange(),
                hlh = !_.detect(['low', 'high'], function (x) {
                    return attr.indexOf(x) > -1;
                });
            if (imr === hlh) {
                N.warn('Models.setTargetTemperature: range mode =', imr, 'should not set', attr);
            }
            return this;
        },
        toDataTemperature: function (temp, constrain) {
            var sc = this.getTempScale(),
                t = N.dataTemperature(temp, sc),
                mm = this.getTempMinMax(),
                c = constrain || true,
                r = (c) ? Math.max(mm.min, Math.min(t, mm.max)) : t;
            return t;
        },
        toJSON: function () {
            var args = {}, self = this;
            _.each(this.transform, function (v, k) {
                var val = this.attributes[k];
                args[k] = (typeof v === 'function') ? v(val, self) : (v ? v : val);
            }, this);
            return args;
        },
        tempStepUp: function (attr) {
            attr = attr || 'target_temperature';
            var sc = this.getTempScale(),
                pf = (sc === 'F'),
                td = pf ? 1 : 0.5,
                ma = this.attributes,
                at = +ma[attr],
                t = N.dataTemperature(N.displayTemperature(at, sc) + td, sc),
                mm = this.getTempMinMax();
            t = Math.max(mm.min, Math.min(t, mm.max));
            if (attr === 'target_temperature_low') {
                var th = N.dataTemperature(N.displayTemperature(ma['target_temperature_high'], sc), sc);
                if ((th - t) < this.getMinRangeSpread()) {
                    if (th >= mm.max) {
                        return this;
                    }
                    this.tempStepUp('target_temperature_high');
                }
            } else if (t === at) {
                return this;
            }
            this.setTargetTemperature(t, 'setTempWarmer', attr);
            return this;
        },
        tempStepDown: function (attr) {
            attr = attr || 'target_temperature';
            var sc = this.getTempScale(),
                pf = (sc === 'F'),
                td = pf ? 1 : 0.5,
                ma = this.attributes,
                at = +ma[attr],
                t = N.dataTemperature(N.displayTemperature(at, sc) - td, sc),
                mm = this.getTempMinMax();
            t = Math.max(mm.min, Math.min(t, mm.max));
            if (attr === 'target_temperature_high') {
                var tl = N.dataTemperature(N.displayTemperature(ma['target_temperature_low'], sc), sc);
                if ((t - tl) < this.getMinRangeSpread()) {
                    if (tl <= mm.min) {
                        return this;
                    }
                    this.tempStepDown('target_temperature_low');
                }
            } else if (t === at) {
                return this;
            }
            this.setTargetTemperature(t, 'setTempCooler', attr);
            return this;
        },
        transform: {
            'auto_away_enable': 0,
            'auto_away_reset': 0,
            'away_temperature_high': 0,
            'away_temperature_high_enabled': 0,
            'away_temperature_low': 0,
            'away_temperature_low_enabled': 0,
            'fan_mode': 0,
            'heat_pump_aux_threshold': 0,
            'heat_pump_aux_threshold_enabled': 0,
            'learning_mode': 0,
            'lower_safety_temp': 0,
            'lower_safety_temp_enabled': 0,
            'mac_address': 0,
            'model_version': 0,
            'name': 0,
            'range_mode': 0,
            'switch_system_off': 0,
            'target_temperature': 0,
            'target_temperature_high': 0,
            'target_temperature_low': 0,
            'target_temperature_type': 0,
            'temperature_lock': 0,
            'temperature_scale': 0,
            'upper_safety_temp': 0,
            'upper_safety_temp_enabled': 0
        },
        url: function () {
            return C.API_PREFIX + '/device/' + this.attributes.id;
        },
        view: function () {
            return C.getView(this.id);
        }
    });
    M.Schedule = Backbone.Model.extend({
        Super: Function.Super(Backbone.Model, 'Schedule'),
        getStructure: function () {
            return this.device.getStructure();
        },
        initialize: function (args, device) {
            this.instance = ++scheduleCount;
            this.device = device;
            this.deviceId = device.id;
            this.id = 'schedule_' + this.deviceId;
            this.czid = 'schedule.' + device.attributes.id;
            var self = M.Cache[this.id] = this,
                timeSort = function (a, b) {
                    return (a.time - b.time);
                };
            _.each(self.attributes.days, function (day, idx) {
                var srt = _.toArray(day).sort(timeSort),
                    nobj = {};
                for (var i = 0, n = srt.length; i < n; i++) {
                    nobj[i] = srt[i];
                }
                self.attributes.days[idx] = nobj;
            });
            return this.Super('initialize', this, arguments);
        },
        save: function () {
            this.Super('save', this, arguments);
            var evt = this.transform._event.split('.');
            GA.trackEvent(evt.shift(), evt.join('.'));
            delete this.transform._event;
            return this;
        },
        setSchedule: function (days, evtName) {
            this.set({
                'days': days
            });
            this.transform['_event'] = 'Console.' + evtName;
            this.save();
            return this;
        },
        toJSON: function (iscz) {
            var args = {}, self = this;
            _.each(this.transform, function (transform, k) {
                var val = this.attributes[k];
                if (iscz) {
                    args[k] = val;
                } else {
                    args[k] = (typeof transform === 'function') ? transform(val, self) : (transform ? transform : val);
                }
            }, this);
            return args;
        },
        transform: {
            'days': function (val, model) {
                var ma = model.attributes;
                return {
                    'manual_schedule': {
                        'days': $.toJSON(val),
                        'name': ma.name,
                        'schedule_mode': ma.schedule_mode,
                        'ver': 0
                    }
                };
            },
            'name': 0,
            'schedule_mode': 0,
            'ver': 0
        },
        url: function () {
            return C.API_PREFIX + '/device/schedule/' + this.deviceId.substr(1);
        }
    });
    M.StructureCollection = Backbone.Collection.extend({
        Super: Function.Super(Backbone.Collection, 'StructureCollection'),
        fetch: function (options) {
            return this.Super('fetch', this, arguments);
        },
        parse: function (response) {
            return this.Super('parse', this, arguments);
        },
        model: M.Structure,
        onRead: function (success, error) {
            N.CZ.readStructures(success, error);
        },
        onSync: function () {
            this.sort();
        },
        refresh: function (models, options) {
            var args = _.toArray(arguments);
            args[0] = _.toArray(models);
            return this.Super('refresh', this, args);
        },
        sort: function () {
            this.models.sort(N.sortByCreationTime);
            _.each(this.models, function (v, k) {
                if (v.devices) {
                    v.devices.models.sort(N.sortByCreationTime);
                }
            });
        },
        url: function () {
            var t = (new Date()).getTime();
            return C.API_PREFIX + '/account/' + C.USER_ID + '/structures?_escape_html=1&_t=' + t;
        }
    });
    M.DeviceCollection = Backbone.Collection.extend({
        Super: Function.Super(Backbone.Collection, 'DeviceCollection'),
        model: M.Device,
        refresh: function (models, options) {
            var args = _.toArray(arguments);
            args[0] = _.toArray(models);
            return this.Super('refresh', this, args);
        }
    });
    M.EnergyHistory = Backbone.Model.extend({
        Super: Function.Super(Backbone.Model, 'EnergyHistory'),
        initialize: function () {
            return this.Super('initialize', this, arguments);
        },
        save: function () {
            N.error('Nest.Models.EnergyHistory is read-only.');
            return this;
        }
    });
    M._requestObj = {
        error: function (xhr, status, error) {
            N.error('Connectivity: Unknown error: ' + JSON.stringify(xhr) + ' ' + (status || error));
            $(window).trigger(N.CZ.networkError, xhr);
        },
        errorHandler: function (xhr, status, error) {
            N.warn('Connectivity: Authorization error: ' + JSON.stringify(xhr) + ' ' + (status || error));
            $(window).trigger(N.CZ.authError, xhr);
        }
    };
    M._requestObj.statusCode = {
        401: M._requestObj.errorHandler,
        403: M._requestObj.errorHandler,
        404: M._requestObj.errorHandler
    };
    M.ajax = function (url, set) {
        var settings = set || {}, obj = $.extend(M._requestObj, settings);
        return $.ajax(url, obj);
    };
    M.post = function (url) {
        return M.ajax(url, {
            type: 'POST'
        });
    };
    M.Cache = {};
    M.Cache.get = M.getModel = function (id) {
        return M.Cache[id];
    };
    M.Cache.numDevices = function (sid) {
        var collection = M.Cache,
            s = null;
        if (sid) {
            s = M.Cache.get(sid);
            if (s) {
                var d = s.devices || {};
                collection = d.models || [];
            }
        }
        var numd = _.reduce(collection, function (m, v) {
            return (v.className === 'device') ? m + 1 : m;
        }, 0);
        N.log('Models.numDevices:', numd, 'devices in', (s ? 'structure ' + sid : 'account'));
        return numd;
    };
    M.Cache.numStructures = function () {
        var nums = _.reduce(M.Cache, function (m, v) {
            return (v.className === 'structure') ? m + 1 : m;
        }, 0);
        N.log('Models.numStructures:', nums, 'structures in account');
        return nums;
    };
    M._classToAttr = function (a) {
        return a.replace(/-/g, '_');
    };
    M._attrToSetter = function (n, i) {
        var sn = 'set' + String.Nest.ucFirst(n);
        while ((i = sn.indexOf('_')) > -1) {
            sn = sn.substr(0, i) + String.Nest.ucFirst(sn.substr(i + 1));
        }
        return sn;
    };
    M.scheduleUpdate = function (callback) {
        window.clearTimeout(M.scheduleUpdate._id);
        M.scheduleUpdate._id = window.setTimeout(callback, 500);
    };
    M.deviceFieldMap = {
        device: {
            auto_away_enable: 0,
            auto_away_reset: 0,
            away_temperature_high: 0,
            away_temperature_high_enabled: 0,
            away_temperature_low: 0,
            away_temperature_low_enabled: 0,
            click_sound: 0,
            equipment_type: 0,
            fan_mode: 0,
            forced_air: 0,
            heat_pump_aux_threshold: 0,
            heat_pump_aux_threshold_enabled: 0,
            heat_pump_comp_threshold: 0,
            heat_pump_comp_threshold_enabled: 0,
            learning_mode: 0,
            lower_safety_temp: 0,
            lower_safety_temp_enabled: 0,
            ob_orientation: 0,
            range_enable: 0,
            schedule_learning_reset: 0,
            switch_preconditioning_control: 0,
            temperature_lock: 0,
            temperature_scale: 0,
            upper_safety_temp: 0,
            upper_safety_temp_enabled: 0,
            user_brightness: 0
        },
        shared: {
            name: 0,
            target_change_pending: 0,
            target_temperature: 0,
            target_temperature_high: 0,
            target_temperature_low: 0,
            target_temperature_type: 0
        }
    };
    var sync_super = Backbone.sync;
    Backbone.sync = function (method, model, success, error) {
        var CZ = N.CZ;
        if (model.onSync) {
            model.onSync();
        }
        if (method === 'read') {
            if (model.onRead) {
                return model.onRead(success, error);
            } else {
                return sync_super(method, model, success, error);
            }
        } else if (method === 'update') {
            var czid = model.czid;
            if (!czid) {
                return sync_super(method, model, success, error);
            }
            var data = _.clone(model.toJSON(true)),
                czModel = CZ.getModel(),
                keyparts = czid.split('.'),
                type = keyparts[0],
                id = keyparts[1],
                mymodel;
            delete data._event;
            if (model instanceof M.Device) {
                var body = CZ.editList = CZ.editList || {};
                _.each(M.deviceFieldMap, function (fields, bucket) {
                    if (czModel) {
                        mymodel = czModel[bucket][id];
                    }
                    _.each(fields, function (v, field) {
                        var val = data[field];
                        if ((val === undefined) || (mymodel && (mymodel[field] === val))) {
                            return;
                        }
                        if (!body[bucket]) {
                            body[bucket] = {};
                        }
                        if (!body[bucket][id]) {
                            body[bucket][id] = {};
                        }
                        body[bucket][id][field] = val;
                        if (mymodel) {
                            mymodel[field] = val;
                            CZ.touchModel(bucket + '.' + id + '.' + field);
                        }
                    });
                });
                M.scheduleUpdate(function () {
                    CZ.updateBucket(body, czid, {
                        multiput: true
                    }, function (data) {
                        CZ.editList = null;
                        if (success) {
                            success(data);
                        }
                    }, error);
                });
            } else if (czModel) {
                mymodel = czModel[type][id];
                _.each(data, function (v, field) {
                    mymodel[field] = data[field];
                    CZ.touchModel(type + '.' + id + '.' + field);
                });
                var options = {};
                if (model instanceof M.Schedule) {
                    options.override = true;
                }
                CZ.updateBucket(data, czid, options, success, error);
            }
        }
    };
})(window.jQuery, window._, window.Backbone);
(function ($, _, Backbone, Globalize, undefined) {
    'use strict';
    var N = window.Nest,
        A = N.Animate,
        GA = N.GoogleAnalytics,
        _L = N.Localization.namespace('Console');
    var C = N.Console = N.Console || {}, D = C.Details = C.Details || {}, K = C.Control = C.Control || {}, W = C.Weather = C.Weather || {};
    _.templateSettings = {
        interpolate: /\[\[(.+?)\]\]/g
    };
    C.CLOUD_CONFIG = {};
    C.TOS_ACCEPTED = false;
    C.PREF_NAMESPACE = 'Console';
    C.Prefs = {
        SELECTED_VIEW: 'selvw'
    };
    C.Events = {
        DISMISS_PASSPHRASE_PAIRING: 'nest-console-dismiss-passphrase-pairing',
        HVAC_MODE_CHANGE: 'nest-console-hvac-mode-change',
        NOTIFICATION_PENDING: 'nest-console-notification-pending',
        REQUEST_PASSPHRASE_PAIRING: 'nest-console-request-passphrase-pairing',
        REQUEST_AUTO_PAIRING: 'nest-console-request-auto-pairing',
        STAGE_DESELECT_VIEW: 'nest-console-stage-deselect-view',
        STAGE_READY: 'nest-console-stage-ready',
        STAGE_SELECT_VIEW: 'nest-console-stage-select-view',
        STAGE_UPDATE_VIEW: 'nest-console-stage-update-view',
        STAGE_NEW_STRUCTURE: 'nest-console-stage-new-structure',
        USER_DATA: 'nest-console-user-data',
        USER_RETURN: 'nest-console-user-return',
        USER_SETTINGS_DATA: 'nest-console-user-settings-data',
        WEATHER_RENDER: 'nest-console-weather-render'
    };
    K.sessionStart = new Date();
    K.controller = null;
    K.currentScreen = 1;
    K.animation = {
        duration: 405,
        infoschnack: {
            duration: 110
        },
        snapback: {
            distance: 4,
            duration: 45
        }
    };
    K.elHome = null;
    K.windowLoaded = false;
    K.loadingSequenceComplete = false;
    K.initialSelectionMade = false;
    K.keydownHandler = function (event) {
        var kc = event.keyCode;
        if (kc === 8) {
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    };
    K.addStructure = function () {
        GA.trackEvent('Console', 'addStructure');
        _.delay(function () {
            window.alert('Adding Structures is Disabled\nPending CZ Deployment');
        });
    };
    K.logout = function () {
        GA.trackEvent('Console', 'logOut');
        _.delay(function () {
            document.location.href = '/accounts/logout/';
        });
    };
    K.center = function (container) {
        var c = $(container || document.body),
            w = c.width(),
            h = c.height(),
            items = $('.centered', c);
        _.each(items, function (v, k) {
            var elem = $(v),
                iw = elem.width(),
                ih = elem.height(),
                cls = v.className,
                mx = cls.match(/\bmx\-(\S+)\b/),
                dx = cls.match(/\bdx\-(\S+)\b/),
                my = cls.match(/\bmy\-(\S+)\b/),
                dy = cls.match(/\bdy\-(\S+)\b/);
            mx = mx && mx[1] && parseFloat(mx[1], 10) || 1;
            my = my && my[1] && parseFloat(my[1], 10) || 1;
            elem.css({
                left: ((w - iw) / 2) * mx + ((dx && dx[1]) || 0),
                top: ((h - ih) / 2) * my + ((dy && dy[1]) || 0)
            });
        });
    };
    $(window).bind('load', function () {
        N.log('Control.load');
        $('#_TMPL').css({
            display: 'none'
        }).css({
            opacity: 0
        });
        K.elHome = $('#home', $('#container'));
        Backbone.emulateHTTP = true;
        Backbone.emulateJSON = true;
        K.start();
    }).bind(C.Events.WEATHER_RENDER, function () {
        var hs = $('#houses_stage');
        if (hs.length) {
            N.wait(75).then(function () {
                hs.animate({
                    opacity: 1
                }, 1200);
            });
            $(window).unbind(C.Events.WEATHER_RENDER);
        } else {
            window.setTimeout(function () {
                $(window).trigger(C.Events.WEATHER_RENDER);
            }, 500);
        }
    });
    K.start = function () {
        N.log('Control.start');
        K.start.subscribeFailures = 0;
        $(window).bind('doubletap', function (event) {
            event.preventDefault();
            event.stopPropagation();
            N.log('Control.start: doubletap trap.');
            return false;
        }, $.noop, 400).bind(N.CZ.transportURLChanged, function (event) {
            C.Schnack.hide();
            $('#home').animate({
                opacity: 0
            }, 750, function () {
                C.Schnack.show({
                    html: $('#_TMPL #cz_server_update').html(),
                    type: 'blocking'
                });
                N.wait(8000).then(function () {
                    $('#main').animate({
                        opacity: 0
                    }, 1500, function () {
                        window.location.reload();
                    });
                });
            });
        }).bind(N.CZ.newDataEvent, function () {
            C.App.fetch();
        }).bind(N.CZ.networkError, function (event) {
            K.start.subscribeFailures++;
            if (K.start.subscribeFailures >= 5) {
                C.Schnack.hide();
                $('#home').animate({
                    opacity: 0
                }, 750, function () {
                    C.Schnack.show({
                        html: $('#_TMPL #cz_subscribe_failed').html(),
                        type: 'blocking'
                    });
                });
            }
        }).bind(N.CZ.subscribeDoneEvent, function (event) {
            var schnack = $('.schnack-bubble');
            if ($('.cz-subscribe-failed', schnack).length) {
                K.start.subscribeFailures = 0;
                schnack.animate({
                    animate: 0
                }, 200, function () {
                    C.Schnack.hide();
                    $('#home').animate({
                        opacity: 1
                    }, 600);
                });
            }
        }).bind(N.CZ.deviceTrackEvent, function (event, data) {
            C.getView('d' + data.id).render();
            C.Details.refresh(true);
        }).bind(N.CZ.objectAddEvent, function (event, data) {
            C.selectView(((data.type === 'device') ? 'd' : 's') + data.id);
        }).bind(N.CZ.objectRemoveEvent, function (event, data) {
            C.removeView(((data.type === 'device') ? 'd' : 's') + data.id);
        }).bind(N.CZ.authError, function (event, data) {
            C.Schnack.hide();
            $('#home').animate({
                opacity: 0
            }, 750, function () {
                C.Schnack.show({
                    html: $('#_TMPL #cz_auth_update').html(),
                    type: 'blocking'
                });
                N.wait(8000).then(function () {
                    $('#main').animate({
                        opacity: 0
                    }, 1500, function () {
                        window.location = '/accounts/login/?next=/home';
                    });
                });
            });
        }).bind(C.Events.USER_SETTINGS_DATA, function (event, data) {
            if (!data) {
                return;
            }
            var tav = data.tos_accepted_version || 0,
                mtos = data.tos_minimum_version || 0,
                tosa = mtos && (tav >= mtos);
            C.TOS_ACCEPTED = tosa;
            _.each(['max_structures', 'max_thermostats', 'max_thermostats_per_structure'], function (v, k) {
                if (!_.isUndefined(data[v])) {
                    C.CLOUD_CONFIG[v] = data[v];
                }
            });
        }).bind([N.CZ.initialLoadEvent, N.CZ.updateDoneEvent, N.CZ.subscribeDoneEvent, N.CZ.deviceTrackEvent, N.CZ.newDataEvent, N.CZ.objectAddEvent, N.CZ.objectRemoveEvent, N.CZ.networkError, N.CZ.transportURLChanged].join(' '), function (event, arg) {
            N.log('Transport [' + event.type + (arg ? (' ' + JSON.stringify(arg)) : '') + ']');
        }).bind('hashchange', function () {
            if (window.location.hash.length > 0) {
                K.deepLinkSelect();
            }
        });
        window.setInterval(function () {
            K.start.subscribeFailures = Math.max(0, --K.start.subscribeFailures);
        }, 60000);
        var win = $(window),
            showHeader = function () {
                N.log('Control.showHeader');
                var header = $('header').first();
                header.bind('click', function (event) {
                    event.stopPropagation();
                });
                C.AccountTray.init();
                A.animate(header, {
                    top: 0
                }, 925).then(function () {
                    C.loadApp();
                    K.windowLoaded = true;
                });
            };
        win.bind('resize', function () {
            K.center(document.body);
        });
        $('.structures', K.elHome).draggable({
            start: function (event) {
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
        });
        K.elHome.show();
        showHeader();
    };
    K.ready = function () {
        if (!K.windowLoaded) {
            if (K.abortLoad) {
                N.error('Nest.Console.Control: fatal error, loading sequence aborted.');
                return;
            }
            var itv = 100;
            return window.setTimeout(function () {
                K.ready();
            }, itv);
        }
        if ($('#home .structure').length === 0) {
            return N.wait(500).then(K.ready);
        }
        N.log('Control.ready');
        N.logTiming('Console');
        if ($('#main .weather-panel').length === 0) {
            W.renderWeather();
        }
        K.hideLoading().then(function () {
            if (!C.App) {
                return;
            }
            K.deepLinkSelect();
        });
        K.exposeHiddenElements();
    };
    K.deepLinkSelect = function (args) {
        var navHandlers = {
            'account': C.AccountTray.deepLinkSelect,
            'energy': C.Details.deepLinkSelect,
            'schedule': C.Details.deepLinkSelect,
            'settings': C.Details.deepLinkSelect,
            'support': C.Details.deepLinkSelect,
            'undefined': function (nav, sub) {
                return $.when($.noop);
            }
        }, sel = args ? args.sel : N.HashString('sel') || N.QueryString('sel'),
            nav = args ? args.nav : N.HashString('nav') || N.QueryString('nav'),
            sub = args ? args.sub : N.HashString('sub') || N.QueryString('sub'),
            selStage = sel && C.getView(sel),
            selFunc = function () {
                if (selStage) {
                    return C.selectView(sel);
                } else {
                    return C.selectDefaultView();
                }
            }, tabFunc = function () {
                return navHandlers[nav](nav, sub);
            }, readyFunc = function () {
                $(window).trigger(C.Events.STAGE_READY);
            };
        selFunc().then(function () {
            $('#selection_arrow').animate({
                opacity: 1.0
            }, 250);
            K.initialSelectionMade = true;
            if (!sel || selStage) {
                $.when(tabFunc()).then(readyFunc);
            } else {
                readyFunc();
            }
        });
    };
    K.exposeHiddenElements = function (instant) {
        var se = $('.status, .details, .structures', K.elHome),
            op = {
                opacity: 1.0
            };
        if (instant) {
            se.css(op);
        } else {
            se.animate(op, 1000, function () {
                K.loadingSequenceComplete = true;
            });
        }
    };
    K.hideLoading = function (skipAnimation) {
        K.hideLoading = $.noop;
        N.log('Control.hideLoading', _.toArray(arguments));
        var dfr = $.Deferred(),
            timing = skipAnimation ? 1 : 250;
        return A.animate($('.loading', K.elHome), {
            opacity: 0
        }, timing, function () {
            $('#home .loading, #digits').remove();
        });
    };
})(window.jQuery, window._, window.Backbone, window.Globalize);
(function ($, _, Backbone, undefined) {
    'use strict';
    var HOUSE_WIDTH = 322,
        HOUSE_HEIGHT = 220,
        MARGIN_WIDTH = 40,
        HOUSE_CENTER = 159,
        DEVICE_WIDTH_LARGE = 240,
        DEVICE_WIDTH = 74,
        DEVICE_HEIGHT = 74,
        HOUSE_SELECT_Y_OFFSET = 80;
    var N = window.Nest,
        _L = N.Localization.namespace('Console'),
        M = N.Models,
        A = N.Animate = N.Animate || {}, C = N.Console = N.Console || {}, GA = N.GoogleAnalytics,
        CT = C.Toggle = C.Toggle || {}, D = C.Details = C.Details || {}, K = C.Control = C.Control || {}, Sn = C.Schnack = C.Schnack || {}, W = C.Weather = C.Weather || {}, VM = C.ViewManager = {};
    C.COLOR = {
        BLACK_BOTTOM: '#252A2E',
        BLACK_TOP: '#0F1012',
        BLUE_BOTTOM: '#0252E5',
        BLUE_TOP: '#1D92F2',
        GRAY: '#B7B7B7',
        GREEN: '#3FEF2D',
        LEAF_GREEN: '#3FEF2D',
        ORANGE_BOTTOM: '#FF2200',
        ORANGE_TOP: '#FE7403',
        WHITE: '#FFFFFF'
    };
    C.AIRWAVE_CHAR = '\uE02E';
    C.ARROW_DOWN_CHAR = '\u2304';
    C.ARROW_UP_CHAR = '\u2303';
    C.BULLET_CHAR = '\u2022';
    C.FAN_CHAR = '\uE014';
    C.LEAF_CHAR = '\uE002';
    C.LOCK_CHAR = '\uE001';
    C.UNLOCK_CHAR = '\uE01A';
    C.AIRWAVE_SIZE = 11.1;
    C.FAN_SIZE = 11.296;
    C.LEAF_SIZE = 8.1;
    C.getView = function (id) {
        return C.App.views[id];
    };
    C.getSelectedViewID = function () {
        return VM.selectedViewID;
    };
    C.getSelectedView = function () {
        return C.getView(C.getSelectedViewID() || (C.App.structures.models[0] && C.App.structures.models[0].id));
    };
    C.removeView = function (id) {
        return VM.remove(id);
    };
    C.selectView = function (id) {
        return VM.selectByID(id);
    };
    C.selectDefaultView = function () {
        if (VM.selectByID.currentAnim !== null) {
            return VM.selectByID.currentAnim;
        }
        VM.selectedViewID = null;
        var sid = _.first(_.pluck(C.App.structures.models, 'id'));
        return C.selectView(sid);
    };
    C.newAccount = function () {
        var vws = C.App.views;
        return _.all(vws, function (v, k) {
            var pc = v.getModel().get('postal_code');
            return !pc;
        });
    };
    C.noDevices = function () {
        var vws = C.App.views;
        return _.all(vws, function (v, k) {
            var cn = v.className;
            return !cn || cn !== 'device';
        });
    };
    VM.selectedViewID = null;
    VM.selectByID = function (id) {
        if (VM.selectByID.currentAnim !== null) {
            return VM.selectByID.currentAnim;
        }
        var dfr = $.Deferred(),
            oldView = $('#' + VM.selectedViewID).length ? C.getView(VM.selectedViewID) : null,
            oldStructureID = oldView && oldView.getStructureID(),
            oldIsStructure = (oldView && (oldView.className === 'structure')),
            newView = C.getView(id);
        if (!newView) {
            N.warn('Console.ViewManager.selectByID: no view with id', id);
            return dfr.resolve().promise();
        }
        var newIsStructure = (newView.className === 'structure'),
            newIsSameStructure = (oldStructureID === newView.getStructureID());
        if (oldView !== newView) {
            VM.selectByID.currentAnim = dfr.promise();
            var finish = function () {
                N.wait(125).then(function () {
                    VM.selectByID.currentAnim = null;
                });
                dfr.resolve();
                $(window).trigger(C.Events.STAGE_SELECT_VIEW, newView);
            }, movePointer = function () {
                C.Scroller.resized = true;
                VM.selectedViewID = newView.id;
                return C.Selector.moveTo(newView.getCenter());
            }, announceDeselect = function () {
                Sn.showDeviceOfflineWarning.hide();
                $(window).trigger(C.Events.STAGE_DESELECT_VIEW, newView);
            }, closeDetailsPanel = function () {
                var dfr = $.Deferred();
                D.exitDetailsPanel().then(function () {
                    announceDeselect();
                    dfr.resolve();
                });
                return dfr.promise();
            }, hideSelected = function () {
                var dfr = $.Deferred();
                closeDetailsPanel().then(function () {
                    oldView.deselect().then(dfr.resolve);
                });
                return dfr.promise();
            }, hideStructure = function () {
                var dfr = $.Deferred();
                closeDetailsPanel().then(function () {
                    oldView.getStructureView().deselect().then(dfr.resolve);
                });
                return dfr.promise();
            }, openStructure = function () {
                return newView.getStructureView().select();
            }, selectNew = function () {
                movePointer();
                return newView.select().then(finish);
            };
            if (oldIsStructure) {
                if (newIsStructure) {
                    hideSelected().then(selectNew);
                } else if (newIsSameStructure) {
                    closeDetailsPanel().then(selectNew);
                } else {
                    hideSelected().then(function () {
                        openStructure().then(selectNew);
                    });
                }
            } else if (oldView) {
                if (newIsStructure) {
                    if (newIsSameStructure) {
                        hideSelected().then(selectNew);
                    } else {
                        hideStructure().then(selectNew);
                    }
                } else {
                    if (newIsSameStructure) {
                        hideSelected().then(selectNew);
                    } else {
                        hideStructure().then(function () {
                            openStructure().then(selectNew);
                        });
                    }
                }
            } else {
                if (newIsStructure) {
                    selectNew();
                } else {
                    openStructure().then(selectNew);
                }
            }
        } else {
            return dfr.resolve().promise();
        }
        N.Cookie.set(C.Prefs.SELECTED_VIEW, id, C.PREF_NAMESPACE);
        return dfr.promise();
    };
    VM.selectByID.currentAnim = null;
    VM.remove = function (id) {
        var view = C.getView(id);
        return view.remove();
    };
    VM.insertDevice = function (id) {
        N.log('Console.ViewManager.insertDevice');
        var dfr = $.Deferred(),
            v = C.getView(id);
        v.render().addView().then(function () {
            C.getSelectedView().render();
            v.getStructureView().getWeather();
        });
        _.defer(function () {
            dfr.resolve();
        });
        return dfr.promise();
    };
    VM.stageLoaded = false;
    $(window).one(C.Events.STAGE_READY, function () {
        VM.stageLoaded = true;
    });
    C.SelectorView = Backbone.View.extend({
        id: '#selection_arrow',
        sw: '#selection_arrow_inner',
        initialize: function () {
            this.render();
        },
        render: function () {
            $('#houses_stage').append('<div id="selection_arrow_wrapper"><div id="selection_arrow_inner"><div id="selection_arrow"></div></div></div>');
        },
        moveTo: function (px) {
            var dfr = $.Deferred(),
                structures = $('.structure').length,
                v = C.getSelectedView(),
                m = v.getModel(),
                devices = $('.device', v.getStructureView().elem()).length,
                stageWidth = (structures * HOUSE_WIDTH / 2) + HOUSE_WIDTH / 2 + (devices * (DEVICE_WIDTH + MARGIN_WIDTH));
            if ((v.className === 'device') && !(v.isOffline || m.invalidTargetTemperature())) {
                stageWidth += (DEVICE_WIDTH_LARGE - DEVICE_WIDTH);
            }
            $(this.sw).animate({
                width: stageWidth
            });
            $(this.id).animate({
                left: px
            }, function () {
                dfr.resolve();
            });
            return dfr.promise();
        }
    });
    C.Selector = new C.SelectorView();
    C.Scroller = {
        stage: $('#houses_stage'),
        resized: false,
        scrollAnimate: function (left, time) {
            if (D.isMoving) {
                return N.wait(750).then(function () {
                    C.Scroller.scrollAnimate(left, time);
                });
            }
            $(this.stage).clearQueue().animate({
                scrollLeft: left
            }, time, "linear");
        },
        initialize: function () {
            var self = this;
            self.lastHouse = $('.structures').find('.structure:last-child');
            this.stage.mousemove(function (e) {
                if (self.lastHouse[0]) {
                    var stageWidth = self.stage.width();
                    var wrapperWidth = self.lastHouse[0].offsetLeft + self.lastHouse.outerWidth();
                    var left = (e.pageX - self.stage.offset().left) * (wrapperWidth - stageWidth) / stageWidth;
                    var scrollDiff = Math.abs(left - self.stage.scrollLeft());
                    if (!self.stage.queue().length) {
                        if (self.resized) {
                            self.scrollAnimate(left, scrollDiff);
                            self.resized = false;
                        } else {
                            self.stage.scrollLeft(left);
                        }
                    }
                }
            });
            this.stage.mouseenter(function (e) {
                self.lastHouse = $('.structures').find('.structure:last-child');
                if (self.lastHouse[0]) {
                    var stageWidth = self.stage.width();
                    var wrapperWidth = self.lastHouse[0].offsetLeft + self.lastHouse.outerWidth();
                    var left = (e.pageX - self.stage.offset().left) * (wrapperWidth - stageWidth) / stageWidth;
                    var scrollDiff = Math.abs(left - self.stage.scrollLeft());
                    self.scrollAnimate(left, scrollDiff);
                }
            });
        }
    };
    C.Scroller.initialize();
    C.DeviceView = Backbone.View.extend({
        Super: Function.Super(Backbone.View, 'DeviceView'),
        className: 'device',
        tagName: 'div',
        isOffline: false,
        initialize: function (args) {
            this.className = 'device';
            this.isOffline = !this.getModel().attributes.online;
            this.Super('initialize', this, arguments);
            this.model.bind('change', this.render.bind(this));
            this.template = $('#device_template').html();
        },
        events: {
            "click": "handleClick"
        },
        addView: function () {
            var dfr = $.Deferred(),
                resolve = function () {
                    dfr.resolve();
                }, self = this,
                addClass = _.once(function () {
                    $(self.elem()).closest('.devices').addClass('open-devices');
                });
            if (!this.getStructureView().isOpen()) {
                _.defer(resolve);
                return dfr.promise();
            }
            $(this.el).width(DEVICE_WIDTH).height(DEVICE_HEIGHT).animate({
                marginLeft: MARGIN_WIDTH,
                opacity: 1
            }, function () {
                C.Selector.moveTo(C.getSelectedView().getCenter());
                $(this).children('.name,.temperature').fadeIn('fast');
                D.refresh(true);
                addClass();
                resolve();
            });
            return dfr.promise();
        },
        append: function () {
            var self = this,
                id = this.id,
                m = this.getModel(),
                ma = m.attributes,
                ct = ma.creation_time || 0;
            $(this.el).html(_.template(this.template, ma));
            var structure = $('#' + this.getStructureID()),
                house = $('.house', structure);
            var dvcs = $('.device', structure),
                target = _.detect(dvcs, function (v, k) {
                    var vct = M.getModel(v.id).attributes.creation_time || 0;
                    return (ct <= vct) && (id < v.id) && $(v);
                });
            if (target) {
                $(this.el).insertBefore(target);
            } else {
                $('.devices', structure).append(this.el);
            }
            return this.el;
        },
        checkOnlineStatus: function (showTimer) {
            if (_.isUndefined(showTimer)) {
                showTimer = 3000;
            }
            if (!C.DEAD_DEVICE_THRESHOLD) {
                this.isOffline = false;
                return this.isOffline;
            }
            var self = this,
                did = this.id,
                nows = new Date(),
                m = this.getModel(),
                ut = new Date(m.attributes.last_connection || 0),
                oldState = this.isOffline,
                newState = this.isOffline = !m.isOnline(),
                isSelected = (did === C.getSelectedViewID());
            if (this.isOffline) {
                var update = function () {
                    var vw = C.getView(did),
                        sv = C.getSelectedView();
                    if (!vw.elem().hasClass('offline')) {
                        vw.render();
                    }
                    if (vw.getStructureID() === (sv && sv.getStructureID())) {
                        if (showTimer !== 0) {
                            N.wait(showTimer).then(function () {
                                Sn.showDeviceOfflineWarning(vw, ut);
                            });
                        }
                    }
                };
                if (isSelected) {
                    C.Thermostat.hide().then(update);
                } else {
                    _.defer(update);
                }
            } else {
                if (isSelected) {
                    Sn.showDeviceOfflineWarning.hide(did);
                    if (newState !== oldState) {
                        C.Thermostat.show(this);
                    }
                }
            }
            return this.isOffline;
        },
        deselect: function () {
            var self = this,
                dfr = $.Deferred();
            C.Thermostat.hide().then(function () {
                self.elem().removeClass('selected-device');
                dfr.resolve();
            });
            return dfr.promise();
        },
        elem: function () {
            return $($('.structures #' + this.id).get(0) || this.append());
        },
        getCenter: function () {
            var houseView = this.getStructureView(),
                houseCenter = houseView.getCenter(),
                houseElem = houseView.elem(),
                devices = _.map($('.device', houseElem), function (item) {
                    return $(item).prop('id');
                }),
                index = _.indexOf(devices, this.id),
                margins = index * MARGIN_WIDTH,
                widths = index * DEVICE_WIDTH,
                thermMid = (this.isOffline || this.getModel().invalidTargetTemperature()) ? -16 : C.Thermostat.STAGE_WIDTH / 2;
            return houseCenter + widths + margins + thermMid - HOUSE_CENTER + HOUSE_WIDTH;
        },
        getDisplayName: function () {
            var max = 22,
                hm = Math.ceil(max / 2) + 1,
                name = this.getModel().getName() || 'Nest';
            if (name.length > max) {
                name = name.substr(0, max) + '\u2026';
            }
            var words = name.split(' ');
            name = _.map(words, function (v, k) {
                var vl = v.length;
                if (vl > hm) {
                    var vh = Math.ceil(hm / 1.5);
                    v = v.substr(0, vh) + ' ' + v.substr(vh);
                }
                return v;
            }).join(' ');
            return name;
        },
        getDisplayTemperature: function (temp, ignoreOffline) {
            var ts = this.getModel().getTempScale(),
                tv = N.displayTemperature(temp, ts);
            if (!ignoreOffline && this.isOffline) {
                tv = '?';
            } else if (ts.toUpperCase() === 'C') {
                if (!Number.Nest.isInteger(tv)) {
                    var frac = Math.round((tv - Math.floor(tv)) * 10);
                    tv = Math.floor(tv) + '<span class="fraction">' + frac + '</span>';
                }
            }
            return tv;
        },
        getField: function (name) {
            return this.getModel().getField(name);
        },
        getModel: function () {
            return M.Cache.get(this.model.id) || this.model;
        },
        getCurrentIconState: function () {
            var m = this.getModel(),
                color = '',
                icon = '',
                size = '';
            if (!this.isOffline) {
                if (m.isFanCooling()) {
                    color = C.COLOR.WHITE;
                    icon = C.AIRWAVE_CHAR;
                    size = C.AIRWAVE_SIZE;
                } else if (m.isFanOn() && !m.isSystemOff()) {
                    color = C.COLOR.WHITE;
                    icon = C.FAN_CHAR;
                    size = C.FAN_SIZE;
                } else if (m.isLeafOn()) {
                    color = C.COLOR.GREEN;
                    icon = C.LEAF_CHAR;
                    size = C.LEAF_SIZE;
                }
            }
            return {
                color: color,
                icon: icon,
                size: size
            };
        },
        getStructureID: function () {
            return this.getModel().getStructure().id;
        },
        getStructureView: function () {
            return C.getView(this.getStructureID());
        },
        handleClick: function (event) {
            event.stopPropagation();
            if (C.getSelectedViewID() === this.id) {
                this.checkOnlineStatus(1);
            } else {
                VM.selectByID(this.id);
            }
        },
        remove: function () {
            var self = this,
                dfr = $.Deferred();
            this.removeView().then(function () {
                delete C.App.views[self.id];
                M.getModel(self.id).remove();
                C.App.render();
                dfr.resolve();
            });
            return dfr.promise();
        },
        removeView: function () {
            var self = this,
                dfr = $.Deferred(),
                isSelected = (this.id === C.getSelectedViewID());
            C.Thermostat.hide().then(function () {
                N.wait(400).then(function () {
                    self.elem().animate({
                        opacity: 0
                    }).animate({
                        marginLeft: -DEVICE_WIDTH
                    }, _.once(function () {
                        self.elem().remove();
                        if (isSelected) {
                            C.selectView(self.getStructureID());
                        } else {
                            C.Selector.moveTo(C.getSelectedView().getCenter());
                        }
                        dfr.resolve();
                    }));
                });
            });
            return dfr.promise();
        },
        render: function () {
            this.checkOnlineStatus(0);
            var self = this,
                elem = this.elem(),
                auto = $('.auto', elem),
                m = this.model,
                sm = m.getStructure(),
                ma = m.attributes,
                name = $('.name', elem).html(this.getDisplayName()),
                cls = this.isOffline ? 'offline' : (m.isSystemOff() ? 'off' : (m.isHeating() ? 'heat' : (m.isCooling() || m.isFanCooling() ? 'cool' : 'off'))),
                dev = elem.removeClass('offline cool heat off').addClass(cls),
                temp = $('.temperature', elem),
                structure = $('#' + this.getStructureID()),
                md = ($('.device', structure).length > 1),
                ts = m.getTempScale(),
                tv = '?',
                imr = m.isModeRange(),
                dt;
            auto.hide();
            if (this.isOffline || m.invalidTargetTemperature()) {
                $('a', elem).css({
                    cursor: 'default'
                });
                elem.removeClass('range celsius');
                tv = '?';
                elem.removeClass('device-away device-off');
            } else if (m.isSystemOff()) {
                tv = _L('off').toUpperCase();
                elem.addClass('device-off').removeClass('device-away range celsius');
            } else if (m.isAway()) {
                var showAuto = m.isAutoAway();
                tv = _L('away').toUpperCase();
                elem.addClass('device-away').removeClass('device-off range celsius');
                if (showAuto) {
                    auto.show();
                }
            } else {
                $('a', elem).css({
                    cursor: 'pointer'
                });
                elem.toggleClass('range', imr);
                elem.toggleClass('celsius', (ts === 'C'));
                if (imr) {
                    var ttl = new N.Temperature(ma.target_temperature_low, ts),
                        tth = new N.Temperature(ma.target_temperature_high, ts);
                    tv = [ttl.js(), '<span class="sep">' + C.BULLET_CHAR + '</span>', tth.js()].join('');
                } else {
                    dt = new N.Temperature(ma.target_temperature, ts);
                    tv = dt.js();
                }
                elem.removeClass('device-away device-off');
            }
            temp.html(tv).toggleClass('single-digit', !imr && (dt < 10));
            var cis = this.getCurrentIconState();
            $('.icon', elem).html(cis.icon).css({
                color: cis.color,
                fontSize: cis.size + 'px'
            }).toggle(Boolean(cis.icon));
            this.update();
            K.exposeHiddenElements(true);
            return this;
        },
        select: function () {
            this.elem().addClass('selected-device');
            var self = this,
                dfr = $.Deferred(),
                elem = this.elem(),
                m = this.getModel(),
                ma = m.attributes;
            _.defer(function () {
                if (self.isOffline) {
                    var ot = new Date(ma.last_connection || 0);
                    Sn.showDeviceOfflineWarning(self, ot);
                    dfr.resolve();
                } else if (m.invalidTargetTemperature()) {
                    dfr.resolve();
                } else {
                    if ($('.schnack-bubble#device_offline').length) {
                        Sn.hide(event);
                    }
                    C.Thermostat.show(self).then(function () {
                        dfr.resolve();
                    });
                }
            });
            return dfr.promise();
        },
        setField: function (fieldName, value) {
            var model = this.getModel();
            M.Cache.get(model.id).setField.apply(model, [fieldName, value]);
            return this;
        },
        setName: function (name) {
            if (!this.getModel().setName(name)) {
                return false;
            }
            N.log('DeviceView.setName', name);
            this.render();
            return this;
        },
        tempDecrease: function (attr) {
            if (this.isOffline) {
                return;
            }
            this.getModel().tempStepDown(attr);
            this.render();
            return this;
        },
        tempIncrease: function (attr) {
            if (this.isOffline) {
                return;
            }
            this.getModel().tempStepUp(attr);
            this.render();
            return this;
        },
        update: function () {
            $(window).trigger(C.Events.STAGE_UPDATE_VIEW, this);
        }
    });
    C.DeviceView.addNew = function (sid) {
        var limits = C.CLOUD_CONFIG || {}, maxDevices = limits.max_thermostats || Infinity,
            maxDPS = limits.max_thermostats_per_structure || Infinity;
        if (M.Cache.numDevices() >= maxDevices) {
            Sn.showDeviceLimitDialog(maxDevices);
            GA.trackEvent('Console', 'maxDeviceLimitRequested', 'max_devices', maxDevices);
        } else if (M.Cache.numDevices(sid) >= maxDPS) {
            Sn.showDevicePerStructureLimitDialog(maxDPS);
            GA.trackEvent('Console', 'maxDevicePerStructureLimitRequested', 'max_devices', maxDPS);
        } else {
            $(window).trigger(C.Events.REQUEST_PASSPHRASE_PAIRING, {
                structure: C.getView(sid)
            });
        }
    };
    C.StructureView = Backbone.View.extend({
        Super: Function.Super(Backbone.View, 'StructureView'),
        baseHash: 'console',
        className: 'structure',
        isOffline: false,
        tagName: 'div',
        weather: null,
        schnack: null,
        initialize: function (args) {
            var self = this;
            this.className = 'structure';
            this.Super('initialize', this, arguments);
            this.model.bind('change', this.render.bind(this));
            this.template = $('#structure_template').html();
            this.getWeather();
            W.enablePolling(this.id, function () {
                C.App.views[self.id].getWeather();
            });
        },
        events: {
            "click": "handleClick"
        },
        append: function () {
            var self = this,
                m = this.getModel(),
                ma = _.extend({}, m.attributes),
                ct = ma.creation_time || 0,
                strs = $('#home .structures'),
                csh = $('.structure', strs),
                id = this.id;
            ma.display_location = this.getDisplayName();
            $(this.el).html(_.template(this.template, ma));
            var target = _.detect(csh, function (v, k) {
                var vct = M.getModel(v.id).attributes.creation_time || 0;
                return (ct <= vct) && (id < v.id) && $(v);
            });
            if (target) {
                $(this.el).insertBefore(target);
            } else {
                strs.append(this.el);
            }
            return this.el;
        },
        checkOnlineStatus: function (showTimer) {
            var model = this.getModel();
            this.isOffline = false;
            if (model.devices && model.devices.models && model.devices.models.length) {
                for (var m = 0, n = model.devices.models.length; m < n; m++) {
                    var view = C.getView(model.devices.models[m].id);
                    if (!view || !view.checkOnlineStatus(showTimer)) {
                        return this.isOffline;
                    }
                }
            }
            this.isOffline = true;
            return this.isOffline;
        },
        closeDevices: function () {
            var dfr = $.Deferred(),
                devices = $('.devices', this.elem()),
                finish = function () {
                    dfr.resolve();
                };
            devices.removeClass('open-devices');
            $.when($('.device', devices).children('.name,.temperature').hide().end().animate({
                height: 0,
                marginLeft: -DEVICE_WIDTH,
                opacity: 0,
                width: 0
            })).done(finish);
            return dfr.promise();
        },
        deselect: function () {
            var self = this,
                dfr = $.Deferred();
            C.Thermostat.hide().then(function () {
                var finish = _.after(2, function () {
                    dfr.resolve();
                });
                $('.house', self.elem()).animate({
                    top: '+=' + HOUSE_SELECT_Y_OFFSET,
                    width: HOUSE_WIDTH / 2,
                    height: HOUSE_HEIGHT / 2
                }, finish);
                self.closeDevices().then(finish);
            });
            this.setIsOpen(false);
            return dfr.promise();
        },
        elem: function () {
            return $($('.structures #' + this.id).get(0) || this.append());
        },
        getCenter: function () {
            var ids = _.map($('.structure'), function (el) {
                return el.id;
            }),
                index = _.indexOf(ids, this.id);
            return (index * (HOUSE_WIDTH / 2)) + HOUSE_CENTER;
        },
        getDevices: function () {
            return $('.device', this.elem());
        },
        getField: function (name) {
            return this.getModel().getField(name);
        },
        getModel: function () {
            return M.Cache.get(this.model.id) || this.model;
        },
        getDisplayName: function () {
            var am = this.model.attributes,
                locationAsName = function (displayLocation) {
                    return displayLocation.split(/\s*\n\s*/)[0].split(/\s*,\s*/)[0];
                }, name = this.model.getName() || locationAsName(am.display_location) || _L('home');
            return name;
        },
        getStructureID: function () {
            return this.id;
        },
        getStructureView: function () {
            return C.getView(this.id);
        },
        getWeather: function () {
            var ma = this.getModel().attributes,
                loc = ma.postal_code || ma.location;
            W.getForecastForStructure(loc, this.setWeather.bind(this));
        },
        handleClick: function (event) {
            if ($(event.target).hasClass('structure')) {
                return;
            }
            VM.selectByID(this.id);
        },
        isAway: function () {
            return this.getModel().attributes.away;
        },
        isOpen: function () {
            return this.elem().hasClass('isOpen');
        },
        openDevices: function () {
            var self = this,
                dfr = $.Deferred(),
                addClass = _.once(function () {
                    $('.devices', self.elem()).addClass('open-devices');
                    dfr.resolve();
                }),
                devices = this.getDevices();
            if (devices.length) {
                devices.each(function () {
                    $(this).width(DEVICE_WIDTH).height(DEVICE_HEIGHT).animate({
                        marginLeft: MARGIN_WIDTH,
                        opacity: 1
                    }, function () {
                        addClass();
                        $(this).children('.name,.temperature').fadeIn("fast");
                    });
                });
            } else {
                _.defer(function () {
                    dfr.resolve();
                });
            }
            return dfr.promise();
        },
        remove: function () {
            var self = this,
                dfr = $.Deferred();
            $(window).one(N.CZ.newDataEvent, function () {
                C.selectDefaultView();
            });
            W.disablePolling(self.id);
            this.removeView().then(function () {
                self.getModel().remove();
                dfr.resolve();
            });
            return dfr.promise();
        },
        removeView: function () {
            var self = this,
                dfr = $.Deferred();
            self.elem().animate({
                opacity: 0
            }).animate({
                width: 0
            }, _.once(function () {
                self.elem().remove();
                dfr.resolve();
            }));
            return dfr.promise();
        },
        render: function () {
            this.checkOnlineStatus(0);
            var model = this.model,
                sid = model.id,
                isNew = !$('.structures #' + sid).length,
                elem = this.elem(),
                am = model.attributes;
            elem.css({
                'left': '+=0',
                'top': '-=0'
            });
            elem[am.away ? 'addClass' : 'removeClass']('away-mode-on');
            if (model.devices && model.devices.models) {
                _.each(model.devices.models, function (e) {
                    var view = C.getView(e.id);
                    if (view) {
                        view.render();
                    }
                }, this);
            }
            var name = this.getDisplayName();
            $('.display-location', elem).html(name);
            if (isNew && VM.stageLoaded) {
                $('.location', elem).css({
                    'opacity': 0
                });
                $('.house', elem).css({
                    'width': 0,
                    'height': 0
                });
                C.selectView(sid).then(function () {
                    $('.location', elem).css({
                        'opacity': 1
                    });
                });
            }
            $(window).trigger(C.Events.STAGE_UPDATE_VIEW, this);
            K.exposeHiddenElements(true);
            return this;
        },
        select: function () {
            var self = this,
                dfr = $.Deferred(),
                openDevices = _.once(function () {
                    self.openDevices().then(function () {
                        dfr.resolve();
                        self.getWeather();
                    });
                });
            if (this.isOpen()) {
                dfr.resolve();
                return dfr.promise();
            }
            this.setIsOpen(true);
            $('.house', this.elem()).animate({
                top: '-=' + HOUSE_SELECT_Y_OFFSET,
                width: HOUSE_WIDTH,
                height: HOUSE_HEIGHT
            }, openDevices);
            return dfr.promise();
        },
        setField: function (fieldName, value) {
            var model = this.getModel();
            M.Cache.get(model.id).setField.apply(model, [fieldName, value]);
            if ((fieldName === 'location') && value) {
                $('header .status .location').html(value);
            }
            return this;
        },
        setLocation: function (location, displayLocation) {
            if (!this.getModel().setLocation(location, displayLocation)) {
                return false;
            }
            this.render();
            this.update();
            return this;
        },
        setIsOpen: function (open) {
            if (open) {
                this.elem().addClass('isOpen');
            } else {
                this.elem().removeClass('isOpen');
            }
        },
        setPostalCode: function (location, postalCode) {
            if (!this.getModel().setPostalCode(location, postalCode)) {
                return false;
            }
            this.render();
            this.update();
            return this;
        },
        setWeather: function (response) {
            var self = this,
                r = response,
                sv = C.getSelectedView();
            if (!sv) {
                return window.setTimeout(function () {
                    self.setWeather(r);
                }, 500);
            }
            if (!r || r.error || !r.now || !r.now.icon) {
                return;
            }
            W.renderHouse(self, r.now.icon);
            if (((sv.className === 'structure') && (sv.id !== this.id)) || ((sv.className === 'device') && (sv.getStructureView().id !== this.id))) {
                return;
            }
            if (_.isNumber(r.now.sunrise)) {
                r.now.sunrise = new Date(r.now.sunrise * 1000);
            }
            if (_.isNumber(r.now.sunset)) {
                r.now.sunset = new Date(r.now.sunset * 1000);
            }
            this.weather = (r && r.now) || this.weather || {};
            this.weather.display_city = r && r.display_city;
            W.renderWeather(this);
        },
        toggleAwayMode: function () {
            this.elem()[this.getModel().toggleAway() ? 'addClass' : 'removeClass']('away-mode-on');
            this.update();
            return this;
        },
        update: function () {
            this.setWeather();
            $(window).trigger(C.Events.STAGE_UPDATE_VIEW, this);
        }
    });
    C.StructureView.addNew = function () {
        var limits = C.CLOUD_CONFIG || {}, maxStructures = limits.max_structures || Infinity;
        if (M.Cache.numStructures() >= maxStructures) {
            Sn.showStructureLimitDialog(maxStructures);
            GA.trackEvent('Console', 'maxStructureLimitRequested', 'max_structures', maxStructures);
        } else {
            M.Structure.addNew();
        }
    };
    CT = C.Toggle = function (args) {
        args = args || {};
        var className = args.className,
            labels = args.labels || ['off', 'on'],
            listener = args.listener || $.noop,
            target = $(args.target || document.body),
            toggled = args.toggled || false;
        var toggledClass = 'is-toggled',
            ll = labels[0],
            rl = labels[1],
            html = _.template($('#_TMPL #toggle_control').html(), {
                left_label: _L(ll),
                left_label_class: ll.toLowerCase(),
                right_label: _L(rl),
                right_label_class: rl.toLowerCase()
            }),
            stateChangeEvent = CT.STATE_CHANGE_EVENT + '-' + CT.id++,
            elem = $(html).addClass(className).appendTo(target).bind('mousedown', function () {
                elem.toggleState();
                elem.trigger(stateChangeEvent, elem.isToggled());
            }).bind(stateChangeEvent, listener);
        elem.toggleClass(toggledClass, toggled);
        elem.isToggled = function () {
            return elem.hasClass(toggledClass);
        };
        elem.onToggle = function (func) {
            elem.bind(stateChangeEvent, func.bind(elem));
        };
        elem.stateChangeEvent = stateChangeEvent;
        elem.toggleState = function (val) {
            elem.toggleClass(toggledClass, val);
        };
        return elem;
    };
    CT.STATE_CHANGE_EVENT = 'nest-console-toggle-state-change-event';
    CT.id = 1;
    C.loadApp = function () {
        N.log('Console.loadApp');
        var ConsoleApp = Backbone.View.extend({
            Super: Function.Super(Backbone.View, 'ConsoleApp'),
            checkForEmptyAccount: function () {
                if (!C.TOS_ACCEPTED) {
                    if (C.App.checkForEmptyAccount.timeout) {
                        return;
                    }
                    C.App.checkForEmptyAccount.timeout = window.setTimeout(function () {
                        C.App.checkForEmptyAccount.timeout = null;
                        C.App.checkForEmptyAccount();
                    }, 500);
                } else if (C.noDevices()) {
                    window.setTimeout(function () {
                        if (C.noDevices()) {
                            N.wait(1000).then(function () {
                                $(window).trigger(C.Events.REQUEST_PASSPHRASE_PAIRING);
                            });
                        }
                    }, 1250);
                }
            },
            fetch: function () {
                var _this = this;
                this.structures.fetch({
                    success: _this.refresh.bind(_this.structures)
                });
            },
            initialize: function () {
                var S = C.structures = this.structures = new M.StructureCollection(),
                    self = this;
                S.bind('newStructure', function (model) {
                    var sv = new C.StructureView({
                        model: model,
                        id: model.id
                    });
                    C.App.views[sv.id] = sv;
                    sv.render();
                    $(window).trigger(C.Events.STAGE_NEW_STRUCTURE, sv);
                });
                S.bind('newDevice', function (model) {
                    var did = model.id,
                        dv = new C.DeviceView({
                            model: model,
                            id: did
                        }),
                        isNew = !$('.structures #' + did).length;
                    C.App.views[dv.id] = dv;
                    if (VM.stageLoaded && isNew) {
                        if (C.getSelectedViewID() === dv.getStructureID()) {
                            dv.getStructureView().render();
                        }
                        VM.insertDevice(did);
                    } else {
                        dv.render();
                    }
                });
                S.bind('refresh', function () {
                    self.render();
                    S.unbind('refresh');
                });
                this.fetch();
                return this.Super('initialize', this, arguments);
            },
            refresh: function () {
                C.App.checkForEmptyAccount();
                if (C.App.newModels) {
                    var removed = [];
                    $('.device').each(function (k, v) {
                        if (!(v.id in C.App.newModels)) {
                            var id = v.id;
                            removed.push(id);
                            C.getView(id).removeView();
                        }
                    });
                    if (removed.length) {
                        removed.unshift('Removed devices');
                        N.log.apply(window, removed);
                    }
                    C.App.newModels = null;
                }
            },
            registerModel: function (id) {
                var nm = C.App.newModels;
                if (!nm) {
                    nm = C.App.newModels = {};
                }
                nm[id] = 1;
            },
            render: function () {
                if (!VM.stageLoaded) {
                    return;
                }
                D.refresh();
                C.App.checkForEmptyAccount();
            },
            selected: null,
            views: {}
        });
        N.wait(1000).then(K.ready);
        return (C.App = new ConsoleApp());
    };
})(window.jQuery, window._, window.Backbone);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        M = N.Models,
        C = N.Console,
        CZ = null,
        GA = N.GoogleAnalytics;
    var F = C.Notify = C.Notify || {};
    F.PRIORITY_CRITICAL = 5;
    F.PRIORITY_IMPORTANT = 3;
    F.PRIORITY_INTERESTING = 1;
    F.TYPE_ALERT = 'alert';
    F.TYPE_BASIC = 'basic';
    F.TYPE_EMAIL = 'email';
    F.TYPE_INFO = 'info';
    F.DEFAULT_PRIORITY = {
        alert: F.PRIORITY_IMPORTANT,
        basic: F.PRIORITY_INTERESTING,
        email: F.PRIORITY_INTERESTING,
        info: F.PRIORITY_INTERESTING,
        'undefined': F.PRIORITY_INTERESTING
    };
    F.activeNotification = null;
    $(F.init = function () {
        CZ = N.CZ;
        $(window).bind(C.Events.USER_DATA, F.userDataChange).bind(C.Events.USER_SETTINGS_DATA, F.userSettingsDataChange);
        F.init = $.noop;
    });
    F.queue = [];
    F.queue.priorityRecencySort = function (a, b) {
        return (b.priority - a.priority) || (a.timestamp - b.timestamp);
    };
    F.queue.push = function () {
        Array.prototype.push.apply(this, arguments);
        this.sort(F.queue.priorityRecencySort);
    };
    F.scheduleNotification = function (attributes) {
        var nid = 'n' + (new Date()).getTime() + F.queue.length,
            an = F.activeNotification,
            attrs = _.extend({
                onShow: function () {},
                cssClass: '',
                hasCloseButton: true,
                html: '',
                id: nid,
                isModal: false,
                isShowOnlyOnce: false,
                priority: F.DEFAULT_PRIORITY[attributes.type],
                timestamp: (new Date()).getTime(),
                type: F.TYPE_BASIC
            }, attributes),
            exid = _.find(F.queue, function (nf) {
                return Boolean(nf && nf.html && (nf.html === attrs.html));
            });
        if (exid) {
            N.log('Notification.scheduleNotification: Suppressing redundant scheduling of notification.');
            return exid;
        }
        F.queue.push(attrs);
        if (an && an.priority < attrs.priority) {
            N.log('Notification.scheduleNotification: Triggering priority interrupt.');
            F.cancelNotification(an.id);
            if (!an.isShowOnlyOnce) {
                F.scheduleNotification(an);
            }
        }
        F.update();
        return nid;
    };
    F.cancelNotification = function (notificationID) {
        var dfr = $.Deferred(),
            nt = $('#' + notificationID),
            fan = F.activeNotification;
        if (nt.length) {
            if (fan.onHide) {
                if (fan.onHide(fan) === false) {
                    _.defer(dfr.resolve);
                    return dfr.promise();
                }
            }
            $('#container > .disabler').remove();
            nt.animate({
                top: '-=63'
            }, 265, function () {
                if (N.DEBUG) {
                    $('.notification-tray').first().unbind('dblclick');
                }
                nt.remove();
                F.activeNotification = null;
                F.update();
                dfr.resolve();
            });
        } else {
            _.defer(dfr.resolve);
        }
        _.each(F.queue, function (v, k) {
            if (v.id === notificationID) {
                F.queue.splice(k, 1);
            }
        });
        return dfr.promise();
    };
    F.update = function () {
        if (F.activeNotification) {
            return;
        }
        var ne = F.queue.shift();
        if (!ne) {
            return;
        }
        F.activeNotification = ne;
        var nt = $($('#_TMPL #notification_tray').html()).addClass(ne.type).prop({
            id: ne.id
        }).toggleClass('no-close-button', !ne.hasCloseButton).insertBefore($('#main').first());
        if (ne.cssClass) {
            nt.addClass(ne.cssClass);
        }
        if (ne.name) {
            nt.addClass(ne.name);
        }
        $('.message', nt).html(ne.html);
        $('.close-button', nt).bind('click', function () {
            F.cancelNotification(ne.id);
        });
        if (ne.onShow) {
            ne.onShow(ne, nt);
        }
        nt.animate({
            top: '+=63'
        }, 265, function () {
            if (ne.isModal) {
                $('<div/>', {
                    'class': 'disabler',
                    css: {
                        'background-color': 'black',
                        'opacity': 0,
                        'z-index': 2600
                    }
                }).appendTo('#container').animate({
                    opacity: 0.25
                }, 300);
                if (N.DEBUG) {
                    $('.notification-tray').first().bind('dblclick', function (event) {
                        if (event.shiftKey) {
                            F.cancelNotification(ne.id);
                        }
                    });
                }
            }
        });
    };
    F.userDataChange = function (event, data) {
        var email = data && (data.email_address || data.email || data.username || data.name);
        if (email) {
            $('.notification-tray .email-address').html(email);
        }
        N.log('Notify.userDataChange:', data);
    };
    F.userSettingsDataChange = function (event, data) {
        if (!data) {
            return;
        }
        var tav = data.tos_accepted_version || 0,
            tcur = data.tos_current_version || 0,
            mtos = data.tos_minimum_version || 0,
            ev = data.email_verified;
        (tav < mtos) ? N.wait(3000).then(function () {
            F.termsOfServiceRequired(tcur, tav);
        }) : F.termsOfServiceRequired.cancel();
        (ev === false) ? N.wait(6100).then(F.emailVerificationRequired) : F.emailVerificationRequired.cancel();
        N.log('Notify.userSettingsDataChange:', data);
    };
    F.passwordChanged = function () {
        return F.scheduleNotification({
            html: $('#_TMPL #msg_password_change_completed').html(),
            isShowOnlyOnce: true,
            type: F.TYPE_INFO
        });
    };
    F.emailAddressChanged = function () {
        F.emailVerificationRequired.cancel().then(function () {
            F.scheduleNotification({
                html: $('#_TMPL #msg_email_address_change_completed').html(),
                isShowOnlyOnce: true,
                type: F.TYPE_INFO
            });
        });
    };
    F.termsOfServiceRequired = function (currentVersion, acceptedVersion) {
        if (F.termsOfServiceRequired.id) {
            return F.termsOfServiceRequired.id;
        }
        var focusBlocker = function (event) {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.target.blur();
        }, isNewUser = (acceptedVersion === 0);
        return F.scheduleNotification({
            hasCloseButton: false,
            html: $('#_TMPL #msg_terms_of_service_required').html(),
            isModal: true,
            priority: F.PRIORITY_CRITICAL,
            type: F.TYPE_ALERT,
            onHide: function (attrs) {
                F.termsOfServiceRequired.id = null;
                $('#main .device-pairing .pairing-char').unbind('focus', focusBlocker);
            },
            onShow: function (attrs, element) {
                $('#main .device-pairing .pairing-char').bind('focus', focusBlocker).blur();
                F.termsOfServiceRequired.id = attrs.id;
                $('.' + (isNewUser ? 'never-agreed' : 'has-agreed-before'), element).css({
                    display: 'block'
                });
                $('.actions .read-terms', element).bind('click', function () {
                    window.open('/terms', '_blank');
                    GA.trackEvent('Console', 'termsOfService', 'read');
                });
                $('.actions .agree', element).bind('click', function () {
                    CZ.updateBucket({
                        tos_accepted_version: currentVersion
                    }, 'user_settings.' + C.USER_ID, {}, function (ev) {
                        N.log('CZ.updateBucket: success');
                    }, function (ev) {
                        N.error('CZ.updateBucket: failure. arguments =', arguments);
                    });
                    F.termsOfServiceRequired.cancel();
                    GA.trackEvent('Console', 'termsOfService', 'agree');
                    C.TOS_ACCEPTED = true;
                    N.log('Notify.termsOfServiceRequired: TOS Accepted = true');
                });
            }
        });
    };
    F.termsOfServiceRequired.cancel = function () {
        if (F.termsOfServiceRequired.id) {
            return F.cancelNotification(F.termsOfServiceRequired.id);
        } else {
            var dfr = $.Deferred();
            _.defer(dfr.resolve);
            return dfr.promise();
        }
    };
    F.emailVerificationRequired = function () {
        if (F.emailVerificationRequired.id) {
            return F.emailVerificationRequired.id;
        }
        return F.scheduleNotification({
            hasCloseButton: false,
            html: $('#_TMPL #msg_email_verification_required').html(),
            priority: F.PRIORITY_IMPORTANT,
            type: F.TYPE_EMAIL,
            onHide: function (attrs) {
                F.emailVerificationRequired.id = null;
            },
            onShow: function (attrs, element) {
                F.emailVerificationRequired.id = attrs.id;
                $('.email-address', element).html(N.shortenEmailDisplay(C.EMAIL_ADDRESS, 55));
                $('.actions .resend', element).bind('click', function () {
                    var slideIn = function (className) {
                        N.wait(110).then(function () {
                            $('.alt', element).css({
                                display: 'none'
                            }).filter('.alt.' + className).css({
                                display: 'block'
                            });
                            var elms = $('.email-verification-required > *', element),
                                dist = $('.alt.' + className, element).position().top - $('.main', element).position().top,
                                reverse = _.once(function () {
                                    elms.animate({
                                        top: '+=' + dist
                                    }, 240);
                                });
                            elms.animate({
                                top: '-=' + dist
                            }, 240, function () {
                                N.wait(3100).then(reverse);
                            });
                        });
                    };
                    $.post('/users/' + C.USER_ID + '/confirmation_emails').success(function () {
                        GA.trackEvent('Console', 'resendVerificationEmail');
                        slideIn('success');
                    }).error(function (response) {
                        GA.trackEvent('Console', 'resendVerificationEmailError');
                        slideIn('error');
                    });
                });
                $('.actions .change', element).bind('click', C.AccountTray.EmailMode.enter);
            }
        });
    };
    F.emailVerificationRequired.cancel = function () {
        if (F.emailVerificationRequired.id) {
            return F.cancelNotification(F.emailVerificationRequired.id);
        } else {
            var dfr = $.Deferred();
            _.defer(dfr.resolve);
            return dfr.promise();
        }
    };
})(window.jQuery, window._);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        C = N.Console,
        CZ = null,
        D = C.Details,
        F = C.Notify = C.Notify || {}, GA = N.GoogleAnalytics,
        K = C.Control,
        _L = N.Localization.namespace('Console');
    var A = C.AccountTray = C.AccountTray || {}, AE = A.EmailMode = A.EmailMode || {}, AP = A.PasswordMode = A.PasswordMode || {};
    A.MAX_EMAIL_ADDRESS_LENGTH = 34;
    A.CLASS_TRAY_OPEN = 'tray-open';
    A.ID_ACCOUNT_TRAY_DISABLER = 'account_tray_disabler';
    A.ACCOUNT_VALIDATION_DIALOG = 'account_validation_dialog';
    A.ID_CHANGE_EMAIL_BUTTON = 'change_email_button';
    A.ID_CHANGE_PASSWORD_BUTTON = 'change_password_button';
    A.ID_CHECKBOXES = ['receive_marketing_emails', 'receive_nest_emails', 'receive_support_emails'];
    A.init = function () {
        CZ = N.CZ;
        A.bindEvents();
        $('header.account-tray .settings .nav .option').bind('click', A.accountTrayNavClick);
        $(window).bind('keypress', A.keypress).bind(C.Events.USER_DATA, A.userDataChange).bind(C.Events.USER_SETTINGS_DATA, A.userSettingsDataChange);
        A.init = function () {};
    };
    A.bindEvents = function () {
        var act = $('.account-tray'),
            set = $('.settings', act),
            toggle = $('.account-tray-toggle', act),
            emb = $('#' + A.ID_CHANGE_EMAIL_BUTTON, act),
            pwb = $('#' + A.ID_CHANGE_PASSWORD_BUTTON, act);
        toggle.unbind('click', A.toggleAccountTray).one('click', A.toggleAccountTray);
        act.unbind('dblclick', A.dblclick).bind('dblclick', A.dblclick);
        emb.unbind('click', AE.enter).bind('click', AE.enter);
        pwb.unbind('click', AP.enter).bind('click', AP.enter);
        _.each(A.ID_CHECKBOXES, function (v, k) {
            $('#' + v, set).unbind('click', A.clickCheckbox).bind('click', A.clickCheckbox);
        });
    };
    A.deepLinkSelect = function (nav, sub) {
        var dfr = $.Deferred(),
            noop = function () {
                return $.when($.noop);
            }, subHandlers = {
                'email': AE.enter,
                'legal': function () {
                    return $.when(A.accountTrayNav('legal'));
                },
                'main': noop,
                'password': AP.enter,
                'undefined': noop
            };
        if (sub === 'logout') {
            K.logout();
        } else {
            A.openTray().then(function () {
                subHandlers[sub](sub).then(dfr.resolve);
            });
        }
        return dfr.promise();
    };
    A.userDataChange = function (event, data) {
        var email = data && (data.email_address || data.email || data.username || data.name);
        if (email) {
            C.EMAIL_ADDRESS = email;
        }
        A.updateView(data);
        N.log('AccountTray.userDataChange:', data);
    };
    A.userSettingsDataChange = function (event, data) {
        A.updateView(data);
        N.log('AccountTray.userSettingsDataChange:', data);
    };
    A.keypress = function (event) {
        if (event && event.keyCode === 13) {
            if ($('.account-tray-toggle:focus').length) {
                A.toggleAccountTray();
            } else if ($('.logout:focus').length) {
                K.logout();
            }
        }
    };
    A.isOpen = function () {
        return $('.account-tray').hasClass(A.CLASS_TRAY_OPEN);
    };
    A.openTray = function () {
        var isOpen = A.isOpen(),
            dfr = $.Deferred();
        if (isOpen) {
            _.defer(dfr.resolve);
            return dfr.promise();
        }
        var act = $('.account-tray'),
            interval = 190,
            set = $('.settings', act),
            toggle = $('.account-tray-toggle', act),
            finish = function () {
                var lo = $('.logout', set);
                A.bindEvents();
                lo.animate({
                    opacity: 1
                }, interval);
                N.wait(800).then(function () {
                    lo.bind('click', K.logout);
                });
                dfr.resolve();
            };
        D.closeTabs().then(function () {
            act.addClass(A.CLASS_TRAY_OPEN);
            toggle.animate({
                backgroundColor: '#2FA2EA',
                color: 'white'
            }, interval);
            act.animate({
                height: 346
            }, interval);
            set.animate({
                height: 280
            }, interval, finish);
            var da = $($('<div/>', {
                id: A.ID_ACCOUNT_TRAY_DISABLER
            })).appendTo(document.body).bind('click', A.closeTray);
            N.wait(20).then(function () {
                da.animate({
                    opacity: 0.2
                }, interval);
            });
        });
        return dfr.promise();
    };
    A.closeTray = function () {
        var dfr = $.Deferred(),
            isOpen = A.isOpen();
        if (!isOpen) {
            _.defer(dfr.resolve);
            return dfr.promise();
        }
        var act = $('.account-tray'),
            interval = 190,
            set = $('.settings', act),
            toggle = $('.account-tray-toggle', act),
            finish = function () {
                act.removeClass(A.CLASS_TRAY_OPEN);
                A.bindEvents();
                $('.option, .panel', set).removeClass('selected');
                $('.option:first, .panel:first', set).addClass('selected');
                $('.panel', set).css({
                    opacity: 1
                });
                $('.logout', set).unbind('click', K.logout);
                $('#' + A.ID_ACCOUNT_TRAY_DISABLER).remove();
                AE.cancel();
                AP.cancel();
                dfr.resolve();
            };
        toggle.animate({
            backgroundColor: '#FFFFFF'
        }, interval);
        $('.panel, .logout', set).animate({
            opacity: 0
        }, interval);
        act.animate({
            height: 66
        }, interval);
        set.animate({
            height: 0
        }, interval, finish);
        $('#' + A.ID_ACCOUNT_TRAY_DISABLER).animate({
            opacity: 0
        }, interval);
        return dfr.promise();
    };
    A.toggleAccountTray = function () {
        return A.isOpen() ? A.closeTray() : A.openTray();
    };
    A.accountTrayNavClick = function (event) {
        var id = event.target.id;
        if (id === 'fill') {
            return;
        }
        A.accountTrayNav(id.split('_')[0]);
    };
    A.accountTrayNav = function (tab) {
        var set = $('.account-tray .settings');
        $('.nav .option, .panel', set).removeClass('selected');
        $('#' + tab + '_nav', set).add('#' + tab + '_panel', set).addClass('selected');
        AE.cancel();
        AP.cancel();
    };
    A.dblclick = function (event) {
        var et = $(event.target).filter('.account-tray, .location, .temperature, .status');
        if (!et.length) {
            return;
        }
        event.stopImmediatePropagation();
        event.preventDefault();
        A.toggleAccountTray();
    };
    A.clickCheckbox = function (event) {
        var t = $(event.target),
            data = {}, id = t.prop('id'),
            eid = String.Nest.camelCase(id),
            isChecked;
        data[id] = isChecked = t.prop('checked');
        CZ.updateBucket(data, 'user_settings.' + C.USER_ID, {}, function (ev) {
            N.log('CZ.updateBucket: success');
        }, function (ev) {
            N.error('CZ.updateBucket: failure. arguments =', arguments);
        });
        GA.trackEvent('Console', eid, 'value', isChecked);
    };
    A.updateView = function (userSettings) {
        var act = $('.account-tray'),
            set = $('.settings', act);
        if (userSettings) {
            _.each(A.ID_CHECKBOXES, function (v, k) {
                $('#' + v, set).prop('checked', userSettings[v]);
            });
        }
        $('.email-address .non-modal .value', act).html(N.shortenEmailDisplay(C.EMAIL_ADDRESS, A.MAX_EMAIL_ADDRESS_LENGTH));
    };
    A.raiseValidationError = function (field, msg) {
        A.dismissValidationError().then(function () {
            var act = $('.account-tray'),
                fe = $('#' + field, act),
                pos = fe.position(),
                html = $('#' + msg).html();
            $($('#_TMPL #schnack_bubble').html()).removeClass('schnack-bubble').addClass('universal-dialog left error').prop({
                id: A.ACCOUNT_VALIDATION_DIALOG
            }).css({
                left: pos.left + fe.width() + 74,
                opacity: 0,
                position: 'absolute',
                top: pos.top + 10,
                width: 210
            }).children('.content').html(html).end().appendTo($('#account_panel', act)).animate({
                opacity: 1
            }, 150);
        });
    };
    A.dismissValidationError = function () {
        var dfr = $.Deferred(),
            dlg = $('#' + A.ACCOUNT_VALIDATION_DIALOG);
        if (dlg.length) {
            dlg.animate({
                opacity: 0
            }, 150, function () {
                dlg.remove();
                dfr.resolve();
            });
        } else {
            _.defer(dfr.resolve);
        }
        return dfr.promise();
    };
    AE.active = false;
    AE.enter = function () {
        var dfr = $.Deferred();
        A.openTray().then(function () {
            AP.cancel().then(function () {
                AE.active = true;
                AE.bindEvents();
                return AE.fadeIn().then(dfr.resolve);
            });
        });
        return dfr.promise();
    };
    AE.bindEvents = function () {
        var ea = $('.account-tray .email-address');
        $('.buttons .cancel', ea).unbind('click', AE.clickCancel).bind('click', AE.clickCancel);
        $('.buttons .save', ea).unbind('click', AE.clickSave).bind('click', AE.clickSave);
        $('#reveal_password', ea).unbind('click', AE.toggleReveal).bind('click', AE.toggleReveal);
        $('.modal', ea).unbind('keypress', AE.keyPress).bind('keypress', AE.keyPress).unbind('keydown', AE.keyDown).bind('keydown', AE.keyDown);
    };
    AE.exit = function () {
        var dfr = $.Deferred(),
            ea = $('.account-tray .email-address');
        A.dismissValidationError();
        AE.fadeOut().then(function () {
            $('input[type=password], input[type=text]', ea).val('');
            $('.buttons .save', ea).removeClass('ready clickable');
            AE.active = false;
            dfr.resolve();
        });
        return dfr.promise();
    };
    AE.cancel = function () {
        if (AE.active) {
            return AE.exit();
        } else {
            var dfr = $.Deferred();
            _.defer(dfr.resolve);
            return dfr.promise();
        }
    };
    AE.fadeIn = function () {
        var dfr = $.Deferred(),
            act = $('.account-tray'),
            finish = dfr.resolve,
            mod = $('#form_column .email-address .modal', act),
            nmod = $('#form_column .non-modal', act);
        $('<div/>', {
            'class': 'panel-disabler',
            css: {
                opacity: 0
            }
        }).appendTo('#contact_column', act).bind('click', AE.cancel).animate({
            opacity: 0.65
        }, 150);
        nmod.animate({
            opacity: 0
        }, 150, function () {
            nmod.css({
                display: 'none'
            });
            mod.css({
                display: 'block'
            }).animate({
                opacity: 1
            }, 150, finish);
        });
        return dfr.promise();
    };
    AE.fadeOut = function () {
        var dfr = $.Deferred(),
            act = $('.account-tray'),
            finish = dfr.resolve,
            dis = $('#contact_column .panel-disabler', act),
            mod = $('#form_column .email-address .modal', act),
            nmod = $('#form_column .non-modal', act);
        dis.animate({
            opacity: 0
        }, 150, function () {
            dis.remove();
        });
        mod.animate({
            opacity: 0
        }, 150, function () {
            mod.css({
                display: 'none'
            });
            nmod.css({
                display: 'block'
            }).animate({
                opacity: 1
            }, 150, finish);
        });
        return dfr.promise();
    };
    AE.clickCancel = function () {
        AE.cancel();
    };
    AE.clickSave = function () {
        if (!AE.validate()) {
            return false;
        }
        var ea = $('.account-tray .email-address'),
            cpv = $('#password', ea).val(),
            npv = $('#new_email_1', ea).val();
        $.post('/user/' + C.USER_ID + '/email', JSON.stringify({
            current_password: cpv,
            email: npv,
            type: 'live'
        }), function () {
            if (arguments[1] === 'success') {
                C.USERNAME = npv;
                C.EMAIL_ADDRESS = npv;
                AE.exit();
                F.emailAddressChanged();
                $('.non-modal .value', ea).html(N.shortenEmailDisplay(C.EMAIL_ADDRESS, A.MAX_EMAIL_ADDRESS_LENGTH));
                GA.trackEvent('Console', 'emailAddressChange');
            }
        }).error(function () {
            var responseText = arguments[0].responseText;
            if (responseText.indexOf('access_denied') > -1) {
                A.raiseValidationError('password', 'msg_password_incorrect');
                $('.account-tray .email-address #password').one('keyup', A.dismissValidationError);
            } else if (responseText.indexOf('account_exists') > -1) {
                A.raiseValidationError('new_email_1', 'msg_email_address_exists');
                $('.account-tray .email-address #new_email_1').one('keyup', A.dismissValidationError);
            }
        });
    };
    AE.checkCompletion = function () {
        $('.account-tray .email-address .buttons .save').toggleClass('ready clickable', AE.validate(true));
    };
    AE.keyPress = function (event) {
        var ec = event.keyCode;
        if (ec === 13) {
            if (!AE.clickSave()) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        } else {
            AE.checkCompletion();
        }
    };
    AE.keyDown = function (event) {
        var ec = event.keyCode;
        if (ec <= 40 && ec >= 37) {
            event.stopImmediatePropagation();
        }
    };
    AE.validate = function (noSideEffects) {
        var act = $('.account-tray'),
            cp = $('#password', act),
            cpv = cp.val(),
            np = $('#new_email_1', act),
            np1 = np.val(),
            cfp = $('#new_email_2', act),
            np2 = cfp.val(),
            valid = true,
            action = null;
        if (!np1.length) {
            action = function () {
                A.raiseValidationError('new_email_1', 'msg_new_email_required');
                np.one('keyup', A.dismissValidationError);
            };
            valid = false;
        } else if (C.EMAIL_ADDRESS === np1) {
            action = function () {
                A.raiseValidationError('new_email_1', 'msg_email_unchanged');
                np.bind('keyup', function () {
                    if (np.val() !== cp.val()) {
                        np.unbind('keyup');
                        A.dismissValidationError();
                    }
                });
            };
            valid = false;
        } else if (!AE.isValidEmailAddress(np1)) {
            action = function () {
                A.raiseValidationError('new_email_1', 'msg_new_email_invalid');
                np.bind('keyup', function () {
                    if (AE.isValidEmailAddress(np.val())) {
                        np.unbind('keyup');
                        A.dismissValidationError();
                    }
                });
            };
            valid = false;
        } else if (!np2.length) {
            action = function () {
                A.raiseValidationError('new_email_2', 'msg_new_email_confirmation_required');
                cfp.one('keyup', A.dismissValidationError);
            };
            valid = false;
        } else if (np1 !== np2) {
            action = function () {
                A.raiseValidationError('new_email_2', 'msg_new_email_mismatch');
                cfp.bind('keyup', function () {
                    if (np.val() === cfp.val()) {
                        cfp.unbind('keyup');
                        A.dismissValidationError();
                    }
                });
            };
            valid = false;
        } else if (!cpv.length) {
            action = function () {
                A.raiseValidationError('password', 'msg_password_required');
                cp.one('keyup', A.dismissValidationError);
            };
            valid = false;
        }
        if (!noSideEffects && action) {
            action();
        }
        return valid;
    };
    AE.isValidEmailAddress = function (address) {
        return (/^[^@]+@[^\s@]+\.[a-z]{2,6}$/i).test(String(address));
    };
    AE.toggleReveal = function (event) {
        var t = $(event.target),
            id = t.prop('id'),
            map = {
                reveal_password: ['password']
            }, ip;
        _.each(map[id], function (v, k) {
            var elem = $('.account-tray #' + v),
                type = elem.prop('type');
            ip = (type === 'password');
            elem.prop({
                type: (ip ? 'text' : 'password')
            });
        });
        t.prop({
            title: (ip ? t.data('hide') : t.data('show'))
        });
    };
    AP.active = false;
    AP.enter = function () {
        var dfr = $.Deferred();
        AE.cancel().then(function () {
            AP.active = true;
            AP.bindEvents();
            AP.fadeIn().then(dfr.resolve);
        });
        return dfr.promise();
    };
    AP.bindEvents = function () {
        var pw = $('.account-tray .password');
        $('.buttons .cancel', pw).unbind('click', AP.clickCancel).bind('click', AP.clickCancel);
        $('.buttons .save', pw).unbind('click', AP.clickSave).bind('click', AP.clickSave);
        $('#reveal_current_password, #reveal_new_passwords', pw).unbind('click', AP.toggleReveal).bind('click', AP.toggleReveal);
        $('.modal', pw).unbind('keypress', AP.keyPress).bind('keypress', AP.keyPress).unbind('keydown', AP.keyDown).bind('keydown', AP.keyDown);
    };
    AP.exit = function () {
        var dfr = $.Deferred(),
            pw = $('.account-tray .password');
        A.dismissValidationError();
        AP.fadeOut().then(function () {
            $('input[type=password], input[type=text]', pw).val('');
            $('.buttons .save', pw).removeClass('ready clickable');
            AP.active = false;
            dfr.resolve();
        });
        return dfr.promise();
    };
    AP.cancel = function () {
        if (AP.active) {
            return AP.exit();
        } else {
            var dfr = $.Deferred();
            _.defer(dfr.resolve);
            return dfr.promise();
        }
    };
    AP.fadeIn = function () {
        var dfr = $.Deferred(),
            act = $('.account-tray'),
            finish = dfr.resolve,
            mod = $('#form_column .password .modal', act),
            nmod = $('#form_column .non-modal', act);
        $('<div/>', {
            'class': 'panel-disabler',
            css: {
                opacity: 0
            }
        }).appendTo('#contact_column', act).bind('click', AP.cancel).animate({
            opacity: 0.65
        }, 150);
        nmod.animate({
            opacity: 0
        }, 150, function () {
            nmod.css({
                display: 'none'
            });
            mod.css({
                display: 'block'
            }).animate({
                opacity: 1
            }, 150, finish);
        });
        return dfr.promise();
    };
    AP.fadeOut = function () {
        var dfr = $.Deferred(),
            act = $('.account-tray'),
            finish = dfr.resolve,
            dis = $('#contact_column .panel-disabler', act),
            mod = $('#form_column .password .modal', act),
            nmod = $('#form_column .non-modal', act);
        dis.animate({
            opacity: 0
        }, 150, function () {
            dis.remove();
        });
        mod.animate({
            opacity: 0
        }, 150, function () {
            mod.css({
                display: 'none'
            });
            nmod.css({
                display: 'block'
            }).animate({
                opacity: 1
            }, 150, finish);
        });
        return dfr.promise();
    };
    AP.clickCancel = function () {
        AP.cancel();
    };
    AP.clickSave = function () {
        if (!AP.validate()) {
            return false;
        }
        var act = $('.account-tray'),
            cpv = $('#current_password', act).val(),
            npv = $('#new_password_1', act).val();
        $.post('/user/' + C.USER_ID + '/password', JSON.stringify({
            current_password: cpv,
            password: npv,
            type: 'live'
        }), function () {
            if (arguments[1] === 'success') {
                AP.exit();
                F.passwordChanged();
                GA.trackEvent('Console', 'passwordChange');
            }
        }).error(function () {
            var responseText = arguments[0].responseText;
            if (responseText.indexOf('access_denied') > -1) {
                A.raiseValidationError('current_password', 'msg_password_incorrect');
                $('.account-tray #current_password').one('keyup', A.dismissValidationError);
            }
        });
    };
    AP.checkCompletion = function () {
        $('.account-tray .password .buttons .save').toggleClass('ready clickable', AP.validate(true));
    };
    AP.keyPress = function (event) {
        var ec = event.keyCode;
        if (ec === 13) {
            if (!AP.clickSave()) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        } else {
            AP.checkCompletion();
        }
    };
    AP.keyDown = function (event) {
        var ec = event.keyCode;
        if (ec <= 40 && ec >= 37) {
            event.stopImmediatePropagation();
        }
    };
    AP.validate = function (noSideEffects) {
        var act = $('.account-tray'),
            cp = $('#current_password', act),
            cpv = cp.val(),
            np = $('#new_password_1', act),
            np1 = np.val(),
            cfp = $('#new_password_2', act),
            np2 = cfp.val(),
            valid = true,
            action = null;
        if (!cpv.length) {
            action = function () {
                A.raiseValidationError('current_password', 'msg_password_required');
                cp.one('keypress', A.dismissValidationError);
            };
            valid = false;
        } else if (!np1.length) {
            action = function () {
                A.raiseValidationError('new_password_1', 'msg_new_password_required');
                np.one('keypress', A.dismissValidationError);
            };
            valid = false;
        } else if (cpv === np1) {
            action = function () {
                A.raiseValidationError('new_password_1', 'msg_password_unchanged');
                np.bind('keypress', function () {
                    if (np.val() !== cp.val()) {
                        np.unbind('keypress');
                        A.dismissValidationError();
                    }
                });
            };
            valid = false;
        } else if (np1.length < 6) {
            action = function () {
                A.raiseValidationError('new_password_1', 'msg_new_password_too_short');
                np.bind('keypress', function () {
                    if (np.val().length >= 6) {
                        np.unbind('keypress');
                        A.dismissValidationError();
                    }
                });
            };
            valid = false;
        } else if (!np2.length) {
            action = function () {
                A.raiseValidationError('new_password_2', 'msg_new_password_confirmation_required');
                cfp.one('keypress', A.dismissValidationError);
            };
            valid = false;
        } else if (np1 !== np2) {
            action = function () {
                A.raiseValidationError('new_password_2', 'msg_new_password_mismatch');
                cfp.bind('keypress', function () {
                    if (np.val() === cfp.val()) {
                        cfp.unbind('keypress');
                        A.dismissValidationError();
                    }
                });
            };
            valid = false;
        }
        if (!noSideEffects && action) {
            action();
        }
        return valid;
    };
    AP.toggleReveal = function (event) {
        var t = $(event.target),
            id = t.prop('id'),
            map = {
                reveal_current_password: ['current_password'],
                reveal_new_passwords: ['new_password_1', 'new_password_2']
            }, ip;
        _.each(map[id], function (v, k) {
            var elem = $('.account-tray #' + v),
                type = elem.prop('type');
            ip = (type === 'password');
            elem.prop({
                type: (ip ? 'text' : 'password')
            });
        });
        t.prop({
            title: (ip ? t.data('hide') : t.data('show'))
        });
    };
})(window.jQuery, window._);
(function ($, _, Backbone, undefined) {
    'use strict';
    var N = window.Nest,
        _L = N.Localization.namespace('Console'),
        M = N.Models,
        A = N.Animate = N.Animate || {}, C = N.Console = N.Console || {}, GA = N.GoogleAnalytics,
        D = C.Details = C.Details || {}, K = C.Control = C.Control || {}, Pp = C.PassphraseDialog = C.PassphraseDialog || {}, Sn = C.Schnack = C.Schnack || {}, W = C.Weather = C.Weather || {};
    var init = function () {
        N.log('Initializing dialogs');
        $(window).bind(N.CZ.objectAddEvent, function () {
            Sn.showDeviceOfflineWarning.hide();
            Pp.hide();
        });
    };
    $(window).one('load', init);
    Sn.show = function (args) {
        args = args || {};
        if (Sn.element().length) {
            return;
        }
        var rel = args.rel,
            cls = args['class'],
            css = args.css,
            html = args.html,
            id = args.id,
            icon = args.icon,
            type = args.type || 'modal',
            noHideTabs = args.noHideTabs,
            win = $(window),
            ww = win.width(),
            roff = {}, computePosture, posture, isAbove, plc;
        if (html && html.html) {
            html = html.html();
        }
        if (!rel) {
            posture = 'alert';
            plc = $('#main');
        } else {
            rel = $(args.rel).first();
            plc = $(args.rel);
            computePosture = function () {
                var roff = rel.offset(),
                    rw = rel.width(),
                    rh = rel.height(),
                    relx = roff.left,
                    posLeft = (relx >= (ww / 2)) ? 'right' : 'left',
                    posBottom = 'bottom';
                return [posBottom, posLeft].join('-');
            };
            posture = args.posture || computePosture();
        }
        $($('#schnack_bubble').html()).hide().css({
            opacity: 0
        }).appendTo(plc).addClass(posture).attr('id', 'schnack_bubble');
        var snel = Sn.element();
        $('.content', snel).html(html);
        if (icon) {
            $('.content', snel).before('<img class="icon" src="' + icon + '" alt="">');
        }
        if (!noHideTabs) {
            C.AccountTray.closeTray().then(D.closeTabs);
        }
        if (cls) {
            snel.addClass(cls);
        }
        if (id) {
            snel.prop({
                id: id
            });
        }
        if (css) {
            snel.css(css);
        }
        snel.css({
            visibility: 'hidden'
        }).css({
            display: 'block'
        });
        var styl = {}, computeRelPosition = function (posture, pos) {
            pos = pos || {};
            var win = $(window),
                rw = rel.width(),
                rh = rel.height(),
                snow = snel.outerWidth(),
                isAbove = (posture.indexOf('bottom') > -1),
                isCenter = (posture.indexOf('center') > -1),
                isLeft = (posture.indexOf('right') > -1);
            if (isAbove) {
                _.extend(pos, {
                    'bottom': 35 + rh
                });
            } else {
                rh = rel.height();
                _.extend(pos, {
                    'top': 0
                });
            }
            if (isCenter) {
                _.extend(pos, {
                    'left': rw / 2 - snow / 2
                });
            } else if (isLeft) {
                _.extend(pos, {
                    'right': rw / 2 - 40
                });
            } else {
                _.extend(pos, {
                    'left': rw / 2 - 35
                });
            }
            return pos;
        };
        if (rel) {
            _.extend(styl, computeRelPosition(posture));
        } else {
            snel.addClass('centered').addClass('my-0.77');
            K.center();
        }
        var keyHandler = function (event) {
            var kc = event.keyCode;
            if (kc === 27) {
                Sn.hide(event);
            }
        }, resizeHandler = _.throttle(function () {
            var posture = computePosture(),
                styl = {};
            if (!snel.hasClass(posture)) {
                snel.removeClass('top-left top-right bottom-left bottom-right').addClass(posture);
                styl = {
                    bottom: 'auto',
                    left: 'auto',
                    right: 'auto',
                    top: 'auto'
                };
                $('.pointer', snel).prop({
                    src: '/images/home4/schnacks/pointer-' + posture + '.png'
                });
            }
            snel.css(computeRelPosition(posture, styl));
        }, 75),
            setDots = function (el, p) {
                var content = $(el).closest('.content'),
                    pages = $('.page', content),
                    numPages = pages.length,
                    str = '';
                for (var i = 0; i < numPages; i++) {
                    str += (i === p) ? '●' : '○';
                }
                $('.dots', el).html(str);
            }, pagerClick = function () {
                var content = $(this).closest('.content'),
                    pages = $('.page', content),
                    pageWidth = $(pages[0]).outerWidth(true),
                    curPage = Math.floor(-($(pages[0]).position().left - 65) / pageWidth),
                    direction = $(this).hasClass('right') ? 1 : -1,
                    newPage = curPage + direction,
                    goLeft = -newPage * pageWidth;
                pages.css('left', goLeft);
                $('.left', content).toggle(newPage > 0);
                $('.right', content).toggle(newPage < pages.length - 1);
                setDots($('.pager', content), newPage);
                return false;
            };
        $('.pager', snel).each(function (i, el) {
            setDots(el, 0);
        });
        $('.pager a', snel).bind('click', pagerClick);
        var bg = null;
        Sn.hide.teardown = function (event) {
            Sn.hideDisabler();
            if (event) {
                event.stopImmediatePropagation();
            }
            $(window).unbind('keydown', keyHandler).unbind('resize', resizeHandler);
            if (bg) {
                bg.unbind('click', Sn.hide).remove();
            }
            $('.pager a', snel).unbind('click', pagerClick);
            D.enableClickListener();
            Sn.hide.teardown = null;
        };
        if (type !== 'blocking') {
            $(window).bind('keydown', keyHandler);
        }
        if (!_.include(['blocking', 'modeless'], type)) {
            bg = $('<div class="schnack-bg"></div>').appendTo(snel.parent()).bind('click', Sn.hide);
            D.disableClickListener();
        }
        if (rel) {
            $(window).bind('resize', resizeHandler);
        }
        snel.css({
            display: 'none'
        }).css({
            visibility: 'visible'
        }).css(styl).show();
        A.animate(snel, {
            opacity: 1
        }, 500);
        return snel;
    };
    Sn.element = function () {
        return $('#main #schnack_bubble').first();
    };
    Sn.hide = function (event) {
        if (Sn.hide.teardown) {
            Sn.hide.teardown(event);
        }
        Sn.remove();
    };
    Sn.hideAll = function () {
        Sn.showDeviceOfflineWarning.hide();
        Pp.hide();
        Sn.hide();
    };
    Sn.remove = function () {
        $('#main .schnack-bubble').remove();
    };
    Sn.showDisabler = function (zIndex, onClick) {
        Sn.showDisabler.disabler = $('<div/>', {
            'class': 'disabler',
            css: {
                'zIndex': zIndex || 900
            }
        }).appendTo($(document.body)).bind('click', function () {
            if (onClick === false) {
                return;
            }
            var func = onClick || $.noop;
            if (func() !== false) {
                Sn.hideDisabler();
            }
        });
    };
    Sn.hideDisabler = function () {
        var d = Sn.showDisabler.disabler;
        if (d) {
            d.remove();
        }
    };
    Sn.showDeviceOfflineWarning = function (view, time) {
        var vid = view.id,
            rel = $('.structures #' + vid);
        if (!rel.length) {
            return;
        }
        Sn.showDeviceOfflineWarning.id = vid;
        var dlh = document.location.hostname,
            tmpl = $(_.template($('#_TMPL #device_offline_template').html(), {
                nest_domain: dlh.substr(dlh.indexOf('.') + 1),
                time_offline: Date.Nest.timeFromNow(time, false, true, 'floor')
            })),
            msg = (((new Date()) - time) < 3600000) ? tmpl.children('.under-an-hour').text() : tmpl.children('.over-an-hour').text(),
            elem = Sn.show({
                rel: rel,
                'class': 'device-offline-schnack',
                css: {
                    width: 315
                },
                html: msg,
                id: 'device_offline',
                noHideTabs: true
            });
        if (elem) {
            elem.bind('click', function (event) {
                event.stopImmediatePropagation();
                Sn.hide();
            });
            N.log('Schnack.showDeviceOfflineWarning', [vid, time]);
        }
    };
    Sn.showDeviceOfflineWarning.hide = function (vid) {
        if (vid && (vid !== Sn.showDeviceOfflineWarning.id)) {
            return;
        }
        if ($('.schnack-bubble.device-offline-schnack').length) {
            Sn.hide();
        }
        Sn.showDeviceOfflineWarning.id = null;
    };
    Sn.showDeviceOfflineWarning.id = null;
    Sn.showToggleDevicesOfflineWarning = function (devices, toHome) {
        var tList = _.map(devices, function (d) {
            return d.getName();
        }),
            tListTxt = tList.join(", ").replace(/,\s([^,]+)$/, ' and $1'),
            state = toHome ? "Home" : "Away",
            msg = (devices.length === 1) ? "The " + tListTxt + " thermostat can\u02BCt be reached. It will be set to " + state + " when it comes back online." : "The " + tListTxt + " thermostats can\u02BCt be reached. They will be set to " + state + " when they come back online.";
        N.wait(250).then(function () {
            Sn.show({
                html: msg,
                css: {
                    width: '350px'
                },
                id: 'toggle_devices_offline',
                noHideTabs: true
            });
        });
    };
    Sn.showDeviceLimitDialog = function (maxDevices) {
        var html = _.template($('#_TMPL #device_limit_dialog').html())({
            max_devices: maxDevices
        });
        Sn.show({
            html: html,
            css: {
                width: '435px'
            },
            id: 'device_limit_dialog',
            noHideTabs: true
        });
    };
    Sn.showDevicePerStructureLimitDialog = function (maxDevices) {
        var html = _.template($('#_TMPL #device_per_structure_limit_dialog').html())({
            max_devices: maxDevices
        });
        Sn.show({
            html: html,
            css: {
                width: '435px'
            },
            id: 'device_per_structure_limit_dialog',
            noHideTabs: true
        });
    };
    Sn.showStructureLimitDialog = function (maxStructures) {
        var html = _.template($('#_TMPL #structure_limit_dialog').html())({
            max_structures: maxStructures
        });
        Sn.show({
            html: html,
            css: {
                width: '400px'
            },
            id: 'structure_limit_dialog',
            noHideTabs: true
        });
    };
    Sn.showExitAwayModePrompt = function (structure) {
        var html = _.template($('#_TMPL #exit_away_mode_prompt').html())({
            structure_name: structure.getName() || _L('Home')
        }),
            sn = Sn.show({
                html: html,
                css: {
                    width: '400px'
                },
                id: 'exit_away_mode_prompt_dialog',
                noHideTabs: true
            }),
            clickHandler = function (event) {
                var t = event.target;
                if ($(t).hasClass('yes')) {
                    structure.setAway(false);
                }
                if (t.tagName.toLowerCase() === 'button') {
                    Sn.hide();
                    Sn.hideDisabler();
                }
            };
        sn.bind('click', clickHandler);
    };
    Pp.init = _.once(function () {
        N.log('PassphraseDialog.init');
        $(window).bind(C.Events.REQUEST_PASSPHRASE_PAIRING, function (event, args) {
            Pp.addDevice(args);
        }).bind(C.Events.DISMISS_PASSPHRASE_PAIRING, function () {
            Pp.hide();
        }).bind(C.Events.REQUEST_AUTO_PAIRING, function (events, args) {
            Pp.showAutoPairingAlert(args);
        });
    });
    $(window).bind('load', Pp.init);
    Pp._cache = {};
    Pp.shown = function () {
        return ($('#main .schnack-bubble .device-pairing').length > 0);
    };
    Pp.hide = function () {
        if (Pp.shown()) {
            A.animate(Sn.element(), {
                opacity: 0
            }, 200).then(function () {
                $('.house').removeClass('schnack-house');
                Sn.remove();
                $('body > .disabler').remove();
            });
        }
    };
    Pp.show = function (structure, allowCancel) {
        if (Pp.shown()) {
            N.warn('PassphraseDialog.show: requested while already displayed');
            return;
        }
        C.AccountTray.closeTray().then(function () {
            D.closeTabs().then(function () {
                var h = $(document.body).height(),
                    minHeight = 770,
                    isStunted = (h < minHeight),
                    params = {
                        rel: isStunted ? null : $('.house', structure.elem()),
                        html: $('#device_pairing_template').html(),
                        type: 'blocking'
                    }, d = Sn.show(params);
                if (Pp.shown()) {
                    $('.house', structure.elem()).addClass('schnack-house');
                    Sn.showDisabler(450, allowCancel && Pp.hide);
                    Pp.prepare(structure, allowCancel);
                }
            });
        });
    };
    Pp.addDevice = function (args) {
        args = args || {};
        var structure = args.structure || C.getSelectedView().getStructureView(),
            allowCancel = Boolean(structure) && !(C.noDevices());
        Pp.show(structure, allowCancel);
    };
    Pp.prepare = function (structure, allowCancel) {
        var bubble = Sn.element(),
            reject = function (elem) {
                var w = '#E51010',
                    r = '#CCC';
                elem.stop().css({
                    borderTopColor: w,
                    borderRightColor: w,
                    borderBottomColor: w,
                    borderLeftColor: w
                }).animate({
                    borderTopColor: r,
                    borderRightColor: r,
                    borderBottomColor: r,
                    borderLeftColor: r
                }, 400, function () {
                    elem.css({
                        borderTopColor: '',
                        borderRightColor: '',
                        borderBottomColor: '',
                        borderLeftColor: ''
                    });
                });
                return false;
            }, validateClass = function (event, cls) {
                var target = $(event.target);
                if (!target.hasClass(cls)) {
                    return reject(target);
                }
                target.val('');
                N.wait(10).then(function () {
                    target.addClass('fulfilled').nextAll('.pairing-char').first().focus().select();
                });
                return true;
            };
        if (allowCancel) {
            $(window).bind('keyup', function (event) {
                if (event.keyCode === 27) {
                    Pp.hide();
                }
            });
        }
        var step = 0,
            steps = $('.step', bubble),
            xfadeTime = 453,
            numSteps = steps.length,
            swap = function (dir) {
                var thisStep = $(steps[step]),
                    nextStep = (step + dir + numSteps) % numSteps;
                thisStep.animate({
                    opacity: 0
                }, xfadeTime, (function () {
                    this.hide();
                }).bind(thisStep));
                $(steps[nextStep]).css({
                    opacity: 0
                }).css({
                    display: 'block'
                }).animate({
                    opacity: 1
                }, xfadeTime);
                step = nextStep;
            }, forward = function () {
                swap(1);
            }, back = function () {
                swap(-1);
            };
        $('.step-forward', bubble).bind('click', forward);
        $('.step-back', bubble).bind('click', back);
        var value = '',
            handleResponse, associate = function () {
                structure.getModel().associate(value, handleResponse);
            }, associateOnce = _.once(associate),
            chars = $('.device-pairing .pairing-char', bubble),
            spinner = $('.spinner', bubble),
            errorMsg = $('.error', bubble),
            handleDelete = function (event) {
                var target = $(event.target),
                    idx = _.indexOf(chars.get(), target[0]) - 1,
                    prev = $(chars[idx]);
                if (prev) {
                    prev.val('').removeClass('fulfilled').focus();
                }
                target.removeClass('fulfilled');
                return true;
            }, setupFields = function () {
                chars.bind('keypress', function (event) {
                    var cc = event.charCode || event.keyCode,
                        target = $(event.target);
                    if (cc === 9) {
                        return false;
                    } else if (cc === 8 || cc === 16 || event.metaKey || event.ctrlKey) {
                        return true;
                    } else if (cc >= 48 && cc <= 57) {
                        return validateClass(event, 'number');
                    } else if ((cc >= 65 && cc <= 90) || (cc >= 97 && cc <= 122)) {
                        return validateClass(event, 'letter');
                    } else {
                        return validateClass(event);
                    }
                }).bind('keyup', function (event) {
                    var cc = event.charCode || event.keyCode,
                        target = $(event.target),
                        t = 0;
                    value = '';
                    if (cc === 8) {
                        return handleDelete(event);
                    }
                    _.each(chars, function (itm) {
                        var v = itm.value;
                        if (v.length === 1) {
                            value += v;
                            t += 1;
                        }
                    });
                    if (t === 7) {
                        spinner.animate({
                            opacity: 1
                        });
                        errorMsg.animate({
                            height: 0
                        }, 150);
                        associateOnce();
                        chars.unbind().attr('disabled', true);
                    }
                }).bind('click', function (event) {
                    var target = $(event.target);
                    if (target.length) {
                        target[0].select();
                    }
                }).attr('disabled', false).val('').first().focus();
            };
        handleResponse = function (message, sid) {
            if (message.status !== 'success') {
                var badStr = _.reduce(chars, function (m, c) {
                    if (m.length === 3) {
                        m += '-';
                    }
                    return m + c.value;
                }, '').toUpperCase(),
                    errorInfo = _.template($('#_TMPL #device_pairing_error_template').html(), {
                        entry_key: badStr
                    });
                setupFields();
                errorMsg.html(errorInfo).animate({
                    height: $('.error-info', errorMsg).outerHeight()
                }, 150);
                spinner.stop().animate({
                    opacity: 0
                });
                $('.passcode .fulfilled').removeClass('fulfilled');
                associateOnce = _.once(associate);
            } else {
                Pp.hide();
                D.refresh();
            }
        };
        setupFields();
    };
    Pp.showAutoPairingAlert = function (msg) {
        if (!K.windowLoaded) {
            N.wait(1000).then(function () {
                Pp.showAutoPairingAlert(msg);
            });
            return;
        }
        N.log('PassphraseDialog.showAutoPairingAlert:', msg);
        if (!msg || !msg.dialog_data) {
            if ($('#main .schnack-bubble .device-autopairing').length) {
                Sn.hide();
            }
            return;
        }
        var sid = msg.structure_id,
            selem = (sid && $('#' + sid)) || [],
            rel = selem.length && {
                rel: selem
            }, offerPassphrasePairing = function () {
                N.wait(600).then(function () {
                    if (C.noDevices()) {
                        $(window).trigger(C.Events.REQUEST_PASSPHRASE_PAIRING);
                    }
                });
            };
        if (!selem) {
            return;
        }
        var limits = C.CLOUD_CONFIG || {}, maxDevices = limits.max_thermostats || Infinity,
            maxDPS = limits.max_thermostats_per_structure || Infinity;
        if (M.Cache.numDevices() >= maxDPS) {
            return GA.trackEvent('Console', 'maxDeviceLimitAutoPairRequested', 'max_devices', maxDevices);
        } else if (M.Cache.numDevices(sid) >= maxDPS) {
            return GA.trackEvent('Console', 'maxDevicePerStructureLimitAutoPairRequested', 'max_devices', maxDPS);
        }
        N.wait(1000).then(function () {
            C.AccountTray.closeTray().then(function () {
                D.closeTabs().then(function () {
                    var ok = function (event) {
                        Sn.hide(event);
                        N.wait(7500).then(offerPassphrasePairing);
                    }, cancel = function (event) {
                        Sn.hide(event);
                        N.CZ.userDialogResponse({
                            msg_id: msg.msg_id,
                            response: 'cancel'
                        });
                        N.wait(875).then(offerPassphrasePairing);
                    }, sn = Sn.show(_.extend({
                        css: {
                            marginBottom: '20px',
                            marginLeft: '-10px'
                        },
                        html: $('#device_autopairing_template').html(),
                        type: 'blocking'
                    }, rel));
                    if (sn) {
                        $('.house', $('#s' + sid)[0]).addClass('schnack-house');
                        Sn.showDisabler(450, false);
                        $('.cancel', sn).bind('click', cancel);
                        $('.ok', sn).bind('click', ok);
                    }
                });
            });
        });
    };
    Pp.devicePairedAlert = function (msg) {
        N.log('PassphraseDialog.devicePairedAlert:', msg);
    };
})(window.jQuery, window._, window.Backbone);
(function ($, _, $R, undefined) {
    'use strict';
    var N = window.Nest,
        A = N.Animate,
        _L = N.Localization.namespace('Console'),
        M = N.Models,
        C = N.Console = N.Console || {}, Sn = C.Schnack = C.Schnack || {};
    var T = C.Thermostat = C.Thermostat || function (view) {
            var ct = $('.structures .large-thermostat');
            this.id = view.id;
            this.view = function () {
                return C.getView(view.id);
            };
            this.device = function () {
                return M.Cache.get(view.id);
            };
            this.height = T.CANVAS_HEIGHT;
            this.width = T.CANVAS_WIDTH;
            this.canvas = ct.length ? ct.first() : $('<div/>', {
                'class': 'large-thermostat',
                css: {
                    bottom: T.SMALL_OFFSET,
                    left: T.SMALL_OFFSET
                }
            });
            this.brush = $R(this.canvas.get(0), this.width, this.height);
            return this;
        };
    var Tp = T.prototype;
    T.INSTANCES = {};
    T.DIAMOND_DIAMETER = 320;
    T.ARROW_UP_BASELINE = 90;
    T.ARROW_DOWN_BASELINE = 260;
    T.ARROW_UP_RANGE_BASELINE = 94;
    T.ARROW_DOWN_RANGE_BASELINE = 246;
    T.LEAF_CENTERLINE = 295;
    T.LEAF_FONT_SIZE = 29;
    T.TARGET_TEMP_BASELINE = 170;
    T.TARGET_TEMP_FONT_SIZE = 96;
    T.TARGET_RANGE_BASELINE = 160;
    T.TARGET_RANGE_FONT_SIZE = 64;
    T.TARGET_OFF_AUTO_FONT_SIZE = 32;
    T.TARGET_OFF_AWAY_FONT_SIZE = 54;
    T.TIME_TO_TEMP_BASELINE = 114;
    T.TIME_TO_TEMP_FONT_SIZE = 18;
    T.TIME_TO_RANGE_BASELINE = 118;
    T.COMP_LOCKOUT_BASELINE = 222;
    T.AUTO_OFFSET_Y = 9;
    T.CANVAS_HEIGHT = 240;
    T.CANVAS_WIDTH = 240;
    T.SCREEN_DIAMETER = Math.floor(T.CANVAS_WIDTH * 0.98 * 2) / 2;
    T.FONT_Y_MULTIPLE = 1;
    T.SCREEN_RADIUS = T.SCREEN_DIAMETER / 2;
    T.SCREEN_STROKE = T.CANVAS_WIDTH / 3750;
    T.STAGE_WIDTH = 126;
    T.CANVAS_SMALL_WIDTH = 74;
    T.CANVAS_SMALL_SCALE = T.CANVAS_SMALL_WIDTH / T.CANVAS_WIDTH;
    var fontBaselineToYPos = function (baseline) {
        return T.SCREEN_DIAMETER * (baseline / T.DIAMOND_DIAMETER) * T.FONT_Y_MULTIPLE;
    };
    T.ANIMATION_TIME = 375;
    T.FONT_CHEVRON = T.SCREEN_DIAMETER * 0.321;
    T.FONT_LARGE = T.SCREEN_DIAMETER * (T.TARGET_TEMP_FONT_SIZE / T.DIAMOND_DIAMETER);
    T.FONT_MEDIUM = T.SCREEN_DIAMETER * (T.TIME_TO_TEMP_FONT_SIZE / T.DIAMOND_DIAMETER);
    T.FONT_RANGE = T.SCREEN_DIAMETER * (T.TARGET_RANGE_FONT_SIZE / T.DIAMOND_DIAMETER);
    T.FONT_AUTO = T.SCREEN_DIAMETER * (T.TARGET_OFF_AUTO_FONT_SIZE / T.DIAMOND_DIAMETER);
    T.FONT_AWAY = T.SCREEN_DIAMETER * (T.TARGET_OFF_AWAY_FONT_SIZE / T.DIAMOND_DIAMETER);
    T.FONT_RANGE_MOD = 0.92;
    T.X_OFFSET_PCT = 0.998;
    T.Y_OFFSET_PCT = 0.998;
    T.ORIGIN = new N.Point((T.CANVAS_WIDTH / 2) * T.X_OFFSET_PCT + 0.5, (T.CANVAS_HEIGHT / 2) * T.Y_OFFSET_PCT + 0.5);
    T.NUM_HASHES = 147;
    T.HASH_WIDTH = T.CANVAS_WIDTH / 175;
    T.HASH_DEG_MIN = 124;
    T.HASH_DEG_MAX = 416;
    T.HASH_DEFAULT_OPACITY = 0.5;
    T.HASH_FOCUS_MULTIPLE = 3.7;
    T.HASH_FOCUS_OPACITY = 85;
    T.OUTER_HASH_RADIUS = T.SCREEN_RADIUS * (1 - (24 / 320));
    T.INNER_HASH_RADIUS = T.OUTER_HASH_RADIUS - (T.SCREEN_RADIUS * (3 / 32) * 2);
    T.DEGREES_PER_HASH = 360 / T.NUM_HASHES;
    T.TARGET_TEMP_ORIGIN = new N.Point(T.ORIGIN.x, fontBaselineToYPos(T.TARGET_TEMP_BASELINE));
    T.TARGET_RANGE_ORIGIN = new N.Point(T.ORIGIN.x, fontBaselineToYPos(T.TARGET_RANGE_BASELINE));
    T.TIME_TO_TEMP_ORIGIN = new N.Point(T.ORIGIN.x, fontBaselineToYPos(T.TIME_TO_TEMP_BASELINE));
    T.TIME_TO_RANGE_ORIGIN = new N.Point(T.ORIGIN.x, fontBaselineToYPos(T.TIME_TO_RANGE_BASELINE));
    T.COMP_LOCKOUT_ORIGIN = new N.Point(T.ORIGIN.x, fontBaselineToYPos(T.COMP_LOCKOUT_BASELINE));
    T.AWAY_ORIGIN = 1.0;
    T.AWAY_ORIGIN = new N.Point(T.ORIGIN.x * 1.016, T.ORIGIN.y * T.AWAY_ORIGIN);
    T.ICON_ORIGIN = new N.Point(T.ORIGIN.x * 1.015, fontBaselineToYPos(T.LEAF_CENTERLINE));
    T.ARROW_BASELINE_DISPLACEMENT = T.FONT_CHEVRON * 0.205;
    T.UP_ARROW_ORIGIN = new N.Point(T.ORIGIN.x * 1.031, fontBaselineToYPos(T.ARROW_UP_BASELINE));
    T.DOWN_ARROW_ORIGIN = new N.Point(T.ORIGIN.x * 1.031, fontBaselineToYPos(T.ARROW_DOWN_BASELINE));
    T.UP_ARROW_RANGE_ORIGIN = new N.Point(T.ORIGIN.x * 1.031, fontBaselineToYPos(T.ARROW_UP_RANGE_BASELINE));
    T.DOWN_ARROW_RANGE_ORIGIN = new N.Point(T.ORIGIN.x * 1.031, fontBaselineToYPos(T.ARROW_DOWN_RANGE_BASELINE));
    T.ARROW_RANGE_OFFSET_MULTIPLE = 0.152;
    T.SMALL_OFFSET = -83;
    T.NAME_LEFT_OFF = -18;
    T.NAME_LEFT_ON = 65;
    T.show = function (device) {
        var dfr = $.Deferred();
        T.initStatus();
        T.show.time = (new Date()).getTime();
        var thermo;
        if (!T.INSTANCES[device.id]) {
            T.INSTANCES[device.id] = true;
            T.hide().then(function () {
                N.wait(175).then(function () {
                    thermo = T.INSTANCES[device.id] = new T(device);
                    $(window).bind('keydown', T._keyHandler = T.genKeyHandler(thermo));
                    $(device.elem()).append(thermo.canvas);
                    thermo.show().then(function () {
                        dfr.resolve();
                    });
                });
            });
        } else {
            dfr.resolve();
        }
        return dfr.promise();
    };
    T.hide = function () {
        var dfr = $.Deferred(),
            e = $('.large-thermostat'),
            resolve = _.once(function () {
                dfr.resolve();
            });
        if (e.length && (((new Date()).getTime() - T.show.time) > 400)) {
            _.each(T.INSTANCES, function (v, k) {
                v.animateAwayTemps.cleanup(v);
                v.shrink().then(resolve);
                $('#home .disabler').remove();
            });
            T.INSTANCES = {};
            $(window).unbind('keydown', T._keyHandler).unbind(C.Events.STAGE_UPDATE_VIEW, T.notifyUpdate).unbind('mouseup', T.clearMousedown);
        } else {
            _.defer(resolve);
        }
        return dfr.promise();
    };
    T.notifyUpdate = function (event, view) {
        var t = T.INSTANCES[view.id];
        if (t) {
            t.update();
        }
    };
    T.genKeyHandler = function (thermo) {
        return function (event) {
            N.wait(50).then(function () {
                if (event.isImmediatePropagationStopped()) {
                    return;
                }
                var kc = event.keyCode,
                    d = thermo.device(),
                    tempDown = _.throttle(function () {
                        thermo.temperatureDown();
                    }, 100),
                    tempUp = _.throttle(function () {
                        thermo.temperatureUp();
                    }, 100);
                if (kc === 37 || kc === 40) {
                    if (d.isSystemOff() || d.isAway()) {
                        return;
                    }
                    tempDown();
                } else if (kc === 38 || kc === 39) {
                    if (d.isSystemOff() || d.isAway()) {
                        return;
                    }
                    tempUp();
                }
                if (N.DEBUG && event.ctrlKey) {
                    if (kc >= 49 && kc <= 57) {
                        var amt = kc - 53,
                            pct = (100 + (amt * 10)) / 100,
                            scale = T._keyHandler._scale = (T._keyHandler._scale || 1) * pct,
                            cvs = $(thermo.canvas);
                        if (amt === 0) {
                            scale = T._keyHandler._scale = 1;
                        }
                        A.animate(cvs, {
                            scale: scale
                        }, 300);
                        if (T._keyHandler._disp) {
                            T._keyHandler._disp.remove();
                        }
                        var disp = T._keyHandler._disp = $('<div/>', {
                            css: {
                                color: 'white',
                                fontSize: '28px',
                                left: 0,
                                position: 'absolute',
                                right: 0,
                                textAlign: 'center',
                                top: 75,
                                zIndex: 1200
                            }
                        }).appendTo(document.body);
                        N.wait(1600).then(function () {
                            A.animate(disp, {
                                opacity: 0
                            }, 200).then(function () {
                                disp.remove();
                            });
                        });
                    }
                }
            });
        };
    };
    T.initStatus = _.once(function () {
        if (!N.DEBUG) {
            return;
        }
        var f = ['current-temperature', 'target-temperature', 'target-temperature-low', 'target-temperature-high', 'time-to-target'],
            ts = $('<div/>', {
                id: 'thermozilla_status'
            }).appendTo($('#_TMPL'));
        _.each(f, function (v, k) {
            $('<div/>', {
                'class': v
            }).appendTo(ts);
        });
    });
    T.first = function () {
        return _.detect(T.INSTANCES, function () {
            return true;
        }) || null;
    };
    T.temperatureDown = function (attr) {
        return T.first().temperatureDown(attr);
    };
    T.temperatureUp = function (attr) {
        return T.first().temperatureUp(attr);
    };
    Tp.show = function () {
        var self = this,
            dfr = $.Deferred(),
            mdTimer = null,
            isHoldingMouseButton = false,
            isOutsideThermo = function (event) {
                var tn = event.target.parentNode.tagName.toLowerCase(),
                    isOutside = !! _.detect(['div', 'body'], function (t) {
                        return t === tn;
                    });
                return isOutside;
            };
        T.clearMousedown = function (event) {
            window.clearTimeout(mdTimer);
            window.setTimeout(function () {
                isHoldingMouseButton = false;
            }, 115);
        };
        $(this.canvas).bind('click', function (event) {
            event.stopImmediatePropagation();
            var co = self.canvas.offset(),
                dx = event.pageX - co.left,
                dy = event.pageY - co.top,
                p = new N.Point(dx, dy);
            if (!p.isInCircle(T.ORIGIN, T.INNER_HASH_RADIUS)) {
                return;
            } else {
                if (isHoldingMouseButton) {
                    return;
                }
                self.handlePress(event);
            }
        }).bind('mousemove', function (event) {
            event.stopPropagation();
            var co = self.canvas.offset(),
                dx = event.pageX - co.left,
                dy = event.pageY - co.top,
                p = new N.Point(dx, dy);
            if (p.isInCircle(T.ORIGIN, T.INNER_HASH_RADIUS)) {
                var isUp = (dy < (T.SCREEN_DIAMETER / 2)),
                    rp = {
                        x: dx,
                        y: dy
                    };
                if (isUp) {
                    self.showUpArrow(rp);
                } else {
                    self.showDownArrow(rp);
                }
            } else {
                self.showNode(self.timeToTarget, self.icon);
                self.hideNode(self.upArrow, self.downArrow);
                self.topActive = self.bottomActive = false;
            }
        }).bind('mousedown', function (event) {
            var co = self.canvas.offset(),
                dx = event.pageX - co.left,
                dy = event.pageY - co.top,
                p = new N.Point(dx, dy);
            if (isOutsideThermo(event) || !p.isInCircle(T.ORIGIN, T.INNER_HASH_RADIUS)) {
                return;
            }
            var nextInc = function () {
                self.handlePress(event);
                mdTimer = window.setTimeout(function () {
                    nextInc();
                }, 175);
            };
            var isUp = (dy < (T.SCREEN_DIAMETER / 2)),
                rp = {
                    x: dx,
                    y: dy
                };
            if (isUp) {
                self.showUpArrow(rp);
            } else {
                self.showDownArrow(rp);
            }
            mdTimer = window.setTimeout(function () {
                nextInc();
                isHoldingMouseButton = true;
            }, 615);
            event.stopImmediatePropagation();
        }).mousewheel(this.handleScroll.bind(this)).noContext();
        $(window).bind(C.Events.STAGE_UPDATE_VIEW, T.notifyUpdate).bind('mouseup', T.clearMousedown);
        $(document.body).bind('mousemove mouseleave blur', this.hideArrows.bind(this));
        this.drawActivityColor();
        this.drawTargetTemp();
        this.drawIcon();
        this.animateGrowth().then(function () {
            dfr.resolve();
        });
        return dfr.promise();
    };
    Tp.draw = function () {
        this.currentActivityState = this.activityState();
        this.drawActivityColor();
        this.drawHashes();
        this.drawIcon();
        this.update();
    };
    Tp.update = function () {
        if (this.currentActivityState !== this.activityState()) {
            return this.draw();
        }
        this.drawHashes();
        this.drawTargetTemp();
        if (this.isDeviceOffline()) {
            return;
        }
        this.drawCurrentTempHash();
        this.drawCurrentTempValue();
        this.drawTargetTempHash();
        this.drawUpperText();
        this.drawIcon();
    };
    Tp.drawActivityColor = function () {
        this.removeNode(this.activityColor);
        var d = this.device(),
            b = this.brush,
            tc = T.ORIGIN,
            ac = this.activityColor = b.set(),
            wr = T.SCREEN_RADIUS,
            cOut = b.circle(tc.x, tc.y, wr),
            cRing = b.circle(tc.x, tc.y, wr * 0.9727),
            cIn = b.circle(tc.x, tc.y, wr * 0.972),
            dc = this.displayColor(),
            c1 = dc.base,
            c2 = dc.edge,
            c0 = N.Color.blend(c1, '#FFF', 72);
        cOut.attr({
            'fill': [270, c0, c2].join('-'),
            'stroke': 'rgba(0, 0, 0, 0)',
            'stroke-width': 0
        });
        cRing.attr({
            'fill': c2,
            'stroke': 'rgba(0, 0, 0, 0)',
            'stroke-width': 0
        });
        cIn.attr({
            'fill': [270, c1, c2].join('-'),
            'stroke': 'rgba(0, 0, 0, 0)',
            'stroke-width': 0
        });
        ac.push(cOut, cRing, cIn);
        ac.toBack();
    };
    Tp.drawHashes = function () {
        if (!this.hashes) {
            var self = this,
                fromDeg = T.HASH_DEG_MIN,
                toDeg = T.HASH_DEG_MAX,
                d1 = Math.min(fromDeg, toDeg),
                d2 = Math.max(fromDeg, toDeg),
                b = this.brush,
                ival = 1;
            this.hashes = b.set();
            for (var d = d1; d < d2; d += T.DEGREES_PER_HASH) {
                var p = this.hashLinePathForDegree(d);
                if (p) {
                    p.attr({
                        'stroke': C.COLOR.WHITE,
                        'stroke-opacity': T.HASH_DEFAULT_OPACITY,
                        'stroke-width': T.HASH_WIDTH
                    });
                    this.hashes.push(p);
                }
            }
        }
        if (this.device().isSystemOff()) {
            this.hashes.hide();
        } else {
            this.hashes.show();
        }
    };
    Tp.drawTargetTemp = function () {
        this.removeNode(this.targetTemp, this.targetTempValueFraction);
        var d = this.device(),
            b = this.brush,
            ts = d.getTempScale(),
            fs = T.FONT_LARGE,
            cto = T.TARGET_TEMP_ORIGIN.clone(),
            ttp = T.AWAY_ORIGIN.clone(),
            t = this.targetTemp = b.set(),
            ta = 'middle',
            dtxt = null;
        if (d.isSystemOff()) {
            this.removeNode(this.targetTempHash);
            var so = _L('off').toUpperCase();
            fs = T.FONT_AWAY;
            t.push(b.text(Math.floor(ttp.x), Math.floor(ttp.y), so));
            this.status('target-temperature', so);
        } else if (d.isAway()) {
            this.removeNode(this.targetTempHash);
            var sa = _L('away').toUpperCase();
            fs = T.FONT_AWAY;
            t.push(b.text(Math.floor(ttp.x * 1.013), Math.floor(ttp.y), sa));
            this.status('target-temperature', sa);
        } else if (!d.invalidTargetTemperature() && d.isModeRange()) {
            fs = T.FONT_RANGE;
            ta = 'start';
            cto = T.TARGET_RANGE_ORIGIN.clone();
            var ttl = new N.Temperature(d.get('target_temperature_low'), ts),
                tth = new N.Temperature(d.get('target_temperature_high'), ts),
                tsc = (ts === 'C'),
                ttlm = tsc ? 0.44 : 0.462,
                tthm = tsc ? 1.1 : 1.127,
                ltxt = b.text(Math.floor(cto.x * ttlm), Math.floor(cto.y), ttl.js()),
                htxt = b.text(Math.floor(cto.x * tthm), Math.floor(cto.y), tth.js());
            t.push(ltxt, htxt);
            if (!tsc) {
                dtxt = b.text(Math.floor(cto.x * 0.968), Math.floor(cto.y * 0.99), C.BULLET_CHAR);
                t.push(dtxt);
            }
            this.status('target-temperature-low', ttl);
            this.status('target-temperature-high', tth);
        } else {
            var dt = new N.Temperature(d.get('target_temperature'), ts),
                magicFractionalCoEfficient = (dt < 10) ? 0.845 : 0.675,
                t0 = b.text(Math.floor(cto.x * magicFractionalCoEfficient), Math.floor(cto.y), dt.js());
            ta = 'start';
            t.push(t0);
            this.status('target-temperature', dt);
        }
        t.attr({
            'fill': C.COLOR.WHITE,
            'font-family': 'Nest Sans',
            'font-weight': 'bold',
            'font-size': fs,
            'stroke': 'rgba(0, 0, 0, 0)',
            'stroke-opacity': 0,
            'stroke-width': 0,
            'text-anchor': ta
        });
        if (dtxt) {
            dtxt.attr({
                'font-size': T.FONT_RANGE * 0.57
            });
        }
    };
    Tp.drawCurrentTempHash = function () {
        this.removeNode(this.currentTempHash);
        var d = this.device(),
            ct = d.getField('current_temperature'),
            mm = d.getTempMinMax(),
            dt = Math.max(mm.min, Math.min(ct, mm.max)),
            dg = this.degreeForTemp(dt),
            p = this.currentTempHash = this.hashLinePathForDegree(dg);
        if (p) {
            p.attr({
                'stroke': new N.Color(C.COLOR.WHITE).blend(this.displayColor().base, T.HASH_FOCUS_OPACITY),
                'stroke-width': T.HASH_WIDTH * T.HASH_FOCUS_MULTIPLE
            });
        }
    };
    Tp.drawCurrentTempValue = function () {
        var d = this.device();
        if (this.animateAwayTemps.running) {
            return;
        }
        this.removeNode(this.currentTempValue);
        var ts = d.getTempScale(),
            ct = d.getField('current_temperature'),
            dt = new N.Temperature(ct, ts),
            mm = d.getTempMinMax(),
            mct = Math.max(mm.min, Math.min(ct, mm.max)),
            tt = d.getField('target_temperature'),
            dtt = new N.Temperature(tt, ts),
            imr = d.isModeRange(),
            ttl = d.getField('target_temperature_low'),
            dttl = new N.Temperature(ttl, ts),
            tth = d.getField('target_temperature_high'),
            dtth = new N.Temperature(tth, ts),
            isr = imr ? (ttl < ct && (ct - ttl < tth - ct || tth < ct)) : (ct > tt),
            tm = (isr ? 0.692 : -0.692) * ((ts === 'F' && ct > 37.77) || (ts === 'C' && dt.fractional()) ? 1.175 : 1),
            dir = tm,
            b = this.brush,
            cdg = this.degreeForTemp(mct + dir),
            rad = ((T.OUTER_HASH_RADIUS + T.INNER_HASH_RADIUS) / 2) * 0.9987,
            tpt = N.Point.onCircle(cdg, rad, T.ORIGIN);
        this.status('current-temperature', dt);
        if (!d.isAway() && !d.isSystemOff()) {
            if (imr && (dt.equals(dttl) || dt.equals(dtth))) {
                return;
            } else if (dt.equals(dtt)) {
                return;
            }
        }
        var c = new N.Color(C.COLOR.WHITE).blend(this.displayColor().base, T.HASH_FOCUS_OPACITY),
            t = this.currentTempValue = b.text(Math.floor(tpt.x), Math.floor(tpt.y), dt.js());
        t.attr({
            'fill': c,
            'font-family': 'Nest Sans',
            'font-weight': 'bold',
            'font-size': T.FONT_MEDIUM,
            'stroke': '#FFF',
            'stroke-opacity': 0.1,
            'stroke-width': T.FONT_MEDIUM / 45,
            'text-anchor': 'start'
        });
        t.attr({
            'transform': 'T-' + Math.floor(t.getBBox(true).width / 2) + ',0'
        });
    };
    Tp.drawTargetTempHash = function () {
        this.removeNode(this.targetTempHash);
        var d = this.device();
        if (d.isSystemOff()) {
            return;
        }
        var s = this.targetTempHash = this.brush.set(),
            len = T.OUTER_HASH_RADIUS - T.INNER_HASH_RADIUS,
            irc = T.INNER_HASH_RADIUS - ((len * 1.25) - len),
            mm = d.getTempMinMax(),
            isa = d.isAway();
        if (d.isModeRange() || isa) {
            var pl, ph, ttl = d.getField(isa ? 'away_temperature_low' : 'target_temperature_low'),
                tth = d.getField(isa ? 'away_temperature_high' : 'target_temperature_high'),
                dgl = this.degreeForTemp(Math.max(ttl, mm.min)),
                dgh = this.degreeForTemp(Math.min(tth, mm.max));
            if ((d.isModeRange() && !isa) || (d.hasAC() && d.isAwayTempHighEnabled() && isa)) {
                ph = this.hashLinePathForDegree(dgh, null, [T.OUTER_HASH_RADIUS, irc]);
                ph.attr({
                    'stroke': C.COLOR.WHITE,
                    'stroke-width': T.HASH_WIDTH * T.HASH_FOCUS_MULTIPLE
                });
                s.push(ph);
            }
            if ((d.isModeRange() && !isa) || (d.hasHeat() && d.isAwayTempLowEnabled() && isa)) {
                pl = this.hashLinePathForDegree(dgl, null, [T.OUTER_HASH_RADIUS, irc]);
                pl.attr({
                    'stroke': C.COLOR.WHITE,
                    'stroke-width': T.HASH_WIDTH * T.HASH_FOCUS_MULTIPLE
                });
                s.push(pl);
            }
        } else {
            var tt = d.getField('target_temperature'),
                dg = this.degreeForTemp(Number.Nest.constrain(tt, mm.min, mm.max)),
                p = this.hashLinePathForDegree(dg, null, [T.OUTER_HASH_RADIUS, irc]);
            if (p) {
                p.attr({
                    'stroke': C.COLOR.WHITE,
                    'stroke-width': T.HASH_WIDTH * T.HASH_FOCUS_MULTIPLE
                });
                s.push(p);
            }
        }
        if (isa) {
            this.animateAwayTemps();
        }
    };
    Tp.animateAwayTemps = function () {
        var d = this.device();
        if (!d.get('away_temperature_high_enabled') && !d.get('away_temperature_low_enabled')) {
            return;
        }
        var self = this,
            f = this.animateAwayTemps,
            ts = d.getTempScale(),
            b = this.brush,
            mm = d.getTempMinMax(),
            atl = d.getField('away_temperature_low'),
            ath = d.getField('away_temperature_high'),
            ct = d.getField('current_temperature'),
            hct = (Math.abs(ct - atl) <= 2.5 || Math.abs(ct - ath) <= 2.5),
            dgl = this.degreeForTemp(Math.max(atl, mm.min)) - 7.5,
            dgh = this.degreeForTemp(Math.min(ath, mm.max)) + 7.5,
            rad = ((T.OUTER_HASH_RADIUS + T.INNER_HASH_RADIUS) / 2),
            lpt = N.Point.onCircle(dgl, rad, T.ORIGIN),
            hpt = N.Point.onCircle(dgh, rad, T.ORIGIN),
            dtl = new N.Temperature(atl, ts),
            dth = new N.Temperature(ath, ts),
            updateLow = (f.last_low !== atl),
            updateHigh = (f.last_high !== ath);
        if (!updateLow && !updateHigh) {
            return;
        }
        if (this.awayTemps) {
            this.awayTemps.stop(true, true);
            this.removeNode(this.awayTemps);
        }
        f.done = false;
        f.running = true;
        f.last_low = d.isAwayTempLowEnabled() ? atl : -Infinity;
        f.last_high = d.isAwayTempHighEnabled() ? ath : Infinity;
        this.awayTemps = b.set();
        if (d.isAwayTempLowEnabled()) {
            var tl = b.text(Math.floor(lpt.x), Math.floor(lpt.y), dtl.js());
            tl.attr({
                'fill': '#FFF',
                'font-family': 'Nest Sans',
                'fill-opacity': 0,
                'font-weight': 'bold',
                'font-size': T.FONT_MEDIUM,
                'opacity': 0,
                'stroke': '#FFF',
                'stroke-opacity': 0,
                'stroke-width': T.FONT_MEDIUM / 45,
                'text-anchor': 'middle'
            });
            this.awayTemps.push(tl);
        }
        if (d.isAwayTempHighEnabled()) {
            var th = b.text(Math.floor(hpt.x), Math.floor(hpt.y), dth.js());
            th.attr({
                'fill': '#FFF',
                'font-family': 'Nest Sans',
                'fill-opacity': 0,
                'font-weight': 'bold',
                'font-size': T.FONT_MEDIUM,
                'opacity': 0,
                'stroke': '#FFF',
                'stroke-opacity': 0,
                'stroke-width': T.FONT_MEDIUM / 45,
                'text-anchor': 'middle'
            });
            this.awayTemps.push(th);
        }
        var finish = _.once(function () {
            self.awayTemps.animate({
                'fill-opacity': 0,
                'opacity': 0
            }, 275, function () {
                f.done = true;
                f.running = false;
                f.last_low = atl;
                f.last_high = ath;
                if (hct) {
                    self.currentTempValue.animate({
                        'fill-opacity': 1,
                        'opacity': 1
                    }, 140);
                }
            });
        });
        N.wait(300).then(function () {
            if (hct) {
                self.currentTempValue.animate({
                    'fill-opacity': 0,
                    'opacity': 0
                }, 140);
            }
            self.awayTemps.animate({
                'fill-opacity': 1,
                'opacity': 1
            }, 275, function () {
                N.wait(1800).then(finish);
            });
        });
    };
    Tp.animateAwayTemps.cleanup = function (device) {
        var f = device.animateAwayTemps;
        f.done = false;
        f.running = false;
        f.last_low = undefined;
        f.last_high = undefined;
    };
    Tp.drawUpperText = function () {
        this.removeNode(this.timeToTarget);
        var d = this.device(),
            b = this.brush,
            fs = T.FONT_MEDIUM,
            ttp = T.TIME_TO_TEMP_ORIGIN.clone(),
            dtt = d.getTimeToTarget(),
            isc = d.isConditioning(),
            ish = d.isHeating(),
            ism = d.isModeRange(),
            iso = d.isSystemOff(),
            offsetY = 0;
        if (iso || d.invalidTargetTemperature()) {
            return;
        } else if (d.isAway()) {
            if (d.isAutoAway()) {
                fs = T.FONT_AUTO;
                dtt = _L('auto');
                offsetY = Math.floor(T.SCREEN_DIAMETER * (T.AUTO_OFFSET_Y / T.DIAMOND_DIAMETER));
            } else {
                return;
            }
        } else if (d.isFanCooling()) {
            dtt = _L('airwave');
        } else if (d.isHeatStage2()) {
            dtt = _L('heat stage 2');
        } else if (d.isAuxHeating()) {
            dtt = _L('aux. heat');
        } else if (!isc) {
            if (ism) {
                dtt = _L('range');
            } else {
                dtt = d.isModeHeat() ? _L('heat set to') : _L('cool set to');
            }
        } else if (!dtt) {
            dtt = ish ? _L('heating') : _L('cooling');
        }
        if (ism && isc) {
            ttp = T.TIME_TO_RANGE_ORIGIN.clone();
        }
        var ttt = this.timeToTarget = b.text(Math.floor(ttp.x), Math.floor(ttp.y) + offsetY, dtt.toUpperCase());
        if (d.isAway() && d.isAutoAway()) {
            ttt.attr({
                'font-weight': 'bold'
            });
        }
        ttt.attr({
            'fill': C.COLOR.WHITE,
            'font-family': 'Nest Sans',
            'font-size': fs,
            'stroke': C.COLOR.WHITE,
            'stroke-opacity': 0,
            'stroke-width': 0,
            'text-anchor': 'start'
        });
        ttt.attr({
            'transform': 'T-' + Math.floor(ttt.getBBox(true).width / 2) + ',0'
        });
        this.status('time-to-target', dtt);
    };
    Tp.drawIcon = function () {
        this.removeNode(this.icon);
        var d = this.device(),
            cis = this.view().getCurrentIconState();
        if (!cis.icon) {
            return;
        }
        var b = this.brush,
            f = this.icon = b.text(Math.floor(T.ICON_ORIGIN.x * 1.01), Math.floor(T.ICON_ORIGIN.y), cis.icon);
        f.attr({
            'fill': cis.color,
            'font-family': 'Nest Sans',
            'font-weight': 'bold',
            'font-size': T.SCREEN_DIAMETER * (cis.size / 100),
            'stroke': cis.color,
            'stroke-opacity': 0,
            'stroke-width': 0
        });
    };
    Tp.hashLinePathForDegree = function (deg, brush, radii) {
        if (isNaN(deg)) {
            return;
        }
        radii = radii || [T.OUTER_HASH_RADIUS, T.INNER_HASH_RADIUS];
        var b = brush || this.brush,
            op = N.Point.onCircle(deg, radii[0], T.ORIGIN),
            ip = N.Point.onCircle(deg, radii[1], T.ORIGIN),
            p = b.path(N.Point.join(op.moveTo(), ip.lineTo()));
        return p;
    };
    Tp.activityState = function () {
        var d = this.device();
        return d.isCooling() ? 'COOL' : (d.isHeating() ? 'HEAT' : 'OFF');
    };
    Tp.displayColor = function () {
        var d = this.device(),
            c1 = C.COLOR.BLACK_TOP,
            c2 = C.COLOR.BLACK_BOTTOM;
        if (!d.isSystemOff()) {
            if (d.isCooling() || d.isFanCooling()) {
                c1 = C.COLOR.BLUE_TOP;
                c2 = C.COLOR.BLUE_BOTTOM;
            } else if (d.isHeating()) {
                c1 = C.COLOR.ORANGE_TOP;
                c2 = C.COLOR.ORANGE_BOTTOM;
            }
        }
        return {
            base: c1,
            edge: c2
        };
    };
    Tp.degreeForTemp = function (temp) {
        var d = this.device(),
            ts = d.getTempScale(),
            dt = (ts === 'F') ? Math.Nest.CToF(temp) : temp,
            tmm = d.getDisplayTempMinMax(),
            tms = tmm.max - tmm.min,
            tmo = dt - tmm.min,
            pco = tmo / tms,
            dgs = T.HASH_DEG_MAX - T.HASH_DEG_MIN,
            dg = (dgs * pco) + T.HASH_DEG_MIN;
        return dg;
    };
    Tp.getDisplayTemperature = function (t) {
        var d = this.device();
        if (d.invalidTargetTemperature() || this.isDeviceOffline()) {
            return ['?', ''];
        }
        var temp = t || d.attributes.target_temperature,
            ts = d.getTempScale(),
            tv = N.displayTemperature(temp, ts),
            frac = '';
        if (ts.toUpperCase() === 'C') {
            if (!Number.Nest.isInteger(tv)) {
                frac = '\u2075';
                tv = Math.floor(tv);
            }
        }
        return [String(tv), frac];
    };
    Tp.handlePress = function (event) {
        var d = this.device();
        if (d.invalidTargetTemperature()) {
            return;
        } else if (d.isAway()) {
            return Sn.showExitAwayModePrompt(d.getStructure());
        }
        var co = this.canvas.offset(),
            dx = event.pageX - co.left,
            dy = event.pageY - co.top,
            p = new N.Point(dx, dy),
            isr = d.isModeRange(),
            isl = (dx < T.CANVAS_WIDTH / 2),
            attr = isr ? (isl ? 'target_temperature_low' : 'target_temperature_high') : 'target_temperature';
        if (dy < T.SCREEN_DIAMETER / 2) {
            this.temperatureUp(attr);
        } else {
            this.temperatureDown(attr);
        }
    };
    Tp.handleScroll = function (event, delta, isIphone) {
        var wd = 0,
            inc = 0,
            func = this.handleScroll,
            lastEvent = func.lastEvent,
            d = this.device(),
            attr = 'target_temperature';
        if (d.invalidTargetTemperature() || d.isAway()) {
            return;
        }
        event.stopPropagation();
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (isIphone) {
            if (!lastEvent) {
                this.handleScroll.lastEvent = event;
                return;
            } else {
                if (event.pageX > lastEvent.pageX) {
                    wd = 1;
                } else if (event.pageY > lastEvent.pageY) {
                    wd = 1;
                }
                lastEvent = event;
            }
        } else {
            var rwd;
            if (event.wheelDelta) {
                rwd = event.wheelDelta;
                func.accumulator += (rwd / 28);
                wd = (Math.abs(func.accumulator) > 28) ? rwd : 0;
            } else if (event.detail) {
                rwd = -event.detail;
                func.accumulator += (rwd / 9);
                wd = (Math.abs(func.accumulator) > 9) ? rwd : 0;
            }
        }
        if (d.isModeRange()) {
            var co = this.canvas.offset(),
                dx = event.pageX - co.left,
                isl = (dx < T.CANVAS_WIDTH / 2);
            attr = (isl ? 'target_temperature_low' : 'target_temperature_high');
        }
        if (wd > 0) {
            func.accumulator = 0;
            this.temperatureUp(attr);
        } else if (wd < 0) {
            func.accumulator = 0;
            this.temperatureDown(attr);
        }
    };
    Tp.handleScroll.lastEvent = null;
    Tp.handleScroll.accumulator = 0;
    Tp.isDeviceOffline = function () {
        return !this.device().isOnline;
    };
    Tp.temperatureUp = function (attr) {
        var d = this.device();
        if (d.isAway() || d.isSystemOff() || d.invalidTargetTemperature()) {
            return;
        }
        this.view().tempIncrease(attr);
    };
    Tp.temperatureDown = function (attr) {
        var d = this.device();
        if (d.isAway() || d.isSystemOff() || d.invalidTargetTemperature()) {
            return;
        }
        this.view().tempDecrease(attr);
    };
    Tp.showUpArrow = function (xy) {
        var d = this.device();
        if (d.isAway() || d.isSystemOff() || d.invalidTargetTemperature()) {
            return;
        }
        this.topActive = true;
        this.bottomActive = false;
        this.hideArrows();
        var b = this.brush,
            imr = d.isModeRange(),
            ac = C.ARROW_UP_CHAR,
            tor, ttt;
        if (imr) {
            var isLeft = (xy.x < (T.CANVAS_WIDTH / 2));
            tor = T.UP_ARROW_RANGE_ORIGIN.clone();
            tor.x += (T.CANVAS_WIDTH * T.ARROW_RANGE_OFFSET_MULTIPLE) * (isLeft ? -1 : 1);
            if (isLeft) {
                if (this.upArrowLeft) {
                    return this.upArrowLeft.show();
                }
                ttt = this.upArrowLeft = b.text(Math.floor(tor.x), Math.floor(tor.y), ac);
            } else {
                if (this.upArrowRight) {
                    return this.upArrowRight.show();
                }
                ttt = this.upArrowRight = b.text(Math.floor(tor.x), Math.floor(tor.y), ac);
            }
        } else {
            if (this.upArrow) {
                return this.upArrow.show();
            }
            tor = T.UP_ARROW_ORIGIN.clone();
            ttt = this.upArrow = b.text(Math.floor(tor.x), Math.floor(tor.y), ac);
        }
        ttt.attr({
            'fill': C.COLOR.WHITE,
            'fill-opacity': 0.5,
            'font-family': 'Nest Sans',
            'font-weight': 'bold',
            'font-size': T.FONT_CHEVRON,
            'stroke': C.COLOR.WHITE,
            'stroke-opacity': 0,
            'stroke-width': 0
        });
        if ($.browser.msie) {
            ttt.node.onmousedown = function (event) {
                event.cancelBubble = true;
                event.returnValue = false;
                event.preventDefault();
            };
        }
    };
    Tp.showDownArrow = function (xy) {
        var d = this.device();
        if (d.isAway() || d.isSystemOff() || d.invalidTargetTemperature()) {
            return;
        }
        this.topActive = false;
        this.bottomActive = true;
        this.hideArrows();
        var b = this.brush,
            imr = d.isModeRange(),
            ac = C.ARROW_DOWN_CHAR,
            tor, ttt;
        if (imr) {
            var isLeft = (xy.x < (T.CANVAS_WIDTH / 2));
            tor = T.DOWN_ARROW_RANGE_ORIGIN.clone();
            tor.x += (T.CANVAS_WIDTH * T.ARROW_RANGE_OFFSET_MULTIPLE) * (isLeft ? -1 : 1);
            if (isLeft) {
                if (this.downArrowLeft) {
                    return this.downArrowLeft.show();
                }
                ttt = this.downArrowLeft = b.text(Math.floor(tor.x), Math.floor(tor.y), ac);
            } else {
                if (this.downArrowRight) {
                    return this.downArrowRight.show();
                }
                ttt = this.downArrowRight = b.text(Math.floor(tor.x), Math.floor(tor.y), ac);
            }
        } else {
            if (this.downArrow) {
                return this.downArrow.show();
            }
            tor = T.DOWN_ARROW_ORIGIN.clone();
            ttt = this.downArrow = b.text(Math.floor(tor.x), Math.floor(tor.y), ac);
        }
        ttt.attr({
            'fill': C.COLOR.WHITE,
            'fill-opacity': 0.5,
            'font-family': 'Nest Sans',
            'font-weight': 'bold',
            'font-size': T.FONT_CHEVRON,
            'stroke': C.COLOR.WHITE,
            'stroke-opacity': 0,
            'stroke-width': 0
        });
        if ($.browser.msie) {
            ttt.node.onmousedown = function (event) {
                event.cancelBubble = true;
                event.returnValue = false;
                event.preventDefault();
            };
        }
    };
    Tp.hideArrows = function () {
        this.hideNode(this.downArrow, this.downArrowLeft, this.downArrowRight, this.upArrow, this.upArrowLeft, this.upArrowRight);
    };
    Tp.removeNode = function () {
        for (var i = 0, n = arguments.length; i < n; i++) {
            var re = arguments[i];
            if (re) {
                re.remove();
            }
        }
    };
    Tp.hideNode = function () {
        for (var i = 0, n = arguments.length; i < n; i++) {
            var re = arguments[i];
            if (re) {
                re.hide();
            }
        }
    };
    Tp.showNode = function () {
        for (var i = 0, n = arguments.length; i < n; i++) {
            var re = arguments[i];
            if (re) {
                re.show();
            }
        }
    };
    Tp.animateGrowth = function () {
        var self = this,
            dfr = $.Deferred(),
            d = this.device(),
            vw = this.view(),
            vwe = $(vw.elem()),
            name = $('.name', vwe),
            smtmp = $('.temperature, .auto, .icon', vwe),
            w = $(window),
            str = $('.structures'),
            top = str.offset().top + 18,
            left = Math.round(vwe.offset().left - (T.CANVAS_WIDTH / 2)) + (vwe.width() / 2),
            min = 0.31,
            max = 1.0,
            selArr = $('#home .selection-arrow'),
            pointers = name.add(selArr),
            finish, move = function () {
                var sview = self.device().getStructure().view().elem(),
                    del = $('#' + d.id, sview),
                    nw = T.STAGE_WIDTH,
                    timing = 150,
                    eg = new A.EventGroup({
                        events: [
                            [self.canvas, {
                                left: 0,
                                bottom: 0
                            },
                            timing],
                            [self.canvas, {
                                scale: max
                            },
                            timing],
                            [vwe, {
                                width: T.CANVAS_WIDTH
                            },
                            timing],
                            [name, {
                                left: T.NAME_LEFT_ON
                            },
                            timing],
                            [smtmp, {
                                opacity: 0
                            },
                            0]
                        ]
                    });
                sview.add(del).addClass('thermozilla');
                eg.animate().then(finish);
                self.shrink = function () {
                    var dfr = $.Deferred();
                    window.clearTimeout(self.lockoutCountdown);
                    self.prepareToShrink();
                    A.animate(self.canvas, {
                        scale: T.CANVAS_SMALL_SCALE
                    }, timing).then(function () {
                        var eg = new A.EventGroup({
                            events: [
                                [self.canvas, {
                                    left: T.SMALL_OFFSET,
                                    bottom: T.SMALL_OFFSET
                                },
                                timing],
                                [vwe, {
                                    width: T.CANVAS_SMALL_WIDTH
                                },
                                timing],
                                [name, {
                                    left: T.NAME_LEFT_OFF
                                },
                                timing]
                            ]
                        });
                        eg.animate().then(function () {
                            sview.add(del).removeClass('thermozilla');
                            smtmp.css('opacity', 1);
                            self.canvas.remove();
                            dfr.resolve();
                        });
                    });
                    return dfr.promise();
                };
            };
        finish = function () {
            self.draw();
            dfr.resolve();
        };
        this.canvas.css({
            transform: 'scale(' + min + ')'
        }).css({
            visibility: 'visible'
        });
        move();
        return dfr.promise();
    };
    Tp.prepareToShrink = function () {
        $(this.canvas).unbind('mousewheel');
        this.removeNode(this.currentSwitchover, this.currentTempHash, this.currentTempValueBack, this.currentTempValue, this.currentTempValueFraction, this.targetTempHash, this.timeToTarget);
    };
    Tp.status = function (key, value) {
        if (!N.DEBUG) {
            return;
        }
        $('#thermozilla_status .' + key).html(String(value));
    };
})(window.jQuery, window._, window.Raphael);
(function ($, _, Backbone, undefined) {
    'use strict';
    var N = window.Nest,
        _L = N.Localization.namespace('Console'),
        M = N.Models,
        C = N.Console = N.Console || {}, D = C.Details = C.Details || {}, K = C.Control = C.Control || {}, Sn = C.Schnack = C.Schnack || {};
    D.TABS = {
        device: ['energy', 'schedule', 'settings', 'support'],
        structure: ['settings', 'support']
    };
    var P = C.DetailsPanel = function (args) {
        var n = this.name = args.name;
        if (!P.instances[n]) {
            P.instances[n] = this;
        }
        return this;
    };
    P.enterFade = 50;
    P.exitFade = 100;
    P.instances = {};
    var Pp = P.prototype;
    Pp.selectedView = null;
    Pp.init = function () {};
    Pp.enter = function (view, dfr) {
        var v = $('.values').first(),
            finish = _.once(function () {
                if (dfr) {
                    dfr.resolve();
                }
            });
        if (!D.isOpen) {
            finish();
        } else {
            v.css({
                opacity: 0
            });
            this.update(view, true);
            if (v.length) {
                v.animate({
                    opacity: 1
                }, P.enterFade, finish);
            } else {
                finish();
            }
        }
    };
    Pp.exit = function (view, dfr) {
        var v = $('.values').first(),
            finish = _.once(function () {
                v.empty().css({
                    opacity: 1
                }).show();
                if (dfr) {
                    dfr.resolve();
                }
            });
        if (v.length) {
            v.animate({
                opacity: 0
            }, P.exitFade, finish);
        } else {
            finish();
        }
    };
    Pp.update = function (view, forceUpdate) {
        this.selectedView = view;
    };
    Pp.viewChange = function (oldView, newView) {
        this.update(newView);
    };
    D.PREF_LAST_SELECTED_TAB = 'tabs';
    D.PREF_TAB_PANEL_OPEN = 'tabo';
    D.isInitialized = false;
    D.isOpen = false;
    D.previousView = null;
    D.selectedDetails = null;
    D.selectedTab = null;
    D.selectedView = null;
    D.isMoving = false;
    D.init = function (vid) {
        if (N.DEBUG) {
            _.each(D.TABS, function (v, k) {
                v.push('debug');
            });
        }
        $(window).bind('keypress', function (event) {
            if ((event.keyCode === 47) && event.ctrlKey && event.shiftKey) {
                document.location.search = 'debug';
            }
        });
        var view = C.getView(vid);
        _.each(P.instances, function (obj) {
            obj.init();
        });
        D.selectedDetails = D.getSelectedDetails(view);
        D.selectedView = view;
        D.isInitialized = true;
        D.enterDetailsPanel().then(D.refresh);
        D.bindEventListeners();
        D.init = function () {};
    };
    $(window).bind(C.Events.STAGE_NEW_STRUCTURE, function (event, view) {
        D.queueInit(view.id);
    });
    D.bindEventListeners = function () {
        $(window).bind(C.Events.STAGE_DESELECT_VIEW, D.clearTabs);
        $(window).bind(C.Events.STAGE_SELECT_VIEW, D.notifySelect);
        $(window).bind(C.Events.STAGE_UPDATE_VIEW, D.notifyUpdate);
        D.enableClickListener();
    };
    D.queueInit = _.once(function (viewID) {
        var vid = viewID;
        if (!K.windowLoaded) {
            return window.setTimeout(function () {
                D.queueInit(vid);
            }, 100);
        }
        D.init(vid);
    });
    D.refresh = function (forceUpdate) {
        D.updateTabs(true);
        D.updateDetailsPanel(forceUpdate);
    };
    D.notifySelect = function (event, view) {
        if (!D.selectedView || view.id === D.selectedView.id) {
            return D.viewChangeDetailsPanel();
        }
        D.previousView = D.selectedView;
        D.selectedView = view;
        var typeChange = (D.previousView.className !== D.selectedView.className);
        if (typeChange && D.isOpen) {
            D.notifyTabSelect(D.TABS[view.className][0], true, true);
        } else {
            D.drawTabs();
            D.viewChangeDetailsPanel();
        }
    };
    D.deepLinkSelect = function (nav, sub) {
        var dfr = $.Deferred();
        D.notifyTabSelect(nav).then(function () {
            var finish = dfr.resolve;
            if (sub) {
                D.getSelectedDetails().selectSubNav(sub).then(finish);
            } else {
                finish();
            }
        });
        return dfr.promise();
    };
    D.notifyTabSelect = function (key, forceUpdate, preserveOpenState) {
        var dfr = $.Deferred();
        if (C.newAccount()) {
            dfr.resolve();
            return dfr;
        }
        var isSameTab = (key === D.selectedTab);
        if (D.isOpen && isSameTab && !forceUpdate) {
            dfr.resolve();
            return dfr;
        }
        D.selectedTab = key;
        N.State.setBrowserPref(D.PREF_LAST_SELECTED_TAB, D.selectedTab, C.PREF_NAMESPACE);
        var tabsOpen = D.isOpen,
            proceed = function () {
                var present = function () {
                    D.drawTabs();
                    return D.enterDetailsPanel();
                };
                if (!isSameTab && tabsOpen) {
                    return D.exitDetailsPanel().then(present);
                } else {
                    return present();
                }
            };
        if (preserveOpenState) {
            return proceed();
        } else {
            return D.openTabs().then(proceed);
        }
    };
    D.notifyUpdate = function (event, view, forceUpdate) {
        if (!D.selectedView || (view.id !== D.selectedView.id)) {
            return;
        }
        D.selectedView = view;
        if (D.isOpen) {
            D.updateDetailsPanel(forceUpdate);
        }
    };
    D.openTabs = function (forceOpen) {
        if (D.isMoving) {
            N.wait(500).then(function () {
                D.openTabs();
            });
        }
        var dfr = $.Deferred();
        if (forceOpen || !D.isOpen) {
            D.isMoving = true;
            var h = $('#home'),
                v = $('.values', h),
                timing = 180,
                openHeight = 356,
                openYDiff = openHeight - 52;
            v.css({
                opacity: 0
            });
            var events = _.filter([
                [$('.details', h), {
                    height: openHeight
                },
                timing],
                [$('#houses_stage', h), {
                    bottom: '+=' + openYDiff
                },
                timing],
                [$('.weather-panel', h), {
                    bottom: '+=' + openYDiff
                },
                timing]
            ], function (anim) {
                return anim[0].length;
            }),
                callback = _.after(events.length - 1, function () {
                    D.isOpen = true;
                    D.isMoving = false;
                    D.updateTabs(true);
                    v.css({
                        bottom: 0,
                        opacity: 1
                    });
                    dfr.resolve();
                });
            N.wait(280).then(function () {
                _.each(events, function (v, k) {
                    v[0].animate(v[1], v[2], callback);
                });
            });
        } else {
            dfr.resolve();
        }
        N.State.setBrowserPref(D.PREF_TAB_PANEL_OPEN, true, C.PREF_NAMESPACE);
        return dfr.promise();
    };
    D.closeTabs = function () {
        if (D.isMoving) {
            N.wait(500).then(function () {
                D.closeTabs();
            });
        }
        var dfr = $.Deferred();
        if (D.isOpen) {
            D.isOpen = false;
            D.isMoving = true;
            D.exitDetailsPanel().then(function () {
                var h = $('#home'),
                    v = $('.values', h).css({
                        opacity: 0
                    }),
                    timing = 180,
                    openHeight = 356,
                    openYDiff = openHeight - 52;
                var events = _.filter([
                    [$('.details', h), {
                        height: 52
                    },
                    timing],
                    [$('#houses_stage', h), {
                        bottom: 15
                    },
                    timing],
                    [$('.weather-panel', h), {
                        bottom: '-=' + openYDiff
                    },
                    timing]
                ], function (anim) {
                    return anim[0].length;
                }),
                    callback = _.after(events.length - 1, function () {
                        D.isMoving = false;
                        D.updateTabs(true);
                        v.empty();
                        dfr.resolve();
                    });
                _.each(events, function (v, k) {
                    v[0].animate(v[1], v[2], callback);
                });
            });
        } else {
            dfr.resolve();
        }
        D.exitDetailsPanel();
        N.State.setBrowserPref(D.PREF_TAB_PANEL_OPEN, false, C.PREF_NAMESPACE);
        return dfr.promise();
    };
    D.exitDetailsPanel = function () {
        var dfr = $.Deferred(),
            sel = D.selectedDetails;
        if (sel) {
            sel.exit(D.selectedView, dfr);
        } else {
            dfr.resolve();
        }
        return dfr.promise();
    };
    D.getSelectedDetails = function (view, key) {
        var sv = D.selectedView;
        view = view || C.getView(sv && sv.id);
        if (!view) {
            return;
        }
        if (!key) {
            key = D.selectedTab;
        }
        return P.instances[key];
    };
    D.updateTabs = function (instant) {
        D.clearTabs(instant).then(D.drawTabs);
    };
    D.clearTabs = function (instant) {
        var dfr = $.Deferred(),
            tabs = $('.tabs'),
            elems = $('.tab, .away-mode-toggle', tabs),
            soc = this.soc,
            clear = _.once(function () {
                $('.tab', tabs).remove();
                D.clearAwayModeToggle();
                if (soc) {
                    soc.remove();
                }
                dfr.resolve();
            });
        if (instant) {
            clear();
        } else {
            elems.animate({
                opacity: 0
            }, 400, clear);
        }
        return dfr.promise();
    };
    D.drawTabs = function (selectedTab) {
        var view = D.selectedView;
        if (!view || C.newAccount()) {
            return;
        }
        var tabs = $('.tabs').empty();
        _.each(D.TABS[view.className], function (key, i) {
            var tab = $('<div class="tab ' + key + '">' + _L(key) + '</div>').appendTo(tabs).bind('click', function () {
                tab.unbind('click');
                D.notifyTabSelect(key);
            });
        });
        if (D.isOpen) {
            $('.tab.' + D.selectedTab, tabs).addClass('selected');
        }
        if (view.className === 'structure') {
            D.drawAwayModeToggle(view);
        } else if (view.className === 'device') {
            this.soc = D.drawSwitchOverControl(view);
        }
    };
    D.SwitchOverMenu = Backbone.View.extend({
        template: _.template($('#_TMPL #switch_over_chooser').html()),
        className: "switch-over-control",
        initialize: function () {
            var m = this.getModel(),
                e = this.events = [N.CZ.subscribeDoneEvent, C.Events.USER_RETURN, C.Events.STAGE_UPDATE_VIEW].join(' ');
            this.showing = false;
            $(window).bind(e, $.proxy(this, 'renderThrottled'));
            m.bind('change', $.proxy(this, 'render'));
            this.render();
        },
        events: {
            "click .switch-over-icon": "iconClick",
            "click .menu-item": "itemClick"
        },
        getModel: function () {
            return M.Cache.get(this.model.id) || this.model;
        },
        hideMenu: function () {
            this.showing = false;
            D.enableClickListener();
            $('.switch-over-menu', this.el).fadeOut(150);
            $('body').unbind('click', this.hideMenu);
        },
        iconClick: function (e) {
            e.stopPropagation();
            if (this.showing) {
                this.hideMenu();
            } else {
                this.showMenu();
            }
        },
        itemClick: function (e) {
            var m = this.getModel(),
                t = $(e.currentTarget);
            this.hideMenu();
            e.stopPropagation();
            if (t.hasClass('heat-mode')) {
                m.setHVACMode('heat');
            } else if (t.hasClass('cool-mode')) {
                m.setHVACMode('cool');
            } else if (t.hasClass('range-mode')) {
                m.setHVACMode('range');
            } else if (t.hasClass('off-mode')) {
                m.setHVACMode('off');
            }
            this.render();
        },
        remove: function () {
            if (this.renderThrottled) {
                $(window).unbind(this.events, this.renderThrottled);
            }
            if (this.render) {
                this.getModel().unbind('change', this.render);
            }
            $(this.el).remove();
        },
        render: function () {
            if (this.showing) {
                return this;
            }
            var m = this.getModel(),
                el = this.el;
            $(el).html(this.template());
            if (!m.isRangeEnabled()) {
                $('.range-mode', el).remove();
            }
            if (m.isModeCool()) {
                $('.cool-mode', el).addClass('on');
                $('.switch-over-icon .heat-dot', el).addClass('off');
            } else if (m.isModeHeat()) {
                $('.heat-mode', el).addClass('on');
                $('.switch-over-icon .cool-dot', el).addClass('off');
            } else if (m.isRangeEnabled() && m.isModeRange()) {
                $('.range-mode', el).addClass('on');
            } else {
                $('.off-mode', el).addClass('on');
                $('.switch-over-icon .heat-dot', el).addClass('off');
                $('.switch-over-icon .cool-dot', el).addClass('off');
            }
            return this;
        },
        renderThrottled: _.throttle(function () {
            this.render();
        }, 250),
        showMenu: function () {
            this.showing = true;
            $('.switch-over-menu', this.el).fadeIn(150);
            D.disableClickListener();
            $('body').unbind('click', this.hideMenu).bind('click', $.proxy(this, 'hideMenu'));
        }
    });
    D.SwitchOverToggle = Backbone.View.extend({
        template: _.template($('#_TMPL #switch_over_toggle').html()),
        className: "switch-over-control",
        initialize: function () {
            var m = this.getModel(),
                e = this.events = [N.CZ.subscribeDoneEvent, C.Events.USER_RETURN].join(' ');
            $(window).bind(e, $.proxy(this, 'refresh'));
            m.bind(e, $.proxy(this, 'refresh'));
            this.render();
        },
        getModel: function () {
            return M.Cache.get(this.model.id) || this.model;
        },
        refresh: function () {
            var e = this.events,
                m = this.getModel(),
                el = this.el,
                on = (m.hasAC() && m.isModeCool()) || (m.hasHeat() && m.isModeHeat()),
                t = $('.check-toggle', this.el);
            if (t.prop('checked') !== on) {
                t.prop('checked', on).toggleStyle('refresh');
            }
        },
        render: function () {
            var m = this.getModel(),
                el = this.el;
            $(el).html(this.template());
            return this;
        },
        remove: function () {
            if (this.refresh) {
                $(window).unbind(this.events, this.refresh);
                this.getModel().unbind('change', this.refresh);
            }
            $(this.el).remove();
        },
        toggleClick: function (elem, isChecked) {
            var m = this.getModel();
            if (isChecked) {
                if (m.hasAC()) {
                    m.setHVACMode('cool');
                } else {
                    m.setHVACMode('heat');
                }
            } else {
                m.setHVACMode('off');
            }
        },
        update: function () {
            var m = this.getModel(),
                el = this.el,
                on = (m.hasAC() && m.isModeCool()) || (m.hasHeat() && m.isModeHeat());
            $('.check-toggle', el).attr('checked', on).toggleStyle({
                onChange: this.toggleClick.bind(this)
            });
        }
    });
    D.drawSwitchOverControl = function (view) {
        var soc, m = view.model;
        if (m.hasHeat() && m.hasAC()) {
            soc = new D.SwitchOverMenu({
                model: m
            });
            $('.tabs').append(soc.el);
        } else {
            soc = new D.SwitchOverToggle({
                model: m
            });
            $('.tabs').append(soc.el);
            soc.update();
        }
        return soc;
    };
    D.drawAwayModeToggle = function (view) {
        var tabs = $('.tabs'),
            amt = C.Toggle({
                className: 'away-mode-toggle',
                labels: ['home', 'away'],
                listener: function (event, state) {
                    N.log('Details.awayModeToggle:', state);
                },
                target: '.tabs',
                toggled: view.isAway()
            }),
            listener = D.drawAwayModeToggle.listener = function (event, vw) {
                if (vw.id === view.id) {
                    amt.toggleState(view.isAway());
                }
            };
        amt.onToggle(function () {
            var devices = view.getModel().devices.models,
                olDevices = _.select(devices, function (d) {
                    return !d.isOnline();
                });
            if (olDevices.length > 0) {
                Sn.showToggleDevicesOfflineWarning(olDevices, view.isAway());
            }
            return !view.toggleAwayMode();
        });
        $(window).bind(C.Events.STAGE_UPDATE_VIEW, listener);
    };
    D.clearAwayModeToggle = function () {
        $('.tabs .away-mode-toggle').remove();
        if (D.drawAwayModeToggle.listener) {
            $(window).unbind(C.Events.STAGE_UPDATE_VIEW, D.drawAwayModeToggle.listener);
        }
    };
    D.enterDetailsPanel = function () {
        var dfr = $.Deferred(),
            sel = D.selectedDetails = D.getSelectedDetails();
        if (D.isOpen) {
            sel.enter(D.selectedView, dfr);
        } else {
            dfr.resolve();
            return dfr.promise();
        }
        return dfr.promise();
    };
    D.updateDetailsPanel = function (forceUpdate) {
        if (!D.selectedView) {
            return;
        }
        if (!$('.tabs').children().length) {
            D.updateTabs(true);
        }
        var sel = D.selectedDetails = D.getSelectedDetails();
        if (sel) {
            sel.update(D.selectedView, forceUpdate);
        }
    };
    D.viewChangeDetailsPanel = function () {
        var sel = D.selectedDetails = D.getSelectedDetails();
        if (!sel || !D.isOpen) {
            return;
        }
        sel.viewChange(D.previousView, D.selectedView);
    };
    D.isOffline = function (dfr) {
        var v = $('.values').first(),
            doc = '.device-offline';
        if ($(doc, v).length) {
            return;
        }
        var off = $('#device_offline_template'),
            dlh = document.location.hostname,
            ut = new Date(D.selectedView.getModel().attributes.last_connection),
            html = _.template(off.html(), {
                nest_domain: dlh.substr(dlh.indexOf('.') + 1),
                time_offline: Date.Nest.timeFromNow(ut, false, true, 'floor')
            }),
            finish = _.once(function () {
                if (dfr) {
                    dfr.resolve();
                }
            });
        v.html(html);
        if (((new Date()) - ut) < 3600000) {
            $('.device-offline .over-an-hour', v).hide();
            $('.device-offline .under-an-hour', v).show();
        }
        var dov = $(doc, v).show();
        if (dov.length) {
            dov.animate({
                opacity: 1
            }, 200, finish);
        } else {
            finish();
        }
    };
    var ch = function (event) {
        var targ = $(event.target),
            actors = ['details', 'device', 'disabler', 'house', 'popup-menu', 'schnack-bubble', 'tab', 'account-tray'],
            cdts = targ.parents().andSelf();
        event.stopPropagation();
        if (_.detect(actors, function (cls) {
            return cdts.hasClass(cls);
        })) {
            return;
        }
        D.exitDetailsPanel().then(D.closeTabs);
    };
    D.enableClickListener = function () {
        $(document.body).bind('click', ch);
    };
    D.disableClickListener = function () {
        $(document.body).unbind('click', ch);
    };
})(window.jQuery, window._, window.Backbone);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        L = N.Localization.namespace('Console'),
        C = N.Console = N.Console || {}, D = C.Details = C.Details || {}, K = C.Control = C.Control || {}, W = C.Weather = C.Weather || {};
    W.DAYTIME_OVERRIDE = '';
    W.WEATHER_OVERRIDE = '';
    W.animationInterval = null;
    W.cache = {};
    W.CONDITIONS_MAP = {
        clear: ['default', 'unknown', 'clear', 'sunny'],
        cloudy: ['chanceflurries', 'chancerain', 'chancesleet', 'chancesnow', 'chancetstorms', 'cloudy', 'fog', 'hazy'],
        partlycloudy: ['mostlycloudy', 'mostlysunny', 'partlycloudy', 'partlysunny'],
        rain: ['rain', 'sleet', 'tstorms'],
        snow: ['flurries', 'snow']
    };
    W.CONDITIONS = _.extend.apply({}, _.map(W.CONDITIONS_MAP, function (a, k) {
        return _.reduce(a, function (r, c) {
            r[c] = k;
            return r;
        }, {});
    }));
    W.init = function () {
        $(window).bind(N.CZ.objectRemoveEvent, function (event, data) {
            if (data.type === 'structure') {
                W.clearCache();
            }
        });
    };
    $(W.init);
    W.getForecastForStructure = function (location, callback) {
        if (!location) {
            return;
        }
        var now = new Date(),
            cache = W.cache,
            lastUpdate = cache[location] && cache[location].time;
        if (lastUpdate && ((now - lastUpdate) < C.WEATHER_POLLING_INTERVAL)) {
            callback(cache[location].weather);
        } else {
            cache[location] = {};
            cache[location].time = now;
            var url = C.API_PREFIX + '/weather/forecast/' + location;
            $.post(url, function (response) {
                cache[location].weather = response;
                callback(response);
            });
        }
    };
    W.renderHouse = function (struct, conditions) {
        var el = $('.house', struct.elem()),
            cn = W.WEATHER_OVERRIDE || conditions || 'default',
            wt = W.CONDITIONS[cn] || 'default';
        el.removeClass(_.keys(W.CONDITIONS_MAP).join(' ')).addClass(wt);
    };
    W.renderWeather = function (sview) {
        if (D.isMoving) {
            return N.wait(750).then(function () {
                W.renderWeather(sview);
            });
        }
        var cview = C.getSelectedView();
        sview = sview || cview || {};
        if (!cview || (sview.id !== cview.getStructureID())) {
            return;
        }
        var sid = sview.id,
            w = sview.weather || {}, dn = Date.Nest.isNight(w.sunrise, w.sunset),
            dt = W.DAYTIME_OVERRIDE || (dn ? 'night' : 'day'),
            cn = W.WEATHER_OVERRIDE || w.icon || 'default',
            wt = W.CONDITIONS[cn] || 'default',
            wb = $('.weather .' + dt),
            wi = $('.' + wt, wb).children().clone(),
            home = $('#home'),
            oldw = $('.weather-panel', home),
            oldb = oldw.css('bottom'),
            doTransition = true,
            statusPause = 325;
        if (!wi.length) {
            wi = $('.default', wb).children().clone();
        }
        for (var i = 0, n = oldw.length; i < n; i++) {
            if (!wi[0] || oldw[i].className === wi[0].className) {
                doTransition = false;
                statusPause = 25;
                break;
            }
        }
        if (doTransition) {
            var func = N.CSS_TRANSITIONS ? 'css' : 'animate';
            oldw[func]({
                opacity: 0
            }, 450);
            N.wait(475).then(function () {
                oldw.remove();
            });
            $('#home')[(dt === 'night') ? 'addClass' : 'removeClass']('night');
            $('#home')[(wt === 'rain') ? 'addClass' : 'removeClass']('rain');
            $('#home')[(wt === 'snow') ? 'addClass' : 'removeClass']('snow');
            wi.css({
                bottom: oldb
            });
            _.each(wi, function (n) {
                var el = $(n);
                if (el.hasClass('bg-semi')) {
                    el.prependTo(home)[func]({
                        opacity: 0.65
                    }, 450);
                } else if (el.hasClass('bg-light')) {
                    el.prependTo(home)[func]({
                        opacity: 0.35
                    }, 450);
                } else {
                    el.prependTo(home)[func]({
                        opacity: 1
                    }, 450);
                }
                N.wait(250).then(function () {
                    el.css('background-image', '').css('background-image', el.css('background-image'));
                });
            });
            N.wait(250).then(function () {
                $('.house', home).each(function (i, h) {
                    $(h).css('background-image', '').css('background-image', $(h).css('background-image'));
                });
            });
            $(window).trigger(C.Events.WEATHER_RENDER);
        }
        window.setTimeout(function () {
            var st = $('header .status').first(),
                vw = C.getView(sid),
                str = vw.getStructureView().getModel(),
                ctry = str.getField('country_code'),
                devs = str.devices,
                devsF = devs.filter(function (d) {
                    return d.getTempScale() === 'F';
                }),
                isUS = ctry === 'US' || ctry === null,
                scale = (isUS && (devs.length === 0 || devsF.length > 0)) || (!isUS && devs.length > 0 && devsF.length === devs.length) ? 'F' : 'C',
                vww = vw.weather || {}, t = vww.current_temperature,
                dc = str.getField('display_location') || vww.display_city,
                temp = N.displayTemperature(t, scale),
                tempEl = $('.temperature', st);
            if (scale === 'C') {
                temp = Math.round(temp);
            }
            if (!isNaN(temp) && K.windowLoaded) {
                tempEl.html(temp);
                if (N.DEBUG) {
                    tempEl.prop('title', JSON.stringify(vww));
                }
                tempEl.add('header .degree').css({
                    display: 'inline',
                    opacity: 1
                });
            }
            W.displayLocation(dc);
            vw.render();
            st.animate({
                opacity: +!C.newAccount()
            }, 1000);
        }, statusPause);
    };
    W.displayLocation = function (location) {
        if (!location) {
            return;
        }
        var loc = _.last(location.split('\n'));
        if (loc.indexOf(',') !== loc.lastIndexOf(',')) {
            var parts = loc.split(','),
                len = parts.length;
            loc = parts.slice(len - 2, len).join(',');
        }
        $('header .status .location').first().html($.trim(loc));
    };
    W.clearCache = function () {
        W.cache = {};
    };
    W.enablePolling = function (id, callback) {
        if (!id) {
            return N.warn('Weather.enablePolling: invoked with no id specified.');
        }
        var pc = W.enablePolling.intervalIDs = W.enablePolling.intervalIDs || {}, wint = C.WEATHER_POLLING_INTERVAL;
        if (!pc[id]) {
            pc[id] = window.setInterval(callback, wint);
            N.log('Weather.enablePolling: established for', id);
        }
    };
    W.disablePolling = function (id) {
        var pc = W.enablePolling.intervalIDs;
        if (!pc) {
            return;
        }
        if (pc[id]) {
            window.clearInterval(pc[id]);
            delete pc[id];
            N.log('Weather.disablePolling: discontinued for', id);
        }
    };
})(window.jQuery, window._);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        A = N.Animate,
        GA = N.GoogleAnalytics,
        _L = N.Localization.namespace('Console'),
        C = N.Console = N.Console || {}, M = N.Models = N.Models || {}, D = C.Details = C.Details || {}, P = C.DetailsPanel = C.DetailsPanel || {}, Pp = P.prototype,
        S = C.Settings = {}, Sn = C.Schnack = C.Schnack || {}, W = C.Weather = C.Weather || {};
    S.FIELDSETS = {
        structure: [{
            key: "location",
            name: _L("Location")
        }, {
            key: "devices",
            name: _L("Manage Thermostats")
        }],
        device: [{
            key: "glance",
            name: _L("At a Glance")
        }, {
            key: "learning",
            name: _L("learning")
        }, {
            key: "away",
            name: _L("away")
        }, {
            key: "equipment",
            name: _L("Equipment")
        }, {
            key: "techinfo",
            name: _L("Technical Info")
        }, {
            key: "lock",
            name: _L("Thermostat Lock")
        }, {
            key: "reset",
            name: _L("Reset")
        }]
    };
    S.buildSideNav = function (section) {
        var navt = _.reduce(S.FIELDSETS[section], function (str, item) {
            return str + '<li class="' + item.key + '">' + item.name + '</li>';
        }, ''),
            tmpl = _.template('<header><h4 class="name icon-[[ section ]]">[[ name ]]</h4><nav><ul>' + navt + '</ul></nav></header>'),
            selName = C.getSelectedView().getDisplayName();
        return tmpl({
            name: selName,
            section: section
        });
    };
    var spi = S.DetailsPanel = new P({
        name: 'settings'
    });
    spi.render = function (index) {
        var dfr = $.Deferred(),
            self = this,
            view = C.getSelectedView(),
            v = $('.details .values'),
            section = view.className,
            onIndex = index || 0,
            subsection = S.FIELDSETS[section][onIndex],
            sideNavHTML = S.buildSideNav(section),
            formHTML = $('#_TMPL #' + section + "_" + subsection.key + "_settings").html();
        this.isDragging = false;
        GA.trackEvent('Console', 'view' + String.Nest.ucFirst(view.className) + 'Settings' + String.Nest.ucFirst(subsection.key));
        v.addClass('settings').html(sideNavHTML + formHTML).find('header li').each(function (i) {
            if (i === onIndex) {
                $(this).addClass('on');
            } else {
                $(this).click(function (e) {
                    e.stopPropagation();
                    self.render(i);
                });
            }
        });
        spi.update(view, true);
        dfr.resolve();
        $('.heat-down, .heat-up, .cool-down, .cool-up', v).hide().outerWidth();
        $('.heat-down, .heat-up, .cool-down, .cool-up', v).css('display', '');
        return dfr;
    };
    spi.selectSubNav = function (sub) {
        var subnav = S.FIELDSETS[C.getSelectedView().className],
            keys = _.map(subnav, function (o) {
                return o['key'];
            });
        return this.render(_.indexOf(keys, sub));
    };
    spi.setSliders = function (v, view) {
        var m = view.getModel(),
            scale = m.getTempScale(),
            updateAwayTemp = function () {
                var m = view.getModel(),
                    scale = m.getTempScale();
                var ash = m.hasAC() && m.getField('upper_safety_temp_enabled') && (!m.getField('away_temperature_high_enabled') || N.displayTemperature(m.getField('away_temperature_high'), scale) > N.displayTemperature(m.getField('upper_safety_temp'), scale)),
                    asl = m.hasHeat() && m.getField('lower_safety_temp_enabled') && (!m.getField('away_temperature_low_enabled') || N.displayTemperature(m.getField('away_temperature_low'), scale) < N.displayTemperature(m.getField('lower_safety_temp'), scale));
                if (ash || asl) {
                    $('.away-temps .safety-temps', v).css('opacity', 1);
                    $('.away-temps .safety-temps p', v).hide();
                    if (ash && asl) {
                        $('.away-temps .safety-temps p.both', v).show();
                    } else if (ash) {
                        $('.away-temps .safety-temps p.high', v).show();
                    } else if (asl) {
                        $('.away-temps .safety-temps p.low', v).show();
                    }
                } else {
                    $('.away-temps .safety-temps', v).css('opacity', 0);
                }
            }, awayMM = m.getAwayMinMax(),
            awayDefaults = m.getAwayDefaults(),
            awayLeafBounds = m.getAwayLeafBounds(),
            awayLeafHigh = (scale.toUpperCase() === 'F') ? Math.Nest.CToF(awayLeafBounds.high) : awayLeafBounds.high,
            awayLeafLow = (scale.toUpperCase() === 'F') ? Math.Nest.CToF(awayLeafBounds.low) : awayLeafBounds.low,
            hpaMM = m.getHeatPumpAuxMinMax(),
            safetyMM = m.getSafetyMinMax(),
            safetyDefaults = m.getSafetyTempDefaults();
        updateAwayTemp();
        if (!spi.isDragging) {
            if ($('.away-temps-slider', v).is(":visible")) {
                if (spi.awayT) {
                    spi.awayT.setScale(scale);
                    if (m.hasHeat()) {
                        spi.awayT.setLow(N.displayTemperature(view.getField('away_temperature_low'), scale));
                        if (m.hasCapabilityLevel(1.1)) {
                            spi.awayT.setLowEnabled(view.getField('away_temperature_low_enabled'));
                        }
                    }
                    if (m.hasAC()) {
                        spi.awayT.setHigh(N.displayTemperature(view.getField('away_temperature_high'), scale));
                        if (m.hasCapabilityLevel(1.1)) {
                            spi.awayT.setHighEnabled(view.getField('away_temperature_high_enabled'));
                        }
                    }
                } else {
                    spi.awayT = new spi.TemperatureSlider({
                        container: $('.away-temps-slider', v),
                        low: m.hasHeat() ? N.displayTemperature(view.getField('away_temperature_low'), scale) : null,
                        high: m.hasAC() ? N.displayTemperature(view.getField('away_temperature_high'), scale) : null,
                        scale: scale,
                        leafHigh: awayLeafHigh,
                        leafLow: awayLeafLow,
                        lowDefault: m.hasHeat() ? N.displayTemperature((awayDefaults.low), scale) : null,
                        highDefault: m.hasAC() ? N.displayTemperature(awayDefaults.high, scale) : null,
                        minRange: m.getMinAwaySpread(),
                        min: m.hasHeat() ? N.displayTemperature(awayMM.lowMin, scale) : N.displayTemperature(awayMM.highMin, scale),
                        max: m.hasAC() ? N.displayTemperature(awayMM.highMax, scale) : N.displayTemperature(awayMM.lowMax, scale),
                        lowMax: N.displayTemperature(awayMM.lowMax, scale),
                        highMin: N.displayTemperature(awayMM.highMin, scale),
                        lowHandler: m.hasHeat() ? function (t) {
                            view.setField('away_temperature_low', m.toDataTemperature(t));
                            updateAwayTemp();
                        } : null,
                        highHandler: m.hasAC() ? function (t) {
                            view.setField('away_temperature_high', m.toDataTemperature(t));
                            updateAwayTemp();
                        } : null,
                        lowOffLabel: m.hasCapabilityLevel(1.1) && m.hasHeat() ? String.Nest.ucFirst(_L('off')) : null,
                        highOffLabel: m.hasCapabilityLevel(1.1) && m.hasAC() ? String.Nest.ucFirst(_L('off')) : null,
                        isLowEnabled: m.hasCapabilityLevel(1.1) ? view.getField('away_temperature_low_enabled') : null,
                        isHighEnabled: m.hasCapabilityLevel(1.1) ? view.getField('away_temperature_high_enabled') : null,
                        lowEnabledHandler: m.hasCapabilityLevel(1.1) ? function (o, t) {
                            view.getModel().setDataTemperatureEnabled('away_temperature_low_enabled', o, m.toDataTemperature(t));
                            updateAwayTemp();
                        } : null,
                        highEnabledHandler: m.hasCapabilityLevel(1.1) ? function (o, t) {
                            view.getModel().setDataTemperatureEnabled('away_temperature_high_enabled', o, m.toDataTemperature(t));
                            updateAwayTemp();
                        } : null
                    });
                }
            } else if (spi.awayT) {
                delete spi.awayT;
            }
            if ($('.heat-pump-max-temp .slider-area', v).is(":visible")) {
                if (spi.hpaT) {
                    spi.hpaT.setScale(scale);
                    spi.hpaT.setLow(N.displayTemperature(view.getField('heat_pump_aux_threshold'), scale));
                    spi.hpaT.setLowEnabled(view.getField('heat_pump_aux_threshold_enabled'));
                } else {
                    spi.hpaT = new spi.TemperatureSlider({
                        container: $('.heat-pump-max-temp .slider-area', v),
                        low: N.displayTemperature(view.getField('heat_pump_aux_threshold'), scale),
                        scale: scale,
                        min: N.displayTemperature(hpaMM.min, scale),
                        max: N.displayTemperature(hpaMM.max, scale),
                        lowHandler: function (t) {
                            view.setField('heat_pump_aux_threshold', m.toDataTemperature(t));
                        },
                        lowDefault: N.displayTemperature(m.getHeatPumpAuxDefault(), scale),
                        lowOffLabel: _L('None'),
                        lowOffSide: 'max',
                        highDefault: N.displayTemperature(hpaMM.max, scale),
                        highDefaultLabel: _L('No Lockout'),
                        isLowEnabled: view.getField('heat_pump_aux_threshold_enabled'),
                        lowEnabledHandler: function (o, t) {
                            view.getModel().setDataTemperatureEnabled('heat_pump_aux_threshold_enabled', o, m.toDataTemperature(t));
                        }
                    });
                }
            } else if (spi.hpaT) {
                delete spi.hpaT;
            }
            if ($('.safety-temps .slider-area', v).is(":visible")) {
                if (spi.safetyT) {
                    spi.safetyT.setScale(scale);
                    if (m.hasHeat()) {
                        spi.safetyT.setLow(N.displayTemperature(view.getField('lower_safety_temp'), scale));
                        if (m.hasCapabilityLevel(1.1)) {
                            spi.safetyT.setLowEnabled(view.getField('lower_safety_temp_enabled'));
                        }
                    }
                    if (m.hasAC()) {
                        spi.safetyT.setHigh(N.displayTemperature(view.getField('upper_safety_temp'), scale));
                        if (m.hasCapabilityLevel(1.1)) {
                            spi.safetyT.setHighEnabled(view.getField('upper_safety_temp_enabled'));
                        }
                    }
                } else {
                    spi.safetyT = new spi.TemperatureSlider({
                        container: $('.safety-temps .slider-area', v),
                        low: m.hasHeat() ? N.displayTemperature(view.getField('lower_safety_temp'), scale) : null,
                        high: m.hasAC() ? N.displayTemperature(view.getField('upper_safety_temp'), scale) : null,
                        scale: scale,
                        lowDefault: m.hasHeat() ? N.displayTemperature((safetyDefaults.low), scale) : null,
                        highDefault: m.hasAC() ? N.displayTemperature(safetyDefaults.high, scale) : null,
                        min: m.hasHeat() ? N.displayTemperature(safetyMM.lowMin, scale) : N.displayTemperature(safetyMM.highMin, scale),
                        max: m.hasAC() ? N.displayTemperature(safetyMM.highMax, scale) : N.displayTemperature(safetyMM.lowMax, scale),
                        lowMax: N.displayTemperature(safetyMM.lowMax, scale),
                        highMin: N.displayTemperature(safetyMM.highMin, scale),
                        highHandler: m.hasAC() ? function (t) {
                            view.setField('upper_safety_temp', m.toDataTemperature(t));
                        } : null,
                        lowHandler: m.hasHeat() ? function (t) {
                            view.setField('lower_safety_temp', m.toDataTemperature(t));
                        } : null,
                        lowOffLabel: m.hasCapabilityLevel(1.1) && m.hasHeat() ? String.Nest.ucFirst(_L('off')) : null,
                        highOffLabel: m.hasCapabilityLevel(1.1) && m.hasAC() ? String.Nest.ucFirst(_L('off')) : null,
                        isLowEnabled: m.hasCapabilityLevel(1.1) ? view.getField('lower_safety_temp_enabled') : null,
                        isHighEnabled: m.hasCapabilityLevel(1.1) ? view.getField('upper_safety_temp_enabled') : null,
                        lowEnabledHandler: m.hasCapabilityLevel(1.1) ? function (o, t) {
                            view.getModel().setDataTemperatureEnabled('lower_safety_temp_enabled', o, m.toDataTemperature(t));
                        } : null,
                        highEnabledHandler: m.hasCapabilityLevel(1.1) ? function (o, t) {
                            view.getModel().setDataTemperatureEnabled('upper_safety_temp_enabled', o, m.toDataTemperature(t));
                        } : null
                    });
                }
            } else if (spi.safetyT) {
                delete spi.safetyT;
            }
        }
    };
    spi.enter = function (view, dfr) {
        GA.trackEvent('Console', 'view' + String.Nest.ucFirst(view.className) + 'Settings');
        var self = this;
        this.render();
    };
    spi.exit = function (view, dfr) {
        var v = $('.values');
        v.animate({
            opacity: 0
        }, P.exitFade, function () {
            v.empty().removeClass('settings structure-settings device-settings').css({
                opacity: 1
            }).show();
            if (dfr) {
                dfr.resolve();
            }
        });
    };
    spi.update = function (view, forceUpdate) {
        var selView = C.getSelectedView();
        if (!forceUpdate && selView && (view.id !== selView.id)) {
            return;
        }
        view = C.getView(view.id);
        if (forceUpdate && $('.values .device-offline').length) {
            return this.enter(selView);
        }
        var v = $('.values'),
            m = view.getModel(),
            fields = {
                device: ['auto-away-enable', 'auto-away-learning', 'away-temperature-high', 'away-temperature-high-enabled', 'away-temperature-low', 'away-temperature-low-enabled', 'battery-level', 'current-humidity', 'current-temperature', 'current-version', 'equipment-type', 'fan-cooling-readiness', 'fan-mode', 'forced-air', 'heat-pump-aux-threshold', 'heat-pump-comp-threshold', 'last-connection', 'last-ip', 'leaf-learning', 'learning-mode', 'learning-state', 'lower-safety-temp', 'mac-address', 'model-version', 'name', 'ob-orientation', 'range-enable', 'serial-number', 'target-temperature', 'temperature-lock', 'temperature-scale', 'time-to-target-training', 'upper-safety-temp', 'wiring'],
                structure: ['away', 'country-code', 'location', 'name', 'postal-code', 'street-address', 'thermostats']
            }, displayTemp = function (s, m) {
                return N.splitTemperature(N.displayTemperature(s, m.getTempScale()));
            }, setEnergyHistory = function (m) {
                var t, d = m.getEnergyDays();
                if (d === 0) {
                    t = _L('Collecting info');
                } else if (d === 1) {
                    t = d + ' ' + _L('day available');
                } else {
                    t = d + ' ' + _L('days available');
                }
                $('.control .energy-history', v).html(t);
            }, toggleFormat = function (c, s, m) {
                var el = $('input.' + c, v),
                    trueVal = el.attr("data-checked");
                if (trueVal === undefined) {
                    return false;
                }
                trueVal = trueVal.replace(/^\u00B0/, '');
                return ((trueVal.toLowerCase() === s.toLowerCase()) || (s.toLowerCase() === 'true') || (s === true));
            }, formatters = {
                device: {
                    'auto-away-enable': function (s, m) {
                        return toggleFormat('auto-away-enable', s, m);
                    },
                    'auto-away-learning': function (s, m) {
                        return String.Nest.ucFirst(_L((s && s.toLowerCase()) || 'ready'));
                    },
                    'away-temperature-high': function (s, m) {
                        if (spi.awayT) {
                            spi.awayT.setHigh(N.displayTemperature(s, m.getTempScale()));
                        }
                    },
                    'away-temperature-high-enabled': function (s, m) {
                        if (spi.awayT) {
                            spi.awayT.setHighEnabled(s.toLowerCase() === 'true');
                        }
                    },
                    'away-temperature-low': function (s, m) {
                        if (spi.awayT) {
                            spi.awayT.setLow(N.displayTemperature(s, m.getTempScale()));
                        }
                    },
                    'away-temperature-low-enabled': function (s, m) {
                        if (spi.awayT) {
                            spi.awayT.setLowEnabled(s.toLowerCase() === 'true');
                        }
                    },
                    'battery-level': function (s) {
                        return s + ' ' + _L('volts');
                    },
                    'current-humidity': function (s, m) {
                        return m.isOnline() || !C.DEAD_DEVICE_THRESHOLD ? s + '%' : '?';
                    },
                    'current-temperature': function (s, m) {
                        return m.isOnline() || !C.DEAD_DEVICE_THRESHOLD ? displayTemp(s, m) : '?';
                    },
                    'equipment-type': function (s, m) {
                        return (s.toLowerCase() === 'gas') ? _L('gas/oil') : _L('electric');
                    },
                    'fan-cooling-readiness': function (s, m) {
                        return String.Nest.ucFirst(_L((s && s.toLowerCase()) || 'ready'));
                    },
                    'fan-mode': function (s, m) {
                        return $('.field.fan-mode', v).toggle(m.hasFan()) && toggleFormat('fan-mode', s, m);
                    },
                    'forced-air': function (s, m) {
                        return (s.toLowerCase() === 'true') ? _L('Yes') : _L('No');
                    },
                    'heat-pump-aux-threshold': function (s, m) {
                        var isOn = m.getField('heat_pump_aux_threshold_enabled');
                        $('.heat-pump-max-temp .aux-enabled', v).toggle(isOn);
                        $('.heat-pump-max-temp .aux-disabled', v).toggle(!isOn);
                        $('td > .heat-pump-aux-threshold', v).toggleClass('heat-up', isOn).width();
                        return isOn ? N.displayTemperature(s, m.getTempScale()) : _L('None');
                    },
                    'heat-pump-comp-threshold': function (s, m) {
                        var isOn = m.getField('heat_pump_comp_threshold_enabled');
                        $('.heat-pump-min-temp .comp-enabled', v).toggle(isOn);
                        $('.heat-pump-min-temp .comp-disabled', v).toggle(!isOn);
                        $('td > .heat-pump-comp-threshold', v).toggleClass('heat-down', isOn).width();
                        return isOn ? N.displayTemperature(s, m.getTempScale()) : _L('None');
                    },
                    'last-connection': function (s) {
                        return Date.Nest.timeFromNow(+s, true, false, 'floor');
                    },
                    'leaf-learning': function (s) {
                        return String.Nest.ucFirst(_L((s && s.toLowerCase()) || 'ready'));
                    },
                    'learning-mode': function (s) {
                        return toggleFormat('learning-mode', s, m);
                    },
                    'learning-state': function (s) {
                        var mode = m.getField('learning_mode');
                        if (((typeof mode === 'boolean') && !mode) || (typeof mode === 'string') && (mode.toLowerCase() !== 'true')) {
                            return String.Nest.ucFirst(_L('paused'));
                        } else if (_.include(['initial', 'steady', 'slow'], s.toLowerCase())) {
                            return String.Nest.ucFirst(_L('learning'));
                        } else {
                            return String.Nest.ucFirst(s);
                        }
                    },
                    'lower-safety-temp': function (s, m) {
                        var isOn = m.getField('lower_safety_temp_enabled');
                        $('td > .lower-safety-temp', v).toggleClass('heat-up', isOn).width();
                        return isOn ? N.displayTemperature(s, m.getTempScale()) : String.Nest.ucFirst(_L('off'));
                    },
                    'mac-address': function (s, m) {
                        return s || m.get('id');
                    },
                    'target-temperature': function (s, m) {
                        if (m.isHeating()) {
                            $('.field.target-temperature', v).removeClass('cool off').addClass('heat');
                        } else if (m.isCooling()) {
                            $('.field.target-temperature', v).removeClass('heat off').addClass('cool');
                        } else {
                            $('.field.target-temperature', v).removeClass('heat cool').addClass('off');
                        }
                        if (m.isOnline() && (m.isModeRange() || m.isAway() || m.isSystemOff())) {
                            $('.field.target-temperature', v).addClass('smaller');
                        } else {
                            $('.field.target-temperature', v).removeClass('smaller');
                        }
                        if (m.isModeRange()) {
                            $('.target-temperature-set-to', v).html(_L('range').toUpperCase());
                        } else if (m.isModeHeat()) {
                            $('.target-temperature-set-to', v).html(_L('heat to').toUpperCase());
                        } else if (m.isModeCool()) {
                            $('.target-temperature-set-to', v).html(_L('cool to').toUpperCase());
                        } else {
                            $('.target-temperature-set-to', v).html(_L('set to').toUpperCase());
                        }
                        N.wait(200).then(function () {
                            $('.field.target-temperature', v).addClass('loaded');
                        });
                        if ((!m.isOnline() && C.DEAD_DEVICE_THRESHOLD) || m.invalidTargetTemperature()) {
                            return '?';
                        } else if (m.isSystemOff()) {
                            return _L('off').toUpperCase();
                        } else if (m.isAway()) {
                            return _L('away').toUpperCase();
                        } else if (m.isModeRange()) {
                            return [displayTemp(m.get('target_temperature_low'), m), displayTemp(m.get('target_temperature_high'), m)].join(' ' + C.BULLET_CHAR + ' ');
                        } else {
                            return displayTemp(s, m);
                        }
                    },
                    'temperature-lock': function (s, m) {
                        $('.settings-fieldset.lock .locked', v).toggle(s === 'true' && !m.isModeRange());
                        $('.settings-fieldset.lock .locked-range', v).toggle(s === 'true' && m.isModeRange());
                        $('.settings-fieldset.lock .unlocked', v).toggle(s === 'false');
                        return s;
                    },
                    'temperature-scale': function (s, m) {
                        return toggleFormat('temperature-scale', s, m);
                    },
                    'time-to-target-training': function (s, m) {
                        return String.Nest.ucFirst(s);
                    },
                    'upper-safety-temp': function (s, m) {
                        var isOn = m.getField('upper_safety_temp_enabled');
                        $('td > .upper-safety-temp', v).toggleClass('cool-down', isOn).width();
                        return isOn ? N.displayTemperature(s, m.getTempScale()) : String.Nest.ucFirst(_L('off'));
                    },
                    'wiring': function (s, m) {
                        var t = [];
                        if (m.hasHeat()) {
                            if (m.hasOB()) {
                                t.push('<li>' + _L('Heat pump heating') + '</li>');
                            } else {
                                t.push('<li>' + String.Nest.ucFirst(_L('heating')) + '</li>');
                            }
                        }
                        if (m.hasX2Heat()) {
                            t.push('<li>' + _L('Stage two heating') + '</li>');
                        }
                        if (m.hasAux()) {
                            t.push('<li>' + _L('Auxiliary heating') + '</li>');
                        }
                        if (m.hasAC()) {
                            if (m.hasOB()) {
                                t.push('<li>' + _L('Heat pump cooling') + '</li>');
                            } else {
                                t.push('<li>' + String.Nest.ucFirst(_L('cooling')) + '</li>');
                            }
                        }
                        if (m.hasFan()) {
                            t.push('<li>' + _L('Fan') + '</li>');
                        }
                        $('.capabilities').html('<ul>' + t.join('') + '</ul>');
                        return spi._renderWireDiagram(m);
                    }
                },
                structure: {
                    'country-code': function (s, m) {
                        var isUS = s === 'US' || s === '';
                        $('.postal-code label .postal', v).toggle(!isUS);
                        $('.postal-code label .zip', v).toggle(isUS);
                        return isUS ? _L('USA') : _L('CAN');
                    },
                    'postal-code': function (s, m) {
                        if (m.getField('country_code') === 'CA') {
                            s = s.replace(/^(.{3})(.{3})$/, "$1 $2").toUpperCase();
                        }
                        return s;
                    },
                    'thermostats': function (s, m) {
                        return m.devices && spi._renderStructureThermostatList(m.devices.models);
                    }
                }
            }, updaters = {
                device: {},
                structure: {
                    'thermostats': function (s, m) {
                        var rs = $('.remove-structure'),
                            ns = $('.structure').length;
                        rs.prop({
                            id: m.id
                        });
                        if (ns < 2) {
                            rs.hide();
                        } else {
                            rs.show();
                        }
                    }
                }
            }, stringify = function (s) {
                return (!s && (isNaN(s) || s === null)) ? '' : String(s);
            };
        if (!view) {
            return;
        }
        $('.disabled select, .disabled button, .disabled input, .disabled textarea', v).prop({
            'disabled': true
        });
        var ma = m.attributes,
            cn = view.className,
            fs = fields[cn],
            n = fs.length;
        if (cn === 'device') {
            setEnergyHistory(m);
            spi.setSliders(v, view);
            if (m.hasHeat() || m.hasAC()) {
                $('header nav li.away').show();
                $('.settings-fieldset.equipment .heat-info').show();
                if (m.hasHeat() && m.hasAC()) {
                    $('.away-temps .heat-and-cool', v).show();
                    $('.away-temps .heat-or-cool', v).hide();
                    $('.safety-temps .heat-and-cool', v).show();
                    $('.safety-temps .heat', v).hide();
                    $('.safety-temps .cool', v).hide();
                    $('td > .lower-safety-temp', v).toggleClass('hidden', !m.getField('lower_safety_temp_enabled'));
                    $('td > .upper-safety-temp', v).toggleClass('hidden', !m.getField('upper_safety_temp_enabled') && m.getField('lower_safety_temp_enabled'));
                } else {
                    $('.away-temps .heat-and-cool', v).hide();
                    $('.away-temps .heat-or-cool', v).show();
                    $('.safety-temps .heat-and-cool', v).hide();
                    if (m.hasHeat()) {
                        $('.safety-temps .heat', v).show();
                        $('.safety-temps .cool', v).hide();
                    } else {
                        $('.safety-temps .heat', v).hide();
                        $('.safety-temps .cool', v).show();
                    }
                }
            } else {
                $('header nav li.away').hide();
                $('.settings-fieldset.equipment .heat-info').hide();
            }
        }
        for (var i = 0; i < n; i++) {
            var f = fs[i],
                fv = stringify(m.getField(f)),
                fm = formatters[cn][f],
                fu = updaters[cn][f],
                elms = $('.settings-fieldset .' + f, v).not(spi._onFocus.lastElement);
            if (fm) {
                fv = fm(fv, m);
            }
            if (fv === null) {
                continue;
            }
            for (var j = 0, jn = elms.length; j < jn; j++) {
                var elm = $(elms[j]),
                    tn = elm[0].tagName.toLowerCase(),
                    method = 'val';
                if (elm.hasClass('field')) {
                    continue;
                }
                if (tn === 'div' || tn === 'span') {
                    method = 'html';
                }
                if (elm.is(':checkbox')) {
                    elm[0].checked = fv;
                } else {
                    elm[method](fv);
                }
            }
            if (fu) {
                fu(fv, m);
            }
        }
        this._bindEventListeners(view);
        spi._hideInapplicableSections(v, m);
    };
    spi.viewChange = function (oldView, newView) {
        this.selectedView = oldView;
        S.selectedFieldset = 0;
        var self = this,
            v = $('.values'),
            ov = oldView && oldView.id,
            nv = newView && newView.id;
        if (ov !== nv) {
            this.enter(newView);
        } else {
            this.update(newView, true);
        }
    };
    spi._bindEventListeners = function (view) {
        var self = this,
            id = view.id,
            v = $('.values'),
            m = view.getModel(),
            toggleChange = function (elem, value) {
                var cn = $(elem).clone().removeClass('check-toggle').prop('className'),
                    isChecked = $(elem).is(":checked"),
                    dataAttr = (isChecked) ? "data-checked" : "data-unchecked",
                    val = $(elem).attr(dataAttr),
                    v = C.getView(id),
                    cur = v.getField(cn);
                if (typeof cur === 'boolean') {
                    val = isChecked;
                } else {
                    val = val.replace(/^\u00B0/, '');
                }
                v.setField(cn, val);
            };
        $(window).unbind(C.Events.STAGE_UPDATE_VIEW, this._handleNameChange).bind(C.Events.STAGE_UPDATE_VIEW, this._handleNameChange);
        if (view.className === 'structure') {
            this._bindDeviceMgmtHandlers(v);
        } else {
            $('.settings-fieldset.lock button', v).click(spi._confirmUnlockThermostat);
            $('.settings-fieldset.reset .reset-autoaway button', v).unbind('click', spi._confirmResetAutoAway).bind('click', spi._confirmResetAutoAway);
            $('.settings-fieldset.reset a.info-button', v).click(function (e) {
                e.stopImmediatePropagation();
                var el, b, sec = $(e.currentTarget).closest('.section'),
                    hideF = function () {
                        $('.popup-container', v).hide();
                        $('body').unbind('click', hideF);
                    };
                if ($('.popup-container', sec).is(":visible")) {
                    $('.popup-container').hide().unbind('click');
                    return;
                }
                $('.popup-container').hide().unbind('click');
                $('.popup-container', sec).show().bind('click', function (e) {
                    e.stopImmediatePropagation();
                });
                spi.update(view);
                spi.setSliders(v, view);
                el = $('.popup-container', sec);
                b = el.outerHeight() + el.offset().top - $(window).outerHeight() + 14;
                if (b > 0) {
                    el.css('top', el.position().top - b);
                }
                $('body').bind('click', hideF);
                return false;
            });
        }
        $('.control:not(.sized) input[type="checkbox"].check-toggle', v).toggleStyle({
            onChange: toggleChange
        }).toggleStyle('refresh');
        $('.control.sized input[type="checkbox"].check-toggle', v).toggleStyle({
            onChange: toggleChange,
            resizeContainer: false
        }).toggleStyle('refresh');
        $('.chooser, .control input[type="text"], .control textarea, .control select, .control input[type="radio"]', v).unbind('change', this._handleFieldChange).bind('change', this._handleFieldChange).bind('focus', spi._onFocus.bind(this)).bind('blur', spi._onBlur.bind(this)).bind('keydown', function (event) {
            var kc = event.keyCode,
                ti = $(event.target);
            if ((kc === 13) && $(ti[0]).is('input')) {
                event.preventDefault();
            }
            if (_.indexOf([27, 37, 38, 39, 40, 49, 50, 51, 52, 53, 54, 55, 56, 57], kc, true) !== -1) {
                event.stopImmediatePropagation();
            }
        }).bind('keyup', function (event) {
            var kc = event.keyCode,
                ti = $(event.target);
            if ((kc === 13) && $(ti[0]).is('input')) {
                event.preventDefault();
            }
            if ((kc === 13) && !$(ti[0]).is('textarea')) {
                ti.blur();
            } else if (kc === 27) {
                var chooser = $(this),
                    cn = chooser.parentsUntil('.field').parent().clone().removeClass('field').prop('className');
                ti.val(C.getView(id).getModel().getField(cn));
                ti.blur();
            }
        });
        $('input.postal-code', v).unbind('keypress').bind('keypress', function (e) {
            var key = String.fromCharCode(e.keyCode || e.which || '');
            if (/[^a-zA-Z0-9 \-]/.test(key) && (e.charCode !== 0)) {
                e.preventDefault();
            }
        });
        $('.add-device', v).unbind('click', spi._addDevice).bind('click', spi._addDevice);
        $('tr.popup', v).click(function (e) {
            e.stopImmediatePropagation();
            var el, b, tr = $(e.currentTarget).closest('tr'),
                hideF = function () {
                    $('.popup-container', v).hide();
                    $('body').unbind('click', hideF);
                };
            if ($('.popup-container', tr).is(":visible")) {
                $('.popup-container').hide().unbind('click');
                return;
            }
            $('.popup-container').hide().unbind('click');
            $('.popup-container', tr).show().bind('click', function (e) {
                e.stopImmediatePropagation();
            });
            spi.update(view);
            spi.setSliders(v, view);
            el = $('.universal-dialog', tr);
            b = el.outerHeight() + el.offset().top - $(window).outerHeight() + 14;
            if (b > 0) {
                el.css('top', el.position().top - b);
                $('.arrow', el).css('top', b);
            }
            $('body').bind('click', hideF);
        });
    };
    spi._addDevice = function (e) {
        var id = C.getSelectedViewID();
        e.stopPropagation();
        C.DeviceView.addNew(id);
    };
    spi._onFocus = function (event) {
        var t = event && event.target;
        if (t && t.tagName.toLowerCase() === 'select') {
            return;
        }
        N.wait(10).then(function () {
            spi._onFocus.lastElement = $(event.target);
        });
    };
    spi._onBlur = function (event) {
        spi._onFocus.lastElement = null;
    };
    spi._bindDeviceMgmtHandlers = function (v) {
        $('.delete-device', v).click(function (e) {
            e.stopImmediatePropagation();
            var did = $(e.target).closest('.thermostat')[0].id,
                dvv = C.getView(did),
                dvn = dvv.getDisplayName(),
                dvstv = dvv.getStructureView(),
                dvstn = dvstv.getDisplayName(),
                ddel = Sn.show({
                    html: _.template($('#_TMPL #confirm_device_delete').html(), {
                        device_name: dvn,
                        house_name: dvstn
                    }),
                    noHideTabs: true
                }),
                removeDevHandler = function () {
                    Sn.hide();
                    C.removeView(did);
                };
            $('.confirm-device-delete .yes', ddel).bind('click', removeDevHandler);
            $('.confirm-device-delete .no', ddel).bind('click', Sn.hide);
        });
        $('.add-structure', v).click(function (e) {
            e.stopImmediatePropagation();
            C.StructureView.addNew();
        });
        $('.remove-structure', v).click(function (e) {
            e.stopImmediatePropagation();
            var sid = $(e.target).prop('id'),
                sm = M.Cache.get(sid);
            if (sm.devices.length > 0) {
                Sn.show({
                    html: $('#_TMPL #notify_structure_delete_empty').html(),
                    noHideTabs: true
                });
            } else {
                var stv = C.getView(sid),
                    nm = stv.getDisplayName(),
                    hdel = Sn.show({
                        html: _.template($('#_TMPL #confirm_structure_delete').html(), {
                            house_name: nm
                        }),
                        noHideTabs: true
                    }),
                    removeStructHandler = function () {
                        Sn.hide();
                        C.removeView(sid);
                    };
                $('.confirm-structure-delete .yes', hdel).bind('click', removeStructHandler);
                $('.confirm-structure-delete .no', hdel).bind('click', Sn.hide);
            }
        });
    };
    spi._confirmUnlockThermostat = function (e) {
        e.stopPropagation();
        var d = C.getSelectedView(),
            dName = d.getDisplayName(),
            id = C.getSelectedViewID(),
            cHtml = _.template($('#_TMPL #confirm_unlock_thermostat').html(), {
                name: dName
            }),
            cut = Sn.show({
                css: {
                    width: '490px'
                },
                html: cHtml,
                noHideTabs: true
            });
        $('.confirm-unlock-thermostat .yes', cut).bind('click', function () {
            C.getView(id).setField('temperature-lock', false);
            Sn.hide();
        });
        $('.confirm-unlock-thermostat .no', cut).bind('click', function () {
            Sn.hide();
        });
    };
    spi._confirmResetAutoAway = function (e) {
        e.stopPropagation();
        var device = C.getSelectedView(),
            proceed = function () {
                device.getModel().setField('auto_away_reset', true);
            }, cHtml = $('#_TMPL #confirm_reset_autoaway').html(),
            crt = Sn.show({
                css: {
                    width: '490px'
                },
                html: cHtml,
                noHideTabs: true
            });
        $('.confirm-reset-autoaway .yes', crt).bind('click', function () {
            proceed();
            Sn.hide();
        });
        $('.confirm-reset-autoaway .no', crt).bind('click', function () {
            Sn.hide();
        });
    };
    spi._handleFieldChange = _.throttle(function () {
        var view = C.getSelectedView(),
            id = view.id,
            chooser = $(this),
            cn = chooser.parentsUntil('.field').parent().clone().removeClass('field').prop('className'),
            val = chooser.val();
        if (cn === 'postal-code') {
            spi._handlePostalCodeChange(val, id, chooser);
        } else {
            C.getView(id).setField(cn, val);
        }
    }, 200);
    spi._handleNameChange = function () {
        var hdr = $('.settings h4.name');
        if (C.getSelectedView()) {
            hdr.text(C.getSelectedView().getDisplayName());
        }
    };
    spi._handlePostalCodeChange = function (code, id, chooser) {
        var str = code.replace(' ', '').toUpperCase(),
            re = /^\d{5}|[A-CEGHJ-NPR-TVXY]\d([A-CEGHJ-NPR-TV-Z]\d){2}/,
            matched = str.match(re),
            revert = function () {
                chooser.val(C.getView(id).getField('postal_code'));
            };
        if (matched) {
            var parsed = matched[0];
            W.getForecastForStructure(parsed, function (response) {
                if (response.error) {
                    revert();
                } else {
                    var vw = C.getView(id),
                        loc = response && response.display_city;
                    if (!loc) {
                        return;
                    }
                    vw.setWeather(response);
                    vw.setPostalCode(loc, parsed);
                }
            });
        } else {
            revert();
        }
    };
    spi._hideInapplicableSections = function (v, m) {
        _.each($('*[data-requires-version]', v), function (el) {
            if (!m.hasCapabilityLevel($(el).data('requiresVersion'))) {
                $(el).remove();
            }
        });
        _.each($('*[data-requires-function]', v), function (el) {
            var reqs = $(el).data('requiresFunction').split('&&');
            if (!(_.all(reqs, function (r) {
                return m[r]();
            }))) {
                $(el).remove();
            }
        });
    };
    spi._renderStructureThermostatList = function (models) {
        var d = $('<div/>');
        _.each(models, function (v, k) {
            var vals = $('.values').first(),
                id = v.id,
                view = C.getView(id),
                model = M.Cache.get(id),
                cls = 'thermostat' + ($('#' + id + '.selected', vals).length ? ' selected' : '');
            if (!model) {
                return;
            }
            d.append($('<div/>', {
                'class': cls,
                html: ['<div class="dname">', view.getDisplayName(), '</div>', '<button class="delete-device">' + _L('Remove') + '</button>'].join(''),
                id: id
            }));
        });
        return d.html();
    };
    spi._renderWireDiagram = function (model) {
        var pins = model.getPins(),
            backplate = model.getField('backplate_model');
        if ($('.values .wiring-diagram .backplate').length) {
            if (pins === spi._renderWireDiagram.lastPins) {
                return null;
            }
        }
        var d = N.Wiring.renderDiagram(pins, backplate);
        spi._renderWireDiagram.lastPins = pins;
        return d;
    };
    spi.TemperatureSlider = function (obj) {
        var curHigh, curLow, curIsHighEnabled, curIsLowEnabled, highHandleClass = "sldr-high-handle",
            lowHandleClass = "sldr-low-handle",
            highTailClass = "sldr-high-tail",
            lowTailClass = "sldr-low-tail",
            defaultClass = "sldr-default",
            heatClass = "sldr-heat",
            coolClass = "sldr-cool",
            tempClass = "sldr-temp",
            onClass = 'sldr-on',
            leafClass = 'sldr-leaf',
            dragWidth = 29;
        this.container = obj.container === undefined ? null : obj.container;
        this.highDefault = obj.highDefault === undefined ? null : obj.highDefault;
        this.lowDefault = obj.lowDefault === undefined ? null : obj.lowDefault;
        this.highDefaultLabel = obj.highDefaultLabel === undefined ? _L('Default') : obj.highDefaultLabel;
        this.lowDefaultLabel = obj.lowDefaultLabel === undefined ? _L('Default') : obj.lowDefaultLabel;
        this.high = obj.high === undefined ? null : obj.high;
        this.highHandler = obj.highHandler === undefined ? null : obj.highHandler;
        this.highOffLabel = obj.highOffLabel === undefined ? null : obj.highOffLabel;
        this.highMin = obj.highMin === undefined ? -5000 : obj.highMin;
        this.leafHigh = obj.leafHigh === undefined ? false : obj.leafHigh;
        this.leafLow = obj.leafLow === undefined ? false : obj.leafLow;
        this.low = obj.low === undefined ? null : obj.low;
        this.lowHandler = obj.lowHandler === undefined ? null : obj.lowHandler;
        this.lowMax = obj.lowMax === undefined ? 5000 : obj.lowMax;
        this.lowOffLabel = obj.lowOffLabel === undefined ? null : obj.lowOffLabel;
        this.max = obj.max === undefined ? 90 : obj.max;
        this.min = obj.min === undefined ? 50 : obj.min;
        this.minRange = obj.minRange === undefined ? 0 : obj.minRange;
        this.scale = obj.scale === undefined ? 'F' : obj.scale;
        this.highType = obj.highType === undefined ? 'cool' : obj.highType;
        this.lowType = obj.lowType === undefined ? 'heat' : obj.lowType;
        this.lowOffSide = obj.lowOffSide === undefined ? 'min' : 'max';
        this.highOffSide = obj.highOffSide === undefined ? 'max' : 'min';
        this.isLowEnabled = obj.isLowEnabled === (undefined || null) ? true : obj.isLowEnabled;
        this.isHighEnabled = obj.isHighEnabled === (undefined || null) ? true : obj.isHighEnabled;
        this.lowEnabledHandler = obj.lowEnabledHandler === undefined ? null : obj.lowEnabledHandler;
        this.highEnabledHandler = obj.highEnabledHandler === undefined ? null : obj.highEnabledHandler;
        if ($(this.container).length === 0) {
            return;
        }
        this._dragStart = function (e, ui) {
            spi.isDragging = true;
            curHigh = this.high;
            curLow = this.low;
            curIsHighEnabled = this.isHighEnabled;
            curIsLowEnabled = this.isLowEnabled;
        };
        this._dragStop = function (e, ui) {
            if (ui.helper.hasClass(lowHandleClass)) {
                this.isLowEnabled = !this._isLowDragOff(ui);
                if (this.lowEnabledHandler && (this.isLowEnabled !== curIsLowEnabled)) {
                    this.low = this._posToTemp(this.lowDrag.position().left);
                    this.lowEnabledHandler(this.isLowEnabled, this.low);
                } else if (this.isLowEnabled) {
                    this.low = this._posToTemp(this.lowDrag.position().left);
                    if (this.low !== curLow) {
                        this.lowHandler(this.low);
                    }
                }
            }
            if (ui.helper.hasClass(highHandleClass)) {
                this.isHighEnabled = !this._isHighDragOff(ui);
                if (this.highEnabledHandler && (this.isHighEnabled !== curIsHighEnabled)) {
                    this.high = this._posToTemp(this.highDrag.position().left);
                    this.highEnabledHandler(this.isHighEnabled, this.high);
                } else if (this.isHighEnabled) {
                    this.high = this._posToTemp(this.highDrag.position().left);
                    if (this.high !== curHigh) {
                        this.highHandler(this.high);
                    }
                }
            }
            spi.isDragging = false;
        };
        this._isHighDragOff = function (dragger) {
            return (this.highOffLabel !== null) && ((this.highOffSide === 'max') ? this._isMaxDragOff(dragger) : this._isMinDragOff(dragger));
        };
        this._isLowDragOff = function (dragger) {
            return (this.lowOffLabel !== null) && ((this.lowOffSide === 'min') ? this._isMinDragOff(dragger) : this._isMaxDragOff(dragger));
        };
        this._isMaxDragOff = function (dragger) {
            return (dragger.position.left === this.elWidth - dragWidth);
        };
        this._isMinDragOff = function (dragger) {
            return (dragger.position.left === 0);
        };
        this._dragging = function (e, ui) {
            e.stopPropagation();
            var diff, t = this._posToTemp(ui.position.left);
            if (ui.helper.hasClass(lowHandleClass)) {
                if (this._isLowDragOff(ui)) {
                    this._setLabel(this.lowOffLabel, ui.helper);
                    this._setLeaf(ui.helper, this.leafLow, false);
                } else {
                    this._setLabel(t, ui.helper);
                    this._setLeaf(ui.helper, this.leafLow && t <= this.leafLow, true, t);
                }
                this._setTailLow(t);
            } else {
                if (this._isHighDragOff(ui)) {
                    this._setLabel(this.highOffLabel, ui.helper);
                    this._setLeaf(ui.helper, this.leafHigh, false);
                } else {
                    this._setLabel(t, ui.helper);
                    this._setLeaf(ui.helper, this.leafHigh && t >= this.leafHigh, true, t);
                }
                this._setTailHigh(t);
            }
        };
        this._posToTemp = function (p) {
            var pwid = this.elWidth - dragWidth,
                val = this._tempRound((p / pwid) * this.tempWidth) + this.min;
            return val;
        };
        this._setLabel = function (temp, el) {
            var t = N.splitTemperature(temp, this.scale);
            $('.' + tempClass, el).html(t);
        };
        this._setLeaf = function (el, leafEnabled, valOn, val) {
            var showLeaf = (leafEnabled !== false);
            el.toggleClass(leafClass, showLeaf).toggleClass('sldr-off', !valOn).toggleClass('sldr-narrow', val < 10 && valOn).toggleClass('sldr-wide', val >= 10 && valOn);
        };
        this._setTailHigh = function (t) {
            var w = (this.elWidth - this._tempToPos(t)) - dragWidth / 2;
            this.highTail.width(w);
        };
        this._setTailLow = function (t) {
            var w = this._tempToPos(t) + dragWidth / 2;
            this.lowTail.width(w);
        };
        this._setTemp = function (t, el) {
            if (t < this.min) {
                t = this.min;
            } else if (t > this.max) {
                t = this.max;
            }
            var l = this._tempToPos(t);
            $(el).css('left', l);
        };
        this._tempToPos = function (t) {
            var pct = (t - this.min) / this.tempWidth,
                val = Math.round(pct * (this.elWidth - dragWidth));
            return val;
        };
        this._tempRound = function (n) {
            var r = (this.scale.toUpperCase() === 'F') ? Math.round(n) : Math.round(n * 2) / 2;
            return r;
        };
        this.getHigh = function () {
            return this.high;
        };
        this.getLow = function () {
            return this.low;
        };
        this.setHigh = function (t) {
            if (spi.isDragging || (this.high === null)) {
                return false;
            }
            this.high = t;
            this._setLabel(t, this.highDrag);
            this._setTemp(t, this.highDrag);
            this._setTailHigh(t);
        };
        this.setLow = function (t) {
            if (spi.isDragging || (this.low === null)) {
                return false;
            }
            this.low = t;
            this._setLabel(t, this.lowDrag);
            this._setTemp(t, this.lowDrag);
            this._setTailLow(t);
        };
        this.setHighEnabled = function (isEnabled) {
            if (spi.isDragging || (this.highOffLabel === null)) {
                return false;
            }
            var p = (this.highOffSide === 'min') ? this.min : this.max;
            this.isHighEnabled = isEnabled;
            if (!isEnabled) {
                this._setLabel(this.highOffLabel, this.highDrag);
                this._setTemp(p, this.highDrag);
                this._setTailHigh(p);
            }
        };
        this.setLowEnabled = function (isEnabled) {
            if (spi.isDragging || (this.lowOffLabel === null)) {
                return false;
            }
            var p = (this.lowOffSide === 'max') ? this.max : this.min;
            this.isLowEnabled = isEnabled;
            if (!isEnabled) {
                this._setLabel(this.lowOffLabel, this.lowDrag);
                this._setTemp(p, this.lowDrag);
                this._setTailLow(p);
            }
        };
        this.setScale = function (s) {
            this.scale = s;
        };
        this.render = function () {
            if (spi.isDragging) {
                return;
            }
            var self = this,
                highColorClass = this.highType === 'cool' ? coolClass : heatClass,
                lowColorClass = this.lowType === 'heat' ? heatClass : coolClass;
            $(this.container).html('');
            this.el = $('<div class="sldr-controller"></div>').appendTo($(this.container));
            this.elWidth = this.el.width();
            this.tempWidth = this.max - this.min;
            this.minRange = (this.high === null || this.low === null) ? 0 : this.minRange;
            this.minRangePx = this._tempToPos(this.minRange + this.min);
            this.elOffset = this.el.offset();
            if (this.low !== null) {
                var lowMaxLimit = this.elOffset.left + Math.min(this.elWidth - dragWidth - this.minRangePx, this._tempToPos(this.lowMax));
                this.el.append('<div class="' + lowHandleClass + ' ' + lowColorClass + '"><div class="' + tempClass + '"></div></div><div class="' + lowTailClass + ' ' + lowColorClass + '"></div>');
                this.lowDrag = $('.' + lowHandleClass, this.el).draggable({
                    axis: "x",
                    containment: [this.elOffset.left, 0, lowMaxLimit, 0],
                    drag: this._dragging.bind(this),
                    start: this._dragStart.bind(this),
                    stop: this._dragStop.bind(this)
                }).mousedown(function () {
                    $('.' + onClass, this.el).removeClass(onClass);
                    $(this).addClass(onClass);
                });
                this.lowTail = $('.' + lowTailClass, this.el);
                if (this.isLowEnabled) {
                    this.setLow(this.low);
                } else {
                    this.setLowEnabled(false);
                }
                var lowLeafOn = this.leafLow && (!this.isLowEnabled || (this.low <= this.leafLow));
                this._setLeaf(this.lowDrag, lowLeafOn, this.isLowEnabled, this.low);
            }
            if (this.high !== null) {
                var highMinLimit = this.elOffset.left + Math.max(this.minRangePx, this._tempToPos(this.highMin));
                this.el.append('<div class="' + highHandleClass + ' ' + highColorClass + '"><div class="' + tempClass + '"></div></div><div class="' + highTailClass + ' ' + highColorClass + '"></div>');
                this.highDrag = $('.' + highHandleClass, this.el).draggable({
                    axis: "x",
                    containment: [highMinLimit, 0, this.elOffset.left + this.elWidth - dragWidth, 0],
                    drag: this._dragging.bind(this),
                    start: this._dragStart.bind(this),
                    stop: this._dragStop.bind(this)
                }).mousedown(function () {
                    $('.' + onClass, this.el).removeClass(onClass);
                    $(this).addClass(onClass);
                });
                this.highTail = $('.' + highTailClass, this.el);
                if (this.isHighEnabled) {
                    this.setHigh(this.high);
                } else {
                    this.setHighEnabled(false);
                }
                var highLeafOn = this.leafHigh && (!this.isHighEnabled || (this.high >= this.leafHigh));
                this._setLeaf(this.highDrag, highLeafOn, this.isHighEnabled, this.high);
            }
            if (this.highDefault !== null) {
                $('<div class="' + defaultClass + '"><div class="sldr-text">' + this.highDefaultLabel + '</div></div>').appendTo(this.el).css('left', this._tempToPos(this.highDefault));
            }
            if (this.lowDefault !== null) {
                $('<div class="' + defaultClass + '"><div class="sldr-text">' + this.lowDefaultLabel + '</div></div>').appendTo(this.el).css('left', this._tempToPos(this.lowDefault));
            }
            $(window).unbind('resize', this.render).bind('resize', $.proxy(this, 'render'));
        };
        this.render();
    };
})(window.jQuery, window._);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        GA = N.GoogleAnalytics,
        C = N.Console = N.Console || {}, D = C.Details = C.Details || {}, P = C.DetailsPanel;
    var sp = new P({
        name: 'support'
    });
    sp.enter = function (view, dfr) {
        GA.trackEvent('Console', 'view' + String.Nest.ucFirst(view.className) + 'Support');
        var v = $('.details .values'),
            rawHTML = $('#_TMPL #support_template').html();
        v.html(rawHTML).addClass('support');
    };
    sp.exit = function (view, dfr) {
        var v = $('.values');
        v.animate({
            opacity: 0
        }, P.exitFade, function () {
            v.empty().removeClass('support').css({
                opacity: 1
            }).show();
            if (dfr) {
                dfr.resolve();
            }
        });
    };
    sp.viewChange = function (oldView, newView) {
        this.enter(newView);
    };
})(window.jQuery, window._);
(function ($, _, $G, undefined) {
    'use strict';
    var N = window.Nest,
        GA = N.GoogleAnalytics,
        _L = N.Localization.namespace('Console'),
        M = N.Models,
        C = N.Console = N.Console || {}, D = C.Details = C.Details || {}, K = C.Control = C.Control || {}, P = C.DetailsPanel,
        Pp = P.prototype,
        S = C.Schedule = C.Schedule || {};
    S.SCHEMA_VERSION = 2;
    S.TOUCHED_BY = 4;
    S.TOUCHED_ID = N.BUILD_INFO + '-' + N.IP_ADDRESS.replace(/\./g, '-');
    S.TOUCHED_SOURCE = '';
    S.TIME_ZONE_OFFSET = (new Date()).getTimezoneOffset() * -60;
    var COPY_MODE_DAY = 'day',
        COPY_MODE_SET_POINT = 'setPoint',
        DAY_SCHEDULE_HEIGHT = 35,
        ENTRY_TYPE_CONTINUATION = 'continuation',
        ENTRY_TYPE_SETPOINT = 'setpoint',
        EVENT_CLONE_DAY = 'cloneScheduleDay',
        EVENT_CLONE_SET_POINT = 'cloneScheduleSetPoint',
        EVENT_CHANGE_TEMP = 'changeSetPointTemp',
        EVENT_CHANGE_TIME = 'changeSetPointTime',
        EVENT_REMOVE_SET_POINT = 'removeSetPoint',
        SECONDS_PER_15_MINS = 900,
        SECONDS_PER_DAY = 86400,
        SECONDS_PER_HOUR = 3600,
        SET_POINT_DIAMETER = 32,
        SET_POINT_RADIUS = SET_POINT_DIAMETER / 2,
        SET_POINT_SELECT_RADIUS = 27,
        is24hr = false,
        numericSort = function (a, b) {
            return Number(a) - Number(b);
        }, timeSort = function (a, b) {
            var ac = (a.entry_type && (a.entry_type === ENTRY_TYPE_CONTINUATION)),
                bc = (b.entry_type && (b.entry_type === ENTRY_TYPE_CONTINUATION));
            if (ac === bc) {
                return (a.time - b.time);
            } else {
                return bc ? -1 : 1;
            }
        }, getUsableWidth = function (width) {
            return (width - SET_POINT_DIAMETER) - (0 - SET_POINT_RADIUS) - 2;
        }, positionFromTime = function (width, time) {
            var timeRange = SECONDS_PER_DAY - (15 * 60),
                leftMost = 0 - SET_POINT_RADIUS,
                usableWidth = getUsableWidth(width);
            return Math.round((time / timeRange) * usableWidth) + leftMost;
        }, timeFromPosition = function (left, noRounding) {
            var width = $('.values .week-schedule .day').first().width(),
                timeRange = SECONDS_PER_DAY - (15 * 60),
                leftMost = 0 - SET_POINT_RADIUS,
                usableWidth = getUsableWidth(width),
                pos = left - leftMost,
                time = (pos / usableWidth) * timeRange;
            time = Math.min(Math.max(time, 0), timeRange);
            return noRounding ? Math.round(time) : Math.round(time / SECONDS_PER_15_MINS) * SECONDS_PER_15_MINS;
        };
    var spi = S.DetailsPanel = new P({
        name: 'schedule'
    });
    spi.clipboard = null;
    spi.isAddMode = false;
    spi.isDragging = false;
    spi.view = null;
    spi.leafData = {};
    spi.enter = function (view, dfr) {
        var v = $('.values');
        v.addClass('schedule').css({
            opacity: 0
        }).html($('#_TMPL #schedule_week_view').html()).animate({
            opacity: 1
        }, P.enterFade, function () {
            if (dfr) {
                dfr.resolve();
            }
        });
        GA.trackEvent('Console', 'viewDeviceSchedule');
        spi.clipboard = null;
        spi.days = null;
        spi.isAddMode = false;
        spi.isDragging = false;
        spi.leafData = {};
        spi.view = view;
        spi.unbindEvents();
        $(window).bind('resize', spi.resize).bind(C.Events.HVAC_MODE_CHANGE, spi.hvacModeChange);
        $(document.body).bind('mouseup', spi.mouseup);
        $(document).bind('keydown', spi.keydown);
        v.bind('mousedown', spi.mousedown);
        $('.controls .button', v).bind('click', spi.clickButton);
        spi.update(view, true);
        dfr.resolve();
    };
    spi.exit = function (view, dfr) {
        var v = $('.values');
        v.animate({
            opacity: 0
        }, P.exitFade, function () {
            v.empty().removeClass('schedule').css({
                opacity: 1
            });
            if (dfr) {
                dfr.resolve();
            }
        });
        spi.unbindEvents();
        spi.days = null;
    };
    spi.unbindEvents = function () {
        var v = $('.values');
        $(window).unbind('resize', spi.resize).unbind(C.Events.HVAC_MODE_CHANGE, spi.hvacModeChange);
        $(document.body).unbind('mouseup', spi.mouseup);
        $(document).unbind('keydown', spi.keydown);
        v.unbind('mousedown', spi.mousedown);
        $('.controls .button', v).unbind('click', spi.clickButton);
    };
    spi.update = function (view, forceUpdate, updateSelected) {
        if (view.isOffline === true) {
            return D.isOffline();
        }
        if (spi.isDragging) {
            return false;
        }
        var v = $('.values'),
            schedule = M.Cache.get('schedule_' + view.id),
            days = schedule.attributes.days,
            width = $('.week-schedule', v).width(),
            usableWidth = getUsableWidth(width),
            mode = spi.mode,
            vmode = view.getModel().attributes.target_temperature_type,
            m = view.getModel();
        if (m.isSystemOff()) {
            spi.disableSchedule();
        } else {
            spi.enableSchedule();
        }
        if (mode !== vmode) {
            forceUpdate = true;
            $('div.day', v).empty();
        }
        spi.mode = vmode;
        _.each(days, function (day, d) {
            if (!updateSelected && $('div.day[data-dow="' + d + '"] .set-point.selected', v).length) {
                return;
            }
            day = _.toArray(day);
            day.sort(timeSort);
            if (forceUpdate || !_.isEqual((spi.days || {})[d], day)) {
                $('div.day[data-dow="' + d + '"]', v).empty();
            }
            spi.drawDaySchedule(day, d);
        });
        $('.time-scale .hour-label', v).remove();
        var timeRange = SECONDS_PER_DAY - (15 * 60),
            hourWidth = Math.round((SECONDS_PER_HOUR / timeRange) * usableWidth);
        for (var h = 1; h < 24; h++) {
            var timeScale = $('.time-scale', v),
                time = is24hr ? ((h < 10) ? '0' + h : h) : ((h > 12) ? (h - 12) + 'p' : h + 'a'),
                pos = positionFromTime(width, h * SECONDS_PER_HOUR) + 12,
                isNoon = (!is24hr && h === 12);
            if (isNoon) {
                time = _L('Noon');
                pos -= 7;
            }
            $('<div/>', {
                'class': 'hour-label' + (isNoon ? ' noon' : ''),
                'css': {
                    left: pos + 'px',
                    width: hourWidth
                },
                'html': '<span>' + time + '</span>'
            }).appendTo(timeScale);
        }
        spi.days = days;
    };
    spi.viewChange = function (ov, nv) {
        spi.enter(nv, new $.Deferred());
    };
    spi.drawDaySchedule = function (day, index) {
        var v = $('.values'),
            par = $('div.day[data-dow="' + index + '"]', v),
            ts = spi.view.getModel().getTempScale(),
            width = $('.week-schedule', v).width();
        _.each(day, function (setPoint, k) {
            var t = setPoint.time,
                temp = setPoint.temp,
                type = setPoint.type.toLowerCase(),
                range = (type === 'range'),
                et = setPoint.entry_type;
            if (et === ENTRY_TYPE_CONTINUATION) {
                return;
            }
            var tempo = new N.Temperature(temp, ts),
                tempd = tempo.js(),
                data = {
                    setPoint: setPoint
                };
            var elem = spi.createOrUpdateSetPoint(index, setPoint, true).css('left', positionFromTime(width, t) + 'px');
            data.elem = elem;
            elem.bind('mousedown', function (event) {
                spi.mousedownSetPoint(event, data);
            }).bind('mouseenter', function (event) {
                spi.mouseenterSetPoint(event, data);
            }).bind('mouseleave', function (event) {
                spi.mouseleaveSetPoint(event, data);
            });
            elem.draggable({
                start: function () {
                    spi.dragStart(data);
                },
                stop: function () {
                    spi.dragStop(data);
                },
                drag: function () {
                    spi.drag(data);
                }
            }).draggable('option', 'handle', '.circle, .time-label');
        });
    };
    spi.createOrUpdateSetPoint = function (dow, data, append) {
        var v = $('.values'),
            par = $('div.day[data-dow="' + dow + '"]', v),
            time = data.time,
            type = data.type.toLowerCase(),
            m = spi.view.getModel(),
            isr = (type === 'range'),
            ts = m.getTempScale().toLowerCase(),
            elem = $('div.set-point[data-time="' + time + '"]', par);
        if (!elem.length) {
            var tid = (isr ? 'schedule_range_set_point' : 'schedule_set_point'),
                tmpl = _.template($('#_TMPL #' + tid).html());
            elem = $(tmpl(data));
            if (append) {
                elem.appendTo(par);
            }
            elem.addClass('scale-' + ts).data('time', time);
            if (elem.parents().length) {
                elem.attr({
                    'data-time': time,
                    title: N.DEBUG ? JSON.stringify(data) : ''
                }).prop('data-time', time);
            }
        }
        elem.addClass(type);
        $('.circle', elem).each(function (i, e) {
            var j = $(e);
            j.addClass(type);
            var t = new N.Temperature(j.hasClass('max') ? data['temp-max'] : data['temp-min'] || data['temp'], ts);
            j.toggleClass('single-digit', t.lessThan(new N.Temperature(10, 'C')));
        });
        spi.updateSetPointTemp(elem, data);
        return elem;
    };
    spi.updateSetPointTemp = function (elem, setPoint) {
        var ts = spi.view.getModel().getTempScale();
        if (setPoint.type.toLowerCase() === 'range') {
            $('.circle .temp-max', elem).html(new N.Temperature(setPoint['temp-max'], ts).js());
            $('.circle .temp-min', elem).html(new N.Temperature(setPoint['temp-min'], ts).js());
        } else {
            $('.circle', elem).html(new N.Temperature(setPoint['temp'], ts).js());
        }
        if (elem.hasClass('selected')) {
            spi.updateLeaf(elem, setPoint);
        }
    };
    spi.updateLeaf = function (elem, setPoint) {
        var isRange = setPoint.type.toLowerCase() === 'range',
            time = elem.data('time'),
            dow = elem.parents('day').data('dow'),
            type = setPoint.type.toLowerCase(),
            key = [type, dow, time].join('-'),
            lkey = spi.leafData.key,
            ts = spi.view.getModel().getTempScale(),
            absLeafLow = new N.Temperature(16.67, ts).toNumber(),
            absLeafHigh = new N.Temperature(28.88, ts).toNumber(),
            relLeafLow = new N.Temperature(22.23, ts).toNumber(),
            relLeafHigh = new N.Temperature(23.33, ts).toNumber(),
            leafDelta = (ts.toUpperCase() === 'F') ? 2 : 1.11;
        if (key !== lkey) {
            spi.leafData.key = key;
            spi.leafData.value = isRange ? {
                tempMin: new N.Temperature(setPoint['temp-min'], ts).toNumber(),
                tempMax: new N.Temperature(setPoint['temp-max'], ts).toNumber()
            } : {
                temp: new N.Temperature(setPoint['temp'], ts).toNumber()
            };
        }
        if (isRange) {
            var tmin = new N.Temperature(setPoint['temp-min'], ts).toNumber(),
                tmax = new N.Temperature(setPoint['temp-max'], ts).toNumber();
            elem.children('.leaf.cool').toggleClass('temp-max-leaf', (tmax >= absLeafHigh));
            elem.children('.leaf.heat').toggleClass('temp-min-leaf', (tmin <= absLeafLow));
        } else {
            var coolCheck = function (nt, ot) {
                return (nt >= absLeafHigh) || ((nt - leafDelta) >= ot && nt >= relLeafHigh);
            }, heatCheck = function (nt, ot) {
                return (nt <= absLeafLow) || ((nt + leafDelta) <= ot && nt <= relLeafLow);
            }, temp = new N.Temperature(setPoint['temp'], ts).toNumber(),
                showLeaf = (type === 'heat') ? heatCheck(temp, spi.leafData.value.temp) : coolCheck(temp, spi.leafData.value.temp);
            elem.children('.leaf').toggleClass('temp-leaf', showLeaf);
        }
    };
    spi.mousedown = function (event) {
        var v = $('.values'),
            ws = $('.week-schedule', v),
            width = ws.width();
        ws.css({
            'right': 'auto',
            'width': width
        });
        var t = $(event.target),
            tempField = (t.parents('.max').length) ? 'temp-max' : (t.parents('.min').length ? 'temp-min' : 'temp');
        if (!spi.isAddMode && t.hasClass('day') || t.hasClass('label')) {
            spi.selectDay(t.data('dow'));
        } else if (t.hasClass('arrow-up') || t.hasClass('up')) {
            if (spi.isMouseInSetPoint(event, t)) {
                event.stopPropagation();
                spi.tempUp(t.parents('.set-point').first(), tempField);
            }
        } else if (t.hasClass('arrow-down') || t.hasClass('down')) {
            if (spi.isMouseInSetPoint(event, t)) {
                event.stopPropagation();
                spi.tempDown(t.parents('.set-point').first(), tempField);
            }
        }
        event.preventDefault();
    };
    spi.mousedownSetPoint = function (event, data) {
        if (spi.isAddMode) {
            return;
        }
        var v = $('.values'),
            t = $(event.target),
            elem = data.elem,
            off = elem.offset(),
            par = elem.parent(),
            poff = par.offset(),
            sps = par.children('.set-point'),
            idx = sps.index(elem),
            top = off.top,
            size = SET_POINT_DIAMETER,
            left = (idx === 0) ? poff.left - SET_POINT_RADIUS : elem.prev().offset().left + size + 1,
            right = (idx === sps.length - 1) ? poff.left + par.width() - size - 2 : elem.next().offset().left - size - 2;
        elem.draggable('option', 'containment', [left, top, right, top]).addClass('grabbing');
        if (t.hasClass('circle') || t.hasClass('time-label')) {
            $('.temp-controls', elem).hide();
        }
        if (!elem.hasClass('selected')) {
            spi.selectSetPoint(elem, data.setPoint);
        }
    };
    spi.mouseenterSetPoint = function (event, data) {
        if (spi.isDragging || spi.isAddMode) {
            return;
        }
        var t = $(event.target);
        if (t.hasClass('time-label')) {
            return;
        }
        t = t.parents('.set-point');
        var dsp = data.setPoint,
            tb = dsp.touched_by || 0,
            touchData = _.extend({}, dsp, {
                time: spi.getAmPmTime(t.data('time')),
                day: String.Nest.ucFirst($('.week-day-labels div.label[data-dow="' + t.parent().data('dow') + '"]').html().toLowerCase())
            }),
            s = spi.clearStatus(),
            sp = $('.circle', t).clone().appendTo(s),
            st = $('<div/>', {
                'class': 'status-text'
            }).html(_.template($('#_TMPL #schedule_whodunit_text_' + tb).html(), touchData)).appendTo(s);
        $('.values .controls .status').stop().css({
            opacity: 0
        }).animate({
            opacity: 1
        }, 100);
    };
    spi.mouseleaveSetPoint = function (event, data) {
        if (spi.isDragging) {
            return;
        }
        spi.clearStatus(true);
    };
    spi.mouseup = function (event, data) {
        var v = $('.values'),
            ws = $('.week-schedule', v);
        ws.css({
            'right': 0,
            'width': 'auto'
        });
        $('.set-point.selected', v).removeClass('grabbing').children('.temp-controls').show();
    };
    spi.keydown = function (event) {
        var kc = event.keyCode,
            isMac = (navigator.platform.indexOf('Mac') > -1),
            ctrlFuncs = {
                67: spi.copy,
                86: spi.paste
            }, funcs = {
                27: spi.cancel
            }, func;
        func = (event.metaKey || (isMac !== event.ctrlKey)) ? ctrlFuncs[kc] : funcs[kc];
        if (func) {
            func.apply(this, [event]);
        }
    };
    spi.dragStart = function (data) {
        spi.isDragging = true;
    };
    spi.drag = function (data) {
        spi.updateTimeLabel(timeFromPosition(data.elem.position().left, true));
    };
    spi.dragStop = function (data) {
        var elem = data.elem,
            ot = elem.data('time'),
            nt = timeFromPosition(elem.position().left),
            dow = elem.parent().data('dow'),
            view = spi.view,
            schedule = M.Cache.get('schedule_' + view.id),
            days = schedule.attributes.days,
            day = days[dow],
            prev = elem.prev().data('time'),
            next = elem.next().data('time');
        if (_.isNumber(prev) && (nt - prev < SECONDS_PER_HOUR)) {
            nt = prev + SECONDS_PER_HOUR;
        } else if (_.isNumber(next) && (next - nt < SECONDS_PER_HOUR)) {
            nt = next - SECONDS_PER_HOUR;
        }
        spi.updateTimeLabel(nt);
        _.find(day, function (v, k) {
            if (v.time === ot && v.entry_type !== ENTRY_TYPE_CONTINUATION) {
                v.time = nt;
                spi.setTouchedFields(v);
                return true;
            }
        });
        elem.data('time', nt).attr('data-time', nt).prop('data-time', nt);
        schedule.setSchedule(days, EVENT_CHANGE_TIME);
        spi.isDragging = false;
        spi.drawDaySchedule(day, dow);
    };
    spi.tempUp = function (elem, field) {
        var dow = elem.parent().data('dow'),
            time = elem.data('time'),
            view = spi.view,
            m = view.getModel(),
            ts = m.attributes.temperature_scale,
            schedule = M.Cache.get('schedule_' + view.id),
            days = schedule.attributes.days,
            day = days[dow];
        _.find(day, function (v, k) {
            if (v.time === time && v.entry_type !== ENTRY_TYPE_CONTINUATION) {
                var temp = (ts === 'F') ? Math.Nest.CToF(v[field]) : v[field],
                    max = m.getTempMinMax(field).max,
                    dmax = (ts === 'F') ? Math.Nest.CToF(max) : max;
                temp = Math.min((ts === 'F') ? temp + 1 : temp + 0.5, dmax);
                v[field] = (ts === 'F') ? Math.Nest.FToC(temp) : temp;
                if (field === 'temp-min') {
                    v['temp-max'] = Math.max(v['temp-max'], v[field] + m.MIN_RANGE_SPREAD);
                }
                spi.setTouchedFields(v);
                return true;
            }
        });
        schedule.setSchedule(days, EVENT_CHANGE_TEMP);
        spi.drawDaySchedule(day, dow);
        $('.values .status .circle').remove();
        elem.children('.circle').clone().prependTo('.values .status');
    };
    spi.tempDown = function (elem, field) {
        var dow = elem.parent().data('dow'),
            time = elem.data('time'),
            view = spi.view,
            m = view.getModel(),
            ts = m.attributes.temperature_scale,
            schedule = M.Cache.get('schedule_' + view.id),
            days = schedule.attributes.days,
            day = days[dow];
        _.find(day, function (v, k) {
            if (v.time === time && v.entry_type !== ENTRY_TYPE_CONTINUATION) {
                var temp = (ts === 'F') ? Math.Nest.CToF(v[field]) : v[field],
                    min = m.getTempMinMax(field).min,
                    dmin = (ts === 'F') ? Math.Nest.CToF(min) : min;
                temp = Math.max((ts === 'F') ? temp - 1 : temp - 0.5, dmin);
                v[field] = (ts === 'F') ? Math.Nest.FToC(temp) : temp;
                if (field === 'temp-max') {
                    v['temp-min'] = Math.min(v['temp-min'], v[field] - m.MIN_RANGE_SPREAD);
                }
                spi.setTouchedFields(v);
                return true;
            }
        });
        schedule.setSchedule(days, EVENT_CHANGE_TEMP);
        spi.drawDaySchedule(day, dow);
        $('.values .status .circle').remove();
        elem.children('.circle').clone().prependTo('.values .status');
    };
    spi.deselectSetPoints = function () {
        var v = $('.values');
        $('.set-point', v).removeClass('selected').css('top', '');
        $('.button.remove', v).addClass('disabled');
        $('.time-label', v).css({
            'opacity': 0,
            'top': 'auto'
        });
        $('.arrow-panel', v).unbind('mousemove mouseout');
    };
    spi.selectSetPoint = function (elem, setPoint) {
        var v = $('.values'),
            ts = $('.time-scale', v),
            time = elem.data('time'),
            par = elem.parent(),
            dow = par.data('dow'),
            imr = elem.hasClass('range'),
            tltop = (6 - dow) * DAY_SCHEDULE_HEIGHT;
        if (!$(elem).hasClass('selected')) {
            spi.selectDay(dow);
            if (imr && (dow > 3)) {
                elem.css({
                    'top': ((dow - 4) * DAY_SCHEDULE_HEIGHT) + 39
                });
                tltop += 102;
            }
            $('.time-label', elem).css({
                'opacity': 0,
                'top': tltop
            });
        }
        elem.addClass('selected');
        spi.updateTimeLabel(time);
        $('.button.remove', v).removeClass('disabled');
        spi.showTimeLabel();
        $('.arrow-panel', elem).bind('mousemove', function (event) {
            var t = $(this);
            t.toggleClass('arrow-hover', spi.isMouseInSetPoint(event, t));
        }).bind('mouseout', function (event) {
            $(this).removeClass('arrow-hover');
        });
        spi.updateLeaf(elem, setPoint);
    };
    spi.isMouseInSetPoint = function (event, self) {
        var t = self,
            et = $(event.target),
            x = event.offsetX,
            spr = SET_POINT_SELECT_RADIUS,
            ax = Math.abs(spr - x),
            y = event.offsetY,
            ay, h;
        if (t.hasClass('up') && (y <= spr) && et.parents('.temp-controls.min').length === 0) {
            ay = spr - y;
            h = Math.round(Math.sqrt((ax * ax) + (ay * ay)));
            if (h > spr && !et.hasClass('arrow-up')) {
                return false;
            }
        } else if (t.hasClass('down') && (y >= (t.height() - spr)) && et.parents('.temp-controls.max').length === 0) {
            ay = y - (t.height() - spr);
            h = Math.round(Math.sqrt((ax * ax) + (ay * ay)));
            if (h > spr && !et.hasClass('arrow-down')) {
                return false;
            }
        }
        return true;
    };
    spi.updateTimeLabel = function (time, top) {
        $('.values .set-point.selected .time-label, .ghost .time-label, .status-text .time').html(spi.getAmPmTime(time, true));
        if (!_.isUndefined(top)) {
            $('.values .set-point.selected .time-label, .ghost .time-label').css({
                top: top
            });
        }
    };
    spi.getAmPmTime = function (secondsSinceMidnight, snapToTime) {
        var ssm = secondsSinceMidnight,
            s = snapToTime ? Math.round(ssm / SECONDS_PER_15_MINS) * SECONDS_PER_15_MINS : ssm,
            t = Date.Nest.fromDaySeconds(s);
        return $G.format(t, N.Localization.formats.get($G.culture().language, 'time'));
    };
    spi.showTimeLabel = function () {
        $('.values .set-point.selected .time-label').animate({
            opacity: 1
        }, 250);
    };
    spi.selectDay = function (dow) {
        var v = $('.values');
        spi.deselectSetPoints();
        $('.label, .day', v).removeClass('selected');
        $('div.day[data-dow="' + dow + '"], div.label[data-dow="' + dow + '"]', v).addClass('selected');
        $('.button.copy', v).removeClass('disabled');
    };
    spi.deselectDays = function () {
        var v = $('.values');
        spi.deselectSetPoints();
        $('.label, .day', v).removeClass('selected');
        $('.button.copy', v).addClass('disabled');
    };
    spi.clickButton = function (event) {
        var v = $('.values'),
            target = $(event.target),
            handlers = {
                add: function () {
                    spi.add();
                },
                cancel: function () {
                    spi.cancel();
                },
                copy: function () {
                    spi.copy();
                },
                paste: function () {
                    spi.paste();
                },
                remove: function () {
                    spi.remove($('.day .set-point.selected', v));
                }
            };
        _.find(handlers, function (func, name) {
            if (target.hasClass(name) && !target.hasClass('disabled')) {
                func();
                return true;
            }
        });
    };
    spi.add = function () {
        var v = $('.values'),
            ws = $('.week-schedule', v).addClass('add-mode'),
            b = $('.buttons', v),
            sd = $('.day.selected', ws),
            ssp = $('.set-point.selected', ws),
            now = new Date();
        spi.deselectDays();
        $('.set-point', ws).animate({
            opacity: 0.4
        }, 175).draggable('option', 'disabled', true);
        $('.add', b).css({
            display: 'none'
        });
        $('.cancel', b).css({
            display: 'inline-block'
        });
        $('.copy, .paste, .remove').animate({
            opacity: 0
        }, 175);
        spi.isAddMode = true;
        var wso = ws.offset(),
            wsol = wso.left,
            wsot = wso.top,
            nowSecs = Date.Nest.toDaySeconds(now),
            dow, sp;
        if (ssp.length) {
            dow = ssp.parents('.day').first().data('dow');
            spi.add.ghost = ssp.first().clone();
        } else {
            dow = (sd.length) ? sd.data('dow') : Date.Nest.getDay(now);
            var asd = $('div.day[data-dow="' + dow + '"]', v),
                dsp = $('.set-point', asd),
                cc = _.reduce(dsp, function (memo, sp) {
                    var mt = (memo && $(memo).data('time')) || -Infinity,
                        st = $(sp).data('time');
                    return ((st > mt) && (st <= nowSecs)) ? sp : memo;
                }, {});
            if (!cc.length) {
                cc = $('.values .set-point').first();
                dow = cc.parents('.day').data('dow');
                if (!cc.length) {
                    var m = spi.view.getModel(),
                        ttt = m.attributes.target_temperature_type;
                    sp = {
                        type: ttt.toUpperCase()
                    };
                    if (m.isModeRange()) {
                        _.extend(sp, {
                            'temp-min': 18,
                            'temp-max': 21
                        });
                    } else {
                        _.extend(sp, {
                            'temp': 20
                        });
                    }
                    cc = spi.createOrUpdateSetPoint(0, sp);
                }
            }
            spi.add.ghost = $(cc).clone();
        }
        var day = spi.getSchedule().attributes.days[dow],
            time = spi.add.ghost.data('time');
        sp = sp || _.find(day, function (s, index) {
            if (s.time === time) {
                return s;
            }
        });
        spi.clearStatus();
        spi.add.ghost.addClass('ghost').appendTo(ws);
        $('.time-label', spi.add.ghost).show().animate({
            opacity: 1
        }, 250);
        spi.add.mousemove = function (event) {
            var dh = DAY_SCHEDULE_HEIGHT,
                mx = $('.week-schedule').width() - SET_POINT_DIAMETER,
                x = event.pageX - wsol - SET_POINT_RADIUS,
                y = event.pageY - wsot - SET_POINT_DIAMETER,
                nx = Math.max(-SET_POINT_RADIUS, Math.min(x, mx)),
                ny = Math.max(0, Math.min(y, dh * 6)),
                top = Math.round(ny / DAY_SCHEDULE_HEIGHT) * DAY_SCHEDULE_HEIGHT,
                tlTop = ((6 - (top / DAY_SCHEDULE_HEIGHT)) * DAY_SCHEDULE_HEIGHT) + 3;
            spi.add.ghost.css({
                left: nx,
                top: top
            });
            spi.updateTimeLabel(timeFromPosition(nx, true), tlTop);
        };
        $(document.body).bind('mousemove', spi.add.mousemove);
        _.defer(function () {
            if (spi.isAddMode) {
                $(document.body).one('click', function (event) {
                    spi.add.click(event, sp);
                });
            }
        });
    };
    spi.add.click = function (event, setPoint) {
        var v = $('.values'),
            ws = $('.week-schedule', v),
            target = $(event.target),
            asp = target.parents('.week-schedule').length;
        if (!asp || !setPoint) {
            return spi.cancel();
        }
        var wso = ws.offset(),
            wsol = wso.left,
            dow = Math.floor((spi.add.ghost.position().top + (DAY_SCHEDULE_HEIGHT / 2)) / DAY_SCHEDULE_HEIGHT),
            dayNode = $('div.day[data-dow="' + dow + '"]', v),
            t = timeFromPosition(event.pageX - wsol - SET_POINT_RADIUS),
            data = _.extend({}, setPoint, {
                entry_type: ENTRY_TYPE_SETPOINT,
                time: t
            });
        spi.setTouchedFields(data);
        spi.addSetPoint(data, dow);
        spi.cancel();
        dayNode.empty();
        spi.update(spi.view, true);
        var node = $('div.set-point[data-time="' + t + '"]', dayNode);
        spi.selectSetPoint(node, data);
        node.children('.temp-controls').show();
    };
    spi.cancel = function () {
        if (!spi.add.ghost) {
            return;
        }
        var v = $('.values'),
            ws = $('.week-schedule', v).removeClass('add-mode'),
            b = $('.buttons', v);
        $('.set-point', ws).animate({
            opacity: 1
        }, 75).draggable('option', 'disabled', false);
        $('.add', b).css({
            display: 'inline-block'
        });
        $('.cancel', b).css({
            display: 'none'
        });
        $('.copy, .paste, .remove').animate({
            opacity: 1
        }, 75);
        $('.time-label', v).css({
            opacity: 0,
            top: 'auto'
        });
        $(document.body).unbind('mousemove', spi.add.mousemove);
        spi.add.ghost.remove();
        spi.add.ghost = null;
        spi.isAddMode = false;
    };
    spi.copy = function (event) {
        var v = $('.values'),
            sp = $('.day .set-point.selected', v),
            ws = $('.day.selected', v);
        if (sp.length) {
            spi.copySetPoint(sp);
        } else if (ws.length) {
            spi.copyDay(ws);
        } else {
            return;
        }
        $('.button.paste', v).removeClass('disabled');
    };
    spi.copySetPoint = function (node) {
        var day = spi.getSchedule().attributes.days[node.parent().data('dow')],
            time = node.data('time'),
            sp = _.find(day, function (s, index) {
                if (s.time === time && s.entry_type !== ENTRY_TYPE_CONTINUATION) {
                    return s;
                }
            });
        spi.clipboard = {
            mode: COPY_MODE_SET_POINT,
            data: $.extend(spi.getTouchedFields(), sp)
        };
        spi.setTouchedFields(spi.clipboard.data);
        var dl = $('.arrow-panel', node),
            bg = dl.css('background-color');
        dl.css('background-color', '#24A6DE').animate({
            'background-color': bg
        }, 95);
        N.log('Schedule.copySetPoint', spi.clipboard);
    };
    spi.copyDay = function (node) {
        var dow = node.data('dow'),
            day = spi.getSchedule().attributes.days[dow],
            nd = JSON.parse(JSON.stringify(day));
        _.each(nd, function (v, k) {
            spi.setTouchedFields(v);
        });
        spi.clipboard = {
            mode: COPY_MODE_DAY,
            data: nd
        };
        var dl = $('.values .label[data-dow="' + dow + '"]'),
            bg = dl.css('background-color');
        dl.css('background-color', '#24A6DE').animate({
            'background-color': bg
        }, 95, function () {
            dl.css('background-color', '');
        });
        N.log('Schedule.copyDay', spi.clipboard);
    };
    spi.paste = function () {
        var cb = spi.clipboard,
            dayNode = $('.values').find('.week-schedule .day.selected'),
            dow = dayNode.data('dow'),
            days = spi.getSchedule().attributes.days,
            mode = cb && cb.mode;
        if (!cb) {
            return;
        }
        if (mode === COPY_MODE_DAY) {
            days[dow] = $.extend({}, JSON.parse(JSON.stringify(cb.data)));
            spi.saveSchedule(days, EVENT_CLONE_DAY);
            dayNode.empty();
            spi.update(spi.view, true);
            spi.selectDay(dow);
        } else if (mode === COPY_MODE_SET_POINT) {
            var t = cb.data.time;
            spi.addSetPoint(cb.data, dow);
            dayNode.empty();
            spi.update(spi.view, true);
            spi.selectSetPoint($('.values div.day[data-dow="' + dow + '"] div.set-point[data-time="' + t + '"]'));
        }
        N.log('Schedule.paste', spi.getSchedule());
    };
    spi.hvacModeChange = function (data) {
        var m = spi.view.getModel();
        if (!(m.hasHeat() && m.hasAC())) {
            return;
        }
        spi.disableSchedule();
    };
    spi.disableSchedule = function () {
        var v = $('.values').first();
        if ($('.disabler', v).length) {
            return;
        }
        spi.clipboard = null;
        $('.button.paste', v).addClass('disabled');
        spi.clearStatus();
        var d = $('<div/>', {
            'class': 'disabler'
        }).appendTo(v);
        _.defer(function () {
            d.addClass('fadein');
        });
    };
    spi.enableSchedule = function () {
        $('.values .disabler').remove();
    };
    spi.remove = function (dayNode) {
        var dow = dayNode.parent().data('dow'),
            time = dayNode.data('time'),
            days = spi.getSchedule().attributes.days,
            day = _.toArray(days[dow]),
            cleaned = _.filter(day, function (sp) {
                if (sp.entry_type === ENTRY_TYPE_CONTINUATION) {
                    return true;
                }
                if (sp.time !== time) {
                    return true;
                }
            });
        cleaned.sort(timeSort);
        days[dow] = $.extend({}, cleaned);
        spi.saveSchedule(days, EVENT_REMOVE_SET_POINT);
        dayNode.remove();
        spi.clearStatus();
        spi.update(spi.view, true);
        $('.values .button.remove').addClass('disabled');
    };
    spi.clearStatus = function (animate) {
        var dfr = $.Deferred(),
            s = $('.values .controls .status'),
            clear = function () {
                s.empty().css({
                    opacity: 1
                });
                dfr.resolve();
            };
        if (animate) {
            s.stop().animate({
                opacity: 0
            }, 100, clear);
            return dfr.promise();
        } else {
            clear();
            return s;
        }
    };
    spi.resize = _.throttle(function (event) {
        spi.update(spi.view, true, true);
    }, 250);
    spi.addSetPoint = function (data, dow) {
        var days = spi.getSchedule().attributes.days,
            day = _.toArray(days[dow]),
            t = data.time,
            cleaned = _.filter(day, function (sp) {
                if (sp.entry_type === ENTRY_TYPE_CONTINUATION) {
                    return true;
                }
                if (Math.abs(sp.time - t) >= SECONDS_PER_HOUR) {
                    return true;
                }
            });
        cleaned.push($.extend(spi.getTouchedFields(), data));
        cleaned.sort(timeSort);
        days[dow] = $.extend({}, cleaned);
        spi.saveSchedule(days, EVENT_CLONE_SET_POINT);
    };
    spi.getTouchedFields = function () {
        var m = spi.view.getModel(),
            canTouch = m && m.hasCapabilityLevel(1.2);
        return canTouch ? {
            touched_at: Math.floor((new Date()).getTime() / 1000),
            touched_by: S.TOUCHED_BY,
            touched_id: S.TOUCHED_ID,
            touched_source: S.TOUCHED_SOURCE,
            touched_tzo: S.TIME_ZONE_OFFSET
        } : {};
    };
    spi.setTouchedFields = function (obj) {
        delete obj['touched_at'];
        delete obj['touched_by'];
        delete obj['touched_id'];
        delete obj['touched_source'];
        delete obj['touched_tzo'];
        _.extend(obj, spi.getTouchedFields());
    };
    spi.getSchedule = function () {
        return M.Cache.get('schedule_' + spi.view.id);
    };
    spi.saveSchedule = function (days, msg) {
        if (days && days[undefined]) {
            try {
                N.error('Illegal value: days[undefined]');
                window.console.trace();
                delete days[undefined];
            } catch (e) {}
        }
        var s = spi.getSchedule(),
            v = s.get('ver') || 1;
        s.set({
            'ver': Math.max(S.SCHEMA_VERSION, v)
        });
        s.setSchedule(days, msg);
    };
})(window.jQuery, window._, window.Globalize);
(function ($, _, $G, undefined) {
    'use strict';
    var N = window.Nest = window.Nest || {}, GA = N.GoogleAnalytics,
        L = N.Localization,
        _L = L.namespace('Console'),
        M = N.Models,
        C = N.Console = N.Console || {}, D = C.Details = C.Details || {}, K = C.Control = C.Control || {}, P = C.DetailsPanel,
        E = C.Energy = C.Energy || {}, epi;
    E.DEBUG_DATA = N.DEBUG && false;
    E.COLOR_GRAY_BORDER = '#8B8B8B';
    E.COLOR_EVT_COOLING = '#0082C8';
    E.COLOR_EVT_HEATING = '#E44700';
    E.CLASS_ENERGY = 'energy';
    E.MINIMUM_DAILY_MAX = 10800;
    E.TEMPLATE_MAIN = $('#_TMPL #energy_main').html();
    E.SECONDS_PER_15_MINS = 900;
    var ED = E.EnergyDay = function (day) {
        var d = day.day,
            dd = d.split('-');
        this.date = new Date(dd[0], --dd[1], dd[2]);
        this.id = ED.ID_DATA_VIZ_PREFIX + d;
        this.mode = ED.MODE.summary;
        this.element = null;
        this.update(day);
        ED.instances[d] = this;
        return this;
    };
    ED.className = 'EnergyDay';
    ED.instances = {};
    ED.container = null;
    ED.ID_DATA_VIZ_PREFIX = 'day_viz_';
    ED.LABEL_WIDTH = 150;
    ED.LOZENGE_RADIUS = 8;
    ED.WHODUNIT_RADIUS = 13;
    ED.TEMPLATE_DAY = $('#_TMPL #energy_day').html();
    ED.TEMPLATE_EVENT = $('#_TMPL #energy_event').html();
    ED.TEMPLATE_LOZENGE = $('#_TMPL #energy_lozenge').html();
    ED.TEMPLATE_TIMESCALE = $('#_TMPL #energy_timescale').html();
    ED.GLYPHS = {
        away: '\uE02F',
        auto: '\uE02F',
        off: _L('off').toUpperCase(),
        user: '<div class="user-icon"></div>',
        weather: '<div class="weather-icon"></div>',
        undefined: ''
    };
    ED.EVENT_TYPEMAP = {
        '0': 'heat',
        '1': 'cool',
        '2': 'range',
        '3': 'away',
        '4': 'away',
        '5': 'off'
    };
    ED.MODE = {
        summary: 'summary',
        detail: 'detail'
    };
    ED.WHODUNIT_TYPEMAP = {
        '0': 'user',
        '1': 'weather',
        '2': 'away',
        '3': 'auto',
        '-1': undefined
    };
    ED.init = function () {
        if (L.LANGUAGE !== 'en') {
            ED.GLYPHS['off'] = '\u2014';
        }
    };
    $(window).one('load', ED.init);
    ED.getDateFromID = function (id) {
        var dd = id.substr(ED.ID_DATA_VIZ_PREFIX.length).split('-');
        return new Date(dd[0], --dd[1], dd[2]);
    };
    ED.getDisplayTemperature = function (temp) {
        return epi.selectedView.getDisplayTemperature(temp, true);
    };
    ED.getInstanceByID = function (id) {
        return ED.instances[id.substr(ED.ID_DATA_VIZ_PREFIX.length)];
    };
    ED.getViewStyles = function (mode, evtType) {
        var isc = (evtType === 'cool');
        return ({
            summary: {
                backgroundColor: isc ? E.COLOR_EVT_COOLING : E.COLOR_EVT_HEATING,
                borderColor: isc ? E.COLOR_EVT_COOLING : E.COLOR_EVT_HEATING,
                eventOpacity: 0,
                height: 37,
                labelTop: 16,
                vizTop: 3
            },
            detail: {
                backgroundColor: 'white',
                borderColor: 'transparent',
                eventOpacity: 1,
                height: 56,
                labelTop: 26,
                vizTop: 22
            }
        })[mode];
    };
    ED.maxAvailableWidth = function (withLabel) {
        if (!ED.maxAvailableWidth.width) {
            ED.maxAvailableWidth.width = ($('.values').width() - ED.LABEL_WIDTH) - 15;
        }
        return ED.maxAvailableWidth.width - (withLabel ? 180 : 28);
    };
    ED.maxDailyUsage = function () {
        return Math.max(epi.data.recent_max_used, E.MINIMUM_DAILY_MAX);
    };
    ED.render = function () {
        if (!ED.container) {
            return N.log('EnergyDay.render: no container specified.');
        }
        _.each(ED.instances, function (v, k) {
            v.render();
        });
        ED.genMonthDividers();
    };
    ED.genMonthDividers = function () {
        var eds = _.toArray($('.values .energy-day-shell')),
            cmy = '';
        if (!eds.length) {
            return;
        }
        eds.reverse();
        var genHeaderID = function (txt) {
            return txt.toLowerCase().replace(/\s+/g, '_');
        }, addHeader = function (insertBefore, txt) {
            var id = genHeaderID(txt);
            if ($('.values #' + id).length) {
                return;
            }
            $('<div/>', {
                'class': 'month-header',
                html: txt,
                id: id
            }).insertBefore($(insertBefore));
        };
        for (var i = 0, n = eds.length; i < n; i++) {
            var ed = eds[i],
                d = ED.getDateFromID(ed.id),
                my = $G.culture().calendars.standard.months.names[d.getMonth()];
            if (my !== cmy) {
                if (cmy) {
                    addHeader(eds[i - 1], cmy);
                }
                cmy = my;
            }
        }
        addHeader(eds[n - 1], cmy);
    };
    ED.update = function (data, container) {
        _.each(data.days, function (day, i) {
            var exd = ED.instances[day.date];
            if (!exd) {
                exd = new ED(day);
            } else {
                exd.update(day);
            }
            return exd;
        });
        if (container) {
            ED.container = container;
        } else if (!ED.container) {
            return N.log('EnergyDay.update: no container specified; skipping render.');
        }
        ED.render();
    };
    var EDp = ED.prototype;
    EDp.className = ED.className;
    EDp.render = function () {
        if (!ED.container) {
            return N.log('EnergyDay.render: no container specified.');
        }
        var self = this,
            existingDiv = $('#' + this.id, ED.container).first(),
            width = ED.maxAvailableWidth(true),
            maxUsage = ED.maxDailyUsage(),
            div = this.genElement(width, maxUsage);
        if (existingDiv.length) {
            existingDiv.replaceWith(div);
        } else {
            var insertBefore = _.reduce($('.energy-day-shell', ED.container), function (memo, div) {
                var d = ED.getDateFromID(div.id);
                if (d < self.date) {
                    if (!memo || d > ED.getDateFromID(memo.id)) {
                        return div;
                    }
                }
                return memo;
            }, null);
            div[insertBefore ? 'insertBefore' : 'appendTo'](insertBefore || ED.container);
        }
    };
    EDp.genElement = function (width, maxUsage) {
        var div = $('<div/>', {
            'class': ['energy-day-shell', this.mode].join(' '),
            html: ED.TEMPLATE_DAY,
            id: this.id
        }),
            day = this,
            m = this.mode;
        this.element = div;
        this.genLabel();
        $('.day-viz', div).append(this.genEnergyDisplay(day, m), this.genTimescale());
        return div;
    };
    EDp.genLabel = function () {
        var elem = this.element,
            d = this.date,
            df = $G.culture().calendars.standard.patterns.M.toLowerCase(),
            nf = (df.indexOf('d') < df.indexOf('m')),
            formatted = $G.format(d, N.Localization.formats.get($G.culture().language, 'day-date-short'));
        $('.day-dow', elem).html(formatted.split(' ')[0]);
        $('.day-date', elem).html(formatted.split(' ')[1]);
        $('.leaf', elem).css('display', (this.leafs > 0) ? 'inline-block' : 'none');
        elem.toggleClass('unavailable', !! this.unavailable).toggleClass('reverse-date', nf);
    };
    EDp.genEnergyDisplay = function () {
        var m = epi.selectedView.getModel(),
            h2c = m.hasX2AC(),
            h2h = m.hasX2Heat() || m.hasAux(),
            htt = Number(this.heatTotal !== 0 && Math.max(this.heatTotal, (this.acTotal !== 0 ? 120 : 730))),
            act = Number(this.acTotal !== 0 && Math.max(this.acTotal, (this.heatTotal !== 0 ? 120 : 730))),
            htdf = htt - this.heatTotal,
            total = this.heatTotal + this.acTotal,
            time = Math.ceil(total / 900) / 4,
            noData = this.unavailable,
            noUsage = (time === 0),
            spd = 86400,
            diam = ED.LOZENGE_RADIUS * 2,
            width = (ED.maxAvailableWidth(false) - diam) - 2,
            idm = (this.mode === 'detail'),
            dmode = noUsage ? 'no-usage' : (htt ? 'heat' : 'cool'),
            vs = ED.getViewStyles(this.mode, dmode),
            div = $(ED.TEMPLATE_LOZENGE),
            loz = div.filter('.lozenge'),
            displayCycleType = function (t) {
                if (t & 2 || t & 4) {
                    return 'heat';
                } else if (t & 1) {
                    return h2h ? 'heat-light' : 'heat';
                } else if (t & 512) {
                    return 'cool';
                } else if (t & 256) {
                    return h2c ? 'cool-light' : 'cool';
                } else if (t & 65536) {
                    return 'fan';
                }
            };
        div.filter('.whodunits').append(this.genWhodunits(vs));
        if (noData) {
            time = _L('No usage info available');
        } else if (noUsage) {
            time = _L('No Usage');
        } else if (time < 1) {
            time = (time * 60) + ' ' + N.Localization.formats.get($G.culture().language, 'min-label-abbr');
        } else {
            time = Math.Nest.fraction(time) + ' ' + N.Localization.formats.get($G.culture().language, 'hour-label-abbr');
        }
        loz.addClass(dmode).append(_.reduce(this.hvacEvents, function (memo, v) {
            var secs = v.start,
                dur = v.duration;
            if (secs + dur > spd) {
                dur = spd - secs;
            }
            var pos = ED.LOZENGE_RADIUS + Math.round((secs / spd) * width),
                w = Math.max(Math.ceil((dur / spd) * width), 2),
                le = (secs === 0),
                re = (secs + dur >= spd - 1),
                dw = re ? (width - pos) + (2 * ED.LOZENGE_RADIUS) + 2 : w;
            if (le) {
                pos -= ED.LOZENGE_RADIUS;
                dw += ED.LOZENGE_RADIUS;
            }
            return memo + _.template(ED.TEMPLATE_EVENT, {
                cls: displayCycleType(v.type) + (le && !re ? ' left-end' : '') + (re && !le ? ' right-end' : '') + (le && re ? ' both-ends' : ''),
                left: pos,
                opacity: vs.eventOpacity,
                title: N.DEBUG ? JSON.stringify(v).replace(/"/g, '&quot;') : '',
                width: dw
            });
        }, '')).css({
            backgroundColor: noUsage ? 'transparent' : vs.backgroundColor,
            borderColor: noUsage ? 'transparent' : vs.borderColor,
            top: vs.vizTop + 'px',
            width: idm ? ED.maxAvailableWidth(false) : this.dayLozengeWidth(true)
        }).children('.time').html(time);
        if (htt && act && !noUsage && !noData) {
            loz.append($('<div/>', {
                'class': 'cool-overlay',
                css: {
                    width: Math.round(this.dayLozengeWidth(true) * ((act - htdf) / total))
                }
            }));
        }
        if (noData || (noUsage && !this.events.length)) {
            loz.addClass('unavailable');
        }
        if (this.whodunit) {
            var gd = this.wasGoodDay ? 'down' : 'up',
                id = 'who_' + this.whodunit + ((_.indexOf(['auto', 'away'], this.whodunit) > -1) ? '' : '_' + gd);
            div.filter('.who').addClass(this.whodunit).append(ED.GLYPHS[this.whodunit]).data('status', $('#_TMPL #' + id).html());
        } else {
            div.filter('.who').addClass('unknown');
        }
        return div;
    };
    EDp.genWhodunits = function (viewStyles) {
        var self = this,
            divs = $('<div/>'),
            spd = 86400,
            diam = ED.LOZENGE_RADIUS * 2,
            width = (ED.maxAvailableWidth(false) - diam) - 2,
            contShown = false;
        _.each(this.events, function (v, k) {
            var secs = v.start,
                pos = ED.LOZENGE_RADIUS + Math.round((secs / spd) * width) - ED.WHODUNIT_RADIUS + 2,
                type = ED.EVENT_TYPEMAP[v.type],
                isc = v.continuation,
                isr = (type === 'range'),
                issp = (type === 'heat' || type === 'cool' || isr),
                div = $('<div/>', {
                    'class': ['energy-whodunit', (isc ? 'continuation' : type)].join(' '),
                    css: {
                        left: pos,
                        opacity: viewStyles.eventOpacity
                    },
                    'data-status': '',
                    html: (function () {
                        if (isc) {
                            if (contShown) {
                                return '';
                            } else {
                                contShown = true;
                            }
                            if (type === 'away') {
                                return _L('away').toUpperCase();
                            } else if (type === 'off') {
                                return _L('off').toUpperCase();
                            } else if (isr) {
                                return ED.getDisplayTemperature(v.heat_temp) + '<em>' + C.BULLET_CHAR + '</em>' + ED.getDisplayTemperature(v.cool_temp);
                            }
                        } else if (!issp) {
                            return ED.GLYPHS[type];
                        }
                        return ED.getDisplayTemperature(v.cool_temp || v.heat_temp);
                    })(),
                    title: N.DEBUG ? JSON.stringify(v) : ''
                }),
                utcDate = (function (d, s) {
                    var ud = new Date(d);
                    return new Date(ud.getTime() + (secs * 1000));
                })(self.date, secs);
            var data = {
                daytime: String.Nest.ucFirst($G.format(utcDate, N.Localization.formats.get($G.culture().language, 'day-time-long'))),
                temp: ED.getDisplayTemperature(v.heat_temp || v.cool_temp),
                temp2: ED.getDisplayTemperature(v.cool_temp || 0)
            }, tt = $('#_TMPL #energy_blame_type_' + v.type).html().replace(/[\t\n\r]+/g, ''),
                bt = $('#_TMPL #energy_blame_text_' + (v.touched_by || 0)).html().replace(/[\t\n\r]+/g, ''),
                desc = _.template(tt, data);
            desc += ' ' + _.template(bt, {});
            desc.replace(/[\t\n\r]+/g, '');
            div.data('status', desc);
            if (isr && !isc) {
                div.append($('<div/>', {
                    'class': 'range-heat',
                    html: ED.getDisplayTemperature(v.heat_temp)
                }));
            }
            divs.append(div);
        });
        return divs;
    };
    EDp.genWhoAwayTime = function (divs, opacity, pos, width) {
        divs.append($('<div/>', {
            'class': 'away-time',
            css: {
                left: pos + 13,
                opacity: opacity,
                top: 32,
                width: width
            }
        }));
    };
    EDp.genTimescale = function () {
        var width = ED.maxAvailableWidth(false),
            div = $(ED.TEMPLATE_TIMESCALE).css({
                top: ED.getViewStyles(this.mode).vizTop,
                width: width
            });
        return div;
    };
    EDp.dayLozengeWidth = function (withLabel) {
        var total = this.heatTotal + this.acTotal,
            time = (Math.ceil(total / 900) / 4) * 3600,
            diam = (2 * ED.LOZENGE_RADIUS),
            max = ED.maxDailyUsage(),
            tw = ED.maxAvailableWidth(withLabel) - diam,
            pct = Math.min(time / max, 1),
            w = Math.ceil(pct * tw) + diam;
        return w;
    };
    EDp.click = _.throttle(function () {
        this.dayEvents = $('.energy-event, .energy-whodunit, .away-time', this.element);
        if (this.mode === ED.MODE.summary) {
            this.animateDetailMode(85);
        } else {
            this.animateSummaryMode(85);
        }
    }, 500);
    EDp.animateDetailMode = function (animationTime) {
        GA.trackEvent('Console', 'viewEnergyDetailMode');
        this.mode = ED.MODE.detail;
        var self = this,
            scrollTime = Math.ceil(animationTime * 1.2),
            v = $('.values.energy'),
            vh = v.height(),
            elem = this.element,
            lozenge = $('.lozenge', elem),
            time = $('.time', elem),
            timescale = $('.timescale', elem),
            who = $('.who', elem),
            vs = ED.getViewStyles(this.mode),
            ht = animationTime / 2;
        who.animate({
            opacity: 0
        }, ht);
        lozenge.add(lozenge.children('.cool-overlay')).each(function (k, v) {
            var e = $(v);
            e.data('bgimage', e.css('backgroundImage')).css({
                backgroundColor: vs.backgroundColor,
                backgroundImage: 'none',
                borderColor: vs.borderColor
            });
        });
        elem.removeClass(ED.MODE.summary);
        time.animate({
            opacity: 0
        }, animationTime, function () {
            time.hide();
            var d = ED.getViewStyles('detail').height - ED.getViewStyles('summary').height;
            $('.day-list', v).animate({
                scrollTop: '+=' + d
            }, scrollTime);
            lozenge.add(timescale).animate({
                top: vs.vizTop
            }, animationTime);
            lozenge.css({
                borderColor: E.COLOR_GRAY_BORDER
            }).animate({
                width: ED.maxAvailableWidth(false)
            }, animationTime, function () {
                self.dayEvents.css({
                    opacity: vs.eventOpacity
                });
                elem.addClass(ED.MODE.detail);
                who.css({
                    opacity: 1
                });
            }).parents('.energy-day').children('.day-label').animate({
                height: vs.height
            }, animationTime).children('div').animate({
                top: vs.labelTop
            }, animationTime);
        });
    };
    EDp.animateSummaryMode = function (animationTime) {
        GA.trackEvent('Console', 'viewEnergySummaryMode');
        this.mode = ED.MODE.summary;
        var self = this,
            scrollTime = Math.ceil(animationTime * 1.2),
            v = $('.values.energy'),
            elem = this.element,
            noUsage = ((this.heatTotal + this.acTotal) === 0),
            lozenge = $('.lozenge', elem),
            time = $('.time', elem),
            timescale = $('.timescale', elem),
            who = $('.who', elem),
            vs = ED.getViewStyles(this.mode, this.heatTotal ? 'heat' : 'cool');
        who.hide();
        elem.removeClass(ED.MODE.detail);
        this.dayEvents.animate({
            opacity: vs.eventOpacity
        }, animationTime, _.once(function () {
            var d = ED.getViewStyles('detail').height - ED.getViewStyles('summary').height;
            $('.day-list', v).animate({
                scrollTop: '-=' + d
            }, scrollTime);
            lozenge.add(timescale).animate({
                top: vs.vizTop
            }, animationTime);
            lozenge.add(lozenge.children('.cool-overlay')).each(function (k, v) {
                var e = $(v);
                e.css('backgroundImage', e.data('bgimage'));
            });
            lozenge.css({
                backgroundColor: noUsage ? 'transparent' : vs.backgroundColor,
                borderColor: noUsage ? 'transparent' : vs.borderColor
            }).animate({
                width: self.dayLozengeWidth(true)
            }, animationTime, function () {
                time.add(who).show().animate({
                    opacity: 1
                }, animationTime, function () {
                    elem.addClass(ED.MODE.summary);
                });
            }).parents('.energy-day').children('.day-label').animate({
                height: vs.height
            }, animationTime).children('div').animate({
                top: vs.labelTop
            }, animationTime);
        }));
    };
    EDp.update = function (day) {
        this.hvacEvents = day.cycles || [];
        this.acTotal = this.computeACTotal(day);
        this.heatTotal = this.computeHeatTotal(day);
        this.leafs = day.leafs || 0;
        this.wasGoodDay = day.usage_over_avg < 0;
        this.whodunit = ED.WHODUNIT_TYPEMAP[day.whodunit];
        this.events = day.events || [];
        this.unavailable = day.unavailable;
        this._data = day;
    };
    EDp.computeACTotal = function (day) {
        return (day && day.total_cooling_time) || _.reduce(this.hvacEvents, function (memo, e) {
            var t = e.type,
                hm = ((t & 256) || (t & 512)) ? e.duration : 0;
            return memo + hm;
        }, 0);
    };
    EDp.computeHeatTotal = function (day) {
        return (day && day.total_heating_time) || _.reduce(this.hvacEvents, function (memo, e) {
            var t = e.type,
                hm = ((t & 1) || (t & 2) || (t & 4)) ? e.duration : 0;
            return memo + hm;
        }, 0);
    };
    epi = E.DetailsPanel = new P({
        name: 'energy'
    });
    epi.enter = function (view, dfr) {
        var v = $('.values').css({
            opacity: 0
        });
        epi.render(view, true);
        v.animate({
            opacity: 1
        }, P.enterFade, function () {
            if (dfr) {
                dfr.resolve();
            }
        });
        GA.trackEvent('Console', 'viewEnergyHistory');
    };
    epi.update = function (view, forceUpdate) {};
    epi.viewChange = function (oldView, newView) {
        epi.reset();
        this.render(newView);
        GA.trackEvent('Console', 'viewEnergyHistory');
    };
    epi.render = function (view) {
        epi.reset();
        epi.selectedView = view;
        var v = $('.values'),
            m = view.getModel();
        if (!m.hasCapabilityLevel(1.2)) {
            v.html($('#_TMPL #energy_incompatible').html());
            return;
        } else if (!m.hasEnergyData() && !E.DEBUG_DATA) {
            v.html($('#_TMPL #energy_empty').html());
            return;
        }
        epi.data = _.clone(E.DEBUG_DATA ? epi.__DATA : m.attributes.energy_latest);
        v.html(E.TEMPLATE_MAIN).addClass(E.CLASS_ENERGY);
        var dl = $('.values .day-list').first();
        ED.update(epi.data, dl);
        v.unbind('click', epi.click).bind('click', epi.click).unbind('mouseover', epi.mouseover).bind('mouseover', epi.mouseover);
        $(window).unbind('resize', epi.resize).bind('resize', epi.resize);
    };
    epi.exit = function (view, dfr) {
        var v = $('.values');
        $(window).unbind('resize', epi.resize);
        v.unbind('mouseover', epi.mouseover);
        v.animate({
            opacity: 0
        }, P.exitFade, function () {
            epi.reset();
            v.empty().removeClass(E.CLASS_ENERGY).css({
                opacity: 1
            }).show();
            if (dfr) {
                dfr.resolve();
            }
        });
    };
    epi.reset = function () {
        ED.maxAvailableWidth.width = null;
        ED.instances = {};
    };
    epi.click = function (event) {
        var t = $(event.target).parents().andSelf().filter('.energy-day-shell'),
            du = $(event.target).parents().andSelf().filter('.unavailable');
        if (!t.length || du.length) {
            return;
        }
        ED.getInstanceByID(t.prop('id')).click();
    };
    epi.mouseover = _.throttle(function (event) {
        var st = $('.values .status'),
            targets = $(event.target).parents().andSelf(),
            t = targets.filter('.energy-whodunit, .who'),
            clear = function () {
                window.clearTimeout(epi.mouseover.statusTimeout);
            };
        if (!t.length || t.hasClass('continuation')) {
            return;
        }
        epi.mouseover.active = true;
        clear();
        if (t.hasClass('who')) {
            GA.trackEvent('Console', 'viewEnergyWhodunitTooltip');
        } else {
            if (targets.filter('.summary').length) {
                return;
            }
            GA.trackEvent('Console', 'viewEnergyBlameTooltip');
        }
        var stc = $(t).clone();
        st.html(stc).append($('<div/>', {
            'class': 'text',
            html: t.data('status')
        }));
        if (st.css('bottom') !== 0) {
            st.show().animate({
                bottom: 0
            }, 75, clear.bind(this));
            t.add(st).one('mouseout', function () {
                epi.mouseover.active = false;
                N.wait(125).then(function () {
                    if (!epi.mouseover.active) {
                        epi.mouseover.statusTimeout = window.setTimeout(function () {
                            if (!epi.mouseover.active) {
                                st.animate({
                                    bottom: -40
                                }, 185, function () {
                                    st.hide();
                                });
                            }
                        }, 1200);
                    }
                });
            });
        }
        var whod = $('.energy-whodunit', st);
        if (whod.length) {
            $('.text', st).css({
                left: '-=7/12em'
            });
        }
    }, 100);
    epi.resize = _.throttle(function (event) {
        epi.render(epi.selectedView);
    }, 250);
    if (E.DEBUG_DATA) {
        N.warn('CAUTION - ENERGY DEBUG DATA ENABLED');
    }
})(window.jQuery, window._, window.Globalize);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        GA = N.GoogleAnalytics,
        C = N.Console = N.Console || {}, M = N.Models = N.Models || {}, D = C.Details = C.Details || {}, P = C.DetailsPanel;
    if (N.DEBUG === true) {
        N.DEBUG = function () {
            var self = N.DEBUG;
            self.deviceConnect = function () {
                var vw = C.getSelectedView();
                if (vw.className === 'structure') {
                    _.each(vw.getModel().devices.models, function (v, k) {
                        N.Transport.Device.pulse(v.id);
                    });
                } else {
                    N.Transport.Device.pulse(vw.id);
                }
            };
            self.nudgeTimeToTarget = function () {
                var vw = C.getSelectedView(),
                    m = M.Cache.get(vw.id),
                    now = new Date(),
                    ttt = new Date(m.attributes.time_to_target * 1000);
                if (ttt < now) {
                    ttt = now;
                }
                m.attributes.time_to_target = Math.floor((ttt.getTime() + 600000) / 1000);
                C.Thermostat.notifyUpdate('', vw);
            };
            self.runRemoveDeviceAnimation = function () {
                var vw = C.getSelectedView();
                if (vw.className !== 'device') {
                    window.alert('(Does that house really look like a device to you?)');
                }
                C.selectView(vw.getStructureID()).then(function () {
                    C.removeView(vw.id);
                });
            };
            self.showAutoPairingDialog = function () {
                var vw = C.getSelectedView(),
                    id = (vw.getStructureID ? vw.getStructureID() : vw.id).substr(1);
                $(window).trigger(C.Events.REQUEST_AUTO_PAIRING, {
                    dialog_data: true,
                    structure_id: id
                });
            };
            self.triggerCompressorLockout = function () {
                var vw = C.getSelectedView(),
                    m = M.Cache.get(vw.id);
                m.attributes.compressor_lockout_timeout = Math.floor(new Date((new Date()).getTime() + 180000) / 1000);
                C.Thermostat.notifyUpdate('', vw);
            };
            for (var i = 0, funcs = [], keys = _.keys(self), k = keys[0], v = self[k]; i < keys.length; i++, k = keys[i], v = self[k]) {
                if (!self.hasOwnProperty(k) || typeof v !== 'function') {
                    continue;
                }
                funcs.push(k);
            }
            funcs.sort();
            return funcs;
        };
    }
    var ddp = D.Debug = new P({
        name: 'debug'
    });
    ddp.enter = function (view, dfr) {
        GA.trackEvent('Console', 'view' + String.Nest.ucFirst(view.className) + 'Debug');
        P.prototype.enter.apply(this, [view, dfr]);
    };
    ddp.update = function (view) {
        this.selectedView = view;
        var v = $('.values'),
            attrs = _.clone(view.getModel().attributes);
        if (view.weather) {
            attrs.weather = view.weather;
        }
        var keys = _.keys(attrs);
        keys.sort();
        for (var i = 0, n = keys.length; i < n; i++) {
            var key = keys[i],
                attr = attrs[key],
                cls = ddp._classify(key);
            if (!cls || (attr !== null && typeof attr === 'object')) {
                continue;
            } else if (key === 'status') {
                continue;
            } else if (key === 'weather') {
                attr = '<span style="color:#0CC;">' + $.toJSON(attr) + '</span>';
            }
            var fld = $('.' + cls, v);
            if (fld.length) {
                fld.html(String(attr));
            } else {
                return ddp._draw(view);
            }
        }
        $('.timestamp', v).html(String(new Date()));
    };
    ddp.editValue = function (field) {
        var model = this.selectedView.getModel(),
            value = model.getField(field);
        var newValue = window.prompt('New value for ' + field + ':', value) || '';
        if (newValue === '') {
            return;
        } else if (newValue === 'true' || newValue === 'false') {
            newValue = Boolean(newValue);
        } else if (String(Number(newValue)) === newValue) {
            newValue = Number(newValue);
        }
        model.setField(field, newValue, 'Console.manualDebugPropertyEdit', true);
    };
    ddp._draw = function (view) {
        this.selectedView = view;
        var v = $('.values'),
            attrs = _.clone(view.model.attributes),
            html = '';
        if (view.weather) {
            attrs.weather = view.weather;
        }
        var keys = _.keys(attrs);
        keys.sort();
        if (N.BUILD_INFO) {
            html += '<div class="build-date">Build: ' + N.BUILD_INFO + '</div>';
        }
        html += ['<div id="debug_tools"><select>', _.reduce(N.DEBUG(), function (memo, func) {
            var fw = func.split(/([A-Z])/g),
                i = 0,
                mname = _.reduce(fw, function (m, n) {
                    return m + (i++ ? ((i % 2) ? n : (' ' + n)) : String.Nest.ucFirst(n));
                }, '');
            return memo + '<option value="' + func + '">' + mname + '</option>\n';
        }, ''), '</select>', '<button onclick="Nest.DEBUG[$(\'#debug_tools select\').val()]()" title="Invoke Function">( )</button></div>'].join('');
        html += '<div class="debug" id="tetsuo">';
        html += '<span style="color:#CC0;" class="timestamp">' + new Date() + '</span><br>\n';
        _.each(keys, function (e) {
            var v = attrs[e],
                cls = ddp._classify(e);
            if (e === 'weather') {
                v = '<span style="color:#0CC;">' + $.toJSON(v) + '</span>';
            } else if (v !== null && typeof v === 'object') {
                return;
            } else if (e === 'status') {
                return;
            } else if (e === 'manual_schedule') {
                v = '<span onclick="$(\'#_man_sch\').show();$(this).hide()">...</span><span id="_man_sch" class="' + cls + '" style="color:#0CC;display:none;">' + v + '</span>';
                cls = '';
            } else {
                e = '<span onclick="Nest.Console.Details.Debug.editValue(\'' + e + '\')">' + e + '</span>';
            }
            html += e + ': <span class="' + cls + '">' + v + '</span><br>\n';
        });
        v.html(html + '</div>');
        $('.remove-offline', v).bind('click', ddp._removeOfflineWarnings);
        if (!$('#new_window', v).length) {
            $('<img/>', {
                css: {
                    position: 'absolute',
                    right: '45px',
                    top: '22px',
                    zIndex: '5000'
                },
                id: 'new_window',
                height: 24,
                title: 'Open Info in New Window',
                width: 27,
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAYCAIAAACEIhGsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZJJREFUeNqsVdF2wiAMJbGzp7/l49q6+aXOqXvsD/V9vpEBgTQgHj1nzQMNabgkNwFgmiazqqBZWxr+7Ha7/2Nxuo3Mu66DpBMRAIjuRjcVIxkCA2xncfbf2y2L0eevCSDnlHCJ10Sj/AUyaf6AR96fR0SEJKzzL+0DKQTIcRsVF4eTRmMul+tT7oa+Jx8y1hAjR8vmmqmHklZVEIE8ObEsZkmkf+91rUS5/lwDa1js3ahiRNfz+ezG/biPHk1TlDWDCAVUAWRZe9DFGxa7RmEfQJA4xOG+e1AXThRn1ylLb1ZXFTFu/ArilnIQG1bIIPtz/1HwCcVlFNQb5JUx1uUSwuHflpXv07FWYbDWhm7lvWqIGPkF35iGMLnJ/joWYRwsBXu1ezAtgMj9MPRFfeV0C7NvrhMcOlZrnfhiOX6dijQ1WYfPw5Pb7P54WrKZY358Qvf4MsU+q2aNENP5GMciuns22+02XEFLWWtZh75zK9q2femChTLwyk0BDPq6QIWxBXGe5zXfmRVfxPXfwj8BBgCBn8YqeMmI5AAAAABJRU5ErkJggg=='
            }).appendTo(v).bind('click', function () {
                var w = window.open(),
                    d = w.document;
                d.open();
                d.write('<html><title>' + view.id.substr(1) + '</title><body style="background-color: black; color: #0C0; font-family: Inconsolata, \'Courier New\', monospace; font-size: 13px; line-height: 14px;">' + $('.debug', v).html().replace(/ ?onclick="[^"]*"/g, '') + '</body></html>');
                d.close();
            });
        }
    };
    ddp._classify = function (s) {
        if (s.indexOf('$') === 0) {
            return '';
        }
        return s.replace(/[\s_]/g, '-').toLowerCase();
    };
    if (N.DEBUG) {
        var TS = N.Transport = N.DEBUG.Transport = {}, DV = TS.Device = {}, inputsToArgs = function (arr) {
            var args = {};
            if (arr.length === 1) {
                args = arr[0];
            } else if (arr.length === 2) {
                var key = arr[0],
                    data = arr[1];
                args[(key.indexOf('.') > 0) ? 'bucket' : 'id'] = key;
                args.data = data;
            }
            return args;
        };
        TS.put = function () {
            var args = inputsToArgs(arguments),
                props = _.extend({
                    bucket: null,
                    callback: N.log.bind(N),
                    data: null,
                    device: false,
                    id: null,
                    type: 'device'
                }, args);
            if (props.id.indexOf('d') === 0) {
                props.id = props.id.substr(1);
            }
            var bucket = props.bucket || (props.id && [props.type, props.id].join('.'));
            if (!bucket) {
                return N.error('Transport.Device: no bucket for PUT', props, _.toArray(arguments));
            }
            var success = function (data, status, req) {
                props.callback(_.extend({
                    error: false,
                    status: req.status
                }, JSON.parse(data)));
            }, error = function (req, status, errMsg) {
                props.callback(_.extend({
                    error: true,
                    status: req.status
                }, JSON.parse(req.responseText)));
            }, restArgs = [bucket];
            if (props.device) {
                restArgs.unshift('device');
            }
            $.ajax({
                type: 'POST',
                url: '/dev/cz_put/' + restArgs.join('/') + '?t=' + (new Date()).getTime(),
                data: {
                    data: JSON.stringify(props.data)
                },
                success: success,
                error: error
            });
            return N.log('Transport: PUT' + (props.device ? ' (as device)' : ''), bucket, props.data);
        };
        DV.put = function () {
            var args = inputsToArgs(arguments);
            args.device = true;
            TS.put(args);
        };
        DV.pulse = function (deviceID) {
            if (deviceID.indexOf('d') !== 0) {
                deviceID = 'd' + deviceID;
            }
            var d = N.Models.Cache.get(deviceID);
            DV.put({
                data: {
                    temperature_scale: d.get('temperature_scale') || 'F'
                },
                device: true,
                id: deviceID
            });
        };
    }
})(window.jQuery, window._);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        C = N.Console;
    var JSONP = N.JSONP = {
        REQUEST_TIMEOUT_EVENT: 'nest-jsonp-request-timeout-event',
        timeout: 10,
        timeoutLow: Infinity,
        timeoutHigh: 0,
        timeoutMin: 10,
        timeoutMax: 60 * 2,
        timeoutProbes: 0,
        timeoutAdapting: true,
        ajaxDefaults: {
            cache: true,
            jsonp: 'jsonp',
            crossDomain: true,
            dataType: 'jsonp'
        },
        getRequestID: function () {
            if (!this.getRequestID._id) {
                this.getRequestID._id = 0;
            }
            return ++this.getRequestID._id + '_';
        },
        get: function (options) {
            var id = this.getRequestID();
            var success = options.success;
            options.success = function (data) {
                JSONP.success(data, id, success);
            };
            this.setTimeout(id, options);
            options.url = C.CZ_PREFIX + options.url;
            if (!options.data) {
                options.data = {};
            }
            if (options.method && options.method !== 'GET') {
                options.data._method = options.method;
                delete options.method;
            }
            options = _.extend(options, this.ajaxDefaults);
            options.data = _.extend(options.data, options.headers);
            delete options.headers;
            _.defer(function () {
                N.log('JSONP.get: id=' + id, options.url, options.data);
            });
            $.ajax(options);
        },
        post: function (options) {
            var id = this.getRequestID();
            var success = options.success;
            options.success = function (data) {
                JSONP.success(data, id, success);
            };
            options.data.jsonp = id;
            this.setTimeout(id, options);
            var url = C.CZ_PREFIX + 'jsonp';
            var doc = document;
            var iframe = doc.createElement('iframe');
            iframe.setAttribute('src', 'javascript:""');
            iframe.setAttribute('id', id);
            iframe.setAttribute('name', id);
            iframe.setAttribute('style', 'width:0;height:0;border:none;');
            doc.body.appendChild(iframe);
            var form = doc.createElement('form');
            form.method = 'POST';
            form.action = url;
            form.target = id;
            var input = doc.createElement('input');
            input.setAttribute('name', 'payload');
            input.setAttribute('value', JSON.stringify(options.data));
            form.appendChild(input);
            doc.body.appendChild(form);
            _.defer(function () {
                N.log('JSONP.post: id=' + id, url, options.data);
            });
            form.submit();
            doc.body.removeChild(form);
        },
        announceResponse: function (requestID, responseData) {
            var callback = this.callbacks[requestID];
            if (callback) {
                callback.success(responseData, requestID);
            }
        },
        success: function (data, callbackid, success) {
            var callbacks = this.callbacks,
                callback = callbacks[callbackid];
            this.clearCallback(callbackid);
            if (callback && callback.doupdate && !data.payload) {
                this.updateTimeout(false);
            }
            if (callback && success) {
                success(data);
                N.log('JSONP.success: id=' + callbackid, data);
            }
        },
        getTimeout: function () {
            return this.timeout;
        },
        setTimeout: function (id, options) {
            var msec = Math.max(options.timeout || (this.timeout * 1000), this.backoffInterval);
            this.callbacks[id] = {
                success: options.success,
                error: options.error,
                doupdate: (!options.timeout),
                tID: setTimeout(function () {
                    JSONP.announceTimeout(id);
                }, msec)
            };
        },
        updateTimeout: function (timedout) {
            if (timedout) {
                if (this.timeoutAdapting) {
                    this.timeoutProbes++;
                    if (this.timeoutHigh === this.timeout) {
                        this.timeoutHigh--;
                    } else {
                        this.timeoutHigh = this.timeout;
                    }
                }
                if (this.timeoutLow >= this.timeout) {
                    if ((this.timeout = Math.round(this.timeout / 2)) > this.timeoutMin) {
                        this.timeoutAdapting = true;
                        return;
                    } else {
                        this.timeoutLow = this.timeoutHigh = this.timeout = this.timeoutMin;
                    }
                }
            } else {
                if (this.timeoutAdapting) {
                    this.timeoutProbes++;
                    if (this.timeoutLow === this.timeout) {
                        this.timeoutLow++;
                    } else {
                        this.timeoutLow = this.timeout;
                    }
                }
                if (this.timeoutHigh <= this.timeout) {
                    if ((this.timeout = Math.round(this.timeout * 2)) < this.timeoutMax) {
                        this.timeoutAdapting = true;
                        return;
                    } else {
                        this.timeoutLow = this.timeoutHigh = this.timeout = this.timeoutMax;
                    }
                }
            }
            this.timeout = Math.round((this.timeoutHigh + this.timeoutLow) / 2);
            if (this.timeoutAdapting && this.timeoutHigh === this.timeoutLow) {
                this.timeoutAdapting = false;
                $.ajax({
                    url: C.API_PREFIX + '/log',
                    type: 'POST',
                    data: {
                        probes: this.timeoutProbes,
                        timeout: this.timeout,
                        min: this.timeoutMin,
                        max: this.timeoutMax,
                        low: this.timeoutLow,
                        high: this.timeoutHigh
                    }
                });
            }
        },
        announceTimeout: function (callbackid) {
            try {
                var callbacks = this.callbacks,
                    callback = callbacks[callbackid];
                this.clearCallback(callbackid);
                if (callback.doupdate) {
                    this.updateTimeout(true);
                }
                if (callback && callback.error) {
                    callback.error();
                }
            } catch (e) {
                N.error(e);
            } finally {
                $(window).trigger(JSONP.REQUEST_TIMEOUT_EVENT);
            }
        },
        backoffInterval: 0,
        resetBackoff: function (callback) {
            window.clearTimeout(this.resetBackoff._id);
            this.resetBackoff._id = window.setTimeout(callback, this.backoffInterval);
        },
        incrementBackoff: function () {
            var min = 1000,
                max = 120000;
            this.backoffInterval = Number.Nest.constrain(this.backoffInterval, min, max);
        },
        clearBackoff: function () {
            this.backoffInterval = 0;
        },
        callbacks: {},
        clearCallback: function (callbackid) {
            var callbacks = this.callbacks,
                callback = callbacks[callbackid];
            delete callbacks[callbackid];
            if (callback) {
                clearTimeout(callback.tID);
            }
            N.wait(250).then(function () {
                $('#' + callbackid).remove();
            });
        },
        clearCallbacks: function () {
            var self = this;
            _.each(this.callbacks, function (item, callbackid) {
                self.clearCallback(callbackid);
            });
            $('script').remove();
            this.callbacks = {};
        }
    };
})(window.jQuery, window._);
(function ($, _, undefined) {
    'use strict';
    var N = window.Nest,
        M = N.Models = N.Models || {}, C = N.Console = N.Console || {};
    var NET = N.JSONP;
    var CZ = N.CZ = {
        authError: 'nest-cz-auth-error',
        deviceTrackEvent: 'nest-cz-device-connect',
        initialLoadEvent: 'nest-cz-initial-load',
        networkError: 'nest-cz-network-error',
        newDataEvent: 'nest-cz-new-data',
        objectAddEvent: 'nest-cz-object-add',
        objectRemoveEvent: 'nest-cz-object-remove',
        subscribeDoneEvent: 'nest-cz-subscribe-done',
        transportURLChanged: 'nest-cz-transport-url-changed',
        updateDoneEvent: 'nest-cz-update-done',
        sessionID: (new Date()).getTime() + '' + (Math.random() * 100000000),
        timestampOffset: 0,
        subscriptionActive: false,
        bucketFields: {
            user: 'structures',
            structure: 'devices'
        },
        models: null,
        timestamps: {},
        init: function () {
            $(window).bind(NET.REQUEST_TIMEOUT_EVENT, function () {
                CZ.subscriptionActive = false;
            });
            CZ.init = $.noop;
        },
        arrayToObj: function (arr) {
            var out = {};
            _.each(arr, function (val, i) {
                out[val.id] = val;
            });
            return out;
        },
        getModel: function () {
            return this.models;
        },
        mapStructures: function (debug) {
            var model = this.models;
            if (!model) {
                return [];
            }
            var warnings = [];
            var structures = _.map(model.structure, function (structure, structureid) {
                var newstructure = _.extend({}, structure);
                newstructure.id = structureid;
                var devices = _.map(structure.devices, function (device) {
                    var deviceid = device.split('.')[1];
                    if (debug) {
                        var requiredModels = ['device', 'energy_latest', 'shared', 'schedule', 'track', 'user', 'user_settings'];
                        _.each(requiredModels, function (v, k) {
                            if (!model[v]) {
                                var msg = 'missing ' + v + ' bucket';
                                N.error(msg);
                                warnings.push(msg);
                            }
                        });
                    }
                    var devicedata = (model.device && model.device[deviceid]);
                    var shareddata = (model.shared && model.shared[deviceid]);
                    var track = (model.track && model.track[deviceid]);
                    var keys = _.extend(devicedata, shareddata, track);
                    keys['manual_schedule'] = JSON.stringify(model.schedule && model.schedule[deviceid]);
                    keys['energy_latest'] = model.energy_latest && model.energy_latest[deviceid];
                    keys.id = deviceid;
                    return keys;
                });
                if (debug) {
                    devices = CZ.arrayToObj(devices);
                }
                devices.sort(N.sortByCreationTime);
                newstructure.devices = devices;
                newstructure.display_location = structure.location || '';
                return newstructure;
            });
            if (debug) {
                structures = CZ.arrayToObj(structures);
                if (warnings.length) {
                    structures.warnings = warnings;
                }
            }
            structures.sort(N.sortByCreationTime);
            return structures;
        },
        resetBackoff: function (callback) {
            NET.resetBackoff(callback);
        },
        incrementBackoff: function () {
            NET.incrementBackoff();
        },
        clearBackoff: function () {
            NET.clearBackoff();
        },
        clearModel: function () {
            this.models = null;
        },
        buckets: {},
        findBucketIDs: function () {
            var model = CZ.models;
            var buckets = CZ.buckets = {};
            buckets['user.' + C.USER_ID] = CZ.getSubscribeData('user', C.USER_ID);
            buckets['user_alert_dialog.' + C.USER_ID] = CZ.getSubscribeData('user_alert_dialog', C.USER_ID);
            buckets['user_settings.' + C.USER_ID] = CZ.getSubscribeData('user_settings', C.USER_ID);
            var structurekeys = model.user[C.USER_ID].structures;
            _.each(structurekeys, function (structurekey) {
                var structureid = structurekey.split('.')[1];
                if (!model.structure[structureid]) {
                    return;
                }
                var devicekeys = model.structure[structureid].devices;
                buckets[structurekey] = CZ.getSubscribeData('structure', structureid);
                _.each(devicekeys, function (devicekey) {
                    var deviceid = devicekey.split('.')[1];
                    buckets[devicekey] = CZ.getSubscribeData('device', deviceid);
                    buckets['shared.' + deviceid] = CZ.getSubscribeData('shared', deviceid);
                    buckets['schedule.' + deviceid] = CZ.getSubscribeData('schedule', deviceid);
                    buckets['track.' + deviceid] = CZ.getSubscribeData('track', deviceid);
                    if (!model['energy_latest']) {
                        model.energy_latest = {};
                    }
                    if (!model.energy_latest[deviceid]) {
                        model.energy_latest[deviceid] = {};
                    }
                    buckets['energy_latest.' + deviceid] = CZ.getSubscribeData('energy_latest', deviceid);
                });
            });
        },
        getSubscribeData: function (type, id) {
            var bucket = CZ.models[type] && CZ.models[type][id];
            if (bucket) {
                return {
                    key: type + '.' + id,
                    version: bucket.$version,
                    timestamp: bucket.$timestamp
                };
            } else {
                return {
                    key: type + '.' + id
                };
            }
        },
        updateSubscribeData: function (headers) {
            var bucket = headers['X-nl-skv-key'];
            if (!bucket) {
                return;
            }
            var timestamp = headers['X-nl-skv-timestamp'],
                version = headers['X-nl-skv-version'];
            this.buckets[bucket] = {
                key: bucket,
                timestamp: timestamp,
                version: version
            };
        },
        userDialogResponse: function (data) {
            $.ajax({
                url: C.API_PREFIX + '/dialog',
                type: 'POST',
                data: data,
                success: function (data) {}
            });
        },
        notifyAddRemove: function (oldset, newset) {
            _.each(_.difference(oldset, newset), function (name) {
                var typeid = name.split('.');
                $(window).trigger(CZ.objectRemoveEvent, {
                    type: typeid[0],
                    id: typeid[1]
                });
            });
            _.each(_.difference(newset, oldset), function (name) {
                var typeid = name.split('.');
                $(window).trigger(CZ.objectAddEvent, {
                    type: typeid[0],
                    id: typeid[1]
                });
            });
        },
        pendingNotifications: [],
        updateAuthority: function (olduri, newuri) {
            var authoritypattern = /\/\/[^\/?#]*/,
                newauthority = newuri.match(authoritypattern);
            return newauthority ? olduri.replace(authoritypattern, newauthority) : olduri;
        },
        handleRedirect: function (data) {
            if (data.status === 302) {
                C.CZ_PREFIX = CZ.updateAuthority(C.CZ_PREFIX, data.headers['Location']);
                return true;
            }
        },
        checkConnectivity: function () {
            CZ.incrementBackoff();
            var request = {
                url: '/user/' + C.USER_ID + '/service_urls',
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data && data.urls && data.urls.transport_url) {
                        var oldurl = C.CZ_PREFIX;
                        var newurl = CZ.updateAuthority(oldurl, data.urls.transport_url);
                        if (oldurl !== newurl) {
                            N.log('Connectivity: Transport URL Changed: ' + oldurl + ' -> ' + newurl);
                            $(window).trigger(CZ.transportURLChanged, newurl);
                        }
                    } else {
                        N.error('Connectivity: Unknown response: ' + JSON.stringify(data));
                        $(window).trigger(CZ.networkError, data);
                    }
                },
                error: function (xhr, status, error) {
                    N.error('Connectivity: Unknown error: ' + JSON.stringify(xhr) + ' ' + (status || error));
                    $(window).trigger(CZ.networkError, xhr);
                },
                statusCode: {
                    401: function (xhr, status, error) {
                        N.warn('Connectivity: Authorization error: ' + JSON.stringify(xhr) + ' ' + (status || error));
                        $(window).trigger(CZ.authError, xhr);
                    }
                }
            };
            var token = CZ.getToken();
            if (token) {
                request.headers = {
                    'Authorization': 'Basic ' + token
                };
            }
            $.ajax(request);
        },
        editList: null,
        readStructures: function (success, error) {
            var callback, request;
            if (!this.models) {
                var url = 'web/user.' + C.USER_ID;
                callback = function (data) {
                    try {
                        CZ.updateTimestampOffset(data);
                        if (CZ.handleRedirect(data)) {
                            return;
                        }
                        if (data.status === 200) {
                            if (data.payload && (!data.payload.cmd)) {
                                CZ.clearBackoff();
                                CZ.models = data.payload;
                                CZ.findBucketIDs();
                                if (success) {
                                    success(CZ.mapStructures());
                                }
                            } else {
                                CZ.incrementBackoff();
                                if (error) {
                                    error(data);
                                }
                            }
                        } else {
                            N.warn('Error loading: ', JSON.stringify(data), 'for request', url);
                            CZ.checkConnectivity();
                        }
                    } catch (e) {
                        N.error(e);
                    } finally {
                        if (CZ.models) {
                            $(window).trigger(CZ.initialLoadEvent);
                            $(window).trigger(CZ.newDataEvent);
                            var ua = (CZ.models.user_alert_dialog) ? CZ.models.user_alert_dialog[C.USER_ID] : null;
                            if (ua) {
                                $(window).trigger(C.Events.REQUEST_AUTO_PAIRING, ua);
                            }
                            var user = (CZ.models.user) ? CZ.models.user[C.USER_ID] : null;
                            if (user) {
                                $(window).trigger(C.Events.USER_DATA, user);
                            }
                            var userSettings = (CZ.models.user_settings) ? CZ.models.user_settings[C.USER_ID] : null;
                            if (userSettings) {
                                $(window).trigger(C.Events.USER_SETTINGS_DATA, userSettings);
                            }
                            while (CZ.pendingNotifications.length > 0) {
                                CZ.pendingNotifications.pop()();
                            }
                        } else {
                            CZ.resetBackoff(function () {
                                CZ.readStructures(success, error);
                            });
                        }
                    }
                };
                request = {
                    url: url,
                    success: callback,
                    error: function (data) {
                        CZ.checkConnectivity();
                        if (error) {
                            error(data);
                        }
                    },
                    headers: CZ.getHeaders()
                };
                NET.get(request);
            } else {
                if (CZ.subscriptionActive) {
                    return;
                }
                CZ.subscriptionActive = true;
                request = {
                    payload: encodeURIComponent(JSON.stringify({
                        keys: _.values(CZ.buckets)
                    }))
                };
                request = _.extend(request, {
                    'X-nl-subscribe-timeout': NET.getTimeout() - 2
                });
                callback = function (data) {
                    var newdata = false,
                        type, id;
                    try {
                        CZ.updateTimestampOffset(data);
                        if (CZ.handleRedirect(data)) {
                            return;
                        }
                        if (data.status === 403) {
                            CZ.models = null;
                            return;
                        } else if (data.status === 200) {
                            if (data.payload && (!data.payload.cmd)) {
                                CZ.clearBackoff();
                                CZ.updateSubscribeData(data.headers);
                                var headers = data.headers,
                                    bucket = headers['X-nl-skv-key'],
                                    timestamp = headers['X-nl-skv-timestamp'],
                                    version = headers['X-nl-skv-version'];
                                if (!bucket) {
                                    return;
                                }
                                var out = _.extend({
                                    $timestamp: timestamp,
                                    $version: version
                                }, data.payload),
                                    model = CZ.models,
                                    keyparts = bucket.split('.');
                                type = keyparts[0];
                                id = keyparts[1];
                                if (!(model && model[type])) {
                                    CZ.models = null;
                                    return;
                                }
                                var bf = CZ.bucketFields,
                                    f = bf[type];
                                if (f) {
                                    var na = out[f];
                                    var oa = model[type][id][f];
                                    if ((na ? (!oa) : oa) || (na.length !== oa.length) || (_.intersect(na, oa).length !== na.length)) {
                                        CZ.pendingNotifications.push(function () {
                                            CZ.notifyAddRemove(oa, na);
                                        });
                                        CZ.models = null;
                                        return;
                                    }
                                }
                                var modelbucket = model[type][id];
                                var modelTimes = CZ.timestamps;
                                _.each(out, function (newval, field) {
                                    if (modelbucket[field] !== newval) {
                                        var timekey = bucket + '.' + field,
                                            modeltime = modelTimes[timekey],
                                            el = CZ.editList,
                                            skipUpdate = (modeltime && timestamp && (modeltime > timestamp)) || (el && el[type] && el[type][id] && el[type][id][field]);
                                        if (!skipUpdate) {
                                            newdata = true;
                                            modelbucket[field] = newval;
                                        }
                                    }
                                });
                                if (success) {
                                    var result = newdata ? CZ.mapStructures() : {};
                                    success(result);
                                }
                            } else {
                                CZ.incrementBackoff();
                                if (error) {
                                    error(data);
                                }
                            }
                        } else {
                            N.warn('Error subscribing: ', JSON.stringify(data), 'for subscribe request', request);
                            CZ.checkConnectivity();
                        }
                    } catch (e) {
                        N.error(e);
                    } finally {
                        CZ.subscriptionActive = false;
                        $(window).trigger(CZ.subscribeDoneEvent);
                        if (newdata) {
                            $(window).trigger(CZ.newDataEvent);
                            if (type === 'user_alert_dialog') {
                                $(window).trigger(C.Events.REQUEST_AUTO_PAIRING, data.payload);
                            } else if (type === 'track') {
                                var eventData = _.extend({
                                    id: id
                                }, data.payload);
                                $(window).trigger(CZ.deviceTrackEvent, eventData);
                            } else if (type === 'user') {
                                $(window).trigger(C.Events.USER_DATA, data.payload);
                            } else if (type === 'user_settings') {
                                $(window).trigger(C.Events.USER_SETTINGS_DATA, data.payload);
                            }
                        } else {
                            CZ.resetBackoff(function () {
                                CZ.readStructures(success, error);
                            });
                        }
                    }
                };
                $('head script[src*="jsonp=jQuery"]').remove();
                NET.get({
                    url: 'subscribe',
                    data: request,
                    method: 'POST',
                    success: callback,
                    error: function (data) {
                        CZ.checkConnectivity();
                        if (error) {
                            error(data);
                        }
                    },
                    headers: CZ.getHeaders()
                });
            }
        },
        updateBucket: function (data, czid, options, success, error) {
            var keyparts = czid.split('.'),
                type = keyparts[0],
                id = keyparts[1],
                wl = window.location,
                redirurl = wl.protocol + '//' + wl.host + '/post_jsonp',
                url = '/v1/put';
            if (!options.multiput) {
                url += '/' + czid;
            }
            var callback = function (data) {
                try {
                    CZ.updateTimestampOffset(data);
                    success({});
                } catch (e) {
                    N.error(e);
                } finally {
                    $(window).trigger(CZ.updateDoneEvent);
                }
            };
            var payload = {
                payload: data,
                headers: CZ.getHeaders(),
                path: url,
                redir: redirurl
            };
            if (options.override) {
                payload.headers['X-nl-merge-payload'] = false;
            }
            NET.post({
                url: url,
                data: payload,
                method: 'POST',
                success: callback,
                error: function (data) {
                    CZ.checkConnectivity();
                    if (error) {
                        error(data);
                    }
                }
            });
        },
        updateTimestampOffset: function (responsedata) {
            if (responsedata && responsedata.headers) {
                var cztime = responsedata.headers['X-nl-service-timestamp'];
                if (cztime) {
                    CZ.timestampOffset = (new Date()).getTime() - cztime;
                }
            }
        },
        getTime: function (date) {
            date = date || new Date();
            return date.getTime() - this.timestampOffset;
        },
        touchModel: function (bucketName) {
            this.timestamps[bucketName] = this.getTime();
        },
        readCookie: function (name) {
            var documentCookies = document.cookie;
            if (arguments.length > 1) {
                documentCookies = arguments[1];
            }
            var cookies = documentCookies.split(';');
            var result = $.map(cookies, function (c) {
                var key = $.trim(c.slice(0, c.indexOf('=')));
                var value = c.slice(c.indexOf('=') + 1).replace(/^\s+/, '');
                if (key !== name) {
                    return null;
                }
                if (value[0] === '"' && value[value.length - 1] === '"') {
                    value = value.replace(/\\"/, '"');
                    value = value.slice(1, value.length - 1);
                }
                return value;
            });
            return result[0];
        },
        getToken: function () {
            this.getToken._t = this.getToken._t || this.readCookie('cztoken');
            return this.getToken._t;
        },
        getHeaders: function () {
            var h = {
                'X-nl-client-timestamp': (new Date()).getTime(),
                'X-nl-session-id': CZ.sessionID,
                'X-nl-protocol-version': 1
            }, token = this.getToken();
            if (token) {
                h['Authorization'] = 'Basic ' + token;
            }
            return h;
        }
    };
    $(CZ.init);
})(window.jQuery, window._);