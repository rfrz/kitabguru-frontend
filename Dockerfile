# Tahap kompilasi (Build stage): Menggunakan image Node.js versi 24 alpine yang ringan
FROM node:24-alpine AS build
# Menetapkan direktori kerja di dalam container ke folder /app
WORKDIR /app
# Menyalin file spesifikasi dependency package.json dan package-lock.json ke direktori kerja
COPY package*.json ./
# Menginstal seluruh dependensi modul npm yang diperlukan aplikasi React
RUN npm install
# Menyalin seluruh kode sumber proyek frontend ke dalam direktori kerja container
COPY . .
# Menjalankan perintah build untuk mengompilasi aplikasi React menjadi aset statis production (dist)
RUN npm run build

# Tahap distribusi (Production stage): Menggunakan image Nginx alpine untuk menyajikan file statis
FROM nginx:alpine
# Menyalin aset hasil kompilasi dari folder /app/dist tahap build ke folder publik html Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Menyalin file konfigurasi custom nginx.conf ke setelan default Nginx di container
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Membuka port 80 untuk akses web server luar
EXPOSE 80
# Menjalankan server Nginx di foreground agar container tetap berjalan aktif
CMD ["nginx", "-g", "daemon off;"]
