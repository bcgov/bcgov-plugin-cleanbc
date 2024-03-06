const shared = "";
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
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
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
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
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction(
  (str) => str.charAt(0).toUpperCase() + str.slice(1)
);
const toHandlerKey = cacheStringFunction(
  (str) => str ? `on${capitalize(str)}` : ``
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
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
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
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
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
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
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
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
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect2) => {
  const { deps } = effect2;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect2);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  const { deps } = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
function effect(fn, options) {
  if (fn.effect) {
    fn = fn.effect.fn;
  }
  const _effect = new ReactiveEffect(fn);
  if (options) {
    extend(_effect, options);
    if (options.scope)
      recordEffectScope(_effect, options.scope);
  }
  if (!options || !options.lazy) {
    _effect.run();
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
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
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect2 of effects) {
    if (effect2.computed) {
      triggerEffect(effect2);
    }
  }
  for (const effect2 of effects) {
    if (!effect2.computed) {
      triggerEffect(effect2);
    }
  }
}
function triggerEffect(effect2, debuggerEventExtraInfo) {
  if (effect2 !== activeEffect || effect2.allowRecurse) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
function getDepFromReactive(object, key) {
  var _a;
  return (_a = targetMap.get(object)) == null ? void 0 : _a.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has$1(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has: has$1,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
);
const shallowReadonlyHandlers = /* @__PURE__ */ extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
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
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(
      method,
      false,
      false
    );
    readonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      false
    );
    shallowInstrumentations2[method] = createIterableMethod(
      method,
      false,
      true
    );
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
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
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    {
      triggerEffects(dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
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
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function triggerRef(ref2) {
  triggerRefValue(ref2);
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
function toValue(source) {
  return isFunction(source) ? source() : unref(source);
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
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
    this.dep = void 0;
    this.__v_isRef = true;
    const { get: get2, set: set2 } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    );
    this._get = get2;
    this._set = set2;
  }
  get value() {
    return this._get();
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
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
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
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
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
  return isRef(val) ? val : new ObjectRefImpl(
    source,
    key,
    defaultValue
  );
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function warn(msg, ...args) {
  return;
}
function assertNumber(val, type) {
  return;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
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
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
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
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
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
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let devtools;
let buffer = [];
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        buffer = [];
      }
    }, 3e3);
  } else {
    buffer = [];
  }
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
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
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render: render2,
    renderCache,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(
        render2.call(
          proxyToUse,
          proxyToUse,
          renderCache,
          props,
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
          props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render22(
          props,
          null
          /* we know it doesn't need it */
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
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
function filterSingleRoot(children) {
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
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
const SuspenseImpl = {
  name: "Suspense",
  // In order to make Suspense tree-shakable, we need to avoid importing it
  // directly in the renderer. The renderer checks for the __isSuspense flag
  // on a vnode's type and calls the `process` method, passing in renderer
  // internals.
  __isSuspense: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
    if (n1 == null) {
      mountSuspense(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        rendererInternals
      );
    } else {
      patchSuspense(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        isSVG,
        slotScopeIds,
        optimized,
        rendererInternals
      );
    }
  },
  hydrate: hydrateSuspense,
  create: createSuspenseBoundary,
  normalize: normalizeSuspenseChildren
};
const Suspense = SuspenseImpl;
function triggerEvent(vnode, name) {
  const eventListener = vnode.props && vnode.props[name];
  if (isFunction(eventListener)) {
    eventListener();
  }
}
function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
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
    isSVG,
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
    isSVG,
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
      isSVG,
      slotScopeIds
    );
    setActiveBranch(suspense, vnode.ssFallback);
  } else {
    suspense.resolve(false, true);
  }
}
function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
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
        isSVG,
        slotScopeIds,
        optimized
      );
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else if (isInFallback) {
        patch(
          activeBranch,
          newFallback,
          container,
          anchor,
          parentComponent,
          null,
          // fallback tree will not have suspense context
          isSVG,
          slotScopeIds,
          optimized
        );
        setActiveBranch(suspense, newFallback);
      }
    } else {
      suspense.pendingId++;
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
          isSVG,
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
            isSVG,
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
          isSVG,
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
          isSVG,
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
        isSVG,
        slotScopeIds,
        optimized
      );
      setActiveBranch(suspense, newBranch);
    } else {
      triggerEvent(n2, "onPending");
      suspense.pendingBranch = newBranch;
      suspense.pendingId++;
      patch(
        null,
        newBranch,
        suspense.hiddenContainer,
        null,
        parentComponent,
        suspense,
        isSVG,
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
function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
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
    if (parentSuspense == null ? void 0 : parentSuspense.pendingBranch) {
      parentSuspenseId = parentSuspense.pendingId;
      parentSuspense.deps++;
    }
  }
  const timeout = vnode.props ? toNumber(vnode.props.timeout) : void 0;
  const suspense = {
    vnode,
    parent: parentSuspense,
    parentComponent,
    isSVG,
    container,
    hiddenContainer,
    anchor,
    deps: 0,
    pendingId: 0,
    timeout: typeof timeout === "number" ? timeout : -1,
    activeBranch: null,
    pendingBranch: null,
    isInFallback: true,
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
      if (suspense.isHydrating) {
        suspense.isHydrating = false;
      } else if (!resume) {
        const delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = () => {
            if (pendingId === suspense.pendingId) {
              move(pendingBranch, container2, anchor2, 0);
            }
          };
        }
        let { anchor: anchor2 } = suspense;
        if (activeBranch) {
          anchor2 = next(activeBranch);
          unmount(activeBranch, parentComponent2, suspense, true);
        }
        if (!delayEnter) {
          move(pendingBranch, container2, anchor2, 0);
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
      if (!hasUnresolvedAncestor) {
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
      const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, isSVG: isSVG2 } = suspense;
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
          isSVG2,
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
    registerDep(instance, setupRenderEffect) {
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
          isSVG,
          optimized
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
function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
  const suspense = vnode.suspense = createSuspenseBoundary(
    vnode,
    parentSuspense,
    parentComponent,
    node.parentNode,
    document.createElement("div"),
    null,
    isSVG,
    slotScopeIds,
    optimized,
    rendererInternals,
    true
    /* hydrating */
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
  const el = vnode.el = branch.el;
  if (parentComponent && parentComponent.subTree === vnode) {
    parentComponent.vnode.el = el;
    updateHOCHostEl(parentComponent, el);
  }
}
function isVNodeSuspensible(vnode) {
  var _a;
  return ((_a = vnode.props) == null ? void 0 : _a.suspensible) != null && vnode.props.suspensible !== false;
}
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
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  var _a;
  const instance = getCurrentScope() === ((_a = currentInstance) == null ? void 0 : _a.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some(
        (v, i) => hasChanged(v, oldValue[i])
      ) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  const unwatch = () => {
    effect2.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect2);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
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
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
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
function traverse(value, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
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
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance
      );
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
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
function resolveTransitionHooks(vnode, props, state, instance) {
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
      if (el._leaveCb) {
        el._leaveCb(
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
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
      const done = el._enterCb = (cancelled) => {
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
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
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
      return resolveTransitionHooks(vnode2, props, state, instance);
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
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
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
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
function defineAsyncComponent(source) {
  if (isFunction(source)) {
    source = { loader: source };
  }
  const {
    loader,
    loadingComponent,
    errorComponent,
    delay = 200,
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
  return defineComponent({
    name: "AsyncComponentWrapper",
    __asyncLoader: load,
    get __asyncResolved() {
      return resolvedComp;
    },
    setup() {
      const instance = currentInstance;
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
          /* do not throw in dev if user provided error component */
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
          queueJob(instance.parent.update);
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
    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance2 = vnode.component;
      move(vnode, container, anchor, 0, parentSuspense);
      patch(
        instance2.vnode,
        vnode,
        container,
        anchor,
        instance2,
        parentSuspense,
        isSVG,
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
        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key);
        }
      });
    }
    function pruneCacheEntry(key) {
      const cached = cache.get(key);
      if (!current || !isSameVNodeType(cached, current)) {
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
        cache.set(pendingCacheKey, getInnerChild(instance.subTree));
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
        return null;
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
      const comp = vnode.type;
      const name = getComponentName(
        isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
      );
      const { include, exclude, max } = props;
      if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
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
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
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
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
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
        /* do not include inferred name to avoid breaking existing code */
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
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
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
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    if (name !== "default")
      props.name = name;
    return createVNode("slot", props, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`
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
    return getExposeProxy(i) || i.proxy;
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
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
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
        track(instance, "get", key);
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
const RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ extend(
  {},
  PublicInstanceProxyHandlers,
  {
    get(target, key) {
      if (key === Symbol.unscopables) {
        return;
      }
      return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has(_, key) {
      const has2 = key[0] !== "_" && !isGloballyWhitelisted(key);
      return has2;
    }
  }
);
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
function useModel(props, name, options) {
  const i = getCurrentInstance();
  if (options && options.local) {
    const proxy = ref(props[name]);
    watch(
      () => props[name],
      (v) => proxy.value = v
    );
    watch(proxy, (value) => {
      if (value !== props[name]) {
        i.emit(`update:${name}`, value);
      }
    });
    return proxy;
  } else {
    return {
      __v_isRef: true,
      get value() {
        return props[name];
      },
      set value(value) {
        i.emit(`update:${name}`, value);
      }
    };
  }
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
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
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
          /* treat default function as factory */
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
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
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
    const installedPlugins = /* @__PURE__ */ new Set();
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
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(
            rootComponent,
            rootProps
          );
          vnode.appContext = context;
          if (isHydrate && hydrate2) {
            hydrate2(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render2(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = null;
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
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
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
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
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
              /* isAbsent */
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
              /* isAbsent */
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
    trigger(instance, "set", "$attrs");
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
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
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
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
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
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
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
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
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
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(
        children,
        instance.slots = {}
      );
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
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
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
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
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
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
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
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
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
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
          if (hasOwn(setupState, ref2)) {
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
let hasMismatch = false;
const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== "foreignObject";
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
    hasMismatch = false;
    hydrateNode(container.firstChild, vnode, null, null, null);
    flushPostFlushCbs();
    container._vnode = vnode;
    if (hasMismatch && true) {
      console.error(`Hydration completed but contains mismatches.`);
    }
  };
  const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
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
            hasMismatch = true;
            node.data = vnode.children;
          }
          nextNode = nextSibling(node);
        }
        break;
      case Comment:
        if (domType !== 8 || isFragmentStart) {
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
          if (domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) {
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
          mountComponent(
            vnode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVGContainer(container),
            optimized
          );
          nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node);
          if (nextNode && isComment(nextNode) && nextNode.data === "teleport end") {
            nextNode = nextSibling(nextNode);
          }
          if (isAsyncWrapper(vnode)) {
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
            isSVGContainer(parentNode(node)),
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
    const { type, props, patchFlag, shapeFlag, dirs } = vnode;
    const forcePatchValue = type === "input" && dirs || type === "option";
    if (forcePatchValue || patchFlag !== -1) {
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        if (forcePatchValue || !optimized || patchFlag & (16 | 32)) {
          for (const key in props) {
            if (forcePatchValue && key.endsWith("value") || isOn(key) && !isReservedProp(key)) {
              patchProp2(
                el,
                key,
                null,
                props[key],
                false,
                void 0,
                parentComponent
              );
            }
          }
        } else if (props.onClick) {
          patchProp2(
            el,
            "onClick",
            null,
            props.onClick,
            false,
            void 0,
            parentComponent
          );
        }
      }
      let vnodeHooks;
      if (vnodeHooks = props && props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHooks, parentComponent, vnode);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
        queueEffectWithSuspense(() => {
          vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
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
          hasMismatch = true;
          const cur = next;
          next = next.nextSibling;
          remove2(cur);
        }
      } else if (shapeFlag & 8) {
        if (el.textContent !== vnode.children) {
          hasMismatch = true;
          el.textContent = vnode.children;
        }
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
      if (node) {
        node = hydrateNode(
          node,
          vnode,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      } else if (vnode.type === Text && !vnode.children) {
        continue;
      } else {
        hasMismatch = true;
        patch(
          null,
          vnode,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVGContainer(container),
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
      hasMismatch = true;
      insert(vnode.anchor = createComment(`]`), container, next);
      return next;
    }
  };
  const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
    hasMismatch = true;
    vnode.el = null;
    if (isFragment) {
      const end = locateClosingAsyncAnchor(node);
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
      isSVGContainer(container),
      slotScopeIds
    );
    return next;
  };
  const locateClosingAsyncAnchor = (node) => {
    let match = 0;
    while (node) {
      node = nextSibling(node);
      if (node && isComment(node)) {
        if (node.data === "[")
          match++;
        if (node.data === "]") {
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
  return [hydrate2, hydrateNode];
}
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
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
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
          mountStaticNode(n2, container, anchor, isSVG);
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
          isSVG,
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
            isSVG,
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
            isSVG,
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
            isSVG,
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
            isSVG,
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
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      isSVG,
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
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      isSVG,
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
        isSVG && type !== "foreignObject",
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
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
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
      if (vnode === subTree) {
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
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
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
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
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
        areChildrenSVG,
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          isSVG
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                isSVG,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
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
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        isSVG
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
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
        isSVG,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              isSVG,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
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
          hostPatchProp(
            el,
            key,
            prev,
            next,
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
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
        n2.children,
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        isSVG,
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
          isSVG,
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
          isSVG,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          isSVG,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(
      instance,
      initialVNode,
      container,
      anchor,
      parentSuspense,
      isSVG,
      optimized
    );
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
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
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            isSVG
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
          isSVG
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
    const effect2 = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => effect2.run();
    update.id = instance.uid;
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
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
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
          isSVG,
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
          isSVG,
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
            isSVG,
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
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
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
        isSVG,
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
        isSVG,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
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
          isSVG,
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
          isSVG,
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
            isSVG,
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
            isSVG,
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
            isSVG,
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
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
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
      dirs
    } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
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
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
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
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
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
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render2 = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
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
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
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
        if (!shallow)
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
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
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
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
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
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert(targetAnchor, target);
        isSVG = isSVG || isTargetSVG(target);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(
            children,
            container2,
            anchor2,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          currentContainer,
          parentComponent,
          parentSuspense,
          isSVG,
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
          isSVG,
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
    }
    updateCssVars(n2);
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(
            child,
            parentComponent,
            parentSuspense,
            true,
            !!child.dynamicChildren
          );
        }
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
  o: { nextSibling, parentNode, querySelector }
}, hydrateChildren) {
  const target = vnode.target = resolveTarget(
    vnode.props,
    querySelector
  );
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(
          nextSibling(node),
          vnode,
          parentNode(node),
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(
          targetNode,
          vnode,
          target,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      }
    }
    updateCssVars(vnode);
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
function updateCssVars(vnode) {
  const ctx = vnode.ctx;
  if (ctx && ctx.ut) {
    let node = vnode.children[0].el;
    while (node !== vnode.targetAnchor) {
      if (node.nodeType === 1)
        node.setAttribute("data-v-owner", ctx.uid);
      node = node.nextSibling;
    }
    ctx.ut();
  }
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
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
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
      /* isBlock */
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
      /* isBlock: prevent a block from tracking itself */
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
const InternalObjectKey = `__vInternal`;
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
    cloned.patchFlag |= -2;
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
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
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
    transition: vnode.transition,
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
  } else if (typeof child === "object") {
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
      if (!slotFlag && !(InternalObjectKey in children)) {
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
    attrsProxy: null,
    slotsProxy: null,
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
let globalCurrentInstanceSetters;
let settersKey = "__VUE_INSTANCE_SETTERS__";
{
  if (!(globalCurrentInstanceSetters = getGlobalThis()[settersKey])) {
    globalCurrentInstanceSetters = getGlobalThis()[settersKey] = [];
  }
  globalCurrentInstanceSetters.push((i) => currentInstance = i);
  internalSetCurrentInstance = (instance) => {
    if (globalCurrentInstanceSetters.length > 1) {
      globalCurrentInstanceSetters.forEach((s) => s(instance));
    } else {
      globalCurrentInstanceSetters[0](instance);
    }
  };
}
const setCurrentInstance = (instance) => {
  internalSetCurrentInstance(instance);
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [instance.props, setupContext]
    );
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
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
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      }
    }
  ));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      get attrs() {
        return getAttrsProxy(instance);
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
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
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
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
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
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
const version = "3.3.4";
const _ssrUtils = {
  createComponentInstance,
  setupComponent,
  renderComponentRoot,
  setCurrentRenderingInstance,
  isVNode,
  normalizeVNode
};
const ssrUtils = _ssrUtils;
const resolveFilter = null;
const compatUtils = null;
const svgNS = "http://www.w3.org/2000/svg";
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
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
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
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
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
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
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
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
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
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    el._value = value;
    const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
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
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
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
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
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
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
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
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
function defineCustomElement(options, hydrate2) {
  const Comp = defineComponent(options);
  class VueCustomElement extends VueElement {
    constructor(initialProps) {
      super(Comp, initialProps, hydrate2);
    }
  }
  VueCustomElement.def = Comp;
  return VueCustomElement;
}
const defineSSRCustomElement = (options) => {
  return defineCustomElement(options, hydrate);
};
const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
};
class VueElement extends BaseClass {
  constructor(_def, _props = {}, hydrate2) {
    super();
    this._def = _def;
    this._props = _props;
    this._instance = null;
    this._connected = false;
    this._resolved = false;
    this._numberProps = null;
    if (this.shadowRoot && hydrate2) {
      hydrate2(this._createVNode(), this.shadowRoot);
    } else {
      this.attachShadow({ mode: "open" });
      if (!this._def.__asyncLoader) {
        this._resolveProps(this._def);
      }
    }
  }
  connectedCallback() {
    this._connected = true;
    if (!this._instance) {
      if (this._resolved) {
        this._update();
      } else {
        this._resolveDef();
      }
    }
  }
  disconnectedCallback() {
    this._connected = false;
    nextTick(() => {
      if (!this._connected) {
        render(null, this.shadowRoot);
        this._instance = null;
      }
    });
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    this._resolved = true;
    for (let i = 0; i < this.attributes.length; i++) {
      this._setAttr(this.attributes[i].name);
    }
    new MutationObserver((mutations) => {
      for (const m of mutations) {
        this._setAttr(m.attributeName);
      }
    }).observe(this, { attributes: true });
    const resolve2 = (def2, isAsync = false) => {
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
      this._applyStyles(styles);
      this._update();
    };
    const asyncDef = this._def.__asyncLoader;
    if (asyncDef) {
      asyncDef().then((def2) => resolve2(def2, true));
    } else {
      resolve2(this._def);
    }
  }
  _resolveProps(def2) {
    const { props } = def2;
    const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
    for (const key of Object.keys(this)) {
      if (key[0] !== "_" && declaredPropKeys.includes(key)) {
        this._setProp(key, this[key], true, false);
      }
    }
    for (const key of declaredPropKeys.map(camelize)) {
      Object.defineProperty(this, key, {
        get() {
          return this._getProp(key);
        },
        set(val) {
          this._setProp(key, val);
        }
      });
    }
  }
  _setAttr(key) {
    let value = this.getAttribute(key);
    const camelKey = camelize(key);
    if (this._numberProps && this._numberProps[camelKey]) {
      value = toNumber(value);
    }
    this._setProp(camelKey, value, false);
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
  _setProp(key, val, shouldReflect = true, shouldUpdate = true) {
    if (val !== this._props[key]) {
      this._props[key] = val;
      if (shouldUpdate && this._instance) {
        this._update();
      }
      if (shouldReflect) {
        if (val === true) {
          this.setAttribute(hyphenate(key), "");
        } else if (typeof val === "string" || typeof val === "number") {
          this.setAttribute(hyphenate(key), val + "");
        } else if (!val) {
          this.removeAttribute(hyphenate(key));
        }
      }
    }
  }
  _update() {
    render(this._createVNode(), this.shadowRoot);
  }
  _createVNode() {
    const vnode = createVNode(this._def, extend({}, this._props));
    if (!this._instance) {
      vnode.ce = (instance) => {
        this._instance = instance;
        instance.isCE = true;
        const dispatch = (event, args) => {
          this.dispatchEvent(
            new CustomEvent(event, {
              detail: args
            })
          );
        };
        instance.emit = (event, ...args) => {
          dispatch(event, args);
          if (hyphenate(event) !== event) {
            dispatch(hyphenate(event), args);
          }
        };
        let parent = this;
        while (parent = parent && (parent.parentNode || parent.host)) {
          if (parent instanceof VueElement) {
            instance.parent = parent._instance;
            instance.provides = parent._instance.provides;
            break;
          }
        }
      };
    }
    return vnode;
  }
  _applyStyles(styles) {
    if (styles) {
      styles.forEach((css) => {
        const s = document.createElement("style");
        s.textContent = css;
        this.shadowRoot.appendChild(s);
      });
    }
  }
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
    setVarsOnVNode(instance.subTree, vars);
    updateTeleports(vars);
  };
  watchPostEffect(setVars);
  onMounted(() => {
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
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
    }
  }
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
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
const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
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
  const finishEnter = (el, isAppear, done) => {
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
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
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
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
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
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
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
  if (explicitTimeout) {
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
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const positionMap = /* @__PURE__ */ new WeakMap();
const newPositionMap = /* @__PURE__ */ new WeakMap();
const TransitionGroupImpl = {
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
        const cb = el._moveCb = (e) => {
          if (e && e.target !== el) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener("transitionend", cb);
            el._moveCb = null;
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
      prevChildren = children;
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
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i++) {
          const child = prevChildren[i];
          setTransitionHooks(
            child,
            resolveTransitionHooks(child, cssTransitionProps, state, instance)
          );
          positionMap.set(child, child.el.getBoundingClientRect());
        }
      }
      return createVNode(tag, null, children);
    };
  }
};
const removeMode = (props) => delete props.mode;
/* @__PURE__ */ removeMode(TransitionGroupImpl.props);
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
  const el = c.el;
  if (el._moveCb) {
    el._moveCb();
  }
  if (el._enterCb) {
    el._enterCb();
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
  if (el._vtc) {
    el._vtc.forEach((cls) => {
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
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
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
      el._assign(domValue);
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
  beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (el.composing)
      return;
    if (document.activeElement === el && el.type !== "range") {
      if (lazy) {
        return;
      }
      if (trim && el.value.trim() === value) {
        return;
      }
      if ((number || el.type === "number") && looseToNumber(el.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el.value !== newValue) {
      el.value = newValue;
    }
  }
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign = el._assign;
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
    el._assign = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  if (isArray(value)) {
    el.checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    el.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el.checked = looseEqual(value, getCheckboxValue(el, true));
  }
}
const vModelRadio = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props.value);
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      el._assign(getValue(el));
    });
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el._assign = getModelAssigner(vnode);
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
      el._assign(
        el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
      );
    });
    el._assign = getModelAssigner(vnode);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value }) {
    setSelected(el, value);
  },
  beforeUpdate(el, _binding, vnode) {
    el._assign = getModelAssigner(vnode);
  },
  updated(el, { value }) {
    setSelected(el, value);
  }
};
function setSelected(el, value) {
  const isMultiple = el.multiple;
  if (isMultiple && !isArray(value) && !isSet(value)) {
    return;
  }
  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i];
    const optionValue = getValue(option);
    if (isMultiple) {
      if (isArray(value)) {
        option.selected = looseIndexOf(value, optionValue) > -1;
      } else {
        option.selected = value.has(optionValue);
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i)
          el.selectedIndex = i;
        return;
      }
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
  return (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn(event, ...args);
  };
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
  return (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn(event);
    }
  };
};
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el._vod = el.style.display === "none" ? "" : el.style.display;
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
  el.style.display = value ? el._vod : "none";
}
function initVShowForSSR() {
  vShow.getSSRProps = ({ value }) => {
    if (!value) {
      return { style: { display: "none" } };
    }
  };
}
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
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
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
      return mount(container, true, container instanceof SVGElement);
    }
  };
  return app;
};
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
const compile = () => {
};
const vue_runtime_esmBundler = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BaseTransition,
  BaseTransitionPropsValidators,
  Comment,
  EffectScope,
  Fragment,
  KeepAlive,
  ReactiveEffect,
  Static,
  Suspense,
  Teleport,
  Text,
  Transition,
  TransitionGroup,
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
  get devtools() {
    return devtools;
  },
  effect,
  effectScope,
  getCurrentInstance,
  getCurrentScope,
  getTransitionRawChildren,
  guardReactiveProps,
  h,
  handleError,
  hasInjectionContext,
  hydrate,
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
  useModel,
  useSSRContext,
  useSlots,
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
const postFilterApp_vue_vue_type_style_index_0_scoped_0ae0dddc_lang = "";
const postFilterApp_vue_vue_type_style_index_1_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$3 = {
  key: 0,
  id: "tag-filter-container",
  class: "tag-filter-container"
};
const _hoisted_2$3 = { class: "taxonomy-common_component_category wp-block-post-terms filter-container" };
const _hoisted_3$3 = ["id", "value"];
const _hoisted_4$3 = ["for", "onClick", "data-category-slug", "id", "onKeydown", "aria-label"];
const _hoisted_5$3 = ["src"];
const _hoisted_6$3 = {
  key: 1,
  id: "action-title"
};
const _hoisted_7$3 = { key: 0 };
const _hoisted_8$3 = { key: 1 };
const _hoisted_9$3 = { class: "filter-options" };
const _hoisted_10$3 = ["onKeydown"];
const _hoisted_11$3 = {
  key: 2,
  class: "alignfull wp-block-columns card-container"
};
const _hoisted_12$3 = { class: "wp-block-query vue-card-container" };
const _hoisted_13$3 = { class: "vue-card-content is-layout-constrained wp-block-group common-component-group flex-card has-white-background-color has-background" };
const _hoisted_14$3 = { class: "category-icon-container" };
const _hoisted_15$3 = {
  key: 0,
  class: "category-icon"
};
const _hoisted_16$3 = ["src", "alt", "title"];
const _hoisted_17$3 = ["href"];
const _hoisted_18$3 = { style: { "font-size": "1rem" } };
const _hoisted_19$3 = ["innerHTML"];
const _hoisted_20$3 = {
  key: 4,
  class: "no-results",
  "aria-live": "polite"
};
const _hoisted_21$3 = ["onClick", "onKeydown"];
const perPage = 100;
const publicDomain$1 = "https://cleanbc.goc.bc.ca";
const _sfc_main$3 = {
  __name: "postFilterApp",
  setup(__props) {
    const filterPostType = ref("");
    const filterPostTypeName = ref("");
    const headingLinkActive = ref("false");
    const headingSize = ref("h3");
    const useExcerpt = ref("excerpt");
    const filterPosts = ref([]);
    const selectedTags = ref([]);
    const selectedTag = ref(null);
    const cssClass = ref("");
    const columns = ref(3);
    const showLoadingMessage = ref(true);
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
        const filterPostUrl = `${((_a = window.site) == null ? void 0 : _a.domain) ? window.site.domain : publicDomain$1}/wp-json/wp/v2/${filterPostType.value}?_embed&per_page=${perPage}&offset=${offset}&_category_image=true`;
        const filterPostResponse = await fetch(filterPostUrl);
        const filterPostsData = await filterPostResponse.json();
        const newFilterPosts = filterPostsData.map((post) => {
          var _a2, _b, _c, _d, _e, _f;
          return {
            ...post,
            item_tag: ((_b = (_a2 = post._embedded) == null ? void 0 : _a2["wp:term"]) == null ? void 0 : _b.flatMap((term) => term.filter((t) => t.taxonomy === "category").map((t) => t.name))) || [],
            category_image: ((_d = (_c = post._embedded) == null ? void 0 : _c["wp:term"]) == null ? void 0 : _d.flatMap((term) => term.filter((t) => t.taxonomy === "category").map((t) => t.acf["category_image"]))) || [],
            category_slug: ((_f = (_e = post._embedded) == null ? void 0 : _e["wp:term"]) == null ? void 0 : _f.flatMap((term) => term.filter((t) => t.taxonomy === "category").map((t) => t.slug))) || []
          };
        });
        filterPosts.value = [...filterPosts.value, ...newFilterPosts];
        if (filterPostsData.length >= perPage) {
          fetchData2(offset + filterPostsData.length);
        }
        showLoadingMessage.value = false;
        setTimeout(() => {
          doExternalLinkCheck();
          checkDefinitions();
        }, 50);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    const checkTag = (index) => {
      const tag = uniqueTags.value.categories[index];
      if (tag === "Actions we are taking")
        return;
      selectedTag.value = selectedTag.value === tag ? null : tag;
      const categorySlug = getCategorySlug(tag);
      if (categorySlug) {
        window.location.hash = categorySlug;
      }
      const actionTitleElement = document.getElementById("action-title");
      if (actionTitleElement) {
        actionTitleElement.scrollIntoView({ behavior: "smooth" });
      }
    };
    const getTagAriaLabel = (tag) => {
      return `${tag} filter ${selectedTags.value.includes(tag) ? "selected" : "deselected"}`;
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
      }, 50);
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
      const titleA = a.title.rendered.toUpperCase();
      const titleB = b.title.rendered.toUpperCase();
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
            link.setAttribute("aria-label", "opens definition dialog for: " + link.text);
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
      if ((_a = window.site) == null ? void 0 : _a.domain) {
        showLoadingMessage.value = true;
        fetchData2().then(() => {
          handleHash();
        });
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        uniqueTags.value.categories.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
          createBaseVNode("div", _hoisted_2$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(uniqueTags.value.categories, (category, index) => {
              return openBlock(), createElementBlock("div", {
                key: category,
                class: "tag-checkbox"
              }, [
                withDirectives(createBaseVNode("input", {
                  type: "radio",
                  id: "tag-" + index,
                  value: category,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedTag.value = $event),
                  class: "tag-input"
                }, null, 8, _hoisted_3$3), [
                  [vModelRadio, selectedTag.value]
                ]),
                createBaseVNode("label", {
                  for: "tag-" + index,
                  class: "tag-label tag",
                  tabindex: "0",
                  onClick: ($event) => checkTag(index),
                  "data-category-slug": getCategorySlug(category),
                  id: getCategorySlug(category),
                  onKeydown: withKeys(withModifiers(($event) => checkTag(index), ["prevent"]), ["enter"]),
                  role: "button",
                  "aria-label": getTagAriaLabel(category)
                }, [
                  getCategoryIconUrl(category) ? (openBlock(), createElementBlock("img", {
                    key: 0,
                    src: getCategoryIconUrl(category),
                    alt: "",
                    class: "category-icon"
                  }, null, 8, _hoisted_5$3)) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(category) + " (" + toDisplayString(getTagCount(category)) + ") ", 1)
                ], 40, _hoisted_4$3)
              ]);
            }), 128))
          ])
        ])) : createCommentVNode("", true),
        filterPosts.value.length > 0 ? (openBlock(), createElementBlock("h3", _hoisted_6$3, [
          sortedFilteredPosts.value.length !== filterPosts.value.length ? (openBlock(), createElementBlock("span", _hoisted_7$3, "Showing actions: " + toDisplayString(selectedTag.value ? selectedTag.value + " " : "") + " (" + toDisplayString(sortedFilteredPosts.value.length) + "/" + toDisplayString(filterPosts.value.length) + ")", 1)) : (openBlock(), createElementBlock("span", _hoisted_8$3, "All actions (" + toDisplayString(sortedFilteredPosts.value.length) + "/" + toDisplayString(filterPosts.value.length) + ")", 1)),
          createBaseVNode("div", _hoisted_9$3, [
            sortedFilteredPosts.value.length !== filterPosts.value.length ? (openBlock(), createElementBlock("button", {
              key: 0,
              class: "clear-filters",
              onClick: clearFilters,
              onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"])
            }, " Reset selection ", 40, _hoisted_10$3)) : createCommentVNode("", true)
          ])
        ])) : createCommentVNode("", true),
        sortedFilteredPosts.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_11$3, [
          createBaseVNode("div", _hoisted_12$3, [
            createBaseVNode("ul", {
              class: normalizeClass(["is-flex-container wp-block-post-template", `columns-${columns.value}`])
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(sortedFilteredPosts.value, (post) => {
                return openBlock(), createElementBlock("li", {
                  key: post.id,
                  class: "filter-card common-component"
                }, [
                  createBaseVNode("div", _hoisted_13$3, [
                    createBaseVNode("div", _hoisted_14$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(post.category_image, (img, index) => {
                        return openBlock(), createElementBlock(Fragment, { key: img }, [
                          img ? (openBlock(), createElementBlock("span", _hoisted_15$3, [
                            createBaseVNode("img", {
                              src: img,
                              alt: getPostCategoryAlt(post, index),
                              title: getPostCategoryAlt(post, index)
                            }, null, 8, _hoisted_16$3)
                          ])) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ]),
                    "true" === headingLinkActive.value ? (openBlock(), createElementBlock("a", {
                      key: 0,
                      href: post.link
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(headingSize.value), {
                        style: { "margin-bottom": "0", "margin-top": "var(--wp--preset--spacing--20)" },
                        class: "has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title",
                        innerHTML: post.title.rendered
                      }, null, 8, ["innerHTML"]))
                    ], 8, _hoisted_17$3)) : (openBlock(), createBlock(resolveDynamicComponent(headingSize.value), {
                      key: 1,
                      style: { "margin-bottom": "0", "margin-top": "var(--wp--preset--spacing--20)" },
                      class: "has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title",
                      innerHTML: post.title.rendered
                    }, null, 8, ["innerHTML"])),
                    createBaseVNode("div", _hoisted_18$3, [
                      createBaseVNode("span", {
                        class: "value",
                        innerHTML: useExcerpt.value === "excerpt" ? post.excerpt.rendered : post.content.rendered
                      }, null, 8, _hoisted_19$3)
                    ])
                  ])
                ]);
              }), 128))
            ], 2)
          ])
        ])) : showLoadingMessage.value ? withDirectives((openBlock(), createElementBlock("p", {
          key: 3,
          class: "no-results loading",
          "aria-live": "polite"
        }, "Retrieving " + toDisplayString(filterPostTypeName.value) + " results.", 513)), [
          [vShow, showLoadingMessage.value]
        ]) : (openBlock(), createElementBlock("p", _hoisted_20$3, [
          createTextVNode("Oops, no filterable results for "),
          createBaseVNode("strong", null, toDisplayString(filterPostTypeName.value), 1),
          createTextVNode(" have been found. "),
          createBaseVNode("a", {
            href: "#",
            onClick: withModifiers(clearFilters, ["prevent"]),
            onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"])
          }, "Try resetting your filters", 40, _hoisted_21$3),
          createTextVNode(" and refining your selections.")
        ]))
      ], 64);
    };
  }
};
const PostFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-0ae0dddc"]]);
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
        var args = [null];
        args.push.apply(args, arguments);
        var Ctor = Function.bind.apply(f, args);
        return new Ctor();
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
        var tt = function() {
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
          return { control: null, states: new tt(mt), scale: 1, focusDotIndex: 0 };
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
const vehicleFilterApp_vue_vue_type_style_index_0_scoped_baa26fa3_lang = "";
const _withScopeId$2 = (n) => (pushScopeId("data-v-baa26fa3"), n = n(), popScopeId(), n);
const _hoisted_1$2 = { class: "mb-2 d-none d-md-block" };
const _hoisted_2$2 = { key: 0 };
const _hoisted_3$2 = { key: 1 };
const _hoisted_4$2 = {
  key: 0,
  class: "container-fluid flex-container"
};
const _hoisted_5$2 = {
  id: "vue-app",
  class: "row scrollable"
};
const _hoisted_6$2 = { class: "filter-container filter-container-desktop d-none d-md-block" };
const _hoisted_7$2 = { class: "filter-flex-container" };
const _hoisted_8$2 = { class: "flex-group" };
const _hoisted_9$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h4", { id: "make-header-mobile" }, "By make or model", -1));
const _hoisted_10$2 = { class: "mb-2" };
const _hoisted_11$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("p", { class: "msrp-link text-dark" }, "Or EV Type using initialism eg: BEV, PHEV, etc.", -1));
const _hoisted_12$2 = { class: "flex-group" };
const _hoisted_13$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h4", null, "Price Range", -1));
const _hoisted_14$2 = { class: "msrp-range" };
const _hoisted_15$2 = { class: "max-msrp" };
const _hoisted_16$2 = { class: "msrp-link mt-3" };
const _hoisted_17$2 = {
  href: "#disclaimer",
  "aria-label": "navigate to the M.S.R.P. disclaimer information below"
};
const _hoisted_18$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("sup", null, " *", -1));
const _hoisted_19$2 = { class: "flex-group" };
const _hoisted_20$2 = { class: "flex-group-filters" };
const _hoisted_21$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h4", { style: { "margin-bottom": "0.25rem" } }, "Sort by", -1));
const _hoisted_22$2 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_23$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("sup", null, " *", -1));
const _hoisted_24$2 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_25$2 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_26$2 = /* @__PURE__ */ createStaticVNode('<div class="flex-group d-none d-lg-block" data-v-baa26fa3><h4 data-v-baa26fa3>Electric Vehicle Types</h4><p class="type-key" data-v-baa26fa3><span data-v-baa26fa3><strong data-v-baa26fa3>BEV</strong> – Battery Electric Vehicle</span><br data-v-baa26fa3><span data-v-baa26fa3><strong data-v-baa26fa3>ER-EV</strong> – Extended Range EV</span><br data-v-baa26fa3><span data-v-baa26fa3><strong data-v-baa26fa3>FCEV</strong> – Fuel Cell Electric Vehicle</span><br data-v-baa26fa3><span data-v-baa26fa3><strong data-v-baa26fa3>PHEV</strong> – Plug-in Hybrid EV</span></p></div>', 1);
const _hoisted_27$2 = { class: "type-key d-none d-md-block d-lg-none text-center" };
const _hoisted_28$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_29$2 = { class: "mt-2 d-block" };
const _hoisted_30$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("strong", null, "BEV", -1));
const _hoisted_31$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("strong", null, "ER-EV", -1));
const _hoisted_32$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("strong", null, "FCEV", -1));
const _hoisted_33$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("strong", null, "PHEV", -1));
const _hoisted_34$2 = { class: "filter-container filter-container-mobile d-sm-block d-md-none" };
const _hoisted_35$2 = ["src"];
const _hoisted_36$2 = { class: "mt-3" };
const _hoisted_37$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h4", { id: "make-header" }, "By make or model or type", -1));
const _hoisted_38$2 = { class: "mb-2" };
const _hoisted_39$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("p", { class: "msrp-link text-dark" }, "Or EV Type using initialism eg: BEV, PHEV, etc.", -1));
const _hoisted_40$2 = { class: "filter-flex-container" };
const _hoisted_41$2 = { class: "flex-group" };
const _hoisted_42$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h4", null, "MSRP Range", -1));
const _hoisted_43$2 = { class: "msrp-range-slider" };
const _hoisted_44$2 = { class: "msrp-range" };
const _hoisted_45$2 = { class: "max-msrp" };
const _hoisted_46$2 = { class: "msrp-link" };
const _hoisted_47$2 = {
  href: "#disclaimer",
  "aria-label": "navigate to the M.S.R.P. disclaimer information"
};
const _hoisted_48$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("sup", null, " *", -1));
const _hoisted_49$2 = { class: "flex-group" };
const _hoisted_50$2 = { class: "flex-group-filters" };
const _hoisted_51$2 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_52$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "filter-header" }, "Sort by ▸", -1));
const _hoisted_53$2 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_54$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "filter-header" }, "Value ▸", -1));
const _hoisted_55$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("sup", null, " *", -1));
const _hoisted_56$2 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_57$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "filter-header" }, "Range ▸", -1));
const _hoisted_58$2 = {
  class: "btn-group-horizontal",
  role: "group"
};
const _hoisted_59$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "filter-header" }, "Style ▸", -1));
const _hoisted_60$2 = { class: "type-key hidden-lg hidden-md" };
const _hoisted_61$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_62$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("strong", null, "BEV", -1));
const _hoisted_63$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_64$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("strong", null, "ER-EV", -1));
const _hoisted_65$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_66$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("strong", null, "FCEV", -1));
const _hoisted_67$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_68$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("strong", null, "PHEV", -1));
const _hoisted_69$2 = ["aria-label"];
const _hoisted_70$1 = { class: "ev-img" };
const _hoisted_71$1 = ["src", "alt"];
const _hoisted_72$1 = { style: { "margin-bottom": "1rem" } };
const _hoisted_73$1 = { class: "highlight" };
const _hoisted_74$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_75 = { class: "model" };
const _hoisted_76 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_77 = {
  key: 0,
  class: "msrp"
};
const _hoisted_78 = { key: 0 };
const _hoisted_79 = {
  key: 1,
  class: "msrp"
};
const _hoisted_80 = { key: 0 };
const _hoisted_81 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("hr", {
  class: "hr",
  size: "1"
}, null, -1));
const _hoisted_82 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "d-block" }, [
  /* @__PURE__ */ createBaseVNode("strong", null, "Range:")
], -1));
const _hoisted_83 = { class: "d-block mt-2 mb-1" };
const _hoisted_84 = {
  key: 2,
  class: "d-block"
};
const _hoisted_85 = {
  key: 3,
  class: "d-block"
};
const _hoisted_92 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("hr", {
  class: "hr",
  size: "1"
}, null, -1));
const _hoisted_93 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "d-block" }, [
  /* @__PURE__ */ createBaseVNode("strong", null, "Rebates up to:")
], -1));
const _hoisted_94 = {
  key: 6,
  class: "d-block mt-2 mb-1"
};
const _hoisted_95 = {
  key: 7,
  class: "d-block mt-2 mb-1"
};
const _hoisted_96 = {
  key: 8,
  class: "d-block"
};
const _hoisted_97 = {
  key: 9,
  class: "d-block"
};
const _hoisted_98 = {
  key: 10,
  class: "d-block"
};
const _hoisted_99 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("hr", {
  class: "hr",
  size: "1"
}, null, -1));
const _hoisted_100 = { class: "d-block" };
const _hoisted_101 = ["href", "aria-label"];
const _hoisted_102 = {
  key: 0,
  class: "rebate-content"
};
const _hoisted_103 = {
  key: 1,
  class: "rebate-content"
};
const _hoisted_104 = {
  key: 1,
  class: "vehicle-details"
};
const _hoisted_105 = { class: "no-content" };
const _hoisted_106 = ["src"];
const _hoisted_107 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h3", { class: "no-content" }, "We're unable to find any Electric Vehicles that match your criteria", -1));
const _hoisted_108 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("p", { class: "no-content" }, "Your filtering options did not return any results. Please try refining your input or parameters. Common issues include invalid makes or models, or too narrow a price range.", -1));
const publicDomain = "https://goelectricbc.goc.bc.ca";
const _sfc_main$2 = {
  __name: "vehicleFilterApp",
  setup(__props) {
    var _a;
    const vehiclesAPI = `${((_a = window.site) == null ? void 0 : _a.domain) ? window.site.domain : publicDomain}/wp-json/custom/v1/vehicles`;
    const vehicles = ref([]);
    const filterValue = ref("");
    ref(7e4);
    const isMake = ref(false);
    const isType = ref("");
    const isModel = ref(true);
    const isMSRP = ref(false);
    const isClass = ref(false);
    const isRebate = ref(false);
    ref("");
    const isElectricRange = ref(false);
    const isFullRange = ref(false);
    const rangeValue = ref([28e3, 7e4]);
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
        return vehicle.make.toLowerCase().includes(filterValueLowerCase) || vehicle.model.toLowerCase().includes(filterValueLowerCase) || vehicle.type.toLowerCase().includes(filterValueLowerCase);
      });
    });
    const getEVArray = () => {
      fetch(vehiclesAPI, { cache: "no-store" }).then((r) => r.json()).then((json) => {
        vehicles.value = json;
        vehicles.value.sort((a, b) => a.model.toLowerCase().localeCompare(b.model.toLowerCase()));
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
      isElectricRange.value = selection === "rangeElectric";
      isFullRange.value = selection === "rangeFull";
      const sortFunctions = {
        make: (a, b) => a.make > b.make ? 1 : -1,
        model: (a, b) => a.model.toLowerCase().localeCompare(b.model.toLowerCase()),
        msrp: (a, b) => a.minMsrp > b.minMsrp ? -1 : 1,
        class: (a, b) => a.vehicle_class > b.vehicle_class ? 1 : -1,
        rebate: (a, b) => a.rebate_provincial + a.rebate_federal > b.rebate_provincial + b.rebate_federal ? -1 : 1,
        type: (a, b) => a.type > b.type ? 1 : -1,
        rangeElectric: (a, b) => parseInt(a.rangeElectricKm) > parseInt(b.rangeElectricKm) ? -1 : 1,
        rangeFull: (a, b) => {
          let aIntToParse = null === a.rangeFullKm || 0 === a.rangeFullKm ? a.rangeElectricKm : a.rangeFullKm;
          let bIntToParse = null === b.rangeFullKm || 0 === b.rangeFullKm ? b.rangeElectricKm : b.rangeFullKm;
          return parseInt(aIntToParse) > parseInt(bIntToParse) ? -1 : 1;
        }
      };
      if (sortFunctions.hasOwnProperty(selection)) {
        vehicles.value.sort(sortFunctions[selection]);
      }
    };
    onMounted(() => {
      getEVArray();
    });
    return (_ctx, _cache) => {
      const _component_nobr = resolveComponent("nobr");
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("h3", _hoisted_1$2, [
          createTextVNode("Filter vehicles "),
          vehicles.value.length !== void 0 ? (openBlock(), createElementBlock("span", _hoisted_2$2, "(" + toDisplayString(searchvehicles.value.length) + " of " + toDisplayString(vehicles.value.length) + ")", 1)) : (openBlock(), createElementBlock("span", _hoisted_3$2, "(no vehicles currently available)"))
        ]),
        vehicles.value.length ? (openBlock(), createElementBlock("div", _hoisted_4$2, [
          createBaseVNode("div", _hoisted_5$2, [
            createBaseVNode("div", _hoisted_6$2, [
              createBaseVNode("div", _hoisted_7$2, [
                createBaseVNode("div", _hoisted_8$2, [
                  _hoisted_9$2,
                  createBaseVNode("div", _hoisted_10$2, [
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
                  _hoisted_11$2
                ]),
                createBaseVNode("div", _hoisted_12$2, [
                  _hoisted_13$2,
                  createVNode(unref(VueSlider), mergeProps({
                    ref: "slider",
                    modelValue: rangeValue.value,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => rangeValue.value = $event)
                  }, rangeOptions, {
                    tabindex: "0",
                    "aria-label": "This slider allows you to set a minimum and maximum price range – the low end begins at the minimum amount of 28,000 and the high end is set to the maximum amount of 70,000"
                  }), null, 16, ["modelValue"]),
                  createBaseVNode("p", _hoisted_14$2, [
                    createBaseVNode("span", _hoisted_15$2, "$" + toDisplayString(rangeValue.value[1] | _ctx.addComma), 1),
                    createTextVNode(" $" + toDisplayString(rangeValue.value[0] | _ctx.addComma), 1)
                  ]),
                  createBaseVNode("p", _hoisted_16$2, [
                    createBaseVNode("a", _hoisted_17$2, [
                      createTextVNode("Price range as shown is based on automaker "),
                      createVNode(_component_nobr, null, {
                        default: withCtx(() => [
                          createTextVNode("MSRP"),
                          _hoisted_18$2
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_19$2, [
                  createBaseVNode("div", _hoisted_20$2, [
                    _hoisted_21$2,
                    createBaseVNode("div", _hoisted_22$2, [
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isMake.value }]),
                        onClick: _cache[2] || (_cache[2] = ($event) => changeOrder("make")),
                        "aria-label": "sort available vehicles by Make"
                      }, "Make", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isModel.value }]),
                        onClick: _cache[3] || (_cache[3] = ($event) => changeOrder("model")),
                        "aria-label": "sort available vehicles by Model"
                      }, "Model", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-33", { active: isMSRP.value }]),
                        onClick: _cache[4] || (_cache[4] = ($event) => changeOrder("msrp")),
                        "aria-label": "sort available vehicles by MSRP"
                      }, [
                        createTextVNode("MSRP"),
                        _hoisted_23$2
                      ], 2)
                    ]),
                    createBaseVNode("div", _hoisted_24$2, [
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-50", { active: isType.value }]),
                        onClick: _cache[5] || (_cache[5] = ($event) => changeOrder("type")),
                        "aria-label": "sort available vehicles by Type"
                      }, "EV Type", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-50", { active: isRebate.value }]),
                        onClick: _cache[6] || (_cache[6] = ($event) => changeOrder("rebate")),
                        "aria-label": "sort vehicles by Rebate"
                      }, "Rebate Amt.", 2)
                    ]),
                    createBaseVNode("div", _hoisted_25$2, [
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-50", { active: isElectricRange.value }]),
                        onClick: _cache[7] || (_cache[7] = ($event) => changeOrder("rangeElectric")),
                        "aria-label": "sort vehicles by Electric Range"
                      }, "Elec. Range", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default btn-50", { active: isFullRange.value }]),
                        onClick: _cache[8] || (_cache[8] = ($event) => changeOrder("rangeFull")),
                        "aria-label": "sort vehicles by Full Range"
                      }, "Full Range", 2)
                    ])
                  ])
                ]),
                _hoisted_26$2
              ]),
              createBaseVNode("h4", _hoisted_27$2, [
                createTextVNode("Electric Vehicle Types:"),
                _hoisted_28$2,
                createBaseVNode("span", _hoisted_29$2, [
                  createVNode(_component_nobr, null, {
                    default: withCtx(() => [
                      _hoisted_30$2,
                      createTextVNode(" – Battery Electric Vehicle")
                    ]),
                    _: 1
                  }),
                  createTextVNode(" | "),
                  createVNode(_component_nobr, null, {
                    default: withCtx(() => [
                      _hoisted_31$2,
                      createTextVNode(" – Extended Range EV")
                    ]),
                    _: 1
                  }),
                  createTextVNode(" | "),
                  createVNode(_component_nobr, null, {
                    default: withCtx(() => [
                      _hoisted_32$2,
                      createTextVNode(" – Fuel Cell Electric Vehicle ")
                    ]),
                    _: 1
                  }),
                  createTextVNode(" | "),
                  createVNode(_component_nobr, null, {
                    default: withCtx(() => [
                      _hoisted_33$2,
                      createTextVNode(" – Plug-in Hybrid EV")
                    ]),
                    _: 1
                  })
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_34$2, [
              createBaseVNode("p", null, [
                createBaseVNode("img", {
                  class: "logo-img img-fluid",
                  src: unref(cleanBCLogo),
                  alt: "CleanBC Go electric"
                }, null, 8, _hoisted_35$2)
              ]),
              createBaseVNode("h3", _hoisted_36$2, "Filter vehicles (" + toDisplayString(searchvehicles.value.length) + " of " + toDisplayString(vehicles.value.length) + ")", 1),
              _hoisted_37$2,
              createBaseVNode("p", _hoisted_38$2, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => filterValue.value = $event),
                  class: "form-control",
                  placeholder: "filter by name...",
                  "aria-label": "enter a vehicle make or model to filter the options below"
                }, null, 512), [
                  [vModelText, filterValue.value]
                ])
              ]),
              _hoisted_39$2,
              createBaseVNode("div", _hoisted_40$2, [
                createBaseVNode("div", _hoisted_41$2, [
                  _hoisted_42$2,
                  createBaseVNode("div", _hoisted_43$2, [
                    createVNode(unref(VueSlider), mergeProps({
                      ref: "slider",
                      modelValue: rangeValue.value,
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => rangeValue.value = $event)
                    }, rangeOptions), null, 16, ["modelValue"]),
                    createBaseVNode("p", _hoisted_44$2, [
                      createTextVNode("$" + toDisplayString(rangeValue.value[0] | _ctx.addComma) + " – ", 1),
                      createBaseVNode("span", _hoisted_45$2, "$" + toDisplayString(rangeValue.value[1] | _ctx.addComma), 1)
                    ])
                  ]),
                  createBaseVNode("p", _hoisted_46$2, [
                    createBaseVNode("a", _hoisted_47$2, [
                      createTextVNode("Price range as shown is based on automaker "),
                      createVNode(_component_nobr, null, {
                        default: withCtx(() => [
                          createTextVNode("MSRP"),
                          _hoisted_48$2
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_49$2, [
                  createBaseVNode("div", _hoisted_50$2, [
                    createBaseVNode("div", _hoisted_51$2, [
                      _hoisted_52$2,
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isMake.value }]),
                        onClick: _cache[11] || (_cache[11] = ($event) => changeOrder("make")),
                        "aria-label": "sort vehicles by Make"
                      }, "Make", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isModel.value }]),
                        onClick: _cache[12] || (_cache[12] = ($event) => changeOrder("model")),
                        "aria-label": "sort vehicles by Model"
                      }, "Model", 2)
                    ]),
                    createBaseVNode("div", _hoisted_53$2, [
                      _hoisted_54$2,
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isMSRP.value }]),
                        onClick: _cache[13] || (_cache[13] = ($event) => changeOrder("msrp")),
                        "aria-label": "sort vehicles by MSRP"
                      }, [
                        createTextVNode("MSRP"),
                        _hoisted_55$2
                      ], 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isRebate.value }]),
                        onClick: _cache[14] || (_cache[14] = ($event) => changeOrder("rebate")),
                        "aria-label": "sort vehicles by Rebate"
                      }, "Rebate Amt.", 2)
                    ]),
                    createBaseVNode("div", _hoisted_56$2, [
                      _hoisted_57$2,
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isElectricRange.value }]),
                        onClick: _cache[15] || (_cache[15] = ($event) => changeOrder("rangeElectric")),
                        "aria-label": "sort vehicles by Electric Range"
                      }, "Electric", 2),
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isFullRange.value }]),
                        onClick: _cache[16] || (_cache[16] = ($event) => changeOrder("rangeFull")),
                        "aria-label": "sort vehicles by Full Range"
                      }, "Full", 2)
                    ]),
                    createBaseVNode("div", _hoisted_58$2, [
                      _hoisted_59$2,
                      createBaseVNode("button", {
                        type: "button",
                        class: normalizeClass(["btn btn-default", { active: isType.value }]),
                        onClick: _cache[17] || (_cache[17] = ($event) => changeOrder("type")),
                        "aria-label": "sort vehicles by Type"
                      }, "EV Type", 2)
                    ])
                  ])
                ]),
                createBaseVNode("p", _hoisted_60$2, [
                  createTextVNode("Electric Vehicle Types "),
                  _hoisted_61$2,
                  createBaseVNode("span", null, [
                    createVNode(_component_nobr, null, {
                      default: withCtx(() => [
                        _hoisted_62$2,
                        createTextVNode(" – Battery Electric Vehicle")
                      ]),
                      _: 1
                    }),
                    createTextVNode(),
                    _hoisted_63$2
                  ]),
                  createBaseVNode("span", null, [
                    createVNode(_component_nobr, null, {
                      default: withCtx(() => [
                        _hoisted_64$2,
                        createTextVNode(" – Extended Range EV")
                      ]),
                      _: 1
                    }),
                    _hoisted_65$2
                  ]),
                  createBaseVNode("span", null, [
                    createVNode(_component_nobr, null, {
                      default: withCtx(() => [
                        _hoisted_66$2,
                        createTextVNode(" – Fuel Cell Electric Vehicle")
                      ]),
                      _: 1
                    }),
                    createTextVNode(),
                    _hoisted_67$2
                  ]),
                  createBaseVNode("span", null, [
                    createVNode(_component_nobr, null, {
                      default: withCtx(() => [
                        _hoisted_68$2,
                        createTextVNode(" – Plug-in Hybrid EV")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ])
            ]),
            searchvehicles.value.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(searchvehicles.value, (vehicle, index) => {
              return openBlock(), createElementBlock("div", {
                class: "vehicle-details",
                tabindex: "0",
                "aria-label": "Make: " + vehicle.make + ". Model: " + vehicle.model + ". Price starts at: $" + vehicle.minMsrp + ". Electric Range: " + vehicle.rangeElectricKm + " kilometers. Vehicle rebates up to: $" + (vehicle.rebate_provincial + vehicle.rebate_federal).toLocaleString() + "."
              }, [
                createBaseVNode("div", null, [
                  createBaseVNode("div", _hoisted_70$1, [
                    createBaseVNode("img", {
                      class: "img-fluid",
                      src: vehicle.image ? vehicle.image : unref(placeholderImg),
                      alt: "photo of a " + vehicle.make + " " + vehicle.model
                    }, null, 8, _hoisted_71$1)
                  ]),
                  createBaseVNode("p", _hoisted_72$1, [
                    createBaseVNode("span", _hoisted_73$1, toDisplayString(vehicle.make), 1),
                    createTextVNode(),
                    createBaseVNode("span", null, [
                      createBaseVNode("strong", null, "| " + toDisplayString(vehicle.type), 1)
                    ]),
                    _hoisted_74$1,
                    createBaseVNode("span", _hoisted_75, toDisplayString(vehicle.model), 1),
                    _hoisted_76,
                    vehicle.maxMsrp === 0 ? (openBlock(), createElementBlock("span", _hoisted_77, [
                      createBaseVNode("strong", null, [
                        createTextVNode("MSRP"),
                        index === 0 ? (openBlock(), createElementBlock("sup", _hoisted_78, " *")) : createCommentVNode("", true),
                        createTextVNode(" $" + toDisplayString(vehicle.minMsrp.toLocaleString()), 1)
                      ])
                    ])) : (openBlock(), createElementBlock("span", _hoisted_79, [
                      createBaseVNode("strong", null, [
                        createTextVNode("MSRP"),
                        index === 0 ? (openBlock(), createElementBlock("sup", _hoisted_80, "*")) : createCommentVNode("", true),
                        createTextVNode(": $" + toDisplayString(vehicle.minMsrp.toLocaleString()) + "–$" + toDisplayString(vehicle.maxMsrp.toLocaleString()), 1)
                      ])
                    ])),
                    _hoisted_81,
                    _hoisted_82,
                    createBaseVNode("span", _hoisted_83, toDisplayString(vehicle.rangeElectricKm.toLocaleString()) + "km Electric", 1),
                    vehicle.rangeFullKm !== 0 ? (openBlock(), createElementBlock("span", _hoisted_84, toDisplayString(vehicle.rangeFullKm.toLocaleString()) + "km Full", 1)) : createCommentVNode("", true),
                    vehicle.rangeFullKm === 0 ? (openBlock(), createElementBlock("span", _hoisted_85, toDisplayString(vehicle.rangeElectricKm) + "km Full", 1)) : createCommentVNode("", true),
                    createCommentVNode("", true),
                    createCommentVNode("", true),
                    _hoisted_92,
                    _hoisted_93,
                    vehicle.rebate_provincial !== 0 ? (openBlock(), createElementBlock("span", _hoisted_94, "$" + toDisplayString(vehicle.rebate_provincial.toLocaleString()) + " Provincial", 1)) : (openBlock(), createElementBlock("span", _hoisted_95, "No Provincial rebate")),
                    vehicle.rebate_federal !== 0 && vehicle.rebate_federal_status === "processed" ? (openBlock(), createElementBlock("span", _hoisted_96, "$" + toDisplayString(vehicle.rebate_federal.toLocaleString()) + " Federal", 1)) : vehicle.rebate_federal_status === "pending" ? (openBlock(), createElementBlock("span", _hoisted_97, "Federal rebate pending")) : (openBlock(), createElementBlock("span", _hoisted_98, "No Federal rebate")),
                    _hoisted_99,
                    createBaseVNode("span", _hoisted_100, [
                      (openBlock(), createElementBlock("a", {
                        class: "external accessibleFocusItem",
                        href: vehicle.url,
                        "aria-label": "Go to the " + vehicle.make + " " + vehicle.model + " website.",
                        key: index
                      }, "Visit manufacturer website", 8, _hoisted_101))
                    ])
                  ]),
                  vehicle.rebate_federal_status === "processed" ? (openBlock(), createElementBlock("p", _hoisted_102, "Combined rebates up to $" + toDisplayString((vehicle.rebate_provincial + vehicle.rebate_federal).toLocaleString()), 1)) : (openBlock(), createElementBlock("p", _hoisted_103, "Combined rebates up to $" + toDisplayString(vehicle.rebate_provincial.toLocaleString()), 1))
                ])
              ], 8, _hoisted_69$2);
            }), 256)) : createCommentVNode("", true),
            searchvehicles.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_104, [
              createBaseVNode("div", _hoisted_105, [
                createBaseVNode("img", { src: unref(cleanBCLeaf) }, null, 8, _hoisted_106)
              ]),
              _hoisted_107,
              _hoisted_108
            ])) : createCommentVNode("", true)
          ])
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
};
const VehicleFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-baa26fa3"]]);
const pqeaVueApp_vue_vue_type_style_index_0_scoped_3bd33005_lang = "";
const _withScopeId$1 = (n) => (pushScopeId("data-v-3bd33005"), n = n(), popScopeId(), n);
const _hoisted_1$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("h2", { class: "sr-only" }, "Energy Advisor Listings", -1));
const _hoisted_2$1 = {
  class: "pqeasFilterControls",
  id: "pqeasFilterControls"
};
const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("label", {
  for: "categorySelect",
  class: "sr-only"
}, "Choose between home construction and home renovation", -1));
const _hoisted_4$1 = { class: "custom-select" };
const _hoisted_5$1 = ["onClick", "onKeyup"];
const _hoisted_6$1 = {
  key: 0,
  value: "Constructing a home"
};
const _hoisted_7$1 = ["value"];
const _hoisted_8$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("label", {
  for: "locationSelect",
  class: "sr-only"
}, "Choose a service region", -1));
const _hoisted_9$1 = { class: "custom-select" };
const _hoisted_10$1 = ["onClick", "onKeyup"];
const _hoisted_11$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("option", { value: "all" }, "All Locations", -1));
const _hoisted_12$1 = ["value"];
const _hoisted_13$1 = ["onClick", "onKeydown"];
const _hoisted_14$1 = { class: "pqeasFilterPagination pqeas-filter__pagination pqeas-filter__pagination--top" };
const _hoisted_15$1 = ["onClick", "disabled"];
const _hoisted_16$1 = { class: "pages" };
const _hoisted_17$1 = { class: "numValue current-page" };
const _hoisted_18$1 = { class: "numValue total-pages" };
const _hoisted_19$1 = ["onClick", "disabled"];
const _hoisted_20$1 = { class: "totals" };
const _hoisted_21$1 = { class: "results-count" };
const _hoisted_22$1 = { class: "numValue paginated-pqeas" };
const _hoisted_23$1 = { class: "numValue filtered-pqeas" };
const _hoisted_24$1 = { class: "sr-status sr-only" };
const _hoisted_25$1 = {
  class: "results-count",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_26$1 = { class: "numValue paginated-pqeas" };
const _hoisted_27$1 = { class: "numValue filtered-pqeas" };
const _hoisted_28$1 = {
  class: "pages",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_29$1 = { class: "numValue current-page" };
const _hoisted_30$1 = { class: "numValue total-pages" };
const _hoisted_31$1 = {
  key: 0,
  class: "no-results loading",
  "aria-live": "polite"
};
const _hoisted_32$1 = {
  id: "pqeasResults",
  class: "pqeasResults table table--striped"
};
const _hoisted_33$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("caption", { class: "sr-only" }, "Program Qualified Energy Advisors", -1));
const _hoisted_34$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("colgroup", null, [
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--1 odd col--pqea__company-and-location" }),
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--2 even col--pqea__contact-name" }),
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--3 odd col--pqea__email-and-phone" }),
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--4 even col--pqea__service-organizations" }),
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--5 odd col--pqea__services" })
], -1));
const _hoisted_35$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", { class: "pqea-heading odd pqea-heading--company-and-location" }, [
      /* @__PURE__ */ createTextVNode("Company Name "),
      /* @__PURE__ */ createBaseVNode("br"),
      /* @__PURE__ */ createTextVNode("& Head Office")
    ]),
    /* @__PURE__ */ createBaseVNode("th", { class: "pqea-heading even pqea-heading--contact-name" }, "Contact Name"),
    /* @__PURE__ */ createBaseVNode("th", { class: "pqea-heading odd pqea-heading--email-and-phone" }, "Email & Phone"),
    /* @__PURE__ */ createBaseVNode("th", { class: "pqea-heading even pqea-heading--service-organizations" }, "Service Organization(s)"),
    /* @__PURE__ */ createBaseVNode("th", { class: "pqea-heading odd pqea-heading--services" }, "Program Qualified Services")
  ])
], -1));
const _hoisted_36$1 = {
  key: 0,
  class: "no-results"
};
const _hoisted_37$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("td", { colspan: "100%" }, [
  /* @__PURE__ */ createBaseVNode("p", {
    class: "no-results",
    "aria-live": "polite"
  }, "Sorry, no results found.")
], -1));
const _hoisted_38$1 = [
  _hoisted_37$1
];
const _hoisted_39$1 = {
  key: 1,
  class: "is-loading",
  "aria-live": "polite"
};
const _hoisted_40$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("td", { colspan: "100%" }, [
  /* @__PURE__ */ createBaseVNode("p", { class: "" }, "Loading...")
], -1));
const _hoisted_41$1 = [
  _hoisted_40$1
];
const _hoisted_42$1 = {
  "data-label": "Company Name and Head Office",
  class: "pqea__company-and-location"
};
const _hoisted_43$1 = ["href", "title"];
const _hoisted_44$1 = {
  key: 1,
  class: "pqea__company"
};
const _hoisted_45$1 = { class: "pqea__location" };
const _hoisted_46$1 = {
  "data-label": "Contact Name",
  class: "pqea__contact-name"
};
const _hoisted_47$1 = {
  "data-label": "Contact Email and Phone",
  class: "pqea__email-and-phone"
};
const _hoisted_48$1 = ["href"];
const _hoisted_49$1 = {
  key: 1,
  class: "pqea__email"
};
const _hoisted_50$1 = ["href"];
const _hoisted_51$1 = {
  key: 3,
  class: "pqea__telephone"
};
const _hoisted_52$1 = {
  "data-label": "Service Organization(s)",
  class: "pqea__service-organizations"
};
const _hoisted_53$1 = { key: 0 };
const _hoisted_54$1 = {
  key: 0,
  class: "pqea__service-organization-name"
};
const _hoisted_55$1 = ["href", "title"];
const _hoisted_56$1 = { key: 1 };
const _hoisted_57$1 = {
  key: 1,
  class: "pqea__service-organization-name--2"
};
const _hoisted_58$1 = ["href", "title"];
const _hoisted_59$1 = { key: 1 };
const _hoisted_60$1 = ["href", "title"];
const _hoisted_61$1 = { key: 1 };
const _hoisted_62$1 = {
  "data-label": "Program Qualified Services",
  class: "pqea__services"
};
const _hoisted_63$1 = { key: 0 };
const _hoisted_64$1 = { key: 0 };
const _hoisted_65$1 = { class: "pqeasFilterPagination pqeas-filter__pagination pqeas-filter__pagination--bottom" };
const _hoisted_66$1 = ["onClick", "disabled"];
const _hoisted_67$1 = { class: "pages" };
const _hoisted_68$1 = { class: "numValue current-page" };
const _hoisted_69$1 = { class: "numValue total-pages" };
const _hoisted_70 = ["onClick", "disabled"];
const _hoisted_71 = { class: "totals" };
const _hoisted_72 = { class: "results-count" };
const _hoisted_73 = { class: "numValue paginated-pqeas" };
const _hoisted_74 = { class: "numValue filtered-pqeas" };
const _sfc_main$1 = {
  __name: "pqeaVueApp",
  setup(__props) {
    var _a;
    const pqeas = ref([]);
    const defaultSelectedCategory = ref("Constructing a home");
    const selectedCategory = ref("Constructing a home");
    const defaultSelectedLocation = ref("all");
    const selectedLocation = ref("all");
    const showLoadingMessage = ref(true);
    const isLoading = ref(false);
    const activeClass = ref("is-active");
    const updatingClass = ref("is-updating");
    const pageSize = ref(30);
    const currentPage = ref(1);
    const itemsToClearFromSessionStorage = ref([
      "pqeasData",
      "pqeasTimestamp",
      "pqeasData",
      "pqeasTimestamp"
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
      return filteredPqeas2;
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
      currentPage.value !== 1 ? handleUpdatingAnimationClass(".pqeas-filter__pagination .pages") : null;
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
    const fetchData2 = async (offset = 0) => {
      try {
        isLoading.value = true;
        const cachedData = sessionStorage.getItem("pqeasData");
        const cachedTimestamp = sessionStorage.getItem("pqeasTimestamp");
        if (cachedData && cachedTimestamp) {
          const timeElapsed = Date.now() - parseInt(cachedTimestamp);
          const hoursElapsed = timeElapsed / (1e3 * 60 * 60);
          if (hoursElapsed < 24) {
            pqeas.value = JSON.parse(cachedData);
            showLoadingMessage.value = false;
            isLoading.value = false;
            return;
          }
        }
        fetch(pqeasAPI, { cache: "no-store" }).then((r) => r.json()).then((json) => {
          setTimeout(itemsToClearFromSessionStorage.value.forEach((item) => {
            sessionStorage.removeItem(item);
          }), 1e3);
          sessionStorage.setItem("pqeasData", JSON.stringify(json));
          sessionStorage.setItem("pqeasTimestamp", Date.now());
          pqeas.value = json;
          showLoadingMessage.value = false;
          isLoading.value = false;
        }).catch((error) => {
          console.error("Error fetching data:", error);
          throw error;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
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
        handleUpdatingAnimationClass(".pqeas-filter__pagination .paginated-pqeas");
      }
    });
    watch(filteredPqeas, () => {
      if (oldFilteredPqeasCount.value !== filteredPqeas.value.length) {
        oldFilteredPqeasCount.value = filteredPqeas.value.length;
        handleUpdatingAnimationClass(".pqeas-filter__pagination .filtered-pqeas");
      }
    });
    watch(currentPage, () => {
      handleUpdatingAnimationClass(".pqeas-filter__pagination .current-page");
    });
    watch(totalPages, () => {
      handleUpdatingAnimationClass(".pqeas-filter__pagination .total-pages");
    });
    watch([selectedCategory, selectedLocation], () => {
      currentPage.value = 1;
    });
    window.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select.is-active")) {
        resetSelectsActiveState();
      }
    });
    onMounted(() => {
      var _a2;
      fetchData2();
      document.getElementById("pqeaFilterApp");
      showLoadingMessage.value = true;
      if ((_a2 = window.site) == null ? void 0 : _a2.domain)
        ;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        _hoisted_1$1,
        createBaseVNode("div", _hoisted_2$1, [
          _hoisted_3$1,
          createBaseVNode("div", _hoisted_4$1, [
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
              isLoading.value ? (openBlock(), createElementBlock("option", _hoisted_6$1, "Constructing a home")) : createCommentVNode("", true),
              !isLoading.value ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(categories.value, (category, index) => {
                return openBlock(), createElementBlock("option", {
                  key: category,
                  value: category
                }, toDisplayString(category), 9, _hoisted_7$1);
              }), 128)) : createCommentVNode("", true)
            ], 40, _hoisted_5$1), [
              [vModelSelect, selectedCategory.value]
            ])
          ]),
          _hoisted_8$1,
          createBaseVNode("div", _hoisted_9$1, [
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
              _hoisted_11$1,
              (openBlock(true), createElementBlock(Fragment, null, renderList(locations.value, (location) => {
                return openBlock(), createElementBlock("option", {
                  key: location,
                  value: location
                }, toDisplayString(location), 9, _hoisted_12$1);
              }), 128))
            ], 40, _hoisted_10$1), [
              [vModelSelect, selectedLocation.value]
            ])
          ]),
          createBaseVNode("button", {
            class: "clear-filters",
            onClick: withModifiers(clearFilters, ["prevent"]),
            onTouchend: clearFilters,
            onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"]),
            type: "button"
          }, " Reset selection ", 40, _hoisted_13$1),
          createBaseVNode("div", _hoisted_14$1, [
            createBaseVNode("button", {
              class: "prevPage",
              onClick: withModifiers(prevPage, ["prevent"]),
              disabled: currentPage.value === 1,
              tabindex: "0",
              type: "button"
            }, "Previous Page", 8, _hoisted_15$1),
            createBaseVNode("span", _hoisted_16$1, [
              createTextVNode("Page "),
              createBaseVNode("span", _hoisted_17$1, toDisplayString(currentPage.value), 1),
              createTextVNode(" of "),
              createBaseVNode("span", _hoisted_18$1, toDisplayString(totalPages.value), 1)
            ]),
            createBaseVNode("button", {
              class: "nextPage",
              onClick: withModifiers(nextPage, ["prevent"]),
              disabled: currentPage.value === totalPages.value,
              tabindex: "0",
              type: "button"
            }, "Next Page", 8, _hoisted_19$1),
            createBaseVNode("span", _hoisted_20$1, [
              createTextVNode(" Showing "),
              createBaseVNode("span", _hoisted_21$1, [
                createBaseVNode("span", _hoisted_22$1, toDisplayString(paginatedPqeas.value.length), 1),
                createTextVNode(" of "),
                createBaseVNode("span", _hoisted_23$1, toDisplayString(filteredPqeas.value.length), 1)
              ]),
              createTextVNode(" Energy Advisors ")
            ]),
            createBaseVNode("span", _hoisted_24$1, [
              createBaseVNode("span", _hoisted_25$1, [
                createTextVNode("Showing "),
                createBaseVNode("span", _hoisted_26$1, toDisplayString(paginatedPqeas.value.length), 1),
                createTextVNode(" of "),
                createBaseVNode("span", _hoisted_27$1, toDisplayString(filteredPqeas.value.length), 1),
                createTextVNode(" Energy Advisors " + toDisplayString(currentTypeFilterMessage.value) + " " + toDisplayString(currentLocationFilterMessage.value), 1)
              ]),
              createBaseVNode("span", _hoisted_28$1, [
                createTextVNode("Page "),
                createBaseVNode("span", _hoisted_29$1, toDisplayString(currentPage.value), 1),
                createTextVNode(" of "),
                createBaseVNode("span", _hoisted_30$1, toDisplayString(totalPages.value), 1)
              ])
            ])
          ])
        ]),
        isLoading.value ? (openBlock(), createElementBlock("p", _hoisted_31$1, "Retrieving list of Energy Advisors, please wait...")) : createCommentVNode("", true),
        createBaseVNode("table", _hoisted_32$1, [
          _hoisted_33$1,
          _hoisted_34$1,
          _hoisted_35$1,
          createBaseVNode("tbody", {
            class: normalizeClass(`page page--${currentPage.value}`)
          }, [
            filteredPqeas.value.length === 0 && !isLoading.value ? (openBlock(), createElementBlock("tr", _hoisted_36$1, _hoisted_38$1)) : createCommentVNode("", true),
            isLoading.value ? (openBlock(), createElementBlock("tr", _hoisted_39$1, _hoisted_41$1)) : createCommentVNode("", true),
            pqeas.value.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(paginatedPqeas.value, (pqea, index) => {
              return openBlock(), createElementBlock("tr", {
                key: index,
                class: normalizeClass(`pqea result result--${index + 1} ${0 === (index + 1) % 2 ? `even` : `odd`}`),
                tabindex: "0"
              }, [
                createBaseVNode("td", _hoisted_42$1, [
                  pqea.details.company_website ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    class: "pqea__company external",
                    href: pqea.details.company_website,
                    target: "_blank",
                    title: pqea.details.company_name + " website, opens in a new tab/window."
                  }, toDisplayString(pqea.details.company_name ? pqea.details.company_name : "Website"), 9, _hoisted_43$1)) : (openBlock(), createElementBlock("span", _hoisted_44$1, toDisplayString(pqea.details.company_name ? pqea.details.company_name : "No company name provided"), 1)),
                  createBaseVNode("span", _hoisted_45$1, toDisplayString(pqea.details.company_location ? pqea.details.company_location : "Not provided"), 1)
                ]),
                createBaseVNode("td", _hoisted_46$1, [
                  createBaseVNode("p", null, toDisplayString(pqea.details.contact_name ? pqea.details.contact_name : "Not provided"), 1)
                ]),
                createBaseVNode("td", _hoisted_47$1, [
                  createBaseVNode("address", null, [
                    pqea.details.email ? (openBlock(), createElementBlock("a", {
                      key: 0,
                      class: "pqea__email",
                      href: "mailto:" + pqea.details.email
                    }, toDisplayString(pqea.details.email), 9, _hoisted_48$1)) : (openBlock(), createElementBlock("p", _hoisted_49$1, "No email provided")),
                    pqea.details.phone ? (openBlock(), createElementBlock("a", {
                      key: 2,
                      class: "pqea__telephone",
                      href: "tel:+1" + pqea.details.phone.replace(/-/g, "")
                    }, toDisplayString(pqea.details.phone), 9, _hoisted_50$1)) : (openBlock(), createElementBlock("p", _hoisted_51$1, "No phone number provided"))
                  ])
                ]),
                createBaseVNode("td", _hoisted_52$1, [
                  pqea.details.service_organization_name || pqea.details.service_organization_name_2 ? (openBlock(), createElementBlock("ul", _hoisted_53$1, [
                    pqea.details.service_organization_name ? (openBlock(), createElementBlock("li", _hoisted_54$1, [
                      pqea.details.service_organization_website ? (openBlock(), createElementBlock("a", {
                        key: 0,
                        href: pqea.details.service_organization_website,
                        class: "external",
                        target: "_blank",
                        title: pqea.details.service_organization_name + " website, opens in a new tab/window."
                      }, toDisplayString(pqea.details.service_organization_name), 9, _hoisted_55$1)) : (openBlock(), createElementBlock("span", _hoisted_56$1, toDisplayString(pqea.details.service_organization_name), 1))
                    ])) : createCommentVNode("", true),
                    pqea.details.service_organization_name_2 ? (openBlock(), createElementBlock("li", _hoisted_57$1, [
                      pqea.details.service_organization_website_2 ? (openBlock(), createElementBlock("a", {
                        key: 0,
                        href: pqea.details.service_organization_website_2,
                        class: "external",
                        target: "_blank",
                        title: pqea.details.service_organization_name_2 + " website, opens in a new tab/window."
                      }, toDisplayString(pqea.details.service_organization_name_2), 9, _hoisted_58$1)) : (openBlock(), createElementBlock("span", _hoisted_59$1, toDisplayString(pqea.details.service_organization_name_2), 1))
                    ])) : createCommentVNode("", true),
                    pqea.details.additional_service_organizations ? (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(pqea.details.additional_service_organizations, (org, index2) => {
                      return openBlock(), createElementBlock("li", { key: index2 }, [
                        org[1] ? (openBlock(), createElementBlock("a", {
                          key: 0,
                          href: org[1],
                          class: "external",
                          target: "_blank",
                          title: org[0] + " website, opens in a new tab/window."
                        }, toDisplayString(org[0]), 9, _hoisted_60$1)) : (openBlock(), createElementBlock("span", _hoisted_61$1, toDisplayString(org[0]), 1))
                      ]);
                    }), 128)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ]),
                createBaseVNode("td", _hoisted_62$1, [
                  pqea.services ? (openBlock(), createElementBlock("p", _hoisted_63$1, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(pqea.services, (service, services_index) => {
                      return openBlock(), createElementBlock("span", {
                        class: normalizeClass(`pqea__service pqea__service--${service.name.replace(/ /g, "-").toLowerCase()}`)
                      }, [
                        createTextVNode(toDisplayString(service.name), 1),
                        services_index != Object.keys(pqea.services).length - 1 ? (openBlock(), createElementBlock("span", _hoisted_64$1, ", ")) : createCommentVNode("", true)
                      ], 2);
                    }), 256))
                  ])) : createCommentVNode("", true)
                ])
              ], 2);
            }), 128)) : createCommentVNode("", true)
          ], 2)
        ]),
        createBaseVNode("div", _hoisted_65$1, [
          createBaseVNode("button", {
            class: "prevPage",
            onClick: withModifiers(prevPage, ["prevent"]),
            disabled: currentPage.value === 1,
            tabindex: "0",
            type: "button"
          }, "Previous Page", 8, _hoisted_66$1),
          createBaseVNode("span", _hoisted_67$1, [
            createTextVNode("Page "),
            createBaseVNode("span", _hoisted_68$1, toDisplayString(currentPage.value), 1),
            createTextVNode(" of "),
            createBaseVNode("span", _hoisted_69$1, toDisplayString(totalPages.value), 1)
          ]),
          createBaseVNode("button", {
            class: "nextPage",
            onClick: withModifiers(nextPage, ["prevent"]),
            disabled: currentPage.value === totalPages.value,
            tabindex: "0",
            type: "button"
          }, "Next Page", 8, _hoisted_70),
          createBaseVNode("div", _hoisted_71, [
            createTextVNode(" Showing "),
            createBaseVNode("span", _hoisted_72, [
              createBaseVNode("span", _hoisted_73, toDisplayString(paginatedPqeas.value.length), 1),
              createTextVNode(" of "),
              createBaseVNode("span", _hoisted_74, toDisplayString(filteredPqeas.value.length), 1)
            ]),
            createTextVNode(" Energy Advisors ")
          ])
        ])
      ], 64);
    };
  }
};
const PQEAFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3bd33005"]]);
const contractorVueApp_vue_vue_type_style_index_0_scoped_85a4de20_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-85a4de20"), n = n(), popScopeId(), n);
const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("h2", { class: "sr-only" }, "Contractor Listings", -1));
const _hoisted_2 = {
  class: "contractorsFilterControls",
  id: "contractorsFilterControls"
};
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("label", {
  for: "typeSelect",
  class: "sr-only"
}, "Choose a type of upgrade", -1));
const _hoisted_4 = { class: "custom-select" };
const _hoisted_5 = ["onClick", "onKeyup"];
const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("option", { value: "all" }, "All Upgrade Types", -1));
const _hoisted_7 = ["value"];
const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("label", {
  for: "programSelect",
  class: "sr-only"
}, "Choose a rebate program", -1));
const _hoisted_9 = { class: "custom-select" };
const _hoisted_10 = ["onClick", "onKeyup"];
const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("option", { value: "all" }, "All Programs", -1));
const _hoisted_12 = ["value"];
const _hoisted_13 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("label", {
  for: "locationSelect",
  class: "sr-only"
}, "Choose a service region", -1));
const _hoisted_14 = { class: "custom-select" };
const _hoisted_15 = ["onClick", "onKeyup"];
const _hoisted_16 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("option", { value: "all" }, "All Locations", -1));
const _hoisted_17 = ["value"];
const _hoisted_18 = ["onClick", "onKeydown"];
const _hoisted_19 = { class: "contractorsFilterPagination contractors-filter__pagination contractors-filter__pagination--top" };
const _hoisted_20 = ["onClick", "disabled"];
const _hoisted_21 = { class: "pages" };
const _hoisted_22 = { class: "numValue current-page" };
const _hoisted_23 = { class: "numValue total-pages" };
const _hoisted_24 = ["onClick", "disabled"];
const _hoisted_25 = { class: "totals" };
const _hoisted_26 = { class: "results-count" };
const _hoisted_27 = { class: "numValue paginated-contractors" };
const _hoisted_28 = { class: "numValue filtered-contractors" };
const _hoisted_29 = { class: "sr-status sr-only" };
const _hoisted_30 = {
  class: "results-count",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_31 = { class: "numValue paginated-contractors" };
const _hoisted_32 = { class: "numValue filtered-contractors" };
const _hoisted_33 = {
  class: "pages",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_34 = { class: "numValue current-page" };
const _hoisted_35 = { class: "numValue total-pages" };
const _hoisted_36 = {
  key: 0,
  class: "no-results loading",
  "aria-live": "polite"
};
const _hoisted_37 = {
  id: "contractorsResults",
  class: "contractorsResults table table--striped"
};
const _hoisted_38 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("caption", { class: "sr-only" }, "Registered Contractors", -1));
const _hoisted_39 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("colgroup", null, [
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--1 odd col--contractor__company-and-location" }),
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--2 even col--contractor__head-office" }),
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--3 odd col--contractor__email-and-phone" }),
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--4 even col--contractor__upgrade-types" }),
  /* @__PURE__ */ createBaseVNode("col", { class: "col col--5 odd col--contractor__program-designations" })
], -1));
const _hoisted_40 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", { class: "contractor-heading odd contractor-heading--company-and-location" }, "Company Name"),
    /* @__PURE__ */ createBaseVNode("th", { class: "contractor-heading even contractor-heading--contact-name" }, "Head Office"),
    /* @__PURE__ */ createBaseVNode("th", { class: "contractor-heading odd contractor-heading--email-and-phone" }, "Email & Phone"),
    /* @__PURE__ */ createBaseVNode("th", { class: "contractor-heading even contractor-heading--service-organizations" }, "Upgrade Type(s)"),
    /* @__PURE__ */ createBaseVNode("th", { class: "contractor-heading odd contractor-heading--services" }, "Rebate Program(s)")
  ])
], -1));
const _hoisted_41 = {
  key: 0,
  class: "no-results"
};
const _hoisted_42 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("td", { colspan: "100%" }, [
  /* @__PURE__ */ createBaseVNode("p", {
    class: "no-results",
    "aria-live": "polite"
  }, "Sorry, no results found.")
], -1));
const _hoisted_43 = [
  _hoisted_42
];
const _hoisted_44 = {
  key: 1,
  class: "is-loading",
  "aria-live": "polite"
};
const _hoisted_45 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("td", { colspan: "100%" }, [
  /* @__PURE__ */ createBaseVNode("p", { class: "" }, "Loading...")
], -1));
const _hoisted_46 = [
  _hoisted_45
];
const _hoisted_47 = {
  "data-label": "Company Name and Head Office",
  class: "contractor__company-and-location"
};
const _hoisted_48 = ["href", "title"];
const _hoisted_49 = {
  key: 1,
  class: "contractor__company"
};
const _hoisted_50 = {
  "data-label": "Head Office",
  class: "contractor__head-office"
};
const _hoisted_51 = {
  "data-label": "Contact Email and Phone",
  class: "contractor__email-and-phone"
};
const _hoisted_52 = ["href"];
const _hoisted_53 = {
  key: 1,
  class: "contractor__email"
};
const _hoisted_54 = ["href"];
const _hoisted_55 = {
  key: 3,
  class: "contractor__telephone"
};
const _hoisted_56 = {
  "data-label": "Business Type(s)",
  class: "contractor__upgrade-types"
};
const _hoisted_57 = { key: 0 };
const _hoisted_58 = {
  "data-label": "Program Designations",
  class: "contractor__program-designations"
};
const _hoisted_59 = { key: 0 };
const _hoisted_60 = { class: "contractorsFilterPagination contractors-filter__pagination contractors-filter__pagination--bottom" };
const _hoisted_61 = ["onClick", "disabled"];
const _hoisted_62 = { class: "pages" };
const _hoisted_63 = { class: "numValue current-page" };
const _hoisted_64 = { class: "numValue total-pages" };
const _hoisted_65 = ["onClick", "disabled"];
const _hoisted_66 = { class: "totals" };
const _hoisted_67 = { class: "results-count" };
const _hoisted_68 = { class: "numValue paginated-contractors" };
const _hoisted_69 = { class: "numValue filtered-contractors" };
const _sfc_main = {
  __name: "contractorVueApp",
  setup(__props) {
    var _a;
    const contractors = ref([]);
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
      "contractorsData",
      "contractorsTimestamp",
      "contractorsData",
      "contractorsTimestamp"
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
      return filteredContractors2;
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
    const prevPage = () => {
      return currentPage.value > 1 ? currentPage.value-- : null;
    };
    const nextPage = () => {
      return currentPage.value < totalPages.value ? currentPage.value++ : null;
    };
    const currentTypeFilterMessage = computed(() => {
      return defaultSelectedUpgradeType.value === selectedUpgradeType.value ? " no upgrade type selected." : " specializing in " + selectedUpgradeType.value.toLowerCase() + " upgrades";
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
      currentPage.value !== 1 ? handleUpdatingAnimationClass(".contractors-filter__pagination .pages") : null;
      currentPage.value = 1;
    };
    const resetSelectsActiveState = () => {
      let activeSelects = document.querySelectorAll("#contractorFilterApp .custom-select.is-active");
      1 <= activeSelects.length ? activeSelects.forEach((item) => {
        item.classList.remove("is-active");
      }) : null;
    };
    const selectIsActive = (event) => {
      return "click" !== event.type ? event.target.parentNode.classList.remove(activeClass.value) : event.target.parentNode.classList.toggle(activeClass.value);
    };
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
    const fetchData2 = async (offset = 0) => {
      try {
        isLoading.value = true;
        const cachedData = sessionStorage.getItem("contractorsData");
        const cachedTimestamp = sessionStorage.getItem("contractorsTimestamp");
        if (cachedData && cachedTimestamp) {
          const timeElapsed = Date.now() - parseInt(cachedTimestamp);
          const hoursElapsed = timeElapsed / (1e3 * 60 * 60);
          if (hoursElapsed < 24) {
            contractors.value = JSON.parse(cachedData);
            showLoadingMessage.value = false;
            isLoading.value = false;
            return;
          }
        }
        fetch(contractorsAPI, { cache: "no-store" }).then((r) => r.json()).then((json) => {
          setTimeout(itemsToClearFromSessionStorage.value.forEach((item) => {
            sessionStorage.removeItem(item);
          }), 1e3);
          sessionStorage.setItem("contractorsData", JSON.stringify(json));
          sessionStorage.setItem("contractorsTimestamp", Date.now());
          contractors.value = json;
          showLoadingMessage.value = false;
          isLoading.value = false;
        }).catch((error) => {
          console.error("Error fetching data:", error);
          throw error;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
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
        handleUpdatingAnimationClass(".contractors-filter__pagination .paginated-contractors");
      }
    });
    watch(filteredContractors, () => {
      if (oldFilteredContractorsCount.value !== filteredContractors.value.length) {
        oldFilteredContractorsCount.value = filteredContractors.value.length;
        handleUpdatingAnimationClass(".contractors-filter__pagination .filtered-contractors");
      }
    });
    watch(currentPage, () => {
      handleUpdatingAnimationClass(".contractors-filter__pagination .current-page");
    });
    watch(totalPages, () => {
      handleUpdatingAnimationClass(".contractors-filter__pagination .total-pages");
    });
    watch(isLoading, (e) => {
      console.log("isLoading");
      console.log(e);
    });
    watch([selectedUpgradeType, selectedProgram, selectedLocation], () => {
      currentPage.value = 1;
    });
    window.addEventListener("click", (event) => {
      !event.target.closest(".custom-select.is-active") ? resetSelectsActiveState() : null;
    });
    onMounted(() => {
      var _a2;
      fetchData2();
      document.getElementById("contractorFilterApp");
      showLoadingMessage.value = true;
      if ((_a2 = window.site) == null ? void 0 : _a2.domain)
        ;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        _hoisted_1,
        createBaseVNode("div", _hoisted_2, [
          _hoisted_3,
          createBaseVNode("div", _hoisted_4, [
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
              _hoisted_6,
              (openBlock(true), createElementBlock(Fragment, null, renderList(types.value, (type, index) => {
                return openBlock(), createElementBlock("option", {
                  key: type,
                  value: type
                }, toDisplayString(type), 9, _hoisted_7);
              }), 128))
            ], 40, _hoisted_5), [
              [vModelSelect, selectedUpgradeType.value]
            ])
          ]),
          _hoisted_8,
          createBaseVNode("div", _hoisted_9, [
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
              _hoisted_11,
              (openBlock(true), createElementBlock(Fragment, null, renderList(programs.value, (program, index) => {
                return openBlock(), createElementBlock("option", {
                  key: program,
                  value: program
                }, toDisplayString(program), 9, _hoisted_12);
              }), 128))
            ], 40, _hoisted_10), [
              [vModelSelect, selectedProgram.value]
            ])
          ]),
          _hoisted_13,
          createBaseVNode("div", _hoisted_14, [
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
              _hoisted_16,
              (openBlock(true), createElementBlock(Fragment, null, renderList(locations.value, (location) => {
                return openBlock(), createElementBlock("option", {
                  key: location,
                  value: location
                }, toDisplayString(location), 9, _hoisted_17);
              }), 128))
            ], 40, _hoisted_15), [
              [vModelSelect, selectedLocation.value]
            ])
          ]),
          createBaseVNode("button", {
            class: "clear-filters",
            onClick: withModifiers(clearFilters, ["prevent"]),
            onTouchend: clearFilters,
            onKeydown: withKeys(withModifiers(clearFilters, ["prevent"]), ["enter"]),
            type: "button"
          }, " Reset selection ", 40, _hoisted_18),
          createBaseVNode("div", _hoisted_19, [
            createBaseVNode("button", {
              class: "prevPage",
              onClick: withModifiers(prevPage, ["prevent"]),
              disabled: currentPage.value === 1,
              tabindex: "0",
              type: "button"
            }, "Previous Page", 8, _hoisted_20),
            createBaseVNode("span", _hoisted_21, [
              createTextVNode("Page "),
              createBaseVNode("span", _hoisted_22, toDisplayString(currentPage.value), 1),
              createTextVNode(" of "),
              createBaseVNode("span", _hoisted_23, toDisplayString(totalPages.value), 1)
            ]),
            createBaseVNode("button", {
              class: "nextPage",
              onClick: withModifiers(nextPage, ["prevent"]),
              disabled: currentPage.value === totalPages.value,
              tabindex: "0",
              type: "button"
            }, "Next Page", 8, _hoisted_24),
            createBaseVNode("div", _hoisted_25, [
              createTextVNode(" Showing "),
              createBaseVNode("span", _hoisted_26, [
                createBaseVNode("span", _hoisted_27, toDisplayString(paginatedContractors.value.length), 1),
                createTextVNode(" of "),
                createBaseVNode("span", _hoisted_28, toDisplayString(filteredContractors.value.length), 1)
              ]),
              createTextVNode(" registered contractors ")
            ]),
            createBaseVNode("span", _hoisted_29, [
              createBaseVNode("span", _hoisted_30, [
                createTextVNode("Showing "),
                createBaseVNode("span", _hoisted_31, toDisplayString(paginatedContractors.value.length), 1),
                createTextVNode(" of "),
                createBaseVNode("span", _hoisted_32, toDisplayString(filteredContractors.value.length), 1),
                createTextVNode(" registered contractors " + toDisplayString(currentTypeFilterMessage.value) + " " + toDisplayString(currentLocationFilterMessage.value), 1)
              ]),
              createBaseVNode("span", _hoisted_33, [
                createTextVNode("Page "),
                createBaseVNode("span", _hoisted_34, toDisplayString(currentPage.value), 1),
                createTextVNode(" of "),
                createBaseVNode("span", _hoisted_35, toDisplayString(totalPages.value), 1)
              ])
            ])
          ])
        ]),
        isLoading.value ? (openBlock(), createElementBlock("p", _hoisted_36, "Retrieving list of registered contractors, please wait...")) : createCommentVNode("", true),
        createBaseVNode("table", _hoisted_37, [
          _hoisted_38,
          _hoisted_39,
          _hoisted_40,
          createBaseVNode("tbody", {
            class: normalizeClass(`page page--${currentPage.value}`)
          }, [
            filteredContractors.value.length === 0 && !isLoading.value ? (openBlock(), createElementBlock("tr", _hoisted_41, _hoisted_43)) : createCommentVNode("", true),
            isLoading.value ? (openBlock(), createElementBlock("tr", _hoisted_44, _hoisted_46)) : createCommentVNode("", true),
            contractors.value.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(paginatedContractors.value, (contractor, index) => {
              return openBlock(), createElementBlock("tr", {
                key: index,
                class: normalizeClass(`contractor result result--${index + 1} ${0 === (index + 1) % 2 ? `even` : `odd`}`),
                tabindex: "0"
              }, [
                createBaseVNode("td", _hoisted_47, [
                  contractor.company_website ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    class: "contractor__company external",
                    href: contractor.company_website,
                    target: "_blank",
                    title: contractor.company_name + " website, opens in a new tab/window."
                  }, toDisplayString(contractor.company_name ? contractor.company_name : "Website"), 9, _hoisted_48)) : (openBlock(), createElementBlock("span", _hoisted_49, toDisplayString(contractor.company_name ? contractor.company_name : "No company name provided"), 1))
                ]),
                createBaseVNode("td", _hoisted_50, [
                  createBaseVNode("p", null, toDisplayString(contractor.head_office_location ? contractor.head_office_location : "Not provided"), 1)
                ]),
                createBaseVNode("td", _hoisted_51, [
                  createBaseVNode("address", null, [
                    contractor.email ? (openBlock(), createElementBlock("a", {
                      key: 0,
                      class: "contractor__email",
                      href: "mailto:" + contractor.email
                    }, toDisplayString(contractor.email), 9, _hoisted_52)) : (openBlock(), createElementBlock("p", _hoisted_53, "No email provided")),
                    contractor.phone ? (openBlock(), createElementBlock("a", {
                      key: 2,
                      class: "contractor__telephone",
                      href: "tel:+1" + contractor.phone.replace(/-/g, "")
                    }, toDisplayString(contractor.phone), 9, _hoisted_54)) : (openBlock(), createElementBlock("p", _hoisted_55, "No phone number provided"))
                  ])
                ]),
                createBaseVNode("td", _hoisted_56, [
                  contractor.types ? (openBlock(), createElementBlock("ul", _hoisted_57, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(contractor.types, (type, index2) => {
                      return openBlock(), createElementBlock("li", null, toDisplayString(type.name), 1);
                    }), 256))
                  ])) : createCommentVNode("", true)
                ]),
                createBaseVNode("td", _hoisted_58, [
                  contractor.program_designations ? (openBlock(), createElementBlock("ul", _hoisted_59, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(contractor.program_designations, (designation, index2) => {
                      return openBlock(), createElementBlock("li", null, toDisplayString(designation.name), 1);
                    }), 256))
                  ])) : createCommentVNode("", true)
                ])
              ], 2);
            }), 128)) : createCommentVNode("", true)
          ], 2)
        ]),
        createBaseVNode("div", _hoisted_60, [
          createBaseVNode("button", {
            class: "prevPage",
            onClick: withModifiers(prevPage, ["prevent"]),
            disabled: currentPage.value === 1,
            tabindex: "0",
            type: "button"
          }, "Previous Page", 8, _hoisted_61),
          createBaseVNode("span", _hoisted_62, [
            createTextVNode("Page "),
            createBaseVNode("span", _hoisted_63, toDisplayString(currentPage.value), 1),
            createTextVNode(" of "),
            createBaseVNode("span", _hoisted_64, toDisplayString(totalPages.value), 1)
          ]),
          createBaseVNode("button", {
            class: "nextPage",
            onClick: withModifiers(nextPage, ["prevent"]),
            disabled: currentPage.value === totalPages.value,
            tabindex: "0",
            type: "button"
          }, "Next Page", 8, _hoisted_65),
          createBaseVNode("div", _hoisted_66, [
            createTextVNode(" Showing "),
            createBaseVNode("span", _hoisted_67, [
              createBaseVNode("span", _hoisted_68, toDisplayString(paginatedContractors.value.length), 1),
              createTextVNode(" of "),
              createBaseVNode("span", _hoisted_69, toDisplayString(filteredContractors.value.length), 1)
            ]),
            createTextVNode(" Contractors ")
          ])
        ])
      ], 64);
    };
  }
};
const ContractorFilterApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-85a4de20"]]);
const bcgovBlockThemePluginMain = () => {
  const postFilterAppElement = document.querySelector("#postFilterApp");
  const VehicleFilterAppElement = document.querySelector("#vehicleFilterApp");
  const PQEAFilterAppElement = document.querySelector("#pqeaFilterApp");
  const ContractorFilterAppElement = document.querySelector("#contractorFilterApp");
  const initVueApp = (appComponent, selector, attributes) => {
    if (window.vueInstance && window.vueInstance.component === appComponent) {
      window.vueInstance.unmount();
    }
    appComponent.props = attributes;
    window.vueInstance = createApp(appComponent);
    window.vueInstance.mount(selector);
    window.vueInstance.component = appComponent;
  };
  if (postFilterAppElement) {
    initVueApp(PostFilterApp, postFilterAppElement);
  }
  if (VehicleFilterAppElement) {
    initVueApp(VehicleFilterApp, VehicleFilterAppElement);
  }
  if (PQEAFilterAppElement) {
    initVueApp(PQEAFilterApp, PQEAFilterAppElement);
  }
  if (ContractorFilterAppElement) {
    initVueApp(ContractorFilterApp, ContractorFilterAppElement);
  }
};
function addSafeEventListenerPlugin(el, event, handler, options) {
  if (el && typeof el.addEventListener === "function") {
    el.addEventListener(event, handler, options);
  } else {
    console.warn(
      "el is not a valid EventTarget or does not support addEventListener"
    );
  }
}
if ("complete" === document.readyState) {
  bcgovBlockThemePluginMain();
} else {
  addSafeEventListenerPlugin(
    document,
    "DOMContentLoaded",
    bcgovBlockThemePluginMain()
  );
}
