# Dockerfile për Ultrawebthinking
FROM node:18

# Vendos direktorinë e punës
WORKDIR /app

# Kopjo vetëm skedarët e nevojshëm për ndërtim
COPY package.json yarn.lock ./

# Instalo varësitë
RUN yarn install

# Kopjo të gjithë kodin e aplikacionit
COPY . .

# Start aplikacionin
CMD ["yarn", "start"]

version: "3.9"

services:
  ultrawebthinking:
    image: ultrawebthinking:1.0.0
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
      - "5001:5001"
    environment:
      - ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT}
    volumes:
      - .:/app
    restart: always
    networks:
      - ultraweb_network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:1.21
    container_name: ultraweb_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - ultrawebthinking
    networks:
      - ultraweb_network

  db:
    image: postgres:14.5
    container_name: ultraweb_db
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - ultraweb_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 3

  redis:
    image: redis:6.2
    container_name: ultraweb_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - ultraweb_network

  prometheus:
    image: prom/prometheus:2.36.2
    container_name: ultraweb_prometheus
    restart: always
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - ultraweb_network

  grafana:
    image: grafana/grafana:8.5.5
    container_name: ultraweb_grafana
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    networks:
      - ultraweb_network

  loki:
    image: grafana/loki:2.5.0
    container_name: ultraweb_loki
    restart: always
    ports:
      - "3100:3100"
    networks:
      - ultraweb_network

  promtail:
    image: grafana/promtail:2.5.0
    container_name: ultraweb_promtail
    restart: always
    volumes:
      - /var/log:/var/log
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    networks:
      - ultraweb_network

networks:
  ultraweb_network:

volumes:
  db_data:
  redis_data:

