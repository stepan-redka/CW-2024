FROM eclipse-temurin:11-jdk-alpine

WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy Maven files
COPY pom.xml ./

# Download dependencies
RUN mvn dependency:go-offline || true

# Copy source code
COPY src ./src

# Build the application (skip liquibase which needs DB at build time)
RUN mvn clean package -DskipTests -Dliquibase.should.run=false

# Run the application
EXPOSE 8080
CMD ["java", "-jar", "target/simplevote.jar"]