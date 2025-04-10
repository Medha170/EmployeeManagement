# Use the official .NET SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project file and restore dependencies
COPY EmployeeManagementNew.csproj ./
RUN dotnet restore

# Copy the rest of the source code
COPY . ./
RUN dotnet publish -c Release -o out

# Use a smaller runtime image for final container
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Use the PORT provided by Render
ENV ASPNETCORE_URLS=http://+:$PORT

# Start the application
ENTRYPOINT ["dotnet", "EmployeeManagementNew.dll"]
