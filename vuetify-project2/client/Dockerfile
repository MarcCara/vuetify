FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Expose Vite default port
EXPOSE 3000 
# Vite often defaults to 5173, but we can configure it. 
# However, user prompt says 8080 or whatever. 
# I will use 5173 internally and map to 8080 externally in compose.

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
