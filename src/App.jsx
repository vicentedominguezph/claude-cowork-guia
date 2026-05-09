import { useState, useEffect, useRef } from "react";

/* ─── GOOGLE FONTS ─────────────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Fraunces:ital,wght@0,600;0,700;0,800;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#f4f5f9;--surface:#ffffff;--surface2:#f0f1f6;--surface3:#e8eaf2;
      --border:#dde0ec;--border2:#c8ccd e;
      --text:#1a1d2e;--text2:#4a5070;--text3:#8890b0;
      --indigo:#5b6af7;--pink:#e84fa0;--amber:#f0a500;--teal:#0ba5c7;
      --green:#16b84e;--red:#e53935;--purple:#8b5cf6;
      --grad:linear-gradient(135deg,#5b6af7,#e84fa0);
      --font-display:'Fraunces',Georgia,serif;
      --font-body:'Plus Jakarta Sans',system-ui,sans-serif;
      --font-mono:'JetBrains Mono',monospace;
    }
    html,body,#root{height:100%;overflow:hidden}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:var(--surface2)}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
    button{cursor:pointer;font-family:var(--font-body)}
    code{font-family:var(--font-mono)}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes modalIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
    .anim-fade{animation:fadeIn .35s ease both}
    .anim-slide{animation:slideIn .3s ease both}
  `}</style>
);

/* ─── DATA ──────────────────────────────────────────────────────────────────── */
const NAV = [
  { id:"que-es",      icon:"🧭", label:"¿Qué es?",       color:"#6c77ff" },
  { id:"como",        icon:"⚙️", label:"Cómo funciona",  color:"#2dd4c7" },
  { id:"perfiles",    icon:"👥", label:"Perfiles",        color:"#ffb547" },
  { id:"demos",       icon:"🎬", label:"Demos",           color:"#ff4d9e" },
  { id:"plugins",     icon:"🔌", label:"Plugins",         color:"#a855f7" },
  { id:"schedule",    icon:"🗓️", label:"Schedule",        color:"#2ecc8a" },
  { id:"quiz",        icon:"🧠", label:"Quiz",            color:"#ff5252" },
];

const COMPARISONS = [
  ["Acceso a archivos","Copias y pegas a mano","Lee y escribe directo en tus carpetas"],
  ["Resultado","Texto — tú ejecutas","Documento o carpeta terminada, lista"],
  ["Pasos","1 pregunta → 1 respuesta","Múltiples pasos coordinados solos"],
  ["¿Puedes alejarte?","No, debes estar activo","✅ Sí — vuelves al resultado listo"],
  ["Tareas programadas","❌ No disponible","✅ Horario fijo automático"],
  ["Apps conectadas","Solo lo que pegues","Gmail, Slack, Notion, CRM y más"],
];

const FLOW = [
  { n:1, icon:"🎯", t:"Defines el objetivo",        d:"Le dices qué quieres lograr en lenguaje natural. Sin pasos técnicos — solo el resultado.", ex:'"Organiza mi carpeta /Proyectos del 2025 y genera un índice en PDF"' },
  { n:2, icon:"🗂️", t:"Solicita acceso (si aplica)", d:"Si hay archivos locales, pide permiso explícito antes de tocar nada. Tú decides qué carpetas puede ver. Tareas web no necesitan este paso.", ex:'"¿Puedo acceder a /Proyectos/2025?" → Tú apruebas o rechazas' },
  { n:3, icon:"📋", t:"Muestra el plan",             d:"Antes de ejecutar, te muestra los pasos que seguirá. Puedes ajustar o cancelar antes de que empiece.", ex:"Plan: 1. Leer carpeta → 2. Clasificar → 3. Subcarpetas → 4. PDF" },
  { n:4, icon:"⚡", t:"Ejecuta en paralelo",         d:"Lee archivos, navega la web, usa apps y coordina subtareas simultáneamente — no en secuencia.", ex:"Lee 50 archivos, los ordena y redacta el índice al mismo tiempo" },
  { n:5, icon:"👀", t:"Monitoreas o te alejas",      d:"Puedes ver cada acción en tiempo real o dejar correr. Pide confirmación antes de acciones irreversibles.", ex:'"¿Eliminar 12 duplicados?" → [Sí] [No]' },
  { n:6, icon:"✅", t:"Entrega el resultado",        d:"El archivo terminado, la carpeta organizada, el informe escrito — no instrucciones para que lo hagas tú.", ex:"Carpeta organizada + Indice_2025.pdf en tu escritorio" },
];

const PROFILES = [
  { id:"estudiante", label:"Estudiante universitario", icon:"🎓", color:"#6c77ff",
    tasks:[
      { t:"Resumir 10 papers con citas", h:"Le das la carpeta con PDFs y el formato. Procesa todos y entrega el resumen estructurado." },
      { t:"Buscar fuentes para una tesis", h:"Navega la web, filtra por calidad y entrega resumen con links y citas." },
      { t:"Organizar notas de semestre", h:"Apunta a tu carpeta de apuntes — crea un índice temático con vínculos internos." },
    ]},
  { id:"trabajador", label:"Trabajador/a joven", icon:"💻", color:"#2dd4c7",
    tasks:[
      { t:"Organizar bandeja y redactar respuestas", h:"Con conector Gmail, lee los hilos y propone borradores listos para enviar." },
      { t:"Presentación del lunes desde Excel", h:"Toma los datos, elige gráficos y exporta el .pptx con diseño limpio." },
      { t:"Comparar 3 proveedores", h:"Investiga en web, descarga cotizaciones y crea tabla comparativa." },
    ]},
  { id:"emprendedor", label:"Emprendedor/a", icon:"🚀", color:"#ffb547",
    tasks:[
      { t:"Informe de ventas de varios canales", h:"Lee los Excel de cada canal y genera reporte ejecutivo unificado con tendencias." },
      { t:"Monitorear menciones de la marca", h:"Con conectores web, busca y entrega resumen semanal de menciones." },
      { t:"Propuestas comerciales en lote", h:"Con tu plantilla .docx y CRM, genera propuestas para múltiples clientes." },
    ]},
  { id:"casa", label:"Dueño/a de casa", icon:"🏠", color:"#2ecc8a",
    tasks:[
      { t:"Organizar recetas dispersas en PDFs", h:"Apunta a la carpeta — las clasifica por tipo y crea un recetario en Word." },
      { t:"Buscar vuelo y hotel para vacaciones", h:"Le das fechas y presupuesto. Investiga en web y entrega mejores opciones con links." },
      { t:"Resumir documentos del colegio", h:"Sube los PDFs del colegio y genera un calendario con fechas y pendientes." },
    ]},
];

const DEMOS = [
  { id:"carpetas", title:"Organizar carpeta caótica", persona:"👩‍💼 Trabajadora joven", folder:true,
    folderQ:"¿Puedo acceder a /Descargas para leer y reorganizar los archivos?", folderA:"Acceso concedido a /Descargas ✓",
    input:"Tengo mi carpeta /Descargas con 340 archivos mezclados — PDFs, fotos, contratos, boletas. Organízala por categorías y renombra con fechas.",
    steps:["📂 Leyendo /Descargas… 340 archivos detectados","🔍 Clasificando: 89 PDFs · 112 imágenes · 67 docs · 72 otros","📋 Subcarpetas: /Contratos · /Fotos · /Boletas · /Trabajo · /Otros","✏️ Renombrando con YYYY-MM-DD_nombre…","✅ 3 duplicados eliminados. Resumen guardado."],
    output:"Carpeta organizada en 4 minutos. Encontré 3 contratos laborales, 2 posiblemente vencidos — los marqué en rojo." },
  { id:"reporte", title:"Informe desde archivos dispersos", persona:"🏢 Emprendedor/a", folder:true,
    folderQ:"¿Puedo acceder a /Ventas/2025 para leer los Excel y PDFs?", folderA:"Acceso concedido a /Ventas/2025 ✓",
    input:"Tengo 8 Excel y 3 PDFs en /Ventas/2025 con resultados de 8 meses. Genera un informe ejecutivo con tendencias y recomendaciones.",
    steps:["📊 Abriendo 8 Excel… 12.400 filas","📄 Procesando 3 PDFs de reportes","📈 Calculando tendencias y variaciones","✍️ Redactando: Resumen · Tendencias · Alertas · Recomendaciones","📎 Exportando Informe_Ejecutivo_Mayo2026.docx"],
    output:"Informe de 12 páginas listo. Hallazgo: ventas cayeron 18% en marzo — coincide con el lanzamiento fallido en los PDFs." },
  { id:"web", title:"Investigación web + resumen", persona:"🎓 Estudiante", folder:false,
    input:"Necesito un resumen de los últimos estudios sobre IA en educación secundaria. 5 fuentes, ideas principales y sección de críticas.",
    steps:["🌐 Buscando: 'IA educación secundaria 2024-2026'","📰 Revisando 23 artículos académicos","🔎 Seleccionadas 5 fuentes de alto impacto","✍️ Sintetizando: beneficios · riesgos · resultados","📁 Guardando Resumen_IA_Educacion.md con citas"],
    output:"Resumen de 4 páginas, 5 fuentes citadas. Hallazgo: 3 de 5 estudios dicen que IA mejora comprensión pero reduce escritura original." },
  { id:"due", title:"Due diligence de proveedores", persona:"🏢 Gerente de Compras", badge:"AVANZADO", folder:true,
    folderQ:"¿Puedo acceder a /Compras/Propuestas2026?", folderA:"Acceso concedido a /Compras/Propuestas2026 ✓",
    input:"En /Compras/Propuestas2026 tengo propuestas PDF de 3 proveedores. Evalúalos cruzando con reputación online, reviews, noticias y señales de riesgo.",
    steps:["📄 Leyendo 3 PDFs (47, 62 y 38 páginas)","🌐 Investigando Proveedor 1: LinkedIn, G2…","🌐 Proveedor 2: demanda laboral activa detectada","🌐 Proveedor 3: 94% satisfacción, sin alertas","📊 Tabla: precio · soporte · integración · riesgo","⚠️ Proveedor 2 tiene litigio oculto en su propuesta","✍️ Redactando informe con recomendación jerarquizada","📎 Exportando .docx + tabla Excel"],
    output:"Informe (18 pág). Recomendación: Proveedor 3. Alerta crítica: Proveedor 2 ocultó litigio activo — descalificado." },
  { id:"onboarding", title:"Kit de onboarding completo", persona:"👩‍💼 Jefa de RRHH", badge:"AVANZADO", folder:true,
    folderQ:"¿Puedo acceder a /RRHH/Plantillas y crear carpeta en /RRHH/Onboarding?", folderA:"Acceso concedido ✓",
    input:"Base en /RRHH/Plantillas. Kit para Valentina Torres, área TI, jefa Rodrigo Vera, entra el lunes. Guardar en /RRHH/Onboarding.",
    steps:["📂 Leyendo 14 documentos base","✏️ Personalizando contrato","📋 Checklist de accesos TI","📧 Correo firmado por Rodrigo Vera","📅 Agenda primera semana","🗂️ Organizando en /RRHH/Onboarding/Valentina_Torres/","✅ Índice con checklist para RRHH"],
    output:"Kit en 7 minutos. 9 documentos personalizados, agenda, correo listo. Lo que tomaba 3 días — antes del almuerzo." },
  { id:"campaña", title:"Campaña de contenido mensual", persona:"📣 Emprendedor online", badge:"AVANZADO", folder:true,
    folderQ:"¿Puedo acceder a /Marketing/Posts, /Analytics y /Notas?", folderA:"Acceso concedido a /Marketing ✓",
    input:"Posts en /Marketing/Posts, analytics Excel en /Marketing/Analytics, notas en /Marketing/Notas. Calendario editorial de junio, copies y briefs para el diseñador.",
    steps:["📂 Analizando 87 publicaciones (3 meses)","📊 Leyendo analytics: alcance, engagement, horarios","📝 Procesando notas de objetivos","🔍 Patrón: posts con preguntas = 2.3x más engagement","🗓️ Calendario: 20 posts en 4 semanas","✍️ Redactando 20 copies con hashtags","🎨 Brief creativo por post","📎 Exportando .xlsx + .docx + .pdf"],
    output:"20 posts redactados, calendario con mejores horarios, 20 briefs. Insight: miércoles 19h es tu mejor ventana." },
];

