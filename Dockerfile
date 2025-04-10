# Use a base image with .NET and SQL tools
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base

# Install SQL Server
RUN apt-get update && \
    apt-get install -y gnupg curl apt-transport-https && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 mssql-tools unixodbc-dev && \
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc && \
    apt-get clean

# Copy project files
WORKDIR /app
COPY . .

# Set environment variables for SQL Server
ENV SA_PASSWORD="YourStrong!Passw0rd"
ENV ACCEPT_EULA="Y"
ENV MSSQL_PID="Express"

# Expose ports
EXPOSE 10000

# Run SQL Server in background, wait, initialize DB, then start .NET app
CMD /bin/bash -c "\
    /opt/mssql/bin/sqlservr & \
    echo 'Waiting for SQL Server to start...' && \
    sleep 20 && \
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -i init.sql && \
    echo 'Starting .NET app...' && \
    dotnet EmployeeManagementNew.dll"
