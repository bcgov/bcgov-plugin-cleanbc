const shared = "";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(","))
    map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  }
);
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction(
  (str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  }
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toNumber = (val) => {
  const n = isString(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
const GLOBALS_ALLOWED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol";
const isGloballyAllowed = /* @__PURE__ */ makeMap(GLOBALS_ALLOWED);
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i, l;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].pause();
        }
      }
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      this.effects.length = 0;
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn, failSilently = false) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this);
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= ~64;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= ~2;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= ~1;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed = false) {
  sub.flags |= 8;
  if (isComputed) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= ~8;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= ~8;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error)
            error = err;
        }
      }
      e = next;
    }
  }
  if (error)
    throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link = tail;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail)
        tail = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= ~16;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  const dep = computed2.dep;
  computed2.flags |= 2;
  if (dep.version > 0 && !computed2.isSSR && computed2.deps && !isDirty(computed2)) {
    computed2.flags &= ~2;
    return;
  }
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= ~2;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= ~4;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
function effect(fn, options) {
  if (fn.effect instanceof ReactiveEffect) {
    fn = fn.effect.fn;
  }
  const e = new ReactiveEffect(fn);
  if (options) {
    extend(e, options);
  }
  try {
    e.run();
  } catch (err) {
    e.stop();
    throw err;
  }
  const runner = e.run.bind(e);
  runner.effect = e;
  return runner;
}
function stop(runner) {
  runner.effect.stop();
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link = this.activeLink;
    if (link === void 0 || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link;
      } else {
        link.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
      }
      addSub(link);
    } else if (link.version === -1) {
      link.version = this.version;
      if (link.nextDep) {
        const next = link.nextDep;
        next.prevDep = link.prevDep;
        if (link.prevDep) {
          link.prevDep.nextDep = next;
        }
        link.prevDep = activeSub.depsTail;
        link.nextDep = void 0;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
        if (activeSub.deps === link) {
          activeSub.deps = next;
        }
      }
    }
    return link;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false)
        ;
      for (let link = this.subs; link; link = link.prevSub) {
        if (link.sub.notify()) {
          ;
          link.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail)
        currentTail.nextSub = link;
    }
    link.dep.subs = link;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = Symbol(
  ""
);
const ARRAY_ITERATE_KEY = Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function getDepFromReactive(object, key) {
  const depMap = targetMap.get(object);
  return depMap && depMap.get(key);
}
function reactiveReadArray(array) {
  const raw = toRaw(array);
  if (raw === array)
    return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, toReactive);
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
    );
  },
  entries() {
    return iterator(this, "entries", (value) => {
      value[1] = toReactive(value[1]);
      return value;
    });
  },
  every(fn, thisArg) {
    return apply(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
  },
  find(fn, thisArg) {
    return apply(this, "find", fn, thisArg, toReactive, arguments);
  },
  findIndex(fn, thisArg) {
    return apply(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply(this, "findLast", fn, thisArg, toReactive, arguments);
  },
  findLastIndex(fn, thisArg) {
    return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", toReactive);
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (result.value) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
const arrayProto = Array.prototype;
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toReactive(item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  let wrappedFn = fn;
  if (arr !== self2) {
    if (!isShallow(self2)) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, toReactive(item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  return arr[method](wrappedFn, ...args);
}
function searchProxy(self2, method, args) {
  const arr = toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && isProxy(args[0])) {
    args[0] = toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = toRaw(self2)[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key))
    key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip")
      return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      isRef(target) ? target : receiver
    );
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const proto = getProto(target);
        const hadKey = proto.has.call(target, value);
        if (!hadKey) {
          target.add(value);
          trigger(target, "add", value, value);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      },
      delete(key) {
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value : toRaw(value);
    this._value = isShallow2 ? value : toReactive(value);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
    newValue = useDirectValue ? newValue : toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function triggerRef(ref2) {
  if (ref2.dep) {
    {
      ref2.dep.trigger();
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
function toValue(source) {
  return isFunction(source) ? source() : unref(source);
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this["__v_isRef"] = true;
    this._value = void 0;
    const dep = this.dep = new Dep();
    const { get, set } = factory(dep.track.bind(dep), dep.trigger.bind(dep));
    this._get = get;
    this._set = set;
  }
  get value() {
    return this._value = this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
function toRefs(object) {
  const ret = isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this["__v_isRef"] = true;
    this._value = void 0;
  }
  get value() {
    const val = this._object[this._key];
    return this._value = val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this["__v_isRef"] = true;
    this["__v_isReadonly"] = true;
    this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction(source)) {
    return new GetterRefImpl(source);
  } else if (isObject(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link = this.dep.track();
    refreshComputed(this);
    if (link) {
      link.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const TrackOpTypes = {
  "GET": "get",
  "HAS": "has",
  "ITERATE": "iterate"
};
const TriggerOpTypes = {
  "SET": "set",
  "ADD": "add",
  "DELETE": "delete",
  "CLEAR": "clear"
};
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function getCurrentWatcher() {
  return activeWatcher;
}
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups)
      cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep)
      return source2;
    if (isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
          oldValue = newValue;
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups)
          cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
/**
* @vue/runtime-core v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning)
    return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function assertNumber(val, type) {
  return;
}
const ErrorCodes = {
  "SETUP_FUNCTION": 0,
  "0": "SETUP_FUNCTION",
  "RENDER_FUNCTION": 1,
  "1": "RENDER_FUNCTION",
  "NATIVE_EVENT_HANDLER": 5,
  "5": "NATIVE_EVENT_HANDLER",
  "COMPONENT_EVENT_HANDLER": 6,
  "6": "COMPONENT_EVENT_HANDLER",
  "VNODE_HOOK": 7,
  "7": "VNODE_HOOK",
  "DIRECTIVE_HOOK": 8,
  "8": "DIRECTIVE_HOOK",
  "TRANSITION_HOOK": 9,
  "9": "TRANSITION_HOOK",
  "APP_ERROR_HANDLER": 10,
  "10": "APP_ERROR_HANDLER",
  "APP_WARN_HANDLER": 11,
  "11": "APP_WARN_HANDLER",
  "FUNCTION_REF": 12,
  "12": "FUNCTION_REF",
  "ASYNC_COMPONENT_LOADER": 13,
  "13": "ASYNC_COMPONENT_LOADER",
  "SCHEDULER": 14,
  "14": "SCHEDULER",
  "COMPONENT_UPDATE": 15,
  "15": "COMPONENT_UPDATE",
  "APP_UNMOUNT_CLEANUP": 16,
  "16": "APP_UNMOUNT_CLEANUP"
};
const ErrorTypeStrings$1 = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush",
  [15]: "component update",
  [16]: "app unmount cleanup function"
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      if (cb.flags & 4) {
        cb.flags &= ~1;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= ~1;
      }
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= ~1;
      }
      if (!(cb.flags & 8))
        cb();
      cb.flags &= ~1;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false)
          ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= ~1;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let devtools$1;
let buffer = [];
function setDevtoolsHook$1(hook, target) {
  var _a, _b;
  devtools$1 = hook;
  if (devtools$1) {
    devtools$1.enabled = true;
    buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    // eslint-disable-next-line no-restricted-syntax
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook$1(newHook, target);
    });
    setTimeout(() => {
      if (!devtools$1) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        buffer = [];
      }
    }, 3e3);
  } else {
    buffer = [];
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id) {
  currentScopeId = id;
}
function popScopeId() {
  currentScopeId = null;
}
const withScopeId = (_id) => withCtx;
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const TeleportEndKey = Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  name: "Teleport",
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
    const {
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      o: { insert, querySelector, createText, createComment }
    } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          if (parentComponent && parentComponent.isCE) {
            parentComponent.ce._teleportTarget = container2;
          }
          mountChildren(
            children,
            container2,
            anchor2,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      };
      const mountToTarget = () => {
        const target = n2.target = resolveTarget(n2.props, querySelector);
        const targetAnchor = prepareAnchor(target, n2, createText, insert);
        if (target) {
          if (namespace !== "svg" && isTargetSVG(target)) {
            namespace = "svg";
          } else if (namespace !== "mathml" && isTargetMathML(target)) {
            namespace = "mathml";
          }
          if (!disabled) {
            mount(target, targetAnchor);
            updateCssVars(n2, false);
          }
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
        updateCssVars(n2, true);
      }
      if (isTeleportDeferred(n2.props)) {
        queuePostRenderEffect(() => {
          mountToTarget();
          n2.el.__isMounted = true;
        }, parentSuspense);
      } else {
        mountToTarget();
      }
    } else {
      if (isTeleportDeferred(n2.props) && !n1.el.__isMounted) {
        queuePostRenderEffect(() => {
          TeleportImpl.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
          delete n1.el.__isMounted;
        }, parentSuspense);
        return;
      }
      n2.el = n1.el;
      n2.targetStart = n1.targetStart;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      if (namespace === "svg" || isTargetSVG(target)) {
        namespace = "svg";
      } else if (namespace === "mathml" || isTargetMathML(target)) {
        namespace = "mathml";
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          currentContainer,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          currentContainer,
          currentAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          false
        );
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(
            n2,
            container,
            mainAnchor,
            internals,
            1
          );
        } else {
          if (n2.props && n1.props && n2.props.to !== n1.props.to) {
            n2.props.to = n1.props.to;
          }
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(
            n2.props,
            querySelector
          );
          if (nextTarget) {
            moveTeleport(
              n2,
              nextTarget,
              null,
              internals,
              0
            );
          }
        } else if (wasDisabled) {
          moveTeleport(
            n2,
            target,
            targetAnchor,
            internals,
            1
          );
        }
      }
      updateCssVars(n2, disabled);
    }
  },
  remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const {
      shapeFlag,
      children,
      anchor,
      targetStart,
      targetAnchor,
      target,
      props
    } = vnode;
    if (target) {
      hostRemove(targetStart);
      hostRemove(targetAnchor);
    }
    doRemove && hostRemove(anchor);
    if (shapeFlag & 16) {
      const shouldRemove = doRemove || !isTeleportDisabled(props);
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        unmount(
          child,
          parentComponent,
          parentSuspense,
          shouldRemove,
          !!child.dynamicChildren
        );
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(
          children[i],
          container,
          parentAnchor,
          2
        );
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
  o: { nextSibling, parentNode, querySelector, insert, createText }
}, hydrateChildren) {
  const target = vnode.target = resolveTarget(
    vnode.props,
    querySelector
  );
  if (target) {
    const disabled = isTeleportDisabled(vnode.props);
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (disabled) {
        vnode.anchor = hydrateChildren(
          nextSibling(node),
          vnode,
          parentNode(node),
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        vnode.targetStart = targetNode;
        vnode.targetAnchor = targetNode && nextSibling(targetNode);
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          if (targetAnchor && targetAnchor.nodeType === 8) {
            if (targetAnchor.data === "teleport start anchor") {
              vnode.targetStart = targetAnchor;
            } else if (targetAnchor.data === "teleport anchor") {
              vnode.targetAnchor = targetAnchor;
              target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
              break;
            }
          }
          targetAnchor = nextSibling(targetAnchor);
        }
        if (!vnode.targetAnchor) {
          prepareAnchor(target, vnode, createText, insert);
        }
        hydrateChildren(
          targetNode && nextSibling(targetNode),
          vnode,
          target,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      }
    }
    updateCssVars(vnode, disabled);
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
function updateCssVars(vnode, isDisabled) {
  const ctx = vnode.ctx;
  if (ctx && ctx.ut) {
    let node, anchor;
    if (isDisabled) {
      node = vnode.el;
      anchor = vnode.anchor;
    } else {
      node = vnode.targetStart;
      anchor = vnode.targetAnchor;
    }
    while (node && node !== anchor) {
      if (node.nodeType === 1)
        node.setAttribute("data-v-owner", ctx.uid);
      node = node.nextSibling;
    }
    ctx.ut();
  }
}
function prepareAnchor(target, vnode, createText, insert) {
  const targetStart = vnode.targetStart = createText("");
  const targetAnchor = vnode.targetAnchor = createText("");
  targetStart[TeleportEndKey] = targetAnchor;
  if (target) {
    insert(targetStart, target);
    insert(targetAnchor, target);
  }
  return targetAnchor;
}
const leaveCbKey = Symbol("_leaveCb");
const enterCbKey$1 = Symbol("_enterCb");
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionPropsValidators = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator
};
const recursiveGetSubtree = (instance) => {
  const subTree = instance.subTree;
  return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
};
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      const child = findNonCommentChild(children);
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getInnerChild$1(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      let enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance,
        // #11061, ensure enterHooks is fresh after clone
        (hooks) => enterHooks = hooks
      );
      if (innerChild.type !== Comment) {
        setTransitionHooks(innerChild, enterHooks);
      }
      let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
      if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(innerChild, oldInnerChild) && recursiveGetSubtree(instance).type !== Comment) {
        let leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in" && innerChild.type !== Comment) {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (!(instance.job.flags & 8)) {
              instance.update();
            }
            delete leavingHooks.afterLeave;
            oldInnerChild = void 0;
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el[leaveCbKey] = () => {
              earlyRemove();
              el[leaveCbKey] = void 0;
              delete enterHooks.delayedLeave;
              oldInnerChild = void 0;
            };
            enterHooks.delayedLeave = () => {
              delayedLeave();
              delete enterHooks.delayedLeave;
              oldInnerChild = void 0;
            };
          };
        } else {
          oldInnerChild = void 0;
        }
      } else if (oldInnerChild) {
        oldInnerChild = void 0;
      }
      return child;
    };
  }
};
function findNonCommentChild(children) {
  let child = children[0];
  if (children.length > 1) {
    for (const c of children) {
      if (c.type !== Comment) {
        child = c;
        break;
      }
    }
  }
  return child;
}
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance, postClone) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(
      hook,
      instance,
      9,
      args
    );
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el[leaveCbKey]) {
        el[leaveCbKey](
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
        leavingVNode.el[leaveCbKey]();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el[enterCbKey$1] = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el[enterCbKey$1] = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el[enterCbKey$1]) {
        el[enterCbKey$1](
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el[leaveCbKey] = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el[leaveCbKey] = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      const hooks2 = resolveTransitionHooks(
        vnode2,
        props,
        state,
        instance,
        postClone
      );
      if (postClone)
        postClone(hooks2);
      return hooks2;
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getInnerChild$1(vnode) {
  if (!isKeepAlive(vnode)) {
    if (isTeleport(vnode.type) && vnode.children) {
      return findNonCommentChild(vnode.children);
    }
    return vnode;
  }
  const { shapeFlag, children } = vnode;
  if (children) {
    if (shapeFlag & 16) {
      return children[0];
    }
    if (shapeFlag & 32 && isFunction(children.default)) {
      return children.default();
    }
  }
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
function useId() {
  const i = getCurrentInstance();
  if (i) {
    return (i.appContext.config.idPrefix || "v") + "-" + i.ids[0] + i.ids[1]++;
  }
  return "";
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function useTemplateRef(key) {
  const i = getCurrentInstance();
  const r = shallowRef(null);
  if (i) {
    const refs = i.refs === EMPTY_OBJ ? i.refs = {} : i.refs;
    {
      Object.defineProperty(refs, key, {
        enumerable: true,
        get: () => r.value,
        set: (val) => r.value = val
      });
    }
  }
  const ret = r;
  return ret;
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? () => false : (key) => {
    return hasOwn(rawSetupState, key);
  };
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (canSetSetupRef(ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (canSetSetupRef(ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
let hasLoggedMismatchError = false;
const logMismatchError = () => {
  if (hasLoggedMismatchError) {
    return;
  }
  console.error("Hydration completed but contains mismatches.");
  hasLoggedMismatchError = true;
};
const isSVGContainer = (container) => container.namespaceURI.includes("svg") && container.tagName !== "foreignObject";
const isMathMLContainer = (container) => container.namespaceURI.includes("MathML");
const getContainerType = (container) => {
  if (container.nodeType !== 1)
    return void 0;
  if (isSVGContainer(container))
    return "svg";
  if (isMathMLContainer(container))
    return "mathml";
  return void 0;
};
const isComment = (node) => node.nodeType === 8;
function createHydrationFunctions(rendererInternals) {
  const {
    mt: mountComponent,
    p: patch,
    o: {
      patchProp: patchProp2,
      createText,
      nextSibling,
      parentNode,
      remove: remove2,
      insert,
      createComment
    }
  } = rendererInternals;
  const hydrate2 = (vnode, container) => {
    if (!container.hasChildNodes()) {
      patch(null, vnode, container);
      flushPostFlushCbs();
      container._vnode = vnode;
      return;
    }
    hydrateNode(container.firstChild, vnode, null, null, null);
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
    optimized = optimized || !!vnode.dynamicChildren;
    const isFragmentStart = isComment(node) && node.data === "[";
    const onMismatch = () => handleMismatch(
      node,
      vnode,
      parentComponent,
      parentSuspense,
      slotScopeIds,
      isFragmentStart
    );
    const { type, ref: ref2, shapeFlag, patchFlag } = vnode;
    let domType = node.nodeType;
    vnode.el = node;
    if (patchFlag === -2) {
      optimized = false;
      vnode.dynamicChildren = null;
    }
    let nextNode = null;
    switch (type) {
      case Text:
        if (domType !== 3) {
          if (vnode.children === "") {
            insert(vnode.el = createText(""), parentNode(node), node);
            nextNode = node;
          } else {
            nextNode = onMismatch();
          }
        } else {
          if (node.data !== vnode.children) {
            logMismatchError();
            node.data = vnode.children;
          }
          nextNode = nextSibling(node);
        }
        break;
      case Comment:
        if (isTemplateNode(node)) {
          nextNode = nextSibling(node);
          replaceNode(
            vnode.el = node.content.firstChild,
            node,
            parentComponent
          );
        } else if (domType !== 8 || isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = nextSibling(node);
        }
        break;
      case Static:
        if (isFragmentStart) {
          node = nextSibling(node);
          domType = node.nodeType;
        }
        if (domType === 1 || domType === 3) {
          nextNode = node;
          const needToAdoptContent = !vnode.children.length;
          for (let i = 0; i < vnode.staticCount; i++) {
            if (needToAdoptContent)
              vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
            if (i === vnode.staticCount - 1) {
              vnode.anchor = nextNode;
            }
            nextNode = nextSibling(nextNode);
          }
          return isFragmentStart ? nextSibling(nextNode) : nextNode;
        } else {
          onMismatch();
        }
        break;
      case Fragment:
        if (!isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = hydrateFragment(
            node,
            vnode,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        }
        break;
      default:
        if (shapeFlag & 1) {
          if ((domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) && !isTemplateNode(node)) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateElement(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              slotScopeIds,
              optimized
            );
          }
        } else if (shapeFlag & 6) {
          vnode.slotScopeIds = slotScopeIds;
          const container = parentNode(node);
          if (isFragmentStart) {
            nextNode = locateClosingAnchor(node);
          } else if (isComment(node) && node.data === "teleport start") {
            nextNode = locateClosingAnchor(node, node.data, "teleport end");
          } else {
            nextNode = nextSibling(node);
          }
          mountComponent(
            vnode,
            container,
            null,
            parentComponent,
            parentSuspense,
            getContainerType(container),
            optimized
          );
          if (isAsyncWrapper(vnode) && !vnode.type.__asyncResolved) {
            let subTree;
            if (isFragmentStart) {
              subTree = createVNode(Fragment);
              subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
            } else {
              subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
            }
            subTree.el = node;
            vnode.component.subTree = subTree;
          }
        } else if (shapeFlag & 64) {
          if (domType !== 8) {
            nextNode = onMismatch();
          } else {
            nextNode = vnode.type.hydrate(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              slotScopeIds,
              optimized,
              rendererInternals,
              hydrateChildren
            );
          }
        } else if (shapeFlag & 128) {
          nextNode = vnode.type.hydrate(
            node,
            vnode,
            parentComponent,
            parentSuspense,
            getContainerType(parentNode(node)),
            slotScopeIds,
            optimized,
            rendererInternals,
            hydrateNode
          );
        } else
          ;
    }
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode);
    }
    return nextNode;
  };
  const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!vnode.dynamicChildren;
    const { type, props, patchFlag, shapeFlag, dirs, transition } = vnode;
    const forcePatch = type === "input" || type === "option";
    if (forcePatch || patchFlag !== -1) {
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      let needCallTransitionHooks = false;
      if (isTemplateNode(el)) {
        needCallTransitionHooks = needTransition(
          null,
          // no need check parentSuspense in hydration
          transition
        ) && parentComponent && parentComponent.vnode.props && parentComponent.vnode.props.appear;
        const content = el.content.firstChild;
        if (needCallTransitionHooks) {
          transition.beforeEnter(content);
        }
        replaceNode(content, el, parentComponent);
        vnode.el = el = content;
      }
      if (shapeFlag & 16 && // skip if element has innerHTML / textContent
      !(props && (props.innerHTML || props.textContent))) {
        let next = hydrateChildren(
          el.firstChild,
          vnode,
          el,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        while (next) {
          if (!isMismatchAllowed(
            el,
            1
            /* CHILDREN */
          )) {
            logMismatchError();
          }
          const cur = next;
          next = next.nextSibling;
          remove2(cur);
        }
      } else if (shapeFlag & 8) {
        let clientText = vnode.children;
        if (clientText[0] === "\n" && (el.tagName === "PRE" || el.tagName === "TEXTAREA")) {
          clientText = clientText.slice(1);
        }
        if (el.textContent !== clientText) {
          if (!isMismatchAllowed(
            el,
            0
            /* TEXT */
          )) {
            logMismatchError();
          }
          el.textContent = vnode.children;
        }
      }
      if (props) {
        if (forcePatch || !optimized || patchFlag & (16 | 32)) {
          const isCustomElement = el.tagName.includes("-");
          for (const key in props) {
            if (forcePatch && (key.endsWith("value") || key === "indeterminate") || isOn(key) && !isReservedProp(key) || // force hydrate v-bind with .prop modifiers
            key[0] === "." || isCustomElement) {
              patchProp2(el, key, null, props[key], void 0, parentComponent);
            }
          }
        } else if (props.onClick) {
          patchProp2(
            el,
            "onClick",
            null,
            props.onClick,
            void 0,
            parentComponent
          );
        } else if (patchFlag & 4 && isReactive(props.style)) {
          for (const key in props.style)
            props.style[key];
        }
      }
      let vnodeHooks;
      if (vnodeHooks = props && props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHooks, parentComponent, vnode);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      if ((vnodeHooks = props && props.onVnodeMounted) || dirs || needCallTransitionHooks) {
        queueEffectWithSuspense(() => {
          vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    }
    return el.nextSibling;
  };
  const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!parentVNode.dynamicChildren;
    const children = parentVNode.children;
    const l = children.length;
    for (let i = 0; i < l; i++) {
      const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
      const isText = vnode.type === Text;
      if (node) {
        if (isText && !optimized) {
          if (i + 1 < l && normalizeVNode(children[i + 1]).type === Text) {
            insert(
              createText(
                node.data.slice(vnode.children.length)
              ),
              container,
              nextSibling(node)
            );
            node.data = vnode.children;
          }
        }
        node = hydrateNode(
          node,
          vnode,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      } else if (isText && !vnode.children) {
        insert(vnode.el = createText(""), container);
      } else {
        if (!isMismatchAllowed(
          container,
          1
          /* CHILDREN */
        )) {
          logMismatchError();
        }
        patch(
          null,
          vnode,
          container,
          null,
          parentComponent,
          parentSuspense,
          getContainerType(container),
          slotScopeIds
        );
      }
    }
    return node;
  };
  const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    const { slotScopeIds: fragmentSlotScopeIds } = vnode;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    const container = parentNode(node);
    const next = hydrateChildren(
      nextSibling(node),
      vnode,
      container,
      parentComponent,
      parentSuspense,
      slotScopeIds,
      optimized
    );
    if (next && isComment(next) && next.data === "]") {
      return nextSibling(vnode.anchor = next);
    } else {
      logMismatchError();
      insert(vnode.anchor = createComment(`]`), container, next);
      return next;
    }
  };
  const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
    if (!isMismatchAllowed(
      node.parentElement,
      1
      /* CHILDREN */
    )) {
      logMismatchError();
    }
    vnode.el = null;
    if (isFragment) {
      const end = locateClosingAnchor(node);
      while (true) {
        const next2 = nextSibling(node);
        if (next2 && next2 !== end) {
          remove2(next2);
        } else {
          break;
        }
      }
    }
    const next = nextSibling(node);
    const container = parentNode(node);
    remove2(node);
    patch(
      null,
      vnode,
      container,
      next,
      parentComponent,
      parentSuspense,
      getContainerType(container),
      slotScopeIds
    );
    if (parentComponent) {
      parentComponent.vnode.el = vnode.el;
      updateHOCHostEl(parentComponent, vnode.el);
    }
    return next;
  };
  const locateClosingAnchor = (node, open = "[", close = "]") => {
    let match = 0;
    while (node) {
      node = nextSibling(node);
      if (node && isComment(node)) {
        if (node.data === open)
          match++;
        if (node.data === close) {
          if (match === 0) {
            return nextSibling(node);
          } else {
            match--;
          }
        }
      }
    }
    return node;
  };
  const replaceNode = (newNode, oldNode, parentComponent) => {
    const parentNode2 = oldNode.parentNode;
    if (parentNode2) {
      parentNode2.replaceChild(newNode, oldNode);
    }
    let parent = parentComponent;
    while (parent) {
      if (parent.vnode.el === oldNode) {
        parent.vnode.el = parent.subTree.el = newNode;
      }
      parent = parent.parent;
    }
  };
  const isTemplateNode = (node) => {
    return node.nodeType === 1 && node.tagName === "TEMPLATE";
  };
  return [hydrate2, hydrateNode];
}
const allowMismatchAttr = "data-allow-mismatch";
const MismatchTypeString = {
  [
    0
    /* TEXT */
  ]: "text",
  [
    1
    /* CHILDREN */
  ]: "children",
  [
    2
    /* CLASS */
  ]: "class",
  [
    3
    /* STYLE */
  ]: "style",
  [
    4
    /* ATTRIBUTE */
  ]: "attribute"
};
function isMismatchAllowed(el, allowedType) {
  if (allowedType === 0 || allowedType === 1) {
    while (el && !el.hasAttribute(allowMismatchAttr)) {
      el = el.parentElement;
    }
  }
  const allowedAttr = el && el.getAttribute(allowMismatchAttr);
  if (allowedAttr == null) {
    return false;
  } else if (allowedAttr === "") {
    return true;
  } else {
    const list = allowedAttr.split(",");
    if (allowedType === 0 && list.includes("children")) {
      return true;
    }
    return allowedAttr.split(",").includes(MismatchTypeString[allowedType]);
  }
}
const requestIdleCallback = getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
const cancelIdleCallback = getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const hydrateOnIdle = (timeout = 1e4) => (hydrate2) => {
  const id = requestIdleCallback(hydrate2, { timeout });
  return () => cancelIdleCallback(id);
};
function elementIsVisibleInViewport(el) {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return (top > 0 && top < innerHeight || bottom > 0 && bottom < innerHeight) && (left > 0 && left < innerWidth || right > 0 && right < innerWidth);
}
const hydrateOnVisible = (opts) => (hydrate2, forEach) => {
  const ob = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting)
        continue;
      ob.disconnect();
      hydrate2();
      break;
    }
  }, opts);
  forEach((el) => {
    if (!(el instanceof Element))
      return;
    if (elementIsVisibleInViewport(el)) {
      hydrate2();
      ob.disconnect();
      return false;
    }
    ob.observe(el);
  });
  return () => ob.disconnect();
};
const hydrateOnMediaQuery = (query) => (hydrate2) => {
  if (query) {
    const mql = matchMedia(query);
    if (mql.matches) {
      hydrate2();
    } else {
      mql.addEventListener("change", hydrate2, { once: true });
      return () => mql.removeEventListener("change", hydrate2);
    }
  }
};
const hydrateOnInteraction = (interactions = []) => (hydrate2, forEach) => {
  if (isString(interactions))
    interactions = [interactions];
  let hasHydrated = false;
  const doHydrate = (e) => {
    if (!hasHydrated) {
      hasHydrated = true;
      teardown();
      hydrate2();
      e.target.dispatchEvent(new e.constructor(e.type, e));
    }
  };
  const teardown = () => {
    forEach((el) => {
      for (const i of interactions) {
        el.removeEventListener(i, doHydrate);
      }
    });
  };
  forEach((el) => {
    for (const i of interactions) {
      el.addEventListener(i, doHydrate, { once: true });
    }
  });
  return teardown;
};
function forEachElement(node, cb) {
  if (isComment(node) && node.data === "[") {
    let depth = 1;
    let next = node.nextSibling;
    while (next) {
      if (next.nodeType === 1) {
        const result = cb(next);
        if (result === false) {
          break;
        }
      } else if (isComment(next)) {
        if (next.data === "]") {
          if (--depth === 0)
            break;
        } else if (next.data === "[") {
          depth++;
        }
      }
      next = next.nextSibling;
    }
  } else {
    cb(node);
  }
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineAsyncComponent(source) {
  if (isFunction(source)) {
    source = { loader: source };
  }
  const {
    loader,
    loadingComponent,
    errorComponent,
    delay = 200,
    hydrate: hydrateStrategy,
    timeout,
    // undefined = never times out
    suspensible = true,
    onError: userOnError
  } = source;
  let pendingRequest = null;
  let resolvedComp;
  let retries = 0;
  const retry = () => {
    retries++;
    pendingRequest = null;
    return load();
  };
  const load = () => {
    let thisRequest;
    return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
      err = err instanceof Error ? err : new Error(String(err));
      if (userOnError) {
        return new Promise((resolve2, reject) => {
          const userRetry = () => resolve2(retry());
          const userFail = () => reject(err);
          userOnError(err, userRetry, userFail, retries + 1);
        });
      } else {
        throw err;
      }
    }).then((comp) => {
      if (thisRequest !== pendingRequest && pendingRequest) {
        return pendingRequest;
      }
      if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
        comp = comp.default;
      }
      resolvedComp = comp;
      return comp;
    }));
  };
  return /* @__PURE__ */ defineComponent({
    name: "AsyncComponentWrapper",
    __asyncLoader: load,
    __asyncHydrate(el, instance, hydrate2) {
      const doHydrate = hydrateStrategy ? () => {
        const teardown = hydrateStrategy(
          hydrate2,
          (cb) => forEachElement(el, cb)
        );
        if (teardown) {
          (instance.bum || (instance.bum = [])).push(teardown);
        }
      } : hydrate2;
      if (resolvedComp) {
        doHydrate();
      } else {
        load().then(() => !instance.isUnmounted && doHydrate());
      }
    },
    get __asyncResolved() {
      return resolvedComp;
    },
    setup() {
      const instance = currentInstance;
      markAsyncBoundary(instance);
      if (resolvedComp) {
        return () => createInnerComp(resolvedComp, instance);
      }
      const onError = (err) => {
        pendingRequest = null;
        handleError(
          err,
          instance,
          13,
          !errorComponent
        );
      };
      if (suspensible && instance.suspense || isInSSRComponentSetup) {
        return load().then((comp) => {
          return () => createInnerComp(comp, instance);
        }).catch((err) => {
          onError(err);
          return () => errorComponent ? createVNode(errorComponent, {
            error: err
          }) : null;
        });
      }
      const loaded = ref(false);
      const error = ref();
      const delayed = ref(!!delay);
      if (delay) {
        setTimeout(() => {
          delayed.value = false;
        }, delay);
      }
      if (timeout != null) {
        setTimeout(() => {
          if (!loaded.value && !error.value) {
            const err = new Error(
              `Async component timed out after ${timeout}ms.`
            );
            onError(err);
            error.value = err;
          }
        }, timeout);
      }
      load().then(() => {
        loaded.value = true;
        if (instance.parent && isKeepAlive(instance.parent.vnode)) {
          instance.parent.update();
        }
      }).catch((err) => {
        onError(err);
        error.value = err;
      });
      return () => {
        if (loaded.value && resolvedComp) {
          return createInnerComp(resolvedComp, instance);
        } else if (error.value && errorComponent) {
          return createVNode(errorComponent, {
            error: error.value
          });
        } else if (loadingComponent && !delayed.value) {
          return createVNode(loadingComponent);
        }
      };
    }
  });
}
function createInnerComp(comp, parent) {
  const { ref: ref2, props, children, ce } = parent.vnode;
  const vnode = createVNode(comp, props, children);
  vnode.ref = ref2;
  vnode.ce = ce;
  delete parent.vnode.ce;
  return vnode;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
const KeepAliveImpl = {
  name: `KeepAlive`,
  // Marker for special handling inside the renderer. We are not using a ===
  // check directly on KeepAlive in the renderer, because importing it directly
  // would prevent it from being tree-shaken.
  __isKeepAlive: true,
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const sharedContext = instance.ctx;
    if (!sharedContext.renderer) {
      return () => {
        const children = slots.default && slots.default();
        return children && children.length === 1 ? children[0] : children;
      };
    }
    const cache = /* @__PURE__ */ new Map();
    const keys = /* @__PURE__ */ new Set();
    let current = null;
    const parentSuspense = instance.suspense;
    const {
      renderer: {
        p: patch,
        m: move,
        um: _unmount,
        o: { createElement }
      }
    } = sharedContext;
    const storageContainer = createElement("div");
    sharedContext.activate = (vnode, container, anchor, namespace, optimized) => {
      const instance2 = vnode.component;
      move(vnode, container, anchor, 0, parentSuspense);
      patch(
        instance2.vnode,
        vnode,
        container,
        anchor,
        instance2,
        parentSuspense,
        namespace,
        vnode.slotScopeIds,
        optimized
      );
      queuePostRenderEffect(() => {
        instance2.isDeactivated = false;
        if (instance2.a) {
          invokeArrayFns(instance2.a);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance2.parent, vnode);
        }
      }, parentSuspense);
    };
    sharedContext.deactivate = (vnode) => {
      const instance2 = vnode.component;
      invalidateMount(instance2.m);
      invalidateMount(instance2.a);
      move(vnode, storageContainer, null, 1, parentSuspense);
      queuePostRenderEffect(() => {
        if (instance2.da) {
          invokeArrayFns(instance2.da);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance2.parent, vnode);
        }
        instance2.isDeactivated = true;
      }, parentSuspense);
    };
    function unmount(vnode) {
      resetShapeFlag(vnode);
      _unmount(vnode, instance, parentSuspense, true);
    }
    function pruneCache(filter) {
      cache.forEach((vnode, key) => {
        const name = getComponentName(vnode.type);
        if (name && !filter(name)) {
          pruneCacheEntry(key);
        }
      });
    }
    function pruneCacheEntry(key) {
      const cached = cache.get(key);
      if (cached && (!current || !isSameVNodeType(cached, current))) {
        unmount(cached);
      } else if (current) {
        resetShapeFlag(current);
      }
      cache.delete(key);
      keys.delete(key);
    }
    watch(
      () => [props.include, props.exclude],
      ([include, exclude]) => {
        include && pruneCache((name) => matches(include, name));
        exclude && pruneCache((name) => !matches(exclude, name));
      },
      // prune post-render after `current` has been updated
      { flush: "post", deep: true }
    );
    let pendingCacheKey = null;
    const cacheSubtree = () => {
      if (pendingCacheKey != null) {
        if (isSuspense(instance.subTree.type)) {
          queuePostRenderEffect(() => {
            cache.set(pendingCacheKey, getInnerChild(instance.subTree));
          }, instance.subTree.suspense);
        } else {
          cache.set(pendingCacheKey, getInnerChild(instance.subTree));
        }
      }
    };
    onMounted(cacheSubtree);
    onUpdated(cacheSubtree);
    onBeforeUnmount(() => {
      cache.forEach((cached) => {
        const { subTree, suspense } = instance;
        const vnode = getInnerChild(subTree);
        if (cached.type === vnode.type && cached.key === vnode.key) {
          resetShapeFlag(vnode);
          const da = vnode.component.da;
          da && queuePostRenderEffect(da, suspense);
          return;
        }
        unmount(cached);
      });
    });
    return () => {
      pendingCacheKey = null;
      if (!slots.default) {
        return current = null;
      }
      const children = slots.default();
      const rawVNode = children[0];
      if (children.length > 1) {
        current = null;
        return children;
      } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
        current = null;
        return rawVNode;
      }
      let vnode = getInnerChild(rawVNode);
      if (vnode.type === Comment) {
        current = null;
        return vnode;
      }
      const comp = vnode.type;
      const name = getComponentName(
        isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
      );
      const { include, exclude, max } = props;
      if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
        vnode.shapeFlag &= ~256;
        current = vnode;
        return rawVNode;
      }
      const key = vnode.key == null ? comp : vnode.key;
      const cachedVNode = cache.get(key);
      if (vnode.el) {
        vnode = cloneVNode(vnode);
        if (rawVNode.shapeFlag & 128) {
          rawVNode.ssContent = vnode;
        }
      }
      pendingCacheKey = key;
      if (cachedVNode) {
        vnode.el = cachedVNode.el;
        vnode.component = cachedVNode.component;
        if (vnode.transition) {
          setTransitionHooks(vnode, vnode.transition);
        }
        vnode.shapeFlag |= 512;
        keys.delete(key);
        keys.add(key);
      } else {
        keys.add(key);
        if (max && keys.size > parseInt(max, 10)) {
          pruneCacheEntry(keys.values().next().value);
        }
      }
      vnode.shapeFlag |= 256;
      current = vnode;
      return isSuspense(rawVNode.type) ? rawVNode : vnode;
    };
  }
};
const KeepAlive = KeepAliveImpl;
function matches(pattern, name) {
  if (isArray(pattern)) {
    return pattern.some((p2) => matches(p2, name));
  } else if (isString(pattern)) {
    return pattern.split(",").includes(name);
  } else if (isRegExp(pattern)) {
    pattern.lastIndex = 0;
    return pattern.test(name);
  }
  return false;
}
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function resetShapeFlag(vnode) {
  vnode.shapeFlag &= ~256;
  vnode.shapeFlag &= ~512;
}
function getInnerChild(vnode) {
  return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  const sourceIsArray = isArray(source);
  if (sourceIsArray || isString(source)) {
    const sourceIsReactiveArray = sourceIsArray && isReactive(source);
    let needsWrap = false;
    if (sourceIsReactiveArray) {
      needsWrap = !isShallow(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(
        needsWrap ? toReactive(source[i]) : source[i],
        i,
        void 0,
        cached && cached[i]
      );
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached && cached[i])
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i];
    if (isArray(slot)) {
      for (let j = 0; j < slot.length; j++) {
        slots[slot[j].name] = slot[j].fn;
      }
    } else if (slot) {
      slots[slot.name] = slot.key ? (...args) => {
        const res = slot.fn(...args);
        if (res)
          res.key = slot.key;
        return res;
      } : slot.fn;
    }
  }
  return slots;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
    if (name !== "default")
      props.name = name;
    return openBlock(), createBlock(
      Fragment,
      null,
      [createVNode("slot", props, fallback && fallback())],
      64
    );
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const slotKey = props.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  validSlotContent && validSlotContent.key;
  const rendered = createBlock(
    Fragment,
    {
      key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) + // #7256 force differentiate fallback content from actual content
      (!validSlotContent && fallback ? "_fb" : "")
    },
    validSlotContent || (fallback ? fallback() : []),
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
function toHandlers(obj, preserveCaseIfNecessary) {
  const ret = {};
  for (const key in obj) {
    ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
const RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ extend({}, PublicInstanceProxyHandlers, {
  get(target, key) {
    if (key === Symbol.unscopables) {
      return;
    }
    return PublicInstanceProxyHandlers.get(target, key, target);
  },
  has(_, key) {
    const has = key[0] !== "_" && !isGloballyAllowed(key);
    return has;
  }
});
function defineProps() {
  return null;
}
function defineEmits() {
  return null;
}
function defineExpose(exposed) {
}
function defineOptions(options) {
}
function defineSlots() {
  return null;
}
function defineModel() {
}
function withDefaults(props, defaults) {
  return null;
}
function useSlots() {
  return getContext().slots;
}
function useAttrs() {
  return getContext().attrs;
}
function getContext() {
  const i = getCurrentInstance();
  return i.setupContext || (i.setupContext = createSetupContext(i));
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function mergeDefaults(raw, defaults) {
  const props = normalizePropsOrEmits(raw);
  for (const key in defaults) {
    if (key.startsWith("__skip"))
      continue;
    let opt = props[key];
    if (opt) {
      if (isArray(opt) || isFunction(opt)) {
        opt = props[key] = { type: opt, default: defaults[key] };
      } else {
        opt.default = defaults[key];
      }
    } else if (opt === null) {
      opt = props[key] = { default: defaults[key] };
    } else
      ;
    if (opt && defaults[`__skip_${key}`]) {
      opt.skipFactory = true;
    }
  }
  return props;
}
function mergeModels(a, b) {
  if (!a || !b)
    return a || b;
  if (isArray(a) && isArray(b))
    return a.concat(b);
  return extend({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
}
function createPropsRestProxy(props, excludedKeys) {
  const ret = {};
  for (const key in props) {
    if (!excludedKeys.includes(key)) {
      Object.defineProperty(ret, key, {
        enumerable: true,
        get: () => props[key]
      });
    }
  }
  return ret;
}
function withAsyncContext(getAwaitable) {
  const ctx = getCurrentInstance();
  let awaitable = getAwaitable();
  unsetCurrentInstance();
  if (isPromise(awaitable)) {
    awaitable = awaitable.catch((e) => {
      setCurrentInstance(ctx);
      throw e;
    });
  }
  return [awaitable, () => setCurrentInstance(ctx)];
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render2 && instance.render === NOOP) {
    instance.render = render2;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render2, hydrate2) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          if (isHydrate && hydrate2) {
            hydrate2(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app._instance,
            16
          );
          render2(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else
      ;
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || key !== "_") {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function createHydrationRenderer(options) {
  return baseCreateRenderer(options, createHydrationFunctions);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode && type.__asyncHydrate) {
            type.__asyncHydrate(
              el,
              instance,
              hydrateSubTree
            );
          } else {
            hydrateSubTree();
          }
        } else {
          if (root.ce) {
            root.ce._injectChildStyle(type);
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref2,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing = false;
  const render2 = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate2;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate2, hydrateNode] = createHydrationFns(
      internals
    );
  }
  return {
    render: render2,
    hydrate: hydrate2,
    createApp: createAppAPI(render2, hydrate2)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= ~32;
    job.flags &= ~4;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags |= 8;
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watchEffect(effect2, options) {
  return doWatch(effect2, null, options);
}
function watchPostEffect(effect2, options) {
  return doWatch(
    effect2,
    null,
    { flush: "post" }
  );
}
function watchSyncEffect(effect2, options) {
  return doWatch(
    effect2,
    null,
    { flush: "sync" }
  );
}
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function useModel(props, name, options = EMPTY_OBJ) {
  const i = getCurrentInstance();
  const camelizedName = camelize(name);
  const hyphenatedName = hyphenate(name);
  const modifiers = getModelModifiers(props, camelizedName);
  const res = customRef((track2, trigger2) => {
    let localValue;
    let prevSetValue = EMPTY_OBJ;
    let prevEmittedValue;
    watchSyncEffect(() => {
      const propValue = props[camelizedName];
      if (hasChanged(localValue, propValue)) {
        localValue = propValue;
        trigger2();
      }
    });
    return {
      get() {
        track2();
        return options.get ? options.get(localValue) : localValue;
      },
      set(value) {
        const emittedValue = options.set ? options.set(value) : value;
        if (!hasChanged(emittedValue, localValue) && !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))) {
          return;
        }
        const rawProps = i.vnode.props;
        if (!(rawProps && // check if parent has passed v-model
        (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps))) {
          localValue = value;
          trigger2();
        }
        i.emit(`update:${name}`, emittedValue);
        if (hasChanged(value, emittedValue) && hasChanged(value, prevSetValue) && !hasChanged(emittedValue, prevEmittedValue)) {
          trigger2();
        }
        prevSetValue = value;
        prevEmittedValue = emittedValue;
      }
    };
  });
  res[Symbol.iterator] = () => {
    let i2 = 0;
    return {
      next() {
        if (i2 < 2) {
          return { value: i2++ ? modifiers || EMPTY_OBJ : res, done: false };
        } else {
          return { done: true };
        }
      }
    };
  };
  return res;
}
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render: render2,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render2.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render22 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render22.length > 1 ? render22(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render22(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    setTransitionHooks(root, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
function filterSingleRoot(children, recurse = true) {
  let singleRoot;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isVNode(child)) {
      if (child.type !== Comment || child.children === "v-if") {
        if (singleRoot) {
          return;
        } else {
          singleRoot = child;
        }
      }
    } else {
      return;
    }
  }
  return singleRoot;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const isSuspense = (type) => type.__isSuspense;
let suspenseId = 0;
const SuspenseImpl = {
  name: "Suspense",
  // In order to make Suspense tree-shakable, we need to avoid importing it
  // directly in the renderer. The renderer checks for the __isSuspense flag
  // on a vnode's type and calls the `process` method, passing in renderer
  // internals.
  __isSuspense: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
    if (n1 == null) {
      mountSuspense(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        rendererInternals
      );
    } else {
      if (parentSuspense && parentSuspense.deps > 0 && !n1.suspense.isInFallback) {
        n2.suspense = n1.suspense;
        n2.suspense.vnode = n2;
        n2.el = n1.el;
        return;
      }
      patchSuspense(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        namespace,
        slotScopeIds,
        optimized,
        rendererInternals
      );
    }
  },
  hydrate: hydrateSuspense,
  normalize: normalizeSuspenseChildren
};
const Suspense = SuspenseImpl;
function triggerEvent(vnode, name) {
  const eventListener = vnode.props && vnode.props[name];
  if (isFunction(eventListener)) {
    eventListener();
  }
}
function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
  const {
    p: patch,
    o: { createElement }
  } = rendererInternals;
  const hiddenContainer = createElement("div");
  const suspense = vnode.suspense = createSuspenseBoundary(
    vnode,
    parentSuspense,
    parentComponent,
    container,
    hiddenContainer,
    anchor,
    namespace,
    slotScopeIds,
    optimized,
    rendererInternals
  );
  patch(
    null,
    suspense.pendingBranch = vnode.ssContent,
    hiddenContainer,
    null,
    parentComponent,
    suspense,
    namespace,
    slotScopeIds
  );
  if (suspense.deps > 0) {
    triggerEvent(vnode, "onPending");
    triggerEvent(vnode, "onFallback");
    patch(
      null,
      vnode.ssFallback,
      container,
      anchor,
      parentComponent,
      null,
      // fallback tree will not have suspense context
      namespace,
      slotScopeIds
    );
    setActiveBranch(suspense, vnode.ssFallback);
  } else {
    suspense.resolve(false, true);
  }
}
function patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
  const suspense = n2.suspense = n1.suspense;
  suspense.vnode = n2;
  n2.el = n1.el;
  const newBranch = n2.ssContent;
  const newFallback = n2.ssFallback;
  const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
  if (pendingBranch) {
    suspense.pendingBranch = newBranch;
    if (isSameVNodeType(newBranch, pendingBranch)) {
      patch(
        pendingBranch,
        newBranch,
        suspense.hiddenContainer,
        null,
        parentComponent,
        suspense,
        namespace,
        slotScopeIds,
        optimized
      );
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else if (isInFallback) {
        if (!isHydrating) {
          patch(
            activeBranch,
            newFallback,
            container,
            anchor,
            parentComponent,
            null,
            // fallback tree will not have suspense context
            namespace,
            slotScopeIds,
            optimized
          );
          setActiveBranch(suspense, newFallback);
        }
      }
    } else {
      suspense.pendingId = suspenseId++;
      if (isHydrating) {
        suspense.isHydrating = false;
        suspense.activeBranch = pendingBranch;
      } else {
        unmount(pendingBranch, parentComponent, suspense);
      }
      suspense.deps = 0;
      suspense.effects.length = 0;
      suspense.hiddenContainer = createElement("div");
      if (isInFallback) {
        patch(
          null,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          patch(
            activeBranch,
            newFallback,
            container,
            anchor,
            parentComponent,
            null,
            // fallback tree will not have suspense context
            namespace,
            slotScopeIds,
            optimized
          );
          setActiveBranch(suspense, newFallback);
        }
      } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        patch(
          activeBranch,
          newBranch,
          container,
          anchor,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        suspense.resolve(true);
      } else {
        patch(
          null,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        }
      }
    }
  } else {
    if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
      patch(
        activeBranch,
        newBranch,
        container,
        anchor,
        parentComponent,
        suspense,
        namespace,
        slotScopeIds,
        optimized
      );
      setActiveBranch(suspense, newBranch);
    } else {
      triggerEvent(n2, "onPending");
      suspense.pendingBranch = newBranch;
      if (newBranch.shapeFlag & 512) {
        suspense.pendingId = newBranch.component.suspenseId;
      } else {
        suspense.pendingId = suspenseId++;
      }
      patch(
        null,
        newBranch,
        suspense.hiddenContainer,
        null,
        parentComponent,
        suspense,
        namespace,
        slotScopeIds,
        optimized
      );
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else {
        const { timeout, pendingId } = suspense;
        if (timeout > 0) {
          setTimeout(() => {
            if (suspense.pendingId === pendingId) {
              suspense.fallback(newFallback);
            }
          }, timeout);
        } else if (timeout === 0) {
          suspense.fallback(newFallback);
        }
      }
    }
  }
}
function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
  const {
    p: patch,
    m: move,
    um: unmount,
    n: next,
    o: { parentNode, remove: remove2 }
  } = rendererInternals;
  let parentSuspenseId;
  const isSuspensible = isVNodeSuspensible(vnode);
  if (isSuspensible) {
    if (parentSuspense && parentSuspense.pendingBranch) {
      parentSuspenseId = parentSuspense.pendingId;
      parentSuspense.deps++;
    }
  }
  const timeout = vnode.props ? toNumber(vnode.props.timeout) : void 0;
  const initialAnchor = anchor;
  const suspense = {
    vnode,
    parent: parentSuspense,
    parentComponent,
    namespace,
    container,
    hiddenContainer,
    deps: 0,
    pendingId: suspenseId++,
    timeout: typeof timeout === "number" ? timeout : -1,
    activeBranch: null,
    pendingBranch: null,
    isInFallback: !isHydrating,
    isHydrating,
    isUnmounted: false,
    effects: [],
    resolve(resume = false, sync = false) {
      const {
        vnode: vnode2,
        activeBranch,
        pendingBranch,
        pendingId,
        effects,
        parentComponent: parentComponent2,
        container: container2
      } = suspense;
      let delayEnter = false;
      if (suspense.isHydrating) {
        suspense.isHydrating = false;
      } else if (!resume) {
        delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = () => {
            if (pendingId === suspense.pendingId) {
              move(
                pendingBranch,
                container2,
                anchor === initialAnchor ? next(activeBranch) : anchor,
                0
              );
              queuePostFlushCb(effects);
            }
          };
        }
        if (activeBranch) {
          if (parentNode(activeBranch.el) === container2) {
            anchor = next(activeBranch);
          }
          unmount(activeBranch, parentComponent2, suspense, true);
        }
        if (!delayEnter) {
          move(pendingBranch, container2, anchor, 0);
        }
      }
      setActiveBranch(suspense, pendingBranch);
      suspense.pendingBranch = null;
      suspense.isInFallback = false;
      let parent = suspense.parent;
      let hasUnresolvedAncestor = false;
      while (parent) {
        if (parent.pendingBranch) {
          parent.effects.push(...effects);
          hasUnresolvedAncestor = true;
          break;
        }
        parent = parent.parent;
      }
      if (!hasUnresolvedAncestor && !delayEnter) {
        queuePostFlushCb(effects);
      }
      suspense.effects = [];
      if (isSuspensible) {
        if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
          parentSuspense.deps--;
          if (parentSuspense.deps === 0 && !sync) {
            parentSuspense.resolve();
          }
        }
      }
      triggerEvent(vnode2, "onResolve");
    },
    fallback(fallbackVNode) {
      if (!suspense.pendingBranch) {
        return;
      }
      const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, namespace: namespace2 } = suspense;
      triggerEvent(vnode2, "onFallback");
      const anchor2 = next(activeBranch);
      const mountFallback = () => {
        if (!suspense.isInFallback) {
          return;
        }
        patch(
          null,
          fallbackVNode,
          container2,
          anchor2,
          parentComponent2,
          null,
          // fallback tree will not have suspense context
          namespace2,
          slotScopeIds,
          optimized
        );
        setActiveBranch(suspense, fallbackVNode);
      };
      const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
      if (delayEnter) {
        activeBranch.transition.afterLeave = mountFallback;
      }
      suspense.isInFallback = true;
      unmount(
        activeBranch,
        parentComponent2,
        null,
        // no suspense so unmount hooks fire now
        true
        // shouldRemove
      );
      if (!delayEnter) {
        mountFallback();
      }
    },
    move(container2, anchor2, type) {
      suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
      suspense.container = container2;
    },
    next() {
      return suspense.activeBranch && next(suspense.activeBranch);
    },
    registerDep(instance, setupRenderEffect, optimized2) {
      const isInPendingSuspense = !!suspense.pendingBranch;
      if (isInPendingSuspense) {
        suspense.deps++;
      }
      const hydratedEl = instance.vnode.el;
      instance.asyncDep.catch((err) => {
        handleError(err, instance, 0);
      }).then((asyncSetupResult) => {
        if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
          return;
        }
        instance.asyncResolved = true;
        const { vnode: vnode2 } = instance;
        handleSetupResult(instance, asyncSetupResult, false);
        if (hydratedEl) {
          vnode2.el = hydratedEl;
        }
        const placeholder = !hydratedEl && instance.subTree.el;
        setupRenderEffect(
          instance,
          vnode2,
          // component may have been moved before resolve.
          // if this is not a hydration, instance.subTree will be the comment
          // placeholder.
          parentNode(hydratedEl || instance.subTree.el),
          // anchor will not be used if this is hydration, so only need to
          // consider the comment placeholder case.
          hydratedEl ? null : next(instance.subTree),
          suspense,
          namespace,
          optimized2
        );
        if (placeholder) {
          remove2(placeholder);
        }
        updateHOCHostEl(instance, vnode2.el);
        if (isInPendingSuspense && --suspense.deps === 0) {
          suspense.resolve();
        }
      });
    },
    unmount(parentSuspense2, doRemove) {
      suspense.isUnmounted = true;
      if (suspense.activeBranch) {
        unmount(
          suspense.activeBranch,
          parentComponent,
          parentSuspense2,
          doRemove
        );
      }
      if (suspense.pendingBranch) {
        unmount(
          suspense.pendingBranch,
          parentComponent,
          parentSuspense2,
          doRemove
        );
      }
    }
  };
  return suspense;
}
function hydrateSuspense(node, vnode, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals, hydrateNode) {
  const suspense = vnode.suspense = createSuspenseBoundary(
    vnode,
    parentSuspense,
    parentComponent,
    node.parentNode,
    // eslint-disable-next-line no-restricted-globals
    document.createElement("div"),
    null,
    namespace,
    slotScopeIds,
    optimized,
    rendererInternals,
    true
  );
  const result = hydrateNode(
    node,
    suspense.pendingBranch = vnode.ssContent,
    parentComponent,
    suspense,
    slotScopeIds,
    optimized
  );
  if (suspense.deps === 0) {
    suspense.resolve(false, true);
  }
  return result;
}
function normalizeSuspenseChildren(vnode) {
  const { shapeFlag, children } = vnode;
  const isSlotChildren = shapeFlag & 32;
  vnode.ssContent = normalizeSuspenseSlot(
    isSlotChildren ? children.default : children
  );
  vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
}
function normalizeSuspenseSlot(s) {
  let block;
  if (isFunction(s)) {
    const trackBlock = isBlockTreeEnabled && s._c;
    if (trackBlock) {
      s._d = false;
      openBlock();
    }
    s = s();
    if (trackBlock) {
      s._d = true;
      block = currentBlock;
      closeBlock();
    }
  }
  if (isArray(s)) {
    const singleChild = filterSingleRoot(s);
    s = singleChild;
  }
  s = normalizeVNode(s);
  if (block && !s.dynamicChildren) {
    s.dynamicChildren = block.filter((c) => c !== s);
  }
  return s;
}
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function setActiveBranch(suspense, branch) {
  suspense.activeBranch = branch;
  const { vnode, parentComponent } = suspense;
  let el = branch.el;
  while (!el && branch.component) {
    branch = branch.component.subTree;
    el = branch.el;
  }
  vnode.el = el;
  if (parentComponent && parentComponent.subTree === vnode) {
    parentComponent.vnode.el = el;
    updateHOCHostEl(parentComponent, el);
  }
}
function isVNodeSuspensible(vnode) {
  const suspensible = vnode.props && vnode.props.suspensible;
  return suspensible != null && suspensible !== false;
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
function transformVNodeArgs(transformer) {
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref2,
  ref_key,
  ref_for
}) => {
  if (typeof ref2 === "number") {
    ref2 = "" + ref2;
  }
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref2, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key]))
      setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1)
        setters.forEach((set) => set(v));
      else
        setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile$1;
let installWithProxy;
function registerRuntimeCompiler(_compile) {
  compile$1 = _compile;
  installWithProxy = (i) => {
    if (i.render._rc) {
      i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
    }
  };
}
const isRuntimeOnly = () => !compile$1;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile$1 && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile$1(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
    if (installWithProxy) {
      installWithProxy(instance);
    }
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
function initCustomFormatter() {
  {
    return;
  }
}
function withMemo(memo, render2, cache, index) {
  const cached = cache[index];
  if (cached && isMemoSame(cached, memo)) {
    return cached;
  }
  const ret = render2();
  ret.memo = memo.slice();
  ret.cacheIndex = index;
  return cache[index] = ret;
}
function isMemoSame(cached, memo) {
  const prev = cached.memo;
  if (prev.length != memo.length) {
    return false;
  }
  for (let i = 0; i < prev.length; i++) {
    if (hasChanged(prev[i], memo[i])) {
      return false;
    }
  }
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(cached);
  }
  return true;
}
const version = "3.5.13";
const warn = NOOP;
const ErrorTypeStrings = ErrorTypeStrings$1;
const devtools = devtools$1;
const setDevtoolsHook = setDevtoolsHook$1;
const _ssrUtils = {
  createComponentInstance,
  setupComponent,
  renderComponentRoot,
  setCurrentRenderingInstance,
  isVNode,
  normalizeVNode,
  getComponentPublicInstance,
  ensureValidVNode,
  pushWarningContext,
  popWarningContext
};
const ssrUtils = _ssrUtils;
const resolveFilter = null;
const compatUtils = null;
const DeprecationTypes = null;
/**
* @vue/runtime-dom v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const TRANSITION = "transition";
const ANIMATION = "animation";
const vtcKey = Symbol("_vtc");
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = /* @__PURE__ */ extend(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const decorate$1 = (t) => {
  t.displayName = "Transition";
  t.props = TransitionPropsValidators;
  return t;
};
const Transition = /* @__PURE__ */ decorate$1(
  (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots)
);
const callHook = (hook, args = []) => {
  if (isArray(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const {
    name = "v",
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;
  const finishEnter = (el, isAppear, done, isCancelled) => {
    el._enterCancelled = isCancelled;
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      if (!el._enterCancelled) {
        forceReflow();
        addTransitionClass(el, leaveActiveClass);
      } else {
        addTransitionClass(el, leaveActiveClass);
        forceReflow();
      }
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false, void 0, true);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true, void 0, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const _vtc = el[vtcKey];
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el[vtcKey] = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout != null) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
    getStyleProperties(`${TRANSITION}Property`).toString()
  );
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  if (s === "auto")
    return 0;
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el[vShowOriginalDisplay] : "none";
  el[vShowHidden] = !value;
}
function initVShowForSSR() {
  vShow.getSSRProps = ({ value }) => {
    if (!value) {
      return { style: { display: "none" } };
    }
  };
}
const CSS_VAR_TEXT = Symbol("");
function useCssVars(getter) {
  const instance = getCurrentInstance();
  if (!instance) {
    return;
  }
  const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
    Array.from(
      document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
    ).forEach((node) => setVarsOnNode(node, vars));
  };
  const setVars = () => {
    const vars = getter(instance.proxy);
    if (instance.ce) {
      setVarsOnNode(instance.ce, vars);
    } else {
      setVarsOnVNode(instance.subTree, vars);
    }
    updateTeleports(vars);
  };
  onBeforeUpdate(() => {
    queuePostFlushCb(setVars);
  });
  onMounted(() => {
    watch(setVars, NOOP, { flush: "post" });
    const ob = new MutationObserver(setVars);
    ob.observe(instance.subTree.el.parentNode, { childList: true });
    onUnmounted(() => ob.disconnect());
  });
}
function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  }
  while (vnode.component) {
    vnode = vnode.component.subTree;
  }
  if (vnode.shapeFlag & 1 && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === Fragment) {
    vnode.children.forEach((c) => setVarsOnVNode(c, vars));
  } else if (vnode.type === Static) {
    let { el, anchor } = vnode;
    while (el) {
      setVarsOnNode(el, vars);
      if (el === anchor)
        break;
      el = el.nextSibling;
    }
  }
}
function setVarsOnNode(el, vars) {
  if (el.nodeType === 1) {
    const style = el.style;
    let cssText = "";
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
      cssText += `--${key}: ${vars[key]};`;
    }
    style[CSS_VAR_TEXT] = cssText;
  }
}
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const REMOVAL = {};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineCustomElement(options, extraOptions, _createApp) {
  const Comp = /* @__PURE__ */ defineComponent(options, extraOptions);
  if (isPlainObject(Comp))
    extend(Comp, extraOptions);
  class VueCustomElement extends VueElement {
    constructor(initialProps) {
      super(Comp, initialProps, _createApp);
    }
  }
  VueCustomElement.def = Comp;
  return VueCustomElement;
}
/*! #__NO_SIDE_EFFECTS__ */
const defineSSRCustomElement = /* @__NO_SIDE_EFFECTS__ */ (options, extraOptions) => {
  return /* @__PURE__ */ defineCustomElement(options, extraOptions, createSSRApp);
};
const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
};
class VueElement extends BaseClass {
  constructor(_def, _props = {}, _createApp = createApp) {
    super();
    this._def = _def;
    this._props = _props;
    this._createApp = _createApp;
    this._isVueCE = true;
    this._instance = null;
    this._app = null;
    this._nonce = this._def.nonce;
    this._connected = false;
    this._resolved = false;
    this._numberProps = null;
    this._styleChildren = /* @__PURE__ */ new WeakSet();
    this._ob = null;
    if (this.shadowRoot && _createApp !== createApp) {
      this._root = this.shadowRoot;
    } else {
      if (_def.shadowRoot !== false) {
        this.attachShadow({ mode: "open" });
        this._root = this.shadowRoot;
      } else {
        this._root = this;
      }
    }
    if (!this._def.__asyncLoader) {
      this._resolveProps(this._def);
    }
  }
  connectedCallback() {
    if (!this.isConnected)
      return;
    if (!this.shadowRoot) {
      this._parseSlots();
    }
    this._connected = true;
    let parent = this;
    while (parent = parent && (parent.parentNode || parent.host)) {
      if (parent instanceof VueElement) {
        this._parent = parent;
        break;
      }
    }
    if (!this._instance) {
      if (this._resolved) {
        this._setParent();
        this._update();
      } else {
        if (parent && parent._pendingResolve) {
          this._pendingResolve = parent._pendingResolve.then(() => {
            this._pendingResolve = void 0;
            this._resolveDef();
          });
        } else {
          this._resolveDef();
        }
      }
    }
  }
  _setParent(parent = this._parent) {
    if (parent) {
      this._instance.parent = parent._instance;
      this._instance.provides = parent._instance.provides;
    }
  }
  disconnectedCallback() {
    this._connected = false;
    nextTick(() => {
      if (!this._connected) {
        if (this._ob) {
          this._ob.disconnect();
          this._ob = null;
        }
        this._app && this._app.unmount();
        if (this._instance)
          this._instance.ce = void 0;
        this._app = this._instance = null;
      }
    });
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    if (this._pendingResolve) {
      return;
    }
    for (let i = 0; i < this.attributes.length; i++) {
      this._setAttr(this.attributes[i].name);
    }
    this._ob = new MutationObserver((mutations) => {
      for (const m of mutations) {
        this._setAttr(m.attributeName);
      }
    });
    this._ob.observe(this, { attributes: true });
    const resolve2 = (def2, isAsync = false) => {
      this._resolved = true;
      this._pendingResolve = void 0;
      const { props, styles } = def2;
      let numberProps;
      if (props && !isArray(props)) {
        for (const key in props) {
          const opt = props[key];
          if (opt === Number || opt && opt.type === Number) {
            if (key in this._props) {
              this._props[key] = toNumber(this._props[key]);
            }
            (numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[camelize(key)] = true;
          }
        }
      }
      this._numberProps = numberProps;
      if (isAsync) {
        this._resolveProps(def2);
      }
      if (this.shadowRoot) {
        this._applyStyles(styles);
      }
      this._mount(def2);
    };
    const asyncDef = this._def.__asyncLoader;
    if (asyncDef) {
      this._pendingResolve = asyncDef().then(
        (def2) => resolve2(this._def = def2, true)
      );
    } else {
      resolve2(this._def);
    }
  }
  _mount(def2) {
    this._app = this._createApp(def2);
    if (def2.configureApp) {
      def2.configureApp(this._app);
    }
    this._app._ceVNode = this._createVNode();
    this._app.mount(this._root);
    const exposed = this._instance && this._instance.exposed;
    if (!exposed)
      return;
    for (const key in exposed) {
      if (!hasOwn(this, key)) {
        Object.defineProperty(this, key, {
          // unwrap ref to be consistent with public instance behavior
          get: () => unref(exposed[key])
        });
      }
    }
  }
  _resolveProps(def2) {
    const { props } = def2;
    const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
    for (const key of Object.keys(this)) {
      if (key[0] !== "_" && declaredPropKeys.includes(key)) {
        this._setProp(key, this[key]);
      }
    }
    for (const key of declaredPropKeys.map(camelize)) {
      Object.defineProperty(this, key, {
        get() {
          return this._getProp(key);
        },
        set(val) {
          this._setProp(key, val, true, true);
        }
      });
    }
  }
  _setAttr(key) {
    if (key.startsWith("data-v-"))
      return;
    const has = this.hasAttribute(key);
    let value = has ? this.getAttribute(key) : REMOVAL;
    const camelKey = camelize(key);
    if (has && this._numberProps && this._numberProps[camelKey]) {
      value = toNumber(value);
    }
    this._setProp(camelKey, value, false, true);
  }
  /**
   * @internal
   */
  _getProp(key) {
    return this._props[key];
  }
  /**
   * @internal
   */
  _setProp(key, val, shouldReflect = true, shouldUpdate = false) {
    if (val !== this._props[key]) {
      if (val === REMOVAL) {
        delete this._props[key];
      } else {
        this._props[key] = val;
        if (key === "key" && this._app) {
          this._app._ceVNode.key = val;
        }
      }
      if (shouldUpdate && this._instance) {
        this._update();
      }
      if (shouldReflect) {
        const ob = this._ob;
        ob && ob.disconnect();
        if (val === true) {
          this.setAttribute(hyphenate(key), "");
        } else if (typeof val === "string" || typeof val === "number") {
          this.setAttribute(hyphenate(key), val + "");
        } else if (!val) {
          this.removeAttribute(hyphenate(key));
        }
        ob && ob.observe(this, { attributes: true });
      }
    }
  }
  _update() {
    render(this._createVNode(), this._root);
  }
  _createVNode() {
    const baseProps = {};
    if (!this.shadowRoot) {
      baseProps.onVnodeMounted = baseProps.onVnodeUpdated = this._renderSlots.bind(this);
    }
    const vnode = createVNode(this._def, extend(baseProps, this._props));
    if (!this._instance) {
      vnode.ce = (instance) => {
        this._instance = instance;
        instance.ce = this;
        instance.isCE = true;
        const dispatch = (event, args) => {
          this.dispatchEvent(
            new CustomEvent(
              event,
              isPlainObject(args[0]) ? extend({ detail: args }, args[0]) : { detail: args }
            )
          );
        };
        instance.emit = (event, ...args) => {
          dispatch(event, args);
          if (hyphenate(event) !== event) {
            dispatch(hyphenate(event), args);
          }
        };
        this._setParent();
      };
    }
    return vnode;
  }
  _applyStyles(styles, owner) {
    if (!styles)
      return;
    if (owner) {
      if (owner === this._def || this._styleChildren.has(owner)) {
        return;
      }
      this._styleChildren.add(owner);
    }
    const nonce = this._nonce;
    for (let i = styles.length - 1; i >= 0; i--) {
      const s = document.createElement("style");
      if (nonce)
        s.setAttribute("nonce", nonce);
      s.textContent = styles[i];
      this.shadowRoot.prepend(s);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _parseSlots() {
    const slots = this._slots = {};
    let n;
    while (n = this.firstChild) {
      const slotName = n.nodeType === 1 && n.getAttribute("slot") || "default";
      (slots[slotName] || (slots[slotName] = [])).push(n);
      this.removeChild(n);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _renderSlots() {
    const outlets = (this._teleportTarget || this).querySelectorAll("slot");
    const scopeId = this._instance.type.__scopeId;
    for (let i = 0; i < outlets.length; i++) {
      const o = outlets[i];
      const slotName = o.getAttribute("name") || "default";
      const content = this._slots[slotName];
      const parent = o.parentNode;
      if (content) {
        for (const n of content) {
          if (scopeId && n.nodeType === 1) {
            const id = scopeId + "-s";
            const walker = document.createTreeWalker(n, 1);
            n.setAttribute(id, "");
            let child;
            while (child = walker.nextNode()) {
              child.setAttribute(id, "");
            }
          }
          parent.insertBefore(n, o);
        }
      } else {
        while (o.firstChild)
          parent.insertBefore(o.firstChild, o);
      }
      parent.removeChild(o);
    }
  }
  /**
   * @internal
   */
  _injectChildStyle(comp) {
    this._applyStyles(comp.styles, comp);
  }
  /**
   * @internal
   */
  _removeChildStyle(comp) {
  }
}
function useHost(caller) {
  const instance = getCurrentInstance();
  const el = instance && instance.ce;
  if (el) {
    return el;
  }
  return null;
}
function useShadowRoot() {
  const el = useHost();
  return el && el.shadowRoot;
}
function useCssModule(name = "$style") {
  {
    const instance = getCurrentInstance();
    if (!instance) {
      return EMPTY_OBJ;
    }
    const modules = instance.type.__cssModules;
    if (!modules) {
      return EMPTY_OBJ;
    }
    const mod = modules[name];
    if (!mod) {
      return EMPTY_OBJ;
    }
    return mod;
  }
}
const positionMap = /* @__PURE__ */ new WeakMap();
const newPositionMap = /* @__PURE__ */ new WeakMap();
const moveCbKey = Symbol("_moveCb");
const enterCbKey = Symbol("_enterCb");
const decorate = (t) => {
  delete t.props.mode;
  return t;
};
const TransitionGroupImpl = /* @__PURE__ */ decorate({
  name: "TransitionGroup",
  props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevChildren;
    let children;
    onUpdated(() => {
      if (!prevChildren.length) {
        return;
      }
      const moveClass = props.moveClass || `${props.name || "v"}-move`;
      if (!hasCSSTransform(
        prevChildren[0].el,
        instance.vnode.el,
        moveClass
      )) {
        return;
      }
      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation);
      forceReflow();
      movedChildren.forEach((c) => {
        const el = c.el;
        const style = el.style;
        addTransitionClass(el, moveClass);
        style.transform = style.webkitTransform = style.transitionDuration = "";
        const cb = el[moveCbKey] = (e) => {
          if (e && e.target !== el) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener("transitionend", cb);
            el[moveCbKey] = null;
            removeTransitionClass(el, moveClass);
          }
        };
        el.addEventListener("transitionend", cb);
      });
    });
    return () => {
      const rawProps = toRaw(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      let tag = rawProps.tag || Fragment;
      prevChildren = [];
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.el && child.el instanceof Element) {
            prevChildren.push(child);
            setTransitionHooks(
              child,
              resolveTransitionHooks(
                child,
                cssTransitionProps,
                state,
                instance
              )
            );
            positionMap.set(
              child,
              child.el.getBoundingClientRect()
            );
          }
        }
      }
      children = slots.default ? getTransitionRawChildren(slots.default()) : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key != null) {
          setTransitionHooks(
            child,
            resolveTransitionHooks(child, cssTransitionProps, state, instance)
          );
        }
      }
      return createVNode(tag, null, children);
    };
  }
});
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
  const el = c.el;
  if (el[moveCbKey]) {
    el[moveCbKey]();
  }
  if (el[enterCbKey]) {
    el[enterCbKey]();
  }
}
function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;
  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = "0s";
    return c;
  }
}
function hasCSSTransform(el, root, moveClass) {
  const clone = el.cloneNode();
  const _vtc = el[vtcKey];
  if (_vtc) {
    _vtc.forEach((cls) => {
      cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
    });
  }
  moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
  clone.style.display = "none";
  const container = root.nodeType === 1 ? root : root.parentNode;
  container.appendChild(clone);
  const { hasTransform } = getTransitionInfo(clone);
  container.removeChild(clone);
  return hasTransform;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = Symbol("_assign");
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing)
        return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el[assignKey](domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (el.composing)
      return;
    const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    if (document.activeElement === el && el.type !== "range") {
      if (lazy && value === oldValue) {
        return;
      }
      if (trim && el.value.trim() === newValue) {
        return;
      }
    }
    el.value = newValue;
  }
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign = el[assignKey];
      if (isArray(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign(cloned);
      } else {
        assign(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  let checked;
  if (isArray(value)) {
    checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    checked = value.has(vnode.props.value);
  } else {
    if (value === oldValue)
      return;
    checked = looseEqual(value, getCheckboxValue(el, true));
  }
  if (el.checked !== checked) {
    el.checked = checked;
  }
}
const vModelRadio = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props.value);
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      el[assignKey](getValue(el));
    });
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (value !== oldValue) {
      el.checked = looseEqual(value, vnode.props.value);
    }
  }
};
const vModelSelect = {
  // <select multiple> value need to be deep traversed
  deep: true,
  created(el, { value, modifiers: { number } }, vnode) {
    const isSetModel = isSet(value);
    addEventListener(el, "change", () => {
      const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
        (o) => number ? looseToNumber(getValue(o)) : getValue(o)
      );
      el[assignKey](
        el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
      );
      el._assigning = true;
      nextTick(() => {
        el._assigning = false;
      });
    });
    el[assignKey] = getModelAssigner(vnode);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value }) {
    setSelected(el, value);
  },
  beforeUpdate(el, _binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
  },
  updated(el, { value }) {
    if (!el._assigning) {
      setSelected(el, value);
    }
  }
};
function setSelected(el, value) {
  const isMultiple = el.multiple;
  const isArrayValue = isArray(value);
  if (isMultiple && !isArrayValue && !isSet(value)) {
    return;
  }
  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i];
    const optionValue = getValue(option);
    if (isMultiple) {
      if (isArrayValue) {
        const optionType = typeof optionValue;
        if (optionType === "string" || optionType === "number") {
          option.selected = value.some((v) => String(v) === String(optionValue));
        } else {
          option.selected = looseIndexOf(value, optionValue) > -1;
        }
      } else {
        option.selected = value.has(optionValue);
      }
    } else if (looseEqual(getValue(option), value)) {
      if (el.selectedIndex !== i)
        el.selectedIndex = i;
      return;
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1;
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const vModelDynamic = {
  created(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, "created");
  },
  mounted(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, "mounted");
  },
  beforeUpdate(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
  },
  updated(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, "updated");
  }
};
function resolveDynamicModel(tagName, type) {
  switch (tagName) {
    case "SELECT":
      return vModelSelect;
    case "TEXTAREA":
      return vModelText;
    default:
      switch (type) {
        case "checkbox":
          return vModelCheckbox;
        case "radio":
          return vModelRadio;
        default:
          return vModelText;
      }
  }
}
function callModelHook(el, binding, vnode, prevVNode, hook) {
  const modelToUse = resolveDynamicModel(
    el.tagName,
    vnode.props && vnode.props.type
  );
  const fn = modelToUse[hook];
  fn && fn(el, binding, vnode, prevVNode);
}
function initVModelForSSR() {
  vModelText.getSSRProps = ({ value }) => ({ value });
  vModelRadio.getSSRProps = ({ value }, vnode) => {
    if (vnode.props && looseEqual(vnode.props.value, value)) {
      return { checked: true };
    }
  };
  vModelCheckbox.getSSRProps = ({ value }, vnode) => {
    if (isArray(value)) {
      if (vnode.props && looseIndexOf(value, vnode.props.value) > -1) {
        return { checked: true };
      }
    } else if (isSet(value)) {
      if (vnode.props && value.has(vnode.props.value)) {
        return { checked: true };
      }
    } else if (value) {
      return { checked: true };
    }
  };
  vModelDynamic.getSSRProps = (binding, vnode) => {
    if (typeof vnode.type !== "string") {
      return;
    }
    const modelToUse = resolveDynamicModel(
      // resolveDynamicModel expects an uppercase tag name, but vnode.type is lowercase
      vnode.type.toUpperCase(),
      vnode.props && vnode.props.type
    );
    if (modelToUse.getSSRProps) {
      return modelToUse.getSSRProps(binding, vnode);
    }
  };
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn(event, ...args);
  });
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  const cache = fn._withKeys || (fn._withKeys = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some(
      (k) => k === eventKey || keyNames[k] === eventKey
    )) {
      return fn(event);
    }
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
let enabledHydration = false;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
function ensureHydrationRenderer() {
  renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
  enabledHydration = true;
  return renderer;
}
const render = (...args) => {
  ensureRenderer().render(...args);
};
const hydrate = (...args) => {
  ensureHydrationRenderer().hydrate(...args);
};
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
const createSSRApp = (...args) => {
  const app = ensureHydrationRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (container) {
      return mount(container, true, resolveRootNamespace(container));
    }
  };
  return app;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
let ssrDirectiveInitialized = false;
const initDirectivesForSSR = () => {
  if (!ssrDirectiveInitialized) {
    ssrDirectiveInitialized = true;
    initVModelForSSR();
    initVShowForSSR();
  }
};
/**
* vue v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const compile = () => {
};
const vue_runtime_esmBundler = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BaseTransition,
  BaseTransitionPropsValidators,
  Comment,
  DeprecationTypes,
  EffectScope,
  ErrorCodes,
  ErrorTypeStrings,
  Fragment,
  KeepAlive,
  ReactiveEffect,
  Static,
  Suspense,
  Teleport,
  Text,
  TrackOpTypes,
  Transition,
  TransitionGroup,
  TriggerOpTypes,
  VueElement,
  assertNumber,
  callWithAsyncErrorHandling,
  callWithErrorHandling,
  camelize,
  capitalize,
  cloneVNode,
  compatUtils,
  compile,
  computed,
  createApp,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode: createBaseVNode,
  createHydrationRenderer,
  createPropsRestProxy,
  createRenderer,
  createSSRApp,
  createSlots,
  createStaticVNode,
  createTextVNode,
  createVNode,
  customRef,
  defineAsyncComponent,
  defineComponent,
  defineCustomElement,
  defineEmits,
  defineExpose,
  defineModel,
  defineOptions,
  defineProps,
  defineSSRCustomElement,
  defineSlots,
  devtools,
  effect,
  effectScope,
  getCurrentInstance,
  getCurrentScope,
  getCurrentWatcher,
  getTransitionRawChildren,
  guardReactiveProps,
  h,
  handleError,
  hasInjectionContext,
  hydrate,
  hydrateOnIdle,
  hydrateOnInteraction,
  hydrateOnMediaQuery,
  hydrateOnVisible,
  initCustomFormatter,
  initDirectivesForSSR,
  inject,
  isMemoSame,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  isRuntimeOnly,
  isShallow,
  isVNode,
  markRaw,
  mergeDefaults,
  mergeModels,
  mergeProps,
  nextTick,
  normalizeClass,
  normalizeProps,
  normalizeStyle,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onScopeDispose,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
  onWatcherCleanup,
  openBlock,
  popScopeId,
  provide,
  proxyRefs,
  pushScopeId,
  queuePostFlushCb,
  reactive,
  readonly,
  ref,
  registerRuntimeCompiler,
  render,
  renderList,
  renderSlot,
  resolveComponent,
  resolveDirective,
  resolveDynamicComponent,
  resolveFilter,
  resolveTransitionHooks,
  setBlockTracking,
  setDevtoolsHook,
  setTransitionHooks,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  ssrContextKey,
  ssrUtils,
  stop,
  toDisplayString,
  toHandlerKey,
  toHandlers,
  toRaw,
  toRef,
  toRefs,
  toValue,
  transformVNodeArgs,
  triggerRef,
  unref,
  useAttrs,
  useCssModule,
  useCssVars,
  useHost,
  useId,
  useModel,
  useSSRContext,
  useShadowRoot,
  useSlots,
  useTemplateRef,
  useTransitionState,
  vModelCheckbox,
  vModelDynamic,
  vModelRadio,
  vModelSelect,
  vModelText,
  vShow,
  version,
  warn,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect,
  withAsyncContext,
  withCtx,
  withDefaults,
  withDirectives,
  withKeys,
  withMemo,
  withModifiers,
  withScopeId
}, Symbol.toStringTag, { value: "Module" }));
const postFilterApp_vue_vue_type_style_index_0_scoped_8fc298c5_lang = "";
const postFilterApp_vue_vue_type_style_index_1_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$5 = {
  key: 0,
  id: "tag-filter-container",
  class: "tag-filter-container"
};
const _hoisted_2$5 = ["aria-label"];
const _hoisted_3$5 = ["aria-checked", "tabindex", "aria-label", "data-category-slug", "id", "onClick", "onKeydown"];
const _hoisted_4$5 = ["src"];
const _hoisted_5$5 = { style: { "display": "flex", "align-items": "center", "justify-content": "space-between" } };
const _hoisted_6$5 = {
  key: 0,
  id: "action-title",
  tabindex: "0",
  "aria-live": "polite"
};
const _hoisted_7$5 = { key: 0 };
const _hoisted_8$5 = { key: 1 };
const _hoisted_9$5 = { class: "filter-options" };
const _hoisted_10$5 = ["onKeydown"];
const _hoisted_11$5 = {
  key: 1,
  class: "alignfull wp-block-columns card-container"
};
const _hoisted_12$5 = ["data-column-count", "aria-colcount", "aria-rowcount"];
const _hoisted_13$5 = ["aria-label"];
const _hoisted_14$5 = { class: "vue-card-content is-layout-constrained wp-block-group common-component-group flex-card has-white-background-color has-background" };
const _hoisted_15$5 = ["href"];
const _hoisted_16$5 = { class: "category-icon-container" };
const _hoisted_17$5 = {
  key: 0,
  class: "category-icon"
};
const _hoisted_18$5 = ["src", "alt", "title"];
const _hoisted_19$5 = { style: { "font-size": "1rem" } };
const _hoisted_20$5 = ["innerHTML"];
const _hoisted_21$5 = {
  key: 3,
  class: "no-results",
  "aria-live": "polite"
};
const _hoisted_22$5 = ["onKeydown"];
const publicDomain$1 = "https://cleanbc.goc.bc.ca";
const _sfc_main$5 = {
  __name: "postFilterApp",
  setup(__props) {
    const filterPostType = ref("");
    const filterPostTypeName = ref("");
    const focusedCellIndex = ref(0);
    const headingLinkActive = ref("false");
    const headingSize = ref("h3");
    const useExcerpt = ref("excerpt");
    const filterPosts = ref([]);
    ref([]);
    const selectedTag = ref(null);
    const cssClass = ref("");
    const columns = ref(3);
    const showLoadingMessage = ref(true);
    const columnCount = ref(3);
    const focusedRadioIndex = ref(0);
    const radioRefs = ref([]);
    const radioGroup = ref(null);
    watch(() => {
      var _a;
      return (_a = window.site) == null ? void 0 : _a.domain;
    }, (newVal, oldVal) => {
      if (newVal) {
        fetchData2();
      }
    });
    const fetchData2 = async (offset = 0) => {
      var _a;
      try {
        const filterPostUrl = `${((_a = window.site) == null ? void 0 : _a.domain) ? window.site.domain : publicDomain$1}/wp-json/custom/v1/actions`;
        const filterPostResponse = await fetch(filterPostUrl);
        const filterPostsData = await filterPostResponse.json();
        const newFilterPosts = filterPostsData.map((post) => {
          return {
            ...post,
            item_tag: post.categories.map((cat) => cat.name) || [],
            category_image: post.categories.map((cat) => cat.image) || [],
            category_slug: post.categories.map((cat) => cat.slug) || []
          };
        });
        filterPosts.value = [...filterPosts.value, ...newFilterPosts];
        showLoadingMessage.value = false;
        setTimeout(() => {
          doExternalLinkCheck();
          checkDefinitions();
          if (typeof bcgovBlockThemePluginAccessibility === "function") {
            bcgovBlockThemePluginAccessibility();
          }
        }, 150);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    const checkTag = (index) => {
      var _a, _b;
      const tag = (_b = (_a = uniqueTags.value) == null ? void 0 : _a.categories) == null ? void 0 : _b[index];
      if (!tag)
        return;
      if (tag === "Actions we are taking")
        return;
      focusedRadioIndex.value = index;
      selectedTag.value = selectedTag.value === tag ? null : tag;
      const categorySlug = getCategorySlug(tag);
      if (categorySlug) {
        window.location.hash = categorySlug;
      }
      setTimeout(() => {
        const actionTitleElement = document.getElementById("action-title");
        if (actionTitleElement) {
          actionTitleElement.scrollIntoView({ behavior: "smooth" });
          actionTitleElement.focus();
        }
        doExternalLinkCheck();
        checkDefinitions();
        if (typeof bcgovBlockThemePluginAccessibility === "function") {
          bcgovBlockThemePluginAccessibility();
        }
      }, 150);
    };
    const getPostCategoryAlt = (post, index) => {
      const category = post.item_tag && post.item_tag[index];
      return category || "";
    };
    const clearFilters = () => {
      selectedTag.value = null;
      history.replaceState(null, null, " ");
      const tagFilterContainerElement = document.getElementById("tag-filter-container");
      if (tagFilterContainerElement) {
        tagFilterContainerElement.scrollIntoView({ behavior: "smooth" });
      }
      setTimeout(() => {
        doExternalLinkCheck();
        checkDefinitions();
        if (typeof bcgovBlockThemePluginAccessibility === "function") {
          bcgovBlockThemePluginAccessibility();
        }
        document.querySelector(".filter-container .tag-checkbox:first-of-type .tag-label").focus();
      }, 150);
    };
    const getTagCount = (tag) => {
      return filterPosts.value.reduce(
        (count, post) => count + (post.item_tag.includes(tag) ? 1 : 0),
        0
      );
    };
    const getCategoryIconUrl = (tag) => {
      const index = uniqueTags.value.categories.indexOf(tag);
      if (index !== -1 && index < uniqueTags.value.images.length) {
        return uniqueTags.value.images[index];
      }
      return null;
    };
    const getCategorySlug = (tag) => {
      const postWithCategory = filterPosts.value.find((post) => post.item_tag.includes(tag));
      if (postWithCategory) {
        const categoryIndex = postWithCategory.item_tag.indexOf(tag);
        const categorySlug = postWithCategory.category_slug[categoryIndex];
        return categorySlug || "";
      }
      return "";
    };
    const sortByTitle = (a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
      return titleA.localeCompare(titleB);
    };
    const doExternalLinkCheck = () => {
      if ("1" === window.site.externalLinkIcons) {
        const links = document.querySelectorAll(".vue-card-content a");
        if (links) {
          links.forEach((link) => {
            link.classList.remove("has-text-align-left");
            const hasExternalClass = link.classList.contains("external");
            if (hasExternalClass)
              return;
            const href = link.getAttribute("href");
            if (null !== href) {
              if (href.startsWith("#") || href.startsWith("/") || href.startsWith("./") || href.startsWith("../") || href.startsWith("?")) {
                return;
              }
              const currentDomain = window.location.hostname;
              const linkDomain = href.match(
                /^(?:https?:)?(?:\/\/)?([^\/\?]+)/i
              )[1];
              if (linkDomain !== currentDomain) {
                link.classList.add("external");
                const span = document.createElement("span");
                const svg = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "svg"
                );
                svg.setAttribute("class", "external-link-icon");
                svg.setAttribute("version", "1.1");
                svg.setAttribute("id", "Layer_1");
                svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                svg.setAttribute(
                  "xmlns:xlink",
                  "http://www.w3.org/1999/xlink"
                );
                svg.setAttribute("x", "0px");
                svg.setAttribute("y", "0px");
                svg.setAttribute("viewBox", "0 0 18 18");
                svg.setAttribute(
                  "style",
                  "enable-background:new 0 0 18 18;"
                );
                svg.setAttribute("xml:space", "preserve");
                svg.innerHTML = '<path class="st0" d="M9.7,3.9c0-0.1-0.1-0.3-0.2-0.4C9.4,3.4,9.3,3.4,9.2,3.4H1.7c-0.4,0-0.9,0.2-1.2,0.5C0.2,4.2,0,4.6,0,5.1v11.2c0,0.4,0.2,0.9,0.5,1.2C0.8,17.8,1.2,18,1.7,18h11.2c0.4,0,0.9-0.2,1.2-0.5c0.3-0.3,0.5-0.7,0.5-1.2V8.8c0-0.1-0.1-0.3-0.2-0.4 c-0.1-0.1-0.2-0.2-0.4-0.2c-0.1,0-0.3,0.1-0.4,0.2c-0.1,0.1-0.2,0.2-0.2,0.4v7.5c0,0.1-0.1,0.3-0.2,0.4c-0.1,0.1-0.2,0.2-0.4,0.2 H1.7c-0.1,0-0.3-0.1-0.4-0.2c-0.1-0.1-0.2-0.2-0.2-0.4V5.1c0-0.1,0.1-0.3,0.2-0.4c0.1-0.1,0.2-0.2,0.4-0.2h7.5 c0.1,0,0.3-0.1,0.4-0.2C9.7,4.2,9.7,4.1,9.7,3.9z"/><path class="st0" d="M18,0.6c0-0.1-0.1-0.3-0.2-0.4C17.7,0.1,17.6,0,17.4,0h-5.6c-0.1,0-0.3,0.1-0.4,0.2c-0.1,0.1-0.2,0.2-0.2,0.4 s0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2h4.3l-9.2,9.2c-0.1,0.1-0.1,0.1-0.1,0.2c0,0.1,0,0.1,0,0.2s0,0.1,0,0.2c0,0.1,0.1,0.1,0.1,0.2C7,11.1,7,11.2,7.1,11.2c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0s0.1-0.1,0.2-0.1l9.2-9.2v4.3c0,0.1,0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2c0.1,0,0.3-0.1,0.4-0.2C17.9,6.5,18,6.3,18,6.2V0.6z"/>';
                const fontSize = "1.25rem";
                svg.style.maxWidth = fontSize;
                svg.style.height = fontSize;
                svg.style.width = "100%";
                span.innerText = link.innerText;
                span.appendChild(svg);
                link.innerHTML = "";
                link.appendChild(span);
              }
            }
          });
        }
      }
    };
    const uniqueTags = computed(() => {
      const tagObjects = /* @__PURE__ */ new Set();
      filterPosts.value.forEach((post) => {
        const itemTags = post.item_tag || [];
        const itemTagImages = post.category_image || [];
        itemTags.forEach((tag, index) => {
          if (tag !== "Actions we are taking" && itemTagImages[index] !== "") {
            tagObjects.add({
              category: tag,
              image: itemTagImages[index]
            });
          }
        });
      });
      const sortedTagObjects = Array.from(tagObjects);
      sortedTagObjects.sort((a, b) => a.category.localeCompare(b.category));
      const sortedCategories = [...new Set(sortedTagObjects.map((tagObject) => tagObject.category))];
      const sortedImages = [...new Set(sortedTagObjects.map((tagObject) => tagObject.image))];
      return {
        categories: sortedCategories,
        images: sortedImages
      };
    });
    const sortedFilteredPosts = computed(() => {
      if (!selectedTag.value) {
        return [...filterPosts.value].sort(sortByTitle);
      } else {
        const filteredPostArray = filterPosts.value.filter(
          (post) => post.item_tag && post.item_tag.length && post.item_tag.includes(selectedTag.value)
        );
        return filteredPostArray.sort(sortByTitle);
      }
    });
    const handleHash = () => {
      const hash = window.location.hash.substr(1);
      if (hash) {
        const matchingButton = document.querySelector(`[data-category-slug="${hash}"]`);
        if (matchingButton) {
          matchingButton.click();
        }
      }
    };
    const checkDefinitions = () => {
      const links = document.querySelectorAll("#postFilterApp a");
      const definitionLinks = Array.from(links).filter(function(link) {
        return link.href.includes("definitions");
      });
      if (definitionLinks.length > 0) {
        let addEventListeners2 = function(element) {
          element.addEventListener("click", handleClick);
          element.addEventListener("keypress", handleKeypress2);
        }, handleKeypress2 = function(event) {
          if (event.key === "Enter" || event.keycode === 13) {
            handleClick(event);
          }
        }, displayContent2 = function(title, content) {
          const dialogContent = document.querySelector("#dialog .dialog-content");
          dialogContent.innerHTML = '<h2 tabindex="0">' + title + "</h2>" + content;
          showDialog2();
          dialogContent.querySelector("h2").focus();
        }, showDialog2 = function() {
          dialog.showModal();
        };
        var addEventListeners = addEventListeners2, handleKeypress = handleKeypress2, displayContent = displayContent2, showDialog = showDialog2;
        const hasDialog = document.querySelector("#dialog");
        if (!hasDialog) {
          const dialog2 = document.createElement("dialog");
          dialog2.id = "dialog";
          dialog2.className = "dialog";
          dialog2.setAttribute("aria-modal", true);
          dialog2.setAttribute("aria-live", "polite");
          dialog2.innerHTML = '<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>';
          document.body.appendChild(dialog2);
          const closeDialogButton = document.querySelector("#dialog #close-dialog");
          closeDialogButton.addEventListener("click", function() {
            dialog2.close();
          });
        }
        definitionLinks.forEach(function(link) {
          if (!link.classList.contains("icon-definition")) {
            link.classList.add("icon-definition");
            link.setAttribute("aria-label", "opens definition dialog for this concept");
            const linkText = link.textContent;
            if (linkText && linkText.trim().length > 0) {
              const words = linkText.trim().split(" ");
              const lastWord = words.pop();
              const restOfText = words.join(" ");
              const span = document.createElement("span");
              span.classList.add("last-word");
              span.textContent = lastWord;
              link.innerHTML = `${restOfText} `;
              link.appendChild(span);
            }
            addEventListeners2(link);
          }
        });
        async function handleClick(event) {
          if (event.type === "click" || event.type === "keypress" && event.key === "Enter") {
            event.preventDefault();
            const url = this.getAttribute("href");
            const cachedData = window.sessionStorage.getItem(url);
            if (cachedData) {
              const { title, content } = JSON.parse(cachedData);
              displayContent2(title, content);
            } else {
              try {
                const response = await fetch(url + "#vue");
                const html = await response.text();
                const parser = new window.DOMParser();
                const doc2 = parser.parseFromString(html, "text/html");
                const title = doc2.querySelector("h1.wp-block-post-title").innerText;
                const content = doc2.querySelector(".entry-content").innerHTML;
                const dataToCache = { title, content };
                window.sessionStorage.setItem(url, JSON.stringify(dataToCache));
                displayContent2(title, content);
              } catch (error) {
                console.error("Error fetching content:", error);
              }
            }
          }
        }
      }
    };
    function handleResize() {
      const width = window.innerWidth;
      if (width <= 781) {
        columnCount.value = 1;
      } else {
        columnCount.value = 3;
      }
    }
    function onRadioKeydown(event, index) {
      var _a, _b;
      const key = event.key;
      const count = ((_b = (_a = uniqueTags.value) == null ? void 0 : _a.categories) == null ? void 0 : _b.length) || 0;
      if (count === 0)
        return;
      const moveFocus = (newIndex) => {
        focusedRadioIndex.value = newIndex;
        nextTick(() => {
          var _a2;
          (_a2 = radioRefs.value[newIndex]) == null ? void 0 : _a2.focus();
        });
      };
      switch (key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          moveFocus((index + 1) % count);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          moveFocus((index - 1 + count) % count);
          break;
        case " ":
        case "Enter":
          event.preventDefault();
          checkTag(index);
          break;
      }
    }
    function onGridKeydown(event, index) {
      const { key, ctrlKey } = event;
      let newIndex = focusedCellIndex.value;
      const itemCount = sortedFilteredPosts.value.length;
      const cols = columnCount.value;
      const row = Math.floor(index / cols);
      const col = index % cols;
      const maxRow = Math.floor((itemCount - 1) / cols);
      switch (key) {
        case "ArrowRight":
          event.preventDefault();
          if (col < cols - 1 && newIndex < itemCount - 1) {
            newIndex = index + 1;
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (col > 0) {
            newIndex = index - 1;
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (row < maxRow) {
            const downIndex = index + cols;
            if (downIndex < itemCount) {
              newIndex = downIndex;
            }
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (row > 0) {
            newIndex = index - cols;
          }
          break;
        case "Home":
          event.preventDefault();
          newIndex = ctrlKey ? 0 : row * cols;
          break;
        case "End":
          event.preventDefault();
          newIndex = ctrlKey ? itemCount - 1 : Math.min(row * cols + (cols - 1), itemCount - 1);
          break;
        case "PageDown":
          event.preventDefault();
          newIndex = Math.min(index + cols * 3, itemCount - 1);
          break;
        case "PageUp":
          event.preventDefault();
          newIndex = Math.max(index - cols * 3, 0);
          break;
        default:
          return;
      }
      moveFocusToCell(newIndex);
    }
    function moveFocusToCell(newIndex) {
      const itemCount = sortedFilteredPosts.value.length;
      if (newIndex < 0)
        newIndex = 0;
      if (newIndex >= itemCount)
        newIndex = itemCount - 1;
      focusedCellIndex.value = newIndex;
      nextTick(() => {
        const cells = document.querySelectorAll(".filter-card");
        const target = cells[focusedCellIndex.value];
        if (target) {
          cells.forEach((el, idx) => {
            el.setAttribute("tabindex", idx === focusedCellIndex.value ? "0" : "-1");
          });
          target.focus();
        }
      });
    }
    watch(sortedFilteredPosts, async () => {
      await nextTick();
      const cards = document.querySelectorAll(".filter-card");
      cards.forEach((card, index) => {
        card.setAttribute("tabindex", index === focusedCellIndex.value ? "0" : "-1");
        card.removeEventListener("keydown", card._keydownHandler);
        const handler = (event) => onGridKeydown(event, index);
        card._keydownHandler = handler;
        card.addEventListener("keydown", handler);
      });
    }, { immediate: true });
    watch(() => uniqueTags.categories, () => {
      nextTick(() => {
        var _a;
        radioRefs.value = Array.from(
          ((_a = radioGroup.value) == null ? void 0 : _a.querySelectorAll('[role="radio"]')) || []
        );
      });
    });
    onMounted(() => {
      var _a;
      const appElement = document.getElementById("postFilterApp");
      cssClass.value = appElement.getAttribute("class");
      columns.value = parseInt(appElement.getAttribute("data-columns"));
      filterPostType.value = appElement.getAttribute("data-post-type");
      filterPostTypeName.value = appElement.getAttribute("data-post-type-label");
      headingSize.value = appElement.getAttribute("data-heading-size");
      headingLinkActive.value = appElement.getAttribute("data-heading-link-active");
      useExcerpt.value = appElement.getAttribute("data-use-excerpt");
      window.addEventListener("resize", handleResize);
      handleResize();
      if ((_a = window.site) == null ? void 0 : _a.domain) {
        showLoadingMessage.value = true;
        fetchData2().then(() => {
          handleHash();
          nextTick(() => {
            var _a2;
            radioRefs.value = Array.from(
              ((_a2 = radioGroup.value) == null ? void 0 : _a2.querySelectorAll('[role="radio"]')) || []
            );
            const cards = document.querySelectorAll(".filter-card");
            cards.forEach((card, index) => {
              card.setAttribute("tabindex", index === focusedCellIndex.value ? "0" : "-1");
              card.addEventListener("keydown", (event) => onGridKeydown(event, index));
            });
          });
        });
      }
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return openBlock(), createElementBlock(Fragment, null, [
        ((_b = (_a = uniqueTags.value) == null ? void 0 : _a.categories) == null ? void 0 : _b.length) > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$5, [
          _cache[0] || (_cache[0] = createBaseVNode("p", {
            class: "sr-only",
            id: "tag-filter-instructions"
          }, "This is a list of category filter options presented as a radio group. Use the arrow keys to move between categories without changing the selection. Press the spacebar or Enter to select a category. Selection will update the list of available actions that come after this radio group and move focus to the results headline with a count indicator. Focus will remain within the selected category option when navigating back to change the current selection. If a selection is made, a reset selection button becomes available after the headline and count indicator. Choosing the reset will move the focus back to the first item in the radio group.", -1)),
          createBaseVNode("div", {
            class: "taxonomy-common_component_category wp-block-post-terms filter-container",
            role: "radiogroup",
            "aria-label": filterPostTypeName.value + " categories",
            "aria-describedby": "tag-filter-instructions",
            ref_key: "radioGroup",
            ref: radioGroup
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(uniqueTags.value.categories, (category, index) => {
              return openBlock(), createElementBlock("div", {
                key: category,
                class: "tag-checkbox"
              }, [
                createBaseVNode("label", {
                  class: "tag-label tag",
                  role: "radio",
                  "aria-checked": selectedTag.value === category ? "true" : "false",
                  tabindex: focusedRadioIndex.value === index ? "0" : "-1",
                  "aria-label": category + " category. Actions in this category: " + getTagCount(category),
                  "data-category-slug": getCategorySlug(category),
                  id: "tag-label-" + index,
                  onClick: ($event) => checkTag(index),
                  onKeydown: ($event) => onRadioKeydown($event, index),
                  ref_for: true,
                  ref_key: "radioRefs",
                  ref: radioRefs
                }, [
                  getCategoryIconUrl(category) ? (openBlock(), createElementBlock("img", {
                    key: 0,
                    src: getCategoryIconUrl(category),
                    alt: "",
                    class: "category-icon"
                  }, null, 8, _hoisted_4$5)) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(category) + " (" + toDisplayString(getTagCount(category)) + ") ", 1)
                ], 40, _hoisted_3$5)
              ]);
            }), 128))
          ], 8, _hoisted_2$5)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_5$5, [
          filterPosts.value.length > 0 ? (openBlock(), createElementBlock("h3", _hoisted_6$5, [
            sortedFilteredPosts.value.length !== filterPosts.value.length ? (openBlock(), createElementBlock("span", _hoisted_7$5, "Showing actions: " + toDisplayString(selectedTag.value ? selectedTag.value + " " : "") + " (" + toDisplayString(sortedFilteredPosts.value.length) + "/" + toDisplayString(filterPosts.value.length) + ")", 1)) : (openBlock(), createElementBlock("span", _hoisted_8$5, "All actions (" + toDisplayString(sortedFilteredPosts.value.length) + "/" + toDisplayString(filterPosts.value.length) + ")", 1))
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_9$5, [
            sortedFilteredPosts.value.length !== filterPosts.value.length ? (openBlock(), createElementBlock("button", {
              key: 0,
              class: "clear-filters",
              onClick: clearFilters,
              onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"])
            }, " Reset selection ", 40, _hoisted_10$5)) : createCommentVNode("", true)
          ])
        ]),
        sortedFilteredPosts.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_11$5, [
          createBaseVNode("div", {
            role: "grid",
            class: "wp-block-query vue-card-container",
            "data-column-count": columnCount.value,
            "aria-colcount": columnCount.value,
            "aria-rowcount": Math.ceil(sortedFilteredPosts.value.length / columnCount.value)
          }, [
            createBaseVNode("ul", {
              role: "row",
              class: normalizeClass(["is-flex-container wp-block-post-template", `columns-${columns.value}`])
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(sortedFilteredPosts.value, (post, index) => {
                return openBlock(), createElementBlock("li", {
                  key: post.id,
                  role: "gridcell",
                  class: "filter-card common-component",
                  "aria-label": "card #" + (index + 1)
                }, [
                  createBaseVNode("div", _hoisted_14$5, [
                    "true" === headingLinkActive.value ? (openBlock(), createElementBlock("a", {
                      key: 0,
                      href: post.link
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(headingSize.value), {
                        style: { "margin-bottom": "0", "margin-top": "var(--wp--preset--spacing--20)" },
                        class: "has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title",
                        innerHTML: post.title
                      }, null, 8, ["innerHTML"]))
                    ], 8, _hoisted_15$5)) : (openBlock(), createBlock(resolveDynamicComponent(headingSize.value), {
                      key: 1,
                      style: { "margin-bottom": "0", "margin-top": "var(--wp--preset--spacing--20)" },
                      class: "has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title",
                      innerHTML: post.title
                    }, null, 8, ["innerHTML"])),
                    createBaseVNode("div", _hoisted_16$5, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(post.category_image, (img, index2) => {
                        return openBlock(), createElementBlock(Fragment, { key: img }, [
                          img ? (openBlock(), createElementBlock("span", _hoisted_17$5, [
                            createBaseVNode("img", {
                              src: img,
                              alt: "In category " + getPostCategoryAlt(post, index2),
                              title: getPostCategoryAlt(post, index2)
                            }, null, 8, _hoisted_18$5)
                          ])) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ]),
                    createBaseVNode("div", _hoisted_19$5, [
                      createBaseVNode("span", {
                        class: "value",
                        innerHTML: useExcerpt.value === "excerpt" ? post.excerpt : post.content
                      }, null, 8, _hoisted_20$5)
                    ])
                  ])
                ], 8, _hoisted_13$5);
              }), 128))
            ], 2)
          ], 8, _hoisted_12$5)
        ])) : showLoadingMessage.value ? withDirectives((openBlock(), createElementBlock("p", {
          key: 2,
          class: "no-results loading",
          "aria-live": "polite"
        }, "Retrieving " + toDisplayString(filterPostTypeName.value) + " results.", 513)), [
          [vShow, showLoadingMessage.value]
        ]) : (openBlock(), createElementBlock("p", _hoisted_21$5, [
          _cache[1] || (_cache[1] = createTextVNode("Oops, no filterable results for ")),
          createBaseVNode("strong", null, toDisplayString(filterPostTypeName.value), 1),
          _cache[2] || (_cache[2] = createTextVNode(" have been found. ")),
          createBaseVNode("a", {
            href: "#",
            onClick: withModifiers(clearFilters, ["prevent"]),
            onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"])
          }, "Try resetting your filters", 40, _hoisted_22$5),
          _cache[3] || (_cache[3] = createTextVNode(" and refining your selections."))
        ]))
      ], 64);
    };
  }
};
const PostFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-8fc298c5"]]);
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var vueSliderComponent_umd_min = { exports: {} };
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(vue_runtime_esmBundler);
(function(module, exports) {
  (function(t, e) {
    module.exports = e(require$$0);
  })("undefined" !== typeof self ? self : commonjsGlobal, function(t) {
    return function() {
      var e = { 388: function(t2, e2) {
        var r2, n2, i2;
        (function(o, a) {
          n2 = [], r2 = a, i2 = "function" === typeof r2 ? r2.apply(e2, n2) : r2, void 0 === i2 || (t2.exports = i2);
        })("undefined" !== typeof self && self, function() {
          function t3() {
            var e3 = Object.getOwnPropertyDescriptor(document, "currentScript");
            if (!e3 && "currentScript" in document && document.currentScript)
              return document.currentScript;
            if (e3 && e3.get !== t3 && document.currentScript)
              return document.currentScript;
            try {
              throw new Error();
            } catch (f) {
              var r3, n3, i3, o = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, a = /@([^@]*):(\d+):(\d+)\s*$/gi, s = o.exec(f.stack) || a.exec(f.stack), l = s && s[1] || false, u = s && s[2] || false, c = document.location.href.replace(document.location.hash, ""), d = document.getElementsByTagName("script");
              l === c && (r3 = document.documentElement.outerHTML, n3 = new RegExp("(?:[^\\n]+?\\n){0," + (u - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), i3 = r3.replace(n3, "$1").trim());
              for (var h2 = 0; h2 < d.length; h2++) {
                if ("interactive" === d[h2].readyState)
                  return d[h2];
                if (d[h2].src === l)
                  return d[h2];
                if (l === c && d[h2].innerHTML && d[h2].innerHTML.trim() === i3)
                  return d[h2];
              }
              return null;
            }
          }
          return t3;
        });
      }, 905: function(t2, e2, r2) {
        r2.r(e2);
        var n2 = r2(117), i2 = r2.n(n2), o = r2(488), a = r2.n(o), s = a()(i2());
        s.push([t2.id, ".vue-slider-dot{position:absolute;-webkit-transition:all 0s;transition:all 0s;z-index:5}.vue-slider-dot:focus{outline:none}.vue-slider-dot-tooltip{position:absolute;visibility:hidden}.vue-slider-dot-hover:hover .vue-slider-dot-tooltip,.vue-slider-dot-tooltip-show{visibility:visible}.vue-slider-dot-tooltip-top{top:-10px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-dot-tooltip-bottom{bottom:-10px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-dot-tooltip-left{left:-10px;top:50%;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-dot-tooltip-right{right:-10px;top:50%;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}", ""]), e2["default"] = s;
      }, 121: function(t2, e2, r2) {
        r2.r(e2);
        var n2 = r2(117), i2 = r2.n(n2), o = r2(488), a = r2.n(o), s = a()(i2());
        s.push([t2.id, ".vue-slider-marks{position:relative;width:100%;height:100%}.vue-slider-mark{position:absolute;z-index:1}.vue-slider-ltr .vue-slider-mark,.vue-slider-rtl .vue-slider-mark{width:0;height:100%;top:50%}.vue-slider-ltr .vue-slider-mark-step,.vue-slider-rtl .vue-slider-mark-step{top:0}.vue-slider-ltr .vue-slider-mark-label,.vue-slider-rtl .vue-slider-mark-label{top:100%;margin-top:10px}.vue-slider-ltr .vue-slider-mark{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-slider-ltr .vue-slider-mark-step{left:0}.vue-slider-ltr .vue-slider-mark-label{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.vue-slider-rtl .vue-slider-mark{-webkit-transform:translate(50%,-50%);transform:translate(50%,-50%)}.vue-slider-rtl .vue-slider-mark-step{right:0}.vue-slider-rtl .vue-slider-mark-label{right:50%;-webkit-transform:translateX(50%);transform:translateX(50%)}.vue-slider-btt .vue-slider-mark,.vue-slider-ttb .vue-slider-mark{width:100%;height:0;left:50%}.vue-slider-btt .vue-slider-mark-step,.vue-slider-ttb .vue-slider-mark-step{left:0}.vue-slider-btt .vue-slider-mark-label,.vue-slider-ttb .vue-slider-mark-label{left:100%;margin-left:10px}.vue-slider-btt .vue-slider-mark{-webkit-transform:translate(-50%,50%);transform:translate(-50%,50%)}.vue-slider-btt .vue-slider-mark-step{top:0}.vue-slider-btt .vue-slider-mark-label{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-ttb .vue-slider-mark{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-slider-ttb .vue-slider-mark-step{bottom:0}.vue-slider-ttb .vue-slider-mark-label{bottom:50%;-webkit-transform:translateY(50%);transform:translateY(50%)}.vue-slider-mark-label,.vue-slider-mark-step{position:absolute}", ""]), e2["default"] = s;
      }, 207: function(t2, e2, r2) {
        r2.r(e2);
        var n2 = r2(117), i2 = r2.n(n2), o = r2(488), a = r2.n(o), s = a()(i2());
        s.push([t2.id, ".vue-slider{position:relative;-webkit-box-sizing:content-box;box-sizing:content-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.vue-slider-rail{position:relative;width:100%;height:100%;-webkit-transition-property:width,height,left,right,top,bottom;transition-property:width,height,left,right,top,bottom}.vue-slider-process{position:absolute;z-index:1}", ""]), e2["default"] = s;
      }, 488: function(t2) {
        t2.exports = function(t3) {
          var e2 = [];
          return e2.toString = function() {
            return this.map(function(e3) {
              var r2 = "", n2 = "undefined" !== typeof e3[5];
              return e3[4] && (r2 += "@supports (".concat(e3[4], ") {")), e3[2] && (r2 += "@media ".concat(e3[2], " {")), n2 && (r2 += "@layer".concat(e3[5].length > 0 ? " ".concat(e3[5]) : "", " {")), r2 += t3(e3), n2 && (r2 += "}"), e3[2] && (r2 += "}"), e3[4] && (r2 += "}"), r2;
            }).join("");
          }, e2.i = function(t4, r2, n2, i2, o) {
            "string" === typeof t4 && (t4 = [[null, t4, void 0]]);
            var a = {};
            if (n2)
              for (var s = 0; s < this.length; s++) {
                var l = this[s][0];
                null != l && (a[l] = true);
              }
            for (var u = 0; u < t4.length; u++) {
              var c = [].concat(t4[u]);
              n2 && a[c[0]] || ("undefined" !== typeof o && ("undefined" === typeof c[5] || (c[1] = "@layer".concat(c[5].length > 0 ? " ".concat(c[5]) : "", " {").concat(c[1], "}")), c[5] = o), r2 && (c[2] ? (c[1] = "@media ".concat(c[2], " {").concat(c[1], "}"), c[2] = r2) : c[2] = r2), i2 && (c[4] ? (c[1] = "@supports (".concat(c[4], ") {").concat(c[1], "}"), c[4] = i2) : c[4] = "".concat(i2)), e2.push(c));
            }
          }, e2;
        };
      }, 117: function(t2) {
        t2.exports = function(t3) {
          return t3[1];
        };
      }, 831: function(t2, e2) {
        e2.Z = (t3, e3) => {
          const r2 = t3.__vccOpts || t3;
          for (const [n2, i2] of e3)
            r2[n2] = i2;
          return r2;
        };
      }, 466: function(t2, e2, r2) {
        var n2 = r2(905);
        n2.__esModule && (n2 = n2.default), "string" === typeof n2 && (n2 = [[t2.id, n2, ""]]), n2.locals && (t2.exports = n2.locals);
        var i2 = r2(959).Z;
        i2("50bc1720", n2, true, { sourceMap: false, shadowMode: false });
      }, 18: function(t2, e2, r2) {
        var n2 = r2(121);
        n2.__esModule && (n2 = n2.default), "string" === typeof n2 && (n2 = [[t2.id, n2, ""]]), n2.locals && (t2.exports = n2.locals);
        var i2 = r2(959).Z;
        i2("10aa5f36", n2, true, { sourceMap: false, shadowMode: false });
      }, 631: function(t2, e2, r2) {
        var n2 = r2(207);
        n2.__esModule && (n2 = n2.default), "string" === typeof n2 && (n2 = [[t2.id, n2, ""]]), n2.locals && (t2.exports = n2.locals);
        var i2 = r2(959).Z;
        i2("1772934e", n2, true, { sourceMap: false, shadowMode: false });
      }, 959: function(t2, e2, r2) {
        function n2(t3, e3) {
          for (var r3 = [], n3 = {}, i3 = 0; i3 < e3.length; i3++) {
            var o2 = e3[i3], a2 = o2[0], s2 = o2[1], l2 = o2[2], u2 = o2[3], c2 = { id: t3 + ":" + i3, css: s2, media: l2, sourceMap: u2 };
            n3[a2] ? n3[a2].parts.push(c2) : r3.push(n3[a2] = { id: a2, parts: [c2] });
          }
          return r3;
        }
        r2.d(e2, { Z: function() {
          return p2;
        } });
        var i2 = "undefined" !== typeof document;
        if ("undefined" !== typeof DEBUG && DEBUG && !i2)
          throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");
        var o = {}, a = i2 && (document.head || document.getElementsByTagName("head")[0]), s = null, l = 0, u = false, c = function() {
        }, d = null, h2 = "data-vue-ssr-id", f = "undefined" !== typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
        function p2(t3, e3, r3, i3) {
          u = r3, d = i3 || {};
          var a2 = n2(t3, e3);
          return m(a2), function(e4) {
            for (var r4 = [], i4 = 0; i4 < a2.length; i4++) {
              var s2 = a2[i4], l2 = o[s2.id];
              l2.refs--, r4.push(l2);
            }
            e4 ? (a2 = n2(t3, e4), m(a2)) : a2 = [];
            for (i4 = 0; i4 < r4.length; i4++) {
              l2 = r4[i4];
              if (0 === l2.refs) {
                for (var u2 = 0; u2 < l2.parts.length; u2++)
                  l2.parts[u2]();
                delete o[l2.id];
              }
            }
          };
        }
        function m(t3) {
          for (var e3 = 0; e3 < t3.length; e3++) {
            var r3 = t3[e3], n3 = o[r3.id];
            if (n3) {
              n3.refs++;
              for (var i3 = 0; i3 < n3.parts.length; i3++)
                n3.parts[i3](r3.parts[i3]);
              for (; i3 < r3.parts.length; i3++)
                n3.parts.push(y(r3.parts[i3]));
              n3.parts.length > r3.parts.length && (n3.parts.length = r3.parts.length);
            } else {
              var a2 = [];
              for (i3 = 0; i3 < r3.parts.length; i3++)
                a2.push(y(r3.parts[i3]));
              o[r3.id] = { id: r3.id, refs: 1, parts: a2 };
            }
          }
        }
        function v() {
          var t3 = document.createElement("style");
          return t3.type = "text/css", a.appendChild(t3), t3;
        }
        function y(t3) {
          var e3, r3, n3 = document.querySelector("style[" + h2 + '~="' + t3.id + '"]');
          if (n3) {
            if (u)
              return c;
            n3.parentNode.removeChild(n3);
          }
          if (f) {
            var i3 = l++;
            n3 = s || (s = v()), e3 = g.bind(null, n3, i3, false), r3 = g.bind(null, n3, i3, true);
          } else
            n3 = v(), e3 = k.bind(null, n3), r3 = function() {
              n3.parentNode.removeChild(n3);
            };
          return e3(t3), function(n4) {
            if (n4) {
              if (n4.css === t3.css && n4.media === t3.media && n4.sourceMap === t3.sourceMap)
                return;
              e3(t3 = n4);
            } else
              r3();
          };
        }
        var b = function() {
          var t3 = [];
          return function(e3, r3) {
            return t3[e3] = r3, t3.filter(Boolean).join("\n");
          };
        }();
        function g(t3, e3, r3, n3) {
          var i3 = r3 ? "" : n3.css;
          if (t3.styleSheet)
            t3.styleSheet.cssText = b(e3, i3);
          else {
            var o2 = document.createTextNode(i3), a2 = t3.childNodes;
            a2[e3] && t3.removeChild(a2[e3]), a2.length ? t3.insertBefore(o2, a2[e3]) : t3.appendChild(o2);
          }
        }
        function k(t3, e3) {
          var r3 = e3.css, n3 = e3.media, i3 = e3.sourceMap;
          if (n3 && t3.setAttribute("media", n3), d.ssrId && t3.setAttribute(h2, e3.id), i3 && (r3 += "\n/*# sourceURL=" + i3.sources[0] + " */", r3 += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(i3)))) + " */"), t3.styleSheet)
            t3.styleSheet.cssText = r3;
          else {
            while (t3.firstChild)
              t3.removeChild(t3.firstChild);
            t3.appendChild(document.createTextNode(r3));
          }
        }
      }, 927: function(e2) {
        e2.exports = t;
      } }, r = {};
      function n(t2) {
        var i2 = r[t2];
        if (void 0 !== i2)
          return i2.exports;
        var o = r[t2] = { id: t2, exports: {} };
        return e[t2].call(o.exports, o, o.exports, n), o.exports;
      }
      !function() {
        n.n = function(t2) {
          var e2 = t2 && t2.__esModule ? function() {
            return t2["default"];
          } : function() {
            return t2;
          };
          return n.d(e2, { a: e2 }), e2;
        };
      }(), function() {
        n.d = function(t2, e2) {
          for (var r2 in e2)
            n.o(e2, r2) && !n.o(t2, r2) && Object.defineProperty(t2, r2, { enumerable: true, get: e2[r2] });
        };
      }(), function() {
        n.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        };
      }(), function() {
        n.r = function(t2) {
          "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
        };
      }(), function() {
        n.p = "";
      }();
      var i = {};
      return function() {
        if (n.d(i, { default: function() {
          return St;
        } }), "undefined" !== typeof window) {
          var t2 = window.document.currentScript, e2 = n(388);
          t2 = e2(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: e2 });
          var r2 = t2 && t2.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
          r2 && (n.p = r2[1]);
        }
        var o = n(927);
        function a(t3, e3, r3) {
          return e3 in t3 ? Object.defineProperty(t3, e3, { value: r3, enumerable: true, configurable: true, writable: true }) : t3[e3] = r3, t3;
        }
        var s = { key: 0, class: "vue-slider-marks" };
        function l(t3, e3, r3, n2, i2, l2) {
          var u2 = (0, o.resolveComponent)("vue-slider-mark"), c2 = (0, o.resolveComponent)("vue-slider-dot");
          return (0, o.openBlock)(), (0, o.createElementBlock)("div", (0, o.mergeProps)({ ref: "container", class: t3.containerClasses, style: t3.containerStyles, onClick: e3[2] || (e3[2] = function() {
            return t3.clickHandle && t3.clickHandle.apply(t3, arguments);
          }), onTouchstartPassive: e3[3] || (e3[3] = function() {
            return t3.dragStartOnProcess && t3.dragStartOnProcess.apply(t3, arguments);
          }), onMousedownPassive: e3[4] || (e3[4] = function() {
            return t3.dragStartOnProcess && t3.dragStartOnProcess.apply(t3, arguments);
          }) }, t3.$attrs), [(0, o.createElementVNode)("div", { class: "vue-slider-rail", style: (0, o.normalizeStyle)(t3.railStyle) }, [((0, o.openBlock)(true), (0, o.createElementBlock)(o.Fragment, null, (0, o.renderList)(t3.processArray, function(e4, r4) {
            return (0, o.renderSlot)(t3.$slots, "process", (0, o.normalizeProps)((0, o.guardReactiveProps)(e4)), function() {
              return [((0, o.openBlock)(), (0, o.createElementBlock)("div", { class: "vue-slider-process", key: "process-".concat(r4), style: (0, o.normalizeStyle)(e4.style) }, null, 4))];
            });
          }), 256)), t3.sliderMarks && t3.control ? ((0, o.openBlock)(), (0, o.createElementBlock)("div", s, [((0, o.openBlock)(true), (0, o.createElementBlock)(o.Fragment, null, (0, o.renderList)(t3.control.markList, function(r4, n3) {
            return (0, o.renderSlot)(t3.$slots, "mark", (0, o.normalizeProps)((0, o.guardReactiveProps)(r4)), function() {
              var i3;
              return [((0, o.openBlock)(), (0, o.createBlock)(u2, { key: "mark-".concat(n3), mark: r4, hideLabel: t3.hideLabel, style: (0, o.normalizeStyle)((i3 = {}, a(i3, t3.isHorizontal ? "height" : "width", "100%"), a(i3, t3.isHorizontal ? "width" : "height", t3.tailSize), a(i3, t3.mainDirection, "".concat(r4.pos, "%")), i3)), stepStyle: t3.stepStyle, stepActiveStyle: t3.stepActiveStyle, labelStyle: t3.labelStyle, labelActiveStyle: t3.labelActiveStyle, onPressLabel: e3[0] || (e3[0] = function(e4) {
                return t3.clickable && t3.setValueByPos(e4);
              }) }, { step: (0, o.withCtx)(function() {
                return [(0, o.renderSlot)(t3.$slots, "step", (0, o.normalizeProps)((0, o.guardReactiveProps)(r4)))];
              }), label: (0, o.withCtx)(function() {
                return [(0, o.renderSlot)(t3.$slots, "label", (0, o.normalizeProps)((0, o.guardReactiveProps)(r4)))];
              }), _: 2 }, 1032, ["mark", "hideLabel", "style", "stepStyle", "stepActiveStyle", "labelStyle", "labelActiveStyle"]))];
            });
          }), 256))])) : (0, o.createCommentVNode)("", true), ((0, o.openBlock)(true), (0, o.createElementBlock)(o.Fragment, null, (0, o.renderList)(t3.dots, function(r4, n3) {
            var i3;
            return (0, o.openBlock)(), (0, o.createBlock)(c2, (0, o.mergeProps)({ ref_for: true, ref: "dot-".concat(n3), key: "dot-".concat(n3), value: r4.value, disabled: r4.disabled, focus: r4.focus, "dot-style": [r4.style, r4.disabled ? r4.disabledStyle : null, r4.focus ? r4.focusStyle : null], tooltip: r4.tooltip || t3.tooltip, "tooltip-style": [t3.tooltipStyle, r4.tooltipStyle, r4.disabled ? r4.tooltipDisabledStyle : null, r4.focus ? r4.tooltipFocusStyle : null], "tooltip-formatter": Array.isArray(t3.sliderTooltipFormatter) ? t3.sliderTooltipFormatter[n3] : t3.sliderTooltipFormatter, "tooltip-placement": t3.tooltipDirections[n3], style: [t3.dotBaseStyle, (i3 = {}, a(i3, t3.mainDirection, "".concat(r4.pos, "%")), a(i3, "transition", "".concat(t3.mainDirection, " ").concat(t3.animateTime, "s")), i3)], onDragStart: function() {
              return t3.dragStart(n3);
            }, role: "slider", "aria-valuenow": r4.value, "aria-valuemin": t3.min, "aria-valuemax": t3.max, "aria-orientation": t3.isHorizontal ? "horizontal" : "vertical", tabindex: "0", onFocus: function() {
              return t3.focus(r4, n3);
            }, onBlur: e3[1] || (e3[1] = function() {
              return t3.blur();
            }) }, t3.dotAttrs), { dot: (0, o.withCtx)(function() {
              return [(0, o.renderSlot)(t3.$slots, "dot", (0, o.normalizeProps)((0, o.guardReactiveProps)(r4)))];
            }), tooltip: (0, o.withCtx)(function() {
              return [(0, o.renderSlot)(t3.$slots, "tooltip", (0, o.normalizeProps)((0, o.guardReactiveProps)(r4)))];
            }), _: 2 }, 1040, ["value", "disabled", "focus", "dot-style", "tooltip", "tooltip-style", "tooltip-formatter", "tooltip-placement", "style", "onDragStart", "aria-valuenow", "aria-valuemin", "aria-valuemax", "aria-orientation", "onFocus"]);
          }), 128))], 4), (0, o.renderSlot)(t3.$slots, "default", { value: t3.getValue() })], 16);
        }
        var u = ["aria-valuetext"], c = { class: "vue-slider-dot-tooltip-text" };
        function d(t3, e3, r3, n2, i2, a2) {
          var s2;
          return (0, o.openBlock)(), (0, o.createElementBlock)("div", { ref: "dot", class: (0, o.normalizeClass)(t3.dotClasses), "aria-valuetext": null === (s2 = t3.tooltipValue) || void 0 === s2 ? void 0 : s2.toString(), onMousedownPassive: e3[0] || (e3[0] = function() {
            return t3.dragStart && t3.dragStart.apply(t3, arguments);
          }), onTouchstartPassive: e3[1] || (e3[1] = function() {
            return t3.dragStart && t3.dragStart.apply(t3, arguments);
          }) }, [(0, o.renderSlot)(t3.$slots, "dot", {}, function() {
            return [(0, o.createElementVNode)("div", { class: (0, o.normalizeClass)(t3.handleClasses), style: (0, o.normalizeStyle)(t3.dotStyle) }, null, 6)];
          }), "none" !== t3.tooltip ? ((0, o.openBlock)(), (0, o.createElementBlock)("div", { key: 0, class: (0, o.normalizeClass)(t3.tooltipClasses) }, [(0, o.renderSlot)(t3.$slots, "tooltip", {}, function() {
            return [(0, o.createElementVNode)("div", { class: (0, o.normalizeClass)(t3.tooltipInnerClasses), style: (0, o.normalizeStyle)(t3.tooltipStyle) }, [(0, o.createElementVNode)("span", c, (0, o.toDisplayString)(t3.tooltipValue), 1)], 6)];
          })], 2)) : (0, o.createCommentVNode)("", true)], 42, u);
        }
        n(466);
        var h2 = (0, o.defineComponent)({ name: "VueSliderDot", emits: ["drag-start"], props: { value: { type: [String, Number], default: 0 }, tooltip: { type: String, required: true }, tooltipPlacement: { type: String, validator: function(t3) {
          return ["top", "right", "bottom", "left"].indexOf(t3) > -1;
        }, required: true }, tooltipFormatter: { type: [String, Function] }, focus: { type: Boolean, default: false }, disabled: { type: Boolean, default: false }, dotStyle: { type: Object }, tooltipStyle: { type: Object } }, computed: { dotClasses: function() {
          return ["vue-slider-dot", { "vue-slider-dot-hover": "hover" === this.tooltip || "active" === this.tooltip, "vue-slider-dot-disabled": this.disabled, "vue-slider-dot-focus": this.focus }];
        }, handleClasses: function() {
          return ["vue-slider-dot-handle", { "vue-slider-dot-handle-disabled": this.disabled, "vue-slider-dot-handle-focus": this.focus }];
        }, tooltipClasses: function() {
          return ["vue-slider-dot-tooltip", ["vue-slider-dot-tooltip-".concat(this.tooltipPlacement)], { "vue-slider-dot-tooltip-show": this.showTooltip }];
        }, tooltipInnerClasses: function() {
          return ["vue-slider-dot-tooltip-inner", ["vue-slider-dot-tooltip-inner-".concat(this.tooltipPlacement)], { "vue-slider-dot-tooltip-inner-disabled": this.disabled, "vue-slider-dot-tooltip-inner-focus": this.focus }];
        }, showTooltip: function() {
          switch (this.tooltip) {
            case "always":
              return true;
            case "none":
              return false;
            case "focus":
            case "active":
              return !!this.focus;
            default:
              return false;
          }
        }, tooltipValue: function() {
          return this.tooltipFormatter ? "string" === typeof this.tooltipFormatter ? this.tooltipFormatter.replace(/\{value\}/, String(this.value)) : this.tooltipFormatter(this.value) : this.value;
        } }, methods: { dragStart: function() {
          if (this.disabled)
            return false;
          this.$emit("drag-start");
        } } }), f = n(831);
        const p2 = (0, f.Z)(h2, [["render", d]]);
        var m = p2;
        function v(t3, e3, r3, n2, i2, a2) {
          return (0, o.openBlock)(), (0, o.createElementBlock)("div", { class: (0, o.normalizeClass)(t3.marksClasses) }, [(0, o.renderSlot)(t3.$slots, "step", {}, function() {
            return [(0, o.createElementVNode)("div", { class: (0, o.normalizeClass)(t3.stepClasses), style: (0, o.normalizeStyle)([t3.stepStyle, t3.mark.style || {}, t3.mark.active && t3.stepActiveStyle ? t3.stepActiveStyle : {}, t3.mark.active && t3.mark.activeStyle ? t3.mark.activeStyle : {}]) }, null, 6)];
          }), t3.hideLabel ? (0, o.createCommentVNode)("", true) : (0, o.renderSlot)(t3.$slots, "label", { key: 0 }, function() {
            return [(0, o.createElementVNode)("div", { class: (0, o.normalizeClass)(t3.labelClasses), style: (0, o.normalizeStyle)([t3.labelStyle, t3.mark.labelStyle || {}, t3.mark.active && t3.labelActiveStyle ? t3.labelActiveStyle : {}, t3.mark.active && t3.mark.labelActiveStyle ? t3.mark.labelActiveStyle : {}]), onClick: e3[0] || (e3[0] = function() {
              return t3.labelClickHandle && t3.labelClickHandle.apply(t3, arguments);
            }) }, (0, o.toDisplayString)(t3.mark.label), 7)];
          })], 2);
        }
        n(18);
        var y = (0, o.defineComponent)({ name: "VueSliderMark", emits: ["press-label"], props: { mark: { type: Object, required: true }, hideLabel: { type: Boolean }, stepStyle: { type: Object, default: function() {
          return {};
        } }, stepActiveStyle: { type: Object, default: function() {
          return {};
        } }, labelStyle: { type: Object, default: function() {
          return {};
        } }, labelActiveStyle: { type: Object, default: function() {
          return {};
        } } }, computed: { marksClasses: function() {
          return ["vue-slider-mark", { "vue-slider-mark-active": this.mark.active }];
        }, stepClasses: function() {
          return ["vue-slider-mark-step", { "vue-slider-mark-step-active": this.mark.active }];
        }, labelClasses: function() {
          return ["vue-slider-mark-label", { "vue-slider-mark-label-active": this.mark.active }];
        } }, methods: { labelClickHandle: function(t3) {
          t3.stopPropagation(), this.$emit("press-label", this.mark.pos);
        } } });
        const b = (0, f.Z)(y, [["render", v]]);
        var g, k = b, S = function(t3) {
          return "number" === typeof t3 ? "".concat(t3, "px") : t3;
        }, x = function(t3) {
          var e3 = document.documentElement, r3 = document.body, n2 = t3.getBoundingClientRect(), i2 = { y: n2.top + (window.pageYOffset || e3.scrollTop) - (e3.clientTop || r3.clientTop || 0), x: n2.left + (window.pageXOffset || e3.scrollLeft) - (e3.clientLeft || r3.clientLeft || 0) };
          return i2;
        }, P = function(t3, e3, r3) {
          var n2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1, i2 = "targetTouches" in t3 ? t3.targetTouches[0] : t3, o2 = x(e3), a2 = { x: i2.pageX - o2.x, y: i2.pageY - o2.y };
          return { x: r3 ? e3.offsetWidth * n2 - a2.x : a2.x, y: r3 ? e3.offsetHeight * n2 - a2.y : a2.y };
        };
        (function(t3) {
          t3[t3["PAGE_UP"] = 33] = "PAGE_UP", t3[t3["PAGE_DOWN"] = 34] = "PAGE_DOWN", t3[t3["END"] = 35] = "END", t3[t3["HOME"] = 36] = "HOME", t3[t3["LEFT"] = 37] = "LEFT", t3[t3["UP"] = 38] = "UP", t3[t3["RIGHT"] = 39] = "RIGHT", t3[t3["DOWN"] = 40] = "DOWN";
        })(g || (g = {}));
        var w = function(t3, e3) {
          if (e3.hook) {
            var r3 = e3.hook(t3);
            if ("function" === typeof r3)
              return r3;
            if (!r3)
              return null;
          }
          switch (t3.keyCode) {
            case g.UP:
              return function(t4) {
                return "ttb" === e3.direction ? t4 - 1 : t4 + 1;
              };
            case g.RIGHT:
              return function(t4) {
                return "rtl" === e3.direction ? t4 - 1 : t4 + 1;
              };
            case g.DOWN:
              return function(t4) {
                return "ttb" === e3.direction ? t4 + 1 : t4 - 1;
              };
            case g.LEFT:
              return function(t4) {
                return "rtl" === e3.direction ? t4 + 1 : t4 - 1;
              };
            case g.END:
              return function() {
                return e3.max;
              };
            case g.HOME:
              return function() {
                return e3.min;
              };
            case g.PAGE_UP:
              return function(t4) {
                return t4 + 10;
              };
            case g.PAGE_DOWN:
              return function(t4) {
                return t4 - 10;
              };
            default:
              return null;
          }
        };
        function O(t3, e3) {
          if (!(t3 instanceof e3))
            throw new TypeError("Cannot call a class as a function");
        }
        function D(t3, e3) {
          for (var r3 = 0; r3 < e3.length; r3++) {
            var n2 = e3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t3, n2.key, n2);
          }
        }
        function E(t3, e3, r3) {
          return e3 && D(t3.prototype, e3), r3 && D(t3, r3), Object.defineProperty(t3, "prototype", { writable: false }), t3;
        }
        function R(t3, e3, r3) {
          return e3 in t3 ? Object.defineProperty(t3, e3, { value: r3, enumerable: true, configurable: true, writable: true }) : t3[e3] = r3, t3;
        }
        var A, V, j = function() {
          function t3(e3) {
            O(this, t3), R(this, "num", void 0), this.num = e3;
          }
          return E(t3, [{ key: "decimal", value: function(t4, e3) {
            var r3 = this.num, n2 = this.getDecimalLen(r3), i2 = this.getDecimalLen(t4), o2 = 0;
            switch (e3) {
              case "+":
                o2 = this.getExponent(n2, i2), this.num = (this.safeRoundUp(r3, o2) + this.safeRoundUp(t4, o2)) / o2;
                break;
              case "-":
                o2 = this.getExponent(n2, i2), this.num = (this.safeRoundUp(r3, o2) - this.safeRoundUp(t4, o2)) / o2;
                break;
              case "*":
                this.num = this.safeRoundUp(this.safeRoundUp(r3, this.getExponent(n2)), this.safeRoundUp(t4, this.getExponent(i2))) / this.getExponent(n2 + i2);
                break;
              case "/":
                o2 = this.getExponent(n2, i2), this.num = this.safeRoundUp(r3, o2) / this.safeRoundUp(t4, o2);
                break;
              case "%":
                o2 = this.getExponent(n2, i2), this.num = this.safeRoundUp(r3, o2) % this.safeRoundUp(t4, o2) / o2;
                break;
            }
            return this;
          } }, { key: "plus", value: function(t4) {
            return this.decimal(t4, "+");
          } }, { key: "minus", value: function(t4) {
            return this.decimal(t4, "-");
          } }, { key: "multiply", value: function(t4) {
            return this.decimal(t4, "*");
          } }, { key: "divide", value: function(t4) {
            return this.decimal(t4, "/");
          } }, { key: "remainder", value: function(t4) {
            return this.decimal(t4, "%");
          } }, { key: "toNumber", value: function() {
            return this.num;
          } }, { key: "getDecimalLen", value: function(t4) {
            var e3 = "".concat(t4).split("e");
            return ("".concat(e3[0]).split(".")[1] || "").length - (e3[1] ? +e3[1] : 0);
          } }, { key: "getExponent", value: function(t4, e3) {
            return Math.pow(10, void 0 !== e3 ? Math.max(t4, e3) : t4);
          } }, { key: "safeRoundUp", value: function(t4, e3) {
            return Math.round(t4 * e3);
          } }]), t3;
        }();
        function C(t3, e3) {
          return L(t3) || M(t3, e3) || H(t3, e3) || B();
        }
        function B() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function M(t3, e3) {
          var r3 = null == t3 ? null : "undefined" !== typeof Symbol && t3[Symbol.iterator] || t3["@@iterator"];
          if (null != r3) {
            var n2, i2, o2 = [], a2 = true, s2 = false;
            try {
              for (r3 = r3.call(t3); !(a2 = (n2 = r3.next()).done); a2 = true)
                if (o2.push(n2.value), e3 && o2.length === e3)
                  break;
            } catch (l2) {
              s2 = true, i2 = l2;
            } finally {
              try {
                a2 || null == r3["return"] || r3["return"]();
              } finally {
                if (s2)
                  throw i2;
              }
            }
            return o2;
          }
        }
        function L(t3) {
          if (Array.isArray(t3))
            return t3;
        }
        function N(t3, e3) {
          var r3 = Object.keys(t3);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(t3);
            e3 && (n2 = n2.filter(function(e4) {
              return Object.getOwnPropertyDescriptor(t3, e4).enumerable;
            })), r3.push.apply(r3, n2);
          }
          return r3;
        }
        function z(t3) {
          for (var e3 = 1; e3 < arguments.length; e3++) {
            var r3 = null != arguments[e3] ? arguments[e3] : {};
            e3 % 2 ? N(Object(r3), true).forEach(function(e4) {
              X(t3, e4, r3[e4]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t3, Object.getOwnPropertyDescriptors(r3)) : N(Object(r3)).forEach(function(e4) {
              Object.defineProperty(t3, e4, Object.getOwnPropertyDescriptor(r3, e4));
            });
          }
          return t3;
        }
        function I(t3) {
          return $(t3) || F(t3) || H(t3) || T();
        }
        function T() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function H(t3, e3) {
          if (t3) {
            if ("string" === typeof t3)
              return U(t3, e3);
            var r3 = Object.prototype.toString.call(t3).slice(8, -1);
            return "Object" === r3 && t3.constructor && (r3 = t3.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(t3) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? U(t3, e3) : void 0;
          }
        }
        function F(t3) {
          if ("undefined" !== typeof Symbol && null != t3[Symbol.iterator] || null != t3["@@iterator"])
            return Array.from(t3);
        }
        function $(t3) {
          if (Array.isArray(t3))
            return U(t3);
        }
        function U(t3, e3) {
          (null == e3 || e3 > t3.length) && (e3 = t3.length);
          for (var r3 = 0, n2 = new Array(e3); r3 < e3; r3++)
            n2[r3] = t3[r3];
          return n2;
        }
        function _(t3, e3) {
          if (!(t3 instanceof e3))
            throw new TypeError("Cannot call a class as a function");
        }
        function W(t3, e3) {
          for (var r3 = 0; r3 < e3.length; r3++) {
            var n2 = e3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t3, n2.key, n2);
          }
        }
        function G(t3, e3, r3) {
          return e3 && W(t3.prototype, e3), r3 && W(t3, r3), Object.defineProperty(t3, "prototype", { writable: false }), t3;
        }
        function X(t3, e3, r3) {
          return e3 in t3 ? Object.defineProperty(t3, e3, { value: r3, enumerable: true, configurable: true, writable: true }) : t3[e3] = r3, t3;
        }
        (function(t3) {
          t3[t3["VALUE"] = 1] = "VALUE", t3[t3["INTERVAL"] = 2] = "INTERVAL", t3[t3["MIN"] = 3] = "MIN", t3[t3["MAX"] = 4] = "MAX", t3[t3["ORDER"] = 5] = "ORDER";
        })(V || (V = {}));
        var q = (A = {}, X(A, V.VALUE, 'The type of the "value" is illegal'), X(A, V.INTERVAL, 'The prop "interval" is invalid, "(max - min)" must be divisible by "interval"'), X(A, V.MIN, 'The "value" must be greater than or equal to the "min".'), X(A, V.MAX, 'The "value" must be less than or equal to the "max".'), X(A, V.ORDER, 'When "order" is false, the parameters "minRange", "maxRange", "fixed", "enabled" are invalid.'), A), Z = function() {
          function t3(e3) {
            _(this, t3), X(this, "dotsPos", []), X(this, "dotsValue", []), X(this, "data", void 0), X(this, "enableCross", void 0), X(this, "fixed", void 0), X(this, "max", void 0), X(this, "min", void 0), X(this, "interval", void 0), X(this, "minRange", void 0), X(this, "maxRange", void 0), X(this, "order", void 0), X(this, "marks", void 0), X(this, "included", void 0), X(this, "process", void 0), X(this, "adsorb", void 0), X(this, "dotOptions", void 0), X(this, "onError", void 0), X(this, "cacheRangeDir", {}), this.data = e3.data, this.max = e3.max, this.min = e3.min, this.interval = e3.interval, this.order = e3.order, this.marks = e3.marks, this.included = e3.included, this.process = e3.process, this.adsorb = e3.adsorb, this.dotOptions = e3.dotOptions, this.onError = e3.onError, this.order ? (this.minRange = e3.minRange || 0, this.maxRange = e3.maxRange || 0, this.enableCross = e3.enableCross, this.fixed = e3.fixed) : ((e3.minRange || e3.maxRange || !e3.enableCross || e3.fixed) && this.emitError(V.ORDER), this.minRange = 0, this.maxRange = 0, this.enableCross = true, this.fixed = false), this.setValue(e3.value);
          }
          return G(t3, [{ key: "setValue", value: function(t4) {
            this.setDotsValue(Array.isArray(t4) ? I(t4) : [t4], true);
          } }, { key: "setDotsValue", value: function(t4, e3) {
            this.dotsValue = t4, e3 && this.syncDotsPos();
          } }, { key: "setDotsPos", value: function(t4) {
            var e3 = this, r3 = this.order ? I(t4).sort(function(t5, e4) {
              return t5 - e4;
            }) : t4;
            this.dotsPos = r3, this.setDotsValue(r3.map(function(t5) {
              return e3.getValueByPos(t5);
            }), this.adsorb);
          } }, { key: "getValueByPos", value: function(t4) {
            var e3 = this.parsePos(t4);
            if (this.included) {
              var r3 = 100;
              this.markList.forEach(function(n2) {
                var i2 = Math.abs(n2.pos - t4);
                i2 < r3 && (r3 = i2, e3 = n2.value);
              });
            }
            return e3;
          } }, { key: "syncDotsPos", value: function() {
            var t4 = this;
            this.dotsPos = this.dotsValue.map(function(e3) {
              return t4.parseValue(e3);
            });
          } }, { key: "markList", get: function() {
            var t4 = this;
            if (!this.marks)
              return [];
            var e3 = function(e4, r3) {
              var n2 = t4.parseValue(e4);
              return z({ pos: n2, value: e4, label: e4, active: t4.isActiveByPos(n2) }, r3);
            };
            return true === this.marks ? this.getValues().map(function(t5) {
              return e3(t5);
            }) : "[object Object]" === Object.prototype.toString.call(this.marks) ? Object.keys(this.marks).sort(function(t5, e4) {
              return +t5 - +e4;
            }).map(function(r3) {
              var n2 = t4.marks[r3];
              return e3(r3, "string" !== typeof n2 ? n2 : { label: n2 });
            }) : Array.isArray(this.marks) ? this.marks.map(function(t5) {
              return e3(t5);
            }) : "function" === typeof this.marks ? this.getValues().map(function(e4) {
              return { value: e4, result: t4.marks(e4) };
            }).filter(function(t5) {
              var e4 = t5.result;
              return !!e4;
            }).map(function(t5) {
              var r3 = t5.value, n2 = t5.result;
              return e3(r3, n2);
            }) : [];
          } }, { key: "getRecentDot", value: function(t4) {
            var e3 = this.dotsPos.map(function(e4) {
              return Math.abs(e4 - t4);
            });
            return e3.indexOf(Math.min.apply(Math, I(e3)));
          } }, { key: "getIndexByValue", value: function(t4) {
            return this.data ? this.data.indexOf(t4) : new j(+t4).minus(this.min).divide(this.interval).toNumber();
          } }, { key: "getValueByIndex", value: function(t4) {
            return t4 < 0 ? t4 = 0 : t4 > this.total && (t4 = this.total), this.data ? this.data[t4] : new j(t4).multiply(this.interval).plus(this.min).toNumber();
          } }, { key: "setDotPos", value: function(t4, e3) {
            t4 = this.getValidPos(t4, e3).pos;
            var r3 = t4 - this.dotsPos[e3];
            if (r3) {
              var n2 = new Array(this.dotsPos.length);
              this.fixed ? n2 = this.getFixedChangePosArr(r3, e3) : this.minRange || this.maxRange ? n2 = this.getLimitRangeChangePosArr(t4, r3, e3) : n2[e3] = r3, this.setDotsPos(this.dotsPos.map(function(t5, e4) {
                return t5 + (n2[e4] || 0);
              }));
            }
          } }, { key: "getFixedChangePosArr", value: function(t4, e3) {
            var r3 = this;
            return this.dotsPos.forEach(function(n2, i2) {
              if (i2 !== e3) {
                var o2 = r3.getValidPos(n2 + t4, i2), a2 = o2.pos, s2 = o2.inRange;
                s2 || (t4 = Math.min(Math.abs(a2 - n2), Math.abs(t4)) * (t4 < 0 ? -1 : 1));
              }
            }), this.dotsPos.map(function(e4) {
              return t4;
            });
          } }, { key: "getLimitRangeChangePosArr", value: function(t4, e3, r3) {
            var n2 = this, i2 = [{ index: r3, changePos: e3 }], o2 = e3;
            return [this.minRange, this.maxRange].forEach(function(a2, s2) {
              if (!a2)
                return false;
              var l2 = 0 === s2, u2 = e3 > 0, c2 = 0;
              c2 = l2 ? u2 ? 1 : -1 : u2 ? -1 : 1;
              var d2 = function(t5, e4) {
                var r4 = Math.abs(t5 - e4);
                return l2 ? r4 < n2.minRangeDir : r4 > n2.maxRangeDir;
              }, h3 = r3 + c2, f2 = n2.dotsPos[h3], p3 = t4;
              while (n2.isPos(f2) && d2(f2, p3)) {
                var m2 = n2.getValidPos(f2 + o2, h3), v2 = m2.pos;
                i2.push({ index: h3, changePos: v2 - f2 }), h3 += c2, p3 = v2, f2 = n2.dotsPos[h3];
              }
            }), this.dotsPos.map(function(t5, e4) {
              var r4 = i2.filter(function(t6) {
                return t6.index === e4;
              });
              return r4.length ? r4[0].changePos : 0;
            });
          } }, { key: "isPos", value: function(t4) {
            return "number" === typeof t4;
          } }, { key: "getValidPos", value: function(t4, e3) {
            var r3 = this.valuePosRange[e3], n2 = true;
            return t4 < r3[0] ? (t4 = r3[0], n2 = false) : t4 > r3[1] && (t4 = r3[1], n2 = false), { pos: t4, inRange: n2 };
          } }, { key: "parseValue", value: function(t4) {
            if (this.data)
              t4 = this.data.indexOf(t4);
            else if ("number" === typeof t4 || "string" === typeof t4) {
              if (t4 = +t4, t4 < this.min)
                return this.emitError(V.MIN), 0;
              if (t4 > this.max)
                return this.emitError(V.MAX), 0;
              if ("number" !== typeof t4 || t4 !== t4)
                return this.emitError(V.VALUE), 0;
              t4 = new j(t4).minus(this.min).divide(this.interval).toNumber();
            }
            var e3 = new j(t4).multiply(this.gap).toNumber();
            return e3 < 0 ? 0 : e3 > 100 ? 100 : e3;
          } }, { key: "parsePos", value: function(t4) {
            var e3 = Math.round(t4 / this.gap);
            return this.getValueByIndex(e3);
          } }, { key: "isActiveByPos", value: function(t4) {
            return this.processArray.some(function(e3) {
              var r3 = C(e3, 2), n2 = r3[0], i2 = r3[1];
              return t4 >= n2 && t4 <= i2;
            });
          } }, { key: "getValues", value: function() {
            if (this.data)
              return this.data;
            for (var t4 = [], e3 = 0; e3 <= this.total; e3++)
              t4.push(new j(e3).multiply(this.interval).plus(this.min).toNumber());
            return t4;
          } }, { key: "getRangeDir", value: function(t4) {
            return t4 ? new j(t4).divide(new j(this.data ? this.data.length - 1 : this.max).minus(this.data ? 0 : this.min).toNumber()).multiply(100).toNumber() : 100;
          } }, { key: "emitError", value: function(t4) {
            this.onError && this.onError(t4, q[t4]);
          } }, { key: "processArray", get: function() {
            if (this.process) {
              if ("function" === typeof this.process)
                return this.process(this.dotsPos);
              if (1 === this.dotsPos.length)
                return [[0, this.dotsPos[0]]];
              if (this.dotsPos.length > 1)
                return [[Math.min.apply(Math, I(this.dotsPos)), Math.max.apply(Math, I(this.dotsPos))]];
            }
            return [];
          } }, { key: "total", get: function() {
            var t4 = 0;
            return t4 = this.data ? this.data.length - 1 : new j(this.max).minus(this.min).divide(this.interval).toNumber(), t4 - Math.floor(t4) !== 0 ? (this.emitError(V.INTERVAL), 0) : t4;
          } }, { key: "gap", get: function() {
            return 100 / this.total;
          } }, { key: "minRangeDir", get: function() {
            return this.cacheRangeDir[this.minRange] ? this.cacheRangeDir[this.minRange] : this.cacheRangeDir[this.minRange] = this.getRangeDir(this.minRange);
          } }, { key: "maxRangeDir", get: function() {
            return this.cacheRangeDir[this.maxRange] ? this.cacheRangeDir[this.maxRange] : this.cacheRangeDir[this.maxRange] = this.getRangeDir(this.maxRange);
          } }, { key: "getDotRange", value: function(t4, e3, r3) {
            if (!this.dotOptions)
              return r3;
            var n2 = Array.isArray(this.dotOptions) ? this.dotOptions[t4] : this.dotOptions;
            return n2 && void 0 !== n2[e3] ? this.parseValue(n2[e3]) : r3;
          } }, { key: "valuePosRange", get: function() {
            var t4 = this, e3 = this.dotsPos, r3 = [];
            return e3.forEach(function(n2, i2) {
              r3.push([Math.max(t4.minRange ? t4.minRangeDir * i2 : 0, t4.enableCross ? 0 : e3[i2 - 1] || 0, t4.getDotRange(i2, "min", 0)), Math.min(t4.minRange ? 100 - t4.minRangeDir * (e3.length - 1 - i2) : 100, t4.enableCross ? 100 : e3[i2 + 1] || 100, t4.getDotRange(i2, "max", 100))]);
            }), r3;
          } }, { key: "dotsIndex", get: function() {
            var t4 = this;
            return this.dotsValue.map(function(e3) {
              return t4.getIndexByValue(e3);
            });
          } }]), t3;
        }();
        function Y(t3, e3) {
          if (!(t3 instanceof e3))
            throw new TypeError("Cannot call a class as a function");
        }
        function K(t3, e3) {
          for (var r3 = 0; r3 < e3.length; r3++) {
            var n2 = e3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t3, n2.key, n2);
          }
        }
        function J(t3, e3, r3) {
          return e3 && K(t3.prototype, e3), r3 && K(t3, r3), Object.defineProperty(t3, "prototype", { writable: false }), t3;
        }
        function Q(t3, e3, r3) {
          return e3 in t3 ? Object.defineProperty(t3, e3, { value: r3, enumerable: true, configurable: true, writable: true }) : t3[e3] = r3, t3;
        }
        var tt2 = function() {
          function t3(e3) {
            Y(this, t3), Q(this, "map", void 0), Q(this, "states", 0), this.map = e3;
          }
          return J(t3, [{ key: "add", value: function(t4) {
            this.states |= t4;
          } }, { key: "delete", value: function(t4) {
            this.states &= ~t4;
          } }, { key: "toggle", value: function(t4) {
            this.has(t4) ? this.delete(t4) : this.add(t4);
          } }, { key: "has", value: function(t4) {
            return !!(this.states & t4);
          } }]), t3;
        }();
        n(631);
        function et(t3) {
          return it(t3) || nt(t3) || dt(t3) || rt();
        }
        function rt() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function nt(t3) {
          if ("undefined" !== typeof Symbol && null != t3[Symbol.iterator] || null != t3["@@iterator"])
            return Array.from(t3);
        }
        function it(t3) {
          if (Array.isArray(t3))
            return ht(t3);
        }
        function ot(t3) {
          return ot = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t4) {
            return typeof t4;
          } : function(t4) {
            return t4 && "function" == typeof Symbol && t4.constructor === Symbol && t4 !== Symbol.prototype ? "symbol" : typeof t4;
          }, ot(t3);
        }
        function at(t3, e3) {
          var r3 = Object.keys(t3);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(t3);
            e3 && (n2 = n2.filter(function(e4) {
              return Object.getOwnPropertyDescriptor(t3, e4).enumerable;
            })), r3.push.apply(r3, n2);
          }
          return r3;
        }
        function st(t3) {
          for (var e3 = 1; e3 < arguments.length; e3++) {
            var r3 = null != arguments[e3] ? arguments[e3] : {};
            e3 % 2 ? at(Object(r3), true).forEach(function(e4) {
              lt(t3, e4, r3[e4]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t3, Object.getOwnPropertyDescriptors(r3)) : at(Object(r3)).forEach(function(e4) {
              Object.defineProperty(t3, e4, Object.getOwnPropertyDescriptor(r3, e4));
            });
          }
          return t3;
        }
        function lt(t3, e3, r3) {
          return e3 in t3 ? Object.defineProperty(t3, e3, { value: r3, enumerable: true, configurable: true, writable: true }) : t3[e3] = r3, t3;
        }
        function ut(t3, e3) {
          return pt(t3) || ft(t3, e3) || dt(t3, e3) || ct();
        }
        function ct() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function dt(t3, e3) {
          if (t3) {
            if ("string" === typeof t3)
              return ht(t3, e3);
            var r3 = Object.prototype.toString.call(t3).slice(8, -1);
            return "Object" === r3 && t3.constructor && (r3 = t3.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(t3) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? ht(t3, e3) : void 0;
          }
        }
        function ht(t3, e3) {
          (null == e3 || e3 > t3.length) && (e3 = t3.length);
          for (var r3 = 0, n2 = new Array(e3); r3 < e3; r3++)
            n2[r3] = t3[r3];
          return n2;
        }
        function ft(t3, e3) {
          var r3 = null == t3 ? null : "undefined" !== typeof Symbol && t3[Symbol.iterator] || t3["@@iterator"];
          if (null != r3) {
            var n2, i2, o2 = [], a2 = true, s2 = false;
            try {
              for (r3 = r3.call(t3); !(a2 = (n2 = r3.next()).done); a2 = true)
                if (o2.push(n2.value), e3 && o2.length === e3)
                  break;
            } catch (l2) {
              s2 = true, i2 = l2;
            } finally {
              try {
                a2 || null == r3["return"] || r3["return"]();
              } finally {
                if (s2)
                  throw i2;
              }
            }
            return o2;
          }
        }
        function pt(t3) {
          if (Array.isArray(t3))
            return t3;
        }
        var mt = { None: 0, Drag: 2, Focus: 4 }, vt = 4, yt = (0, o.defineComponent)({ name: "VueSlider", components: { VueSliderDot: m, VueSliderMark: k }, emits: ["change", "drag-start", "dragging", "drag-end", "error", "update:modelValue"], data: function() {
          return { control: null, states: new tt2(mt), scale: 1, focusDotIndex: 0 };
        }, props: { modelValue: { type: [Number, String, Array], default: 0 }, silent: { type: Boolean, default: false }, direction: { type: String, default: "ltr", validator: function(t3) {
          return ["ltr", "rtl", "ttb", "btt"].indexOf(t3) > -1;
        } }, width: { type: [Number, String] }, height: { type: [Number, String] }, dotSize: { type: [Number, Array], default: 14 }, contained: { type: Boolean, default: false }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, interval: { type: Number, default: 1 }, disabled: { type: Boolean, default: false }, clickable: { type: Boolean, default: true }, dragOnClick: { type: Boolean, default: false }, duration: { type: Number, default: 0.5 }, data: { type: [Object, Array] }, dataValue: { type: String, default: "value" }, dataLabel: { type: String, default: "label" }, lazy: { type: Boolean, default: false }, tooltip: { type: String, default: "active", validator: function(t3) {
          return ["none", "always", "focus", "hover", "active"].indexOf(t3) > -1;
        } }, tooltipPlacement: { type: [String, Array], validator: function(t3) {
          return (Array.isArray(t3) ? t3 : [t3]).every(function(t4) {
            return ["top", "right", "bottom", "left"].indexOf(t4) > -1;
          });
        } }, tooltipFormatter: { type: [String, Array, Function] }, useKeyboard: { type: Boolean, default: true }, keydownHook: { type: Function }, enableCross: { type: Boolean, default: true }, fixed: { type: Boolean, default: false }, order: { type: Boolean, default: true }, minRange: { type: Number }, maxRange: { type: Number }, marks: { type: [Boolean, Object, Array, Function], default: false }, process: { type: [Boolean, Function], default: true }, zoom: { type: Number }, included: { type: Boolean }, adsorb: { type: Boolean }, hideLabel: { type: Boolean }, dotOptions: { type: [Object, Array] }, dotAttrs: { type: Object }, railStyle: { type: Object }, processStyle: { type: Object }, dotStyle: { type: Object }, tooltipStyle: { type: Object }, stepStyle: { type: Object }, stepActiveStyle: { type: Object }, labelStyle: { type: Object }, labelActiveStyle: { type: Object } }, computed: { isHorizontal: function() {
          return "ltr" === this.direction || "rtl" === this.direction;
        }, isReverse: function() {
          return "rtl" === this.direction || "btt" === this.direction;
        }, tailSize: function() {
          return S((this.isHorizontal ? this.height : this.width) || vt);
        }, containerClasses: function() {
          return ["vue-slider", ["vue-slider-".concat(this.direction)], { "vue-slider-disabled": this.disabled }];
        }, containerStyles: function() {
          var t3 = Array.isArray(this.dotSize) ? this.dotSize : [this.dotSize, this.dotSize], e3 = ut(t3, 2), r3 = e3[0], n2 = e3[1], i2 = this.width ? S(this.width) : this.isHorizontal ? "auto" : S(vt), o2 = this.height ? S(this.height) : this.isHorizontal ? S(vt) : "auto";
          return { padding: this.contained ? "".concat(n2 / 2, "px ").concat(r3 / 2, "px") : this.isHorizontal ? "".concat(n2 / 2, "px 0") : "0 ".concat(r3 / 2, "px"), width: i2, height: o2 };
        }, processArray: function() {
          var t3 = this;
          return this.control.processArray.map(function(e3, r3) {
            var n2, i2 = ut(e3, 3), o2 = i2[0], a2 = i2[1], s2 = i2[2];
            if (o2 > a2) {
              var l2 = [a2, o2];
              o2 = l2[0], a2 = l2[1];
            }
            var u2 = t3.isHorizontal ? "width" : "height";
            return { start: o2, end: a2, index: r3, style: st(st((n2 = {}, lt(n2, t3.isHorizontal ? "height" : "width", "100%"), lt(n2, t3.isHorizontal ? "top" : "left", 0), lt(n2, t3.mainDirection, "".concat(o2, "%")), lt(n2, u2, "".concat(a2 - o2, "%")), lt(n2, "transitionProperty", "".concat(u2, ",").concat(t3.mainDirection)), lt(n2, "transitionDuration", "".concat(t3.animateTime, "s")), n2), t3.processStyle), s2) };
          });
        }, dotBaseStyle: function() {
          var t3, e3 = Array.isArray(this.dotSize) ? this.dotSize : [this.dotSize, this.dotSize], r3 = ut(e3, 2), n2 = r3[0], i2 = r3[1];
          return t3 = this.isHorizontal ? lt({ transform: "translate(".concat(this.isReverse ? "50%" : "-50%", ", -50%)"), WebkitTransform: "translate(".concat(this.isReverse ? "50%" : "-50%", ", -50%)"), top: "50%" }, "ltr" === this.direction ? "left" : "right", "0") : lt({ transform: "translate(-50%, ".concat(this.isReverse ? "50%" : "-50%", ")"), WebkitTransform: "translate(-50%, ".concat(this.isReverse ? "50%" : "-50%", ")"), left: "50%" }, "btt" === this.direction ? "bottom" : "top", "0"), st({ width: "".concat(n2, "px"), height: "".concat(i2, "px") }, t3);
        }, mainDirection: function() {
          switch (this.direction) {
            case "ltr":
              return "left";
            case "rtl":
              return "right";
            case "btt":
              return "bottom";
            case "ttb":
              return "top";
            default:
              return "left";
          }
        }, tooltipDirections: function() {
          var t3 = this.tooltipPlacement || (this.isHorizontal ? "top" : "left");
          return Array.isArray(t3) ? t3 : this.dots.map(function() {
            return t3;
          });
        }, dots: function() {
          var t3 = this;
          return this.control.dotsPos.map(function(e3, r3) {
            return st({ pos: e3, index: r3, value: t3.control.dotsValue[r3], focus: t3.states.has(mt.Focus) && t3.focusDotIndex === r3, disabled: t3.disabled, style: t3.dotStyle }, (Array.isArray(t3.dotOptions) ? t3.dotOptions[r3] : t3.dotOptions) || {});
          });
        }, animateTime: function() {
          return this.states.has(mt.Drag) ? 0 : this.duration;
        }, canSort: function() {
          return this.order && !this.minRange && !this.maxRange && !this.fixed && this.enableCross;
        }, sliderData: function() {
          var t3 = this;
          return this.isObjectArrayData(this.data) ? this.data.map(function(e3) {
            return e3[t3.dataValue];
          }) : this.isObjectData(this.data) ? Object.keys(this.data) : this.data;
        }, sliderMarks: function() {
          var t3 = this;
          return this.marks ? this.marks : this.isObjectArrayData(this.data) ? function(e3) {
            var r3 = { label: e3 };
            return t3.data.some(function(n2) {
              return n2[t3.dataValue] === e3 && (r3.label = n2[t3.dataLabel], true);
            }), r3;
          } : this.isObjectData(this.data) ? this.data : void 0;
        }, sliderTooltipFormatter: function() {
          var t3 = this;
          if (this.tooltipFormatter)
            return this.tooltipFormatter;
          if (this.isObjectArrayData(this.data))
            return function(e4) {
              var r3 = "" + e4;
              return t3.data.some(function(n2) {
                return n2[t3.dataValue] === e4 && (r3 = n2[t3.dataLabel], true);
              }), r3;
            };
          if (this.isObjectData(this.data)) {
            var e3 = this.data;
            return function(t4) {
              return e3[t4];
            };
          }
        }, isNotSync: function() {
          var t3 = this.control.dotsValue;
          return Array.isArray(this.modelValue) ? this.modelValue.length !== t3.length || this.modelValue.some(function(e3, r3) {
            return e3 !== t3[r3];
          }) : this.modelValue !== t3[0];
        }, dragRange: function() {
          var t3 = this.dots[this.focusDotIndex - 1], e3 = this.dots[this.focusDotIndex + 1];
          return [t3 ? t3.pos : -1 / 0, e3 ? e3.pos : 1 / 0];
        } }, watch: { modelValue: function() {
          this.control && !this.states.has(mt.Drag) && this.isNotSync && this.control.setValue(this.modelValue);
        } }, methods: { isObjectData: function(t3) {
          return !!t3 && "[object Object]" === Object.prototype.toString.call(t3);
        }, isObjectArrayData: function(t3) {
          return !!t3 && Array.isArray(t3) && t3.length > 0 && "object" === ot(t3[0]);
        }, bindEvent: function() {
          document.addEventListener("touchmove", this.dragMove, { passive: false }), document.addEventListener("touchend", this.dragEnd, { passive: false }), document.addEventListener("mousedown", this.blurHandle), document.addEventListener("mousemove", this.dragMove), document.addEventListener("mouseup", this.dragEnd), document.addEventListener("mouseleave", this.dragEnd), document.addEventListener("keydown", this.keydownHandle);
        }, unbindEvent: function() {
          document.removeEventListener("touchmove", this.dragMove), document.removeEventListener("touchend", this.dragEnd), document.removeEventListener("mousedown", this.blurHandle), document.removeEventListener("mousemove", this.dragMove), document.removeEventListener("mouseup", this.dragEnd), document.removeEventListener("mouseleave", this.dragEnd), document.removeEventListener("keydown", this.keydownHandle);
        }, setScale: function() {
          this.scale = new j(Math.floor(this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight)).multiply(this.zoom || 1).divide(100).toNumber();
        }, initControl: function() {
          var t3 = this;
          this.control = new Z({ value: this.modelValue, data: this.sliderData, enableCross: this.enableCross, fixed: this.fixed, max: this.max, min: this.min, interval: this.interval, minRange: this.minRange, maxRange: this.maxRange, order: this.order, marks: this.sliderMarks, included: this.included, process: this.process, adsorb: this.adsorb, dotOptions: this.dotOptions, onError: this.emitError }), ["data", "enableCross", "fixed", "max", "min", "interval", "minRange", "maxRange", "order", "marks", "process", "adsorb", "included", "dotOptions"].forEach(function(e3) {
            t3.$watch(e3, function(r3) {
              if ("data" === e3 && Array.isArray(t3.control.data) && Array.isArray(r3) && t3.control.data.length === r3.length && r3.every(function(e4, r4) {
                return e4 === t3.control.data[r4];
              }))
                return false;
              switch (e3) {
                case "data":
                case "dataLabel":
                case "dataValue":
                  t3.control.data = t3.sliderData;
                  break;
                case "mark":
                  t3.control.marks = t3.sliderMarks;
                  break;
                default:
                  t3.control[e3] = r3;
              }
              ["data", "max", "min", "interval"].indexOf(e3) > -1 && t3.control.syncDotsPos();
            });
          });
        }, syncValueByPos: function() {
          var t3 = this.control.dotsValue;
          if (this.isDiff(t3, Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue])) {
            var e3 = 1 === t3.length ? t3[0] : et(t3);
            this.$emit("change", e3, this.focusDotIndex), this.$emit("update:modelValue", e3);
          }
        }, isDiff: function(t3, e3) {
          return t3.length !== e3.length || t3.some(function(t4, r3) {
            return t4 !== e3[r3];
          });
        }, emitError: function(t3, e3) {
          this.silent || console.error("[VueSlider error]: ".concat(e3)), this.$emit("error", t3, e3);
        }, dragStartOnProcess: function(t3) {
          if (this.dragOnClick) {
            this.setScale();
            var e3 = this.getPosByEvent(t3), r3 = this.control.getRecentDot(e3);
            if (this.dots[r3].disabled)
              return;
            this.dragStart(r3), this.control.setDotPos(e3, this.focusDotIndex), this.lazy || this.syncValueByPos();
          }
        }, dragStart: function(t3) {
          this.focusDotIndex = t3, this.setScale(), this.states.add(mt.Drag), this.states.add(mt.Focus), this.$emit("drag-start", this.focusDotIndex);
        }, dragMove: function(t3) {
          if (!this.states.has(mt.Drag))
            return false;
          t3.preventDefault();
          var e3 = this.getPosByEvent(t3);
          this.isCrossDot(e3), this.control.setDotPos(e3, this.focusDotIndex), this.lazy || this.syncValueByPos();
          var r3 = this.control.dotsValue;
          this.$emit("dragging", 1 === r3.length ? r3[0] : et(r3), this.focusDotIndex);
        }, isCrossDot: function(t3) {
          if (this.canSort) {
            var e3 = this.focusDotIndex, r3 = t3;
            if (r3 > this.dragRange[1] ? (r3 = this.dragRange[1], this.focusDotIndex++) : r3 < this.dragRange[0] && (r3 = this.dragRange[0], this.focusDotIndex--), e3 !== this.focusDotIndex) {
              var n2 = this.$refs["dot-".concat(this.focusDotIndex)];
              n2 && n2.$el && n2.$el.focus(), this.control.setDotPos(r3, e3);
            }
          }
        }, dragEnd: function(t3) {
          var e3 = this;
          if (!this.states.has(mt.Drag))
            return false;
          setTimeout(function() {
            e3.lazy && e3.syncValueByPos(), e3.included && e3.isNotSync ? e3.control.setValue(e3.modelValue) : e3.control.syncDotsPos(), e3.states.delete(mt.Drag), e3.useKeyboard && !("targetTouches" in t3) || e3.states.delete(mt.Focus), e3.$emit("drag-end", e3.focusDotIndex);
          });
        }, blurHandle: function(t3) {
          if (!this.states.has(mt.Focus) || !this.$refs.container || this.$refs.container.contains(t3.target))
            return false;
          this.states.delete(mt.Focus);
        }, clickHandle: function(t3) {
          if (!this.clickable || this.disabled)
            return false;
          if (!this.states.has(mt.Drag)) {
            this.setScale();
            var e3 = this.getPosByEvent(t3);
            this.setValueByPos(e3);
          }
        }, focus: function(t3) {
          var e3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
          t3.disabled || (this.states.add(mt.Focus), this.focusDotIndex = e3);
        }, blur: function() {
          this.states.delete(mt.Focus);
        }, getValue: function() {
          var t3 = this.control.dotsValue;
          return 1 === t3.length ? t3[0] : t3;
        }, getIndex: function() {
          var t3 = this.control.dotsIndex;
          return 1 === t3.length ? t3[0] : t3;
        }, setValue: function(t3) {
          this.control.setValue(Array.isArray(t3) ? et(t3) : [t3]), this.syncValueByPos();
        }, setIndex: function(t3) {
          var e3 = this, r3 = Array.isArray(t3) ? t3.map(function(t4) {
            return e3.control.getValueByIndex(t4);
          }) : this.control.getValueByIndex(t3);
          this.setValue(r3);
        }, setValueByPos: function(t3) {
          var e3 = this, r3 = this.control.getRecentDot(t3);
          if (this.disabled || this.dots[r3].disabled)
            return false;
          this.focusDotIndex = r3, this.control.setDotPos(t3, r3), this.syncValueByPos(), this.useKeyboard && this.states.add(mt.Focus), setTimeout(function() {
            e3.included && e3.isNotSync ? e3.control.setValue(e3.modelValue) : e3.control.syncDotsPos();
          });
        }, keydownHandle: function(t3) {
          var e3 = this;
          if (!this.useKeyboard || !this.states.has(mt.Focus))
            return false;
          var r3 = this.included && this.marks, n2 = w(t3, { direction: this.direction, max: r3 ? this.control.markList.length - 1 : this.control.total, min: 0, hook: this.keydownHook });
          if (n2) {
            t3.preventDefault();
            var i2 = -1, o2 = 0;
            r3 ? (this.control.markList.some(function(t4, r4) {
              return t4.value === e3.control.dotsValue[e3.focusDotIndex] && (i2 = n2(r4), true);
            }), i2 < 0 ? i2 = 0 : i2 > this.control.markList.length - 1 && (i2 = this.control.markList.length - 1), o2 = this.control.markList[i2].pos) : (i2 = n2(this.control.getIndexByValue(this.control.dotsValue[this.focusDotIndex])), o2 = this.control.parseValue(this.control.getValueByIndex(i2))), this.isCrossDot(o2), this.control.setDotPos(o2, this.focusDotIndex), this.syncValueByPos();
          }
        }, getPosByEvent: function(t3) {
          return P(t3, this.$el, this.isReverse, this.zoom)[this.isHorizontal ? "x" : "y"] / this.scale;
        }, renderSlot: function(t3, e3, r3) {
          var n2 = this.$slots[t3];
          return n2 ? n2(e3) : r3;
        } }, created: function() {
          this.initControl();
        }, mounted: function() {
          this.bindEvent();
        }, beforeUnmount: function() {
          this.unbindEvent();
        } });
        const bt = (0, f.Z)(yt, [["render", l]]);
        var gt = bt;
        gt.VueSliderMark = k, gt.VueSliderDot = m;
        var kt = gt, St = kt;
      }(), i = i["default"], i;
    }();
  });
})(vueSliderComponent_umd_min);
var vueSliderComponent_umd_minExports = vueSliderComponent_umd_min.exports;
const VueSlider = /* @__PURE__ */ getDefaultExportFromCjs(vueSliderComponent_umd_minExports);
const vehicleFilterApp_vue_vue_type_style_index_0_scoped_b7380652_lang = "";
const _hoisted_1$4 = {
  id: "vehicleGridHeading",
  class: "mb-2 d-none d-md-block"
};
const _hoisted_2$4 = { key: 0 };
const _hoisted_3$4 = { key: 1 };
const _hoisted_4$4 = {
  key: 0,
  id: "vehicleGridDescription",
  class: "sr-only"
};
const _hoisted_5$4 = {
  "aria-live": "assertive",
  class: "sr-only"
};
const _hoisted_6$4 = {
  key: 1,
  class: "container-fluid flex-container"
};
const _hoisted_7$4 = {
  id: "vue-app",
  class: "row scrollable"
};
const _hoisted_8$4 = { class: "filter-container filter-container-desktop d-none d-md-block" };
const _hoisted_9$4 = { class: "filter-flex-container" };
const _hoisted_10$4 = { class: "flex-group input-field-group" };
const _hoisted_11$4 = { class: "mb-2" };
const _hoisted_12$4 = { class: "flex-group price-range-group" };
const _hoisted_13$4 = {
  class: "msrp-range",
  "aria-live": "polite"
};
const _hoisted_14$4 = { class: "max-msrp" };
const _hoisted_15$4 = {
  class: "wp-block-details has-gray-80-color has-text-color has-link-color is-layout-flow wp-block-details-is-layout-flow",
  style: { "text-align": "left", "font-size": "clamp(0.875rem, 0.875rem + ((1vw - 0.2rem) * 0.036), 0.9rem)" }
};
const _hoisted_16$4 = { class: "flex-group sort-by-group" };
const _hoisted_17$4 = { class: "flex-group-filters" };
const _hoisted_18$4 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_19$4 = ["aria-pressed"];
const _hoisted_20$4 = ["aria-pressed"];
const _hoisted_21$4 = ["aria-pressed"];
const _hoisted_22$4 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_23$4 = ["aria-pressed"];
const _hoisted_24$4 = ["aria-pressed"];
const _hoisted_25$4 = ["aria-pressed"];
const _hoisted_26$4 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_27$4 = ["aria-pressed"];
const _hoisted_28$4 = ["aria-pressed"];
const _hoisted_29$4 = { class: "flex-group d-none d-lg-block type-key-group" };
const _hoisted_30$4 = { class: "type-key" };
const _hoisted_31$4 = { key: 0 };
const _hoisted_32$4 = { key: 1 };
const _hoisted_33$4 = { key: 2 };
const _hoisted_34$4 = { key: 3 };
const _hoisted_35$4 = { class: "type-key d-none d-md-block d-lg-none text-center" };
const _hoisted_36$4 = { class: "mt-2 d-block" };
const _hoisted_37$4 = { class: "filter-container filter-container-mobile d-sm-block d-md-none" };
const _hoisted_38$4 = ["src"];
const _hoisted_39$4 = {
  class: "mt-3",
  "aria-live": "polite"
};
const _hoisted_40$4 = { key: 0 };
const _hoisted_41$4 = { key: 1 };
const _hoisted_42$4 = { class: "mb-2" };
const _hoisted_43$4 = { class: "filter-flex-container" };
const _hoisted_44$4 = { class: "flex-group" };
const _hoisted_45$4 = { class: "msrp-range-slider" };
const _hoisted_46$4 = {
  class: "msrp-range",
  "aria-live": "polite"
};
const _hoisted_47$4 = { class: "max-msrp" };
const _hoisted_48$4 = { class: "msrp-link" };
const _hoisted_49$4 = {
  href: "#disclaimer",
  "aria-label": "navigate to the M.S.R.P. disclaimer information"
};
const _hoisted_50$4 = { class: "flex-group" };
const _hoisted_51$4 = { class: "flex-group-filters" };
const _hoisted_52$4 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_53$4 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_54$4 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_55$4 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_56$4 = { class: "type-key hidden-lg hidden-md" };
const _hoisted_57$4 = { key: 0 };
const _hoisted_58$4 = { key: 1 };
const _hoisted_59$4 = { key: 2 };
const _hoisted_60$3 = { key: 3 };
const _hoisted_61$3 = ["data-column-count", "aria-colcount", "aria-rowcount"];
const _hoisted_62$2 = {
  role: "row",
  style: { "display": "contents" }
};
const _hoisted_63$2 = ["tabindex", "onKeydown", "onFocus", "aria-label", "data-additional-info"];
const _hoisted_64$2 = { class: "ev-img" };
const _hoisted_65$2 = ["src", "alt"];
const _hoisted_66$2 = { style: { "margin-bottom": "1rem" } };
const _hoisted_67$2 = ["data-make"];
const _hoisted_68$2 = ["data-type"];
const _hoisted_69$2 = ["data-model"];
const _hoisted_70$2 = ["data-year"];
const _hoisted_71$2 = ["data-msrp"];
const _hoisted_72$2 = { key: 0 };
const _hoisted_73$2 = ["data-msrp-range"];
const _hoisted_74$2 = { key: 0 };
const _hoisted_75$2 = { class: "d-block mt-2 mb-1 range-electric" };
const _hoisted_76$1 = {
  key: 3,
  class: "d-block range-full"
};
const _hoisted_77$1 = {
  key: 4,
  class: "d-block range-full"
};
const _hoisted_84 = {
  key: 1,
  class: "d-block mt-2 mb-1 rebate-provincial"
};
const _hoisted_85 = {
  key: 2,
  class: "d-block mt-2 mb-1 rebate-provincial"
};
const _hoisted_86 = {
  key: 3,
  class: "d-block rebate-federal"
};
const _hoisted_87 = {
  key: 4,
  class: "d-block rebate-federal"
};
const _hoisted_88 = {
  key: 5,
  class: "d-block rebate-federal"
};
const _hoisted_89 = { class: "d-block" };
const _hoisted_90 = ["href", "aria-label"];
const _hoisted_91 = {
  key: 0,
  class: "rebate-content"
};
const _hoisted_92 = {
  key: 1,
  class: "rebate-content"
};
const _hoisted_93 = {
  key: 0,
  class: "vehicle-details"
};
const _hoisted_94 = { class: "no-content" };
const _hoisted_95 = ["src"];
const publicDomain = "https://goelectricbc.goc.bc.ca";
const externalSVGImage = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 18 18" style="fill: #1d8045; object-fit: contain; width: 1rem; height: 1rem;" xml:space="preserve"><path d="M9.7,3.9c0-0.1-0.1-0.3-0.2-0.4C9.4,3.4,9.3,3.4,9.2,3.4H1.7c-0.4,0-0.9,0.2-1.2,0.5C0.2,4.2,0,4.6,0,5.1v11.2	c0,0.4,0.2,0.9,0.5,1.2C0.8,17.8,1.2,18,1.7,18h11.2c0.4,0,0.9-0.2,1.2-0.5c0.3-0.3,0.5-0.7,0.5-1.2V8.8c0-0.1-0.1-0.3-0.2-0.4 c-0.1-0.1-0.2-0.2-0.4-0.2c-0.1,0-0.3,0.1-0.4,0.2c-0.1,0.1-0.2,0.2-0.2,0.4v7.5c0,0.1-0.1,0.3-0.2,0.4c-0.1,0.1-0.2,0.2-0.4,0.2	H1.7c-0.1,0-0.3-0.1-0.4-0.2c-0.1-0.1-0.2-0.2-0.2-0.4V5.1c0-0.1,0.1-0.3,0.2-0.4c0.1-0.1,0.2-0.2,0.4-0.2h7.5 c0.1,0,0.3-0.1,0.4-0.2C9.7,4.2,9.7,4.1,9.7,3.9z"/><path d="M18,0.6c0-0.1-0.1-0.3-0.2-0.4C17.7,0.1,17.6,0,17.4,0h-5.6c-0.1,0-0.3,0.1-0.4,0.2c-0.1,0.1-0.2,0.2-0.2,0.4 s0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2h4.3l-9.2,9.2c-0.1,0.1-0.1,0.1-0.1,0.2c0,0.1,0,0.1,0,0.2s0,0.1,0,0.2 c0,0.1,0.1,0.1,0.1,0.2C7,11.1,7,11.2,7.1,11.2c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0s0.1-0.1,0.2-0.1l9.2-9.2v4.3 c0,0.1,0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2c0.1,0,0.3-0.1,0.4-0.2C17.9,6.5,18,6.3,18,6.2V0.6z"/></svg>';
const _sfc_main$4 = {
  __name: "vehicleFilterApp",
  setup(__props) {
    var _a;
    const vehiclesAPI = `${((_a = window.site) == null ? void 0 : _a.domain) ? window.site.domain : publicDomain}/wp-json/custom/v1/vehicles`;
    const vehicles = ref([]);
    const vehicleTypes = ref([]);
    const filterValue = ref("");
    const focusedCellIndex = ref(0);
    ref(7e4);
    const isMake = ref(false);
    const isType = ref("");
    const isModel = ref(true);
    const isMSRP = ref(false);
    const isClass = ref(false);
    const isRebate = ref(false);
    const isFederalRebate = ref(false);
    const isYear = ref(false);
    ref("");
    const isElectricRange = ref(false);
    const isFullRange = ref(false);
    const rangeValue = ref([28e3, 7e4]);
    const ariaLiveMessage = ref("");
    const columnCount = ref(4);
    let globalPluginDirFlag = false;
    let cleanBCLogo = ref("");
    let cleanBCLeaf = ref("");
    let placeholderImg = ref("");
    const rangeOptions = {
      dotSize: 24,
      width: "auto",
      height: 4,
      contained: false,
      direction: "ltr",
      data: null,
      min: 28e3,
      max: 7e4,
      interval: 500,
      disabled: false,
      clickable: true,
      duration: 0.5,
      adsorb: false,
      lazy: false,
      tooltip: "focus",
      tooltipPlacement: "top",
      tooltipFormatter: void 0,
      useKeyboard: true,
      enableCross: true,
      fixed: false,
      minRange: 5e3,
      maxRange: 65e3,
      order: true,
      marks: false,
      dotOptions: void 0,
      process: true,
      dotStyle: void 0,
      railStyle: void 0,
      processStyle: void 0,
      tooltipStyle: void 0,
      stepStyle: void 0,
      stepActiveStyle: void 0,
      labelStyle: void 0,
      labelActiveStyle: void 0
    };
    function handleResize() {
      const width = window.innerWidth;
      if (width <= 479) {
        columnCount.value = 1;
      } else if (width <= 991) {
        columnCount.value = 2;
      } else if (width <= 1024) {
        columnCount.value = 3;
      } else {
        columnCount.value = 4;
      }
    }
    function onGridKeydown(event, index) {
      const { key, ctrlKey } = event;
      let newIndex = focusedCellIndex.value;
      const itemCount = searchvehicles.value.length;
      const cols = columnCount.value;
      const row = Math.floor(index / cols);
      const col = index % cols;
      const maxRow = Math.floor((itemCount - 1) / cols);
      switch (key) {
        case "ArrowRight":
          event.preventDefault();
          if (col < cols - 1 && newIndex < itemCount - 1) {
            newIndex = index + 1;
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (col > 0) {
            newIndex = index - 1;
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (row < maxRow) {
            const downIndex = index + cols;
            if (downIndex < itemCount) {
              newIndex = downIndex;
            }
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (row > 0) {
            newIndex = index - cols;
          }
          break;
        case "Home":
          event.preventDefault();
          if (ctrlKey) {
            newIndex = 0;
          } else {
            newIndex = row * cols;
          }
          break;
        case "End":
          event.preventDefault();
          if (ctrlKey) {
            newIndex = itemCount - 1;
          } else {
            const endOfRowIndex = row * cols + (cols - 1);
            newIndex = Math.min(endOfRowIndex, itemCount - 1);
          }
          break;
        case "PageDown":
          event.preventDefault();
          {
            const skipRows = 3;
            const pageDownIndex = index + cols * skipRows;
            newIndex = Math.min(pageDownIndex, itemCount - 1);
          }
          break;
        case "PageUp":
          event.preventDefault();
          {
            const skipRows = 3;
            const pageUpIndex = index - cols * skipRows;
            newIndex = Math.max(pageUpIndex, 0);
          }
          break;
        default:
          return;
      }
      moveFocusToCell(newIndex);
    }
    function moveFocusToCell(newIndex) {
      if (newIndex < 0)
        newIndex = 0;
      if (newIndex >= searchvehicles.value.length) {
        newIndex = searchvehicles.value.length - 1;
      }
      focusedCellIndex.value = newIndex;
      nextTick(() => {
        const cells = document.querySelectorAll('.vehicle-details[role="gridcell"]');
        if (cells[focusedCellIndex.value]) {
          cells[focusedCellIndex.value].focus();
        }
      });
    }
    watch(() => {
      var _a2;
      return (_a2 = window.site) == null ? void 0 : _a2.domain;
    }, (newVal, oldVal) => {
      if (newVal) {
        fetchData();
      }
    });
    const searchvehicles = computed(() => {
      if (void 0 !== window.pluginCleanbc && false === globalPluginDirFlag) {
        globalPluginDirFlag = true;
        cleanBCLogo = ref(`${window.pluginCleanbc.pluginDir}/blocks/vue-blocks/src/assets/go_electric_cleanbc_logo.png`);
        cleanBCLeaf = ref(`${window.pluginCleanbc.pluginDir}/blocks/vue-blocks/src/assets/leaf-icon-01.png`);
        placeholderImg = ref(`${window.pluginCleanbc.pluginDir}/blocks/vue-blocks/src/assets/image-unavailable.png`);
      }
      let result = vehicles.value;
      if (!filterValue.value && rangeValue.value[1] === 7e4 && rangeValue.value[0] === 28e3) {
        return result;
      }
      let filterValueLowerCase = filterValue.value.toLowerCase();
      let maxPriceRange = parseInt(rangeValue.value[1]);
      let minPriceRange = parseInt(rangeValue.value[0]);
      return result.filter((vehicle) => {
        let actualVehiclePriceMin = parseInt(vehicle.minMsrp);
        let actualVehiclePriceMax = vehicle.maxMsrp === 0 ? actualVehiclePriceMin : parseInt(vehicle.maxMsrp);
        if (minPriceRange < 29500 && vehicle.make === "Smart" && filterValueLowerCase === "") {
          return true;
        }
        if (minPriceRange > actualVehiclePriceMax) {
          return false;
        }
        if (maxPriceRange < actualVehiclePriceMin) {
          return false;
        }
        if (minPriceRange < actualVehiclePriceMin && maxPriceRange < actualVehiclePriceMax) {
          return true;
        }
        if (minPriceRange > actualVehiclePriceMin && maxPriceRange > actualVehiclePriceMax) {
          return true;
        }
        const yearMatch = vehicle.year.some(
          (year) => year.toString().includes(filterValue.value)
        );
        return vehicle.make.toLowerCase().includes(filterValueLowerCase) || vehicle.model.toLowerCase().includes(filterValueLowerCase) || vehicle.type.toLowerCase().includes(filterValueLowerCase) || yearMatch;
      });
    });
    const getEVArray = () => {
      fetch(vehiclesAPI, { cache: "no-store" }).then((r) => r.json()).then((json) => {
        vehicles.value = json;
        vehicles.value.sort((a, b) => a.model.toLowerCase().localeCompare(b.model.toLowerCase()));
        vehicleTypes.value = [...new Set(vehicles.value.map((vehicle) => vehicle.type))];
      }).catch((error) => {
        console.error("Error fetching vehicle data:", error);
      });
    };
    const changeOrder = (val) => {
      let selection = val;
      isMake.value = selection === "make";
      isModel.value = selection === "model";
      isMSRP.value = selection === "msrp";
      isClass.value = selection === "class";
      isRebate.value = selection === "rebate";
      isType.value = selection === "type";
      isYear.value = selection === "year";
      isElectricRange.value = selection === "rangeElectric";
      isFullRange.value = selection === "rangeFull";
      const sortFunctions = {
        make: (a, b) => a.make.localeCompare(b.make),
        model: (a, b) => a.model.toLowerCase().localeCompare(b.model.toLowerCase()),
        msrp: (a, b) => b.minMsrp - a.minMsrp,
        class: (a, b) => a.vehicle_class.localeCompare(b.vehicle_class),
        rebate: (a, b) => b.rebate_provincial + b.rebate_federal - (a.rebate_provincial + a.rebate_federal),
        type: (a, b) => a.type.localeCompare(b.type),
        year: (a, b) => b.year - a.year,
        rangeElectric: (a, b) => parseInt(b.rangeElectricKm) - parseInt(a.rangeElectricKm),
        rangeFull: (a, b) => {
          const aRange = a.rangeFullKm || a.rangeElectricKm;
          const bRange = b.rangeFullKm || b.rangeElectricKm;
          return parseInt(bRange) - parseInt(aRange);
        }
      };
      if (sortFunctions[selection]) {
        vehicles.value.sort(sortFunctions[selection]);
      }
    };
    watch(searchvehicles, async () => {
      await nextTick();
      ariaLiveMessage.value = `${searchvehicles.value.length} of ${vehicles.value.length}`;
    });
    onMounted(async () => {
      window.addEventListener("resize", handleResize);
      handleResize();
      const appElement = document.getElementById("vehicleFilterApp");
      const showFederalRebates = appElement.getAttribute("data-show-federal-rebates") === "false";
      isFederalRebate.value = !showFederalRebates;
      getEVArray();
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });
    return (_ctx, _cache) => {
      const _component_nobr = resolveComponent("nobr");
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("h3", _hoisted_1$4, [
          _cache[20] || (_cache[20] = createTextVNode("Find a vehicle ")),
          vehicles.value.length ? (openBlock(), createElementBlock("span", _hoisted_2$4, "(" + toDisplayString(ariaLiveMessage.value) + ")", 1)) : (openBlock(), createElementBlock("span", _hoisted_3$4, "(no vehicles currently available)"))
        ]),
        (openBlock(), createElementBlock("p", _hoisted_4$4, "A grid of available vehicles filtered by selected options.")),
        createBaseVNode("span", _hoisted_5$4, "Find a vehicle is showing " + toDisplayString(ariaLiveMessage.value), 1),
        vehicles.value.length ? (openBlock(), createElementBlock("div", _hoisted_6$4, [
          createBaseVNode("div", _hoisted_7$4, [
            createBaseVNode("div", _hoisted_8$4, [
              createBaseVNode("div", _hoisted_9$4, [
                createBaseVNode("div", _hoisted_10$4, [
                  _cache[21] || (_cache[21] = createBaseVNode("h4", { id: "make-header-mobile" }, "By make, model or year", -1)),
                  createBaseVNode("div", _hoisted_11$4, [
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filterValue.value = $event),
                      class: "form-control",
                      placeholder: "filter by name...",
                      "aria-label": "enter a vehicle make or model to filter the options below"
                    }, null, 512), [
                      [vModelText, filterValue.value]
                    ])
                  ]),
                  _cache[22] || (_cache[22] = createBaseVNode("p", { class: "msrp-link text-dark" }, "...or by EV type eg: BEV or PHEV", -1))
                ]),
                createBaseVNode("div", _hoisted_12$4, [
                  _cache[28] || (_cache[28] = createBaseVNode("h4", null, "Price Range", -1)),
                  createVNode(unref(VueSlider), mergeProps({
                    ref: "slider",
                    modelValue: rangeValue.value,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => rangeValue.value = $event)
                  }, rangeOptions, {
                    tabindex: "0",
                    "aria-label": "This slider allows you to set a minimum and maximum price range – the low end begins at the minimum amount of 28,000 and the high end is set to the maximum amount of 70,000"
                  }), null, 16, ["modelValue"]),
                  createBaseVNode("p", _hoisted_13$4, [
                    createTextVNode("$" + toDisplayString(rangeValue.value[0] | _ctx.addComma) + " ", 1),
                    _cache[24] || (_cache[24] = createBaseVNode("span", { class: "sr-only" }, "minimum price to ", -1)),
                    createBaseVNode("span", _hoisted_14$4, [
                      createTextVNode("$" + toDisplayString(rangeValue.value[1] | _ctx.addComma), 1),
                      _cache[23] || (_cache[23] = createBaseVNode("span", { class: "sr-only" }, "maximum price", -1))
                    ])
                  ]),
                  createBaseVNode("details", _hoisted_15$4, [
                    createBaseVNode("summary", null, [
                      _cache[26] || (_cache[26] = createTextVNode("Price range as shown is based on automaker ")),
                      createVNode(_component_nobr, null, {
                        default: withCtx(() => _cache[25] || (_cache[25] = [
                          createTextVNode("MSRP"),
                          createBaseVNode("sup", null, " *", -1)
                        ])),
                        _: 1
                      })
                    ]),
                    _cache[27] || (_cache[27] = createBaseVNode("div", { class: "wp-block-group is-layout-flow wp-block-group-is-layout-flow" }, [
                      createBaseVNode("p", null, "* Automakers provide a manufacturer's suggested retail price (MSRP) when they apply to make their vehicles eligible for rebates. MSRPs listed do not include any fees that are part of the sale of a vehicle. They also do not include the cost of any optional accessories. Vehicle prices change often. Refer to automaker or dealer website for up-to-date prices. Vehicle information is about the most recent model listed. Other model years may vary.")
                    ], -1))
                  ])
                ]),
                createBaseVNode("div", _hoisted_16$4, [
                  createBaseVNode("div", _hoisted_17$4, [
                    _cache[30] || (_cache[30] = createBaseVNode("h4", { style: { "margin-bottom": "0.25rem" } }, "Sort by", -1)),
                    createBaseVNode("div", _hoisted_18$4, [
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isMake.value }]),
                        "aria-pressed": isMake.value,
                        onClick: _cache[2] || (_cache[2] = ($event) => changeOrder("make")),
                        "aria-label": "sort available vehicles by Make"
                      }, "Make", 10, _hoisted_19$4),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isModel.value }]),
                        "aria-pressed": isModel.value,
                        onClick: _cache[3] || (_cache[3] = ($event) => changeOrder("model")),
                        "aria-label": "sort available vehicles by Model"
                      }, "Model", 10, _hoisted_20$4),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isYear.value }]),
                        "aria-pressed": isYear.value,
                        onClick: _cache[4] || (_cache[4] = ($event) => changeOrder("year")),
                        "aria-label": "sort available vehicles by Year"
                      }, "Year", 10, _hoisted_21$4)
                    ]),
                    createBaseVNode("div", _hoisted_22$4, [
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isType.value }]),
                        "aria-pressed": isType.value,
                        onClick: _cache[5] || (_cache[5] = ($event) => changeOrder("type")),
                        "aria-label": "sort available vehicles by Type"
                      }, "EV Type", 10, _hoisted_23$4),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isMSRP.value }]),
                        "aria-pressed": isMSRP.value,
                        onClick: _cache[6] || (_cache[6] = ($event) => changeOrder("msrp")),
                        "aria-label": "sort available vehicles by MSRP"
                      }, _cache[29] || (_cache[29] = [
                        createTextVNode("MSRP"),
                        createBaseVNode("sup", null, " *", -1)
                      ]), 10, _hoisted_24$4),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isRebate.value }]),
                        "aria-pressed": isRebate.value,
                        onClick: _cache[7] || (_cache[7] = ($event) => changeOrder("rebate")),
                        "aria-label": "sort vehicles by Rebate"
                      }, "Rebate Amt.", 10, _hoisted_25$4)
                    ]),
                    createBaseVNode("div", _hoisted_26$4, [
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-50", { active: isElectricRange.value }]),
                        "aria-pressed": isElectricRange.value,
                        onClick: _cache[8] || (_cache[8] = ($event) => changeOrder("rangeElectric")),
                        "aria-label": "sort vehicles by Electric Range"
                      }, "Elec. Range", 10, _hoisted_27$4),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-50", { active: isFullRange.value }]),
                        "aria-pressed": isFullRange.value,
                        onClick: _cache[9] || (_cache[9] = ($event) => changeOrder("rangeFull")),
                        "aria-label": "sort vehicles by Full Range"
                      }, "Full Range", 10, _hoisted_28$4)
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_29$4, [
                  _cache[35] || (_cache[35] = createBaseVNode("h4", null, "Available EV Types", -1)),
                  createBaseVNode("p", _hoisted_30$4, [
                    vehicleTypes.value && vehicleTypes.value.includes("BEV") ? (openBlock(), createElementBlock("span", _hoisted_31$4, _cache[31] || (_cache[31] = [
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, [
                          createTextVNode("B"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("E"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("V"),
                          createBaseVNode("span", { class: "sr-only" }, ".")
                        ])
                      ], -1),
                      createTextVNode(" – Battery Electric Vehicle"),
                      createBaseVNode("br", null, null, -1)
                    ]))) : createCommentVNode("", true),
                    vehicleTypes.value && vehicleTypes.value.includes("ER-EV") ? (openBlock(), createElementBlock("span", _hoisted_32$4, _cache[32] || (_cache[32] = [
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, [
                          createTextVNode("E"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("R"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("-E"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("V"),
                          createBaseVNode("span", { class: "sr-only" }, ".")
                        ])
                      ], -1),
                      createTextVNode(" – Extended Range EV"),
                      createBaseVNode("br", null, null, -1)
                    ]))) : createCommentVNode("", true),
                    vehicleTypes.value && vehicleTypes.value.includes("FCEV") ? (openBlock(), createElementBlock("span", _hoisted_33$4, _cache[33] || (_cache[33] = [
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, [
                          createTextVNode("F"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("C"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("E"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("V"),
                          createBaseVNode("span", { class: "sr-only" }, ".")
                        ])
                      ], -1),
                      createTextVNode(" – Fuel Cell Electric Vehicle"),
                      createBaseVNode("br", null, null, -1)
                    ]))) : createCommentVNode("", true),
                    vehicleTypes.value && vehicleTypes.value.includes("PHEV") ? (openBlock(), createElementBlock("span", _hoisted_34$4, _cache[34] || (_cache[34] = [
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, [
                          createTextVNode("P"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("H"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("E"),
                          createBaseVNode("span", { class: "sr-only" }, "."),
                          createTextVNode("V"),
                          createBaseVNode("span", { class: "sr-only" }, ".")
                        ])
                      ], -1),
                      createTextVNode(" – Plug-in Hybrid EV"),
                      createBaseVNode("br", null, null, -1)
                    ]))) : createCommentVNode("", true)
                  ])
                ])
              ]),
              createBaseVNode("h4", _hoisted_35$4, [
                _cache[40] || (_cache[40] = createTextVNode("Available EV Types:")),
                _cache[41] || (_cache[41] = createBaseVNode("br", null, null, -1)),
                createBaseVNode("span", _hoisted_36$4, [
                  vehicleTypes.value && vehicleTypes.value.includes("BEV") ? (openBlock(), createBlock(_component_nobr, { key: 0 }, {
                    default: withCtx(() => _cache[36] || (_cache[36] = [
                      createBaseVNode("strong", null, "BEV", -1),
                      createTextVNode(" – Battery Electric Vehicle | ")
                    ])),
                    _: 1
                  })) : createCommentVNode("", true),
                  vehicleTypes.value && vehicleTypes.value.includes("ER-EV") ? (openBlock(), createBlock(_component_nobr, { key: 1 }, {
                    default: withCtx(() => _cache[37] || (_cache[37] = [
                      createBaseVNode("strong", null, "ER-EV", -1),
                      createTextVNode(" – Extended Range EV | ")
                    ])),
                    _: 1
                  })) : createCommentVNode("", true),
                  vehicleTypes.value && vehicleTypes.value.includes("FCEV") ? (openBlock(), createBlock(_component_nobr, { key: 2 }, {
                    default: withCtx(() => _cache[38] || (_cache[38] = [
                      createBaseVNode("strong", null, "FCEV", -1),
                      createTextVNode(" – Fuel Cell Electric Vehicle | ")
                    ])),
                    _: 1
                  })) : createCommentVNode("", true),
                  vehicleTypes.value && vehicleTypes.value.includes("PHEV") ? (openBlock(), createBlock(_component_nobr, { key: 3 }, {
                    default: withCtx(() => _cache[39] || (_cache[39] = [
                      createBaseVNode("strong", null, "PHEV", -1),
                      createTextVNode(" – Plug-in Hybrid EV")
                    ])),
                    _: 1
                  })) : createCommentVNode("", true)
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_37$4, [
              createBaseVNode("p", null, [
                createBaseVNode("img", {
                  class: "logo-img img-fluid",
                  src: unref(cleanBCLogo),
                  alt: "CleanBC Go electric"
                }, null, 8, _hoisted_38$4)
              ]),
              createBaseVNode("h3", _hoisted_39$4, [
                _cache[44] || (_cache[44] = createTextVNode("Find a vehicle ")),
                vehicles.value.length !== void 0 ? (openBlock(), createElementBlock("span", _hoisted_40$4, [
                  _cache[42] || (_cache[42] = createTextVNode("(")),
                  _cache[43] || (_cache[43] = createBaseVNode("span", { class: "sr-only" }, "showing", -1)),
                  createTextVNode(toDisplayString(searchvehicles.value.length) + " of " + toDisplayString(vehicles.value.length) + ")", 1)
                ])) : (openBlock(), createElementBlock("span", _hoisted_41$4, "(no vehicles currently available)"))
              ]),
              _cache[69] || (_cache[69] = createBaseVNode("h4", { id: "make-header" }, "By make or model or type", -1)),
              createBaseVNode("p", _hoisted_42$4, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => filterValue.value = $event),
                  class: "form-control",
                  placeholder: "filter by name...",
                  "aria-label": "enter a vehicle make or model to filter the options below"
                }, null, 512), [
                  [vModelText, filterValue.value]
                ])
              ]),
              _cache[70] || (_cache[70] = createBaseVNode("p", { class: "msrp-link text-dark" }, "...or by EV type eg: BEV or PHEV", -1)),
              createBaseVNode("div", _hoisted_43$4, [
                createBaseVNode("div", _hoisted_44$4, [
                  _cache[52] || (_cache[52] = createBaseVNode("h4", null, "MSRP Range", -1)),
                  createBaseVNode("div", _hoisted_45$4, [
                    createVNode(unref(VueSlider), mergeProps({
                      ref: "slider",
                      modelValue: rangeValue.value,
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => rangeValue.value = $event)
                    }, rangeOptions), null, 16, ["modelValue"]),
                    createBaseVNode("p", _hoisted_46$4, [
                      createTextVNode("$" + toDisplayString(rangeValue.value[0] | _ctx.addComma) + " ", 1),
                      _cache[46] || (_cache[46] = createBaseVNode("span", { class: "sr-only" }, "minimum price to ", -1)),
                      _cache[47] || (_cache[47] = createTextVNode()),
                      _cache[48] || (_cache[48] = createBaseVNode("span", { "aria-hidden": "true" }, "–", -1)),
                      _cache[49] || (_cache[49] = createTextVNode()),
                      createBaseVNode("span", _hoisted_47$4, [
                        createTextVNode("$" + toDisplayString(rangeValue.value[1] | _ctx.addComma), 1),
                        _cache[45] || (_cache[45] = createBaseVNode("span", { class: "sr-only" }, "maximum price", -1))
                      ])
                    ])
                  ]),
                  createBaseVNode("p", _hoisted_48$4, [
                    createBaseVNode("a", _hoisted_49$4, [
                      _cache[51] || (_cache[51] = createTextVNode("Price range as shown is based on automaker ")),
                      createVNode(_component_nobr, null, {
                        default: withCtx(() => _cache[50] || (_cache[50] = [
                          createTextVNode("MSRP"),
                          createBaseVNode("sup", null, " *", -1)
                        ])),
                        _: 1
                      })
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_50$4, [
                  createBaseVNode("div", _hoisted_51$4, [
                    createBaseVNode("div", _hoisted_52$4, [
                      _cache[53] || (_cache[53] = createBaseVNode("span", { class: "filter-header" }, "Sort by ▸", -1)),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isMake.value }]),
                        onClick: _cache[12] || (_cache[12] = ($event) => changeOrder("make")),
                        "aria-label": "sort vehicles by Make"
                      }, "Make", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isModel.value }]),
                        onClick: _cache[13] || (_cache[13] = ($event) => changeOrder("model")),
                        "aria-label": "sort vehicles by Model"
                      }, "Model", 2)
                    ]),
                    createBaseVNode("div", _hoisted_53$4, [
                      _cache[55] || (_cache[55] = createBaseVNode("span", { class: "filter-header" }, "Value ▸", -1)),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isMSRP.value }]),
                        onClick: _cache[14] || (_cache[14] = ($event) => changeOrder("msrp")),
                        "aria-label": "sort vehicles by MSRP"
                      }, _cache[54] || (_cache[54] = [
                        createTextVNode("MSRP"),
                        createBaseVNode("sup", null, " *", -1)
                      ]), 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isRebate.value }]),
                        onClick: _cache[15] || (_cache[15] = ($event) => changeOrder("rebate")),
                        "aria-label": "sort vehicles by Rebate"
                      }, "Rebate Amt.", 2)
                    ]),
                    createBaseVNode("div", _hoisted_54$4, [
                      _cache[56] || (_cache[56] = createBaseVNode("span", { class: "filter-header" }, "Range ▸", -1)),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isElectricRange.value }]),
                        onClick: _cache[16] || (_cache[16] = ($event) => changeOrder("rangeElectric")),
                        "aria-label": "sort vehicles by Electric Range"
                      }, "Electric", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isFullRange.value }]),
                        onClick: _cache[17] || (_cache[17] = ($event) => changeOrder("rangeFull")),
                        "aria-label": "sort vehicles by Full Range"
                      }, "Full", 2)
                    ]),
                    createBaseVNode("div", _hoisted_55$4, [
                      _cache[57] || (_cache[57] = createBaseVNode("span", { class: "filter-header" }, "Style ▸", -1)),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isType.value }]),
                        onClick: _cache[18] || (_cache[18] = ($event) => changeOrder("type")),
                        "aria-label": "sort vehicles by Type"
                      }, "EV Type", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isYear.value }]),
                        onClick: _cache[19] || (_cache[19] = ($event) => changeOrder("year")),
                        "aria-label": "sort vehicles by Type"
                      }, "Year", 2)
                    ])
                  ])
                ]),
                createBaseVNode("p", _hoisted_56$4, [
                  _cache[67] || (_cache[67] = createTextVNode("Available EV Types ")),
                  _cache[68] || (_cache[68] = createBaseVNode("br", null, null, -1)),
                  vehicleTypes.value && vehicleTypes.value.includes("BEV") ? (openBlock(), createElementBlock("span", _hoisted_57$4, [
                    createVNode(_component_nobr, null, {
                      default: withCtx(() => _cache[58] || (_cache[58] = [
                        createBaseVNode("strong", null, "BEV", -1),
                        createTextVNode(" – Battery Electric Vehicle")
                      ])),
                      _: 1
                    }),
                    _cache[59] || (_cache[59] = createTextVNode()),
                    _cache[60] || (_cache[60] = createBaseVNode("br", null, null, -1))
                  ])) : createCommentVNode("", true),
                  vehicleTypes.value && vehicleTypes.value.includes("ER-EV") ? (openBlock(), createElementBlock("span", _hoisted_58$4, [
                    createVNode(_component_nobr, null, {
                      default: withCtx(() => _cache[61] || (_cache[61] = [
                        createBaseVNode("strong", null, "ER-EV", -1),
                        createTextVNode(" – Extended Range EV")
                      ])),
                      _: 1
                    }),
                    _cache[62] || (_cache[62] = createBaseVNode("br", null, null, -1))
                  ])) : createCommentVNode("", true),
                  vehicleTypes.value && vehicleTypes.value.includes("FCEV") ? (openBlock(), createElementBlock("span", _hoisted_59$4, [
                    createVNode(_component_nobr, null, {
                      default: withCtx(() => _cache[63] || (_cache[63] = [
                        createBaseVNode("strong", null, "FCEV", -1),
                        createTextVNode(" – Fuel Cell Electric Vehicle")
                      ])),
                      _: 1
                    }),
                    _cache[64] || (_cache[64] = createTextVNode()),
                    _cache[65] || (_cache[65] = createBaseVNode("br", null, null, -1))
                  ])) : createCommentVNode("", true),
                  vehicleTypes.value && vehicleTypes.value.includes("PHEV") ? (openBlock(), createElementBlock("span", _hoisted_60$3, [
                    createVNode(_component_nobr, null, {
                      default: withCtx(() => _cache[66] || (_cache[66] = [
                        createBaseVNode("strong", null, "PHEV", -1),
                        createTextVNode(" – Plug-in Hybrid EV")
                      ])),
                      _: 1
                    })
                  ])) : createCommentVNode("", true)
                ])
              ])
            ]),
            createBaseVNode("div", {
              role: "grid",
              "aria-labelledby": "vehicleGridDescription",
              "data-column-count": columnCount.value,
              "aria-colcount": columnCount.value,
              "aria-rowcount": Math.ceil(searchvehicles.value.length / columnCount.value),
              style: { "display": "contents" }
            }, [
              createBaseVNode("div", _hoisted_62$2, [
                searchvehicles.value.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(searchvehicles.value, (vehicle, index) => {
                  return openBlock(), createElementBlock("div", {
                    class: "vehicle-details",
                    role: "gridcell",
                    tabindex: index === focusedCellIndex.value ? 0 : -1,
                    onKeydown: ($event) => onGridKeydown($event, index),
                    onFocus: ($event) => focusedCellIndex.value = index,
                    "aria-label": "Vehicle " + (index + 1) + " of " + searchvehicles.value.length + ". Make: " + vehicle.make + ". Model: " + vehicle.model + ".",
                    "data-additional-info": "Price starts at: $" + vehicle.minMsrp + ". Electric Range: " + vehicle.rangeElectricKm + " kilometers. Vehicle rebates up to: $" + (isFederalRebate.value ? vehicle.rebate_provincial + vehicle.rebate_federal : vehicle.rebate_provincial).toLocaleString() + "."
                  }, [
                    createBaseVNode("div", null, [
                      createBaseVNode("div", _hoisted_64$2, [
                        createBaseVNode("img", {
                          class: "img-fluid",
                          src: vehicle.image ? vehicle.image : unref(placeholderImg),
                          alt: "photo of a " + vehicle.make + " " + vehicle.model
                        }, null, 8, _hoisted_65$2)
                      ]),
                      createBaseVNode("p", _hoisted_66$2, [
                        createBaseVNode("span", {
                          class: "highlight vehicle-make-container",
                          "data-make": vehicle.make
                        }, toDisplayString(vehicle.make), 9, _hoisted_67$2),
                        _cache[77] || (_cache[77] = createTextVNode()),
                        _cache[78] || (_cache[78] = createBaseVNode("span", { class: "divider-container" }, [
                          createBaseVNode("strong", null, "|")
                        ], -1)),
                        _cache[79] || (_cache[79] = createTextVNode()),
                        createBaseVNode("span", {
                          class: "vehicle-type-container",
                          "data-type": vehicle.type
                        }, [
                          createBaseVNode("strong", null, toDisplayString(vehicle.type), 1)
                        ], 8, _hoisted_68$2),
                        createBaseVNode("span", {
                          class: "model vehicle-model-container",
                          "data-model": vehicle.model
                        }, toDisplayString(vehicle.model), 9, _hoisted_69$2),
                        0 !== vehicle.year.length ? (openBlock(), createElementBlock("span", {
                          key: 0,
                          class: "year vehicle-year-container",
                          "data-year": 20 + vehicle.year.map((year) => year - 2e3).join("/"),
                          style: { "margin-top": "0" }
                        }, "20" + toDisplayString(vehicle.year.map((year) => year - 2e3).join("/")), 9, _hoisted_70$2)) : createCommentVNode("", true),
                        vehicle.maxMsrp === 0 ? (openBlock(), createElementBlock("span", {
                          key: 1,
                          class: "msrp vehicle-msrp-container",
                          "data-msrp": "$" + vehicle.minMsrp.toLocaleString()
                        }, [
                          createBaseVNode("strong", null, [
                            _cache[71] || (_cache[71] = createTextVNode("MSRP")),
                            index === 0 ? (openBlock(), createElementBlock("sup", _hoisted_72$2, " *")) : createCommentVNode("", true),
                            createTextVNode(" $" + toDisplayString(vehicle.minMsrp.toLocaleString()), 1)
                          ])
                        ], 8, _hoisted_71$2)) : (openBlock(), createElementBlock("span", {
                          key: 2,
                          class: "msrp vehicle-msrp-container",
                          "data-msrp-range": "$" + vehicle.minMsrp.toLocaleString() + "-$" + vehicle.maxMsrp.toLocaleString()
                        }, [
                          createBaseVNode("strong", null, [
                            _cache[72] || (_cache[72] = createTextVNode("MSRP")),
                            index === 0 ? (openBlock(), createElementBlock("sup", _hoisted_74$2, "*")) : createCommentVNode("", true),
                            createTextVNode(": $" + toDisplayString(vehicle.minMsrp.toLocaleString()) + "–$" + toDisplayString(vehicle.maxMsrp.toLocaleString()), 1)
                          ])
                        ], 8, _hoisted_73$2)),
                        _cache[80] || (_cache[80] = createBaseVNode("hr", {
                          class: "hr",
                          size: "1"
                        }, null, -1)),
                        _cache[81] || (_cache[81] = createBaseVNode("span", { class: "d-block heading-range" }, [
                          createBaseVNode("strong", null, "Range:")
                        ], -1)),
                        createBaseVNode("span", _hoisted_75$2, toDisplayString(vehicle.rangeElectricKm.toLocaleString()) + "km Electric", 1),
                        vehicle.rangeFullKm !== 0 ? (openBlock(), createElementBlock("span", _hoisted_76$1, toDisplayString(vehicle.rangeFullKm.toLocaleString()) + "km Full", 1)) : createCommentVNode("", true),
                        vehicle.rangeFullKm === 0 ? (openBlock(), createElementBlock("span", _hoisted_77$1, toDisplayString(vehicle.rangeElectricKm) + "km Full", 1)) : createCommentVNode("", true),
                        createCommentVNode("", true),
                        isFederalRebate.value ? (openBlock(), createElementBlock(Fragment, { key: 6 }, [
                          createCommentVNode("", true),
                          _cache[74] || (_cache[74] = createBaseVNode("hr", {
                            class: "hr",
                            size: "1"
                          }, null, -1)),
                          _cache[75] || (_cache[75] = createBaseVNode("span", { class: "d-block heading-rebates" }, [
                            createBaseVNode("strong", null, "Rebates up to:")
                          ], -1)),
                          vehicle.rebate_provincial !== 0 ? (openBlock(), createElementBlock("span", _hoisted_84, "$" + toDisplayString(vehicle.rebate_provincial.toLocaleString()) + " Provincial", 1)) : (openBlock(), createElementBlock("span", _hoisted_85, "No Provincial rebate")),
                          isFederalRebate.value && vehicle.rebate_federal !== 0 && vehicle.rebate_federal_status === "processed" ? (openBlock(), createElementBlock("span", _hoisted_86, "$" + toDisplayString(vehicle.rebate_federal.toLocaleString()) + " Federal", 1)) : vehicle.rebate_federal_status === "pending" ? (openBlock(), createElementBlock("span", _hoisted_87, "Federal rebate pending")) : isFederalRebate.value ? (openBlock(), createElementBlock("span", _hoisted_88, "No Federal rebate")) : createCommentVNode("", true)
                        ], 64)) : createCommentVNode("", true),
                        _cache[82] || (_cache[82] = createBaseVNode("hr", {
                          class: "hr",
                          size: "1"
                        }, null, -1)),
                        createBaseVNode("span", _hoisted_89, [
                          (openBlock(), createElementBlock("a", {
                            class: "accessibleFocusItem",
                            href: vehicle.url,
                            "aria-label": "Go to the " + vehicle.make + " " + vehicle.model + " website.",
                            key: index
                          }, [
                            _cache[76] || (_cache[76] = createTextVNode("Visit manufacturer website ")),
                            createBaseVNode("span", {
                              "aria-hidden": "true",
                              innerHTML: externalSVGImage,
                              style: { "object-fit": "contain", "width": "16px", "height": "16px" }
                            })
                          ], 8, _hoisted_90))
                        ])
                      ]),
                      isFederalRebate.value && vehicle.rebate_federal_status === "processed" ? (openBlock(), createElementBlock("p", _hoisted_91, "Combined rebates up to $" + toDisplayString((vehicle.rebate_provincial + vehicle.rebate_federal).toLocaleString()), 1)) : !isFederalRebate.value ? (openBlock(), createElementBlock("p", _hoisted_92, "Provincial rebate up to $" + toDisplayString(vehicle.rebate_provincial.toLocaleString()), 1)) : createCommentVNode("", true)
                    ])
                  ], 40, _hoisted_63$2);
                }), 256)) : createCommentVNode("", true)
              ])
            ], 8, _hoisted_61$3),
            searchvehicles.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_93, [
              createBaseVNode("div", _hoisted_94, [
                createBaseVNode("img", { src: unref(cleanBCLeaf) }, null, 8, _hoisted_95)
              ]),
              _cache[83] || (_cache[83] = createBaseVNode("h3", { class: "no-content" }, "We're unable to find any Electric Vehicles that match your criteria", -1)),
              _cache[84] || (_cache[84] = createBaseVNode("p", { class: "no-content" }, "Your filtering options did not return any results. Please try refining your input or parameters. Common issues include invalid makes or models, or too narrow a price range.", -1))
            ])) : createCommentVNode("", true)
          ])
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
};
const VehicleFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-b7380652"]]);
function decodeHtmlEntities(text) {
  const parser = new DOMParser();
  const doc2 = parser.parseFromString(text, "text/html");
  return doc2.documentElement.textContent;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function scrollToElementID(el, scrollMarginTop = "0px") {
  const target = document.querySelector(`#${el}`);
  if (target) {
    const originalScrollMarginTop = target.style.scrollMarginTop;
    target.style.scrollMarginTop = scrollMarginTop;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      target.style.scrollMarginTop = originalScrollMarginTop || "";
      const tabbableItem = target.querySelector("a");
      if (tabbableItem) {
        tabbableItem.focus();
        tabbableItem.blur();
      } else {
        console.warn(`No tabbable items found within #${el}.`);
      }
    }, 500);
  } else {
    console.warn(`Target element #${el} not found.`);
  }
}
function trackRebateClick({
  projectType,
  location,
  heatingType,
  filterValues,
  label,
  rebateText,
  destination
}) {
  if (window.snowplow) {
    window.snowplow("trackSelfDescribingEvent", {
      schema: "iglu:ca.bc.gov.cleanbc/rst/jsonschema/3-0-0",
      data: {
        action: "click",
        element_type: "rebate",
        project_type: projectType,
        location,
        heating_type: heatingType,
        filter_values: filterValues,
        label,
        // the rebate title
        rebate: rebateText,
        destination
        // a link URL
      }
    });
  }
}
const trackRebateFilterChange = ({
  projectType,
  location,
  heatingType,
  filterValues,
  label
}) => {
  if (window.snowplow) {
    window.snowplow("trackSelfDescribingEvent", {
      schema: "iglu:ca.bc.gov.cleanbc/rst/jsonschema/3-0-0",
      data: {
        action: "change",
        element_type: "filter",
        project_type: projectType,
        location,
        heating_type: heatingType,
        filter_values: filterValues,
        label
      }
    });
  }
};
const trackRebateUpgradeTypeChange = ({
  action,
  // 'select' or 'deselect'
  projectType,
  location,
  heatingType,
  filterValues,
  label
}) => {
  if (window.snowplow) {
    window.snowplow("trackSelfDescribingEvent", {
      schema: "iglu:ca.bc.gov.cleanbc/rst/jsonschema/3-0-0",
      data: {
        action,
        // 'select' or 'deselect'
        element_type: "filter",
        project_type: projectType,
        location,
        heating_type: heatingType,
        filter_values: filterValues,
        // array of all selected upgrade types
        label
        // which upgrade type was just selected/deselected
      }
    });
  }
};
function trackFaqSearch({
  newValue,
  oldValue
}) {
  if (window.snowplow) {
    window.snowplow("trackSelfDescribingEvent", {
      schema: "iglu:ca.bc.gov.cleanbc/faq/jsonschema/1-0-0",
      data: {
        action: "search",
        element_type: "faq-text-search",
        old_value: oldValue,
        new_value: newValue
      }
    });
  }
}
function trackFaqFilterChange({ filterName, newValue, oldValue }) {
  if (window.snowplow) {
    window.snowplow("trackSelfDescribingEvent", {
      schema: "iglu:ca.bc.gov.cleanbc/faq/jsonschema/1-0-0",
      data: {
        action: "change",
        element_type: `faq-${filterName}`,
        old_value: oldValue || "",
        new_value: newValue
      }
    });
  }
}
function trackFaqAccordionToggle({ action, faqId, faqTitle }) {
  if (window.snowplow) {
    window.snowplow("trackSelfDescribingEvent", {
      schema: "iglu:ca.bc.gov.cleanbc/faq/jsonschema/1-0-0",
      data: {
        action,
        // 'expand' or 'collapse'
        element_type: "faq-accordion",
        faq_id: faqId,
        faq_title: faqTitle
      }
    });
  }
}
function trackFaqLinkClick({ faqId, faqTitle, href, linkText }) {
  if (window.snowplow) {
    window.snowplow("trackSelfDescribingEvent", {
      schema: "iglu:ca.bc.gov.cleanbc/faq/jsonschema/1-0-0",
      data: {
        action: "click",
        element_type: "faq-internal-link",
        faq_id: faqId,
        faq_title: faqTitle,
        destination: href,
        label: linkText || ""
      }
    });
  }
}
function trackProviderFilterChange({
  filterName,
  upgradeType,
  program,
  location,
  label
}) {
  window.snowplow("trackSelfDescribingEvent", {
    schema: "iglu:ca.bc.gov.cleanbc/providers/jsonschema/1-0-0",
    data: {
      action: "change",
      element_type: `${filterName}-filter`,
      upgrade_type: upgradeType,
      program,
      service_location: location,
      label
    }
  });
}
function trackProviderClick({
  filterName,
  upgradeType,
  program,
  location,
  companyName,
  destination
}) {
  window.snowplow("trackSelfDescribingEvent", {
    schema: "iglu:ca.bc.gov.cleanbc/providers/jsonschema/1-0-0",
    data: {
      action: "click",
      element_type: `${filterName}-link`,
      upgrade_type: upgradeType,
      program,
      service_location: location,
      label: companyName,
      destination
    }
  });
}
const localAnalyticsReady = () => {
  var _a, _b;
  const isServerEnv = (_a = window.site) == null ? void 0 : _a.domain.includes("bc.ca");
  const isLocalEnv = (_b = window.site) == null ? void 0 : _b.domain.includes(".local");
  if (!isServerEnv || isLocalEnv) {
    (function(p2, l, o, w, i, n, g) {
      if (!p2[i]) {
        p2.GlobalSnowplowNamespace = p2.GlobalSnowplowNamespace || [];
        p2.GlobalSnowplowNamespace.push(i);
        p2[i] = function() {
          (p2[i].q = p2[i].q || []).push(arguments);
        };
        p2[i].q = p2[i].q || [];
        n = l.createElement(o);
        g = l.getElementsByTagName(o)[0];
        n.async = 1;
        n.src = w;
        g.parentNode.insertBefore(n, g);
      }
    })(window, document, "script", "https://www2.gov.bc.ca/StaticWebResources/static/sp/sp-2-14-0.js", "snowplow");
    const collector = "spt.apps.gov.bc.ca";
    window.snowplow("newTracker", "rt", collector, {
      appId: "Snowplow_standalone",
      cookieLifetime: 86400 * 548,
      platform: "web",
      post: true,
      forceSecureTracker: true,
      contexts: {
        webPage: true,
        performanceTiming: true
      }
    });
    window.snowplow("enableActivityTracking", 30, 30);
    window.snowplow("enableLinkClickTracking");
    window.snowplow("trackPageView");
  }
};
const pqeaVueApp_vue_vue_type_style_index_0_scoped_69238911_lang = "";
const _hoisted_1$3 = { class: "inner" };
const _hoisted_2$3 = {
  key: 0,
  id: "pqeasFilterControls",
  class: "pqeasFilterControls filter-container"
};
const _hoisted_3$3 = {
  key: 0,
  class: "control category-select"
};
const _hoisted_4$3 = { class: "custom-select" };
const _hoisted_5$3 = {
  key: 0,
  value: "Renovating a home"
};
const _hoisted_6$3 = ["value"];
const _hoisted_7$3 = {
  key: 1,
  class: "control location-select"
};
const _hoisted_8$3 = { class: "custom-select" };
const _hoisted_9$3 = ["value"];
const _hoisted_10$3 = {
  key: 2,
  class: "control reset-filters"
};
const _hoisted_11$3 = ["onKeydown"];
const _hoisted_12$3 = {
  key: 3,
  class: "control copy-link-btn"
};
const _hoisted_13$3 = ["onKeydown", "disabled"];
const _hoisted_14$3 = {
  key: 4,
  class: "pqeasFilterPagination control pagination pagination--top"
};
const _hoisted_15$3 = ["disabled"];
const _hoisted_16$3 = { class: "pages" };
const _hoisted_17$3 = { class: "numValue current-page" };
const _hoisted_18$3 = { class: "numValue total-pages" };
const _hoisted_19$3 = ["disabled"];
const _hoisted_20$3 = { class: "totals" };
const _hoisted_21$3 = { class: "results-count" };
const _hoisted_22$3 = { class: "numValue paginated-pqeas" };
const _hoisted_23$3 = { class: "numValue filtered-pqeas" };
const _hoisted_24$3 = { class: "sr-status sr-only" };
const _hoisted_25$3 = {
  class: "results-count",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_26$3 = { class: "numValue paginated-pqeas" };
const _hoisted_27$3 = { class: "numValue filtered-pqeas" };
const _hoisted_28$3 = {
  class: "pages",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_29$3 = { class: "numValue current-page" };
const _hoisted_30$3 = { class: "numValue total-pages" };
const _hoisted_31$3 = { class: "results__title" };
const _hoisted_32$3 = { class: "counter__value" };
const _hoisted_33$3 = {
  id: "pqeasResults",
  class: "pqeasResults results table table--striped"
};
const _hoisted_34$3 = {
  key: 0,
  class: "no-results"
};
const _hoisted_35$3 = {
  key: 1,
  class: "is-loading"
};
const _hoisted_36$3 = {
  "data-label": "Company Name and Head Office",
  class: "pqea__company-and-location"
};
const _hoisted_37$3 = ["href", "onClick", "aria-label"];
const _hoisted_38$3 = {
  key: 1,
  class: "pqea__company"
};
const _hoisted_39$3 = { class: "pqea__location" };
const _hoisted_40$3 = {
  "data-label": "Contact Name",
  class: "pqea__contact-name"
};
const _hoisted_41$3 = {
  "data-label": "Contact Email and Phone",
  class: "pqea__email-and-phone"
};
const _hoisted_42$3 = ["href", "onClick"];
const _hoisted_43$3 = ["innerHTML"];
const _hoisted_44$3 = {
  key: 1,
  class: "pqea__email"
};
const _hoisted_45$3 = ["href", "onClick"];
const _hoisted_46$3 = {
  key: 3,
  class: "pqea__telephone"
};
const _hoisted_47$3 = {
  "data-label": "Service Organization(s)",
  class: "pqea__service-organizations"
};
const _hoisted_48$3 = { key: 0 };
const _hoisted_49$3 = ["href", "onClick", "aria-label"];
const _hoisted_50$3 = { key: 1 };
const _hoisted_51$3 = {
  "data-label": "Program Qualified Services",
  class: "pqea__services"
};
const _hoisted_52$3 = { key: 0 };
const _hoisted_53$3 = { key: 0 };
const _hoisted_54$3 = {
  key: 0,
  class: "pqeasFilterControls filter-container filter-container--bottom"
};
const _hoisted_55$3 = { class: "pqeasFilterPagination control pagination pagination--bottom" };
const _hoisted_56$3 = ["disabled"];
const _hoisted_57$3 = { class: "pages" };
const _hoisted_58$3 = { class: "numValue current-page" };
const _hoisted_59$3 = { class: "numValue total-pages" };
const _hoisted_60$2 = ["disabled"];
const _hoisted_61$2 = ["disabled"];
const _sfc_main$3 = {
  __name: "pqeaVueApp",
  setup(__props) {
    var _a;
    const pqeas = ref([]);
    const isVisible = ref(true);
    const defaultSelectedCategory = ref("Renovating a home");
    const selectedCategory = ref("Renovating a home");
    const defaultSelectedLocation = ref("all");
    const selectedLocation = ref("all");
    const showLoadingMessage = ref(true);
    const isLoading = ref(false);
    const activeClass = ref("is-active");
    const updatingClass = ref("is-updating");
    const pageSize = ref(30);
    const currentPage = ref(1);
    const itemsToClearFromSessionStorage = ref([
      "contractorsData",
      "contractorsTimestamp",
      "faqsData",
      "faqsTimestamp",
      "rebatesData",
      "rebatesTimestamp"
    ]);
    const oldPaginatedPqeasCount = ref(0);
    const oldFilteredPqeasCount = ref(0);
    const publicDomain2 = ref("https://betterhomes.gov.bc.ca");
    const pqeasAPI = `${((_a = window.site) == null ? void 0 : _a.domain) ? window.site.domain : publicDomain2}/wp-json/custom/v1/pqeas`;
    const filteredPqeas = computed(() => {
      const selectedLoc = selectedLocation.value;
      let filteredPqeas2 = [...filteredPqeasByCategory.value];
      if ("all" !== selectedLoc) {
        filteredPqeas2 = filteredPqeas2.filter((pqea) => pqea.locations && pqea.locations.some((location) => location.name === selectedLoc));
      }
      resetSelectsActiveState();
      return shuffleArray(filteredPqeas2);
    });
    const filteredPqeasByCategory = computed(() => {
      const selectedCat = selectedCategory.value;
      currentPage.value = 1;
      if (selectedCat === "all") {
        return pqeas.value;
      } else {
        return pqeas.value.filter((pqea) => pqea.categories && pqea.categories.includes(selectedCat));
      }
    });
    const handleUpdatingAnimationClass = (elementCssPath) => {
      const elements = document.querySelectorAll(elementCssPath);
      if (0 < elements.length) {
        elements.forEach((element) => {
          element.classList.add(updatingClass.value);
          setTimeout(() => {
            element.classList.remove(updatingClass.value);
          }, 125);
        });
      }
    };
    const totalPages = computed(() => {
      const totalPqeas = filteredPqeas.value.length;
      return totalPqeas > 0 ? Math.ceil(totalPqeas / pageSize.value) : 1;
    });
    const paginatedPqeas = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredPqeas.value.slice(start, end);
    });
    const assembleUrl = () => {
      const baseUrl = window.location.origin + window.location.pathname;
      const urlParams = new URLSearchParams();
      urlParams.set("tool", "pqeas");
      if (categorySelect.value) {
        urlParams.set("category", encodeURIComponent(selectedCategory.value));
      }
      if (selectedLocation.value && selectedLocation.value !== "all") {
        urlParams.set("region", encodeURIComponent(selectedLocation.value));
      }
      return `${baseUrl}?${urlParams.toString()}`;
    };
    const addLinkToClipboard = (event) => {
      const url = assembleUrl();
      navigator.clipboard.writeText(url).then(() => {
        handleLinkCopiedMessageContent(event, ".filter-container", "Link copied to clipboard successfully!");
      }).catch((err) => {
        console.error("Failed to copy URL:", err);
        alert("Failed to copy the link. Please try again.");
      });
    };
    function handleLinkCopiedMessageContent(event, target = ".filter-container", msg) {
      const item = event.target.closest(target);
      const messageToUser = ref(msg);
      const messageArea = item ? item.querySelector(".copy-message") : null;
      if (messageArea && messageArea.classList.contains("isFadedOut")) {
        messageArea.innerText = messageToUser.value;
        messageArea.classList.remove("isFadedOut");
        setTimeout(() => {
          messageArea.classList.add("isFadedOut");
        }, 1e3);
        setTimeout(() => {
          if (messageArea.classList.contains("isFadedOut")) {
            messageArea.innerText = "";
          }
        }, 1600);
      }
    }
    const insertBreakableChar = (email) => {
      return email.replace(/@/g, "&#8203;@").replace(/\./g, "&#8203;.");
    };
    const prevPage = () => {
      return currentPage.value > 1 ? currentPage.value-- : null;
    };
    const nextPage = () => {
      return currentPage.value < totalPages.value ? currentPage.value++ : null;
    };
    const categories = computed(() => {
      const uniqueCategories = /* @__PURE__ */ new Set();
      pqeas.value.forEach((pqea) => {
        if (pqea.categories) {
          if (typeof pqea.categories === "string") {
            uniqueCategories.add(pqea.categories);
          } else if (Array.isArray(pqea.categories)) {
            pqea.categories.forEach((category) => {
              uniqueCategories.add(category);
            });
          }
        }
      });
      const sortedCategories = Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
      return [...sortedCategories];
    });
    const locations = computed(() => {
      const uniqueLocations = /* @__PURE__ */ new Set();
      pqeas.value.forEach((pqea) => {
        if (pqea.locations) {
          if (typeof pqea.locations === "string") {
            uniqueLocations.add(pqea.locations.name);
          } else if (Array.isArray(pqea.locations)) {
            pqea.locations.forEach((location) => {
              uniqueLocations.add(location.name);
            });
          }
        }
      });
      const sortedLocations = Array.from(uniqueLocations).sort((a, b) => a.localeCompare(b));
      return [...sortedLocations];
    });
    const currentTypeFilterMessage = computed(() => {
      return defaultSelectedCategory.value === selectedCategory.value ? "specializing in home construction" : "specializing in home renovation";
    });
    const currentLocationFilterMessage = computed(() => {
      return "all" !== selectedLocation.value ? "servicing " + selectedLocation.value : null;
    });
    const clearFilters = () => {
      resetSelectsActiveState();
      selectedCategory.value = defaultSelectedCategory.value;
      selectedLocation.value = defaultSelectedLocation.value;
      history.replaceState(selectedCategory.value, defaultSelectedCategory.value);
      history.replaceState(selectedLocation.value, defaultSelectedLocation.value);
      currentPage.value !== 1 ? handleUpdatingAnimationClass(".control.pagination .pages") : null;
      currentPage.value = 1;
    };
    const resetSelectsActiveState = () => {
      let activeSelects = document.querySelectorAll("#pqeaFilterApp .custom-select.is-active");
      0 < activeSelects.length ? activeSelects.forEach((item) => {
        item.classList.remove("is-active");
      }) : null;
    };
    const selectIsActive = (event) => {
      return "click" !== event.type ? event.target.parentNode.classList.remove(activeClass.value) : event.target.parentNode.classList.toggle(activeClass.value);
    };
    const isQuotaExceededError = (error) => {
      if (!error)
        return false;
      return error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED";
    };
    const isDataValid = (timestamp) => {
      const timeElapsed = Date.now() - parseInt(timestamp, 10);
      const hoursElapsed = timeElapsed / (1e3 * 60 * 60);
      return hoursElapsed < 24;
    };
    const fetchData2 = async () => {
      try {
        isLoading.value = true;
        showLoadingMessage.value = true;
        let data = sessionStorage.getItem("pqeasData");
        let timestamp = sessionStorage.getItem("pqeasTimestamp");
        let cachedData = null;
        if (data && timestamp && isDataValid(timestamp)) {
          cachedData = JSON.parse(data);
        } else {
          data = localStorage.getItem("pqeasData");
          timestamp = localStorage.getItem("pqeasTimestamp");
          if (data && timestamp && isDataValid(timestamp)) {
            cachedData = JSON.parse(data);
          }
        }
        if (cachedData) {
          pqeas.value = cachedData;
          showLoadingMessage.value = false;
          isLoading.value = false;
          return;
        }
        const response = await fetch(pqeasAPI, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        try {
          itemsToClearFromSessionStorage.value.forEach((item) => {
            sessionStorage.removeItem(item);
          });
          sessionStorage.clear();
        } catch (clearError) {
          console.warn("Error clearing sessionStorage:", clearError);
        }
        try {
          sessionStorage.setItem("pqeasData", JSON.stringify(json));
          sessionStorage.setItem("pqeasTimestamp", Date.now().toString());
        } catch (storageError) {
          if (isQuotaExceededError(storageError)) {
            console.warn("SessionStorage quota exceeded. Falling back to localStorage.");
            try {
              localStorage.setItem("pqeasData", JSON.stringify(json));
              localStorage.setItem("pqeasTimestamp", Date.now().toString());
            } catch (lsError) {
              console.error("Error setting data in localStorage:", lsError);
            }
          } else {
            console.error("Error setting data in sessionStorage:", storageError);
            throw storageError;
          }
        }
        pqeas.value = json;
        showLoadingMessage.value = false;
        isLoading.value = false;
      } catch (error) {
        console.error("Error fetching pqeas data:", error);
        throw error;
      }
    };
    watch(selectedCategory, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackProviderFilterChange({
          filterName: "pqea",
          upgradeType: newVal,
          location: selectedLocation.value,
          label: `Program changed to: ${newVal}`
        });
      }
    });
    watch(selectedLocation, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackProviderFilterChange({
          filterName: "pqea",
          upgradeType: selectedCategory.value,
          location: newVal,
          label: `Location changed to: ${newVal}`
        });
      }
    });
    const onProviderLinkClick = (pqea) => {
      trackProviderClick({
        filterName: "pqea",
        upgradeType: selectedCategory.value,
        location: selectedLocation.value,
        companyName: pqea.details.company_name || "",
        destination: pqea.details.company_website || ""
      });
    };
    const onEmailPhoneClick = (pqea, linkType) => {
      var _a2;
      let label = "";
      let destination = "";
      if (linkType === "email") {
        label = pqea.email ? `Email: ${pqea.details.email}` : "Email link";
        destination = `mailto:${pqea.details.email}`;
      } else {
        label = pqea.phone ? `Phone: ${pqea.details.phone}` : "Phone link";
        destination = `tel:+1${(_a2 = pqea.details.phone) == null ? void 0 : _a2.replace(/-/g, "")}`;
      }
      trackProviderClick({
        filterName: "pqea",
        upgradeType: selectedCategory.value,
        location: selectedLocation.value,
        companyName: pqea.details.company_name || "",
        destination,
        label
      });
    };
    watch(() => {
      var _a2;
      return (_a2 = window.site) == null ? void 0 : _a2.domain;
    }, (newVal) => {
      if (newVal) {
        fetchData2();
      }
    });
    watch(paginatedPqeas, () => {
      if (oldPaginatedPqeasCount.value !== paginatedPqeas.value.length) {
        oldPaginatedPqeasCount.value = paginatedPqeas.value.length;
        handleUpdatingAnimationClass(".control.pagination .paginated-pqeas");
      }
    });
    watch(filteredPqeas, () => {
      if (oldFilteredPqeasCount.value !== filteredPqeas.value.length) {
        oldFilteredPqeasCount.value = filteredPqeas.value.length;
        handleUpdatingAnimationClass(".control.pagination .filtered-pqeas");
        handleUpdatingAnimationClass(".counter__value");
      }
    });
    watch(currentPage, () => {
      handleUpdatingAnimationClass(".control.pagination .current-page");
    });
    watch(totalPages, () => {
      handleUpdatingAnimationClass(".control.pagination .total-pages");
    });
    watch([selectedCategory, selectedLocation], () => {
      currentPage.value = 1;
    });
    window.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select.is-active")) {
        if (document.querySelectorAll("#pqeaFilterApp .custom-select.is-active").length === 0) {
          resetSelectsActiveState();
        }
      }
    });
    onMounted(() => {
      localAnalyticsReady();
      const appElement = document.getElementById("pqeaFilterApp");
      const showControls = appElement.getAttribute("data-show-controls") === "false";
      isVisible.value = showControls;
      fetchData2();
      showLoadingMessage.value = true;
      const urlParams = new URLSearchParams(window.location.search);
      const showParam = urlParams.get("show");
      if (showParam === "off") {
        isVisible.value = true;
      }
    });
    watchEffect(() => {
      if (categories.value.length && locations.value.length) {
        const urlParams = new URLSearchParams(window.location.search);
        const showParam = urlParams.get("show");
        if (null !== urlParams.get("tool") && urlParams.get("tool") !== "pqeas") {
          console.warn('Tool parameter does not match "pqeas". Initialization skipped.');
          return;
        }
        if (showParam === "off") {
          isVisible.value = false;
        }
        const category = urlParams.get("category");
        const serviceRegion = urlParams.get("region");
        if (category) {
          const decodedCategory = decodeURIComponent(category);
          if (categories.value.includes(decodedCategory)) {
            selectedCategory.value = decodedCategory;
          } else {
            console.warn(`Invalid category: ${decodedCategory}`);
          }
        }
        if (serviceRegion) {
          const decodedRegion = decodeURIComponent(serviceRegion);
          if (locations.value.includes(decodedRegion)) {
            selectedLocation.value = decodedRegion;
          } else {
            console.warn(`Invalid service region: ${decodedRegion}`);
          }
        }
        showLoadingMessage.value = false;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$3, [
          _cache[23] || (_cache[23] = createBaseVNode("h2", { class: "sr-only" }, "Energy Advisor Listings", -1)),
          _cache[24] || (_cache[24] = createBaseVNode("a", {
            href: "#pqeasResults",
            class: "sr-only skip-to-results"
          }, "Skip to results", -1)),
          createVNode(Transition, { name: "fader" }, {
            default: withCtx(() => [
              isVisible.value || 1 < totalPages.value && !isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_2$3, [
                isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_3$3, [
                  _cache[3] || (_cache[3] = createBaseVNode("label", {
                    for: "categorySelect",
                    class: ""
                  }, "Choose between home construction and home renovation", -1)),
                  createBaseVNode("div", _hoisted_4$3, [
                    withDirectives(createBaseVNode("select", {
                      onChange: selectIsActive,
                      onClick: withModifiers(selectIsActive, ["prevent"]),
                      onTouchend: selectIsActive,
                      onKeyup: withKeys(selectIsActive, ["esc"]),
                      tabindex: "0",
                      id: "categorySelect",
                      class: "select select--category",
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedCategory.value = $event),
                      required: true,
                      "data-active": "false"
                    }, [
                      isLoading.value ? (openBlock(), createElementBlock("option", _hoisted_5$3, "Renovating a home")) : createCommentVNode("", true),
                      !isLoading.value ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(categories.value, (category, index) => {
                        return openBlock(), createElementBlock("option", {
                          key: category,
                          value: category
                        }, toDisplayString(category), 9, _hoisted_6$3);
                      }), 128)) : createCommentVNode("", true)
                    ], 544), [
                      [vModelSelect, selectedCategory.value]
                    ])
                  ])
                ])) : createCommentVNode("", true),
                isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_7$3, [
                  _cache[5] || (_cache[5] = createBaseVNode("label", {
                    for: "locationSelect",
                    class: ""
                  }, "Choose a service region", -1)),
                  createBaseVNode("div", _hoisted_8$3, [
                    withDirectives(createBaseVNode("select", {
                      onChange: selectIsActive,
                      onClick: withModifiers(selectIsActive, ["prevent"]),
                      onTouchend: selectIsActive,
                      onKeyup: withKeys(selectIsActive, ["esc"]),
                      tabindex: "0",
                      id: "locationSelect",
                      class: "select select--location",
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedLocation.value = $event)
                    }, [
                      _cache[4] || (_cache[4] = createBaseVNode("option", { value: "all" }, "All Locations", -1)),
                      (openBlock(true), createElementBlock(Fragment, null, renderList(locations.value, (location) => {
                        return openBlock(), createElementBlock("option", {
                          key: location,
                          value: location
                        }, toDisplayString(location), 9, _hoisted_9$3);
                      }), 128))
                    ], 544), [
                      [vModelSelect, selectedLocation.value]
                    ])
                  ])
                ])) : createCommentVNode("", true),
                isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_10$3, [
                  createBaseVNode("button", {
                    class: "clear-filters",
                    onClick: withModifiers(clearFilters, ["prevent"]),
                    onTouchend: clearFilters,
                    onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"]),
                    type: "button"
                  }, " Reset selection ", 40, _hoisted_11$3)
                ])) : createCommentVNode("", true),
                isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_12$3, [
                  createBaseVNode("button", {
                    class: "copy-link",
                    onClick: withModifiers(addLinkToClipboard, ["prevent"]),
                    onTouchend: addLinkToClipboard,
                    onKeydown: withKeys(withModifiers(addLinkToClipboard, ["prevent"]), ["enter"]),
                    disabled: selectedLocation.value === "all",
                    type: "button"
                  }, " Copy link ", 40, _hoisted_13$3),
                  _cache[6] || (_cache[6] = createBaseVNode("span", {
                    class: "copy-message isFadedOut",
                    role: "status",
                    "aria-live": "polite"
                  }, null, -1))
                ])) : createCommentVNode("", true),
                isVisible.value && 1 !== totalPages.value || 1 < totalPages.value && !isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_14$3, [
                  createBaseVNode("button", {
                    class: "prev-page",
                    onClick: withModifiers(prevPage, ["prevent"]),
                    disabled: currentPage.value === 1,
                    tabindex: "0",
                    type: "button"
                  }, "Previous Page", 8, _hoisted_15$3),
                  createBaseVNode("span", _hoisted_16$3, [
                    _cache[7] || (_cache[7] = createTextVNode("Page ")),
                    createBaseVNode("span", _hoisted_17$3, toDisplayString(currentPage.value), 1),
                    _cache[8] || (_cache[8] = createTextVNode(" of ")),
                    createBaseVNode("span", _hoisted_18$3, toDisplayString(totalPages.value), 1)
                  ]),
                  createBaseVNode("button", {
                    class: "next-page",
                    onClick: withModifiers(nextPage, ["prevent"]),
                    disabled: currentPage.value === totalPages.value,
                    tabindex: "0",
                    type: "button"
                  }, "Next Page", 8, _hoisted_19$3),
                  createBaseVNode("span", _hoisted_20$3, [
                    _cache[10] || (_cache[10] = createTextVNode(" Showing ")),
                    createBaseVNode("span", _hoisted_21$3, [
                      createBaseVNode("span", _hoisted_22$3, toDisplayString(paginatedPqeas.value.length), 1),
                      _cache[9] || (_cache[9] = createTextVNode(" of ")),
                      createBaseVNode("span", _hoisted_23$3, toDisplayString(filteredPqeas.value.length), 1)
                    ]),
                    _cache[11] || (_cache[11] = createTextVNode(" Energy Advisors "))
                  ]),
                  createBaseVNode("span", _hoisted_24$3, [
                    createBaseVNode("span", _hoisted_25$3, [
                      _cache[12] || (_cache[12] = createTextVNode("Showing ")),
                      createBaseVNode("span", _hoisted_26$3, toDisplayString(paginatedPqeas.value.length), 1),
                      _cache[13] || (_cache[13] = createTextVNode(" of ")),
                      createBaseVNode("span", _hoisted_27$3, toDisplayString(filteredPqeas.value.length), 1),
                      createTextVNode(" Energy Advisors " + toDisplayString(currentTypeFilterMessage.value) + " " + toDisplayString(currentLocationFilterMessage.value), 1)
                    ]),
                    createBaseVNode("span", _hoisted_28$3, [
                      _cache[14] || (_cache[14] = createTextVNode("Page ")),
                      createBaseVNode("span", _hoisted_29$3, toDisplayString(currentPage.value), 1),
                      _cache[15] || (_cache[15] = createTextVNode(" of ")),
                      createBaseVNode("span", _hoisted_30$3, toDisplayString(totalPages.value), 1)
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          createBaseVNode("h2", _hoisted_31$3, [
            _cache[16] || (_cache[16] = createTextVNode("Find an Energy Advisor (")),
            createBaseVNode("span", _hoisted_32$3, toDisplayString(filteredPqeas.value.length), 1),
            _cache[17] || (_cache[17] = createTextVNode(" results)"))
          ]),
          createBaseVNode("table", _hoisted_33$3, [
            _cache[20] || (_cache[20] = createBaseVNode("caption", { class: "sr-only" }, "Program Qualified Energy Advisors", -1)),
            _cache[21] || (_cache[21] = createBaseVNode("colgroup", null, [
              createBaseVNode("col", { class: "col col--1 odd col--pqea__company-and-location" }),
              createBaseVNode("col", { class: "col col--2 even col--pqea__contact-name" }),
              createBaseVNode("col", { class: "col col--3 odd col--pqea__email-and-phone" }),
              createBaseVNode("col", { class: "col col--4 even col--pqea__service-organizations" }),
              createBaseVNode("col", { class: "col col--5 odd col--pqea__services" })
            ], -1)),
            _cache[22] || (_cache[22] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", { class: "pqea-heading odd pqea-heading--company-and-location" }, [
                  createTextVNode("Company Name "),
                  createBaseVNode("br"),
                  createTextVNode("& Head Office")
                ]),
                createBaseVNode("th", { class: "pqea-heading even pqea-heading--contact-name" }, "Contact Name"),
                createBaseVNode("th", { class: "pqea-heading odd pqea-heading--email-and-phone" }, "Email & Phone"),
                createBaseVNode("th", { class: "pqea-heading even pqea-heading--service-organizations" }, "Service Organization(s)"),
                createBaseVNode("th", { class: "pqea-heading odd pqea-heading--services" }, "Program Qualified Services")
              ])
            ], -1)),
            createBaseVNode("tbody", {
              class: normalizeClass(`page page--${currentPage.value}`)
            }, [
              filteredPqeas.value.length === 0 && !isLoading.value ? (openBlock(), createElementBlock("tr", _hoisted_34$3, _cache[18] || (_cache[18] = [
                createBaseVNode("td", { colspan: "100%" }, [
                  createBaseVNode("p", {
                    class: "no-results",
                    role: "status",
                    "aria-live": "polite"
                  }, "Sorry, no results found.")
                ], -1)
              ]))) : createCommentVNode("", true),
              isLoading.value ? (openBlock(), createElementBlock("tr", _hoisted_35$3, _cache[19] || (_cache[19] = [
                createBaseVNode("td", { colspan: "100%" }, [
                  createBaseVNode("p", {
                    class: "no-results loading",
                    role: "status",
                    "aria-live": "polite"
                  }, "Retrieving a list of Energy Advisors, please wait...")
                ], -1)
              ]))) : createCommentVNode("", true),
              pqeas.value.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(paginatedPqeas.value, (pqea, index) => {
                return openBlock(), createElementBlock("tr", {
                  key: index,
                  class: normalizeClass(`pqea result result--${index + 1} ${0 === (index + 1) % 2 ? `even` : `odd`}`)
                }, [
                  createBaseVNode("td", _hoisted_36$3, [
                    pqea.details.company_website ? (openBlock(), createElementBlock("a", {
                      key: 0,
                      class: "pqea__company external external-app-link",
                      href: pqea.details.company_website,
                      target: "_blank",
                      onClick: ($event) => onProviderLinkClick(pqea),
                      "aria-label": unref(decodeHtmlEntities)(pqea.details.company_name) + " website, opens in a new tab/window."
                    }, toDisplayString(pqea.details.company_name ? unref(decodeHtmlEntities)(pqea.details.company_name) : "Website"), 9, _hoisted_37$3)) : (openBlock(), createElementBlock("span", _hoisted_38$3, toDisplayString(pqea.details.company_name ? unref(decodeHtmlEntities)(pqea.details.company_name) : "No company name provided"), 1)),
                    createBaseVNode("span", _hoisted_39$3, toDisplayString(pqea.details.company_location ? pqea.details.company_location : "Not provided"), 1)
                  ]),
                  createBaseVNode("td", _hoisted_40$3, [
                    createBaseVNode("p", null, toDisplayString(pqea.details.contact_name ? pqea.details.contact_name : "Not provided"), 1)
                  ]),
                  createBaseVNode("td", _hoisted_41$3, [
                    createBaseVNode("address", null, [
                      pqea.details.email ? (openBlock(), createElementBlock("a", {
                        key: 0,
                        class: "pqea__email",
                        href: "mailto:" + pqea.details.email,
                        onClick: withModifiers(($event) => onEmailPhoneClick(pqea, "email"), ["prevent"])
                      }, [
                        createBaseVNode("span", {
                          innerHTML: insertBreakableChar(pqea.details.email)
                        }, null, 8, _hoisted_43$3)
                      ], 8, _hoisted_42$3)) : (openBlock(), createElementBlock("p", _hoisted_44$3, "No email provided")),
                      pqea.details.phone ? (openBlock(), createElementBlock("a", {
                        key: 2,
                        class: "pqea__telephone",
                        href: "tel:+1" + pqea.details.phone.replace(/-/g, ""),
                        onClick: withModifiers(($event) => onEmailPhoneClick(pqea, "phone"), ["prevent"])
                      }, toDisplayString(pqea.details.phone), 9, _hoisted_45$3)) : (openBlock(), createElementBlock("p", _hoisted_46$3, "No phone number provided"))
                    ])
                  ]),
                  createBaseVNode("td", _hoisted_47$3, [
                    pqea.details.service_organizations && pqea.details.service_organizations.length ? (openBlock(), createElementBlock("ul", _hoisted_48$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(pqea.details.service_organizations, (org) => {
                        return openBlock(), createElementBlock("li", {
                          key: org.id,
                          class: "pqea__service-organization"
                        }, [
                          org.website ? (openBlock(), createElementBlock("a", {
                            key: 0,
                            href: org.website,
                            class: "external-app-link",
                            target: "_blank",
                            onClick: ($event) => onProviderLinkClick(pqea),
                            "aria-label": unref(decodeHtmlEntities)(org.title) + " website, opens in a new tab/window."
                          }, toDisplayString(unref(decodeHtmlEntities)(org.title)), 9, _hoisted_49$3)) : (openBlock(), createElementBlock("span", _hoisted_50$3, toDisplayString(unref(decodeHtmlEntities)(org.title)), 1))
                        ]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("td", _hoisted_51$3, [
                    pqea.services ? (openBlock(), createElementBlock("p", _hoisted_52$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(pqea.services, (service, services_index) => {
                        return openBlock(), createElementBlock("span", {
                          class: normalizeClass(`pqea__service pqea__service--${service.name.replace(/ /g, "-").toLowerCase()}`)
                        }, [
                          createTextVNode(toDisplayString(service.name), 1),
                          services_index != Object.keys(pqea.services).length - 1 ? (openBlock(), createElementBlock("span", _hoisted_53$3, ", ")) : createCommentVNode("", true)
                        ], 2);
                      }), 256))
                    ])) : createCommentVNode("", true)
                  ])
                ], 2);
              }), 128)) : createCommentVNode("", true)
            ], 2)
          ])
        ]),
        filteredPqeas.value.length !== 0 && 1 !== totalPages.value ? (openBlock(), createElementBlock("div", _hoisted_54$3, [
          createBaseVNode("div", _hoisted_55$3, [
            createBaseVNode("button", {
              class: "prev-page",
              onClick: withModifiers(prevPage, ["prevent"]),
              disabled: currentPage.value === 1,
              tabindex: "0",
              type: "button"
            }, "Previous Page", 8, _hoisted_56$3),
            createBaseVNode("span", _hoisted_57$3, [
              _cache[25] || (_cache[25] = createTextVNode("Page ")),
              createBaseVNode("span", _hoisted_58$3, toDisplayString(currentPage.value), 1),
              _cache[26] || (_cache[26] = createTextVNode(" of ")),
              createBaseVNode("span", _hoisted_59$3, toDisplayString(totalPages.value), 1)
            ]),
            createBaseVNode("button", {
              class: "next-page",
              onClick: withModifiers(nextPage, ["prevent"]),
              disabled: currentPage.value === totalPages.value,
              tabindex: "0",
              type: "button"
            }, "Next Page", 8, _hoisted_60$2),
            createBaseVNode("button", {
              class: "go-to-top",
              tabindex: "0",
              type: "button",
              disabled: filteredPqeas.value.length === 0,
              onClick: _cache[2] || (_cache[2] = ($event) => unref(scrollToElementID)("pqeasResults", "11rem"))
            }, "Go to top of results", 8, _hoisted_61$2)
          ])
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
};
const PQEAFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-69238911"]]);
const contractorVueApp_vue_vue_type_style_index_0_scoped_724ea396_lang = "";
const _hoisted_1$2 = { class: "inner" };
const _hoisted_2$2 = {
  key: 0,
  id: "contractorsFilterControls",
  class: "contractorsFilterControls filter-container"
};
const _hoisted_3$2 = {
  key: 0,
  class: "control type-select"
};
const _hoisted_4$2 = { class: "custom-select" };
const _hoisted_5$2 = ["value"];
const _hoisted_6$2 = {
  key: 1,
  class: "control program-select"
};
const _hoisted_7$2 = { class: "custom-select" };
const _hoisted_8$2 = ["value"];
const _hoisted_9$2 = {
  key: 2,
  class: "control location-select"
};
const _hoisted_10$2 = { class: "custom-select" };
const _hoisted_11$2 = ["value"];
const _hoisted_12$2 = {
  key: 3,
  class: "control reset-filters"
};
const _hoisted_13$2 = ["onKeydown"];
const _hoisted_14$2 = {
  key: 4,
  class: "control copy-link-btn"
};
const _hoisted_15$2 = ["onKeydown", "disabled"];
const _hoisted_16$2 = {
  key: 5,
  class: "contractorsFilterPagination control pagination pagination--top"
};
const _hoisted_17$2 = ["disabled"];
const _hoisted_18$2 = { class: "pages" };
const _hoisted_19$2 = { class: "numValue current-page" };
const _hoisted_20$2 = { class: "numValue total-pages" };
const _hoisted_21$2 = ["disabled"];
const _hoisted_22$2 = { class: "totals" };
const _hoisted_23$2 = { class: "results-count" };
const _hoisted_24$2 = { class: "numValue paginated-contractors" };
const _hoisted_25$2 = { class: "numValue filtered-contractors" };
const _hoisted_26$2 = { class: "sr-status sr-only" };
const _hoisted_27$2 = {
  class: "results-count",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_28$2 = { class: "numValue paginated-contractors" };
const _hoisted_29$2 = { class: "numValue filtered-contractors" };
const _hoisted_30$2 = {
  class: "pages",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_31$2 = { class: "numValue current-page" };
const _hoisted_32$2 = { class: "numValue total-pages" };
const _hoisted_33$2 = { class: "results__title" };
const _hoisted_34$2 = { class: "counter__value" };
const _hoisted_35$2 = {
  id: "contractorsResults",
  class: "contractorsResults results table table--striped"
};
const _hoisted_36$2 = {
  key: 0,
  class: "no-results"
};
const _hoisted_37$2 = {
  key: 1,
  class: "is-loading",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_38$2 = {
  "data-label": "Company Name and Head Office",
  class: "contractor__company-and-location"
};
const _hoisted_39$2 = ["href", "onClick", "aria-label"];
const _hoisted_40$2 = {
  key: 1,
  class: "contractor__company"
};
const _hoisted_41$2 = {
  "data-label": "Head Office",
  class: "contractor__head-office"
};
const _hoisted_42$2 = {
  "data-label": "Contact Email and Phone",
  class: "contractor__email-and-phone"
};
const _hoisted_43$2 = ["href", "onClick"];
const _hoisted_44$2 = ["innerHTML"];
const _hoisted_45$2 = {
  key: 1,
  class: "contractor__email"
};
const _hoisted_46$2 = ["href", "onClick"];
const _hoisted_47$2 = {
  key: 3,
  class: "contractor__telephone"
};
const _hoisted_48$2 = {
  "data-label": "Business Type(s)",
  class: "contractor__upgrade-types"
};
const _hoisted_49$2 = { key: 0 };
const _hoisted_50$2 = {
  "data-label": "Program Designations",
  class: "contractor__program-designations"
};
const _hoisted_51$2 = { key: 0 };
const _hoisted_52$2 = {
  key: 0,
  class: "contractorsFilterControls filter-container filter-container--bottom"
};
const _hoisted_53$2 = { class: "contractorsFilterPagination control pagination pagination--bottom" };
const _hoisted_54$2 = ["disabled"];
const _hoisted_55$2 = { class: "pages" };
const _hoisted_56$2 = { class: "numValue current-page" };
const _hoisted_57$2 = { class: "numValue total-pages" };
const _hoisted_58$2 = ["disabled"];
const _hoisted_59$2 = ["disabled"];
const _sfc_main$2 = {
  __name: "contractorVueApp",
  setup(__props) {
    var _a;
    const contractors = ref([]);
    ref([]);
    const isVisible = ref(true);
    const defaultSelectedUpgradeType = ref("all");
    const selectedUpgradeType = ref("all");
    const defaultSelectedProgram = ref("all");
    const selectedProgram = ref("all");
    const defaultSelectedLocation = ref("all");
    const selectedLocation = ref("all");
    const showLoadingMessage = ref(true);
    const isLoading = ref(false);
    const activeClass = ref("is-active");
    const updatingClass = ref("is-updating");
    const pageSize = ref(30);
    const currentPage = ref(1);
    const itemsToClearFromSessionStorage = ref([
      "faqsData",
      "faqsTimestamp",
      "pqeasData",
      "pqeasTimestamp",
      "rebatesData",
      "rebatesTimestamp"
    ]);
    const oldPaginatedContractorsCount = ref(0);
    const oldFilteredContractorsCount = ref(0);
    const publicDomain2 = ref("https://betterhomes.gov.bc.ca");
    const contractorsAPI = `${((_a = window.site) == null ? void 0 : _a.domain) ? window.site.domain : publicDomain2}/wp-json/custom/v1/contractors`;
    const types = computed(() => {
      const uniqueTypes = /* @__PURE__ */ new Set();
      contractors.value.forEach((contractor) => {
        if (contractor.types) {
          if (typeof contractor.types === "string") {
            uniqueTypes.add(contractor.types.name);
          } else if (Array.isArray(contractor.types)) {
            contractor.types.forEach((type) => {
              uniqueTypes.add(type.name);
            });
          }
        }
      });
      const sortedTypes = Array.from(uniqueTypes).sort((a, b) => a.localeCompare(b));
      return [...sortedTypes];
    });
    const programs = computed(() => {
      const uniquePrograms = /* @__PURE__ */ new Set();
      contractors.value.forEach((contractor) => {
        if (contractor.program_designations) {
          if (typeof contractor.program_designations === "string") {
            uniquePrograms.add(contractor.program_designations.name);
          } else if (Array.isArray(contractor.program_designations)) {
            contractor.program_designations.forEach((program) => {
              uniquePrograms.add(program.name);
            });
          }
        }
      });
      const sortedPrograms = Array.from(uniquePrograms).sort((a, b) => a.localeCompare(b));
      return [...sortedPrograms];
    });
    const locations = computed(() => {
      const uniqueLocations = /* @__PURE__ */ new Set();
      contractors.value.forEach((contractor) => {
        if (contractor.locations) {
          if (typeof contractor.locations === "string") {
            uniqueLocations.add(contractor.locations.name);
          } else if (Array.isArray(contractor.locations)) {
            contractor.locations.forEach((location) => {
              uniqueLocations.add(location.name);
            });
          }
        }
      });
      const sortedLocations = Array.from(uniqueLocations).sort((a, b) => a.localeCompare(b));
      return [...sortedLocations];
    });
    const filteredContractors = computed(() => {
      const selectedLoc = selectedLocation.value;
      const selectedProg = selectedProgram.value;
      let filteredContractors2 = [...filteredContractorsByType.value];
      if ("all" !== selectedLoc) {
        filteredContractors2 = filteredContractors2.filter((contractor) => contractor.locations && contractor.locations.some((location) => location.name === selectedLoc));
      }
      if ("all" !== selectedProg) {
        filteredContractors2 = filteredContractors2.filter((contractor) => contractor.program_designations && contractor.program_designations.some((program) => program.name === selectedProg));
      }
      return shuffleArray(filteredContractors2);
    });
    const filteredContractorsByType = computed(() => {
      const selectedType = selectedUpgradeType.value;
      currentPage.value = 1;
      if (selectedType === "all") {
        return contractors.value;
      } else {
        return contractors.value.filter((contractor) => contractor.types && contractor.types.some((type) => type.name === selectedType));
      }
    });
    computed(() => {
      const selectedProg = selectedProgram.value;
      currentPage.value = 1;
      if (selectedProg === "all") {
        return contractors.value;
      } else {
        return contractors.value.filter((contractor) => contractor.program_designations && contractor.program_designations.some((type) => type.name === selectedProg));
      }
    });
    const totalPages = computed(() => {
      const totalContractors = filteredContractors.value.length;
      return totalContractors > 0 ? Math.ceil(totalContractors / pageSize.value) : 1;
    });
    const paginatedContractors = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredContractors.value.slice(start, end);
    });
    const assembleUrl = () => {
      const baseUrl = window.location.origin + window.location.pathname;
      const urlParams = new URLSearchParams();
      urlParams.set("tool", "contractors");
      if (selectedUpgradeType.value && selectedUpgradeType.value !== "all") {
        urlParams.set("type", encodeURIComponent(selectedUpgradeType.value));
      }
      if (selectedProgram.value && selectedProgram.value !== "all") {
        urlParams.set("program", encodeURIComponent(selectedProgram.value));
      }
      if (selectedLocation.value && selectedLocation.value !== "all") {
        urlParams.set("region", encodeURIComponent(selectedLocation.value));
      }
      return `${baseUrl}?${urlParams.toString()}`;
    };
    const addLinkToClipboard = (event) => {
      const url = assembleUrl();
      navigator.clipboard.writeText(url).then(() => {
        handleLinkCopiedMessageContent(event, ".filter-container", "Link copied to clipboard successfully!");
      }).catch((err) => {
        console.error("Failed to copy URL:", err);
        alert("Failed to copy the link. Please try again.");
      });
    };
    function handleLinkCopiedMessageContent(event, target = ".filter-container", msg) {
      const item = event.target.closest(target);
      const messageToUser = ref(msg);
      const messageArea = item ? item.querySelector(".copy-message") : null;
      if (messageArea && messageArea.classList.contains("isFadedOut")) {
        messageArea.innerText = messageToUser.value;
        messageArea.classList.remove("isFadedOut");
        setTimeout(() => {
          messageArea.classList.add("isFadedOut");
        }, 1e3);
        setTimeout(() => {
          if (messageArea.classList.contains("isFadedOut")) {
            messageArea.innerText = "";
          }
        }, 1600);
      }
    }
    const prevPage = () => {
      return currentPage.value > 1 ? currentPage.value-- : null;
    };
    const nextPage = () => {
      return currentPage.value < totalPages.value ? currentPage.value++ : null;
    };
    const currentTypeFilterMessage = computed(() => {
      return defaultSelectedUpgradeType.value === selectedUpgradeType.value ? " no upgrade type selected " : " specializing in " + selectedUpgradeType.value.toLowerCase() + " upgrades ";
    });
    const currentLocationFilterMessage = computed(() => {
      return "all" !== selectedLocation.value ? "servicing " + selectedLocation.value : null;
    });
    const clearFilters = () => {
      resetSelectsActiveState();
      selectedUpgradeType.value = defaultSelectedUpgradeType.value;
      selectedLocation.value = defaultSelectedLocation.value;
      selectedProgram.value = defaultSelectedProgram.value;
      history.replaceState(selectedUpgradeType.value, defaultSelectedUpgradeType.value);
      history.replaceState(selectedLocation.value, defaultSelectedLocation.value);
      history.replaceState(selectedProgram.value, defaultSelectedProgram.value);
      currentPage.value !== 1 ? handleUpdatingAnimationClass(".control.pagination .pages") : null;
      currentPage.value = 1;
    };
    const insertBreakableChar = (email) => {
      return email.replace(/@/g, "&#8203;@").replace(/\./g, "&#8203;.");
    };
    const resetSelectsActiveState = () => {
      let activeSelects = document.querySelectorAll("#contractorFilterApp .custom-select.is-active");
      if (activeSelects.length >= 1) {
        activeSelects.forEach((item) => {
          item.classList.remove("is-active");
        });
      }
    };
    const selectIsActive = (event) => {
      return "click" !== event.type ? event.target.parentNode.classList.remove(activeClass.value) : event.target.parentNode.classList.toggle(activeClass.value);
    };
    const handleUpdatingAnimationClass = (elementCssPath) => {
      const elements = document.querySelectorAll(elementCssPath);
      if (elements.length > 0) {
        elements.forEach((element) => {
          element.classList.add(updatingClass.value);
          setTimeout(() => {
            element.classList.remove(updatingClass.value);
          }, 125);
        });
      }
    };
    const isQuotaExceededError = (error) => {
      if (!error)
        return false;
      return error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED";
    };
    const isDataValid = (timestamp) => {
      const timeElapsed = Date.now() - parseInt(timestamp, 10);
      const hoursElapsed = timeElapsed / (1e3 * 60 * 60);
      return hoursElapsed < 24;
    };
    const fetchData2 = async () => {
      try {
        isLoading.value = true;
        showLoadingMessage.value = true;
        let data = sessionStorage.getItem("contractorsData");
        let timestamp = sessionStorage.getItem("contractorsTimestamp");
        let cachedData = null;
        if (data && timestamp && isDataValid(timestamp)) {
          cachedData = JSON.parse(data);
        } else {
          data = localStorage.getItem("contractorsData");
          timestamp = localStorage.getItem("contractorsTimestamp");
          if (data && timestamp && isDataValid(timestamp)) {
            cachedData = JSON.parse(data);
          }
        }
        if (cachedData) {
          contractors.value = cachedData;
          showLoadingMessage.value = false;
          isLoading.value = false;
          return;
        }
        const response = await fetch(contractorsAPI, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        try {
          itemsToClearFromSessionStorage.value.forEach((item) => {
            sessionStorage.removeItem(item);
          });
          sessionStorage.clear();
        } catch (clearError) {
          console.warn("Error clearing sessionStorage:", clearError);
        }
        try {
          sessionStorage.setItem("contractorsData", JSON.stringify(json));
          sessionStorage.setItem("contractorsTimestamp", Date.now().toString());
        } catch (storageError) {
          if (isQuotaExceededError(storageError)) {
            console.warn("SessionStorage quota exceeded. Falling back to localStorage.");
            try {
              localStorage.setItem("contractorsData", JSON.stringify(json));
              localStorage.setItem("contractorsTimestamp", Date.now().toString());
            } catch (lsError) {
              console.error("Error setting data in localStorage:", lsError);
            }
          } else {
            console.error("Error setting data in sessionStorage:", storageError);
            throw storageError;
          }
        }
        contractors.value = json;
        showLoadingMessage.value = false;
        isLoading.value = false;
      } catch (error) {
        console.error("Error fetching contractors data:", error);
        throw error;
      }
    };
    watch(selectedUpgradeType, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackProviderFilterChange({
          filterName: "contractor",
          upgradeType: newVal,
          program: selectedProgram.value,
          location: selectedLocation.value,
          label: `Upgrade Type changed to: ${newVal}`
        });
      }
    });
    watch(selectedProgram, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackProviderFilterChange({
          filterName: "contractor",
          upgradeType: selectedUpgradeType.value,
          program: newVal,
          location: selectedLocation.value,
          label: `Program changed to: ${newVal}`
        });
      }
    });
    watch(selectedLocation, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackProviderFilterChange({
          filterName: "contractor",
          upgradeType: selectedUpgradeType.value,
          program: selectedProgram.value,
          location: newVal,
          label: `Location changed to: ${newVal}`
        });
      }
    });
    const onProviderLinkClick = (contractor) => {
      trackProviderClick({
        filterName: "contractor",
        upgradeType: selectedUpgradeType.value,
        program: selectedProgram.value,
        location: selectedLocation.value,
        companyName: contractor.company_name || "",
        destination: contractor.company_website || ""
      });
    };
    const onEmailPhoneClick = (contractor, linkType) => {
      var _a2;
      let label = "";
      let destination = "";
      if (linkType === "email") {
        label = contractor.email ? `Email: ${contractor.email}` : "Email link";
        destination = `mailto:${contractor.email}`;
      } else {
        label = contractor.phone ? `Phone: ${contractor.phone}` : "Phone link";
        destination = `tel:+1${(_a2 = contractor.phone) == null ? void 0 : _a2.replace(/-/g, "")}`;
      }
      trackProviderClick({
        filterName: "contractor",
        upgradeType: selectedUpgradeType.value,
        program: selectedProgram.value,
        location: selectedLocation.value,
        companyName: contractor.company_name || "",
        destination,
        label
      });
    };
    watch(() => {
      var _a2;
      return (_a2 = window.site) == null ? void 0 : _a2.domain;
    }, (newVal) => {
      if (newVal) {
        fetchData2();
      }
    });
    watch(paginatedContractors, () => {
      if (oldPaginatedContractorsCount.value !== paginatedContractors.value.length) {
        oldPaginatedContractorsCount.value = paginatedContractors.value.length;
        handleUpdatingAnimationClass(".control.pagination .paginated-contractors");
      }
    });
    watch(filteredContractors, () => {
      if (oldFilteredContractorsCount.value !== filteredContractors.value.length) {
        oldFilteredContractorsCount.value = filteredContractors.value.length;
        handleUpdatingAnimationClass(".control.pagination .filtered-contractors");
        handleUpdatingAnimationClass(".counter__value");
      }
    });
    watch(currentPage, () => {
      handleUpdatingAnimationClass(".control.pagination .current-page");
    });
    watch(totalPages, () => {
      handleUpdatingAnimationClass(".control.pagination .total-pages");
    });
    watch([selectedUpgradeType, selectedProgram, selectedLocation], () => {
      currentPage.value = 1;
    });
    window.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select.is-active")) {
        resetSelectsActiveState();
      }
    });
    window.addEventListener("click", (event) => {
      !event.target.closest(".custom-select.is-active") ? resetSelectsActiveState() : null;
    });
    onMounted(() => {
      localAnalyticsReady();
      const appElement = document.getElementById("contractorFilterApp");
      const showControls = appElement.getAttribute("data-show-controls") === "false";
      isVisible.value = showControls;
      fetchData2();
      showLoadingMessage.value = true;
      const urlParams = new URLSearchParams(window.location.search);
      const showParam = urlParams.get("show");
      if (showParam === "off") {
        isVisible.value = true;
      }
    });
    watchEffect(() => {
      if (types.value.length && programs.value.length && locations.value.length) {
        const urlParams = new URLSearchParams(window.location.search);
        const showParam = urlParams.get("show");
        if (null !== urlParams.get("tool") && urlParams.get("tool") !== "contractors") {
          console.warn('Tool parameter does not match "contractors". Initialization skipped.');
          return;
        }
        if (showParam === "off") {
          isVisible.value = false;
        }
        const upgradeType = urlParams.get("type");
        const rebateProgram = urlParams.get("program");
        const serviceRegion = urlParams.get("region");
        if (upgradeType) {
          const decodedUpgradeType = decodeURIComponent(upgradeType);
          if (types.value.includes(decodedUpgradeType)) {
            selectedUpgradeType.value = decodedUpgradeType;
          } else {
            console.warn(`Invalid upgrade type: ${decodedUpgradeType}`);
          }
        }
        if (rebateProgram) {
          const decodedRebateProgram = decodeURIComponent(rebateProgram);
          if (programs.value.includes(decodedRebateProgram)) {
            selectedProgram.value = decodedRebateProgram;
          } else {
            console.warn(`Invalid rebate program: ${decodedRebateProgram}`);
          }
        }
        if (serviceRegion) {
          const decodedServiceRegion = decodeURIComponent(serviceRegion);
          if (locations.value.includes(decodedServiceRegion)) {
            selectedLocation.value = decodedServiceRegion;
          } else {
            console.warn(`Invalid service region: ${decodedServiceRegion}`);
          }
        }
        showLoadingMessage.value = false;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$2, [
          _cache[27] || (_cache[27] = createBaseVNode("h2", { class: "sr-only" }, "Contractor Listings", -1)),
          _cache[28] || (_cache[28] = createBaseVNode("a", {
            href: "#contractorsResults",
            class: "sr-only skip-to-results"
          }, "Skip to results", -1)),
          isVisible.value || 1 < totalPages.value && !isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
            isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_3$2, [
              _cache[5] || (_cache[5] = createBaseVNode("label", {
                for: "typeSelect",
                class: ""
              }, "Choose a type of upgrade", -1)),
              createBaseVNode("div", _hoisted_4$2, [
                withDirectives(createBaseVNode("select", {
                  onChange: selectIsActive,
                  onClick: withModifiers(selectIsActive, ["prevent"]),
                  onTouchend: selectIsActive,
                  onKeyup: withKeys(selectIsActive, ["esc"]),
                  tabindex: "0",
                  id: "typeSelect",
                  class: "select select--type",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedUpgradeType.value = $event),
                  required: true,
                  "data-active": "false"
                }, [
                  _cache[4] || (_cache[4] = createBaseVNode("option", { value: "all" }, "All Upgrade Types", -1)),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(types.value, (type, index) => {
                    return openBlock(), createElementBlock("option", {
                      key: type,
                      value: type
                    }, toDisplayString(type), 9, _hoisted_5$2);
                  }), 128))
                ], 544), [
                  [vModelSelect, selectedUpgradeType.value]
                ])
              ])
            ])) : createCommentVNode("", true),
            isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
              _cache[7] || (_cache[7] = createBaseVNode("label", {
                for: "programSelect",
                class: ""
              }, "Choose a rebate program", -1)),
              createBaseVNode("div", _hoisted_7$2, [
                withDirectives(createBaseVNode("select", {
                  onChange: selectIsActive,
                  onClick: withModifiers(selectIsActive, ["prevent"]),
                  onTouchend: selectIsActive,
                  onKeyup: withKeys(selectIsActive, ["esc"]),
                  tabindex: "0",
                  id: "programSelect",
                  class: "select select--program",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedProgram.value = $event),
                  required: true,
                  "data-active": "false"
                }, [
                  _cache[6] || (_cache[6] = createBaseVNode("option", { value: "all" }, "All Programs", -1)),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(programs.value, (program, index) => {
                    return openBlock(), createElementBlock("option", {
                      key: program,
                      value: program
                    }, toDisplayString(program), 9, _hoisted_8$2);
                  }), 128))
                ], 544), [
                  [vModelSelect, selectedProgram.value]
                ])
              ])
            ])) : createCommentVNode("", true),
            isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_9$2, [
              _cache[9] || (_cache[9] = createBaseVNode("label", {
                for: "locationSelect",
                class: ""
              }, "Choose a service region", -1)),
              createBaseVNode("div", _hoisted_10$2, [
                withDirectives(createBaseVNode("select", {
                  onChange: selectIsActive,
                  onClick: withModifiers(selectIsActive, ["prevent"]),
                  onTouchend: selectIsActive,
                  onKeyup: withKeys(selectIsActive, ["esc"]),
                  tabindex: "0",
                  id: "locationSelect",
                  class: "select select--location",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => selectedLocation.value = $event)
                }, [
                  _cache[8] || (_cache[8] = createBaseVNode("option", { value: "all" }, "All Locations", -1)),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(locations.value, (location) => {
                    return openBlock(), createElementBlock("option", {
                      key: location,
                      value: location
                    }, toDisplayString(location), 9, _hoisted_11$2);
                  }), 128))
                ], 544), [
                  [vModelSelect, selectedLocation.value]
                ])
              ])
            ])) : createCommentVNode("", true),
            isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_12$2, [
              createBaseVNode("button", {
                class: "clear-filters",
                onClick: withModifiers(clearFilters, ["prevent"]),
                onTouchend: clearFilters,
                onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"]),
                type: "button"
              }, " Reset selection ", 40, _hoisted_13$2)
            ])) : createCommentVNode("", true),
            isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_14$2, [
              createBaseVNode("button", {
                class: "copy-link",
                onClick: withModifiers(addLinkToClipboard, ["prevent"]),
                onTouchend: addLinkToClipboard,
                onKeydown: withKeys(withModifiers(addLinkToClipboard, ["prevent"]), ["enter"]),
                disabled: selectedUpgradeType.value === "all" && selectedProgram.value === "all" && selectedLocation.value === "all",
                type: "button"
              }, " Copy link ", 40, _hoisted_15$2),
              _cache[10] || (_cache[10] = createBaseVNode("span", {
                class: "copy-message isFadedOut",
                role: "status",
                "aria-live": "polite"
              }, null, -1))
            ])) : createCommentVNode("", true),
            isVisible.value && 1 !== totalPages.value || 1 < totalPages.value && !isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_16$2, [
              createBaseVNode("button", {
                class: "prev-page",
                onClick: withModifiers(prevPage, ["prevent"]),
                disabled: currentPage.value === 1,
                tabindex: "0",
                type: "button"
              }, "Previous Page", 8, _hoisted_17$2),
              createBaseVNode("span", _hoisted_18$2, [
                _cache[11] || (_cache[11] = createTextVNode("Page ")),
                createBaseVNode("span", _hoisted_19$2, toDisplayString(currentPage.value), 1),
                _cache[12] || (_cache[12] = createTextVNode(" of ")),
                createBaseVNode("span", _hoisted_20$2, toDisplayString(totalPages.value), 1)
              ]),
              createBaseVNode("button", {
                class: "next-page",
                onClick: withModifiers(nextPage, ["prevent"]),
                disabled: currentPage.value === totalPages.value,
                tabindex: "0",
                type: "button"
              }, "Next Page", 8, _hoisted_21$2),
              createBaseVNode("div", _hoisted_22$2, [
                _cache[14] || (_cache[14] = createTextVNode(" Showing ")),
                createBaseVNode("span", _hoisted_23$2, [
                  createBaseVNode("span", _hoisted_24$2, toDisplayString(paginatedContractors.value.length), 1),
                  _cache[13] || (_cache[13] = createTextVNode(" of ")),
                  createBaseVNode("span", _hoisted_25$2, toDisplayString(filteredContractors.value.length), 1)
                ]),
                _cache[15] || (_cache[15] = createTextVNode(" registered contractors "))
              ]),
              createBaseVNode("span", _hoisted_26$2, [
                createBaseVNode("span", _hoisted_27$2, [
                  _cache[16] || (_cache[16] = createTextVNode("Showing ")),
                  createBaseVNode("span", _hoisted_28$2, toDisplayString(paginatedContractors.value.length), 1),
                  _cache[17] || (_cache[17] = createTextVNode(" of ")),
                  createBaseVNode("span", _hoisted_29$2, toDisplayString(filteredContractors.value.length), 1),
                  createTextVNode(" registered contractors " + toDisplayString(currentTypeFilterMessage.value) + " " + toDisplayString(currentLocationFilterMessage.value) + ".", 1)
                ]),
                createBaseVNode("span", _hoisted_30$2, [
                  _cache[18] || (_cache[18] = createTextVNode("Page ")),
                  createBaseVNode("span", _hoisted_31$2, toDisplayString(currentPage.value), 1),
                  _cache[19] || (_cache[19] = createTextVNode(" of ")),
                  createBaseVNode("span", _hoisted_32$2, toDisplayString(totalPages.value), 1)
                ])
              ])
            ])) : createCommentVNode("", true)
          ])) : createCommentVNode("", true),
          createBaseVNode("h2", _hoisted_33$2, [
            _cache[20] || (_cache[20] = createTextVNode("Find a registered contractor (")),
            createBaseVNode("span", _hoisted_34$2, toDisplayString(filteredContractors.value.length), 1),
            _cache[21] || (_cache[21] = createTextVNode(" results)"))
          ]),
          createBaseVNode("table", _hoisted_35$2, [
            _cache[24] || (_cache[24] = createBaseVNode("caption", { class: "sr-only" }, "Registered Contractors", -1)),
            _cache[25] || (_cache[25] = createBaseVNode("colgroup", null, [
              createBaseVNode("col", { class: "col col--1 odd col--contractor__company-and-location" }),
              createBaseVNode("col", { class: "col col--2 even col--contractor__head-office" }),
              createBaseVNode("col", { class: "col col--3 odd col--contractor__email-and-phone" }),
              createBaseVNode("col", { class: "col col--4 even col--contractor__upgrade-types" }),
              createBaseVNode("col", { class: "col col--5 odd col--contractor__program-designations" })
            ], -1)),
            _cache[26] || (_cache[26] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", { class: "contractor-heading odd contractor-heading--company-and-location" }, "Company Name"),
                createBaseVNode("th", { class: "contractor-heading even contractor-heading--contact-name" }, "Head Office"),
                createBaseVNode("th", { class: "contractor-heading odd contractor-heading--email-and-phone" }, "Email & Phone"),
                createBaseVNode("th", { class: "contractor-heading even contractor-heading--service-organizations" }, "Upgrade Type(s)"),
                createBaseVNode("th", { class: "contractor-heading odd contractor-heading--services" }, "Rebate Program(s)")
              ])
            ], -1)),
            createBaseVNode("tbody", {
              class: normalizeClass(`page page--${currentPage.value}`)
            }, [
              filteredContractors.value.length === 0 && !isLoading.value ? (openBlock(), createElementBlock("tr", _hoisted_36$2, _cache[22] || (_cache[22] = [
                createBaseVNode("td", { colspan: "100%" }, [
                  createBaseVNode("p", {
                    class: "no-results",
                    role: "status",
                    "aria-live": "polite"
                  }, "Sorry, no results found.")
                ], -1)
              ]))) : createCommentVNode("", true),
              isLoading.value ? (openBlock(), createElementBlock("tr", _hoisted_37$2, _cache[23] || (_cache[23] = [
                createBaseVNode("td", { colspan: "100%" }, [
                  createBaseVNode("p", { class: "no-results loading" }, "Retrieving a list of registered contractors, please wait...")
                ], -1)
              ]))) : createCommentVNode("", true),
              contractors.value.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(paginatedContractors.value, (contractor, index) => {
                return openBlock(), createElementBlock("tr", {
                  key: index,
                  class: normalizeClass(`contractor result result--${index + 1} ${0 === (index + 1) % 2 ? `even` : `odd`}`)
                }, [
                  createBaseVNode("td", _hoisted_38$2, [
                    contractor.company_website ? (openBlock(), createElementBlock("a", {
                      key: 0,
                      class: "contractor__company external-app-link",
                      href: contractor.company_website,
                      target: "_blank",
                      onClick: ($event) => onProviderLinkClick(contractor),
                      "aria-label": unref(decodeHtmlEntities)(contractor.company_name) + " website, opens in a new tab/window."
                    }, toDisplayString(contractor.company_name ? unref(decodeHtmlEntities)(contractor.company_name) : "Website"), 9, _hoisted_39$2)) : (openBlock(), createElementBlock("span", _hoisted_40$2, toDisplayString(contractor.company_name ? unref(decodeHtmlEntities)(contractor.company_name) : "No company name provided"), 1))
                  ]),
                  createBaseVNode("td", _hoisted_41$2, [
                    createBaseVNode("p", null, toDisplayString(contractor.head_office_location ? contractor.head_office_location : "Not provided"), 1)
                  ]),
                  createBaseVNode("td", _hoisted_42$2, [
                    createBaseVNode("address", null, [
                      contractor.email ? (openBlock(), createElementBlock("a", {
                        key: 0,
                        class: "contractor__email",
                        href: "mailto:" + contractor.email,
                        onClick: withModifiers(($event) => onEmailPhoneClick(contractor, "email"), ["prevent"])
                      }, [
                        createBaseVNode("span", {
                          innerHTML: insertBreakableChar(contractor.email)
                        }, null, 8, _hoisted_44$2)
                      ], 8, _hoisted_43$2)) : (openBlock(), createElementBlock("p", _hoisted_45$2, "No email provided")),
                      contractor.phone ? (openBlock(), createElementBlock("a", {
                        key: 2,
                        class: "contractor__telephone",
                        href: "tel:+1" + contractor.phone.replace(/-/g, ""),
                        onClick: withModifiers(($event) => onEmailPhoneClick(contractor, "phone"), ["prevent"])
                      }, toDisplayString(contractor.phone), 9, _hoisted_46$2)) : (openBlock(), createElementBlock("p", _hoisted_47$2, "No phone number provided"))
                    ])
                  ]),
                  createBaseVNode("td", _hoisted_48$2, [
                    contractor.types ? (openBlock(), createElementBlock("ul", _hoisted_49$2, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(contractor.types, (type, index2) => {
                        return openBlock(), createElementBlock("li", null, toDisplayString(type.name), 1);
                      }), 256))
                    ])) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("td", _hoisted_50$2, [
                    contractor.program_designations ? (openBlock(), createElementBlock("ul", _hoisted_51$2, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(contractor.program_designations, (designation, index2) => {
                        return openBlock(), createElementBlock("li", null, toDisplayString(designation.name), 1);
                      }), 256))
                    ])) : createCommentVNode("", true)
                  ])
                ], 2);
              }), 128)) : createCommentVNode("", true)
            ], 2)
          ])
        ]),
        filteredContractors.value.length !== 0 && 1 !== totalPages.value ? (openBlock(), createElementBlock("div", _hoisted_52$2, [
          createBaseVNode("div", _hoisted_53$2, [
            createBaseVNode("button", {
              class: "prev-page",
              onClick: withModifiers(prevPage, ["prevent"]),
              disabled: currentPage.value === 1,
              tabindex: "0",
              type: "button"
            }, "Previous Page", 8, _hoisted_54$2),
            createBaseVNode("span", _hoisted_55$2, [
              _cache[29] || (_cache[29] = createTextVNode("Page ")),
              createBaseVNode("span", _hoisted_56$2, toDisplayString(currentPage.value), 1),
              _cache[30] || (_cache[30] = createTextVNode(" of ")),
              createBaseVNode("span", _hoisted_57$2, toDisplayString(totalPages.value), 1)
            ]),
            createBaseVNode("button", {
              class: "next-page",
              onClick: withModifiers(nextPage, ["prevent"]),
              disabled: currentPage.value === totalPages.value,
              tabindex: "0",
              type: "button"
            }, "Next Page", 8, _hoisted_58$2),
            createBaseVNode("button", {
              class: "go-to-top",
              tabindex: "0",
              type: "button",
              disabled: filteredContractors.value.length === 0,
              onClick: _cache[3] || (_cache[3] = ($event) => unref(scrollToElementID)("contractorsResults", "11rem"))
            }, "Go to top of results", 8, _hoisted_59$2)
          ])
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
};
const ContractorFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-724ea396"]]);
const rebateVueApp_vue_vue_type_style_index_0_scoped_643b8b35_lang = "";
const _hoisted_1$1 = { class: "inner" };
const _hoisted_2$1 = {
  id: "rebatesFilterControls",
  class: "rebatesFilterControls filter-container"
};
const _hoisted_3$1 = { class: "control build-type-select" };
const _hoisted_4$1 = { class: "custom-select" };
const _hoisted_5$1 = ["value"];
const _hoisted_6$1 = { class: "control location-select" };
const _hoisted_7$1 = { class: "custom-select" };
const _hoisted_8$1 = ["value"];
const _hoisted_9$1 = { class: "control heating-system-select" };
const _hoisted_10$1 = { class: "custom-select" };
const _hoisted_11$1 = ["value"];
const _hoisted_12$1 = { class: "control upgrade-types" };
const _hoisted_13$1 = {
  key: 0,
  class: "filter filter--upgrade-types accordion"
};
const _hoisted_14$1 = {
  id: "upgradeTypesAccordionTrigger",
  class: "accordion-trigger",
  "aria-expanded": "false",
  "aria-controls": "upgradeTypesAccordionPanel",
  type: "button"
};
const _hoisted_15$1 = ["innerHTML"];
const _hoisted_16$1 = {
  id: "upgradeTypesAccordionPanel",
  class: "filter filter__list accordion-panel",
  role: "region",
  "aria-labelledby": "upgradeTypesAccordionTrigger",
  hidden: ""
};
const _hoisted_17$1 = { class: "inner" };
const _hoisted_18$1 = ["aria-checked", "checked"];
const _hoisted_19$1 = ["id", "value", "aria-checked", "checked", "aria-disabled", "disabled"];
const _hoisted_20$1 = ["for"];
const _hoisted_21$1 = { class: "control other-offers other-offers--mobile" };
const _hoisted_22$1 = { class: "filter filter--other-offers accordion" };
const _hoisted_23$1 = {
  id: "otherOffersAccordionPanel",
  class: "filter filter__list accordion-panel",
  role: "region",
  "aria-labelledby": "otherOffersAccordionTrigger",
  hidden: ""
};
const _hoisted_24$1 = { class: "inner" };
const _hoisted_25$1 = {
  key: 0,
  class: "filter__list"
};
const _hoisted_26$1 = ["aria-checked", "checked"];
const _hoisted_27$1 = ["id", "data-filter-value", "name", "value", "aria-checked", "aria-disabled", "disabled", "checked"];
const _hoisted_28$1 = ["for"];
const _hoisted_29$1 = { class: "control reset-filters" };
const _hoisted_30$1 = ["onKeydown"];
const _hoisted_31$1 = {
  key: 0,
  class: "control copy-link-btn"
};
const _hoisted_32$1 = ["onKeydown", "disabled"];
const _hoisted_33$1 = { class: "rebatesFilterPagination control pagination pagination--top" };
const _hoisted_34$1 = ["disabled"];
const _hoisted_35$1 = { class: "pages" };
const _hoisted_36$1 = { class: "numValue current-page" };
const _hoisted_37$1 = { class: "numValue total-pages" };
const _hoisted_38$1 = ["disabled"];
const _hoisted_39$1 = { class: "totals" };
const _hoisted_40$1 = { class: "results-count" };
const _hoisted_41$1 = { class: "numValue paginated-rebates" };
const _hoisted_42$1 = { class: "numValue filtered-rebates" };
const _hoisted_43$1 = { class: "sr-status sr-only" };
const _hoisted_44$1 = {
  class: "results-count",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_45$1 = { class: "numValue paginated-rebates" };
const _hoisted_46$1 = { class: "numValue filtered-rebates" };
const _hoisted_47$1 = {
  class: "pages",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_48$1 = { class: "numValue current-page" };
const _hoisted_49$1 = { class: "numValue total-pages" };
const _hoisted_50$1 = {
  id: "rebatesTool",
  class: "rebatesTool"
};
const _hoisted_51$1 = {
  id: "rebatesSidebar",
  class: "rebatesSidebar sidebar",
  role: "complementary"
};
const _hoisted_52$1 = { class: "filter filter--other-offers" };
const _hoisted_53$1 = {
  key: 0,
  class: "filter__list"
};
const _hoisted_54$1 = ["aria-checked", "checked"];
const _hoisted_55$1 = ["id", "data-filter-value", "value", "aria-checked", "aria-disabled", "disabled", "checked"];
const _hoisted_56$1 = ["for"];
const _hoisted_57$1 = {
  id: "rebatesResults",
  class: "rebatesResults results"
};
const _hoisted_58$1 = { class: "results__title" };
const _hoisted_59$1 = { class: "counter__value" };
const _hoisted_60$1 = {
  key: 0,
  class: "is-loading",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_61$1 = {
  key: 1,
  class: "no-results"
};
const _hoisted_62$1 = { class: "rebate__title" };
const _hoisted_63$1 = ["innerHTML"];
const _hoisted_64$1 = { class: "rebate__short-description" };
const _hoisted_65$1 = ["innerHTML"];
const _hoisted_66$1 = { class: "rebate__learn-more" };
const _hoisted_67$1 = ["href", "onClick", "aria-label"];
const _hoisted_68$1 = {
  key: 0,
  class: "rebatesFilterControls filter-container"
};
const _hoisted_69$1 = { class: "rebatesFilterPagination control pagination pagination--bottom" };
const _hoisted_70$1 = ["disabled"];
const _hoisted_71$1 = { class: "pages" };
const _hoisted_72$1 = { class: "numValue current-page" };
const _hoisted_73$1 = { class: "numValue total-pages" };
const _hoisted_74$1 = ["disabled"];
const _hoisted_75$1 = ["disabled"];
const _sfc_main$1 = {
  __name: "rebateVueApp",
  setup(__props) {
    var _a;
    const rebates = ref([]);
    const isVisible = ref(true);
    const oldPaginatedRebatesCount = ref(0);
    const oldFilteredRebatesCount = ref(0);
    const defaultSelectedBuildType = ref("all");
    const defaultSelectedHeatingSystem = ref("all");
    const defaultSelectedLocation = ref("all");
    const defaultOtherOffers = ref("all");
    const selectedBuildType = ref("all");
    const selectedHeatingSystem = ref("all");
    const selectedLocation = ref("all");
    const selectedOtherOffers = ref("all");
    const selectedUpgradeTypes = ref([]);
    const showLoadingMessage = ref(true);
    const isLoading = ref(false);
    const activeClass = ref("is-active");
    const updatingClass = ref("is-updating");
    const isCheckedClass = ref("is-checked");
    const pageSize = ref(30);
    const currentPage = ref(1);
    const itemsToClearFromSessionStorage = ref([
      "contractorsData",
      "contractorsTimestamp",
      "faqsData",
      "faqsTimestamp",
      "pqeasData",
      "pqeasTimestamp"
    ]);
    const publicDomain2 = ref("https://www.betterhomesbc.ca");
    const rebatesAPI = `${((_a = window.site) == null ? void 0 : _a.domain) ? window.site.domain : publicDomain2}/wp-json/custom/v1/rebates`;
    const filteredRebates = computed(() => {
      const selectedLoc = selectedLocation.value;
      const selectedUpgrades = selectedUpgradeTypes.value;
      const selectedBuild = selectedBuildType.value;
      const selectedSystem = selectedHeatingSystem.value;
      const selectedOffer = selectedOtherOffers.value;
      let filteredRebates2 = [...rebates.value];
      if ("all" !== selectedLoc) {
        filteredRebates2 = filteredRebates2.filter((rebate) => rebate.locations && rebate.locations.some((location) => location.name === selectedLoc));
      }
      if ("all" !== selectedBuild) {
        filteredRebates2 = filteredRebates2.filter((rebate) => rebate.types && rebate.types.some((type) => type.name === selectedBuild));
      }
      if ("all" !== selectedSystem) {
        filteredRebates2 = filteredRebates2.filter((rebate) => rebate.primary_heating_sys && rebate.primary_heating_sys.some((sys) => sys.name === selectedSystem));
      }
      if ("all" !== selectedOffer) {
        filteredRebates2 = filteredRebates2.filter((rebate) => rebate.other_offers && rebate.other_offers.some((offer) => offer.name === selectedOffer));
      }
      if (selectedUpgrades.length) {
        filteredRebates2 = filteredRebates2.filter((rebate) => rebate.upgrade_types && rebate.upgrade_types.some((type) => selectedUpgrades.includes(type.name)));
      }
      resetSelectsActiveState();
      return filteredRebates2;
    });
    const handleUpdatingAnimationClass = (elementCssPath) => {
      const elements = document.querySelectorAll(elementCssPath);
      if (elements.length > 0) {
        elements.forEach((element) => {
          element.classList.add(updatingClass.value);
          setTimeout(() => {
            element.classList.remove(updatingClass.value);
          }, 125);
        });
      }
    };
    const totalPages = computed(() => {
      const totalRebates = filteredRebates.value.length;
      return totalRebates > 0 ? Math.ceil(totalRebates / pageSize.value) : 1;
    });
    const paginatedRebates = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredRebates.value.slice(start, end);
    });
    const prevPage = () => {
      return currentPage.value > 1 ? currentPage.value-- : null;
    };
    const nextPage = () => {
      return currentPage.value < totalPages.value ? currentPage.value++ : null;
    };
    const types = computed(() => {
      const uniqueTypes = /* @__PURE__ */ new Set();
      rebates.value.forEach((rebate) => {
        if (rebate.types) {
          if (typeof rebate.types === "string") {
            uniqueTypes.add(rebate.types.name);
          } else if (Array.isArray(rebate.types)) {
            rebate.types.forEach((type) => {
              uniqueTypes.add(type.name);
            });
          }
        }
      });
      const sortedTypes = Array.from(uniqueTypes).sort((a, b) => a.localeCompare(b));
      return [...sortedTypes];
    });
    const upgrades = computed(() => {
      const uniqueUpgrades = /* @__PURE__ */ new Set();
      rebates.value.forEach((rebate) => {
        if (rebate.upgrade_types) {
          if (typeof rebate.upgrade_types === "string") {
            uniqueUpgrades.add(rebate.upgrade_types);
          } else if (Array.isArray(rebate.upgrade_types)) {
            rebate.upgrade_types.forEach((upgrade) => {
              uniqueUpgrades.add(upgrade.name);
            });
          }
        }
      });
      const sortedUpgrades = Array.from(uniqueUpgrades).sort((a, b) => a.localeCompare(b));
      return [...sortedUpgrades];
    });
    const offers = computed(() => {
      const uniqueOffers = /* @__PURE__ */ new Set();
      rebates.value.forEach((rebate) => {
        if (rebate.other_offers) {
          if (typeof rebate.other_offers === "string") {
            uniqueOffers.add(rebate.other_offers);
          } else if (Array.isArray(rebate.other_offers)) {
            rebate.other_offers.forEach((offer) => {
              uniqueOffers.add(offer.name);
            });
          }
        }
      });
      const sortedOffers = Array.from(uniqueOffers).sort((a, b) => a.localeCompare(b));
      return [...sortedOffers];
    });
    const systems = computed(() => {
      const uniqueSystems = /* @__PURE__ */ new Set();
      rebates.value.forEach((rebate) => {
        if (rebate.primary_heating_sys) {
          if (typeof rebate.primary_heating_sys === "string") {
            uniqueSystems.add(rebate.primary_heating_sys);
          } else if (Array.isArray(rebate.primary_heating_sys)) {
            rebate.primary_heating_sys.forEach((upgrade) => {
              uniqueSystems.add(upgrade.name);
            });
          }
        }
      });
      const sortedSystems = Array.from(uniqueSystems).sort((a, b) => a.localeCompare(b));
      return [...sortedSystems];
    });
    const locations = computed(() => {
      const uniqueLocations = /* @__PURE__ */ new Set();
      rebates.value.forEach((rebate) => {
        if (rebate.locations) {
          if (typeof rebate.locations === "string") {
            uniqueLocations.add(rebate.locations.name);
          } else if (Array.isArray(rebate.locations)) {
            rebate.locations.forEach((location) => {
              uniqueLocations.add(location.name);
            });
          }
        }
      });
      const sortedLocations = Array.from(uniqueLocations).sort((a, b) => a.localeCompare(b));
      return [...sortedLocations];
    });
    const assembleUrl = () => {
      const baseUrl = window.location.origin + window.location.pathname;
      const urlParams = new URLSearchParams();
      urlParams.set("tool", "rebates");
      if (selectedBuildType.value && selectedBuildType.value !== "all") {
        urlParams.set("type", encodeURIComponent(selectedBuildType.value));
      }
      if (selectedLocation.value && selectedLocation.value !== "all") {
        urlParams.set("region", encodeURIComponent(selectedLocation.value));
      }
      if (selectedHeatingSystem.value && selectedHeatingSystem.value !== "all") {
        urlParams.set("system", encodeURIComponent(selectedHeatingSystem.value));
      }
      if (selectedUpgradeTypes.value.length > 0) {
        const wrappedUpgrades = selectedUpgradeTypes.value.map((upgrade) => `"${upgrade}"`).join(",");
        urlParams.set("upgrade", encodeURIComponent(wrappedUpgrades));
      }
      return `${baseUrl}?${urlParams.toString()}`;
    };
    const addLinkToClipboard = (event) => {
      const url = assembleUrl();
      navigator.clipboard.writeText(url).then(() => {
        handleLinkCopiedMessageContent(event, ".filter-container", "Link copied to clipboard successfully!");
      }).catch((err) => {
        console.error("Failed to copy URL:", err);
        alert("Failed to copy the link. Please try again.");
      });
    };
    function handleLinkCopiedMessageContent(event, target = ".filter-container", msg) {
      const container = event.target.closest(target);
      const messageArea = container ? container.querySelector(".copy-message") : null;
      if (messageArea) {
        messageArea.innerText = msg;
        messageArea.classList.remove("isFadedOut");
        setTimeout(() => {
          messageArea.classList.add("isFadedOut");
        }, 1500);
        setTimeout(() => {
          messageArea.innerText = "";
        }, 2e3);
      }
    }
    const currentBuildTypeFilterMessage = computed(() => {
      return "all" !== selectedBuildType.value ? " for " + selectedBuildType.value.toLowerCase() : null;
    });
    const currentLocationFilterMessage = computed(() => {
      return "all" !== selectedLocation.value ? " available to residents of " + selectedLocation.value : null;
    });
    const currentHeatingSystemFilterMessage = computed(() => {
      return "all" !== selectedHeatingSystem.value ? " for " + selectedHeatingSystem.value + " heating systems " : null;
    });
    const rebateAmountClasses = (rebate_amount) => {
      const default_class = ref("rebate__amount");
      const contextual_classes = ref("");
      switch (rebate_amount.toLowerCase()) {
        case "fully subscribed":
          contextual_classes.value = "fully-subscribed";
          break;
        case "free":
          contextual_classes.value = "free";
          break;
        case "nearly subscribed":
          contextual_classes.value = "nearly-subscribed";
          break;
        default:
          contextual_classes.value = "";
      }
      return default_class.value + " " + contextual_classes.value;
    };
    const clearFilters = () => {
      const allActiveFilters = document.querySelectorAll(`.${isCheckedClass.value}`);
      const checkboxFilterAll = document.querySelectorAll(".all");
      resetSelectsActiveState();
      selectedBuildType.value = defaultSelectedBuildType.value;
      selectedHeatingSystem.value = defaultSelectedHeatingSystem.value;
      selectedLocation.value = defaultSelectedLocation.value;
      selectedOtherOffers.value = defaultOtherOffers.value;
      selectedUpgradeTypes.value = [];
      history.replaceState(selectedBuildType.value, defaultSelectedBuildType.value);
      history.replaceState(selectedHeatingSystem.value, defaultSelectedHeatingSystem.value);
      history.replaceState(selectedLocation.value, defaultSelectedLocation.value);
      history.replaceState(selectedOtherOffers.value, defaultOtherOffers.value);
      allActiveFilters.length ? allActiveFilters.forEach((activeFilter) => {
        activeFilter.classList.remove(isCheckedClass.value);
      }) : null;
      checkboxFilterAll.checked = true;
      checkboxFilterAll.forEach((checkbox) => {
        checkbox.classList.add(isCheckedClass.value);
      });
      currentPage.value !== 1 ? handleUpdatingAnimationClass(".control.pagination .pages") : null;
      currentPage.value = 1;
    };
    const handleSelectAllInputFilter = (event) => {
      const container = event.target.closest(".filter__list");
      const filterAll = container.querySelector(".all");
      const allActiveFilters = container ? container.querySelectorAll(`.${isCheckedClass.value}`) : null;
      if (event.target.id === "offerTypeAll" || event.target.id === "offerTypeAll--mobile") {
        selectedOtherOffers.value = "all";
      } else if (event.target.id === "upgradeTypeAll") {
        selectedUpgradeTypes.value = [];
      }
      allActiveFilters.forEach((activeFilter) => {
        if (activeFilter !== filterAll) {
          activeFilter.classList.remove(isCheckedClass.value);
        }
      });
      if (!event.target.parentNode.classList.contains(isCheckedClass.value)) {
        event.target.parentNode.classList.add(isCheckedClass.value);
      }
      filterAll.checked = true;
      if (currentPage.value !== 1) {
        handleUpdatingAnimationClass(".control.pagination .pages");
      }
      currentPage.value = 1;
    };
    const resetSelectsActiveState = () => {
      const activeSelects = document.querySelectorAll("#rebateFilterApp .custom-select.is-active");
      if (activeSelects.length > 0) {
        activeSelects.forEach((item) => {
          item.classList.remove("is-active");
        });
      }
    };
    const selectIsActive = (event) => {
      return "click" !== event.type ? event.target.parentNode.classList.remove(activeClass.value) : event.target.parentNode.classList.toggle(activeClass.value);
    };
    const getUpgradeTypeTagCount = (tag) => {
      const app = document.querySelector("#rebateFilterApp");
      const filterContainers = app ? app.querySelectorAll(".filter--upgrade-types") : null;
      const selectedLoc = selectedLocation.value;
      const selectedBuild = selectedBuildType.value;
      const selectedSystem = selectedHeatingSystem.value;
      let count = 0;
      let primaryFilteredRebates = [...rebates.value];
      if ("all" !== selectedLoc) {
        primaryFilteredRebates = primaryFilteredRebates.filter((rebate) => rebate.locations && rebate.locations.some((location) => location.name === selectedLoc));
      }
      if ("all" !== selectedBuild) {
        primaryFilteredRebates = primaryFilteredRebates.filter((rebate) => rebate.types && rebate.types.some((type) => type.name === selectedBuild));
      }
      if ("all" !== selectedSystem) {
        primaryFilteredRebates = primaryFilteredRebates.filter((rebate) => rebate.primary_heating_sys && rebate.primary_heating_sys.some((sys) => sys.name === selectedSystem));
      }
      count = primaryFilteredRebates.reduce(
        (count2, rebate) => count2 + (JSON.stringify(rebate.upgrade_types).includes(tag) ? 1 : 0),
        0
      );
      if (filterContainers.length) {
        filterContainers.forEach((filterContainer) => {
          const radioInput = filterContainer ? filterContainer.querySelector('.filter__item input[value="' + tag + '"]') : null;
          if (radioInput) {
            if (0 === count) {
              radioInput.parentNode.classList.remove(isCheckedClass.value);
              radioInput.parentNode.classList.add("is-disabled");
              selectedUpgradeTypes.value.forEach((upgrade) => {
                if (radioInput.name === upgrade) {
                  selectedUpgradeTypes.value = selectedUpgradeTypes.value.filter((upgrade2) => upgrade2 !== radioInput.name);
                }
              });
            } else {
              radioInput.parentNode.classList.remove("is-disabled");
            }
          }
        });
      }
      return count;
    };
    const handleOfferTagCount = (tag) => {
      const app = document.querySelector("#rebateFilterApp");
      const filterContainers = app ? app.querySelectorAll(".filter--other-offers") : null;
      const selectedLoc = selectedLocation.value;
      const selectedUpgrades = selectedUpgradeTypes.value;
      const selectedBuild = selectedBuildType.value;
      const selectedSystem = selectedHeatingSystem.value;
      let primaryFilteredRebates = [...rebates.value];
      let count = primaryFilteredRebates.length;
      if ("all" !== selectedLoc) {
        primaryFilteredRebates = primaryFilteredRebates.filter((rebate) => rebate.locations && rebate.locations.some((location) => location.name === selectedLoc));
      }
      if ("all" !== selectedBuild) {
        primaryFilteredRebates = primaryFilteredRebates.filter((rebate) => rebate.types && rebate.types.some((type) => type.name === selectedBuild));
      }
      if ("all" !== selectedSystem) {
        primaryFilteredRebates = primaryFilteredRebates.filter((rebate) => rebate.primary_heating_sys && rebate.primary_heating_sys.some((sys) => sys.name === selectedSystem));
      }
      if (selectedUpgrades.length) {
        primaryFilteredRebates = primaryFilteredRebates.filter((rebate) => rebate.upgrade_types && rebate.upgrade_types.some((type) => selectedUpgrades.includes(type.name)));
      }
      count = primaryFilteredRebates.reduce(
        (count2, rebate) => count2 + (JSON.stringify(rebate.other_offers).includes(tag) ? 1 : 0),
        0
      );
      if (filterContainers.length) {
        filterContainers.forEach((filterContainer) => {
          const radioInput = filterContainer ? filterContainer.querySelector('.filter__item input[value="' + tag + '"]') : null;
          filterContainer ? filterContainer.querySelector(".all input") : null;
          if (radioInput) {
            if (0 === count) {
              radioInput.parentNode.classList.remove(isCheckedClass.value);
              radioInput.parentNode.classList.add("is-disabled");
              if (selectedOtherOffers.value === radioInput.name) {
                selectedOtherOffers.value = defaultOtherOffers.value;
                history.replaceState(selectedOtherOffers.value, defaultOtherOffers.value);
              }
            } else {
              radioInput.parentNode.classList.remove("is-disabled");
            }
          }
        });
      }
      return count;
    };
    function simulateClickOnEnter(event) {
      event.target.click();
    }
    computed(() => {
      return filteredRebates.value.reduce((count, rebate) => {
        return count + (rebate.other_offers ? rebate.other_offers.length : 0);
      }, 0);
    });
    const isQuotaExceededError = (error) => {
      if (!error)
        return false;
      return error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED";
    };
    const isDataValid = (timestamp) => {
      const timeElapsed = Date.now() - parseInt(timestamp, 10);
      const hoursElapsed = timeElapsed / (1e3 * 60 * 60);
      return hoursElapsed < 24;
    };
    const fetchData2 = async () => {
      try {
        isLoading.value = true;
        showLoadingMessage.value = true;
        let data = sessionStorage.getItem("rebatesData");
        let timestamp = sessionStorage.getItem("rebatesTimestamp");
        let cachedData = null;
        if (data && timestamp && isDataValid(timestamp)) {
          cachedData = JSON.parse(data);
        } else {
          data = localStorage.getItem("rebatesData");
          timestamp = localStorage.getItem("rebatesTimestamp");
          if (data && timestamp && isDataValid(timestamp)) {
            cachedData = JSON.parse(data);
          }
        }
        if (cachedData) {
          rebates.value = cachedData;
          showLoadingMessage.value = false;
          isLoading.value = false;
          return;
        }
        const response = await fetch(rebatesAPI, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        try {
          itemsToClearFromSessionStorage.value.forEach((item) => {
            sessionStorage.removeItem(item);
          });
          sessionStorage.clear();
        } catch (clearError) {
          console.warn("Error clearing sessionStorage:", clearError);
        }
        try {
          sessionStorage.setItem("rebatesData", JSON.stringify(json));
          sessionStorage.setItem("rebatesTimestamp", Date.now().toString());
        } catch (storageError) {
          if (isQuotaExceededError(storageError)) {
            console.warn("SessionStorage quota exceeded. Falling back to localStorage.");
            try {
              localStorage.setItem("rebatesData", JSON.stringify(json));
              localStorage.setItem("rebatesTimestamp", Date.now().toString());
            } catch (lsError) {
              console.error("Error setting data in localStorage:", lsError);
            }
          } else {
            console.error("Error setting data in sessionStorage:", storageError);
            throw storageError;
          }
        }
        rebates.value = json;
        showLoadingMessage.value = false;
        isLoading.value = false;
      } catch (error) {
        console.error("Error fetching rebates data:", error);
        throw error;
      }
    };
    const upgradeTypesAccordionTitle = (selectedUpgradeTypes2) => {
      let title = "";
      if (0 === selectedUpgradeTypes2.length) {
        title += " (All types active)";
      } else {
        title += "(" + selectedUpgradeTypes2.length.toString();
        title += 1 === selectedUpgradeTypes2.length ? " filter " : " filters ";
        title += "active)";
      }
      return title;
    };
    const onRebateClick = (rebate) => {
      trackRebateClick({
        projectType: selectedBuildType.value,
        location: selectedLocation.value,
        heatingType: selectedHeatingSystem.value,
        filterValues: selectedUpgradeTypes.value,
        label: decodeHtmlEntities(rebate.title),
        rebateText: rebate.rebate_amount || "",
        destination: rebate.post_url || ""
      });
    };
    watch(selectedBuildType, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackRebateFilterChange({
          projectType: newVal,
          location: selectedLocation.value,
          heatingType: selectedHeatingSystem.value,
          filterValues: selectedUpgradeTypes.value,
          label: `Build type: ${newVal}`,
          oldVal
        });
      }
    });
    watch(selectedHeatingSystem, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackRebateFilterChange({
          projectType: selectedBuildType.value,
          location: selectedLocation.value,
          heatingType: newVal,
          filterValues: selectedUpgradeTypes.value,
          label: `Primary heating system: ${newVal}`,
          oldVal
        });
      }
    });
    watch(selectedLocation, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackRebateFilterChange({
          projectType: selectedBuildType.value,
          location: newVal,
          heatingType: selectedHeatingSystem.value,
          filterValues: selectedUpgradeTypes.value,
          label: `Service region: ${newVal}`,
          oldVal
        });
      }
    });
    watch(
      () => [...selectedUpgradeTypes.value],
      // watch the array contents
      (newArray, oldArray) => {
        const newlySelected = newArray.filter((x) => !oldArray.includes(x));
        const removed = oldArray.filter((x) => !newArray.includes(x));
        newlySelected.forEach((upgrade) => {
          trackRebateUpgradeTypeChange({
            action: "select",
            projectType: selectedBuildType.value,
            location: selectedLocation.value,
            heatingType: selectedHeatingSystem.value,
            filterValues: newArray,
            // all currently selected
            label: upgrade
            // the new upgrade just selected
          });
        });
        removed.forEach((upgrade) => {
          trackRebateUpgradeTypeChange({
            action: "deselect",
            projectType: selectedBuildType.value,
            location: selectedLocation.value,
            heatingType: selectedHeatingSystem.value,
            filterValues: newArray,
            // all currently selected
            label: upgrade
            // the upgrade just removed
          });
        });
      }
    );
    watch(() => {
      var _a2;
      return (_a2 = window.site) == null ? void 0 : _a2.domain;
    }, (newVal) => {
      if (newVal) {
        fetchData2();
      }
    });
    watch(paginatedRebates, () => {
      if (oldPaginatedRebatesCount.value !== paginatedRebates.value.length) {
        oldPaginatedRebatesCount.value = paginatedRebates.value.length;
        handleUpdatingAnimationClass(".control.pagination .paginated-rebates");
      }
    });
    watch(filteredRebates, () => {
      if (oldFilteredRebatesCount.value !== filteredRebates.value.length) {
        oldFilteredRebatesCount.value = filteredRebates.value.length;
        handleUpdatingAnimationClass(".control.pagination .filtered-rebates");
        handleUpdatingAnimationClass(".counter__value");
      }
    });
    watch(currentPage, () => {
      handleUpdatingAnimationClass(".control.pagination .current-page");
    });
    watch(totalPages, () => {
      handleUpdatingAnimationClass(".control.pagination .total-pages");
    });
    watch(selectedUpgradeTypes, () => {
      const filterContainers = document.querySelectorAll(".filter--other-offers");
      if (filterContainers.length && "all" !== selectedOtherOffers.value) {
        filterContainers.forEach((filterContainer) => {
          const allFilterRadio = filterContainer ? filterContainer.querySelector(".all") : null;
          const prevActiveRadio = filterContainer ? filterContainer.querySelector(`.${isCheckedClass.value}`) : null;
          prevActiveRadio ? prevActiveRadio.classList.remove(isCheckedClass.value) : null;
          allFilterRadio ? allFilterRadio.classList.add(isCheckedClass.value) : null;
          selectedOtherOffers.value = defaultOtherOffers.value;
          history.replaceState(selectedOtherOffers.value, defaultOtherOffers.value);
        });
      }
    });
    watch([selectedBuildType, selectedLocation, selectedUpgradeTypes, selectedHeatingSystem, selectedOtherOffers], () => {
      currentPage.value = 1;
    });
    window.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select.is-active") || !document.querySelectorAll("#rebateFilterApp .custom-select.is-active").length) {
        resetSelectsActiveState();
      }
    });
    watch(selectedUpgradeTypes, async () => {
      const hasSelectedUpgradeTypes = selectedUpgradeTypes.value.length > 0;
      const accordionTrigger = document.querySelector("#upgradeTypesAccordionTrigger");
      await nextTick();
      if (hasSelectedUpgradeTypes && accordionTrigger) {
        const isExpanded = accordionTrigger.getAttribute("aria-expanded") === "true";
        if (!isExpanded) {
          accordionTrigger.click();
        }
      }
    });
    onMounted(() => {
      localAnalyticsReady();
      fetchData2();
      const accordions = document.querySelectorAll(".filter.accordion h2");
      accordions.forEach((accordionEl) => {
        new Accordion(accordionEl);
      });
    });
    class Accordion {
      constructor(domNode) {
        this.rootEl = domNode;
        this.buttonEl = this.rootEl.querySelector("button[aria-expanded]");
        const controlsId = this.buttonEl.getAttribute("aria-controls");
        this.contentEl = document.getElementById(controlsId);
        this.open = this.buttonEl.getAttribute("aria-expanded") === "true";
        this.buttonEl.addEventListener("click", this.onButtonClick.bind(this));
      }
      onButtonClick() {
        this.toggle(!this.open);
      }
      toggle(open) {
        if (open === this.open) {
          return;
        }
        this.open = open;
        this.buttonEl.setAttribute("aria-expanded", `${open}`);
        if (open) {
          this.contentEl.removeAttribute("hidden");
        } else {
          this.contentEl.setAttribute("hidden", "");
        }
      }
      // Add public open and close methods for convenience
      open() {
        this.toggle(true);
      }
      close() {
        this.toggle(false);
      }
    }
    watchEffect(() => {
      if (types.value.length && locations.value.length && systems.value.length && upgrades.value.length) {
        const urlParams = new URLSearchParams(window.location.search);
        const showParam = urlParams.get("show");
        if (null !== urlParams.get("tool") && urlParams.get("tool") !== "rebates") {
          console.warn('Tool parameter does not match "rebates". Initialization skipped.');
          return;
        }
        if (showParam === "off") {
          isVisible.value = false;
        }
        const buildType = urlParams.get("type");
        const serviceRegion = urlParams.get("region");
        const rebateSystem = urlParams.get("system");
        const upgradeType = urlParams.get("upgrade");
        if (buildType) {
          const decodedBuildType = decodeURIComponent(buildType);
          if (types.value.includes(decodedBuildType)) {
            selectedBuildType.value = decodedBuildType;
          } else {
            console.warn(`Invalid build type: ${decodedBuildType}`);
          }
        }
        if (serviceRegion) {
          const decodedServiceRegion = decodeURIComponent(serviceRegion);
          if (locations.value.includes(decodedServiceRegion)) {
            selectedLocation.value = decodedServiceRegion;
          } else {
            console.warn(`Invalid service region: ${decodedServiceRegion}`);
          }
        }
        if (rebateSystem) {
          const decodedRebateSystem = decodeURIComponent(rebateSystem);
          if (systems.value.includes(decodedRebateSystem)) {
            selectedHeatingSystem.value = decodedRebateSystem;
          } else {
            console.warn(`Invalid rebate program: ${decodedRebateSystem}`);
          }
        }
        if (upgradeType) {
          const decodedUpgradeType = decodeURIComponent(upgradeType);
          const upgradeTypesArray = parseQuotedValues(decodedUpgradeType);
          const validUpgradeTypes = upgradeTypesArray.filter((upgrade) => upgrades.value.includes(upgrade));
          if (validUpgradeTypes.length) {
            selectedUpgradeTypes.value = validUpgradeTypes;
          } else {
            console.warn(`Invalid upgrade types: ${upgradeTypesArray.join(", ")}`);
          }
        }
        showLoadingMessage.value = false;
      }
    });
    function parseQuotedValues(input) {
      const values = [];
      let current = "";
      let insideQuotes = false;
      for (const char of input) {
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      if (current.trim()) {
        values.push(current.trim());
      }
      return values;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        _cache[37] || (_cache[37] = createBaseVNode("h2", { class: "sr-only" }, "Rebate Listings", -1)),
        _cache[38] || (_cache[38] = createBaseVNode("a", {
          href: "#rebatesResults",
          class: "sr-only skip-to-results"
        }, "Skip to results", -1)),
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3$1, [
            _cache[8] || (_cache[8] = createBaseVNode("label", {
              for: "typeSelect",
              class: ""
            }, "Are you building or renovating the home?", -1)),
            createBaseVNode("div", _hoisted_4$1, [
              withDirectives(createBaseVNode("select", {
                id: "typeSelect",
                class: "select select--type",
                onChange: selectIsActive,
                onClick: withModifiers(selectIsActive, ["prevent"]),
                onTouchend: selectIsActive,
                onKeyup: withKeys(selectIsActive, ["esc"]),
                tabindex: "0",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedBuildType.value = $event),
                required: "true"
              }, [
                _cache[7] || (_cache[7] = createBaseVNode("option", { value: "all" }, "All Project Types", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(types.value, (type, index) => {
                  return openBlock(), createElementBlock("option", {
                    key: type,
                    value: type
                  }, toDisplayString(type), 9, _hoisted_5$1);
                }), 128))
              ], 544), [
                [vModelSelect, selectedBuildType.value]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_6$1, [
            _cache[10] || (_cache[10] = createBaseVNode("label", {
              for: "locationSelect",
              class: ""
            }, "Choose a service region", -1)),
            createBaseVNode("div", _hoisted_7$1, [
              withDirectives(createBaseVNode("select", {
                id: "locationSelect",
                class: "select select--location",
                onChange: selectIsActive,
                onClick: withModifiers(selectIsActive, ["prevent"]),
                onTouchend: selectIsActive,
                onKeyup: withKeys(selectIsActive, ["esc"]),
                tabindex: "0",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedLocation.value = $event),
                required: "true"
              }, [
                _cache[9] || (_cache[9] = createBaseVNode("option", { value: "all" }, "All Locations", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(locations.value, (location) => {
                  return openBlock(), createElementBlock("option", {
                    key: location,
                    value: location
                  }, toDisplayString(location), 9, _hoisted_8$1);
                }), 128))
              ], 544), [
                [vModelSelect, selectedLocation.value]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_9$1, [
            _cache[12] || (_cache[12] = createBaseVNode("label", {
              for: "systemSelect",
              class: ""
            }, "Choose your current primary heating system", -1)),
            createBaseVNode("div", _hoisted_10$1, [
              withDirectives(createBaseVNode("select", {
                id: "systemSelect",
                class: "select select--system",
                onChange: selectIsActive,
                onClick: withModifiers(selectIsActive, ["prevent"]),
                onTouchend: selectIsActive,
                onKeyup: withKeys(selectIsActive, ["esc"]),
                tabindex: "0",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => selectedHeatingSystem.value = $event),
                required: "true"
              }, [
                _cache[11] || (_cache[11] = createBaseVNode("option", { value: "all" }, "All Heating Systems", -1)),
                !isLoading.value ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(systems.value, (system, index) => {
                  return openBlock(), createElementBlock("option", {
                    key: system,
                    style: normalizeStyle("Not sure, view all rebates" == system ? "display: none;" : null),
                    value: system
                  }, toDisplayString(system), 13, _hoisted_11$1);
                }), 128)) : createCommentVNode("", true)
              ], 544), [
                [vModelSelect, selectedHeatingSystem.value]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_12$1, [
            upgrades.value ? (openBlock(), createElementBlock("div", _hoisted_13$1, [
              createBaseVNode("h2", null, [
                createBaseVNode("button", _hoisted_14$1, [
                  createBaseVNode("span", {
                    class: "accordion-title",
                    innerHTML: "Filter by type of upgrade " + upgradeTypesAccordionTitle(selectedUpgradeTypes.value)
                  }, null, 8, _hoisted_15$1),
                  _cache[13] || (_cache[13] = createBaseVNode("span", { class: "accordion-icon" }, null, -1))
                ])
              ]),
              createBaseVNode("div", _hoisted_16$1, [
                createBaseVNode("div", _hoisted_17$1, [
                  _cache[15] || (_cache[15] = createBaseVNode("div", { class: "help-text" }, [
                    createBaseVNode("p", null, "Click to select the type(s) of upgrade you would like displayed, you may choose more than one.")
                  ], -1)),
                  createBaseVNode("fieldset", null, [
                    createBaseVNode("div", {
                      class: normalizeClass(`filter__item checkbox all ${selectedUpgradeTypes.value.length ? "" : isCheckedClass.value}`)
                    }, [
                      createBaseVNode("input", {
                        id: "upgradeTypeAll",
                        class: "sr-only",
                        type: "checkbox",
                        name: "upgradeTypes",
                        value: "all",
                        "aria-checked": selectedUpgradeTypes.value.length ? false : true,
                        checked: selectedUpgradeTypes.value.length ? false : true,
                        onClick: handleSelectAllInputFilter,
                        onKeyup: withKeys(simulateClickOnEnter, ["enter"])
                      }, null, 40, _hoisted_18$1),
                      _cache[14] || (_cache[14] = createBaseVNode("label", { for: "upgradeTypeAll" }, "All Upgrade Types", -1))
                    ], 2),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(upgrades.value, (upgrade, index) => {
                      return openBlock(), createElementBlock("div", {
                        key: index,
                        class: normalizeClass(`filter__item checkbox checkbox--${upgrade.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-")} ${-1 !== selectedUpgradeTypes.value.indexOf(upgrade) ? isCheckedClass.value : ""}`)
                      }, [
                        withDirectives(createBaseVNode("input", {
                          id: upgrade.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-"),
                          class: "sr-only",
                          type: "checkbox",
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => selectedUpgradeTypes.value = $event),
                          name: "upgradeTypes",
                          value: upgrade,
                          "aria-checked": selectedUpgradeTypes.value.includes(upgrade) ? true : false,
                          checked: selectedUpgradeTypes.value.includes(upgrade) ? true : false,
                          "aria-disabled": 0 === getUpgradeTypeTagCount(upgrade) ? true : false,
                          disabled: 0 === getUpgradeTypeTagCount(upgrade) ? true : false,
                          onKeyup: withKeys(simulateClickOnEnter, ["enter"])
                        }, null, 40, _hoisted_19$1), [
                          [vModelCheckbox, selectedUpgradeTypes.value]
                        ]),
                        createBaseVNode("label", {
                          for: upgrade.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-")
                        }, toDisplayString(upgrade) + " (" + toDisplayString(getUpgradeTypeTagCount(upgrade)) + ")", 9, _hoisted_20$1)
                      ], 2);
                    }), 128))
                  ])
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_21$1, [
            createBaseVNode("div", _hoisted_22$1, [
              _cache[17] || (_cache[17] = createBaseVNode("h2", null, [
                createBaseVNode("button", {
                  id: "otherOffersAccordionTrigger",
                  class: "accordion-trigger",
                  "aria-expanded": "false",
                  "aria-controls": "otherOffersAccordionPanel",
                  type: "button"
                }, [
                  createBaseVNode("span", { class: "accordion-title" }, "Additional filters"),
                  createBaseVNode("span", { class: "accordion-icon" })
                ])
              ], -1)),
              createBaseVNode("div", _hoisted_23$1, [
                createBaseVNode("div", _hoisted_24$1, [
                  !isLoading.value && offers.value ? (openBlock(), createElementBlock("fieldset", _hoisted_25$1, [
                    createBaseVNode("div", {
                      class: normalizeClass(`filter__item radio all ${"all" === selectedOtherOffers.value ? isCheckedClass.value : ""}`)
                    }, [
                      createBaseVNode("input", {
                        id: "offerTypeAll--mobile",
                        class: "sr-only",
                        type: "radio",
                        name: "all",
                        value: "all",
                        "aria-checked": "all" === selectedOtherOffers.value ? true : false,
                        "aria-disabled": "false",
                        checked: "all" === selectedOtherOffers.value ? true : false,
                        onClick: handleSelectAllInputFilter
                      }, null, 8, _hoisted_26$1),
                      _cache[16] || (_cache[16] = createBaseVNode("label", { for: "offerTypeAll--mobile" }, "No additional filters applied", -1))
                    ], 2),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(offers.value, (offer, index) => {
                      return openBlock(), createElementBlock("div", {
                        key: index,
                        class: normalizeClass(`filter__item radio radio--${offer.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-")} ${offer === selectedOtherOffers.value ? isCheckedClass.value : ""}`)
                      }, [
                        withDirectives(createBaseVNode("input", {
                          id: offer.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-") + "--mobile",
                          "data-filter-value": offer.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-"),
                          class: "sr-only",
                          type: "radio",
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => selectedOtherOffers.value = $event),
                          name: offer,
                          value: offer,
                          "aria-checked": offer === selectedOtherOffers.value ? true : false,
                          "aria-disabled": 0 === handleOfferTagCount(offer) ? true : false,
                          disabled: 0 === handleOfferTagCount(offer) ? true : false,
                          checked: offer === selectedOtherOffers.value ? true : false
                        }, null, 8, _hoisted_27$1), [
                          [vModelRadio, selectedOtherOffers.value]
                        ]),
                        createBaseVNode("label", {
                          for: offer.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-") + "--mobile"
                        }, toDisplayString(offer) + " (" + toDisplayString(handleOfferTagCount(offer)) + ")", 9, _hoisted_28$1)
                      ], 2);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_29$1, [
            createBaseVNode("button", {
              class: "clear-filters",
              onClick: withModifiers(clearFilters, ["prevent"]),
              onTouchend: clearFilters,
              onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"]),
              type: "button"
            }, " Reset selection ", 40, _hoisted_30$1)
          ]),
          isVisible.value ? (openBlock(), createElementBlock("div", _hoisted_31$1, [
            createBaseVNode("button", {
              class: "copy-link",
              onClick: withModifiers(addLinkToClipboard, ["prevent"]),
              onTouchend: addLinkToClipboard,
              onKeydown: withKeys(withModifiers(addLinkToClipboard, ["prevent"]), ["enter"]),
              disabled: selectedBuildType.value === "all" && selectedLocation.value === "all" && selectedHeatingSystem.value === "all" && !selectedUpgradeTypes.value.length,
              type: "button"
            }, " Copy link ", 40, _hoisted_32$1),
            _cache[18] || (_cache[18] = createBaseVNode("span", {
              class: "copy-message isFadedOut",
              role: "status",
              "aria-live": "polite"
            }, null, -1))
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_33$1, [
            createBaseVNode("button", {
              class: "prev-page",
              onClick: withModifiers(prevPage, ["prevent"]),
              disabled: currentPage.value === 1,
              tabindex: "0",
              type: "button"
            }, "Previous Page", 8, _hoisted_34$1),
            createBaseVNode("span", _hoisted_35$1, [
              _cache[19] || (_cache[19] = createTextVNode("Page ")),
              createBaseVNode("span", _hoisted_36$1, toDisplayString(currentPage.value), 1),
              _cache[20] || (_cache[20] = createTextVNode(" of ")),
              createBaseVNode("span", _hoisted_37$1, toDisplayString(totalPages.value), 1)
            ]),
            createBaseVNode("button", {
              class: "next-page",
              onClick: withModifiers(nextPage, ["prevent"]),
              disabled: currentPage.value === totalPages.value,
              tabindex: "0",
              type: "button"
            }, "Next Page", 8, _hoisted_38$1),
            createBaseVNode("span", _hoisted_39$1, [
              _cache[22] || (_cache[22] = createTextVNode(" Showing ")),
              createBaseVNode("span", _hoisted_40$1, [
                createBaseVNode("span", _hoisted_41$1, toDisplayString(paginatedRebates.value.length), 1),
                _cache[21] || (_cache[21] = createTextVNode(" of ")),
                createBaseVNode("span", _hoisted_42$1, toDisplayString(filteredRebates.value.length), 1)
              ]),
              _cache[23] || (_cache[23] = createTextVNode(" Rebates "))
            ]),
            createBaseVNode("span", _hoisted_43$1, [
              createBaseVNode("span", _hoisted_44$1, [
                _cache[24] || (_cache[24] = createTextVNode(" Showing ")),
                createBaseVNode("span", _hoisted_45$1, toDisplayString(paginatedRebates.value.length), 1),
                _cache[25] || (_cache[25] = createTextVNode(" of ")),
                createBaseVNode("span", _hoisted_46$1, toDisplayString(filteredRebates.value.length), 1),
                createTextVNode(" rebates " + toDisplayString(currentBuildTypeFilterMessage.value) + " " + toDisplayString(currentLocationFilterMessage.value) + " " + toDisplayString(currentHeatingSystemFilterMessage.value), 1)
              ]),
              createBaseVNode("span", _hoisted_47$1, [
                _cache[26] || (_cache[26] = createTextVNode("Page ")),
                createBaseVNode("span", _hoisted_48$1, toDisplayString(currentPage.value), 1),
                _cache[27] || (_cache[27] = createTextVNode(" of ")),
                createBaseVNode("span", _hoisted_49$1, toDisplayString(totalPages.value), 1)
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_50$1, [
          createBaseVNode("div", _hoisted_51$1, [
            createBaseVNode("div", _hoisted_52$1, [
              _cache[30] || (_cache[30] = createBaseVNode("h2", null, "Additional filters ", -1)),
              !isLoading.value && offers.value ? (openBlock(), createElementBlock("fieldset", _hoisted_53$1, [
                _cache[29] || (_cache[29] = createBaseVNode("legend", { class: "sr-only" }, "Additional Filters:", -1)),
                createBaseVNode("div", {
                  class: normalizeClass(`filter__item radio all ${"all" === selectedOtherOffers.value ? isCheckedClass.value : ""}`)
                }, [
                  createBaseVNode("input", {
                    id: "offerTypeAll",
                    "data-filter-value": "all",
                    class: "sr-only",
                    type: "radio",
                    name: "otherOffers",
                    value: "all",
                    "aria-checked": "all" === selectedOtherOffers.value ? true : false,
                    "aria-disabled": "false",
                    checked: "all" === selectedOtherOffers.value ? true : false,
                    tabindex: "0",
                    onClick: handleSelectAllInputFilter,
                    onTouchend: handleSelectAllInputFilter
                  }, null, 40, _hoisted_54$1),
                  _cache[28] || (_cache[28] = createBaseVNode("label", { for: "offerTypeAll" }, "No additional filters applied", -1))
                ], 2),
                (openBlock(true), createElementBlock(Fragment, null, renderList(offers.value, (offer, index) => {
                  return openBlock(), createElementBlock("div", {
                    key: index,
                    class: normalizeClass(`filter__item radio radio--${offer.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-")} ${offer === selectedOtherOffers.value ? isCheckedClass.value : ""}`)
                  }, [
                    withDirectives(createBaseVNode("input", {
                      id: offer.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-"),
                      "data-filter-value": offer.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-"),
                      class: "sr-only",
                      type: "radio",
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => selectedOtherOffers.value = $event),
                      name: "otherOffers",
                      value: offer,
                      "aria-checked": offer === selectedOtherOffers.value ? true : false,
                      "aria-disabled": 0 === handleOfferTagCount(offer) ? true : false,
                      disabled: 0 === handleOfferTagCount(offer) ? true : false,
                      checked: offer === selectedOtherOffers.value ? true : false,
                      tabindex: "0"
                    }, null, 8, _hoisted_55$1), [
                      [vModelRadio, selectedOtherOffers.value]
                    ]),
                    createBaseVNode("label", {
                      for: offer.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-")
                    }, toDisplayString(offer) + " (" + toDisplayString(handleOfferTagCount(offer)) + ")", 9, _hoisted_56$1)
                  ], 2);
                }), 128))
              ])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_57$1, [
            createBaseVNode("h2", _hoisted_58$1, [
              _cache[31] || (_cache[31] = createTextVNode("Results (")),
              createBaseVNode("span", _hoisted_59$1, toDisplayString(filteredRebates.value.length), 1),
              _cache[32] || (_cache[32] = createTextVNode(") "))
            ]),
            createBaseVNode("div", {
              class: normalizeClass(`page page--${currentPage.value}`)
            }, [
              isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_60$1, _cache[33] || (_cache[33] = [
                createBaseVNode("div", { class: "inner" }, [
                  createBaseVNode("p", { class: "no-results loading" }, "Retrieving a list of Rebates, please wait...")
                ], -1)
              ]))) : createCommentVNode("", true),
              filteredRebates.value.length === 0 && !isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_61$1, _cache[34] || (_cache[34] = [
                createBaseVNode("div", null, [
                  createBaseVNode("p", {
                    class: "no-results",
                    role: "status",
                    "aria-live": "polite"
                  }, "Sorry, no results found.")
                ], -1)
              ]))) : createCommentVNode("", true),
              rebates.value.length > 0 && !isLoading.value ? (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(paginatedRebates.value, (rebate, index) => {
                return openBlock(), createElementBlock("article", {
                  key: rebate.id || index,
                  class: normalizeClass(["rebate", "result", index % 2 === 0 ? "even" : "odd"])
                }, [
                  createBaseVNode("div", _hoisted_62$1, [
                    createBaseVNode("h3", {
                      innerHTML: unref(decodeHtmlEntities)(rebate.title)
                    }, null, 8, _hoisted_63$1)
                  ]),
                  createBaseVNode("div", {
                    class: normalizeClass(rebateAmountClasses(rebate.rebate_amount))
                  }, [
                    createBaseVNode("p", null, toDisplayString(rebate.rebate_amount), 1)
                  ], 2),
                  createBaseVNode("div", _hoisted_64$1, [
                    createBaseVNode("p", {
                      innerHTML: rebate.short_description
                    }, null, 8, _hoisted_65$1)
                  ]),
                  createBaseVNode("div", _hoisted_66$1, [
                    createBaseVNode("a", {
                      href: rebate.post_url,
                      class: "button",
                      onClick: ($event) => onRebateClick(rebate),
                      "aria-label": unref(decodeHtmlEntities)(rebate.title) + " view rebate details"
                    }, "View rebate details", 8, _hoisted_67$1)
                  ])
                ], 2);
              }), 128)) : createCommentVNode("", true)
            ], 2),
            isVisible.value && filteredRebates.value.length !== 0 && 1 !== totalPages.value ? (openBlock(), createElementBlock("div", _hoisted_68$1, [
              createBaseVNode("div", _hoisted_69$1, [
                createBaseVNode("button", {
                  class: "prev-page",
                  onClick: withModifiers(prevPage, ["prevent"]),
                  disabled: currentPage.value === 1,
                  tabindex: "0",
                  type: "button"
                }, "Previous Page", 8, _hoisted_70$1),
                createBaseVNode("span", _hoisted_71$1, [
                  _cache[35] || (_cache[35] = createTextVNode("Page ")),
                  createBaseVNode("span", _hoisted_72$1, toDisplayString(currentPage.value), 1),
                  _cache[36] || (_cache[36] = createTextVNode(" of ")),
                  createBaseVNode("span", _hoisted_73$1, toDisplayString(totalPages.value), 1)
                ]),
                createBaseVNode("button", {
                  class: "next-page",
                  onClick: withModifiers(nextPage, ["prevent"]),
                  disabled: currentPage.value === totalPages.value,
                  tabindex: "0",
                  type: "button"
                }, "Next Page", 8, _hoisted_74$1),
                createBaseVNode("button", {
                  class: "go-to-top",
                  tabindex: "0",
                  type: "button",
                  disabled: filteredRebates.value.length === 0,
                  onClick: _cache[6] || (_cache[6] = ($event) => unref(scrollToElementID)("rebatesResults", "11rem"))
                }, "Go to top of results", 8, _hoisted_75$1)
              ])
            ])) : createCommentVNode("", true)
          ])
        ])
      ]);
    };
  }
};
const RebateFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-643b8b35"]]);
const faqVueApp_vue_vue_type_style_index_0_scoped_8b400774_lang = "";
const _hoisted_1 = { class: "inner" };
const _hoisted_2 = {
  id: "faqsFilterControls",
  class: "faqsFilterControls filter-container"
};
const _hoisted_3 = { class: "control text-search" };
const _hoisted_4 = { class: "control category-select" };
const _hoisted_5 = { class: "custom-select" };
const _hoisted_6 = ["value"];
const _hoisted_7 = ["value"];
const _hoisted_8 = { class: "control additional-filters additional-filters--mobile accordion" };
const _hoisted_9 = { class: "filter filter--types" };
const _hoisted_10 = {
  id: "additionalFiltersAccordionPanel",
  class: "filter filter__list accordion-panel",
  role: "region",
  "aria-labelledby": "additionalFiltersAccordionTrigger",
  hidden: ""
};
const _hoisted_11 = { class: "inner" };
const _hoisted_12 = {
  key: 0,
  class: "filter__list"
};
const _hoisted_13 = ["aria-checked", "checked"];
const _hoisted_14 = { for: "typeAll--mobile" };
const _hoisted_15 = ["id", "data-filter-value", "value", "aria-checked", "aria-disabled", "disabled", "checked"];
const _hoisted_16 = ["for"];
const _hoisted_17 = { class: "control reset-filters" };
const _hoisted_18 = ["onKeydown"];
const _hoisted_19 = { class: "control copy-link-btn" };
const _hoisted_20 = ["onKeydown", "disabled"];
const _hoisted_21 = { class: "faqsFilterPagination control pagination pagination--top" };
const _hoisted_22 = ["disabled"];
const _hoisted_23 = { class: "pages" };
const _hoisted_24 = { class: "numValue current-page" };
const _hoisted_25 = { class: "numValue total-pages" };
const _hoisted_26 = ["disabled"];
const _hoisted_27 = { class: "totals" };
const _hoisted_28 = { class: "results-count" };
const _hoisted_29 = { class: "numValue paginated-faqs" };
const _hoisted_30 = { class: "numValue filtered-faqs" };
const _hoisted_31 = { class: "sr-status sr-only" };
const _hoisted_32 = {
  class: "results-count",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_33 = { class: "numValue paginated-faqs" };
const _hoisted_34 = { class: "numValue filtered-faqs" };
const _hoisted_35 = {
  class: "pages",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_36 = { class: "numValue current-page" };
const _hoisted_37 = { class: "numValue total-pages" };
const _hoisted_38 = {
  id: "faqsTool",
  class: "faqsTool"
};
const _hoisted_39 = {
  id: "faqsSidebar",
  class: "faqsSidebar sidebar",
  role: "complementary"
};
const _hoisted_40 = { class: "filter filter--types" };
const _hoisted_41 = {
  key: 0,
  class: "filter__list"
};
const _hoisted_42 = ["aria-checked", "checked"];
const _hoisted_43 = { for: "typeAll" };
const _hoisted_44 = ["id", "data-filter-value", "value", "aria-checked", "aria-disabled", "disabled", "checked"];
const _hoisted_45 = ["for"];
const _hoisted_46 = {
  id: "faqsResults",
  class: "faqsResults results"
};
const _hoisted_47 = { class: "results__title" };
const _hoisted_48 = { class: "counter__value" };
const _hoisted_49 = {
  key: 0,
  class: "controls controls--accordions"
};
const _hoisted_50 = { class: "control expand-accordions" };
const _hoisted_51 = ["onKeydown"];
const _hoisted_52 = { class: "control close-accordions" };
const _hoisted_53 = ["onKeydown"];
const _hoisted_54 = {
  key: 0,
  class: "is-loading",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_55 = {
  key: 1,
  class: "no-results"
};
const _hoisted_56 = ["data-keywords"];
const _hoisted_57 = ["id", "aria-controls", "onClick"];
const _hoisted_58 = { class: "accordion-title" };
const _hoisted_59 = ["id", "aria-labelledby"];
const _hoisted_60 = { class: "inner" };
const _hoisted_61 = {
  key: 0,
  class: "faq__terms"
};
const _hoisted_62 = {
  key: 0,
  class: "faq__building-types"
};
const _hoisted_63 = {
  key: 1,
  class: "faq__faq-types"
};
const _hoisted_64 = { class: "faq__permalinks" };
const _hoisted_65 = { class: "inner" };
const _hoisted_66 = { class: "faq__link" };
const _hoisted_67 = ["href"];
const _hoisted_68 = { class: "faq__link" };
const _hoisted_69 = ["href"];
const _hoisted_70 = ["innerHTML", "onClickCapture"];
const _hoisted_71 = { class: "faq__close" };
const _hoisted_72 = ["id", "onClick", "onTouchend", "aria-controls"];
const _hoisted_73 = {
  key: 1,
  class: "faqsFilterControls filter-container"
};
const _hoisted_74 = { class: "faqsFilterPagination control pagination pagination--bottom" };
const _hoisted_75 = ["disabled"];
const _hoisted_76 = { class: "pages" };
const _hoisted_77 = { class: "numValue current-page" };
const _hoisted_78 = { class: "numValue total-pages" };
const _hoisted_79 = ["disabled"];
const _hoisted_80 = ["disabled"];
const _sfc_main = {
  __name: "faqVueApp",
  setup(__props) {
    var _a;
    const faqs = ref([]);
    const isSingleResult = ref(false);
    const wasClicked = ref(false);
    const isVisible = ref(true);
    const defaultTextSearch = ref("");
    const textSearch = ref("");
    const defaultSelectedAdditionalFilter = ref("all");
    let debounceTimer = null;
    let expandTimer = null;
    const defaultSelectedCategory = ref("all");
    const selectedCategory = ref("all");
    const selectedAdditionalFilter = ref("all");
    const showLoadingMessage = ref(true);
    const isLoading = ref(false);
    ref("is-active");
    const updatingClass = ref("is-updating");
    const isCheckedClass = ref("is-checked");
    const pageSize = ref(30);
    const currentPage = ref(1);
    const itemsToClearFromSessionStorage = ref([
      "contractorsData",
      "contractorsTimestamp",
      "pqeasData",
      "pqeasTimestamp",
      "rebatesData",
      "rebatesTimestamp"
    ]);
    const oldPaginatedFaqsCount = ref(0);
    const oldFilteredFaqsCount = ref(0);
    const publicDomain2 = ref("https://betterhomes.gov.bc.ca");
    const faqsAPI = `${((_a = window.site) == null ? void 0 : _a.domain) ? window.site.domain : publicDomain2}/wp-json/custom/v1/faqs`;
    const filteredFaqs = computed(() => {
      let filteredFaqs2 = [...filteredFaqsByCategory.value];
      const selectedAdditional = selectedAdditionalFilter.value;
      const searchValue = textSearch.value.toLowerCase().trim();
      if (searchValue) {
        const searchWords = searchValue.split(/\s+/);
        filteredFaqs2 = filteredFaqs2.filter((faq) => {
          const titleWords = faq.title.toLowerCase().split(/\s+/);
          const keywordWords = faq.keywords.toLowerCase().split(/\s+/);
          const uniqueWords = [.../* @__PURE__ */ new Set([...titleWords, ...keywordWords])];
          const combinedText = uniqueWords.join(" ");
          return searchWords.every((word) => combinedText.includes(word));
        });
      }
      if ("all" !== selectedAdditional) {
        filteredFaqs2 = filteredFaqs2.filter((faq) => faq.additional_filters && faq.additional_filters.some((filter) => filter.name === selectedAdditional));
      }
      resetSelectsActiveState();
      setTimeout(() => {
      }, 1e3);
      return filteredFaqs2;
    });
    const filteredFaqsByCategory = computed(() => {
      const selectedCat = selectedCategory.value;
      currentPage.value = 1;
      history.replaceState(selectedAdditionalFilter.value, defaultSelectedAdditionalFilter.value);
      if (selectedCat === "all") {
        return faqs.value;
      } else {
        return faqs.value.filter((faq) => faq.categories && faq.categories.some((category) => category.name === selectedCat));
      }
    });
    const handleUpdatingAnimationClass = (elementCssPath) => {
      const elements = document.querySelectorAll(elementCssPath);
      if (0 < elements.length) {
        elements.forEach((element) => {
          element.classList.add(updatingClass.value);
          setTimeout(() => {
            element.classList.remove(updatingClass.value);
          }, 125);
        });
      }
    };
    const totalPages = computed(() => {
      const totalFaqs = filteredFaqs.value.length;
      return totalFaqs > 0 ? Math.ceil(totalFaqs / pageSize.value) : 1;
    });
    const paginatedFaqs = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredFaqs.value.slice(start, end);
    });
    const hierarchicalCategories = computed(() => {
      const allCategories = faqs.value.flatMap((faq) => faq.categories || []);
      return buildCategoryHierarchy(allCategories);
    });
    const buildCategoryHierarchy = (categories2) => {
      const categoryMap = /* @__PURE__ */ new Map();
      const parentToChildrenSet = /* @__PURE__ */ new Map();
      categories2.forEach((category) => {
        if (!categoryMap.has(category.term_id)) {
          categoryMap.set(category.term_id, { ...category, children: [] });
        }
      });
      categories2.forEach((category) => {
        if (category.parent !== 0) {
          const parent = categoryMap.get(category.parent);
          if (parent) {
            if (!parentToChildrenSet.has(parent.term_id)) {
              parentToChildrenSet.set(parent.term_id, /* @__PURE__ */ new Set());
            }
            const childrenSet = parentToChildrenSet.get(parent.term_id);
            if (!childrenSet.has(category.term_id)) {
              parent.children.push(categoryMap.get(category.term_id));
              childrenSet.add(category.term_id);
            }
          }
        }
      });
      categoryMap.forEach((category) => {
        category.children.sort((a, b) => a.name.localeCompare(b.name));
      });
      return [...categoryMap.values()].filter((category) => category.parent === 0).sort((a, b) => a.name.localeCompare(b.name));
    };
    const assembleUrl = () => {
      const baseUrl = window.location.origin + window.location.pathname;
      const urlParams = new URLSearchParams();
      urlParams.set("tool", "faqs");
      if (textSearch.value && textSearch.value !== "") {
        urlParams.set("filterText", encodeURIComponent(textSearch.value));
      }
      if (selectedCategory.value && selectedCategory.value !== "all") {
        urlParams.set("category", encodeURIComponent(selectedCategory.value));
      }
      if (selectedAdditionalFilter.value && selectedAdditionalFilter.value !== "all") {
        urlParams.set("additional", encodeURIComponent(selectedAdditionalFilter.value));
      }
      return `${baseUrl}?${urlParams.toString()}`;
    };
    const addLinkToClipboard = (event) => {
      const url = assembleUrl();
      navigator.clipboard.writeText(url).then(() => {
        handleLinkCopiedMessageContent(event, ".filter-container", "Link copied to clipboard successfully!");
      }).catch((err) => {
        console.error("Failed to copy URL:", err);
        alert("Failed to copy the link. Please try again.");
      });
    };
    const prevPage = () => {
      closeAllAccordions();
      return currentPage.value > 1 ? currentPage.value-- : null;
    };
    const nextPage = () => {
      closeAllAccordions();
      return currentPage.value < totalPages.value ? currentPage.value++ : null;
    };
    const categories = computed(() => {
      const uniqueCategories = /* @__PURE__ */ new Set();
      faqs.value.forEach((faq) => {
        if (faq.categories) {
          if (typeof faq.categories === "string") {
            uniqueCategories.add(faq.categories);
          } else if (Array.isArray(faq.categories)) {
            faq.categories.forEach((category) => {
              uniqueCategories.add(category.name);
            });
          }
        }
        if (faq.product_categories) {
          if (typeof faq.product_categories === "string") {
            uniqueCategories.add(faq.product_categories);
          } else if (Array.isArray(faq.product_categories)) {
            faq.product_categories.forEach((category) => {
              uniqueCategories.add(category.name);
            });
          }
        }
      });
      const sortedCategories = Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
      return [...sortedCategories];
    });
    const additional_filters = computed(() => {
      const uniqueTypes = /* @__PURE__ */ new Set();
      faqs.value.forEach((faq) => {
        if (faq.additional_filters) {
          if (typeof faq.additional_filters === "string") {
            uniqueTypes.add(faq.additional_filters);
          } else if (Array.isArray(faq.additional_filters)) {
            faq.additional_filters.forEach((filter) => {
              if (filter && filter.name) {
                uniqueTypes.add(filter.name);
              }
            });
          }
        }
      });
      return [...uniqueTypes];
    });
    const currentTypeFilterMessage = computed(() => {
      let messageText = ref("");
      if (defaultSelectedCategory.value === selectedCategory.value) {
        messageText.value += "in all categories ";
      } else {
        messageText.value += "in the category: " + selectedCategory.value + " ";
      }
      if ("" !== textSearch.value) {
        messageText.value += "filtered by the text search: " + textSearch.value + " ";
      }
      return messageText.value;
    });
    const clearFilters = () => {
      const allActiveFilters = document.querySelectorAll(`.${isCheckedClass.value}`);
      const filterAll = document.querySelectorAll(".all");
      resetSelectsActiveState();
      selectedCategory.value = defaultSelectedCategory.value;
      textSearch.value = defaultTextSearch.value;
      selectedAdditionalFilter.value = defaultSelectedAdditionalFilter.value;
      allActiveFilters.length ? allActiveFilters.forEach((activeFilter) => {
        activeFilter.classList.remove(isCheckedClass.value);
      }) : null;
      filterAll.checked = true;
      filterAll.forEach((checkbox) => {
        checkbox.classList.add(isCheckedClass.value);
      });
      handleResetAppState();
      closeAllAccordions();
      currentPage.value !== 1 ? handleUpdatingAnimationClass(".control.pagination .pages") : null;
      currentPage.value = 1;
    };
    const handleResetAppState = () => {
      history.replaceState(selectedCategory.value, defaultSelectedCategory.value);
      history.replaceState(textSearch.value, defaultTextSearch.value);
      history.replaceState(selectedAdditionalFilter.value, defaultSelectedAdditionalFilter.value);
    };
    const handleSelectAllInputFilter = (event) => {
      const container = event.target.closest(".filter__list");
      const filterAll = container.querySelector(".all");
      const allActiveFilters = container ? container.querySelectorAll(`.${isCheckedClass.value}`) : null;
      if (event.target.id === "typeAll" || event.target.id === "typeAll--mobile") {
        selectedAdditionalFilter.value = "all";
      }
      allActiveFilters.forEach((activeFilter) => {
        if (activeFilter !== filterAll) {
          activeFilter.classList.remove(isCheckedClass.value);
        }
      });
      if (!event.target.parentNode.classList.contains(isCheckedClass.value)) {
        event.target.parentNode.classList.add(isCheckedClass.value);
      }
      filterAll.checked = true;
      if (currentPage.value !== 1) {
        handleUpdatingAnimationClass(".control.pagination .pages");
      }
      currentPage.value = 1;
    };
    const resetSelectsActiveState = () => {
      let activeSelects = document.querySelectorAll("#faqFilterApp .custom-select.is-active");
      if (activeSelects.length > 0) {
        activeSelects.forEach((item) => {
          item.classList.remove("is-active");
        });
      }
    };
    const handleFilterPostCount = (thisFilter) => {
      const app = document.querySelector("#faqFilterApp");
      const searchValue = textSearch.value.toLowerCase().trim();
      const filterContainers = app ? app.querySelectorAll(".filter--types") : null;
      let altFilteredFaqs = [...filteredFaqsByCategory.value];
      let count = altFilteredFaqs.length;
      if (searchValue) {
        const searchWords = searchValue.split(/\s+/);
        altFilteredFaqs = altFilteredFaqs.filter((faq) => {
          const titleWords = faq.title.toLowerCase().split(/\s+/);
          const keywordWords = faq.keywords.toLowerCase().split(/\s+/);
          const uniqueWords = [.../* @__PURE__ */ new Set([...titleWords, ...keywordWords])];
          const combinedText = uniqueWords.join(" ");
          return searchWords.every((word) => combinedText.includes(word));
        });
      }
      if ("all" !== thisFilter) {
        altFilteredFaqs = altFilteredFaqs.filter((faq) => faq.additional_filters && faq.additional_filters.some((filter) => filter.name === thisFilter));
      }
      count = altFilteredFaqs.length;
      if (filterContainers.length) {
        filterContainers.forEach((filterContainer) => {
          const radioInput = filterContainer ? filterContainer.querySelector('.radio input[value="' + thisFilter + '"]') : null;
          if (radioInput) {
            if (0 === count) {
              radioInput.parentNode.classList.remove(isCheckedClass.value);
              radioInput.parentNode.classList.add("is-disabled");
              if (selectedAdditionalFilter.value === radioInput.name) {
                selectedAdditionalFilter.value = defaultSelectedAdditionalFilter.value;
              }
            } else {
              radioInput.parentNode.classList.remove("is-disabled");
            }
          }
        });
      }
      return count;
    };
    const isQuotaExceededError = (error) => {
      if (!error)
        return false;
      return error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED";
    };
    const isDataValid = (timestamp) => {
      const timeElapsed = Date.now() - parseInt(timestamp, 10);
      const hoursElapsed = timeElapsed / (1e3 * 60 * 60);
      return hoursElapsed < 24;
    };
    const fetchData2 = async () => {
      try {
        isLoading.value = true;
        showLoadingMessage.value = true;
        let data = sessionStorage.getItem("faqsData");
        let timestamp = sessionStorage.getItem("faqsTimestamp");
        let cachedData = null;
        if (data && timestamp && isDataValid(timestamp)) {
          cachedData = JSON.parse(data);
        } else {
          data = localStorage.getItem("faqsData");
          timestamp = localStorage.getItem("faqsTimestamp");
          if (data && timestamp && isDataValid(timestamp)) {
            cachedData = JSON.parse(data);
          }
        }
        if (cachedData) {
          faqs.value = cachedData;
          showLoadingMessage.value = false;
          isLoading.value = false;
          return;
        }
        const response = await fetch(faqsAPI, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        try {
          itemsToClearFromSessionStorage.value.forEach((item) => {
            sessionStorage.removeItem(item);
          });
          sessionStorage.clear();
        } catch (clearError) {
          console.warn("Error clearing sessionStorage:", clearError);
        }
        try {
          sessionStorage.setItem("faqsData", JSON.stringify(json));
          sessionStorage.setItem("faqsTimestamp", Date.now().toString());
        } catch (storageError) {
          if (isQuotaExceededError(storageError)) {
            console.warn("SessionStorage quota exceeded. Falling back to localStorage.");
            try {
              localStorage.setItem("faqsData", JSON.stringify(json));
              localStorage.setItem("faqsTimestamp", Date.now().toString());
            } catch (lsError) {
              console.error("Error setting data in localStorage:", lsError);
            }
          } else {
            console.error("Error setting data in sessionStorage:", storageError);
            throw storageError;
          }
        }
        faqs.value = json;
        showLoadingMessage.value = false;
        isLoading.value = false;
      } catch (error) {
        console.error("Error fetching faqs data:", error);
        throw error;
      }
    };
    const toggleFaqAccordion = (faq, isOpen = false) => {
      const panelId = `faqAccordionPanel--${faq.id}`;
      const panel = document.getElementById(panelId);
      const isHidden = panel.hasAttribute("hidden");
      if (isHidden && !isOpen) {
        if (typeof bcgovBlockThemePluginAccessibility === "function") {
          bcgovBlockThemePluginAccessibility();
        }
        panel.removeAttribute("hidden");
        onToggleFaq(faq, true);
      } else {
        panel.setAttribute("hidden", "");
        onToggleFaq(faq, false);
      }
    };
    const onToggleFaq = (faq, isExpanding) => {
      trackFaqAccordionToggle({
        action: isExpanding ? "expand" : "collapse",
        faqId: faq.id,
        faqTitle: faq.title
      });
    };
    const onFaqBodyClick = (event, faq) => {
      const anchor = event.target.closest("a");
      if (anchor) {
        event.preventDefault();
        trackFaqLinkClick({
          faqId: faq.id,
          faqTitle: faq.title,
          href: anchor.href || "",
          linkText: anchor.textContent || ""
        });
        window.open(anchor.href, "_blank");
      }
    };
    watch(textSearch, (newVal, oldVal) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        if (newVal !== oldVal) {
          trackFaqSearch({ newValue: newVal, oldValue: oldVal });
        }
      }, 1e3);
    });
    watch(selectedCategory, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackFaqFilterChange({
          filterName: "category",
          newValue: newVal,
          oldValue: oldVal
        });
      }
    });
    watch(selectedAdditionalFilter, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        trackFaqFilterChange({
          filterName: "additionalFilter",
          newValue: newVal,
          oldValue: oldVal
        });
      }
    });
    watch(() => {
      var _a2;
      return (_a2 = window.site) == null ? void 0 : _a2.domain;
    }, (newVal) => {
      if (newVal) {
        fetchData2();
      }
    });
    watch(paginatedFaqs, () => {
      if (oldPaginatedFaqsCount.value !== paginatedFaqs.value.length) {
        oldPaginatedFaqsCount.value = paginatedFaqs.value.length;
        handleUpdatingAnimationClass(".control.pagination .paginated-faqs");
      }
    });
    watch(filteredFaqs, () => {
      if (oldFilteredFaqsCount.value !== filteredFaqs.value.length) {
        oldFilteredFaqsCount.value = filteredFaqs.value.length;
        handleUpdatingAnimationClass(".control.pagination .filtered-faqs");
        handleUpdatingAnimationClass(".counter__value");
      }
      closeAllAccordions();
    });
    watch(currentPage, () => {
      handleUpdatingAnimationClass(".control.pagination .current-page");
    });
    watch(totalPages, () => {
      handleUpdatingAnimationClass(".control.pagination .total-pages");
    });
    watch([selectedCategory, textSearch], () => {
      currentPage.value = 1;
    });
    window.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select.is-active")) {
        resetSelectsActiveState();
      }
    });
    watch(filteredFaqs, async () => {
      if (expandTimer) {
        clearTimeout(expandTimer);
      }
      expandTimer = setTimeout(async () => {
        const isSingle = filteredFaqs.value.length === 1;
        isSingleResult.value = isSingle;
        await nextTick();
        const buttonSelector = isSingle ? "#faqFilterApp .expand-accordions button" : "#faqFilterApp .close-accordions button";
        const actionButton = document.querySelector(buttonSelector);
        if (actionButton) {
          actionButton.click();
          wasClicked.value = isSingle;
          if (isSingle) {
            onToggleFaq(filteredFaqs.value[0], true);
          }
        }
      }, 300);
    });
    function initAccordions(accordions) {
      accordions.forEach((accordionEl) => {
        new Accordion(accordionEl);
      });
    }
    function addFaqLinkToClipboard(event) {
      handleLinkCopiedMessageContent(event, ".faq", "FAQ link copied to clipboard!");
      if (navigator.clipboard) {
        navigator.clipboard.writeText(event.target.href);
      }
    }
    function handleLinkCopiedMessageContent(event, target = ".faq", msg) {
      const item = event.target.closest(target);
      const messageToUser = ref(msg);
      const messageArea = item ? item.querySelector(".copy-message") : null;
      if (messageArea && messageArea.classList.contains("isFadedOut")) {
        messageArea.innerText = messageToUser.value;
        messageArea.classList.remove("isFadedOut");
        setTimeout(() => {
          messageArea.classList.add("isFadedOut");
        }, 1e3);
        setTimeout(() => {
          if (messageArea.classList.contains("isFadedOut")) {
            messageArea.innerText = "";
          }
        }, 1600);
      }
    }
    onMounted(() => {
      var _a2;
      localAnalyticsReady();
      fetchData2();
      const appElement = document.getElementById("faqFilterApp");
      if ((_a2 = window.site) == null ? void 0 : _a2.domain)
        ;
      if (void 0 === navigator) {
        appElement.classList.add("noNavigator");
      }
    });
    watchEffect(() => {
      if (faqs.value.length && categories.value.length && additional_filters.value.length) {
        const urlParams = new URLSearchParams(window.location.search);
        const showParam = urlParams.get("show");
        if (showParam === "off") {
          isVisible.value = false;
          return;
        } else {
          isVisible.value = true;
        }
        if (null !== urlParams.get("tool") && urlParams.get("tool") !== "faqs") {
          console.warn('Tool parameter does not match "faqs". Initialization skipped.');
          return;
        }
        const category = urlParams.get("category");
        const additional = urlParams.get("additional");
        const searchText = urlParams.get("filterText");
        if (category) {
          const decodedCategory = decodeURIComponent(category);
          if (categories.value.includes(decodedCategory)) {
            selectedCategory.value = decodedCategory;
          } else {
            console.warn(`Invalid category: ${decodedCategory}`);
          }
        }
        if (additional) {
          const decodedAdditionalFilter = decodeURIComponent(additional);
          if (additional_filters.value.includes(decodedAdditionalFilter)) {
            selectedAdditionalFilter.value = decodedAdditionalFilter;
          } else {
            console.warn(`Invalid additional filter: ${decodedAdditionalFilter}`);
          }
        } else {
          selectedAdditionalFilter.value = "all";
        }
        if (searchText) {
          textSearch.value = decodeURIComponent(searchText);
        }
        showLoadingMessage.value = false;
      }
    });
    onUpdated(() => {
      const accordions = document.querySelectorAll(".faq.accordion h3");
      const mobileAccordions = document.querySelectorAll(".additional-filters--mobile h2");
      accordions.length ? initAccordions(accordions) : null;
      mobileAccordions.length ? initAccordions(mobileAccordions) : null;
    });
    class Accordion {
      /**
       * Creates an instance of Accordion.
       *
       * @param {HTMLElement} domNode - The root element of the accordion.
       */
      constructor(domNode) {
        this.rootEl = domNode;
        this.buttonEl = this.rootEl.querySelector("button[aria-expanded]");
        if (this.rootEl && this.buttonEl) {
          const controlsId = this.buttonEl.getAttribute("aria-controls");
          this.contentEl = document.getElementById(controlsId);
          this.open = this.buttonEl.getAttribute("aria-expanded") === "true";
          this.buttonEl.addEventListener("click", this.onButtonClick.bind(this));
        }
      }
      /**
       * Toggles the state of the accordion (open or closed) based on the specified 'open' parameter.
       *
       * @param {boolean} open - The desired open state of the accordion.
       */
      toggle(open) {
        if (open === this.open) {
          return;
        }
        this.open = open;
        this.buttonEl.setAttribute("aria-expanded", `${open}`);
        if (open) {
          this.contentEl.removeAttribute("hidden");
        } else {
          this.contentEl.setAttribute("hidden", "");
        }
      }
      /**
       * Event handler for the button click event.
       * Toggles the open state of the accordion and updates the corresponding CSS class.
       */
      onButtonClick() {
        this.toggle(!this.open);
        this.open ? this.rootEl.closest(".accordion").classList.add("isOpen") : this.rootEl.closest(".accordion").classList.remove("isOpen");
      }
      /**
       * Opens the accordion.
       */
      open() {
        this.toggle(true);
      }
      /**
       * Closes the accordion.
       */
      close() {
        this.toggle(false);
      }
    }
    function openAllAccordions() {
      const closedAccordions = document.querySelectorAll(".accordion:not(.isOpen)");
      closedAccordions.forEach((closedAccordion) => {
        let accordion = new Accordion(closedAccordion);
        accordion.toggle(false);
        accordion.toggle(true);
        accordion.rootEl.classList.add("isOpen");
      });
    }
    function closeAllAccordions() {
      const openAccordions = document.querySelectorAll(".faq.accordion.isOpen");
      openAccordions.forEach((openAccordion) => {
        let accordion = new Accordion(openAccordion);
        accordion.rootEl.classList.remove("isOpen");
        accordion.toggle(false);
      });
    }
    const collapseThisFaq = (event, faq) => {
      const currentFaq = event.target.closest(".accordion");
      const accordion = new Accordion(currentFaq);
      accordion.rootEl.classList.remove("isOpen");
      accordion.toggle(false);
      accordion.rootEl.focus();
      toggleFaqAccordion(faq, true);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[37] || (_cache[37] = createBaseVNode("h2", { class: "sr-only" }, "Frequently Asked Questions Listings", -1)),
        _cache[38] || (_cache[38] = createBaseVNode("a", {
          href: "#faqsResults",
          class: "sr-only skip-to-results"
        }, "Skip to results", -1)),
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            _cache[5] || (_cache[5] = createBaseVNode("label", {
              for: "textSearch",
              class: ""
            }, "Type to filter results", -1)),
            withDirectives(createBaseVNode("input", {
              id: "textSearch",
              type: "text",
              class: "input input--text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => textSearch.value = $event),
              name: "textSearch",
              placeholder: "Search FAQs..."
            }, null, 512), [
              [vModelText, textSearch.value]
            ])
          ]),
          createBaseVNode("div", _hoisted_4, [
            _cache[7] || (_cache[7] = createBaseVNode("label", {
              for: "categorySelect",
              class: ""
            }, "Choose a category", -1)),
            createBaseVNode("div", _hoisted_5, [
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedCategory.value = $event),
                id: "categorySelect",
                class: "select select--category"
              }, [
                _cache[6] || (_cache[6] = createBaseVNode("option", { value: "all" }, "All Categories", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(hierarchicalCategories.value, (category) => {
                  return openBlock(), createElementBlock(Fragment, {
                    key: category.term_id
                  }, [
                    createBaseVNode("option", {
                      value: category.name
                    }, toDisplayString(category.name), 9, _hoisted_6),
                    category.children.length ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(category.children, (child) => {
                      return openBlock(), createElementBlock("option", {
                        key: child.term_id,
                        value: child.name
                      }, toDisplayString("– " + child.name), 9, _hoisted_7);
                    }), 128)) : createCommentVNode("", true)
                  ], 64);
                }), 128))
              ], 512), [
                [vModelSelect, selectedCategory.value]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_8, [
            createBaseVNode("div", _hoisted_9, [
              _cache[11] || (_cache[11] = createBaseVNode("h2", null, [
                createBaseVNode("button", {
                  id: "additionalFiltersAccordionTrigger",
                  class: "accordion-trigger",
                  "aria-expanded": "false",
                  "aria-controls": "additionalFiltersAccordionPanel",
                  type: "button"
                }, [
                  createBaseVNode("span", { class: "accordion-title" }, "Additional filters"),
                  createBaseVNode("span", { class: "accordion-icon" })
                ])
              ], -1)),
              createBaseVNode("div", _hoisted_10, [
                createBaseVNode("div", _hoisted_11, [
                  !isLoading.value && faqs.value ? (openBlock(), createElementBlock("fieldset", _hoisted_12, [
                    createBaseVNode("div", {
                      class: normalizeClass(`filter__item radio radio--all all ${"all" === selectedAdditionalFilter.value ? isCheckedClass.value : ""}`)
                    }, [
                      createBaseVNode("input", {
                        id: "typeAll--mobile",
                        "data-filter-value": "all",
                        class: "sr-only",
                        type: "radio",
                        name: "additionalFiltersMobile",
                        value: "all",
                        "aria-checked": "all" === selectedAdditionalFilter.value ? true : false,
                        "aria-disabled": "false",
                        checked: "all" === selectedAdditionalFilter.value ? true : false,
                        onClick: handleSelectAllInputFilter
                      }, null, 8, _hoisted_13),
                      createBaseVNode("label", _hoisted_14, [
                        _cache[8] || (_cache[8] = createTextVNode("Show All ")),
                        _cache[9] || (_cache[9] = createBaseVNode("span", { class: "sr-only" }, "Results: ", -1)),
                        createTextVNode(" (" + toDisplayString(handleFilterPostCount("all")) + ")", 1)
                      ])
                    ], 2),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(additional_filters.value, (filter, index) => {
                      return openBlock(), createElementBlock("div", {
                        key: index,
                        class: normalizeClass(`filter__item radio radio--${filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-")} ${filter === selectedAdditionalFilter.value ? isCheckedClass.value : ""}`)
                      }, [
                        withDirectives(createBaseVNode("input", {
                          id: filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-") + "--mobile",
                          "data-filter-value": filter.toLowerCase().replace(/ /g, "_"),
                          class: "sr-only",
                          type: "radio",
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => selectedAdditionalFilter.value = $event),
                          name: "additionalFiltersMobile",
                          value: filter,
                          "aria-checked": filter === selectedAdditionalFilter.value ? true : false,
                          "aria-disabled": 0 === handleFilterPostCount(filter) ? true : false,
                          disabled: 0 === handleFilterPostCount(filter) ? true : false,
                          checked: filter === selectedAdditionalFilter.value ? true : false
                        }, null, 8, _hoisted_15), [
                          [vModelRadio, selectedAdditionalFilter.value]
                        ]),
                        createBaseVNode("label", {
                          for: filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-") + "--mobile"
                        }, [
                          createTextVNode(toDisplayString(filter) + " ", 1),
                          _cache[10] || (_cache[10] = createBaseVNode("span", { class: "sr-only" }, "Number of results: ", -1)),
                          createTextVNode("(" + toDisplayString(handleFilterPostCount(filter)) + ")", 1)
                        ], 8, _hoisted_16)
                      ], 2);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_17, [
            createBaseVNode("button", {
              class: "clear-filters",
              onClick: withModifiers(clearFilters, ["prevent"]),
              onTouchend: clearFilters,
              onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"]),
              type: "button"
            }, " Reset selection ", 40, _hoisted_18)
          ]),
          createBaseVNode("div", _hoisted_19, [
            createBaseVNode("button", {
              class: "copy-link",
              onClick: withModifiers(addLinkToClipboard, ["prevent"]),
              onTouchend: addLinkToClipboard,
              onKeydown: withKeys(withModifiers(addLinkToClipboard, ["prevent"]), ["enter"]),
              disabled: "" === textSearch.value && selectedCategory.value === "all",
              type: "button"
            }, " Copy link ", 40, _hoisted_20),
            _cache[12] || (_cache[12] = createBaseVNode("span", {
              class: "copy-message isFadedOut",
              role: "status",
              "aria-live": "polite"
            }, null, -1))
          ]),
          createBaseVNode("div", _hoisted_21, [
            isVisible.value && 1 !== totalPages.value || 1 < totalPages.value && !isVisible.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createBaseVNode("button", {
                class: "prev-page",
                onClick: withModifiers(prevPage, ["prevent"]),
                disabled: currentPage.value === 1,
                tabindex: "0",
                type: "button"
              }, "Previous Page", 8, _hoisted_22),
              createBaseVNode("span", _hoisted_23, [
                _cache[13] || (_cache[13] = createTextVNode("Page ")),
                createBaseVNode("span", _hoisted_24, toDisplayString(currentPage.value), 1),
                _cache[14] || (_cache[14] = createTextVNode(" of ")),
                createBaseVNode("span", _hoisted_25, toDisplayString(totalPages.value), 1)
              ]),
              createBaseVNode("button", {
                class: "next-page",
                onClick: withModifiers(nextPage, ["prevent"]),
                disabled: currentPage.value === totalPages.value,
                tabindex: "0",
                type: "button"
              }, "Next Page", 8, _hoisted_26)
            ], 64)) : createCommentVNode("", true),
            createBaseVNode("span", _hoisted_27, [
              _cache[16] || (_cache[16] = createTextVNode(" Showing ")),
              createBaseVNode("span", _hoisted_28, [
                createBaseVNode("span", _hoisted_29, toDisplayString(paginatedFaqs.value.length), 1),
                _cache[15] || (_cache[15] = createTextVNode(" of ")),
                createBaseVNode("span", _hoisted_30, toDisplayString(filteredFaqs.value.length), 1)
              ]),
              _cache[17] || (_cache[17] = createTextVNode(" Frequently Asked Questions "))
            ]),
            createBaseVNode("span", _hoisted_31, [
              createBaseVNode("span", _hoisted_32, [
                _cache[18] || (_cache[18] = createTextVNode("Showing ")),
                createBaseVNode("span", _hoisted_33, toDisplayString(paginatedFaqs.value.length), 1),
                _cache[19] || (_cache[19] = createTextVNode(" of ")),
                createBaseVNode("span", _hoisted_34, toDisplayString(filteredFaqs.value.length), 1),
                createTextVNode(" Frequently Asked Questions " + toDisplayString(currentTypeFilterMessage.value) + ".", 1)
              ]),
              createBaseVNode("span", _hoisted_35, [
                _cache[20] || (_cache[20] = createTextVNode("Page ")),
                createBaseVNode("span", _hoisted_36, toDisplayString(currentPage.value), 1),
                _cache[21] || (_cache[21] = createTextVNode(" of ")),
                createBaseVNode("span", _hoisted_37, toDisplayString(totalPages.value), 1)
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_38, [
          createBaseVNode("div", _hoisted_39, [
            createBaseVNode("div", _hoisted_40, [
              _cache[26] || (_cache[26] = createBaseVNode("h2", null, "Additional filters", -1)),
              !isLoading.value && faqs.value ? (openBlock(), createElementBlock("fieldset", _hoisted_41, [
                _cache[25] || (_cache[25] = createBaseVNode("legend", { class: "sr-only" }, "Additional Filters:", -1)),
                createBaseVNode("div", {
                  class: normalizeClass(`filter__item radio radio--all all ${"all" === selectedAdditionalFilter.value ? isCheckedClass.value : ""}`)
                }, [
                  createBaseVNode("input", {
                    id: "typeAll",
                    "data-filter-value": "all",
                    class: "sr-only",
                    type: "radio",
                    name: "additionalFilters",
                    value: "all",
                    "aria-checked": "all" === selectedAdditionalFilter.value ? true : false,
                    "aria-disabled": "false",
                    checked: "all" === selectedAdditionalFilter.value ? true : false,
                    onClick: handleSelectAllInputFilter,
                    onTouchend: handleSelectAllInputFilter
                  }, null, 40, _hoisted_42),
                  createBaseVNode("label", _hoisted_43, [
                    _cache[22] || (_cache[22] = createTextVNode("Show All ")),
                    _cache[23] || (_cache[23] = createBaseVNode("span", { class: "sr-only" }, "Results: ", -1)),
                    createTextVNode(" (" + toDisplayString(handleFilterPostCount("all")) + ")", 1)
                  ])
                ], 2),
                (openBlock(true), createElementBlock(Fragment, null, renderList(additional_filters.value, (filter, index) => {
                  return openBlock(), createElementBlock("div", {
                    key: index,
                    class: normalizeClass(`filter__item radio radio--${filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-")} ${filter === selectedAdditionalFilter.value ? isCheckedClass.value : ""}`)
                  }, [
                    withDirectives(createBaseVNode("input", {
                      id: filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-"),
                      "data-filter-value": filter.toLowerCase().replace(/ /g, "_"),
                      class: "sr-only",
                      type: "radio",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => selectedAdditionalFilter.value = $event),
                      name: "additionalFilters",
                      value: filter,
                      "aria-checked": filter === selectedAdditionalFilter.value ? true : false,
                      "aria-disabled": 0 === handleFilterPostCount(filter) ? true : false,
                      disabled: 0 === handleFilterPostCount(filter) ? true : false,
                      checked: filter === selectedAdditionalFilter.value ? true : false
                    }, null, 8, _hoisted_44), [
                      [vModelRadio, selectedAdditionalFilter.value]
                    ]),
                    createBaseVNode("label", {
                      for: filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g, "-").replace(/--/g, "-")
                    }, [
                      createTextVNode(toDisplayString(filter) + " ", 1),
                      _cache[24] || (_cache[24] = createBaseVNode("span", { class: "sr-only" }, "Number of results: ", -1)),
                      createTextVNode("(" + toDisplayString(handleFilterPostCount(filter)) + ")", 1)
                    ], 8, _hoisted_45)
                  ], 2);
                }), 128))
              ])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_46, [
            createBaseVNode("h2", _hoisted_47, [
              _cache[27] || (_cache[27] = createTextVNode("Results (")),
              createBaseVNode("span", _hoisted_48, toDisplayString(filteredFaqs.value.length), 1),
              _cache[28] || (_cache[28] = createTextVNode(")"))
            ]),
            !isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_49, [
              createBaseVNode("div", _hoisted_50, [
                createBaseVNode("button", {
                  class: "expand-accordions",
                  onClick: withModifiers(openAllAccordions, ["prevent"]),
                  onTouchend: openAllAccordions,
                  onKeydown: withKeys(withModifiers(openAllAccordions, ["prevent"]), ["enter"]),
                  type: "button"
                }, " Expand all ", 40, _hoisted_51)
              ]),
              createBaseVNode("div", _hoisted_52, [
                createBaseVNode("button", {
                  class: "close-accordions",
                  onClick: withModifiers(closeAllAccordions, ["prevent"]),
                  onTouchend: closeAllAccordions,
                  onKeydown: withKeys(withModifiers(closeAllAccordions, ["prevent"]), ["enter"]),
                  type: "button"
                }, " Collapse all ", 40, _hoisted_53)
              ])
            ])) : createCommentVNode("", true),
            createBaseVNode("div", {
              class: normalizeClass(`page page--${currentPage.value}`)
            }, [
              isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_54, _cache[29] || (_cache[29] = [
                createBaseVNode("div", { class: "inner" }, [
                  createBaseVNode("p", { class: "no-results loading" }, "Retrieving a list of FAQs, please wait...")
                ], -1)
              ]))) : createCommentVNode("", true),
              filteredFaqs.value.length === 0 && !isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_55, _cache[30] || (_cache[30] = [
                createBaseVNode("div", null, [
                  createBaseVNode("p", {
                    class: "no-results",
                    role: "status",
                    "aria-live": "polite"
                  }, "Sorry, no results found.")
                ], -1)
              ]))) : createCommentVNode("", true),
              faqs.value.length > 0 && !isLoading.value ? (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(paginatedFaqs.value, (faq, index) => {
                return openBlock(), createElementBlock("article", {
                  key: index,
                  class: normalizeClass(`faq accordion result result--${index + 1} ${0 === (index + 1) % 2 ? `even` : `odd`}`),
                  "data-keywords": faq.keywords
                }, [
                  createBaseVNode("h3", null, [
                    createBaseVNode("button", {
                      id: `faqAccordionTrigger--${faq.id}`,
                      class: "accordion-trigger",
                      "aria-expanded": "false",
                      "aria-controls": `faqAccordionPanel--${faq.id}`,
                      type: "button",
                      onClick: ($event) => toggleFaqAccordion(faq)
                    }, [
                      createBaseVNode("span", _hoisted_58, toDisplayString(unref(decodeHtmlEntities)(faq.title)), 1),
                      _cache[31] || (_cache[31] = createBaseVNode("span", { class: "accordion-icon" }, null, -1))
                    ], 8, _hoisted_57)
                  ]),
                  createBaseVNode("div", {
                    id: `faqAccordionPanel--${faq.id}`,
                    class: "accordion-panel",
                    role: "region",
                    "aria-labelledby": `faqAccordionTrigger--${faq.id}`,
                    hidden: ""
                  }, [
                    createBaseVNode("div", _hoisted_60, [
                      faq.building_types.length || faq.categories.length ? (openBlock(), createElementBlock("div", _hoisted_61, [
                        faq.building_types.length ? (openBlock(), createElementBlock("div", _hoisted_62, [
                          _cache[32] || (_cache[32] = createBaseVNode("p", null, "If you're:", -1)),
                          createBaseVNode("ul", null, [
                            (openBlock(true), createElementBlock(Fragment, null, renderList(faq.building_types, (building_type) => {
                              return openBlock(), createElementBlock("li", null, toDisplayString(building_type.name), 1);
                            }), 256))
                          ])
                        ])) : createCommentVNode("", true),
                        faq.categories.length ? (openBlock(), createElementBlock("div", _hoisted_63, [
                          createBaseVNode("p", null, toDisplayString(1 < faq.categories.length ? "Categories:" : "Category:"), 1),
                          createBaseVNode("ul", null, [
                            (openBlock(true), createElementBlock(Fragment, null, renderList(faq.categories, (faq_category) => {
                              return openBlock(), createElementBlock("li", null, toDisplayString(faq_category.name), 1);
                            }), 256))
                          ])
                        ])) : createCommentVNode("", true),
                        createBaseVNode("div", _hoisted_64, [
                          createBaseVNode("div", _hoisted_65, [
                            createBaseVNode("div", _hoisted_66, [
                              createBaseVNode("a", {
                                href: faq.post_url,
                                class: "copy-link",
                                onClick: withModifiers(addFaqLinkToClipboard, ["stop", "prevent"]),
                                onTouchend: withModifiers(addFaqLinkToClipboard, ["stop", "prevent"])
                              }, " Copy FAQ link ", 40, _hoisted_67),
                              _cache[33] || (_cache[33] = createBaseVNode("span", {
                                class: "copy-message isFadedOut",
                                role: "status",
                                "aria-live": "polite"
                              }, null, -1))
                            ]),
                            createBaseVNode("div", _hoisted_68, [
                              createBaseVNode("a", {
                                href: faq.post_url,
                                class: "visible-link",
                                target: "_blank"
                              }, " Open this FAQ in a new tab/window. ", 8, _hoisted_69)
                            ])
                          ])
                        ])
                      ])) : createCommentVNode("", true),
                      createBaseVNode("div", {
                        class: "faq__body",
                        innerHTML: faq.body,
                        onClickCapture: ($event) => onFaqBodyClick($event, faq)
                      }, null, 40, _hoisted_70),
                      createBaseVNode("div", _hoisted_71, [
                        createBaseVNode("button", {
                          id: `faqAccordionTrigger--${faq.id}--close`,
                          class: "",
                          onClick: withModifiers(($event) => collapseThisFaq($event, faq), ["stop", "prevent"]),
                          onTouchend: withModifiers(($event) => collapseThisFaq($event, faq), ["stop", "prevent"]),
                          "aria-controls": `faqAccordionPanel--${faq.id}`,
                          type: "button"
                        }, _cache[34] || (_cache[34] = [
                          createBaseVNode("span", { class: "accordion-title" }, "Collapse this FAQ", -1)
                        ]), 40, _hoisted_72)
                      ])
                    ])
                  ], 8, _hoisted_59)
                ], 10, _hoisted_56);
              }), 128)) : createCommentVNode("", true)
            ], 2),
            isVisible.value && filteredFaqs.value.length !== 0 && 1 !== totalPages.value ? (openBlock(), createElementBlock("div", _hoisted_73, [
              createBaseVNode("div", _hoisted_74, [
                createBaseVNode("button", {
                  class: "prev-page",
                  onClick: withModifiers(prevPage, ["prevent"]),
                  disabled: currentPage.value === 1,
                  tabindex: "0",
                  type: "button"
                }, "Previous Page", 8, _hoisted_75),
                createBaseVNode("span", _hoisted_76, [
                  _cache[35] || (_cache[35] = createTextVNode("Page ")),
                  createBaseVNode("span", _hoisted_77, toDisplayString(currentPage.value), 1),
                  _cache[36] || (_cache[36] = createTextVNode(" of ")),
                  createBaseVNode("span", _hoisted_78, toDisplayString(totalPages.value), 1)
                ]),
                createBaseVNode("button", {
                  class: "next-page",
                  onClick: withModifiers(nextPage, ["prevent"]),
                  disabled: currentPage.value === totalPages.value,
                  tabindex: "0",
                  type: "button"
                }, "Next Page", 8, _hoisted_79),
                createBaseVNode("button", {
                  class: "go-to-top",
                  tabindex: "0",
                  type: "button",
                  disabled: filteredFaqs.value.length === 0,
                  onClick: _cache[4] || (_cache[4] = ($event) => unref(scrollToElementID)("faqsResults", "11rem"))
                }, "Go to top of results", 8, _hoisted_80)
              ])
            ])) : createCommentVNode("", true)
          ])
        ])
      ]);
    };
  }
};
const FAQFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8b400774"]]);
function initVueApp(component, selector, props = {}) {
  const element = document.querySelector(selector);
  if (element) {
    const app = createApp(component, props);
    app.mount(element);
  }
}
function initializeApps() {
  const apps = [
    { component: PostFilterApp, selector: "#postFilterApp", props: { appProp: "Post Filter Data" } },
    { component: VehicleFilterApp, selector: "#vehicleFilterApp", props: { appProp: "Vehicle Data" } },
    { component: PQEAFilterApp, selector: "#pqeaFilterApp", props: { appProp: "PQEA Data" } },
    { component: ContractorFilterApp, selector: "#contractorFilterApp", props: { appProp: "Contractor Data" } },
    { component: RebateFilterApp, selector: "#rebateFilterApp", props: { appProp: "Rebate Data" } },
    { component: FAQFilterApp, selector: "#faqFilterApp", props: { appProp: "FAQ Data" } }
  ];
  apps.forEach(({ component, selector, props }) => {
    const element = document.querySelector(selector);
    if (element) {
      initVueApp(component, selector, props);
    }
  });
}
function addSafeEventListener(el, event, handler, options) {
  if (el && typeof el.addEventListener === "function") {
    el.addEventListener(event, handler, options);
  } else {
    console.warn("Invalid EventTarget or unsupported method: addEventListener");
  }
}
if (document.readyState === "complete") {
  initializeApps();
} else {
  addSafeEventListener(document, "DOMContentLoaded", initializeApps);
}
