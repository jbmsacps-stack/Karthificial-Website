#!/bin/bash

echo "Finding pom.xml..."

POM_PATH=$(find . -name "pom.xml" | head -n 1)

if [ -z "$POM_PATH" ]; then
  echo "ERROR: pom.xml not found."
  exit 1
fi

APP_DIR=$(dirname "$POM_PATH")

echo "pom.xml found at: $POM_PATH"
echo "Starting backend from: $APP_DIR"

cd "$APP_DIR" || exit 1

if [ -f "mvnw" ]; then
  chmod +x mvnw
  ./mvnw spring-boot:run
else
  mvn spring-boot:run
fi
