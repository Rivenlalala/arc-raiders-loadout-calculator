import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function arcRaidersDataPlugin() {
  const itemsModuleId = 'virtual:arcraiders-items';
  const resolvedItemsId = '\0' + itemsModuleId;
  const hideoutModuleId = 'virtual:arcraiders-hideout';
  const resolvedHideoutId = '\0' + hideoutModuleId;

  return {
    name: 'arcraiders-data',
    resolveId(id: string) {
      if (id === itemsModuleId) return resolvedItemsId;
      if (id === hideoutModuleId) return resolvedHideoutId;
    },
    load(id: string) {
      if (id === resolvedItemsId) {
        const itemsDir = path.resolve(__dirname, 'node_modules/arcraiders-data/items');
        const files = fs.readdirSync(itemsDir).filter((f: string) => f.endsWith('.json'));
        const items = files.map((f: string) => JSON.parse(fs.readFileSync(path.join(itemsDir, f), 'utf-8')));
        return `export default ${JSON.stringify(items)};`;
      }
      if (id === resolvedHideoutId) {
        const hideoutDir = path.resolve(__dirname, 'node_modules/arcraiders-data/hideout');
        const files = fs.readdirSync(hideoutDir).filter((f: string) => f.endsWith('.json'));
        const data: Record<string, unknown> = {};
        for (const f of files) {
          const parsed = JSON.parse(fs.readFileSync(path.join(hideoutDir, f), 'utf-8'));
          data[parsed.id] = parsed;
        }
        return `export default ${JSON.stringify(data)};`;
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), arcRaidersDataPlugin()],
});
