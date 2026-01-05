/**
 * Environment Variables Loader
 *
 * Loads .env.local for seed scripts running with tsx
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Export for confirmation
export const envLoaded = true;
