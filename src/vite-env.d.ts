/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** WhatsApp business number, digits only (see .env.example). Optional. */
  readonly VITE_WHATSAPP_NUMBER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
