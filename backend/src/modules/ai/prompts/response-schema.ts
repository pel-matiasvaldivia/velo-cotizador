export const AI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    tipo: { enum: ["cotizacion_preliminar", "cotizacion_detallada", "consulta_tecnica", "solicitud_info"] },
    division: { enum: ["vino", "cerveza", "industrial", "multiple"] },
    cliente: {
      type: "object",
      properties: {
        nombre: { type: "string" },
        empresa: { type: "string" },
        email: { type: "string" },
        telefono: { type: "string" },
        provincia: { type: "string" }
      }
    },
    proyecto: {
      type: "object",
      properties: {
        descripcion: { type: "string" },
        productos: {
          type: "array",
          items: {
            type: "object",
            properties: {
              nombre: { type: "string" },
              especificacion: { type: "string" },
              cantidad: { type: "number" },
              notas_tecnicas: { type: "string" }
            }
          }
        },
        nivel_automatizacion: { type: "string" },
        tipo_instalacion: { type: "string" }
      }
    },
    propuesta: {
      type: "object",
      properties: {
        introduccion: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              descripcion: { type: "string" },
              detalle_tecnico: { type: "string" },
              incluye: { type: "array", items: { type: "string" } },
              rango_precio_usd: {
                type: "object",
                properties: {
                  min: { type: "number" },
                  max: { type: "number" }
                }
              },
              tiempo_fabricacion_semanas: { type: "number" }
            }
          }
        },
        total_estimado_usd: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" }
          }
        },
        tiempo_total_semanas: { type: "number" },
        notas_importantes: { type: "array", items: { type: "string" } },
        proximos_pasos: { type: "array", items: { type: "string" } }
      }
    },
    requiere_visita_tecnica: { type: "boolean" },
    prioridad_comercial: { enum: ["alta", "media", "baja"] },
    resumen_para_comercial: { type: "string" },
    preguntas: { type: "array", items: { type: "string" } },
    contexto_actual: { type: "string" }
  }
};
