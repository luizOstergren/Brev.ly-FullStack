import util from 'node:util'
import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createLinkRoute } from './routes/create-link-route'
import { downloadCsvRoute } from './routes/csv-download'
import { uploadsDeleteRoute } from './routes/delete-links'
import { listLinksRoute } from './routes/list-links-route'
import { saveLinksInDatabaseRoute } from './routes/saveLinksInDatabase'
import { shortUrlRedirectRoute } from './routes/shortUrlRedirectRoute'
import { transformSwaggerSchema } from './routes/transform-swagger-schema'
import { uploadLinksRoutes } from './routes/upload-links'
import { registerCheckRoute } from './routes/register-checkout-route'

export const server = fastify()

// Compiladores do Zod
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Handler de erro mais robusto
server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  }

  console.error(util.inspect(error, { showHidden: true, depth: null }))

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})

// Plugins essenciais
await server.register(fastifyCors, {
  origin: 'http://localhost:5173', // libera apenas seu frontend
  methods: ['GET', 'POST', 'DELETE'], // os métodos que você realmente usa
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'] // Importante para downloads
});

await server.register(fastifyMultipart)

// Swagger
await server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly API',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: transformSwaggerSchema, // fastify-type-provider-zod na versão 5.0.1 deu erro no jsonSchemaTransform
})

await server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  staticCSP: true,
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
})

// Rotas
await server.register(uploadLinksRoutes)
await server.register(uploadsDeleteRoute)
await server.register(downloadCsvRoute)
await server.register(createLinkRoute)
await server.register(saveLinksInDatabaseRoute)
await server.register(shortUrlRedirectRoute)
await server.register(listLinksRoute)
await server.register(registerCheckRoute)

// Gera documentação e logs
await server.ready()
console.log(server.swagger())

if (process.env.NODE_ENV !== 'generate-openapi') {
  const port = process.env.PORT ? Number(process.env.PORT) : 3333

  server.listen({ port, host: '0.0.0.0' }).then(() => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`)
  })
}
