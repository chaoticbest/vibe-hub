const el = (q, d = document) => d.querySelector(q);
const list = el("#list");
const meta = el("#meta");
const input = el("#q");
const tmpl = el("#card");

const fmt = (s) => new Date(s).toLocaleDateString();

const normalize = (x) => (x || "").toString().toLowerCase();

const load = async () => {
  const res = await fetch("/apps.json", { cache: "no-store" });
  const data = await res.json();
  // registry is { apps: { id: entry, ... } }
  let apps = Object.values(data.apps || {});
  // newest first
  apps.sort((a, b) =>
    (b.updated_at || b.created_at || "").localeCompare(
      a.updated_at || a.created_at || ""
    )
  );
  render(apps);
  wireSearch(apps);
};

const render = (apps) => {
  list.innerHTML = "";
  meta.textContent = `${apps.length} app${apps.length === 1 ? "" : "s"}`;
  for (const a of apps) {
    const node = tmpl.content.cloneNode(true);
    node.querySelector(".name").textContent = a.name || a.id;
    node.querySelector(".desc").textContent = a.meta?.description || "";
    const tags = a.meta?.tags || [];
    const tagsBox = node.querySelector(".tags");
    tags.forEach((t) => {
      const s = document.createElement("span");
      s.textContent = t;
      tagsBox.appendChild(s);
    });
    node.querySelector(".run").href =
      a.links?.app || `https://vibes.chaoticbest.com/app/${a.id}/`;
    node.querySelector(".blog").href =
      a.links?.blog || `https://vibes.chaoticbest.com/blog/${a.id}`;
    node.querySelector(".repo").href = a.links?.github || a.repo || "#";
    node.querySelector(".dates").textContent = `Added ${fmt(
      a.created_at
    )} • Updated ${fmt(a.updated_at)}`;
    list.appendChild(node);
  }
};

const wireSearch = (all) => {
  const filter = () => {
    const q = normalize(input.value);
    if (!q) return render(all);
    const out = all.filter((a) => {
      const hay = [a.id, a.name, a.meta?.description, ...(a.meta?.tags || [])]
        .map(normalize)
        .join(" ");
      return hay.includes(q);
    });
    render(out);
  };
  input.addEventListener("input", filter);
};

load();
