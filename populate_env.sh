if [ -f .env.local ]; then
  exit 0;
else
  touch .env.local
  echo "VITE_CAT_API_KEY=<my_api_key>" >> .env.local
fi
