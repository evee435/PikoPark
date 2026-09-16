FROM node:20-slim
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Exponemos el puerto de la app web (Vite)
EXPOSE 5173

# Aseguramos que host sea 0.0.0.0 al arrancar
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]