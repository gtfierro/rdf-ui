var store = '';
var visited = new Set();

// each query should return 2 items:
// group: the grouping construct, and 
// item: the individuals that are part of that group.
// If the item is also the group (i.e. we are listing instances), then just
// return item.
var subClassOf = (src) => `
        PREFIX brick: <https://brickschema.org/schema/Brick#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?group ?item WHERE {
            ?group rdfs:subClassOf <${src}> .
            ?item rdf:type/rdfs:subClassOf* ?group
        }`;

// var getInstances = (src) => `
//         PREFIX brick: <https://brickschema.org/schema/Brick#>
//         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//         PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
//         SELECT DISTINCT ?item WHERE {
//             ?item rdf:type/rdfs:subClassOf* <${src}> .
//         }`;
// 
// var getScopedInstances = (src) => `
//         PREFIX brick: <https://brickschema.org/schema/Brick#>
//         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//         PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
//         SELECT DISTINCT ?item WHERE {
//             BIND (<${src}> AS ?item)
//         }`;
// 
// // use like this:
// // var src = 'urn:ex#vav1' ; query = instanceRelation("brick:feeds")
// var instanceRelationInstance = (src, path) => `
//         PREFIX brick: <https://brickschema.org/schema/Brick#>
//         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//         PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
//         SELECT DISTINCT ?item WHERE {
//             <${src}> ${path} ?item .
//         }`;
// 
// var instanceRelationClass = (src, path) => `
//         PREFIX brick: <https://brickschema.org/schema/Brick#>
//         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//         PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
//         SELECT DISTINCT ?group ?item WHERE {
//             <${src}> ${path} ?item .
//             ?item rdf:type ?group .
//         }`;
// 
//var hierarchy = [
//    (_) => getInstances("https://brickschema.org/schema/Brick#Air_Handler_Unit"),
//    (src) => instanceRelationInstance(src, "brick:feeds"),
//    (src) => instanceRelationClass(src, "brick:hasPoint"),
//    (src) => getScopedInstances(src),
//];

const hierarchy = [
    (src) => subClassOf(src),
    (src) => subClassOf(src),
    (src) => subClassOf(src),
    (src) => subClassOf(src),
    (src) => subClassOf(src),
    (src) => subClassOf(src),
    (src) => subClassOf(src),
];


var treeData = {
  name: "https://brickschema.org/schema/Brick#Class",
  disp: "Brick Root Class",
  isInstance: false,
  expandable: true,
  level: 0,
  children: [
    //{ name: "hello" },
    //{ name: "wat" },
    //{
    //  name: "child folder",
    //  children: [
    //    {
    //      name: "child folder",
    //      children: [{ name: "hello" }, { name: "wat" }]
    //    },
    //    { name: "hello" },
    //    { name: "wat" },
    //    {
    //      name: "child folder",
    //      children: [{ name: "hello" }, { name: "wat" }]
    //    }
    //  ]
    //}
  ]
};

function contains(arr, uri) {
    if (arr == null) {
        return false
    }
    return arr.filter((val) => val.name == uri).length > 0
}

