export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Unified API (iPaaS)",
    version: "1.0.0",
    description: "Unified API for integration with multiple ERPs (Conta Azul, Omie, etc).",
  },
  servers: [
    { url: "http://localhost:3000/api/unified/v1", description: "Local Development" }
  ],
  tags: [
    { name: "Customers", description: "Endpoints for managing people, customers, and suppliers." },
    { name: "Products", description: "Endpoints for managing the product catalog and inventory." },
    { name: "Sales", description: "Endpoints for managing sales, orders, and sellers." }
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: "http", scheme: "bearer", description: "Your Unified API Key" },
      AccountToken: { type: "apiKey", in: "header", name: "X-Account-Token", description: "Token of the connected ERP account" }
    },
    schemas: {
      Customer: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          document: { type: "string" },
          personType: { type: "string", enum: ["F", "J"] },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      BulkActionRequest: {
        type: "object",
        properties: {
          ids: { type: "array", items: { type: "string" } }
        },
        required: ["ids"]
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          sku: { type: "string" },
          ean: { type: "string" },
          price: { type: "number" },
          costPrice: { type: "number" },
          stockQuantity: { type: "number" },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Sale: {
        type: "object",
        properties: {
          id: { type: "string" },
          number: { type: "integer" },
          saleDate: { type: "string", format: "date" },
          totalAmount: { type: "number" },
          status: { type: "string", enum: ["DRAFT", "CONFIRMED", "CANCELLED", "INVOICED", "QUOTATION", "OTHER"] },
          customerId: { type: "string" },
          customerName: { type: "string" },
          sellerId: { type: "string" },
          notes: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "string" },
                quantity: { type: "number" },
                unitPrice: { type: "number" }
              }
            }
          }
        }
      },
      Seller: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" }
        }
      }
    }
  },
  security: [{ ApiKeyAuth: [], AccountToken: [] }],
  paths: {
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List Products",
        description: "Returns a list of products from the connected ERP.",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ACTIVE", "INACTIVE"] } },
          { name: "page", in: "query", schema: { type: "number" } }
        ],
        responses: {
          "200": { 
            description: "Success",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } }
          }
        }
      },
      post: {
        tags: ["Products"],
        summary: "Create Product",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } }
        },
        responses: { "201": { description: "Created" } }
      }
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get Product by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Success", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } } }
      },
      put: {
        tags: ["Products"],
        summary: "Update Product",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
        responses: { "200": { description: "Success" } }
      },
      delete: {
        tags: ["Products"],
        summary: "Delete Product",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Deleted" } }
      },
      patch: {
        tags: ["Products"],
        summary: "Partial Update Product",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { type: "object" } } } },
        responses: { "204": { description: "Updated" } }
      }
    },
    "/products/categories": {
      get: {
        tags: ["Products"],
        summary: "List Product Categories",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "number" } }
        ],
        responses: { "200": { description: "Success" } }
      }
    },
    "/products/brands": {
      get: {
        tags: ["Products"],
        summary: "List Product Brands",
        parameters: [{ name: "search", in: "query", schema: { type: "string" } }],
        responses: { "200": { description: "Success" } }
      }
    },
    "/products/units": {
      get: {
        tags: ["Products"],
        summary: "List Units of Measurement",
        parameters: [{ name: "search", in: "query", schema: { type: "string" } }],
        responses: { "200": { description: "Success" } }
      }
    },
    "/products/ncm": {
      get: {
        tags: ["Products"],
        summary: "List NCM Codes",
        parameters: [{ name: "search", in: "query", schema: { type: "string" } }],
        responses: { "200": { description: "Success" } }
      }
    },
    "/products/cest": {
      get: {
        tags: ["Products"],
        summary: "List CEST Codes",
        parameters: [{ name: "search", in: "query", schema: { type: "string" } }],
        responses: { "200": { description: "Success" } }
      }
    },
    "/customers": {
      get: {
        tags: ["Customers"],
        summary: "List Customers",
        description: "Returns a list of customers (people) from the connected ERP.",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Search term" },
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "size", in: "query", schema: { type: "number" } }
        ],
        responses: {
          "200": { 
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Customer" }
                }
              }
            }
          },
          "401": { description: "Unauthorized (Invalid API Key or Token)" }
        }
      },
      post: {
        tags: ["Customers"],
        summary: "Create Customer",
        description: "Creates a new person in the connected ERP.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  personType: { type: "string", enum: ["F", "J"] },
                  email: { type: "string" },
                  document: { type: "string" }
                },
                required: ["name", "personType"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created successfully" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/customers/{id}": {
      get: {
        tags: ["Customers"],
        summary: "Get Customer by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 
          "200": { 
            description: "Success", 
            content: { "application/json": { schema: { $ref: "#/components/schemas/Customer" } } } 
          } 
        }
      },
      put: {
        tags: ["Customers"],
        summary: "Update Customer (Total)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Customer" } } } },
        responses: { "200": { description: "Success" } }
      },
      patch: {
        tags: ["Customers"],
        summary: "Update Customer (Partial)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { 
          content: { 
            "application/json": { 
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  isActive: { type: "boolean" }
                }
              } 
            } 
          } 
        },
        responses: { "200": { description: "Success" } }
      }
    },
    "/customers/connected-account": {
      get: {
        tags: ["Customers"],
        summary: "Connected Account Data",
        description: "Returns data of the company linked to the authenticated account.",
        responses: { "200": { description: "Success" } }
      }
    },
    "/customers/bulk/activate": {
      post: {
        tags: ["Customers"],
        summary: "Bulk Activate Customers",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/BulkActionRequest" } } } },
        responses: { "200": { description: "Success" } }
      }
    },
    "/customers/bulk/deactivate": {
      post: {
        tags: ["Customers"],
        summary: "Bulk Deactivate Customers",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/BulkActionRequest" } } } },
        responses: { "200": { description: "Success" } }
      }
    },
    "/customers/bulk/delete": {
      post: {
        tags: ["Customers"],
        summary: "Bulk Delete Customers",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/BulkActionRequest" } } } },
        responses: { "200": { description: "Success" } }
      }
    },
    "/sales": {
      get: {
        tags: ["Sales"],
        summary: "List Sales",
        parameters: [
          { name: "pagina", in: "query", schema: { type: "integer" } },
          { name: "tamanho_pagina", in: "query", schema: { type: "integer" } }
        ],
        responses: { "200": { description: "Success" } }
      },
      post: {
        tags: ["Sales"],
        summary: "Create Sale",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Sale" } } } },
        responses: { "201": { description: "Created" } }
      }
    },
    "/sales/sellers": {
      get: {
        tags: ["Sales"],
        summary: "List Sellers",
        responses: { "200": { description: "Success" } }
      }
    },
    "/sales/{id}": {
      get: {
        tags: ["Sales"],
        summary: "Get Sale Detail",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Success" } }
      }
    },
    "/sales/{id}/pdf": {
      get: {
        tags: ["Sales"],
        summary: "Download Sale PDF",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 
          "200": { 
            description: "PDF File",
            content: { "application/pdf": { schema: { type: "string", format: "binary" } } }
          } 
        }
      }
    },
    "/sales/bulk": {
      delete: {
        tags: ["Sales"],
        summary: "Bulk Delete Sales",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/BulkActionRequest" } } } },
        responses: { "200": { description: "Success" } }
      }
    }
  }
};
