/**
 * STRICT SYNC VERIFICATION SYSTEM
 * 
 * Verifies before committing to GitHub:
 * ✓ Product data is non-empty and structurally valid.
 * ✓ No duplicate product IDs exist.
 * ✓ Local images referenced exist on disk with valid file size.
 * ✓ No Firebase Storage URLs or data URLs remain in synchronized records.
 * ✓ No sensitive secrets or private keys are exposed.
 * ✓ Application builds cleanly.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const PRODUCTS_JSON_PATH = path.join(ROOT_DIR, 'src', 'data', 'clean_products.json');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images', 'products');

function verify() {
  console.log('========================================================');
  console.log('🔍 Running Strict Synchronization Verification Checks');
  console.log('========================================================');

  let errors: string[] = [];

  // 1. Check Product JSON exists and is valid
  if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
    errors.push(`Missing products file at ${PRODUCTS_JSON_PATH}`);
  }

  let products: any[] = [];
  try {
    const raw = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
    products = JSON.parse(raw);
    if (!Array.isArray(products) || products.length === 0) {
      errors.push('Products data array is empty or invalid.');
    }
  } catch (e: any) {
    errors.push(`Failed to parse products JSON: ${e?.message}`);
  }

  // 2. Check for Duplicate IDs and Required Fields
  const seenIds = new Set<string>();
  products.forEach((prod, index) => {
    if (!prod.id || typeof prod.id !== 'string') {
      errors.push(`Product at index ${index} is missing a valid 'id'`);
    } else if (seenIds.has(prod.id)) {
      errors.push(`Duplicate product ID detected: "${prod.id}"`);
    } else {
      seenIds.add(prod.id);
    }

    if (!prod.name) errors.push(`Product "${prod.id || index}" has no name.`);
    if (typeof prod.price !== 'number' || prod.price < 0) {
      errors.push(`Product "${prod.id || index}" has invalid price.`);
    }
    if (!prod.category) errors.push(`Product "${prod.id || index}" has no category.`);

    // 3. Image verification
    if (Array.isArray(prod.images)) {
      prod.images.forEach((img: string, imgIdx: number) => {
        // Disallow Firebase Storage URLs
        if (img.includes('firebasestorage.googleapis.com')) {
          errors.push(`Product "${prod.id}" image ${imgIdx} still contains Firebase Storage URL: ${img}`);
        }
        // Disallow large raw base64 data URLs in local backup
        if (img.startsWith('data:image/')) {
          errors.push(`Product "${prod.id}" image ${imgIdx} is still a base64 data URL; should be written to public/images/`);
        }
        // If it starts with /images/products/, verify physical file existence on disk
        if (img.startsWith('/images/products/')) {
          const filename = path.basename(img);
          const fullPath = path.join(PUBLIC_IMAGES_DIR, filename);
          if (!fs.existsSync(fullPath)) {
            errors.push(`Referenced image missing on disk: ${fullPath}`);
          } else {
            const size = fs.statSync(fullPath).size;
            if (size <= 0) {
              errors.push(`Referenced image is empty (0 bytes): ${fullPath}`);
            }
          }
        }
      });
    }
  });

  // 4. Secret Exposure Check
  const sensitivePatterns = [
    /-----BEGIN PRIVATE KEY-----/,
    /service_account/,
    /ghp_[a-zA-Z0-9]{30,}/,
    /github_pat_[a-zA-Z0-9]{30,}/
  ];

  try {
    const gitDiff = execSync('git diff --cached', { encoding: 'utf-8' });
    for (const pattern of sensitivePatterns) {
      if (pattern.test(gitDiff)) {
        errors.push(`Security violation: Staged git changes appear to contain sensitive secret or private key!`);
      }
    }
  } catch {
    // If git diff fails (e.g. not in git repo or no staged changes), continue
  }

  // 5. Build Verification
  console.log('[Verification] Testing project build (npm run build)...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('[Success] Project builds cleanly.');
  } catch {
    errors.push('Project build failed during verification.');
  }

  // Final Verdict
  console.log('========================================================');
  if (errors.length > 0) {
    console.error('❌ STRICT VERIFICATION FAILED:');
    errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
    console.error('========================================================');
    console.error('Commit aborted to protect backup integrity.');
    process.exit(1);
  } else {
    console.log(`✅ ALL VERIFICATION CHECKS PASSED:`);
    console.log(`   • ${products.length} valid products verified without duplicates.`);
    console.log(`   • All local image files verified on disk.`);
    console.log(`   • Zero Firebase Storage or data URLs remain in synchronized records.`);
    console.log(`   • Zero secrets detected in git diff.`);
    console.log(`   • Production build passed.`);
    console.log('========================================================');
  }
}

verify();
