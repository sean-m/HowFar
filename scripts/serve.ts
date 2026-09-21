const port = Number(Deno.env.get('PORT') ?? 8000);
const files = new Map([
  ['/', { path: '../dist/index.html', contentType: 'text/html; charset=utf-8' }],
  ['/index.html', { path: '../dist/index.html', contentType: 'text/html; charset=utf-8' }],
  ['/app.js', { path: '../dist/app.js', contentType: 'text/javascript; charset=utf-8' }],
]);

Deno.serve({ port }, async (request) => {
  const file = files.get(new URL(request.url).pathname);

  if (file === undefined) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const content = await Deno.readFile(new URL(file.path, import.meta.url));

    return new Response(content, {
      headers: { 'content-type': file.contentType },
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response('Run "deno task build" before serving the app.', { status: 503 });
    }

    throw error;
  }
});