const PLUGINS = [
  { name:"Productivity", icon:"📅", color:"#6c77ff",
    tagline:"Tu día organizado sin esfuerzo",
    desc:"Gestiona tareas, calendarios y flujos diarios conectando todas tus herramientas — Notion, Slack, Asana, Microsoft 365 — en un solo lugar coordinado.",
    skills:["Crear agenda diaria desde tus reuniones pendientes","Priorizar tareas por urgencia e impacto real","Resumir hilos de Slack en puntos accionables","Generar resumen semanal automático"],
    connectors:["Notion","Slack","Asana","Microsoft 365","Google Calendar"],
    commands:["/productivity:plan-day","/productivity:weekly-review","/productivity:task-list"],
    whenPlugin:"Cuando gestionas múltiples herramientas a la vez y necesitas que Cowork coordine entre ellas sin que le expliques cómo funciona cada una en cada conversación. El plugin ya conoce tu stack.",
    whenSkill:"Si solo necesitas que Claude escriba en cierto tono o siga un formato específico en tus notas de trabajo — una instrucción simple y puntual." },
  { name:"Enterprise Search", icon:"🔍", color:"#2dd4c7",
    tagline:"Encuentra todo, en todos tus sistemas",
    desc:"Busca información a través de todas las herramientas y documentos de tu empresa simultáneamente. Nunca más 'no sé dónde está ese archivo'.",
    skills:["Buscar en múltiples fuentes al mismo tiempo","Cruzar resultados de sistemas distintos","Resumir hallazgos en formato ejecutivo","Identificar la fuente más confiable"],
    connectors:["Google Drive","SharePoint","Confluence","Notion","Slack"],
    commands:["/search:find-docs","/search:cross-system","/search:summarize-results"],
    whenPlugin:"Cuando la información de tu empresa está dispersa en 5+ herramientas y el plugin ya conoce la estructura, los accesos y las convenciones de nombre de tu organización.",
    whenSkill:"Si solo necesitas buscar en un lugar específico que ya le explicaste a Claude manualmente en esa conversación." },
  { name:"Plugin Create", icon:"🛠️", color:"#a855f7",
    tagline:"Construye tu propio especialista",
    desc:"Crea plugins personalizados para tu empresa o equipo, en lenguaje natural, sin código. Describes lo que necesitas y Cowork construye el plugin completo.",
    skills:["Traducir necesidades en lenguaje natural a estructura de plugin","Generar skills personalizadas para tu flujo","Configurar conectores y comandos específicos","Probar y ajustar el plugin antes de usarlo"],
    connectors:["Cualquier herramienta que uses"],
    commands:["/create:new-plugin","/create:add-skill","/create:test-plugin"],
    whenPlugin:"Cuando ninguno de los 11 plugins estándar cubre tu caso de uso o el flujo de trabajo específico de tu empresa. El Plugin Create es la puerta de entrada a personalización total.",
    whenSkill:"Si la personalización es puntual y simple — un tono, un formato, una instrucción de 2-3 líneas." },
  { name:"Sales", icon:"💼", color:"#ffb547",
    tagline:"Llega preparado a cada llamada",
    desc:"Investiga prospectos, prepara llamadas con contexto real del CRM, da seguimiento a deals con historial completo y genera propuestas personalizadas en segundos.",
    skills:["Investigar empresa y contacto antes de llamar","Cruzar historial del CRM con datos web actuales","Redactar follow-ups con contexto de la última conversación","Detectar señales de compra en el historial del deal"],
    connectors:["Salesforce","HubSpot","Pipedrive","LinkedIn"],
    commands:["/sales:call-prep","/sales:follow-up","/sales:propuesta"],
    whenPlugin:"Cuando vendes activamente y quieres que Cowork conozca tu proceso comercial, tu CRM y el perfil de tus clientes — sin explicárselo en cada conversación. El plugin actúa como tu asistente de ventas entrenado.",
    whenSkill:"Si solo quieres que Claude escriba un email de venta en cierto tono, sin necesidad de acceso a tu CRM ni contexto de empresa." },
  { name:"Finance", icon:"📊", color:"#2ecc8a",
    tagline:"Análisis financiero sin fricción",
    desc:"Analiza estados financieros, construye modelos en Excel, detecta variaciones vs presupuesto y rastrea métricas clave. Para equipos de finanzas y CFOs que no quieren perder tiempo en tareas repetitivas.",
    skills:["Leer y comparar estados financieros multi-período","Detectar variaciones vs presupuesto con alertas","Construir modelos y proyecciones en Excel","Generar narrativa ejecutiva desde los números"],
    connectors:["Excel","Google Sheets","QuickBooks","SAP"],
    commands:["/finance:variance-report","/finance:modelo","/finance:kpi-dashboard"],
    whenPlugin:"Cuando el análisis financiero es recurrente y el plugin ya conoce tus métricas clave, tu formato de reporte y tus umbrales de alerta — sin repetirlos cada vez.",
    whenSkill:"Si solo necesitas que Claude explique un concepto financiero o calcule algo puntual sin contexto de empresa." },
  { name:"Data", icon:"🗄️", color:"#6c77ff",
    tagline:"Convierte datos en decisiones",
    desc:"Escribe consultas SQL optimizadas, construye dashboards, limpia y transforma datasets, detecta patrones y anomalías. Para analistas y equipos de datos.",
    skills:["Escribir y optimizar consultas SQL complejas","Limpiar y transformar datasets inconsistentes","Identificar patrones, outliers y anomalías","Generar visualizaciones descriptivas"],
    connectors:["PostgreSQL","BigQuery","Snowflake","Excel","Tableau"],
    commands:["/data:write-query","/data:clean-dataset","/data:find-anomalies"],
    whenPlugin:"Cuando el plugin ya conoce tu esquema de base de datos, tus convenciones de nombres y tus KPIs principales — sin que tengas que pegarle el schema en cada conversación.",
    whenSkill:"Si solo necesitas que Claude explique qué hace una query específica o te ayude a debuggear una consulta puntual." },
  { name:"Legal", icon:"⚖️", color:"#ff4d9e",
    tagline:"Revisión legal con tu propio semáforo",
    desc:"Analiza contratos cláusula por cláusula con el sistema VERDE/AMARILLO/ROJO personalizado de tu empresa, aplicando la normativa local específica que corresponda.",
    skills:["Revisar contratos cláusula por cláusula con semáforo propio","Aplicar normativa local específica como contexto permanente","Comparar versiones de un mismo contrato","Generar resumen ejecutivo de riesgos legales"],
    connectors:["SharePoint","Google Drive","DocuSign"],
    commands:["/legal:review-contract","/legal:comparar","/legal:resumen-ejecutivo"],
    whenPlugin:"Cuando tienes un flujo legal establecido con cláusulas críticas conocidas, formato de informe propio y normativa local — el plugin sabe todo eso de antemano y lo aplica consistentemente. Es como tener un abogado interno entrenado en tu empresa.",
    whenSkill:"Si quieres revisar un contrato puntual sin necesidad de contexto de empresa ni sistema de semáforos personalizado." },
  { name:"Marketing", icon:"📣", color:"#ff4d9e",
    tagline:"Contenido con voz de marca, siempre",
    desc:"Redacta contenido con el tono exacto de tu marca, planifica campañas, audita SEO con criterios específicos y gestiona lanzamientos. Sin recordarle cada vez cómo escribe tu empresa.",
    skills:["Escribir con tono y voz de marca interiorizada","Aplicar estructura de posts que ha funcionado históricamente","Auditar SEO con criterios y palabras clave del nicho","Generar variantes A/B de un mismo contenido"],
    connectors:["HubSpot","Mailchimp","Buffer","Google Analytics"],
    commands:["/marketing:post-linkedin","/marketing:seo-audit","/marketing:brief-campaña"],
    whenPlugin:"Cuando tu marca tiene voz definida y el plugin ya tiene interiorizada la guía de estilo, el historial de posts y los formatos que mejor funcionan — sin repetírselos en cada pedido.",
    whenSkill:"Si solo necesitas escribir un texto en tono amigable para una ocasión específica, sin identidad de marca particular." },
  { name:"Support", icon:"🎧", color:"#2dd4c7",
    tagline:"Tickets resueltos con contexto real",
    desc:"Resuelve tickets de soporte con historial completo del cliente, genera respuestas empáticas y técnicamente precisas, y escala los casos correctos con el contexto apropiado.",
    skills:["Leer historial completo del cliente antes de responder","Generar respuestas empáticas y técnicamente precisas","Detectar patrones de tickets que indican un bug mayor","Clasificar tickets por urgencia y tipo automáticamente"],
    connectors:["Zendesk","Intercom","Freshdesk","Salesforce Service"],
    commands:["/support:draft-reply","/support:escalate","/support:ticket-summary"],
    whenPlugin:"Cuando tu equipo atiende con SLA definidos y el plugin conoce los productos, las políticas de devolución y los criterios de escalación de tu empresa — reduce el tiempo de respuesta a segundos.",
    whenSkill:"Si solo quieres que Claude te ayude a redactar una respuesta empática para un caso puntual sin contexto de empresa." },
  { name:"Product", icon:"🧩", color:"#a855f7",
    tagline:"Del feedback a la hoja de ruta",
    desc:"Escribe PRDs con tu formato, construye roadmaps priorizados, analiza feedback de usuarios en volumen y prepara reuniones de producto con contexto real del sprint actual.",
    skills:["Transformar feedback cualitativo en insights accionables","Redactar PRDs con el formato y nivel de detalle de tu equipo","Preparar stand-ups con contexto del sprint actual","Priorizar el backlog con frameworks como RICE o ICE"],
    connectors:["Jira","Linear","Notion","Productboard"],
    commands:["/product:write-prd","/product:roadmap","/product:feedback-analysis"],
    whenPlugin:"Cuando gestionas un producto activamente y el plugin conoce tu metodología, tu formato de PRD, el estado del roadmap y las convenciones de tu equipo — sin re-contextualizar en cada conversación.",
    whenSkill:"Si solo necesitas ayuda puntual para redactar un documento o priorizar una lista sin contexto previo del producto." },
  { name:"Research", icon:"🔬", color:"#2ecc8a",
    tagline:"Síntesis de conocimiento a escala",
    desc:"Busca, filtra y sintetiza literatura académica, papers, reportes de industria y fuentes web en informes estructurados con el nivel de rigor que defines tú.",
    skills:["Buscar y filtrar fuentes por calidad y relevancia","Sintetizar múltiples papers en un resumen coherente","Identificar gaps, contradicciones y áreas de consenso","Generar bibliografía formateada automáticamente"],
    connectors:["Web","Google Scholar","PubMed","arXiv"],
    commands:["/research:summarize","/research:literature-review","/research:gap-analysis"],
    whenPlugin:"Cuando investigas de forma recurrente en un dominio y el plugin ya sabe qué bases de datos usar, qué criterios de calidad aplicar, el formato de tus reportes y el nivel de tecnicismo esperado.",
    whenSkill:"Si solo necesitas que Claude resuma un paper específico que le pasas directamente en una conversación puntual." },
];

