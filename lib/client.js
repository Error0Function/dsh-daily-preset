window.__ModuleLoader__.load({id:"dsh-daily-mode",factory:(require)=>{var module={exports:{}};var exports=module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/locales.ts
var en = {
  nav: "Daily mode",
  model: "Child agent model",
  inherit: "Inherit parent model and effort",
  description: "Choose from configured models. Output limits and context size use the selected model settings.",
  timing: "Changes apply when a child starts its next run, including existing sessions. Active runs keep their current model and effort until they finish.",
  effort: "Reasoning effort",
  defaultEffort: "Model default",
  missing: "The selected model or effort is unavailable. Choose an available option.",
  unavailable: "These settings cannot be edited through this connection.",
  loadFailed: "Unable to load models",
  partial: "Some model providers could not be loaded.",
  retry: "Retry",
  saved: "Daily mode settings saved",
  saveFailed: "Unable to save settings",
  loading: "Loading daily mode settings"
};
var zh = {
  nav: "\u65E5\u7528\u6A21\u5F0F",
  model: "\u5B50 Agent \u6A21\u578B",
  inherit: "\u7EE7\u627F\u4E3B Agent \u7684\u6A21\u578B\u548C effort",
  description: "\u4ECE\u5DF2\u914D\u7F6E\u7684\u6A21\u578B\u4E2D\u9009\u62E9\u3002\u8F93\u51FA\u4E0A\u9650\u548C\u4E0A\u4E0B\u6587\u5927\u5C0F\u6CBF\u7528\u6240\u9009\u6A21\u578B\u7684\u8BBE\u7F6E\u3002",
  timing: "\u4FEE\u6539\u5728\u5B50 Agent \u4E0B\u4E00\u6B21\u5F00\u59CB\u8FD0\u884C\u65F6\u751F\u6548\uFF0C\u5DF2\u6709\u4F1A\u8BDD\u4E5F\u4F1A\u91C7\u7528\u65B0\u8BBE\u7F6E\u3002\u6B63\u5728\u8FD0\u884C\u7684\u5B50 Agent \u4FDD\u6301\u5F53\u524D\u6A21\u578B\u548C effort\uFF0C\u76F4\u5230\u672C\u6B21\u8FD0\u884C\u7ED3\u675F\u3002",
  effort: "\u63A8\u7406\u5F3A\u5EA6",
  defaultEffort: "\u6A21\u578B\u9ED8\u8BA4\u503C",
  missing: "\u6240\u9009\u6A21\u578B\u6216 effort \u5DF2\u4E0D\u53EF\u7528\uFF0C\u8BF7\u9009\u62E9\u53EF\u7528\u9009\u9879\u3002",
  unavailable: "\u5F53\u524D\u8FDE\u63A5\u65E0\u6CD5\u7F16\u8F91\u8FD9\u4E9B\u8BBE\u7F6E\u3002",
  loadFailed: "\u65E0\u6CD5\u52A0\u8F7D\u6A21\u578B\u5217\u8868",
  partial: "\u90E8\u5206\u6A21\u578B\u63D0\u4F9B\u65B9\u52A0\u8F7D\u5931\u8D25\u3002",
  retry: "\u91CD\u8BD5",
  saved: "\u65E5\u7528\u6A21\u5F0F\u8BBE\u7F6E\u5DF2\u4FDD\u5B58",
  saveFailed: "\u65E0\u6CD5\u4FDD\u5B58\u8BBE\u7F6E",
  loading: "\u6B63\u5728\u52A0\u8F7D\u65E5\u7528\u6A21\u5F0F\u8BBE\u7F6E"
};

// ../../../../../Program-Files-Portable/deepseek-harness/node_modules/.pnpm/zustand@4.4.7_@types+react@18.3.31_immer@10.2.0_react@18.3.1/node_modules/zustand/esm/vanilla.mjs
var import_meta = {};
var createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    if ((import_meta.env ? import_meta.env.MODE : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners.clear();
  };
  const api = { setState, getState, subscribe, destroy };
  state = createState(setState, getState, api);
  return api;
};
var createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

// ../../../../../Program-Files-Portable/deepseek-harness/node_modules/.pnpm/zustand@4.4.7_@types+react@18.3.31_immer@10.2.0_react@18.3.1/node_modules/zustand/esm/middleware.mjs
var subscribeWithSelectorImpl = (fn) => (set2, get, api) => {
  const origSubscribe = api.subscribe;
  api.subscribe = (selector, optListener, options) => {
    let listener = selector;
    if (optListener) {
      const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
      let currentSlice = selector(api.getState());
      listener = (state) => {
        const nextSlice = selector(state);
        if (!equalityFn(currentSlice, nextSlice)) {
          const previousSlice = currentSlice;
          optListener(currentSlice = nextSlice, previousSlice);
        }
      };
      if (options == null ? void 0 : options.fireImmediately) {
        optListener(currentSlice, currentSlice);
      }
    }
    return origSubscribe(listener);
  };
  const initialState = fn(set2, get, api);
  return initialState;
};
var subscribeWithSelector = subscribeWithSelectorImpl;

// ../../../../../Program-Files-Portable/deepseek-harness/node_modules/.pnpm/immer@10.2.0/node_modules/immer/dist/immer.mjs
var NOTHING = /* @__PURE__ */ Symbol.for("immer-nothing");
var DRAFTABLE = /* @__PURE__ */ Symbol.for("immer-draftable");
var DRAFT_STATE = /* @__PURE__ */ Symbol.for("immer-state");
var errors = true ? [
  // All error codes, starting by 0:
  function(plugin) {
    return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
  },
  function(thing) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
  },
  "This object has been frozen and should not be mutated",
  function(data) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(thing) {
    return `'current' expects a draft, got: ${thing}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(thing) {
    return `'original' expects a draft, got: ${thing}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function die(error, ...args) {
  if (true) {
    const e = errors[error];
    const msg = typeof e === "function" ? e.apply(null, args) : e;
    throw new Error(`[Immer] ${msg}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
  if (!value)
    return false;
  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!value.constructor?.[DRAFTABLE] || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
  if (!value || typeof value !== "object")
    return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype)
    return true;
  const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  if (Ctor === Object)
    return true;
  if (typeof Ctor !== "function")
    return false;
  let ctorString = cachedCtorStrings.get(Ctor);
  if (ctorString === void 0) {
    ctorString = Function.toString.call(Ctor);
    cachedCtorStrings.set(Ctor, ctorString);
  }
  return ctorString === objectCtorString;
}
function each(obj, iter, strict = true) {
  if (getArchtype(obj) === 0) {
    const keys = strict ? Reflect.ownKeys(obj) : Object.keys(obj);
    keys.forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
function has(thing, prop) {
  return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}
function set(thing, propOrOldValue, value) {
  const t = getArchtype(thing);
  if (t === 2)
    thing.set(propOrOldValue, value);
  else if (t === 3) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
}
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
function isMap(target) {
  return target instanceof Map;
}
function isSet(target) {
  return target instanceof Set;
}
function latest(state) {
  return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (Array.isArray(base))
    return Array.prototype.slice.call(base);
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = Object.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc.writable === false) {
        desc.writable = true;
        desc.configurable = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          configurable: true,
          writable: true,
          // could live with !!desc.set as well here...
          enumerable: desc.enumerable,
          value: base[key]
        };
    }
    return Object.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return { ...base };
    }
    const obj = Object.create(proto);
    return Object.assign(obj, base);
  }
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    Object.defineProperties(obj, {
      set: dontMutateMethodOverride,
      add: dontMutateMethodOverride,
      clear: dontMutateMethodOverride,
      delete: dontMutateMethodOverride
    });
  }
  Object.freeze(obj);
  if (deep)
    Object.values(obj).forEach((value) => freeze(value, true));
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
var dontMutateMethodOverride = {
  value: dontMutateFrozenCollections
};
function isFrozen(obj) {
  if (obj === null || typeof obj !== "object")
    return true;
  return Object.isFrozen(obj);
}
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
var currentScope;
function getCurrentScope() {
  return currentScope;
}
function createScope(parent_, immer_) {
  return {
    drafts_: [],
    parent_,
    immer_,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: true,
    unfinalizedDrafts_: 0
  };
}
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    getPlugin("Patches");
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
function enterScope(immer2) {
  return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 || state.type_ === 1)
    state.revoke_();
  else
    state.revoked_ = true;
}
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
      if (!scope.parent_)
        maybeFreeze(scope, result);
    }
    if (scope.patches_) {
      getPlugin("Patches").generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope.patches_,
        scope.inversePatches_
      );
    }
  } else {
    result = finalize(scope, baseDraft, []);
  }
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value, path) {
  if (isFrozen(value))
    return value;
  const useStrictIteration = rootScope.immer_.shouldUseStrictIteration();
  const state = value[DRAFT_STATE];
  if (!state) {
    each(
      value,
      (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path),
      useStrictIteration
    );
    return value;
  }
  if (state.scope_ !== rootScope)
    return value;
  if (!state.modified_) {
    maybeFreeze(rootScope, state.base_, true);
    return state.base_;
  }
  if (!state.finalized_) {
    state.finalized_ = true;
    state.scope_.unfinalizedDrafts_--;
    const result = state.copy_;
    let resultEach = result;
    let isSet2 = false;
    if (state.type_ === 3) {
      resultEach = new Set(result);
      result.clear();
      isSet2 = true;
    }
    each(
      resultEach,
      (key, childValue) => finalizeProperty(
        rootScope,
        state,
        result,
        key,
        childValue,
        path,
        isSet2
      ),
      useStrictIteration
    );
    maybeFreeze(rootScope, result, false);
    if (path && rootScope.patches_) {
      getPlugin("Patches").generatePatches_(
        state,
        path,
        rootScope.patches_,
        rootScope.inversePatches_
      );
    }
  }
  return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
  if (childValue == null) {
    return;
  }
  if (typeof childValue !== "object" && !targetIsSet) {
    return;
  }
  const childIsFrozen = isFrozen(childValue);
  if (childIsFrozen && !targetIsSet) {
    return;
  }
  if (childValue === targetObject)
    die(5);
  if (isDraft(childValue)) {
    const path = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
    const res = finalize(rootScope, childValue, path);
    set(targetObject, prop, res);
    if (isDraft(res)) {
      rootScope.canAutoFreeze_ = false;
    } else
      return;
  } else if (targetIsSet) {
    targetObject.add(childValue);
  }
  if (isDraftable(childValue) && !childIsFrozen) {
    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
      return;
    }
    if (parentState && parentState.base_ && parentState.base_[prop] === childValue && childIsFrozen) {
      return;
    }
    finalize(rootScope, childValue);
    if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && (isMap(targetObject) ? targetObject.has(prop) : Object.prototype.propertyIsEnumerable.call(targetObject, prop)))
      maybeFreeze(rootScope, childValue);
  }
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}
function createProxyProxy(base, parent) {
  const isArray = Array.isArray(base);
  const state = {
    type_: isArray ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false
  };
  let target = state;
  let traps = objectTraps;
  if (isArray) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return proxy;
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    const source = latest(state);
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      return state.copy_[prop] = createProxy(value, state);
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc?.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2?.[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_[prop] = false;
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_[prop] = true;
    return true;
  },
  deleteProperty(state, prop) {
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_[prop] = false;
      prepareCopy(state);
      markChanged(state);
    } else {
      delete state.assigned_[prop];
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      writable: true,
      configurable: state.type_ !== 1 || prop !== "length",
      enumerable: desc.enumerable,
      value: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
each(objectTraps, (key, fn) => {
  arrayTraps[key] = function() {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});
arrayTraps.deleteProperty = function(state, prop) {
  if (isNaN(parseInt(prop)))
    die(13);
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  if (prop !== "length" && isNaN(parseInt(prop)))
    die(14);
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  const desc = getDescriptorFromProto(source, prop);
  return desc ? `value` in desc ? desc.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    desc.get?.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}
var Immer2 = class {
  constructor(config) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    this.useStrictIteration_ = true;
    this.produce = (base, recipe, patchListener) => {
      if (typeof base === "function" && typeof recipe !== "function") {
        const defaultBase = recipe;
        recipe = base;
        const self = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (typeof recipe !== "function")
        die(6);
      if (patchListener !== void 0 && typeof patchListener !== "function")
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || typeof base !== "object") {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p = [];
          const ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
          patchListener(p, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (typeof base === "function") {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p, ip) => {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (typeof config?.autoFreeze === "boolean")
      this.setAutoFreeze(config.autoFreeze);
    if (typeof config?.useStrictShallowCopy === "boolean")
      this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    if (typeof config?.useStrictIteration === "boolean")
      this.setUseStrictIteration(config.useStrictIteration);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(value) {
    this.useStrictIteration_ = value;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin("Patches").applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(value, parent) {
  const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = parent ? parent.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  let strict = true;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    strict = state.scope_.immer_.shouldUseStrictIteration();
  } else {
    copy = shallowCopy(value, true);
  }
  each(
    copy,
    (key, childValue) => {
      set(copy, key, currentImpl(childValue));
    },
    strict
  );
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}
var immer = new Immer2();
var produce = immer.produce;

// ../../../../../Program-Files-Portable/deepseek-harness/packages/client/store/lib/index.js
function notifySubscribers(listeners, label, ...args) {
  for (const listener of [...listeners]) try {
    listener(...args);
  } catch (error) {
    console.error(`${label} subscriber failed:`, error);
  }
}
function rafBatch(notify) {
  const schedule = typeof requestAnimationFrame === "function" ? (fn) => {
    requestAnimationFrame(() => {
      fn();
    });
  } : (fn) => {
    queueMicrotask(fn);
  };
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    schedule(() => {
      scheduled = false;
      notify();
    });
  };
}
function createSnapshotStore(init, opts) {
  const withSelector = subscribeWithSelector(() => init);
  const api = createStore()(withSelector);
  if (opts?.persist) attachPersistence(api, opts.persist.name);
  let subscribe = (fn) => api.subscribe(() => {
    notifySubscribers([fn], "[client-store]");
  });
  if (opts?.flush === "raf") {
    const listeners = /* @__PURE__ */ new Set();
    const flush = rafBatch(() => {
      notifySubscribers(listeners, "[client-store]");
    });
    api.subscribe(flush);
    subscribe = (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    };
  }
  return {
    getSnapshot: () => api.getState(),
    subscribe: (fn) => subscribe(fn),
    update: (mutator) => {
      api.setState(produce(api.getState(), (draft) => {
        mutator(draft);
      }), true);
    },
    set: (next) => {
      api.setState(devFreeze(next), true);
    }
  };
}
function attachPersistence(api, name) {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(name);
    if (raw !== null) api.setState(devFreeze(JSON.parse(raw)), true);
  } catch (error) {
    console.error(`snapshot store '${name}' rehydration failed:`, error);
  }
  api.subscribe((state) => {
    try {
      localStorage.setItem(name, JSON.stringify(state));
    } catch (error) {
      console.error(`snapshot store '${name}' persistence failed:`, error);
    }
  });
}
function devFreeze(value) {
  return freeze(value, true);
}

// src/client-effects.tsx
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime = require("react/jsx-runtime");
function OperationNotice({ useNotice, dismiss, icon }) {
  const notice = useNotice((value) => value);
  return notice === null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_dsh_client_ui_primitives.Toast,
    {
      text: notice.text,
      onDone: dismiss,
      ...icon === void 0 ? {} : { icon }
    },
    notice.seq
  );
}
function registerStyles(ctx, css, label) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
    return () => style.remove();
  }, label);
}
function registerNotice(ctx, id, icon) {
  const notices = createSnapshotStore(null);
  let seq = 0;
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id,
    inject: () => ({ hooks: { notice: notices }, dismiss: () => {
      notices.set(null);
    }, ...icon === void 0 ? {} : { icon } })
  }, OperationNotice));
  return (text) => {
    notices.set({ text, seq: ++seq });
  };
}

// src/styles.ts
var styles = `
.dsh-daily-settings{display:flex;flex-direction:column;gap:12px;width:100%;max-width:720px;font-size:13px;line-height:18px}
.dsh-daily-card{display:flex;flex-direction:column;gap:10px;padding:16px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-settings-card-fill)}
.dsh-daily-label{font-weight:500}
.dsh-daily-description{color:var(--dsw-alias-label-secondary)}
.dsh-daily-select{box-sizing:border-box;width:100%;min-height:32px;padding:6px 10px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-settings-card-fill);color:var(--dsw-alias-label-primary);font:inherit}
.dsh-daily-select:focus-visible{outline:2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));outline-offset:2px}
.dsh-daily-error{color:var(--dsw-alias-state-error-primary);overflow-wrap:anywhere}
.dsh-daily-loading{display:flex;align-items:center;justify-content:center;min-height:140px}
`;

// src/client.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var NS = "settings.daily";
var inject = ["slots", "locale", "remote", "remote.session", "configForms"];
function DailySettings({ form, loadCatalog, watchCatalog, notify, t, renderSlot }) {
  const subscribe = (0, import_react.useCallback)((listener) => form.subscribe(listener), [form]);
  const getSnapshot = (0, import_react.useCallback)(() => form.getSnapshot(), [form]);
  const snapshot = (0, import_react.useSyncExternalStore)(subscribe, getSnapshot);
  const [catalog, setCatalog] = (0, import_react.useState)();
  const [error, setError] = (0, import_react.useState)();
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [reload, setReload] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    let active = true;
    let generation = 0;
    const refresh = () => {
      const current2 = ++generation;
      void loadCatalog().then((value) => {
        if (active && current2 === generation) {
          setCatalog(value);
          setError(void 0);
        }
      }).catch((failure) => {
        if (active && current2 === generation) setError(failure instanceof Error ? failure.message : String(failure));
      });
    };
    refresh();
    const dispose = watchCatalog(refresh);
    return () => {
      active = false;
      dispose();
    };
  }, [loadCatalog, watchCatalog, reload]);
  const choice = snapshot.value?.childModel ?? null;
  const options = catalog?.groups.flatMap((group) => group.models.map((model) => ({ group, model, key: JSON.stringify([group.id, model.id]) }))) ?? [];
  const selected = choice === null ? void 0 : options.find((option) => option.group.id === choice.provider && option.model.id === choice.model);
  const efforts = selected?.model.reasoning?.efforts ?? [];
  const missing = choice !== null && catalog !== void 0 && (selected === void 0 || choice.effort !== void 0 && !efforts.some((effort) => effort.id === choice.effort));
  const writable = snapshot.status === "ready" && snapshot.writable && !busy;
  const save = async (value) => {
    setBusy(true);
    try {
      if (!await form.set("childModel", value)) throw new Error(t("saveFailed"));
      notify(t("saved"));
    } catch (failure) {
      notify(`${t("saveFailed")}: ${failure instanceof Error ? failure.message : String(failure)}`);
    } finally {
      setBusy(false);
    }
  };
  if (snapshot.status === "loading" || catalog === void 0 && error === void 0) return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh-daily-loading", "aria-label": t("loading"), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.StateDot, { state: "ongoing" }) });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-daily-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "dsh-daily-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh-daily-label", htmlFor: "dsh-daily-model", children: t("model") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh-daily-description", children: t("description") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "select",
        {
          id: "dsh-daily-model",
          className: "dsh-daily-select",
          disabled: !writable || catalog === void 0,
          value: choice === null ? "" : JSON.stringify([choice.provider, choice.model]),
          onChange: (event) => {
            const option = options.find((value) => value.key === event.currentTarget.value);
            void save(option === void 0 ? null : { provider: option.group.id, model: option.model.id });
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", children: t("inherit") }),
            choice !== null && selected === void 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("option", { value: JSON.stringify([choice.provider, choice.model]), disabled: true, children: [
              choice.provider,
              " / ",
              choice.model
            ] }),
            catalog?.groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("optgroup", { label: group.name, children: options.filter((option) => option.group.id === group.id).map((option) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: option.key, children: option.model.name }, option.key)) }, group.id))
          ]
        }
      ),
      choice !== null && efforts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh-daily-label", htmlFor: "dsh-daily-effort", children: t("effort") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "select",
          {
            id: "dsh-daily-effort",
            className: "dsh-daily-select",
            disabled: !writable,
            value: choice.effort ?? "",
            onChange: (event) => {
              const effort = event.currentTarget.value;
              void save({ provider: choice.provider, model: choice.model, ...effort === "" ? {} : { effort } });
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", children: t("defaultEffort") }),
              choice.effort !== void 0 && !efforts.some((effort) => effort.id === choice.effort) && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: choice.effort, disabled: true, children: choice.effort }),
              efforts.map((effort) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: effort.id, children: effort.name }, effort.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh-daily-description", children: t("timing") }),
      missing && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { role: "alert", className: "dsh-daily-error", children: t("missing") }),
      snapshot.status === "unavailable" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { role: "alert", children: t("unavailable") }),
      error !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { role: "alert", className: "dsh-daily-error", children: [
        t("loadFailed"),
        ": ",
        error,
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.Button, { size: "sm", onClick: () => setReload((value) => value + 1), children: t("retry") })
      ] }),
      catalog !== void 0 && catalog.failures.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-daily-description", children: [
        t("partial"),
        " ",
        catalog.failures.map((failure) => `${failure.name}: ${failure.message}`).join("; ")
      ] })
    ] }),
    renderSlot("settings.daily.item", {})
  ] });
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { en, zh }));
  const notify = registerNotice(ctx, "daily-mode.notice");
  const loadCatalog = async () => {
    const result = await ctx.remote.session.modelCatalog();
    if (!result.ok) throw new Error(result.error.message);
    return result.value;
  };
  const watchCatalog = (refresh) => {
    const disposers = [
      ctx.remote.$on("llm/adapters-updated", refresh),
      ctx.remote.$on("settings/document-updated", refresh),
      ctx.remote.$on("credentials/record-updated", refresh),
      ctx.remote.$on("credentials/reference-updated", refresh),
      ctx.on("connection/reset", refresh)
    ];
    return () => {
      for (const dispose of disposers) dispose();
    };
  };
  registerStyles(ctx, styles);
  const t = ctx.locale.bind(NS);
  const form = ctx.configForms.get("daily-mode-settings");
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "daily-mode",
    order: 15,
    label: () => t("nav"),
    locale: NS,
    inject: () => ({ form, loadCatalog, watchCatalog, notify }),
    children: { "settings.daily.item": { kind: "list", scope: "root" } }
  }, DailySettings));
}

return module.exports;}});
