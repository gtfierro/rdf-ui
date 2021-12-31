import init, {MemoryStore} from "./pkg/oxigraph.js";
//import Tree from "./tree.js";

const typelookup = {
    "NamedNode": "uri",
    "BlankNode": "bnode",
    "Literal": "literal",
}


const app = Vue.createApp({
  data: function() {
    return {
      store: null,
      inspect_url: {url: ''},
    }
  },
  created: function() {
    var self = this;
    init()
        .then(() => self.store = new MemoryStore())
        .then(() => fetch("Brick.ttl"))
        .then(resp => resp.text())
        .then(t => {
            self.store.load(t, "text/turtle");
        })
        .then(() => {
            console.log("Loaded Brick");
        });
  },
  mounted: function() {
    const self = this;
    document.onclick = function (e) {
      const elem = e.target || e.srcElement;
        console.log(app);
      if (elem.tagName == 'A' && elem.classList.contains("iri")) {
        elem.removeAttribute("target");
        self.inspect_url.url = e.target.textContent;
        e.preventDefault();
        return false; // prevent default action and stop event propagation
      }
    };
  },
  methods: {
    getURIValue: function (uri) {
        const parts = uri.split(/[\/#]/);
        return parts[parts.length-1];
    },
    handleFile: function() {
        var self = this;
        const files = document.getElementById('file-input').files;
        for (const file of files) {
            file.text()
                .then((t) => self.store.load(t, "text/turtle"))
                .then(() => console.log("finished loading file"));
        }
    },
    handleURL: function() {
        var self = this;
        console.log("fetching");
        fetch(document.getElementById("url-input").value)
            .then((resp) => resp.text())
            .then((t) => self.store.load(t, "text/turtle"))
            .then(() => console.log("finished loading file"));
    }
  }
})

app.component("querybox", {
    props: { element: Object },
    data: function() {
        return {
            yasgui: null,
            yasqe: null,
        }
    },
    methods: {
        updateQueryString: function() {
            let queryParams = new URLSearchParams(window.location.search);
            queryParams.set("query", this.yasqe.getValue());
            history.replaceState(null, null, "?"+queryParams.toString());
        },
        addEventListeners: function() {
            const elements = document.getElementsByClassName("iri");
            const root = this.$root;
            for (const elem of elements) {
                console.log("add to element", elem);
                elem.removeAttribute("target");
                elem.addEventListener("click", (e) => {
                    root.inspect_url.url = e.target.textContent;
                    console.log("clicked", e.target.textContent);
                    e.preventDefault();
                });
            }
        },
    },
    mounted: function() {
        var self = this;
        //this.yasgui = new Yasgui(document.getElementById(this.element), {
        //});
        //this.yasqe = this.yasgui.getTab().yasqe;
        this.yasqe = new Yasqe(document.getElementById(this.element), {});
        let queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has("query")) {
            console.log(queryParams.get("query"));
            //this.yasqe.setValue(queryParams.get("query"));
        } else {
            this.yasqe.addPrefixes({
                "brick": "https://brickschema.org/schema/Brick#",
                "owl": "http://www.w3.org/2002/07/owl#",
                "sh": "http://www.w3.org/ns/shacl#",
                "qudt": "http://qudt.org/schema/qudt/",
                "quantitykind": "http://qudt.org/vocab/quantitykind/",
                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                "unit": "http://qudt.org/vocab/unit/",
            });
        }

        this.yasr = new Yasr(document.getElementById(this.element + "-result"), {
            pluginOrder: ["table", "response"],
            defaultPlugin: "table",
            persistencyExpire: 0,
        });
        this.yasqe.on("query", (inst, req) => {
            let q = req._data.query;
            let resp = {
                "head": {"vars": []},
                "results": {
                    "bindings": [],
                },
            };
            let keys = [];
            for (let binding of this.$root.store.query(q)) {
                if (keys.length == 0) {
                    for (let key of binding.keys()) {
                        resp.head.vars.push(key);
                        keys.push(key);
                    }
                }
                let b = {};
                for (let key of resp.head.vars) {
                    b[key] = {"value": binding.get(key).value,
                                "type": typelookup[binding.get(key).termType]};
                }
                resp.results.bindings.push(b);
            }
            self.yasr.setResponse({
                data: JSON.stringify(resp),
                contentType: "application/sparql-results+json",
            });
            console.log(self.yasr);
            this.updateQueryString();
        });
        this.yasr.on("drawn", (inst, plug) => {
            console.log("drawn", inst, plug);
            //this.addEventListeners();
        });

    },
    computed: {
        resultbox: function() {
            return this.element + "-result";
        },
    },
    template: `
        <div>
            <div class="querybox" v-bind:id="element"></div>
            <div v-bind:id="resultbox"></div>
        </div>
    `,
});

app.component("instance-info", {
    props: {
        url: String,
    },
    computed: {
        details: function() {
            if (this.url.length == 0) {
                return {}, {};
            }
            const query = `
            PREFIX brick: <https://brickschema.org/schema/Brick#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            SELECT DISTINCT ?prop ?val ?sp ?sv WHERE {
               <${this.url}> ?prop ?val .
               OPTIONAL {
               { ?prop rdfs:range brick:TimeseriesReference . }
                UNION
               { ?prop a brick:EntityProperty . }
                ?val ?sp ?sv }
            }`
            // TODO make the above query less restrictive; not just entityproperty!
            const props = {};
            const entprops = {};
            for (const binding of this.$root.store.query(query)) {
                const val = binding.get("val").value;
                const prop = binding.get("prop").value;
                const sp = binding.get("sp")?.value;
                const sv = binding.get("sv")?.value;
                if (sp != null && sv != null) {
                    if (entprops[prop] == null) {
                        entprops[prop] = {};
                    }
                    entprops[prop][sp] = sv
                } else {
                    if (props[prop] == null) {
                        props[prop] = [];
                    }
                    props[prop].push(val);
                }

            }
            return [props, entprops];
        }
    },
    template: `
        <div>
        <i>{{ url }}</i>
        <ul>
            <li v-for="(vals, prop) in details[0]"><b>{{ this.$root.getURIValue(prop) }}:</b>
                <ul class="no-bullets">
                    <li v-for="val in vals"><iri-link :iri="val"></iri-link></li>
                </ul>
            </li>
            <li v-for="(subprops, entprop) in details[1]"><b>{{ this.$root.getURIValue(entprop) }}:</b>
                <ul class="no-bullets">
                    <li v-for="(val, subprop) in subprops">{{ this.$root.getURIValue(subprop) }}: <i>{{ val }}</i></li>
                </ul>
            </li>
        </ul>
        </div>
    `
})

app.component("iri-link", {
    props: {
        iri: String,
    },
    computed: {
        label: function() {
            return this.$root.getURIValue(this.iri);
        },
        is_iri: function() {
            return this.iri.startsWith("http");
        },
    },
    template: `
        <span>
            <a v-if="is_iri" class="iri" :href="iri">{{ iri }}</a>
            <p v-else>{{ iri }}</p>
        </span>
    `,
});

app.mount('#app');
