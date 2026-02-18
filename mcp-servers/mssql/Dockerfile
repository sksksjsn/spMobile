FROM node:20-alpine

WORKDIR /app

# mssql-mcp-node: stdio MCP server for MSSQL
# supergateway: stdio → HTTP/SSE 브리지 (웹 클라이언트용)
RUN npm install -g mssql-mcp-node supergateway

EXPOSE 8080

# supergateway가 mssql-mcp-node를 stdio로 실행하고 HTTP/SSE로 노출
CMD ["supergateway", "--port", "8080", "--stdio", "mssql-mcp-node"]
