
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/trisaleung/Desktop/whohacks/web_dir/.cache/dev-404-page.js")),
  "component---src-pages-app-js": preferDefault(require("/Users/trisaleung/Desktop/whohacks/web_dir/src/pages/App.js")),
  "component---src-pages-index-js": preferDefault(require("/Users/trisaleung/Desktop/whohacks/web_dir/src/pages/index.js")),
  "component---src-pages-marketing-js": preferDefault(require("/Users/trisaleung/Desktop/whohacks/web_dir/src/pages/marketing.js"))
}

