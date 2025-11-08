FROM golang:1.21-alpine

WORKDIR /app

# Копируем go.mod и go.sum
COPY go.mod go.sum ./

# Скачиваем зависимости
RUN go mod download

# Копируем весь код
COPY . .

# Компилируем приложение
RUN go build -o app main.go

# Порт
EXPOSE 8080

# Запускаем приложение
CMD ["./app"]
