import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = resolve(__dirname, '../data/providers.json');
const data = JSON.parse(readFileSync(filePath, 'utf8'));

let fixed = 0;
for (const p of data.providers) {
  // Fix bestFor -> targetAudience
  if (p.bestFor && !p.targetAudience) {
    p.targetAudience = p.bestFor;
    delete p.bestFor;
    fixed++;
  }
  // Fix assetsUnderCustody -> aum
  if (p.assetsUnderCustody && !p.aum) {
    p.aum = p.assetsUnderCustody;
    delete p.assetsUnderCustody;
    fixed++;
  }
  // Fix minimumInvestment -> minAccount
  if (p.minimumInvestment && !p.minAccount) {
    p.minAccount = p.minimumInvestment;
    delete p.minimumInvestment;
    fixed++;
  }
  // Fix custodyModel -> keyManagement
  if (p.custodyModel && !p.keyManagement) {
    p.keyManagement = p.custodyModel;
    delete p.custodyModel;
    fixed++;
  }
  // Remove custodyTypeLabel extra field if wrong
  // Ensure all required fields exist
  if (!p.targetAudience) { p.targetAudience = []; console.log('WARN: no targetAudience for', p.id); }
  if (!p.aum) { p.aum = 'Not disclosed'; console.log('WARN: no aum for', p.id); }
  if (!p.minAccount) { p.minAccount = 'Contact provider'; console.log('WARN: no minAccount for', p.id); }
  if (!p.keyManagement) { p.keyManagement = p.security?.keyManagementType || 'Not specified'; console.log('WARN: no keyManagement for', p.id); }
  if (!p.features) { p.features = []; console.log('WARN: no features for', p.id); }
  if (!p.pros) { p.pros = []; console.log('WARN: no pros for', p.id); }
  if (!p.cons) { p.cons = []; console.log('WARN: no cons for', p.id); }
}

writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
console.log(`Fixed ${fixed} field mappings across ${data.providers.length} providers`);
