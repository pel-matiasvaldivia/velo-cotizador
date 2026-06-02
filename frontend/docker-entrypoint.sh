#!/bin/sh
# Inject runtime environment variables into a JS config file
cat <<EOF > /usr/share/nginx/html/config.js
window._env = {
  VITE_API_URL: "${API_URL}",
  VITE_WS_URL: "${WS_URL}"
};
EOF
exec nginx -g "daemon off;"