const SCHEDULES = [
  { id:"reporte", title:"Reporte semanal automático", persona:"📊 Gerente de operaciones", freq:"Lunes · 7:30 AM", icon:"📅", color:"#6c77ff",
    config:"Cada lunes a las 7:30 AM, lee los archivos de la semana anterior en /Operaciones/KPIs, genera el reporte ejecutivo en Word y envíalo a gerencia@empresa.com.",
    steps:["⏰ 7:30 AM — Tarea activada automáticamente","📂 Leyendo /Operaciones/KPIs…","📊 Calculando: producción · calidad · incidencias","✍️ Redactando Reporte_Semana_19.docx con semáforos","📧 Enviando a gerencia@empresa.com","✅ Listo. Próxima: lunes 19 mayo"],
    output:"Reporte enviado a las 7:31 AM. Alerta: eficiencia línea 3 bajó 12%. El equipo llega informado.",
    valor:"45 minutos de trabajo cada lunes — ahora ocurren mientras el equipo duerme." },
  { id:"precios", title:"Monitoreo de precios", persona:"🛒 Tienda online", freq:"Diario · 8:00 AM", icon:"🔍", color:"#2dd4c7",
    config:"Cada día a las 8 AM, revisa los precios de 10 productos en 3 competidores. Si alguno baja >10%, guarda alerta en /Alertas/ y avísame por Slack.",
    steps:["⏰ 8:00 AM — Monitoreo iniciado","🌐 Revisando Competidor 1 (10 productos)…","🌐 Competidor 2 — baja del 15% detectada","🌐 Competidor 3 — sin cambios","⚠️ Producto A: $29.990 → $25.490 (-15%)","📄 Guardando en /Alertas/precio_alerta_hoy.txt","💬 Notificación a Slack","✅ Próxima: mañana 8:00 AM"],
    output:"1 alerta detectada. Sin esto, te habrías enterado 3 días después.",
    valor:"Reacción en horas, no en días. Sin revisar 3 sitios cada mañana." },
  { id:"correos", title:"Resumen diario de correos", persona:"👔 Ejecutivo/a", freq:"Días hábiles · 7:00 AM", icon:"📧", color:"#ffb547",
    config:"Cada día hábil a las 7 AM, revisa Gmail, clasifica correos por urgencia, redacta borradores para los urgentes y envíame resumen por WhatsApp.",
    steps:["⏰ 7:00 AM — Revisión iniciada","📧 Gmail: 47 correos nuevos en 24h","🔍 Clasificando: 6 alta · 18 media · 23 baja","✍️ Redactando borradores para 6 urgentes…","💾 Guardando 6 borradores en Gmail","📱 Enviando resumen por WhatsApp","✅ Próxima: mañana 7:00 AM"],
    output:"6 borradores listos — solo revisas y aprietas enviar. Los 23 de baja urgencia marcados para el viernes.",
    valor:"Llegas sabiendo qué necesita atención. Sin abrir la bandeja a ciegas." },
];

const QUIZ = [
  { q:"¿Cuál es la diferencia principal entre el chat de Claude y Cowork?", opts:["Cowork usa un modelo más inteligente","Cowork accede a archivos y ejecuta tareas completas, no solo responde","Cowork solo funciona con internet","Cowork es gratis y el chat cuesta dinero"], c:1, ex:"El chat responde. Cowork actúa: lee archivos, ejecuta pasos y entrega el resultado terminado." },
  { q:"¿Qué hace Cowork antes de ejecutar una tarea importante?", opts:["La ejecuta directamente sin avisar","Envía un correo de confirmación","Muestra el plan y espera tu aprobación","Pide tu contraseña de administrador"], c:2, ex:"Supervisión humana en el centro. Muestra el plan y espera que apruebes antes de actuar." },
  { q:"¿Qué es un plugin en Cowork?", opts:["Un virus que se instala en el computador","Un paquete con skills + conectores + comandos para un área específica","Una extensión de Chrome","Un archivo que reemplaza a Cowork"], c:1, ex:"Los plugins agrupan habilidades, conexiones a herramientas y comandos rápidos para un rol completo." },
  { q:"¿Cuántos plugins open-source lanzó Anthropic en enero 2026?", opts:["5","8","11","20"], c:2, ex:"11 plugins open-source el 30 de enero 2026, disponibles en GitHub para todos con plan pago." },
  { q:"¿En qué se diferencia Cowork de Claude Code?", opts:["Cowork es para programadores; Code para trabajo cotidiano","Cowork para trabajo cotidiano; Code para desarrolladores en terminal","Son exactamente lo mismo","Code es más nuevo que Cowork"], c:1, ex:"Claude Code vive en terminal para programadores. Cowork es interfaz visual para cualquier trabajador." },
  { q:"¿Qué diferencia hay entre una Skill y un Plugin?", opts:["Son lo mismo con distinto nombre","Skill = instrucción individual; Plugin = paquete completo con skills + conectores + comandos","Skills son de pago; plugins gratis","Plugin solo funciona online"], c:1, ex:"Skill es un ingrediente. Plugin es la receta completa que agrupa skills, conectores y comandos." },
  { q:"¿Para qué sirven las tareas programadas (Schedule)?", opts:["Para que Claude se actualice","Para ejecutar tareas automáticamente en horario fijo sin que el usuario esté presente","Para bloquear uso fuera del horario de oficina","Para programar videollamadas"], c:1, ex:"Defines una vez qué hacer y cuándo. Cowork lo ejecuta solo — mientras duermes." },
  { q:"¿Qué requisito técnico necesita el Schedule para funcionar?", opts:["Suscripción Enterprise","Conexión satelital","Computador encendido y Claude Desktop activo","Servidor en la nube"], c:2, ex:"El Schedule corre en tu escritorio. Si el computador está apagado, la tarea espera a la próxima ventana." },
  { q:"Con Plugin de Ventas instalado, ¿qué pasa al escribir /sales:call-prep Empresa X?", opts:["Claude abre videollamada con Empresa X","Claude pregunta qué sabe sobre Empresa X","Claude busca en CRM, revisa historial e investiga, entrega brief listo","Claude envía email automático"], c:2, ex:"Con plugin instalado, Claude ya sabe dónde buscar y qué formato entregar — actúa sin preguntar." },
  { q:"¿Qué tarea NO necesita conceder acceso a carpeta local?", opts:["Organizar 300 archivos en /Descargas","Informe desde 8 Excel en tu computador","Investigar en la web estudios sobre IA","Kit de onboarding desde /RRHH/Plantillas"], c:2, ex:"Investigación web no toca tu computador. Las otras tres requieren acceso a carpetas locales." },
];