const app = Vue.createApp({
  data: function() {
    return {
      treeData: treeData,
      processing_url: {url: ''},
      inspect_url: {url: ''},
      pre_propulated: {val: false},
      count: 0,
    }
  },
  created: function() {
    var self = this;
    init()
        .then(() => store = new MemoryStore())
        .then(() => fetch("Brick.ttl"))
        .then(resp => resp.text())
        .then(t => {
            store.load(t, "text/turtle")
        })
        .then(() => {
            console.log("Loaded Brick");
            this.treeData.isOpen = true;
        });
        //.then(() => {
        //    console.log("Loaded Brick");
        //    return fetch("bldg.ttl");
        //})
        //.then(resp => resp.text())
        //.then(t => {
        //    store.load(t, "text/turtle")
        //})
        //.then(() => {
        //    console.log("Loaded building");
        //    this.treeData.isOpen = true;
        //});
  },
  methods: {
    set_processing_url: function(url) {
        this.processing_url.url = url;
        this.$forceUpdate();
    },
    getURIValue: function (uri) {
        let parts = uri.split(/[\/#]/);
        return parts[parts.length-1];
    },
    populateClasses: async function() {
        this.pre_propulated.val = false;
        await this.expandClass(this.treeData, true);
        this.set_processing_url('');
        this.pre_propulated.val = true;
    },
    expandClass: async function(item, expandAll) {
        // if children already populated, no need to update
        if (!visited.has(item.name) && (item.level < hierarchy.length)) {
            this.set_processing_url(item.name);
            var src = item.name;
            console.log("look for query", item.level, hierarchy);
            var query = hierarchy[item.level](src);

            var counts = {};
            console.log("Next level", query);
            for (let binding of store.query(query)) {
                let uri = binding.get("item").value;
                let group = binding.get("group")?.value ?? uri;
                console.log("group", group, uri);
                if (counts[group] == null) {
                    counts[group] = []
                }
                counts[group].push(uri);
            }
            for (const [group, instances] of Object.entries(counts)) {
                //console.log(uri, instances.length);
                this.addChildren(item, group, instances);
            }
            visited.add(item.name);
        }

        this.addInstances(item);
        // if only one child was expanded, continue expanding the tree
        console.log("expand?", item.name, item.children?.length);
        if (item.children?.length == 1 || expandAll) {
            for (let child of item.children ?? []) {
                this.expandClass(child, expandAll);
            }
        }
        this.set_processing_url('');
    },
    addInstances: async function(item) {
        this.set_processing_url(item.name);
        var query = `
        PREFIX brick: <https://brickschema.org/schema/Brick#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?item WHERE {
            ?item rdf:type <${item.name}>
        }`
        for (let binding of store.query(query)) {
            this.count++;
            this.addInstance(item, binding.get("item").value);
        }
        this.set_processing_url('');
    },
    addChildren: function(item, text, instances) {
      if (contains(item.children, text)) {
          return
      }
      console.log("add children for group", text);
      item.children.push({
          name: text,
          disp: this.getURIValue(text),
          count: instances.length,
          children: [],
          expandable: item.level+1 < hierarchy.length,
          isInstance: false,
          level: item.level+1,
      });
    },
    addInstance: function(item, instance) {
      if (contains(item.children, instance)) {
          return
      }
      item.children?.push({
          name: instance,
          disp: instance,
          expandable: false,
          isInstance: true,
          level: item.level+1,
      });
    },
    handleFile: function() {
        let files = document.getElementById('file-input').files;
        for (let file of files) {
            file.text()
                .then((t) => store.load(t, "text/turtle"))
                .then(() => console.log("finished loading file"));
        }
    },
    handleURL: function() {
        fetch(document.getElementById("url-input").value)
            .then((resp) => resp.text())
            .then((t) => store.load(t, "text/turtle"))
            .then(() => console.log("finished loading file"));
    }
  }
})

app.component("tree-item", {
  template: '#item-template',
  props: {
    item: Object
  },
  data: function() {
    return {
      isOpen: false,
    };
  },
  //computed: {
  //  isFolder: function() {
  //    return this.item.children && this.item.children.length;
  //  }
  //},
  methods: {
    inspect: function() {
      this.$root.inspect_url.url = this.item.name;
    },
    toggle: function() {
      console.log("toggle!", this.item);
      if (this.item.isInstance) {
          console.log("investigate", this.item.name);
      } else {
          // To get something working I had to make everything "isFolder == true"
        this.isOpen = !this.isOpen;
        this.$root.expandClass(this.item, false);
      }
    },
  }
})

app.component("instance-info", {
    props: {
        url: String
    },
    computed: {
        details: function() {
            var query = `
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
            let props = {};
            let entprops = {};
            for (let binding of store.query(query)) {
                let val = binding.get("val").value;
                let prop = binding.get("prop").value;
                let sp = binding.get("sp")?.value;
                let sv = binding.get("sv")?.value;
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
                    <li v-for="val in vals"><i>{{ val }}</i></li>
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
