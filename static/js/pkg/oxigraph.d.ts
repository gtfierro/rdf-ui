/* tslint:disable */
/* eslint-disable */
/**
*/
export class BlankNode {
  free(): void;
/**
* @param {any} other
* @returns {boolean}
*/
  equals(other: any): boolean;
/**
* @returns {string}
*/
  readonly termType: string;
/**
* @returns {string}
*/
  readonly value: string;
}
/**
*/
export class DataFactory {
  free(): void;
/**
* @param {string} value
* @returns {NamedNode}
*/
  namedNode(value: string): NamedNode;
/**
* @param {string | undefined} value
* @returns {BlankNode}
*/
  blankNode(value?: string): BlankNode;
/**
* @param {string | undefined} value
* @param {any} language_or_datatype
* @returns {Literal}
*/
  literal(value: string | undefined, language_or_datatype: any): Literal;
/**
* @returns {DefaultGraph}
*/
  defaultGraph(): DefaultGraph;
/**
* @param {any} subject
* @param {any} predicate
* @param {any} object
* @returns {Quad}
*/
  triple(subject: any, predicate: any, object: any): Quad;
/**
* @param {any} subject
* @param {any} predicate
* @param {any} object
* @param {any} graph
* @returns {Quad}
*/
  quad(subject: any, predicate: any, object: any, graph: any): Quad;
/**
* @param {any} original
* @returns {any}
*/
  fromTerm(original: any): any;
/**
* @param {any} original
* @returns {Quad}
*/
  fromQuad(original: any): Quad;
}
/**
*/
export class DefaultGraph {
  free(): void;
/**
* @param {any} other
* @returns {boolean}
*/
  equals(other: any): boolean;
/**
* @returns {string}
*/
  readonly termType: string;
/**
* @returns {string}
*/
  readonly value: string;
}
/**
*/
export class Literal {
  free(): void;
/**
* @param {any} other
* @returns {boolean}
*/
  equals(other: any): boolean;
/**
* @returns {NamedNode}
*/
  readonly datatype: NamedNode;
/**
* @returns {string}
*/
  readonly language: string;
/**
* @returns {string}
*/
  readonly termType: string;
/**
* @returns {string}
*/
  readonly value: string;
}
/**
*/
export class MemoryStore {
  free(): void;
/**
* @param {any[] | undefined} quads
*/
  constructor(quads?: any[]);
/**
* @param {any} quad
*/
  add(quad: any): void;
/**
* @param {any} quad
*/
  delete(quad: any): void;
/**
* @param {any} quad
* @returns {boolean}
*/
  has(quad: any): boolean;
/**
* @param {any} subject
* @param {any} predicate
* @param {any} object
* @param {any} graph_name
* @returns {any[]}
*/
  match(subject: any, predicate: any, object: any, graph_name: any): any[];
/**
* @param {string} query
* @returns {any}
*/
  query(query: string): any;
/**
* @param {string} update
*/
  update(update: string): void;
/**
* @param {string} data
* @param {string} mime_type
* @param {any} base_iri
* @param {any} to_graph_name
*/
  load(data: string, mime_type: string, base_iri: any, to_graph_name: any): void;
/**
* @param {string} mime_type
* @param {any} from_graph_name
* @returns {string}
*/
  dump(mime_type: string, from_graph_name: any): string;
/**
* @returns {DataFactory}
*/
  readonly dataFactory: DataFactory;
/**
* @returns {number}
*/
  readonly size: number;
}
/**
*/
export class NamedNode {
  free(): void;
/**
* @param {any} other
* @returns {boolean}
*/
  equals(other: any): boolean;
/**
* @returns {string}
*/
  readonly termType: string;
/**
* @returns {string}
*/
  readonly value: string;
}
/**
*/
export class Quad {
  free(): void;
/**
* @param {any} other
* @returns {boolean}
*/
  equals(other: any): boolean;
/**
* @returns {any}
*/
  readonly graph: any;
/**
* @returns {any}
*/
  readonly object: any;
/**
* @returns {any}
*/
  readonly predicate: any;
/**
* @returns {any}
*/
  readonly subject: any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_memorystore_free: (a: number) => void;
  readonly memorystore_new: (a: number, b: number) => number;
  readonly memorystore_dataFactory: (a: number) => number;
  readonly memorystore_add: (a: number, b: number) => void;
  readonly memorystore_delete: (a: number, b: number) => void;
  readonly memorystore_has: (a: number, b: number) => number;
  readonly memorystore_size: (a: number) => number;
  readonly memorystore_match: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly memorystore_query: (a: number, b: number, c: number) => number;
  readonly memorystore_update: (a: number, b: number, c: number) => void;
  readonly memorystore_load: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly memorystore_dump: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_datafactory_free: (a: number) => void;
  readonly datafactory_namedNode: (a: number, b: number, c: number) => number;
  readonly datafactory_blankNode: (a: number, b: number, c: number) => number;
  readonly datafactory_literal: (a: number, b: number, c: number, d: number) => number;
  readonly datafactory_defaultGraph: (a: number) => number;
  readonly datafactory_triple: (a: number, b: number, c: number, d: number) => number;
  readonly datafactory_quad: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly datafactory_fromTerm: (a: number, b: number) => number;
  readonly datafactory_fromQuad: (a: number, b: number) => number;
  readonly __wbg_namednode_free: (a: number) => void;
  readonly namednode_term_type: (a: number, b: number) => void;
  readonly namednode_value: (a: number, b: number) => void;
  readonly namednode_equals: (a: number, b: number) => number;
  readonly __wbg_blanknode_free: (a: number) => void;
  readonly blanknode_term_type: (a: number, b: number) => void;
  readonly blanknode_value: (a: number, b: number) => void;
  readonly blanknode_equals: (a: number, b: number) => number;
  readonly __wbg_literal_free: (a: number) => void;
  readonly literal_term_type: (a: number, b: number) => void;
  readonly literal_value: (a: number, b: number) => void;
  readonly literal_language: (a: number, b: number) => void;
  readonly literal_datatype: (a: number) => number;
  readonly literal_equals: (a: number, b: number) => number;
  readonly __wbg_defaultgraph_free: (a: number) => void;
  readonly defaultgraph_term_type: (a: number, b: number) => void;
  readonly defaultgraph_value: (a: number, b: number) => void;
  readonly defaultgraph_equals: (a: number, b: number) => number;
  readonly __wbg_quad_free: (a: number) => void;
  readonly quad_subject: (a: number) => number;
  readonly quad_predicate: (a: number) => number;
  readonly quad_object: (a: number) => number;
  readonly quad_graph: (a: number) => number;
  readonly quad_equals: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
