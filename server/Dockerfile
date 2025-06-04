# Use Eclipse Temurin base image for Java 21
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the host to the container
COPY target/*.jar app.jar

# Expose port 8080 (or whatever your app uses)
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
