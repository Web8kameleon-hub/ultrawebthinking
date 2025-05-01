# Dockerfile për Ultrawebthinking
FROM node:18

# Vendos direktorinë e punës
WORKDIR /app

# Kopjo gjithçka
COPY . .

# Instalo varësitë
RUN yarn install

# Ndërto aplikacionin
RUN yarn build

# Ekspozo portin
EXPOSE 3000

# Start aplikacionin
CMD ["yarn", "start"]

