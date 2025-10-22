import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

// Lazily initialize the postgres client so module load doesn't fail
// if the environment variable is missing or the DB is unavailable.
let _sql: ReturnType<typeof postgres> | null = null;
function getSql() {
  if (!_sql) {
    // Accept POSTGRES_URL (preferred) or DATABASE_URL (common on some platforms)
    const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!postgresUrl) {
      throw new Error(
        'Missing database connection string. Set POSTGRES_URL (preferred) or DATABASE_URL in the environment.'
      );
    }
    // Allow disabling SSL for local development. Set POSTGRES_SSL=false to disable.
    const isLocalhost = /^(postgres(?:ql)?:)?\/\/(localhost|127\.0\.0\.1)/.test(postgresUrl);
    const forceSsl = process.env.POSTGRES_SSL !== 'false' && !isLocalhost;
    _sql = postgres(postgresUrl, forceSsl ? { ssl: 'require' } : {});
  }
  return _sql;
}

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
     await new Promise((resolve) => setTimeout(resolve, 3000));

  const db = getSql();
  const data = (await db`SELECT * FROM revenue`) as Revenue[];

     console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    // Fetch the last 5 invoices, sorted by date
    const db = getSql();
    const data = (await db`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`) as LatestInvoiceRaw[];

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
  const db = getSql();
  const invoiceCountPromise = db`SELECT COUNT(*) FROM invoices`;
  const customerCountPromise = db`SELECT COUNT(*) FROM customers`;
  const invoiceStatusPromise = db`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const db = getSql();
    const invoices = (await db`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `) as InvoicesTable[];

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
  const db = getSql();
  const data = await db`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    console.log('Fetching invoice with id:', id);
    // Ensure a DB URL is available (accept DATABASE_URL as a fallback)
    const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!postgresUrl) {
      const msg = 'Missing database connection string. Set POSTGRES_URL or DATABASE_URL in the environment.';
      console.error(msg);
      throw new Error(msg);
    }

    const db = getSql();
    const data = (await db`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `) as InvoiceForm[];

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error in fetchInvoiceById:', error);
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch invoice. ${detail}`);
  }
}

export async function fetchCustomers() {
  try {
    const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!postgresUrl) {
      const msg = 'Missing database connection string. Set POSTGRES_URL or DATABASE_URL in the environment.';
      console.error(msg);
      throw new Error(msg);
    }
    const db = getSql();
    const customers = (await db`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `) as CustomerField[];

    return customers;
  } catch (err) {
    console.error('Database Error in fetchCustomers:', err);
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to fetch all customers. ${detail}`);
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const db = getSql();
    const data = (await db`
    SELECT
      customers.id,
      customers.name,
      customers.email,
      customers.image_url,
      COUNT(invoices.id) AS total_invoices,
      SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
      SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
    FROM customers
    LEFT JOIN invoices ON customers.id = invoices.customer_id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
    GROUP BY customers.id, customers.name, customers.email, customers.image_url
    ORDER BY customers.name ASC
    `) as CustomersTableType[];

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
