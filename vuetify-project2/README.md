# Sistema de Votacions en Temps Real

Aquest projecte implementa un sistema de votacions interactiu utilitzant Vue 3, Pinia, WebSockets, i està preparat per desplegar-se amb Docker i Electron.

## Estructura del Projecte

- **/client**: Aplicació Frontend feta amb Vue 3 + Vuetify.
- **/server**: Servidor Backend Node.js per gestionar WebSockets.

## Requisits Previs

- Node.js (v18+)
- Docker i Docker Compose (opcional per containerització)

## Instal·lació i Execució (Sense Docker)

### Backend

1. Navega a la carpeta del servidor:
   ```bash
   cd server
   ```
2. Instal·la les dependències:
   ```bash
   npm install
   ```
3. Executa el servidor (per defecte al port 3000):
   ```bash
   npm run dev
   ```

### Frontend

1. Navega a la carpeta del client:
   ```bash
   cd client
   ```
2. Instal·la les dependències:
   ```bash
   npm install
   ```
3. Executa l'aplicació en mode desenvolupament:
   ```bash
   npm run dev
   ```
4. Obre el navegador a la URL indicada (habitualment `http://localhost:3000` o `http://localhost:5173`).

### Electron

Per executar l'aplicació com a escriptori amb Electron (assegura't que el servidor de desenvolupament frontend està actiu):

```bash
cd client
npm run electron
```

## Execució amb Docker

El fitxer `docker-compose.yml` permet aixecar tot l'entorn (client + servidor) amb hot-reload.

1. Des de l'arrel del projecte (`vuetify-project2`):
   ```bash
   docker-compose up --build
   ```
2. Accedeix a l'aplicació a: `http://localhost:8080`.

## Funcionalitats

- **Login Simulat**: Usuari `user`, Contrasenya `123`.
- **Votacions en Temps Real**: Els vots es sincronitzen instantàniament entre tots els clients connectats via WebSockets.
- **Persistència**: Els vots es guarden en un fitxer JSON al servidor.
- **Gràfics**: Visualització dinàmica dels resultats.
