import 'dotenv/config'
import { writeFile } from 'node:fs/promises'

process.env.NODE_ENV = 'generate-openapi';

import { server } from '../server'

async function generateOpenApiJson() {
  await server.ready() // garante que todas as rotas foram registradas

  const swaggerJson = server.swagger()

  await writeFile(
    './openapi.json',
    JSON.stringify(swaggerJson, null, 2),
    'utf-8'
  )
  console.log('✅ OpenAPI JSON gerado com sucesso!')
}

generateOpenApiJson()
