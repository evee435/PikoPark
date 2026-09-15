FROM oven/bun:1-debian-baseline
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000
EXPOSE 5173

CMD ["bun", "run", "dev"]