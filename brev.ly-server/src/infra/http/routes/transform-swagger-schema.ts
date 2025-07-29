import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type transformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

export function transformSwaggerSchema(data: transformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    if (schema.body === undefined) {
      schema.body = {
        type: 'object',
        required: [],
        properties: {},
      }
    }

    schema.body.properties.file = {
      type: 'string',
      format: 'binary',
      description: 'File to upload',
    }

    schema.body.required.push('file')
  }

  return { schema, url }
}
