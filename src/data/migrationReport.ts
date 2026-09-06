import auditData from '../../migration_audit_report.json';

export interface AuditMetric {
  expected: number;
  migrated: number;
  status: 'PASS' | 'FAIL' | 'NEEDS_REVIEW';
}

export interface ProductAuditItem {
  id: string;
  sourceId: number | string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  variantsCount: number;
  sourceVariantsCount: number;
  imagesCount: number;
  sourceImagesCount: number;
  primaryImage: string;
  collections: string[];
  category: string;
  available: boolean;
  status: 'PASS' | 'FAIL' | 'NEEDS_REVIEW';
  failedFields?: Array<{ field: string; expected: any; actual: any; reason: string }>;
}

export interface MigrationAuditReport {
  timestamp: string;
  sourceUrl: string;
  targetUrl: string;
  overallStatus: 'PASS' | 'FAIL' | 'NEEDS_REVIEW';
  metrics: {
    products: AuditMetric;
    variants: AuditMetric;
    images: AuditMetric;
    categories: AuditMetric;
    collections: AuditMetric;
    videos: AuditMetric;
    pricingVerification: {
      totalChecks: number;
      mismatches: number;
      status: 'PASS' | 'FAIL';
    };
    imageOrderingVerification: {
      totalChecks: number;
      mismatches: number;
      status: 'PASS' | 'FAIL';
    };
  };
  categoriesAudit: Array<{ name: string; slug: string; productCount: number }>;
  collectionsAudit: Array<{ name: string; slug: string; productCount: number; sourceProductCount: number; status: 'PASS' | 'FAIL' }>;
  productAudits: ProductAuditItem[];
}

export const MIGRATION_REPORT: MigrationAuditReport = auditData as unknown as MigrationAuditReport;
