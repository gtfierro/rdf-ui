
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4);
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function getArrayJsValueFromWasm0(ptr, len) {
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
/**
*/
export class BlankNode {

    static __wrap(ptr) {
        const obj = Object.create(BlankNode.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_blanknode_free(ptr);
    }
    /**
    * @returns {string}
    */
    get termType() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.blanknode_term_type(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.blanknode_value(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {any} other
    * @returns {boolean}
    */
    equals(other) {
        try {
            var ret = wasm.blanknode_equals(this.ptr, addBorrowedObject(other));
            return ret !== 0;
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class DataFactory {

    static __wrap(ptr) {
        const obj = Object.create(DataFactory.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_datafactory_free(ptr);
    }
    /**
    * @param {string} value
    * @returns {NamedNode}
    */
    namedNode(value) {
        var ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.datafactory_namedNode(this.ptr, ptr0, len0);
        return NamedNode.__wrap(ret);
    }
    /**
    * @param {string | undefined} value
    * @returns {BlankNode}
    */
    blankNode(value) {
        var ptr0 = isLikeNone(value) ? 0 : passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.datafactory_blankNode(this.ptr, ptr0, len0);
        return BlankNode.__wrap(ret);
    }
    /**
    * @param {string | undefined} value
    * @param {any} language_or_datatype
    * @returns {Literal}
    */
    literal(value, language_or_datatype) {
        try {
            var ptr0 = isLikeNone(value) ? 0 : passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ret = wasm.datafactory_literal(this.ptr, ptr0, len0, addBorrowedObject(language_or_datatype));
            return Literal.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {DefaultGraph}
    */
    defaultGraph() {
        var ret = wasm.datafactory_defaultGraph(this.ptr);
        return DefaultGraph.__wrap(ret);
    }
    /**
    * @param {any} subject
    * @param {any} predicate
    * @param {any} object
    * @returns {Quad}
    */
    triple(subject, predicate, object) {
        try {
            var ret = wasm.datafactory_triple(this.ptr, addBorrowedObject(subject), addBorrowedObject(predicate), addBorrowedObject(object));
            return Quad.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {any} subject
    * @param {any} predicate
    * @param {any} object
    * @param {any} graph
    * @returns {Quad}
    */
    quad(subject, predicate, object, graph) {
        try {
            var ret = wasm.datafactory_quad(this.ptr, addBorrowedObject(subject), addBorrowedObject(predicate), addBorrowedObject(object), addBorrowedObject(graph));
            return Quad.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {any} original
    * @returns {any}
    */
    fromTerm(original) {
        try {
            var ret = wasm.datafactory_fromTerm(this.ptr, addBorrowedObject(original));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {any} original
    * @returns {Quad}
    */
    fromQuad(original) {
        try {
            var ret = wasm.datafactory_fromQuad(this.ptr, addBorrowedObject(original));
            return Quad.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class DefaultGraph {

    static __wrap(ptr) {
        const obj = Object.create(DefaultGraph.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_defaultgraph_free(ptr);
    }
    /**
    * @returns {string}
    */
    get termType() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.defaultgraph_term_type(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.defaultgraph_value(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {any} other
    * @returns {boolean}
    */
    equals(other) {
        try {
            var ret = wasm.defaultgraph_equals(this.ptr, addBorrowedObject(other));
            return ret !== 0;
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class Literal {

    static __wrap(ptr) {
        const obj = Object.create(Literal.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_literal_free(ptr);
    }
    /**
    * @returns {string}
    */
    get termType() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.literal_term_type(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.literal_value(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get language() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.literal_language(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {NamedNode}
    */
    get datatype() {
        var ret = wasm.literal_datatype(this.ptr);
        return NamedNode.__wrap(ret);
    }
    /**
    * @param {any} other
    * @returns {boolean}
    */
    equals(other) {
        try {
            var ret = wasm.literal_equals(this.ptr, addBorrowedObject(other));
            return ret !== 0;
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class MemoryStore {

    static __wrap(ptr) {
        const obj = Object.create(MemoryStore.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_memorystore_free(ptr);
    }
    /**
    * @param {any[] | undefined} quads
    */
    constructor(quads) {
        var ptr0 = isLikeNone(quads) ? 0 : passArrayJsValueToWasm0(quads, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.memorystore_new(ptr0, len0);
        return MemoryStore.__wrap(ret);
    }
    /**
    * @returns {DataFactory}
    */
    get dataFactory() {
        var ret = wasm.memorystore_dataFactory(this.ptr);
        return DataFactory.__wrap(ret);
    }
    /**
    * @param {any} quad
    */
    add(quad) {
        try {
            wasm.memorystore_add(this.ptr, addBorrowedObject(quad));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {any} quad
    */
    delete(quad) {
        try {
            wasm.memorystore_delete(this.ptr, addBorrowedObject(quad));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {any} quad
    * @returns {boolean}
    */
    has(quad) {
        try {
            var ret = wasm.memorystore_has(this.ptr, addBorrowedObject(quad));
            return ret !== 0;
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {number}
    */
    get size() {
        var ret = wasm.memorystore_size(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {any} subject
    * @param {any} predicate
    * @param {any} object
    * @param {any} graph_name
    * @returns {any[]}
    */
    match(subject, predicate, object, graph_name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.memorystore_match(retptr, this.ptr, addBorrowedObject(subject), addBorrowedObject(predicate), addBorrowedObject(object), addBorrowedObject(graph_name));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {string} query
    * @returns {any}
    */
    query(query) {
        var ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.memorystore_query(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} update
    */
    update(update) {
        var ptr0 = passStringToWasm0(update, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.memorystore_update(this.ptr, ptr0, len0);
    }
    /**
    * @param {string} data
    * @param {string} mime_type
    * @param {any} base_iri
    * @param {any} to_graph_name
    */
    load(data, mime_type, base_iri, to_graph_name) {
        try {
            var ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            wasm.memorystore_load(this.ptr, ptr0, len0, ptr1, len1, addBorrowedObject(base_iri), addBorrowedObject(to_graph_name));
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {string} mime_type
    * @param {any} from_graph_name
    * @returns {string}
    */
    dump(mime_type, from_graph_name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.memorystore_dump(retptr, this.ptr, ptr0, len0, addBorrowedObject(from_graph_name));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class NamedNode {

    static __wrap(ptr) {
        const obj = Object.create(NamedNode.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_namednode_free(ptr);
    }
    /**
    * @returns {string}
    */
    get termType() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.namednode_term_type(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.namednode_value(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {any} other
    * @returns {boolean}
    */
    equals(other) {
        try {
            var ret = wasm.namednode_equals(this.ptr, addBorrowedObject(other));
            return ret !== 0;
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class Quad {

    static __wrap(ptr) {
        const obj = Object.create(Quad.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_quad_free(ptr);
    }
    /**
    * @returns {any}
    */
    get subject() {
        var ret = wasm.quad_subject(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {any}
    */
    get predicate() {
        var ret = wasm.quad_predicate(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {any}
    */
    get object() {
        var ret = wasm.quad_object(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {any}
    */
    get graph() {
        var ret = wasm.quad_graph(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} other
    * @returns {boolean}
    */
    equals(other) {
        try {
            var ret = wasm.quad_equals(this.ptr, addBorrowedObject(other));
            return ret !== 0;
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('oxigraph_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_now_d89e184b3e3c06ec = function() {
        var ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_2f24d6544ea7b200 = function(arg0) {
        var ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        var ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_versions_6164651e75405d4a = function(arg0) {
        var ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_4b517d861cbcb3bc = function(arg0) {
        var ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        var ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_modulerequire_3440a4bcf44437db = function() { return handleError(function (arg0, arg1) {
        var ret = module.require(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_98fc271021c7d2ad = function(arg0) {
        var ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_a2cdb043d2bfe57f = function(arg0) {
        var ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_b7722b5594f1dc21 = function(arg0) {
        var ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_b4546ea7b590539e = function() { return handleError(function () {
        var ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_c279fea81f426a68 = function() { return handleError(function () {
        var ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_038a6ea0ff17789f = function() { return handleError(function () {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_4f93ce884bcee597 = function() { return handleError(function () {
        var ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_1a11e7e8c906996c = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_e91f71ddf1f45cff = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_get_6d26c712aa73c8b2 = function() { return handleError(function (arg0, arg1) {
        var ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_80811dcb66d1b53f = function(arg0, arg1) {
        var ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_namednode_new = function(arg0) {
        var ret = NamedNode.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_blanknode_new = function(arg0) {
        var ret = BlankNode.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_literal_new = function(arg0) {
        var ret = Literal.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_defaultgraph_new = function(arg0) {
        var ret = DefaultGraph.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        var ret = getObject(arg0) === null;
        return ret;
    };
    imports.wbg.__wbg_new_ec75d0d5815be736 = function() {
        var ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_quad_new = function(arg0) {
        var ret = Quad.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_0daae9343162dbe7 = function(arg0, arg1) {
        var ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_new_193281ce8fd4b1c8 = function() {
        var ret = new Map();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_b9dad32fc360b408 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_d8d349da7016c2fc = function(arg0, arg1) {
        var ret = new URIError(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_64cc7d048f228ca8 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_subarray_466613921b2fc6db = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_98117e9a7e993920 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_length_68e13e7bbd918464 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_79a3294266d4e783 = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_945397fb09fec0b8 = function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_223873223acf6d07 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw takeObject(arg0);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