/* ─── MODAL ─────────────────────────────────────────────────────────────────── */
function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,backdropFilter:"blur(6px)",padding:24 }}>
      <div onClick={e=>e.stopPropagation()} className="anim-fade" style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:32,width:wide?"860px":"560px",maxWidth:"calc(100vw - 48px)",maxHeight:"calc(100vh - 80px)",overflowY:"auto",position:"relative" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
          <h2 style={{ fontFamily:"var(--font-display)",fontSize:20,color:"var(--text)",fontWeight:700 }}>{title}</h2>
          <button onClick={onClose} style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,width:32,height:32,color:"var(--text2)",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── SECTION: QUÉ ES ───────────────────────────────────────────────────────── */
function QueEs() {
  const [modal, setModal] = useState(null);
  const [hov, setHov] = useState(null);

  return (
    <div className="anim-fade">
      <SectionTitle icon="🧭" title="¿Qué es Claude Cowork?" color="#6c77ff"
        sub="El asistente que no solo responde — que trabaja por ti" />

      {/* Hero analogy */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 48px 1fr",gap:16,alignItems:"stretch",marginBottom:32 }}>
        <ClickCard onClick={() => setModal("chat")} accent="#5c6480" glow={false}>
          <div style={{ fontSize:36,marginBottom:12 }}>💬</div>
          <div style={{ fontFamily:"var(--font-display)",fontWeight:700,color:"var(--text2)",fontSize:18,marginBottom:8 }}>Chat normal</div>
          <div style={{ fontSize:14,color:"var(--text3)",lineHeight:1.7,marginBottom:16 }}>Como pedirle a un colega que te <em>explique</em> cómo hacer algo. Tú ejecutas.</div>
          <div style={{ fontSize:11,color:"var(--indigo)",fontWeight:600,letterSpacing:1 }}>VER DETALLES →</div>
        </ClickCard>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"var(--border2)" }}>→</div>
        <ClickCard onClick={() => setModal("cowork")} accent="#6c77ff" glow>
          <div style={{ fontSize:36,marginBottom:12 }}>🤝</div>
          <div style={{ fontFamily:"var(--font-display)",fontWeight:700,color:"var(--indigo)",fontSize:18,marginBottom:8 }}>Claude Cowork</div>
          <div style={{ fontSize:14,color:"var(--text2)",lineHeight:1.7,marginBottom:16 }}>Como pedirle a un asistente que <em>haga la tarea</em> por ti. Él ejecuta, tú revisas.</div>
          <div style={{ fontSize:11,color:"var(--indigo)",fontWeight:600,letterSpacing:1 }}>VER DETALLES →</div>
        </ClickCard>
      </div>

      {/* Comparison table */}
      <Label>COMPARACIÓN DIRECTA</Label>
      <div style={{ borderRadius:14,overflow:"hidden",border:"1px solid var(--border)",marginBottom:24 }}>
        <div style={{ display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr",background:"var(--surface2)" }}>
          {["Característica","💬 Chat","🤝 Cowork"].map((h,i)=>(
            <div key={h} style={{ padding:"10px 16px",fontSize:11,fontWeight:700,letterSpacing:1,color:i===2?"var(--amber)":"var(--text3)" }}>{h}</div>
          ))}
        </div>
        {COMPARISONS.map(([f,c,w],i)=>(
          <div key={i} style={{ display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr",background:i%2===0?"var(--surface)":"var(--surface2)",borderTop:"1px solid var(--border)" }}>
            <div style={{ padding:"11px 16px",fontSize:13,fontWeight:600,color:"var(--text)" }}>{f}</div>
            <div style={{ padding:"11px 16px",fontSize:13,color:"var(--text3)" }}>{c}</div>
            <div style={{ padding:"11px 16px",fontSize:13,color:"var(--green)",fontWeight:500 }}>{w}</div>
          </div>
        ))}
      </div>

      <InfoPill icon="📋" color="var(--green)">
        Disponible en <strong>todos los planes pagos</strong> (Pro, Max, Team, Enterprise) desde Claude Desktop (macOS y Windows). Chat, Code y Cowork conviven en la misma app.
      </InfoPill>

      {/* Modals */}
      <Modal open={modal==="chat"} onClose={()=>setModal(null)} title="💬 Chat normal de Claude">
        <div style={{ display:"grid",gap:10 }}>
          {["Copias y pegas tu información manualmente","Da texto como resultado — tú ejecutas los pasos","Una pregunta, una respuesta en ese momento","Debes estar presente y activo durante toda la tarea","Sin acceso a tus archivos ni aplicaciones locales","Ningún paso es automático ni se puede programar"].map((p,i)=>(
            <div key={i} style={{ display:"flex",gap:12,padding:12,background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)" }}>
              <span style={{ color:"var(--text3)",fontSize:16,flexShrink:0 }}>—</span>
              <span style={{ fontSize:14,color:"var(--text2)",lineHeight:1.6 }}>{p}</span>
            </div>
          ))}
        </div>
      </Modal>
      <Modal open={modal==="cowork"} onClose={()=>setModal(null)} title="🤝 Claude Cowork">
        <div style={{ display:"grid",gap:10 }}>
          {["Lee y escribe directamente en tus carpetas locales","Entrega el documento, carpeta o informe terminado — no instrucciones","Múltiples pasos coordinados automáticamente en paralelo","Puedes alejarte y volver cuando el resultado esté listo","Conectado a Gmail, Slack, Notion, CRM y otras apps","Puede ejecutar tareas en horario programado sin que estés presente"].map((p,i)=>(
            <div key={i} style={{ display:"flex",gap:12,padding:12,background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border2)" }}>
              <span style={{ color:"var(--green)",fontSize:16,flexShrink:0 }}>✅</span>
              <span style={{ fontSize:14,color:"var(--text)",lineHeight:1.6 }}>{p}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

/* ─── SECTION: CÓMO FUNCIONA ────────────────────────────────────────────────── */
function ComoFunciona() {
  const [active, setActive] = useState(null);
  return (
    <div className="anim-fade">
      <SectionTitle icon="⚙️" title="¿Cómo funciona Cowork?" color="#2dd4c7"
        sub="El flujo completo desde que das la instrucción hasta el resultado. Haz click en cada paso." />
      <div style={{ display:"grid",gap:8,marginBottom:24 }}>
        {FLOW.map(step=>(
          <div key={step.n} onClick={()=>setActive(active===step.n?null:step.n)}
            style={{ background:"var(--surface)",border:`1px solid ${active===step.n?"var(--teal)":"var(--border)"}`,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all .2s" }}>
            <div style={{ display:"flex",alignItems:"center",gap:0 }}>
              <div style={{ width:52,minHeight:52,background:active===step.n?"var(--teal)":"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20,transition:"background .2s" }}>{step.icon}</div>
              <div style={{ flex:1,padding:"13px 18px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ background:"rgba(45,212,199,.15)",color:"var(--teal)",borderRadius:5,padding:"1px 7px",fontSize:10,fontWeight:700,letterSpacing:1 }}>PASO {step.n}</span>
                  <span style={{ fontFamily:"var(--font-display)",fontWeight:600,fontSize:14,color:"var(--text)" }}>{step.t}</span>
                  <span style={{ marginLeft:"auto",color:"var(--text3)",fontSize:14,transform:active===step.n?"rotate(180deg)":"none",transition:"transform .2s",display:"inline-block" }}>⌄</span>
                </div>
                {active===step.n&&(
                  <div style={{ marginTop:12 }} className="anim-fade">
                    <p style={{ fontSize:14,color:"var(--text2)",lineHeight:1.7,marginBottom:10 }}>{step.d}</p>
                    <div style={{ background:"rgba(45,212,199,.08)",border:"1px solid rgba(45,212,199,.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"var(--text)",fontStyle:"italic" }}>💡 {step.ex}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <InfoPill icon="🛡️" color="var(--green)">
        Diseñado con <strong>supervisión humana</strong>. Tú eliges qué carpetas puede acceder. Puedes redirigir o detener en cualquier momento. Nada irreversible ocurre sin tu conocimiento explícito.
      </InfoPill>
    </div>
  );
}

/* ─── SECTION: PERFILES ─────────────────────────────────────────────────────── */
function Perfiles() {
  const [active, setActive] = useState("estudiante");
  const p = PROFILES.find(x=>x.id===active);
  return (
    <div className="anim-fade">
      <SectionTitle icon="👥" title="Perfiles de uso" color="#ffb547"
        sub="¿Qué puede hacer Cowork para personas con necesidades distintas?" />
      <div style={{ display:"flex",gap:8,marginBottom:24,flexWrap:"wrap" }}>
        {PROFILES.map(pr=>(
          <button key={pr.id} onClick={()=>setActive(pr.id)}
            style={{ background:active===pr.id?pr.color:"var(--surface2)",color:active===pr.id?"#fff":"var(--text2)",border:`1px solid ${active===pr.id?pr.color:"var(--border)"}`,borderRadius:24,padding:"8px 20px",fontSize:13,fontWeight:active===pr.id?700:400,transition:"all .2s",fontFamily:"var(--font-body)" }}>
            {pr.icon} {pr.label}
          </button>
        ))}
      </div>
      {p&&(
        <div className="anim-fade" style={{ background:"var(--surface)",border:`1px solid ${p.color}44`,borderRadius:16,padding:28 }}>
          <div style={{ fontSize:40,marginBottom:10 }}>{p.icon}</div>
          <h3 style={{ fontFamily:"var(--font-display)",fontWeight:800,fontSize:20,color:p.color,marginBottom:24 }}>{p.label}</h3>
          <div style={{ display:"grid",gap:12 }}>
            {p.tasks.map((t,i)=>(
              <div key={i} style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:12,padding:18,display:"flex",gap:14 }}>
                <div style={{ background:p.color,color:"#fff",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0,marginTop:1 }}>{i+1}</div>
                <div>
                  <div style={{ fontFamily:"var(--font-display)",fontWeight:600,color:"var(--text)",fontSize:14,marginBottom:5 }}>{t.t}</div>
                  <div style={{ fontSize:13,color:"var(--text2)",lineHeight:1.6 }}><span style={{ color:p.color,fontWeight:600 }}>Cómo: </span>{t.h}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SECTION: DEMOS ────────────────────────────────────────────────────────── */
function Demos() {
  const [activeId, setActiveId] = useState("carpetas");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [folderState, setFolderState] = useState("idle");
  const demo = DEMOS.find(d=>d.id===activeId);

  const reset = ()=>{ setStep(-1);setRunning(false);setFolderState("idle"); };
  const select = id=>{ setActiveId(id);setStep(-1);setRunning(false);setFolderState("idle"); };
  const run = async()=>{
    setStep(-1);setRunning(true);
    if(demo.folder){ setFolderState("asking");await new Promise(r=>setTimeout(r,1200));setFolderState("granted");await new Promise(r=>setTimeout(r,600)); }
    for(let i=0;i<demo.steps.length;i++){await new Promise(r=>setTimeout(r,750));setStep(i);}
    setRunning(false);
  };

  return (
    <div className="anim-fade">
      <SectionTitle icon="🎬" title="Demos paso a paso" color="#ff4d9e"
        sub="Selecciona un escenario y presiona ▶ para simular la ejecución en tiempo real." />

      <div style={{ display:"flex",gap:8,marginBottom:10,flexWrap:"wrap" }}>
        <Tag color="var(--green)">🗂️ Con archivos: pide permiso primero</Tag>
        <Tag color="var(--teal)">🌐 Solo web: sin acceso a carpetas</Tag>
      </div>

      <div style={{ display:"flex",gap:8,marginBottom:24,flexWrap:"wrap" }}>
        {DEMOS.map(d=>(
          <button key={d.id} onClick={()=>select(d.id)}
            style={{ background:activeId===d.id?"linear-gradient(135deg,#ff4d9e,#ffb547)":"var(--surface2)",color:activeId===d.id?"#fff":"var(--text2)",border:`1px solid ${activeId===d.id?"transparent":"var(--border)"}`,borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:activeId===d.id?700:400,transition:"all .2s",fontFamily:"var(--font-body)",display:"flex",alignItems:"center",gap:6 }}>
            {d.title}
            {d.badge&&<span style={{ background:"rgba(255,82,82,.25)",color:"var(--red)",borderRadius:4,padding:"0 5px",fontSize:9,fontWeight:700 }}>{d.badge}</span>}
          </button>
        ))}
      </div>

      <div className="anim-fade" style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden" }}>
        <div style={{ background:"var(--surface2)",borderBottom:"1px solid var(--border)",padding:"16px 22px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"var(--font-display)",color:"var(--text)",fontWeight:700,fontSize:16 }}>{demo.title}</div>
            <div style={{ color:"var(--text3)",fontSize:12,marginTop:2 }}>{demo.persona}</div>
          </div>
          <span style={{ background:(demo.folder?"rgba(255,181,71,.15)":"rgba(45,212,199,.15)"),color:demo.folder?"var(--amber)":"var(--teal)",border:`1px solid ${demo.folder?"rgba(255,181,71,.3)":"rgba(45,212,199,.3)"}`,borderRadius:20,padding:"3px 12px",fontSize:11,fontWeight:700 }}>
            {demo.folder?"🗂️ Requiere carpeta":"🌐 Solo web"}
          </span>
        </div>
        <div style={{ padding:22 }}>
          <Label>INSTRUCCIÓN DEL USUARIO</Label>
          <div style={{ background:"rgba(108,119,255,.08)",border:"1px solid rgba(108,119,255,.2)",borderLeft:"4px solid var(--indigo)",borderRadius:10,padding:16,fontSize:14,color:"var(--text)",lineHeight:1.7,marginBottom:22,fontStyle:"italic" }}>
            💬 "{demo.input}"
          </div>
          <div style={{ display:"flex",gap:10,marginBottom:22 }}>
            <button onClick={run} disabled={running}
              style={{ background:running?"var(--surface3)":"var(--surface2)",color:running?"var(--text3)":"var(--text)",border:`1px solid ${running?"var(--border)":"var(--border2)"}`,borderRadius:10,padding:"10px 22px",fontSize:13,fontWeight:700,fontFamily:"var(--font-body)",transition:"all .2s",display:"flex",alignItems:"center",gap:8 }}>
              {running?<span style={{ animation:"spin 1s linear infinite",display:"inline-block" }}>⟳</span>:"▶"}
              {running?"Ejecutando…":"Simular ejecución"}
            </button>
            <button onClick={reset} style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 16px",fontSize:13,color:"var(--text2)",fontFamily:"var(--font-body)" }}>↺ Reiniciar</button>
          </div>

          {demo.folder&&folderState!=="idle"&&(
            <div className="anim-fade" style={{ marginBottom:16,border:`1px solid ${folderState==="granted"?"rgba(46,204,138,.4)":"rgba(255,181,71,.4)"}`,borderRadius:12,padding:16,background:folderState==="granted"?"rgba(46,204,138,.06)":"rgba(255,181,71,.06)",transition:"all .4s" }}>
              <div style={{ display:"flex",gap:12 }}>
                <span style={{ fontSize:22 }}>{folderState==="granted"?"✅":"🗂️"}</span>
                <div>
                  {folderState==="asking"&&<>
                    <div style={{ fontWeight:700,fontSize:13,color:"var(--amber)",marginBottom:5 }}>Cowork solicita permiso</div>
                    <div style={{ fontSize:13,color:"var(--text2)",fontStyle:"italic",marginBottom:10 }}>"{demo.folderQ}"</div>
                    <div style={{ display:"flex",gap:8 }}>
                      <span style={{ background:"var(--amber)",color:"#000",borderRadius:6,padding:"3px 12px",fontSize:11,fontWeight:700 }}>✓ Permitir</span>
                      <span style={{ background:"var(--surface3)",color:"var(--text3)",borderRadius:6,padding:"3px 12px",fontSize:11 }}>✗ Denegar</span>
                    </div>
                  </>}
                  {folderState==="granted"&&<>
                    <div style={{ fontWeight:700,fontSize:13,color:"var(--green)" }}>Acceso concedido por el usuario</div>
                    <div style={{ fontSize:12,color:"var(--text3)",marginTop:2 }}>{demo.folderA}</div>
                  </>}
                </div>
              </div>
            </div>
          )}

          {step>=0&&(
            <div style={{ marginBottom:16 }}>
              <Label>EJECUCIÓN EN TIEMPO REAL</Label>
              {demo.steps.map((s,i)=>(
                <div key={i} style={{ display:"flex",gap:10,padding:"8px 12px",borderRadius:8,marginBottom:3,background:i<=step?"rgba(46,204,138,.08)":"var(--surface2)",opacity:i<=step?1:.3,transition:"all .4s",border:`1px solid ${i<=step?"rgba(46,204,138,.2)":"transparent"}` }}>
                  <span style={{ fontSize:14 }}>{i<=step?"✅":"○"}</span>
                  <span style={{ fontSize:13,color:i<=step?"var(--green)":"var(--text3)" }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {step===demo.steps.length-1&&(
            <div className="anim-fade" style={{ background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:12,padding:18 }}>
              <div style={{ fontSize:11,color:"var(--text3)",marginBottom:6,fontWeight:700,letterSpacing:1 }}>RESULTADO ENTREGADO</div>
              <div style={{ fontSize:14,color:"var(--text)",lineHeight:1.7 }}>✅ {demo.output}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION: PLUGINS ─────────────────────────────────────────────────────── */
function Plugins() {
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [activeSection, setActiveSection] = useState("fundamentos");
  const plugin = PLUGINS.find(p=>p.name===selectedPlugin);

  const sections = [
    { id:"fundamentos", label:"Skill vs Plugin", icon:"🧠" },
    { id:"cuando", label:"¿Cuándo usar cuál?", icon:"🤔" },
    { id:"demos", label:"Sin vs Con plugin", icon:"🎬" },
    { id:"lista", label:"Los 11 plugins", icon:"📋" },
  ];

  return (
    <div className="anim-fade">
      <SectionTitle icon="🔌" title="Plugins de Cowork" color="#a855f7"
        sub="El sistema que convierte a Cowork en especialista de un área. Sección clave." />

      {/* Sub-nav */}
      <div style={{ display:"flex",gap:4,marginBottom:24,background:"var(--surface2)",borderRadius:12,padding:4,border:"1px solid var(--border)" }}>
        {sections.map(s=>(
          <button key={s.id} onClick={()=>setActiveSection(s.id)}
            style={{ flex:1,background:activeSection===s.id?"var(--purple)":"transparent",color:activeSection===s.id?"#fff":"var(--text2)",border:"none",borderRadius:8,padding:"8px 4px",fontSize:12,fontWeight:activeSection===s.id?700:400,fontFamily:"var(--font-body)",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {activeSection==="fundamentos"&&(
        <div className="anim-fade">
          <InfoPill icon="⚠️" color="var(--amber)">Esta es la confusión más frecuente entre usuarios nuevos. Son conceptos relacionados pero con propósito distinto.</InfoPill>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
            <div style={{ background:"var(--surface)",border:"1px solid rgba(255,181,71,.3)",borderRadius:14,padding:22 }}>
              <div style={{ fontSize:32,marginBottom:12 }}>🧠</div>
              <div style={{ fontFamily:"var(--font-display)",fontWeight:700,color:"var(--amber)",fontSize:17,marginBottom:10 }}>Skill (habilidad)</div>
              <p style={{ fontSize:14,color:"var(--text2)",lineHeight:1.7,marginBottom:14 }}>Un <strong style={{ color:"var(--text)" }}>archivo de instrucciones</strong> que le enseña a Claude cómo hacer algo específico. Se activa automáticamente cuando la situación es relevante.</p>
              <div style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"var(--text3)",fontStyle:"italic",lineHeight:1.6 }}>
                "Cuando redactes emails, usa tono formal, termina con firma corporativa y nunca uses emojis."
              </div>
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:11,color:"var(--text3)",fontWeight:700,letterSpacing:1,marginBottom:8 }}>ALCANCE</div>
                {["Instrucción puntual y específica","Se aplica automáticamente cuando corresponde","No requiere conectores ni comandos","Ideal para personalización simple"].map((t,i)=>(
                  <div key={i} style={{ display:"flex",gap:8,marginBottom:6,fontSize:13,color:"var(--text2)" }}><span style={{ color:"var(--amber)" }}>▸</span>{t}</div>
                ))}
              </div>
            </div>
            <div style={{ background:"var(--surface)",border:"1px solid rgba(168,85,247,.3)",borderRadius:14,padding:22 }}>
              <div style={{ fontSize:32,marginBottom:12 }}>🔌</div>
              <div style={{ fontFamily:"var(--font-display)",fontWeight:700,color:"var(--purple)",fontSize:17,marginBottom:10 }}>Plugin</div>
              <p style={{ fontSize:14,color:"var(--text2)",lineHeight:1.7,marginBottom:14 }}>Un <strong style={{ color:"var(--text)" }}>paquete completo para un rol</strong>. Dentro lleva: varias skills + conectores a herramientas + comandos de barra. Un "modo profesional" para un área.</p>
              <div style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"var(--text3)",fontStyle:"italic",lineHeight:1.6 }}>
                Plugin Ventas = skills de prospecting + CRM conectado + /sales:call-prep
              </div>
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:11,color:"var(--text3)",fontWeight:700,letterSpacing:1,marginBottom:8 }}>ALCANCE</div>
                {["Paquete completo para un rol o área","Skills + conectores + comandos juntos","Requiere instalación (un clic)","Ideal para trabajo recurrente especializado"].map((t,i)=>(
                  <div key={i} style={{ display:"flex",gap:8,marginBottom:6,fontSize:13,color:"var(--text2)" }}><span style={{ color:"var(--purple)" }}>▸</span>{t}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:12,padding:18,borderLeft:"4px solid var(--green)" }}>
            <span style={{ fontWeight:700,color:"var(--green)" }}>La clave: </span>
            <span style={{ fontSize:14,color:"var(--text2)",lineHeight:1.7 }}>Una Skill es un <em>ingrediente</em>. Un Plugin es la <em>receta completa</em>. El plugin agrupa varias skills, las conecta a tus herramientas y agrega comandos rápidos. Piensa en el plugin como un <strong style={{ color:"var(--text)" }}>empleado especialista que ya conoce tu empresa</strong> — no tienes que explicarle el contexto cada vez que empieza a trabajar.</span>
          </div>
        </div>
      )}

      {activeSection==="cuando"&&(
        <div className="anim-fade">
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
            <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:22 }}>
              <div style={{ fontFamily:"var(--font-display)",fontWeight:700,color:"var(--indigo)",fontSize:16,marginBottom:16 }}>Usa una <u>Skill</u> cuando…</div>
              {["La personalización es puntual y simple (tono, formato)","No usas herramientas externas conectadas","Es una tarea esporádica, no recurrente","No tienes procesos estandarizados en el área","La instrucción cabe en 2-3 líneas","Solo hablas con Claude sobre un tema una vez"].map((t,i)=>(
                <div key={i} style={{ display:"flex",gap:10,marginBottom:10,padding:"10px 12px",background:"var(--surface2)",borderRadius:8,fontSize:13,color:"var(--text2)" }}>
                  <span style={{ color:"var(--indigo)",flexShrink:0 }}>🔹</span>{t}
                </div>
              ))}
            </div>
            <div style={{ background:"var(--surface)",border:"1px solid rgba(168,85,247,.3)",borderRadius:14,padding:22 }}>
              <div style={{ fontFamily:"var(--font-display)",fontWeight:700,color:"var(--purple)",fontSize:16,marginBottom:16 }}>Usa un <u>Plugin</u> cuando…</div>
              {["Trabajas en un área de forma recurrente (ventas, legal…)","Tienes herramientas conectadas que Cowork debe conocer","Tu equipo tiene procesos y formatos estandarizados","Quieres comandos rápidos (/comando) para flujos frecuentes","Claude necesita contexto acumulado del dominio","Tienes más de 3 personas usando Cowork para lo mismo"].map((t,i)=>(
                <div key={i} style={{ display:"flex",gap:10,marginBottom:10,padding:"10px 12px",background:"var(--surface2)",borderRadius:8,border:"1px solid rgba(168,85,247,.15)",fontSize:13,color:"var(--text2)" }}>
                  <span style={{ color:"var(--purple)",flexShrink:0 }}>✦</span>{t}
                </div>
              ))}
            </div>
          </div>
          <InfoPill icon="💡" color="var(--green)">
            <strong>Regla práctica:</strong> si te encuentras explicando lo mismo a Claude más de 3 veces seguidas, necesitas un Plugin (o al menos una Skill). El plugin "recuerda" el contexto por ti — es lo más cerca que existe de un asistente que ya conoce tu empresa.
          </InfoPill>
        </div>
      )}

      {activeSection==="demos"&&(
        <div className="anim-fade">
          <p style={{ fontSize:14,color:"var(--text2)",marginBottom:20,lineHeight:1.7 }}>La forma más clara de entender un plugin es ver qué cambia cuando está instalado versus cuando no lo está. La diferencia no es menor — es estructural.</p>
          <div style={{ display:"grid",gap:14 }}>
            {[
              { icon:"💼",title:"Plugin de Ventas",color:"#ffb547",
                sin:'"Ayúdame a prepararme para una llamada con Empresa X." → Claude pregunta: ¿qué venden? ¿cuál es el objetivo? ¿tienes historial? Hay que explicarle todo desde cero cada vez — pierde tiempo de ambos.',
                con:'Escribes: /sales:call-prep Empresa X → Claude busca en el CRM, revisa historial de contactos, investiga la empresa en web y entrega un brief de llamada completo en 2 minutos. Sin una sola pregunta.',
                config:"CRM conectado · skill de investigación de empresas · skill de formato de brief · /sales:call-prep · /sales:follow-up · /sales:propuesta" },
              { icon:"⚖️",title:"Plugin Legal",color:"#ff4d9e",
                sin:'"Revisa este contrato." → Claude hace una revisión genérica con lo que sabe. No conoce tus cláusulas críticas, ni tu sistema de alertas, ni la normativa local. Cada revisión sale distinta.',
                con:'Escribes: /legal:review contrato.pdf → Análisis cláusula por cláusula con VERDE/AMARILLO/ROJO personalizado de tu empresa, aplica normativa chilena, entrega el informe en el formato exacto de tu equipo.',
                config:"Skill de revisión por cláusulas · semáforo personalizado · normativa local integrada · /legal:review · /legal:comparar · /legal:resumen-ejecutivo" },
              { icon:"📣",title:"Plugin Marketing",color:"#a855f7",
                sin:'"Escribe un post de LinkedIn." → Claude escribe algo genérico y correcto. No conoce el tono de tu marca, no aplica tu estructura de posts, no considera qué ha funcionado antes. Cada post suena diferente.',
                con:'Escribes: /marketing:post-linkedin lanzamiento X → Tono exacto de marca interiorizado, estructura de posts que históricamente tiene mejor engagement, hashtags de tu nicho, 3 versiones (formal/casual/provocador).',
                config:"Guía de voz y tono · biblioteca de posts anteriores como referencia · estructura probada · /marketing:post-linkedin · /marketing:seo-audit · /marketing:brief-campaña" },
            ].map(d=>(
              <div key={d.title} style={{ background:"var(--surface)",borderRadius:14,overflow:"hidden",border:"1px solid var(--border)" }}>
                <div style={{ background:`linear-gradient(135deg,var(--surface2),${d.color}22)`,borderBottom:"1px solid var(--border)",padding:"13px 20px",display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:22 }}>{d.icon}</span>
                  <span style={{ fontFamily:"var(--font-display)",fontWeight:700,color:"var(--text)",fontSize:15 }}>{d.title}</span>
                </div>
                <div style={{ padding:20 }}>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
                    <div style={{ background:"rgba(255,82,82,.06)",borderRadius:10,padding:14,border:"1px solid rgba(255,82,82,.2)" }}>
                      <div style={{ fontSize:10,fontWeight:700,color:"var(--red)",marginBottom:8,letterSpacing:1 }}>❌ SIN PLUGIN — lo que ocurre</div>
                      <div style={{ fontSize:13,color:"var(--text2)",lineHeight:1.7 }}>{d.sin}</div>
                    </div>
                    <div style={{ background:"rgba(46,204,138,.06)",borderRadius:10,padding:14,border:"1px solid rgba(46,204,138,.2)" }}>
                      <div style={{ fontSize:10,fontWeight:700,color:"var(--green)",marginBottom:8,letterSpacing:1 }}>✅ CON PLUGIN — lo que ocurre</div>
                      <div style={{ fontSize:13,color:"var(--text2)",lineHeight:1.7 }}>{d.con}</div>
                    </div>
                  </div>
                  <div style={{ background:`rgba(108,119,255,.08)`,borderRadius:8,padding:"8px 12px",fontSize:12,color:"var(--indigo)" }}>
                    <strong>Configurado dentro del plugin: </strong>{d.config}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection==="lista"&&(
        <div className="anim-fade">
          <p style={{ fontSize:13,color:"var(--text3)",marginBottom:16,fontStyle:"italic" }}>Lanzados el 30 ene 2026 · GitHub: anthropics/knowledge-work-plugins · Gratis, personalizables, un clic para instalar desde Cowork.</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20 }}>
            {PLUGINS.map(p=>(
              <button key={p.name} onClick={()=>setSelectedPlugin(selectedPlugin===p.name?null:p.name)}
                style={{ background:selectedPlugin===p.name?p.color+"22":"var(--surface)",border:`1px solid ${selectedPlugin===p.name?p.color+"66":"var(--border)"}`,borderRadius:12,padding:14,cursor:"pointer",textAlign:"left",transition:"all .2s",fontFamily:"var(--font-body)" }}>
                <div style={{ fontSize:22,marginBottom:8 }}>{p.icon}</div>
                <div style={{ fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:3 }}>{p.name}</div>
                <div style={{ fontSize:11,color:"var(--text3)",lineHeight:1.4 }}>{p.tagline}</div>
              </button>
            ))}
          </div>

          {plugin&&(
            <div className="anim-fade" style={{ background:"var(--surface)",border:`1px solid ${plugin.color}55`,borderRadius:16,padding:28 }}>
              <div style={{ display:"flex",alignItems:"flex-start",gap:16,marginBottom:22 }}>
                <div style={{ fontSize:44 }}>{plugin.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"var(--font-display)",fontWeight:800,fontSize:22,color:"var(--text)",marginBottom:3 }}>{plugin.name}</div>
                  <div style={{ fontSize:14,color:plugin.color,fontWeight:600,marginBottom:10 }}>{plugin.tagline}</div>
                  <p style={{ fontSize:14,color:"var(--text2)",lineHeight:1.7 }}>{plugin.desc}</p>
                </div>
                <button onClick={()=>setSelectedPlugin(null)} style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,width:32,height:32,color:"var(--text2)",fontSize:18,flexShrink:0 }}>×</button>
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20 }}>
                <div>
                  <Label>SKILLS INCLUIDAS</Label>
                  {plugin.skills.map((s,i)=>(
                    <div key={i} style={{ display:"flex",gap:8,marginBottom:8,padding:"8px 10px",background:"var(--surface2)",borderRadius:8,fontSize:13,color:"var(--text2)" }}>
                      <span style={{ color:plugin.color,flexShrink:0 }}>▸</span>{s}
                    </div>
                  ))}
                </div>
                <div>
                  <Label>CONECTORES</Label>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:20 }}>
                    {plugin.connectors.map(c=>(
                      <span key={c} style={{ background:plugin.color+"18",color:plugin.color,border:`1px solid ${plugin.color}44`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600 }}>{c}</span>
                    ))}
                  </div>
                  <Label>COMANDOS</Label>
                  {plugin.commands.map(c=>(
                    <code key={c} style={{ display:"block",marginBottom:5,fontSize:11,background:"var(--surface2)",color:plugin.color,borderRadius:6,padding:"4px 10px",border:`1px solid ${plugin.color}33` }}>{c}</code>
                  ))}
                </div>
                <div>
                  <div style={{ background:"rgba(46,204,138,.08)",border:"1px solid rgba(46,204,138,.25)",borderRadius:12,padding:16,marginBottom:12 }}>
                    <div style={{ fontSize:10,fontWeight:700,color:"var(--green)",letterSpacing:1,marginBottom:8 }}>✅ USA EL PLUGIN CUANDO…</div>
                    <div style={{ fontSize:13,color:"var(--text2)",lineHeight:1.7 }}>{plugin.whenPlugin}</div>
                  </div>
                  <div style={{ background:"rgba(255,181,71,.08)",border:"1px solid rgba(255,181,71,.25)",borderRadius:12,padding:16 }}>
                    <div style={{ fontSize:10,fontWeight:700,color:"var(--amber)",letterSpacing:1,marginBottom:8 }}>🧠 USA SOLO UNA SKILL CUANDO…</div>
                    <div style={{ fontSize:13,color:"var(--text2)",lineHeight:1.7 }}>{plugin.whenSkill}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── SECTION: SCHEDULE ─────────────────────────────────────────────────────── */
function Schedule() {
  const [active, setActive] = useState("reporte");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const sc = SCHEDULES.find(s=>s.id===active);
  const reset=()=>{setStep(-1);setRunning(false);};
  const select=id=>{setActive(id);setStep(-1);setRunning(false);};
  const run=async()=>{
    setStep(-1);setRunning(true);
    for(let i=0;i<sc.steps.length;i++){await new Promise(r=>setTimeout(r,780));setStep(i);}
    setRunning(false);
  };

  return (
    <div className="anim-fade">
      <SectionTitle icon="🗓️" title="Tareas programadas (Schedule)" color="#2ecc8a"
        sub="Cowork ejecuta tareas automáticamente en el horario que defines. Lo configuras una vez, se repite solo." />

      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:28 }}>
        {[["📝","Describes","Qué hacer, cuándo y con qué archivos o conectores."],["🔁","Frecuencia","Diario, semanal, mensual o días específicos."],["😴","Trabaja solo","Corre aunque no estés — incluso mientras duermes."],["📬","Resultado","Por correo, Slack, archivo o lo que configures."]].map(([ic,t,d])=>(
          <div key={t} style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:16 }}>
            <div style={{ fontSize:26,marginBottom:10 }}>{ic}</div>
            <div style={{ fontFamily:"var(--font-display)",fontWeight:600,fontSize:13,color:"var(--text)",marginBottom:5 }}>{t}</div>
            <div style={{ fontSize:12,color:"var(--text3)",lineHeight:1.5 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex",gap:8,marginBottom:20 }}>
        {SCHEDULES.map(s=>(
          <button key={s.id} onClick={()=>select(s.id)}
            style={{ background:active===s.id?s.color:"var(--surface2)",color:active===s.id?"#000":"var(--text2)",border:`1px solid ${active===s.id?s.color:"var(--border)"}`,borderRadius:12,padding:"9px 18px",fontSize:13,fontWeight:active===s.id?700:400,fontFamily:"var(--font-body)",transition:"all .2s" }}>
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden" }}>
        <div style={{ background:"var(--surface2)",borderBottom:"1px solid var(--border)",padding:"16px 22px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"var(--font-display)",color:"var(--text)",fontWeight:700,fontSize:16 }}>{sc.title}</div>
            <div style={{ color:"var(--text3)",fontSize:12,marginTop:2 }}>{sc.persona}</div>
          </div>
          <div style={{ background:sc.color+"22",border:`1px solid ${sc.color}55`,borderRadius:20,padding:"4px 14px",display:"flex",gap:6,alignItems:"center" }}>
            <span style={{ fontSize:13 }}>🔁</span>
            <span style={{ fontSize:12,fontWeight:700,color:sc.color }}>{sc.freq}</span>
          </div>
        </div>
        <div style={{ padding:22 }}>
          <Label>CONFIGURACIÓN</Label>
          <div style={{ background:`rgba(46,204,138,.06)`,border:"1px solid rgba(46,204,138,.2)",borderLeft:"4px solid var(--green)",borderRadius:10,padding:16,fontSize:14,color:"var(--text)",lineHeight:1.7,marginBottom:22,fontStyle:"italic" }}>
            💬 "{sc.config}"
          </div>
          <div style={{ display:"flex",gap:10,marginBottom:22 }}>
            <button onClick={run} disabled={running}
              style={{ background:running?"var(--surface3)":sc.color,color:running?"var(--text3)":"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:13,fontWeight:700,fontFamily:"var(--font-body)",transition:"all .2s" }}>
              {running?"⏳ Ejecutando…":"▶ Simular ejecución automática"}
            </button>
            <button onClick={reset} style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 16px",fontSize:13,color:"var(--text2)",fontFamily:"var(--font-body)" }}>↺</button>
          </div>

          {step>=0&&(
            <div style={{ marginBottom:16 }}>
              <Label>EJECUCIÓN AUTOMÁTICA</Label>
              {sc.steps.map((s,i)=>(
                <div key={i} style={{ display:"flex",gap:10,padding:"8px 12px",borderRadius:8,marginBottom:3,background:i<=step?"rgba(46,204,138,.08)":"var(--surface2)",opacity:i<=step?1:.3,transition:"all .4s" }}>
                  <span style={{ fontSize:14 }}>{i<=step?"✅":"○"}</span>
                  <span style={{ fontSize:13,color:i<=step?"var(--green)":"var(--text3)" }}>{s}</span>
                </div>
              ))}
            </div>
          )}
          {step===sc.steps.length-1&&(
            <div className="anim-fade">
              <div style={{ background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:12,padding:18,marginBottom:10 }}>
                <Label>RESULTADO AUTOMÁTICO</Label>
                <div style={{ fontSize:14,color:"var(--text)",lineHeight:1.7 }}>✅ {sc.output}</div>
              </div>
              <div style={{ background:sc.color+"12",border:`1px solid ${sc.color}33`,borderRadius:10,padding:"12px 16px",fontSize:13,color:"var(--text2)" }}>
                <strong style={{ color:sc.color }}>💡 Por qué importa: </strong>{sc.valor}
              </div>
            </div>
          )}
        </div>
      </div>

      <InfoPill icon="⚠️" color="var(--amber)">
        Requisito técnico: el computador debe estar <strong>encendido y Claude Desktop activo</strong> para que el Schedule corra automáticamente.
      </InfoPill>
    </div>
  );
}

/* ─── SECTION: QUIZ ─────────────────────────────────────────────────────────── */
function Quiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = QUIZ.filter((q,i)=>answers[i]===q.c).length;
  return (
    <div className="anim-fade">
      <SectionTitle icon="🧠" title="Quiz de comprensión" color="#ff5252"
        sub={`${QUIZ.length} preguntas para verificar que dominas los conceptos antes de enseñarlos.`} />
      {QUIZ.map((q,qi)=>{
        const correct=answers[qi]===q.c;
        return (
          <div key={qi} style={{ background:"var(--surface)",border:`1px solid ${submitted?(correct?"rgba(46,204,138,.5)":"rgba(255,82,82,.5)"):"var(--border)"}`,borderRadius:14,padding:22,marginBottom:12 }}>
            <div style={{ display:"flex",gap:10,alignItems:"flex-start",marginBottom:16 }}>
              <span style={{ background:"rgba(255,82,82,.15)",color:"var(--red)",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,letterSpacing:1,flexShrink:0,marginTop:2 }}>Q{qi+1}</span>
              <span style={{ fontFamily:"var(--font-display)",fontWeight:600,fontSize:15,color:"var(--text)",lineHeight:1.5 }}>{q.q}</span>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              {q.opts.map((opt,oi)=>{
                let bg="var(--surface2)",border2="1px solid var(--border)",col="var(--text2)";
                if(submitted){
                  if(oi===q.c){bg="rgba(46,204,138,.12)";border2="1px solid rgba(46,204,138,.5)";col="var(--green)";}
                  else if(answers[qi]===oi){bg="rgba(255,82,82,.12)";border2="1px solid rgba(255,82,82,.5)";col="var(--red)";}
                }else if(answers[qi]===oi){bg="rgba(108,119,255,.12)";border2="1px solid rgba(108,119,255,.5)";col="var(--indigo)";}
                return (
                  <button key={oi} onClick={()=>!submitted&&setAnswers({...answers,[qi]:oi})}
                    style={{ background:bg,border:border2,borderRadius:10,padding:"10px 14px",cursor:submitted?"default":"pointer",textAlign:"left",fontSize:13,color:col,fontFamily:"var(--font-body)",transition:"all .2s",lineHeight:1.5 }}>
                    {submitted&&oi===q.c?"✅ ":submitted&&answers[qi]===oi&&oi!==q.c?"❌ ":""}{opt}
                  </button>
                );
              })}
            </div>
            {submitted&&(
              <div className="anim-fade" style={{ marginTop:12,background:"rgba(46,204,138,.08)",border:"1px solid rgba(46,204,138,.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"var(--green)",lineHeight:1.6 }}>
                💡 {q.ex}
              </div>
            )}
          </div>
        );
      })}
      {!submitted?(
        <button onClick={()=>setSubmitted(true)} disabled={Object.keys(answers).length<QUIZ.length}
          style={{ background:Object.keys(answers).length<QUIZ.length?"var(--surface2)":"var(--red)",color:Object.keys(answers).length<QUIZ.length?"var(--text3)":"#fff",border:"none",borderRadius:12,padding:"14px 0",cursor:Object.keys(answers).length<QUIZ.length?"not-allowed":"pointer",fontSize:15,fontWeight:700,fontFamily:"var(--font-body)",width:"100%",transition:"all .2s" }}>
          Verificar respuestas ({Object.keys(answers).length}/{QUIZ.length})
        </button>
      ):(
        <div className="anim-fade" style={{ background:"var(--surface)",border:`2px solid ${score===QUIZ.length?"var(--green)":score>=7?"var(--amber)":"var(--red)"}`,borderRadius:16,padding:32,textAlign:"center" }}>
          <div style={{ fontSize:56,marginBottom:10 }}>{score===QUIZ.length?"🏆":score>=7?"👍":"📚"}</div>
          <div style={{ fontFamily:"var(--font-display)",fontSize:40,fontWeight:900,color:score===QUIZ.length?"var(--green)":score>=7?"var(--amber)":"var(--red)" }}>{score} / {QUIZ.length}</div>
          <div style={{ fontSize:16,color:"var(--text2)",margin:"10px 0 24px" }}>{score===QUIZ.length?"Perfecto. Dominas Cowork. Listo para enseñarlo.":score>=7?"Buen dominio. Revisa las preguntas incorrectas.":"Conviene repasar las secciones anteriores."}</div>
          <button onClick={()=>{setSubmitted(false);setAnswers({});}} style={{ background:"var(--surface2)",color:"var(--text)",border:"1px solid var(--border2)",borderRadius:10,padding:"10px 28px",cursor:"pointer",fontSize:14,fontFamily:"var(--font-body)" }}>Reintentar</button>
        </div>
      )}
    </div>
  );
}

/* ─── MICRO COMPONENTS ──────────────────────────────────────────────────────── */
function SectionTitle({ icon, title, color, sub }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
        <span style={{ fontSize:26 }}>{icon}</span>
        <h2 style={{ fontFamily:"var(--font-display)",fontSize:28,fontWeight:800,color:"var(--text)",letterSpacing:"-0.5px",margin:0 }}>{title}</h2>
      </div>
      {sub&&<p style={{ fontSize:14,color:"var(--text3)",marginLeft:36 }}>{sub}</p>}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize:10,fontWeight:700,letterSpacing:1.5,color:"var(--text3)",marginBottom:8,fontFamily:"var(--font-display)" }}>{children}</div>;
}

function Tag({ children, color }) {
  return (
    <span style={{ background:color+"18",border:`1px solid ${color}44`,borderRadius:8,padding:"4px 10px",fontSize:11,color,fontWeight:600 }}>{children}</span>
  );
}

function InfoPill({ icon, color, children }) {
  return (
    <div style={{ background:color+"10",border:`1px solid ${color}33`,borderRadius:12,padding:"12px 16px",display:"flex",gap:10,alignItems:"flex-start",marginBottom:16,marginTop:8 }}>
      <span style={{ fontSize:18,flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:13,color:"var(--text2)",lineHeight:1.6 }}>{children}</span>
    </div>
  );
}

function ClickCard({ children, onClick, accent, glow }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"var(--surface)",border:`1px solid ${hov?accent+"88":"var(--border)"}`,borderRadius:16,padding:24,cursor:"pointer",transition:"all .2s",boxShadow:hov&&glow?`0 0 24px ${accent}33`:"none" }}>
      {children}
    </div>
  );
}

/* ─── APP ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("que-es");
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [active]);

  const sections = { "que-es":<QueEs/>, "como":<ComoFunciona/>, "perfiles":<Perfiles/>, "demos":<Demos/>, "plugins":<Plugins/>, "schedule":<Schedule/>, "quiz":<Quiz/> };
  const cur = NAV.find(n=>n.id===active);

  return (
    <>
      <FontLink />
      <div style={{ display:"flex",height:"100vh",width:"100vw",background:"var(--bg)",fontFamily:"var(--font-body)",overflow:"hidden" }}>

        {/* SIDEBAR */}
        <div style={{ width:220,flexShrink:0,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",height:"100vh" }}>
          {/* Logo */}
          <div style={{ padding:"24px 20px 20px",borderBottom:"1px solid var(--border)" }}>
            <div style={{ fontFamily:"var(--font-display)",fontSize:15,fontWeight:800,color:"var(--text)",lineHeight:1.3 }}>
              Claude <span style={{ background:"var(--grad)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Cowork</span>
            </div>
            <div style={{ fontSize:10,color:"var(--text3)",marginTop:3,letterSpacing:1 }}>GUÍA DEL INSTRUCTOR</div>
          </div>

          {/* Nav */}
          <nav style={{ flex:1,padding:"12px 10px",overflowY:"auto" }}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setActive(n.id)}
                style={{ width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:active===n.id?"var(--surface2)":"transparent",cursor:"pointer",textAlign:"left",marginBottom:2,transition:"all .15s",fontFamily:"var(--font-body)",position:"relative" }}>
                {active===n.id&&<div style={{ position:"absolute",left:0,top:"20%",bottom:"20%",width:3,background:n.color,borderRadius:"0 3px 3px 0" }}/>}
                <span style={{ fontSize:16,flexShrink:0 }}>{n.icon}</span>
                <span style={{ fontSize:13,fontWeight:active===n.id?700:400,color:active===n.id?"var(--text)":"var(--text2)" }}>{n.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding:"16px 20px",borderTop:"1px solid var(--border)" }}>
            <div style={{ fontSize:10,color:"var(--text3)",lineHeight:1.5 }}>Anthropic · Mayo 2026<br/>11 plugins disponibles</div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div ref={mainRef} style={{ flex:1,overflowY:"auto",height:"100vh" }}>
          {/* Top bar */}
          <div style={{ position:"sticky",top:0,background:"var(--bg)",borderBottom:"1px solid var(--border)",padding:"14px 36px",display:"flex",alignItems:"center",gap:12,zIndex:10,backdropFilter:"blur(10px)" }}>
            <span style={{ fontSize:20 }}>{cur?.icon}</span>
            <span style={{ fontFamily:"var(--font-display)",fontWeight:700,fontSize:16,color:"var(--text)" }}>{cur?.label}</span>
            <div style={{ marginLeft:"auto",display:"flex",gap:6 }}>
              {NAV.map(n=>(
                <div key={n.id} onClick={()=>setActive(n.id)}
                  style={{ width:6,height:6,borderRadius:"50%",background:active===n.id?n.color:"var(--border2)",cursor:"pointer",transition:"all .2s",transform:active===n.id?"scale(1.4)":"scale(1)" }}/>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding:"36px 48px 60px",maxWidth:900,margin:"0 auto" }}>
            {sections[active]}
          </div>
        </div>
      </div>
    </>
  );
}
