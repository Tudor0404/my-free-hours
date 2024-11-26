import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

export async function json<T>(data: T, init?: ResponseInit): Promise<Response> {
	const body = JSON.stringify(data);

	// Ensure headers exist
	if (!init?.headers) init = { headers: {} };
	const headers = new Headers(init.headers);
	headers.set('Content-Type', 'application/json');

	// Compress the response body
	const compressedBody = await gzipAsync(body);

	headers.set('Content-Encoding', 'gzip');

	return new Response(compressedBody, { ...init, headers });
}
