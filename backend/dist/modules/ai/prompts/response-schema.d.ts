export declare const AI_RESPONSE_SCHEMA: {
    type: string;
    properties: {
        tipo: {
            enum: string[];
        };
        division: {
            enum: string[];
        };
        cliente: {
            type: string;
            properties: {
                nombre: {
                    type: string;
                };
                empresa: {
                    type: string;
                };
                email: {
                    type: string;
                };
                telefono: {
                    type: string;
                };
                provincia: {
                    type: string;
                };
            };
        };
        proyecto: {
            type: string;
            properties: {
                descripcion: {
                    type: string;
                };
                productos: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            nombre: {
                                type: string;
                            };
                            especificacion: {
                                type: string;
                            };
                            cantidad: {
                                type: string;
                            };
                            notas_tecnicas: {
                                type: string;
                            };
                        };
                    };
                };
                nivel_automatizacion: {
                    type: string;
                };
                tipo_instalacion: {
                    type: string;
                };
            };
        };
        propuesta: {
            type: string;
            properties: {
                introduccion: {
                    type: string;
                };
                items: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            descripcion: {
                                type: string;
                            };
                            detalle_tecnico: {
                                type: string;
                            };
                            incluye: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            rango_precio_usd: {
                                type: string;
                                properties: {
                                    min: {
                                        type: string;
                                    };
                                    max: {
                                        type: string;
                                    };
                                };
                            };
                            tiempo_fabricacion_semanas: {
                                type: string;
                            };
                        };
                    };
                };
                total_estimado_usd: {
                    type: string;
                    properties: {
                        min: {
                            type: string;
                        };
                        max: {
                            type: string;
                        };
                    };
                };
                tiempo_total_semanas: {
                    type: string;
                };
                notas_importantes: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                proximos_pasos: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
        };
        requiere_visita_tecnica: {
            type: string;
        };
        prioridad_comercial: {
            enum: string[];
        };
        resumen_para_comercial: {
            type: string;
        };
        preguntas: {
            type: string;
            items: {
                type: string;
            };
        };
        contexto_actual: {
            type: string;
        };
    };
};
