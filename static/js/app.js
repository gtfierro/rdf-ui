import init, {MemoryStore} from "./pkg/oxigraph.js";

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
      message: '',
      progress: '',
      error: '',
      files: [],
    }
  },
  created: function() {
      this.initStore();
  },
  mounted: function() {
    const self = this;
    document.onclick = function (e) {
      const elem = e.target;
      if (elem.tagName == 'A' && elem.classList.contains("iri")) {
        elem.removeAttribute("target");
        self.inspect_url.url = e.target.textContent;
        e.preventDefault();
        return false; // prevent default action and stop event propagation
      }
    };
  },
  methods: {
    initStore: function() {
        var self = this;
        this.update_status({progress: "Loading store..."});
        init()
            .then(() => self.store = new MemoryStore())
            .then(() => {
                self.update_status({message: "Ready!"})
                const queryParams = new URLSearchParams(window.location.search);
                for (const url of queryParams.getAll('url')) {
                    console.log("adding uri: " + url);
                    self.$root.handleURL(url, false);
                }
            });
    },
    update_status: function(msg) {
      if (msg.progress) {
        this.progress = msg.progress;
      } else {
        this.progress = '';
      }
      if (msg.message) {
          this.message = msg.message;
      } else {
          this.message = '';
      }

      if (msg.error) {
          this.error = msg.error;
      } else {
          this.error = '';
      }
    },
    getURIValue: function (uri) {
        const parts = uri.split(/[\/#]/);
        return parts[parts.length-1];
    },
    removeFile: function(file) {
        const index = this.files.indexOf(file);
        if (index > -1) {
            this.files.splice(index, 1);
            console.log(this.files);
        }
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.delete("url");
        for (const url of this.files) {
            queryParams.set("url", url);
        }
        history.replaceState(null, null, "?"+queryParams.toString());
        this.initStore();
    },
    handleFile: function() {
        var self = this;
        const files = document.getElementById('file-input').files;
        this.update_status({progress: "Uploading file"});
        for (const file of files) {
            file.text()
                .then((t) => self.store.load(t, "text/turtle"))
                .then(() => {
                    console.log("finished loading file");
                    this.update_status({message: "Loaded file"});
                    if (this.files.indexOf(file.name) == -1) {
                        this.files.push(file.name);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.update_status({error: "Error loading " + url + " (" + err + ")"});
                });
        }
    },
    handleURL: function(inp_url, append) {
        var self = this;
        const url = inp_url ? inp_url : document.getElementById("url-input").value
        // do_append defaults to false when undefined
        const do_append = append === undefined ? true : append;
        console.log("fetching");
        this.update_status({progress: "Fetching file " + url + " from URL"});
        fetch(url)
            .then((resp) => resp.text())
            .then((t) => self.store.load(t, "text/turtle"))
            .then(() => {
                console.log("finished loading file");
                this.update_status({message: "Loaded " + url});
                if (this.files.indexOf(url) == -1) {
                    this.files.push(url);
                }
                if (do_append) {
                    const queryParams = new URLSearchParams(window.location.search);
                    queryParams.append("url", url);
                    history.replaceState(null, null, "?"+queryParams.toString());
                }
            })
            .catch((err) => {
                console.error(err);
                this.update_status({error: "Error loading " + url + " (" + err + ")"});
            });
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
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.append("query", this.yasqe.getValue());
            history.replaceState(null, null, "?"+queryParams.toString());
        },
    },
    mounted: function() {
        var self = this;
        this.yasqe = new Yasqe(document.getElementById(this.element), {});

        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has("query")) {
            console.log(queryParams.get("query"));
            //this.yasqe.setValue(queryParams.get("query"));
        } else {
            this.yasqe.setValue("SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 20");
        }

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

        this.yasr = new Yasr(document.getElementById(this.element + "-result"), {
            pluginOrder: ["table", "response"],
            defaultPlugin: "table",
            persistencyExpire: 0,
        });
        this.yasqe.on("query", (_, req) => {
            const q = req._data.query;
            const resp = {
                "head": {"vars": []},
                "results": {
                    "bindings": [],
                },
            };
            const keys = [];
            for (const binding of this.$root.store.query(q)) {
                if (keys.length == 0) {
                    for (const key of binding.keys()) {
                        resp.head.vars.push(key);
                        keys.push(key);
                    }
                }
                const b = {};
                for (const key of resp.head.vars) {
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
        <h3>Instance Info</h3>
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

app.component("statusbox", {
    props: {
        message: String,
        progress: String,
        error: String,
    },
    updated: function() {
        const self = this;
        if (this.message.length > 0 || this.error.length > 0 || this.progress.length > 0) {
            setTimeout(() => {
                self.$root.message = "";
                self.$root.error = "";
                self.$root.progress = "";
            }, 2000);
        }
    },
    template: `
        <div>
            <p class="message msg" v-if="message.length > 0">{{ message }}</p>
            <p class="progress msg" v-if="progress.length > 0">{{ progress }}</p>
            <p class="error msg" v-if="error.length > 0">{{ error }}</p>
        </div>
    `,
});

app.component("file-list", {
    props: {
        files: Array,
    },
    template: `
        <div>
            <h3>Loaded {{ files.length }} Files</h3>
            <ul class="no-bullets">
                <li v-for="file in files">
                    <button class="close-button" v-on:click="$root.removeFile(file)">&times; </button>
                    <a :href="file">{{ file }}</a>
                </li>
            </ul>
        </div>
    `,
});

app.mount('#app');
